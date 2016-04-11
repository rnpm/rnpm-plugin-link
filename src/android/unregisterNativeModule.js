const readFile = require('./fs').readFile;
const writeFile = require('./fs').writeFile;
const compose = require('lodash').flowRight;
const getReactVersion = require('../getReactNativeVersion');
const getPrefix = require('./getPrefix');
const isInstalled = require('./isInstalled');

const revokePatch = require('./patches/revokePatch');
const makeSettingsPatch = require('./patches/makeSettingsPatch');
const makeBuildPatch = require(`./patches/makeBuildPatch`);

module.exports = function unregisterNativeAndroidModule(
  name,
  androidConfig,
  projectConfig
) {
  const prefix = getPrefix(getReactVersion(projectConfig.folder));

  const buildPatch = makeBuildPatch(name);

  if (!isInstalled(projectConfig, name)) {
    return false;
  }

  const getAddPackagePatch = require(`./${prefix}/addPackagePatch`);

  /**
   * Make a MainActivity.java program patcher
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  const makeMainActivityPatcher = (content) => {
    const patched = cut(content, androidConfig.packageImportPath + '\n');
    return cut(patched, getAddPackagePatch(androidConfig));
  };

  revokePatch(
    projectConfig.settingsGradlePath,
    makeSettingsPatch(name, androidConfig, projectConfig)
  );

  revokePatch(
    projectConfig.buildGradlePath,
    makeBuildPatch(name)
  );

  const applyMainActivityPatch = compose(
    writeFile(projectConfig.mainActivityPath),
    makeMainActivityPatcher,
    readFile(projectConfig.mainActivityPath)
  );

  compose(
    applyMainActivityPatch
  )();

  return true;
};
