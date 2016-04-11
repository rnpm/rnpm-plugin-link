const readFile = require('./fs').readFile;
const writeFile = require('./fs').writeFile;
const compose = require('lodash').flowRight;
const getReactVersion = require('../getReactNativeVersion');

const applyPatch = (filePath, patch) =>
  compose(writeFile(filePath), patch, readFile(filePath));

module.exports = function registerNativeAndroidModule(name, androidConfig, params, projectConfig) {
  const makeSettingsPatch = require(`./patches/makeSettingsPatch`);
  const makeBuildPatch = require(`./patches/makeBuildPatch`);
  const makeMainActivityPatch = require(`./patches/makeMainActivityPatch`);

  const performSettingsGradlePatch = applyPatch(
    projectConfig.settingsGradlePath,
    makeSettingsPatch.apply(null, arguments)
  );

  const performBuildGradlePatch = applyPatch(
    projectConfig.buildGradlePath,
    makeBuildPatch(name)
  );

  const performMainActivityPatch = applyPatch(
    projectConfig.mainActivityPath,
    makeMainActivityPatch(androidConfig, params)
  );

  compose(
    performSettingsGradlePatch,
    performBuildGradlePatch,
    performMainActivityPatch
  )();
};
