const readFile = require('./fs').readFile;
const writeFile = require('./fs').writeFile;
const path = require('path');
const compose = require('lodash').flowRight;
const getReactVersion = require('../getReactNativeVersion');
const getPrefix = require('./getPrefix');
const isInstalled = require('./isInstalled');

const cut = (scope, pattern) =>
  scope.replace(pattern, '');

module.exports = function unregisterNativeAndroidModule(name, dependencyConfig, projectConfig) {
  const prefix = getPrefix(getReactVersion(projectConfig.folder));

  /**
   * @param  {String} content Content of the Settings.gradle file
   * @return {String}         Patched content of Settings.gradle
   */
  const cutModuleFromSettings = (name) => (content) =>
    cut(content, `include ':${name}'\n` +
      `project(':${name}').projectDir = ` +
      `new File(rootProject.projectDir, '../node_modules/${name}/android')\n`
    );

  /**
   * Cut module compilation from the project build
   * @param  {String} content Content of the Build.gradle file
   * @return {String}         Patched content of Build.gradle
   */
  const cutModuleFromBuild = (name) => (content) =>
    cut(content, `    compile project(':${name}')\n`);

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
    cutModuleFromSettings(name),
    readFile(projectConfig.settingsGradlePath)
  );

  const applyBuildGradlePatch = compose(
    writeFile(projectConfig.buildGradlePath),
    cutModuleFromBuild(name),
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
