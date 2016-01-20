const xcode = require('xcode');

const hasLibraryImported = require('./hasLibraryImported');
const removeFileFromProject = require('./removeFileFromProject');
const removeProjectFromLibraries = require('./removeProjectFromLibraries');
const removeFromStaticLibraries = require('./removeFromStaticLibraries');
const removeFromHeaderSearchPaths = require('./removeFromHeaderSearchPaths');

/**
 * Unregister native module IOS
 *
 * If library is already unlinked, this action is a no-op.
 */
module.exports = function unregisterNativeModule() {
  const project = xcode.project(projectConfig.pbxprojPath).parseSync();
  const dependencyProject = xcode.project(dependencyConfig.pbxprojPath).parseSync();

  const libraries = project.pbxGroupByName(projectConfig.libraryFolder);
  if (!hasLibraryImported(libraries, dependencyConfig.projectName)) {
    return false;
  }

  const file = removeFileFromProject(
    project,
    path.relative(projectConfig.sourceDir, dependencyConfig.projectPath)
  );

  removeProjectFromLibraries(libraries, file);

  getProducts(dependencyProject).forEach(product => {
    removeFromStaticLibraries(project, product, {
      target: project.getFirstTarget().uuid,
    });
  });

  const headers = getHeadersInFolder(dependencyConfig.folder);
  if (!isEmpty(headers)) {
    removeFromHeaderSearchPaths(
      project,
      getHeaderSearchPath(projectConfig.sourceDir, headers)
    );
  }

  fs.writeFileSync(
    projectConfig.pbxprojPath,
    project.writeSync()
  );

  return true;
};
