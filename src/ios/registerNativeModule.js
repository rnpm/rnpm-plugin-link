const xcode = require('xcode');
const fs = require('fs');
const path = require('path');
const PbxFile = require('xcode/lib/pbxFile');
const union = require('lodash.union');
const glob = require('glob');

const GLOB_EXCLUDE_PATTERN = ['node_modules/**', 'Examples/**', 'examples/**'];

/**
 * Returns last item from an array
 */
const lastItem = (array) => array[array.length - 1];

/**
 * Given an array of libraries already imported and packageName that will be
 * added, returns true or false depending on whether the library is already linked
 * or not
 */
const hasLibraryImported = (libraries, packageName) => {
  return libraries.children.filter(library => library.comment === packageName).length > 0;
};

/**
 * Given xcodeproj it returns list of products ending with
 * .a extension, so that we know what elements add to target
 * project static library
 */
const getProducts = (project) => {
  return project
    .pbxGroupByName('Products')
    .children
    .map(c => c.comment)
    .filter(c => c.indexOf('.a') > -1);
};

/**
 * Given xcodeproj and filePath, it creates new file
 * from path provided, adds it to the project
 * and returns newly created instance of a file
 */
const addFileToProject = (project, filePath) => {
  const file = new PbxFile(filePath);
  file.uuid = project.generateUuid();
  file.fileRef = project.generateUuid();
  project.addToPbxFileReferenceSection(file);
  return file;
};

/**
 * Given an array of xcodeproj libraries and pbxFile,
 * it appends it to that group
 */
const addProjectToLibraries = (libraries, file) => {
  return libraries.children.push({
    value: file.fileRef,
    comment: file.basename,
  });
};

/**
 * Given folder, it returns an array of all header files
 * inside it, ignoring node_modules and examples
 */
const getHeadersInFolder = (folder) =>
  glob
    .sync('**/*.h', {
      cwd: folder,
      nodir: true,
      ignore: GLOB_EXCLUDE_PATTERN,
    })
    .map(file => path.join(folder, file));

/**
 * Given an array of headers it returns search path so Xcode can find them
 * If there are multiple header files located accross different folders,
 * it finds the top-most one and returns recursive version of it
 */
const getHeaderSearchPath = (sourceDir, headers) => {
  const directories = union(
    headers.map(path.dirname)
  );

  if (directories.length === 1) {
    return `"$(SRCROOT)/${path.relative(sourceDir, directories[0])}"`;
  }

  const directory = directories.reduce((topMostDir, currentDir) => {
    const currentFolders = currentDir.split(path.sep);
    const topMostFolders = topMostDir.split(path.sep);

    if (currentFolders.length === topMostFolders.length
      && lastItem(currentFolders) !== lastItem(topMostFolders)) {
      return currentFolders.slice(0, -1).join(path.sep);
    }

    return currentFolders.length < topMostFolders.length
      ? currentDir
      : topMostDir;
  });

  return `"$(SRCROOT)/${path.relative(sourceDir, directory)}/**"`;
};


/**
 * Given Xcode project and path, iterate over all build configurations
 * and append new path to HEADER_SEARCH_PATHS section
 *
 * We cannot use builtin addToHeaderSearchPaths method since react-native init does not
 * use $(TARGET_NAME) for PRODUCT_NAME, but sets it manually so that method will skip
 * that target.
 *
 * To workaround that issue and make it more bullet-proof for different names,
 * we iterate over all configurations and look if React is already there. If it is,
 * we assume user will need newly added dependency headers in it as well.
 */
const addToHeaderSearchPaths = (project, path) => {
  const config = project.pbxXCBuildConfigurationSection();

  Object
    .keys(config)
    .filter(ref => ref.indexOf('_comment') === -1)
    .forEach(ref => {
      const buildSettings = config[ref].buildSettings;
      const shouldAddSearchPath = (buildSettings.HEADER_SEARCH_PATHS || [])
        .filter(path => path.indexOf('react-native/React/**'))
        .length > 0;

      if (shouldAddSearchPath) {
        buildSettings.HEADER_SEARCH_PATHS.push(path);
      }
    });
};

/**
 * Register native module IOS adds given dependency to project by adding
 * its xcodeproj to project libraries as well as attaching static library
 * to the first target (the main one)
 *
 * If library is already linked, this action is a no-op.
 */
module.exports = function registerNativeModuleIOS(dependencyConfig, projectConfig) {
  const project = xcode.project(projectConfig.pbxprojPath).parseSync();
  const dependencyProject = xcode.project(dependencyConfig.pbxprojPath).parseSync();

  const libraries = project.pbxGroupByName(projectConfig.libraryFolder);
  if (hasLibraryImported(libraries, dependencyConfig.projectName)) {
    return;
  }

  const file = addFileToProject(
    project,
    path.relative(projectConfig.sourceDir, dependencyConfig.projectPath)
  );

  addProjectToLibraries(libraries, file);

  getProducts(dependencyProject).forEach(product => {
    project.addStaticLibrary(product, {
      target: project.getFirstTarget().uuid,
    });
  });

  const headers = getHeadersInFolder(dependencyConfig.folder);
  if (headers.length > 0) {
    addToHeaderSearchPaths(
      project,
      getHeaderSearchPath(projectConfig.sourceDir, headers)
    );
  }

  fs.writeFileSync(
    projectConfig.pbxprojPath,
    project.writeSync()
  );
};
