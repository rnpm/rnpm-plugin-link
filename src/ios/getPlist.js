const getBuildProperty = require('./getBuildProperty');
const plistParser = require('plist');
const path = require('path');

/**
 * Returns Info.plist located in the iOS project and removes
 * xcode $(SRCROOT) and other implementation specific decorators, so that
 * return value can be easily used in e.g. path.join calls
 *
 * Returns `null` if INFOPLIST_FILE is not specified.
 */
module.exports = function getPlistPath(project, sourceDir) {
  const plistFile = getBuildProperty(project, 'INFOPLIST_FILE');

  if (!plistFile) {
    return null;
  }

  const plistPath = path.join(
    sourceDir,
    plistFile.replace(/"/g, '').replace('$(SRCROOT)', '')
  );

  if (!fs.existsSync(plistPath)) {
    return null;
  }

  return plistParser.parse(
    fs.readFileSync(plistPath, 'utf-8')
  );
};
