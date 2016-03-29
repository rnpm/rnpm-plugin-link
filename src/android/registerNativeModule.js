const readFile = require('./fs').readFile;
const writeFile = require('./fs').writeFile;
const compose = require('lodash.flowright');
const getReactVersion = require('../getReactNativeVersion');
const getPrefix = require('./getPrefix');

const applyPatch = (filePath, patch) =>
  compose(writeFile(filePath), patch, readFile(filePath));

module.exports = function registerNativeAndroidModule(name, dependencyConfig, projectConfig) {
  const prefix = getPrefix(getReactVersion(projectConfig.folder));

  const makeSettingsPatch = require(`./patches/makeSettingsPatch`);
  const makeBuildPatch = require(`./patches/makeBuildPatch`);
  const makeMainActivityPatch = require(`./${prefix}/makeMainActivityPatch`);

  const settingsPatch = makeSettingsPatch.apply(null, arguments);
  const buildPatch = makeBuildPatch(name);
  const mainActivityPatch = makeMainActivityPatch(dependencyConfig);

  const performSettingsGradlePatch = applyPatch(
    projectConfig.settingsGradlePath,
    settingsPatch
  );

  const performBuildGradlePatch = applyPatch(
    projectConfig.buildGradlePath,
    buildPatch
  );

  const performMainActivityPatch = applyPatch(
    mainActivityPath,
    mainActivityPatch
  );

  /**
   * Check if module has been installed already
   */
  const isInstalled = compose(
    (content) => ~content.indexOf(`:${name}`),
    readFile(projectConfig.buildGradlePath)
  );

  if (!isInstalled(name)) {
    compose(
      performSettingsGradlePatch,
      performBuildGradlePatch,
      performMainActivityPatch
    )();
  }
};
