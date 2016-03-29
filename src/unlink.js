const path = require('path');
const log = require('npmlog');

const isEmpty = require('./isEmpty');
const getProjectDependencies = require('./getProjectDependencies');
const unregisterDependencyAndroid = require('./android/unregisterNativeModule');
const unregisterDependencyIOS = require('./ios/unregisterNativeModule');
const unlinkAssetsAndroid = require('./android/unlinkAssets');
const unlinkAssetsIOS = require('./ios/unlinkAssets');
const getDependencyConfig = require('./getDependencyConfig');
const diff = require('./diff');
const flatMap = require('./flatMap');

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
    return Promise.reject(err);
  }

  const packageName = args[0];

  try {
    const dependency = config.getDependencyConfig(packageName);
  } catch (err) {
    log.warn(
      'ERRINVALIDPROJ',
      `Project ${packageName} is not a react-native library`
    );
    return Promise.reject(err);
  }

  const allDependencies = getDependencyConfig(config, getProjectDependencies());

  if (project.android && dependency.android) {
    log.info(`Unlinking ${packageName} android dependency`);

    const didUnlinkAndroid = unregisterDependencyAndroid(
      packageName,
      dependency.android,
      project.android
    );

    if (didUnlinkAndroid) {
      log.info(`Android module ${packageName} has been successfully unlinked`);
    } else {
      log.info(`Android module ${packageName} is not linked yet`);
    }
  }

  if (project.ios && dependency.ios) {
    log.info(`Unlinking ${packageName} ios dependency`);

    const didUnlinkIOS = unregisterDependencyIOS(dependency.ios, project.ios);

    if (didUnlinkIOS) {
      log.info(`iOS module ${packageName} has been successfully unlinked`);
    } else {
      log.info(`iOS module ${packageName} is not linked yet`);
    }
  }

  const assets = diff(dependency.assets, flatMap(allDependencies, d => d.assets));

  if (isEmpty(assets)) {
    return Promise.resolve();
  }

  if (project.ios) {
    log.info('Unlinking assets from ios project');
    unlinkAssetsIOS(assets, project.ios);
  }

  if (project.android) {
    log.info('Unlinking assets from android project');
    unlinkAssetsAndroid(assets, project.android.assetsPath);
  }

  log.info(`${packageName} assets has been successfully unlinked from your project`);

  return Promise.resolve();
};
