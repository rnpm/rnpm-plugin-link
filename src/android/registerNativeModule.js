const log = require('npmlog');
const compose = require('lodash').flowRight;
const readFile = require('./fs').readFile;
const writeFile = require('./fs').writeFile;
const getReactVersion = require('../getReactNativeVersion');
const pkg = require('../../package.json');
const getPrefix = require('./getPrefix');

const applyPatch = (filePath, patch) =>
  compose(writeFile(filePath), patch, readFile(filePath));

module.exports = function registerNativeAndroidModule(name, androidConfig, params, projectConfig) {
  const prefix = getPrefix(getReactVersion(projectConfig.folder));

  try {
    const makeSettingsPatch = require(`./patches/makeSettingsPatch`);
    const makeBuildPatch = require(`./patches/makeBuildPatch`);
    const makeMainActivityPatch = require(`./${prefix}/makeMainActivityPatch`);
  } catch (e) {
    log.error(e + '.\nIt seems something went wrong while patching ' +
      'Android modules.\nPlease file an issue here: ' + pkg.bugs.url);
  }

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
