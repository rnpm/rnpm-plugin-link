const xcode = require('xcode');

const hasLibraryImported = require('./hasLibraryImported');

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

  // @todo add actual logic here later

  return true;
};
