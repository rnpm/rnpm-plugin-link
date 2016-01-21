/**
 * Returns path to Info.plist located in the iOS project and removes
 * xcode $(SRCROOT) and other implementation specific decorators, so that
 * return value can be easily used in e.g. path.join calls
 */
module.exports = function getPlistPath(project) {
  return project.getBuildProperty('INFOPLIST_FILE')
    .replace(/"/g, '')
    .replace('$(SRCROOT)', '');
};
