const readFile = require('./fs').readFile;
const writeFile = require('./fs').writeFile;
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
    writeFile(projectConfig.settingsGradlePath),
    applySettingsPatch,
    readFile(projectConfig.settingsGradlePath)
  );

  const performBuildGradlePatch = compose(
    writeFile(projectConfig.buildGradlePath),
    applyBuildPath,
    readFile(projectConfig.buildGradlePath)
  );

  const performMainActivityPatch = compose(
    writeFile(projectConfig.mainActivityPath),
    applyMainActivityPatch,
    readFile(projectConfig.mainActivityPath)
  );

  /**
   * Check if module has been installed already
   */
  const isInstalled = compose(
    (content) => ~content.indexOf(`:"${name}"`) || ~content.indexOf(`':${name}'`),
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
