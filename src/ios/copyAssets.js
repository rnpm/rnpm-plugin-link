const fs = require('fs-extra');
const path = require('path');
const xcode = require('xcode');
const log = require('npmlog');
const plistParser = require('plist');
const groupFilesByType = require('../groupFilesByType');
const createGroup = require('./createGroup');

/**
 * This function works in a similar manner to its Android version,
 * except it does not copies fonts but creates XCode Group references
 */
module.exports = function copyAssetsIOS(files, projectConfig) {
  const project = xcode.project(projectConfig.pbxprojPath).parseSync();
  const assets = groupFilesByType(files);
  const plistPath = path.join(
    projectConfig.sourceDir,
    project.getBuildProperty('INFOPLIST_FILE').replace(/"/g, '').replace('$(SRCROOT)', '')
  );

  if (!fs.existsSync(plistPath)) {
    return log.error(
      'ERRPLIST',
      `Could not locate Info.plist file at ${plistPath}. Check if your project has Info.plist set properly`
    );
  }

  if (!project.pbxGroupByName('Resources')) {
    log.warn(
      'ERRGROUP',
      `Group 'Resources' does not exist in your XCode project. We have created it automatically for you.`
    );

    createGroup(project, 'Resources');
  }

  const plist = plistParser.parse(
    fs.readFileSync(plistPath, 'utf-8')
  );

  const fonts = (assets.font || [])
    .map(asset =>
      project.addResourceFile(
        path.relative(projectConfig.sourceDir, asset),
        {
          target: project.getFirstTarget().uuid,
        }
      )
    )
    .filter(file => file)   // xcode returns false if file is already there
    .map(file => file.basename);

  plist.UIAppFonts = (plist.UIAppFonts || []).concat(fonts);

  fs.writeFileSync(
    projectConfig.pbxprojPath,
    project.writeSync()
  );

  fs.writeFileSync(
    plistPath,
    plistParser.build(plist)
  );
};
