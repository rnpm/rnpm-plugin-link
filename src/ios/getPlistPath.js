/**
 * Returns path to Info.plist located in the iOS project and removes
 * xcode $(SRCROOT) and other implementation specific decorators, so that
 * return value can be easily used in e.g. path.join calls
 *
 * Returns `null` if INFOPLIST_FILE is not specified. This is a case
 * for cocoa pods projects that use .xcodeproj instead of .xcworkspace
 * with link.
 */
module.exports = function getPlistPath(project) {
  const plistFile = project.getBuildProperty('INFOPLIST_FILE');

  if (!plistFile) {
    return null;
  }

  return plistFile
    .replace(/"/g, '')
    .replace('$(SRCROOT)', '');
};
