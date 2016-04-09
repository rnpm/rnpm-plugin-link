const readFile = require('./fs').readFile;
const writeFile = require('./fs').writeFile;
const path = require('path');
const compose = require('lodash').flowRight;
const getReactVersion = require('../getReactNativeVersion');
const getPrefix = require('./getPrefix');
const makeSettingsPatch = require('./patches/makeSettingsPatch');
const makeBuildPatch = require('./patches/makeBuildPatch');

const isInstalled = require('./isInstalled');

const cut = (scope, pattern) =>
  scope.replace(pattern, '');

module.exports = function unregisterNativeAndroidModule(name, dependencyConfig, projectConfig) {
  const prefix = getPrefix(getReactVersion(projectConfig.folder));

  const settingsPatch = makeSettingsPatch(name, dependencyConfig, {}, projectConfig).patch;
  const buildPatch = makeBuildPatch(name).patch;

  /**
   * @param  {String} content Content of the Settings.gradle file
   * @return {String}         Patched content of Settings.gradle
   */
  const cutModuleFromSettings = (content) => cut(content, settingsPatch);

  /**
   * Cut module compilation from the project build
   * @param  {String} content Content of the Build.gradle file
   * @return {String}         Patched content of Build.gradle
   */
  const cutModuleFromBuild = (content) => cut(content, buildPatch);

  const getAddPackagePatch = require(`./${prefix}/addPackagePatch`);

  /**
   * Make a MainActivity.java program patcher
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  const makeMainActivityPatcher = (content) => {
    const patched = cut(content, dependencyConfig.packageImportPath + '\n');
    return cut(patched, getAddPackagePatch(dependencyConfig));
  };

  const applySettingsGradlePatch = compose(
    writeFile(projectConfig.settingsGradlePath),
    cutModuleFromSettings,
    readFile(projectConfig.settingsGradlePath)
  );

  const applyBuildGradlePatch = compose(
    writeFile(projectConfig.buildGradlePath),
    cutModuleFromBuild,
    readFile(projectConfig.buildGradlePath)
  );

  const applyMainActivityPatch = compose(
    writeFile(projectConfig.mainActivityPath),
    makeMainActivityPatcher,
    readFile(projectConfig.mainActivityPath)
  );

  if (!isInstalled(projectConfig, name)) {
    return false;
  }

  compose(
    applySettingsGradlePatch,
    applyBuildGradlePatch,
    applyMainActivityPatch
  )();

  return true;
};
