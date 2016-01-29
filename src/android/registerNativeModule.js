const fs = require('./fs');
const compose = require('lodash.flowright');
const getReactVersion = require('../getReactNativeVersion');
const getPrefix = require('./getPrefix');

module.exports = function registerNativeAndroidModule(name, dependencyConfig, projectConfig) {
  const prefix = getPrefix(getReactVersion(projectConfig.folder));

  const makeSettingsPatch = require(`./patches/makeSettingsPatch`);
  const makeBuildPatch = require(`./patches/makeBuildPatch`);
  const makeMainActivityPatch = require(`./${prefix}/makeMainActivityPatch`);

  const applySettingsPatch = makeSettingsPatch.apply(null, arguments);
  const applyBuildPath = makeBuildPatch(name);
  const applyMainActivityPatch = makeMainActivityPatch(dependencyConfig);

  const performSettingsGradlePatch = compose(
    fs.writeFile(projectConfig.settingsGradlePath),
    applySettingsPatch,
    fs.readFile(projectConfig.settingsGradlePath)
  );

  const performBuildGradlePatch = compose(
    fs.writeFile(projectConfig.buildGradlePath),
    applyBuildPath,
    fs.readFile(projectConfig.buildGradlePath)
  );

  const performMainActivityPatch = compose(
    fs.writeFile(projectConfig.mainActivityPath),
    applyMainActivityPatch,
    fs.readFile(projectConfig.mainActivityPath)
  );

  /**
   * Check if module has been installed already
   */
  const isInstalled = compose(
    (content) => ~content.indexOf(dependencyConfig.packageInstance),
    fs.readFile(projectConfig.mainActivityPath)
  );

  if (!isInstalled(name)) {
    compose(
      performSettingsGradlePatch,
      performBuildGradlePatch,
      performMainActivityPatch
    )();
  }
};
