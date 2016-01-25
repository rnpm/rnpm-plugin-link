const path = require('path');
const semver = require('semver');
const fs = require('fs-extra');
const compose = require('lodash.flowright');

const readFile = (file) =>
  () => fs.readFileSync(file, 'utf8');

const writeFile = (file, content) => content ?
  fs.writeFileSync(file, content, 'utf8') :
  (c) => fs.writeFileSync(file, c, 'utf8');

module.exports = function registerNativeAndroidModule(name, dependencyConfig, projectConfig) {
  const rnpkg = require(
    path.join(projectConfig.folder, 'node_modules', 'react-native', 'package.json')
  );

  var prefix = 'patches/0.18';

  if (semver.lt(rnpkg.version, '0.18.0')) {
    prefix = 'patches/0.17';
  }

  const makeSettingsPatch = require(`./${prefix}/makeSettingsPatch`);
  const makeBuildPatch = require(`./${prefix}/makeBuildPatch`);
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
    (content) => ~content.indexOf(dependencyConfig.packageInstance),
    readFile(projectConfig.mainActivityPath)
  );

  if (!isInstalled(name)) {
    compose(
      performSettingsGradlePatch,
      performBuildGradlePatch,
      performMainActivityPatch
    )();
  }
};

