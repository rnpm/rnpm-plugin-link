const readFile = require('./fs').readFile;
const writeFile = require('./fs').writeFile;
const compose = require('lodash').flowRight;
const getReactVersion = require('../getReactNativeVersion');
const getPrefix = require('./getPrefix');
const pollParams = require('../pollParams');

const applyPatch = (filePath, patch) =>
  compose(writeFile(filePath), patch, readFile(filePath));

function registerNativeAndroidModule(name, androidConfig, params, projectConfig) {
  const prefix = getPrefix(getReactVersion(projectConfig.folder));
  const makeSettingsPatch = require(`./patches/makeSettingsPatch`);
  const makeBuildPatch = require(`./patches/makeBuildPatch`);
  const makeMainActivityPatch = require(`./${prefix}/makeMainActivityPatch`);

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

  /**
   * Check if module has been installed already
   */
  compose(
    performSettingsGradlePatch,
    performBuildGradlePatch,
    performMainActivityPatch
  )();

  return true;
}

/**
 * Register module (and poll for params) only if module is not yet linked.
 */
module.exports = function maybeRegisterAndroidModule(name, androidConfig, params, projectConfig) {
  const isInstalled = compose(
    (content) => ~content.indexOf(`:${name}`),
    readFile(projectConfig.buildGradlePath)
  );

  if (isInstalled(name)) {
    return false;
  }

  return pollParams(params).then(answers => registerNativeAndroidModule(name, androidConfig, answers, projectConfig));
};
