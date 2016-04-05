const PbxFile = require('xcode/lib/pbxFile');

const removeFromPbxReferenceProxy = (project, file) => {
  const section = project.hash.project.objects.PBXReferenceProxy;

  for (var key of Object.keys(section)) {
    if (section[key].path === file.basename) {
      delete section[key];
    }
  }

  return;
};

/**
 * Removes file from static libraries
 *
 * Similar to `node-xcode` addStaticLibrary
 */
module.exports = function removeFromStaticLibraries(project, path, opts) {
  const file = new PbxFile(path);

  file.target = opts ? opts.target : undefined;

  const refFile = project.removeFromPbxFileReferenceSection(file);
  project.removeFromPbxBuildFileSection(refFile);
  project.removeFromPbxFrameworksBuildPhase(refFile);
  project.removeFromLibrarySearchPaths(refFile);
  project.removeFromProductsPbxGroup(refFile);  // @todo this does not work but it should
  removeFromPbxReferenceProxy(project, refFile);

  return refFile;
};
