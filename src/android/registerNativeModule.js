const fs = require('fs');
const getReactVersion = require('../getReactNativeVersion');
const getPrefix = require('./getPrefix');
const isInstalled = require('./isInstalled');

const applyPatch = require('./patches/applyPatch');
const makeSettingsPatch = require(`./patches/makeSettingsPatch`);
const makeBuildPatch = require(`./patches/makeBuildPatch`);

module.exports = function registerNativeAndroidModule(
  name,
  androidConfig,
  params,
  projectConfig
) {
  const buildPatch = makeBuildPatch(name);
  const isInstalled = fs
    .readFileSync(projectConfig.buildGradlePath)
    .indexOf(buildPatch.patch) > -1;

  if (isInstalled(projectConfig, name)) {
    return false;
  }

  const prefix = getPrefix(getReactVersion(projectConfig.folder));
  const makeMainActivityPatch = require(`./${prefix}/makeMainActivityPatch`);

  applyPatch(
    projectConfig.settingsGradlePath,
    makeSettingsPatch(name, androidConfig, projectConfig)
  );

  applyPatch(projectConfig.buildGradlePath, buildPatch);

  applyPatch(
    projectConfig.mainActivityPath,
    makeMainActivityPatch(androidConfig, params)
  );

  return true;
};
