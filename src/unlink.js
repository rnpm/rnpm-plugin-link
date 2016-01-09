const path = require('path');
const log = require('npmlog');
const uniq = require('lodash.uniq');

const isEmpty = require('./isEmpty');
const unregisterDependencyAndroid = require('./android/unregisterNativeModule');
const unregisterDependencyIOS = require('./ios/unregisterNativeModule');
const unlinkAssetsAndroid = require('./android/unlinkAssets');
const unlinkAssetsIOS = require('./ios/unlikAssets');

log.heading = 'rnpm-link';

/**
 * Updates project and unlink specific dependency
 *
 * If optional argument [packageName] is provided, it's the only one that's checked
 */
module.exports = function unlink(config, args) {

  try {
    const project = config.getProjectConfig();
  } catch (err) {
    log.error('ERRPACKAGEJSON', `No package found. Are you sure it's a React Native project?`);
    return;
  }

  const packageName = args[0];

  try {
    const dependency = config.getDependencyConfig(packageName);
  } catch (err) {
    log.warn(
      'ERRINVALIDPROJ',
      `Project ${packageName} is not a react-native library`
    );
    process.exit(1);
  }

  if (project.android && dependency.android) {
    log.info(`Unlinking ${packageName} android dependency`);

    if (unregisterDependencyAndroid(packageName, dependency.android, project.android)) {
      log.info(`Android module ${packageName} has been successfully unlinked`);
    }
  }

  if (project.ios && config.ios) {
    log.info(`Unlinking ${packageName} ios dependency`);

    if (unregisterDependencyIOS(config.ios, project.ios)) {
      log.info(`iOS module ${packageName} has been successfully unlinked`);
    }
  }

  const assets = dependency.assets;

  if (isEmpty(assets)) {
    return;
  }

  if (project.ios) {
    log.info('Unlinking assets to ios project');
    unlinkAssetsIOS(assets, project.ios);
  }

  if (project.android) {
    log.info('Unlinking assets from android project');
    unlinkAssetsAndroid(assets, project.android.assetsPath);
  }
};
