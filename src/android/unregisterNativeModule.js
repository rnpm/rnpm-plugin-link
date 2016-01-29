const fs = require('./fs');
const path = require('path');
const compose = require('lodash.flowright');

const cut = (scope, pattern) =>
  scope.replace(pattern + '\n', '');

module.exports = function unregisterNativeAndroidModule(name, dependencyConfig, projectConfig) {
  /**
   * @param  {String} content Content of the Settings.gradle file
   * @return {String}         Patched content of Settings.gradle
   */
  const cutModuleFromSettings = (name) => (content) =>
    cut(content, `include ':${name}'\n` +
      `project(':${name}').projectDir = ` +
      `new File(rootProject.projectDir, '../node_modules/${name}/android')`
    );

  /**
   * Cut module compilation from the project build
   * @param  {String} content Content of the Build.gradle file
   * @return {String}         Patched content of Build.gradle
   */
  const cutModuleFromBuild = (name) => (content) =>
    cut(content, `    compile project(':${name}')`);

  const getMainActivityPatch = () =>
    `                .addPackage(${dependencyConfig.packageInstance})`;

  /**
   * Make a MainActivity.java program patcher
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  const makeMainActivityPatcher = (content) => {
    const patched = cut(content, dependencyConfig.packageImportPath);
    return cut(patched, getMainActivityPatch());
  };

  const applySettingsGradlePatch = compose(
    fs.writeFile(projectConfig.settingsGradlePath),
    cutModuleFromSettings(name),
    fs.readFile(projectConfig.settingsGradlePath)
  );

  const applyBuildGradlePatch = compose(
    fs.writeFile(projectConfig.buildGradlePath),
    cutModuleFromBuild(name),
    fs.readFile(projectConfig.buildGradlePath)
  );

  const applyMainActivityPatch = compose(
    fs.writeFile(projectConfig.mainActivityPath),
    makeMainActivityPatcher,
    fs.readFile(projectConfig.mainActivityPath)
  );

  /**
   * Check if module has been installed already
   */
  const isInstalled = compose(
    (content) => ~content.indexOf(getMainActivityPatch()),
    fs.readFile(projectConfig.mainActivityPath)
  );

  if (!isInstalled(name)) {
    return false;
  }

  compose(
    applySettingsGradlePatch,
    applyBuildGradlePatch,
    applyMainActivityPatch
  )();

  return true;
};
