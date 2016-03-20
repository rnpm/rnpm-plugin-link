const getBuildProperty = require('./getBuildProperty');
const plistParser = require('plist');
const path = require('path');
const fs = require('fs');

/**
 * Returns Info.plist located in the iOS project
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
