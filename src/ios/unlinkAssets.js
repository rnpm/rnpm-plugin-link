const fs = require('fs-extra');
const path = require('path');
const xcode = require('xcode');
const log = require('npmlog');
const plistParser = require('plist');
const groupFilesByType = require('../groupFilesByType');
const createGroup = require('./createGroup');
const getPlistPath = require('./getPlistPath');
const diff = require('lodash.difference');

/**
 * Unlinks assets from iOS project. Removes references for fonts from `Info.plist`
 * fonts provided by application and from `Resources` group
 */
module.exports = function unlinkAssetsIOS(files, projectConfig) {
  const project = xcode.project(projectConfig.pbxprojPath).parseSync();
  const assets = groupFilesByType(files);
  const plistPath = path.join(projectConfig.sourceDir, getPlistPath(project));

  if (!plistPath || fs.existsSync(plistPath)) {
    return log.error(
      'ERRPLIST',
      `Could not locate Info.plist file. Check if your project has 'INFOPLIST_FILE' set properly`
    );
  }

  if (!project.pbxGroupByName('Resources')) {
    return log.error(
      'ERRGROUP',
      `Group 'Resources' does not exist in your XCode project. There is nothing to unlink.`
    );
  }

  const plist = plistParser.parse(
    fs.readFileSync(plistPath, 'utf-8')
  );

  const fonts = (assets.font || [])
    .map(asset =>
      project.removeResourceFile(
        path.relative(projectConfig.sourceDir, asset),
        { target: project.getFirstTarget().uuid }
      )
    )
    .map(file => file.basename);

  plist.UIAppFonts = diff(plist.UIAppFonts || [], fonts);

  fs.writeFileSync(
    projectConfig.pbxprojPath,
    project.writeSync()
  );

  fs.writeFileSync(
    plistPath,
    plistParser.build(plist)
  );
};
