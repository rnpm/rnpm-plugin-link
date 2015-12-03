const path = require('path');
const log = require('npmlog');

const isEmpty = require('./isEmpty');
const registerDependencyAndroid = require('./android/registerNativeModule');
const registerDependencyIOS = require('./ios/registerNativeModule');
const copyAssetsAndroid = require('./android/copyAssets');
const copyAssetsIOS = require('./ios/copyAssets');
const pjson = require(path.join(process.cwd(), './package.json'));

/**
 * Namespace log messages
 */
log.heading = 'rnpm-link';

/**
 * Returns an array of dependencies that should be linked/checked.
 * @param {Object} pconfig Project config
 */
const getProjectDependencies = (pconfig) =>
  Object.keys(pconfig.dependencies).filter(name => name !== 'react-native');

/**
 * Updates project and linkes all dependencies to it
 * @param {Object} config Composed configuration object
 * @param {Array}  args   Arguments from the command line
 */
module.exports = function link(config, args) {
  const pconfig = config.getProjectConfig();

  if (!pconfig) {
    log.error('ERRPACKAGEJSON', `No package found. Are you sure it's a React Native project?`);
    return;
  }

  const packageName = args[0];
  const dependencies = packageName ? [packageName] : getProjectDependencies(pjson);

  dependencies
    .forEach(name => {
      const dconfig = config.getDependencyConfig(name);

      if (!dconfig) {
        return log.warn('ERRINVALIDPROJ', `Project ${name} is not a react-native library`);
      }

      if (pconfig.android && dconfig.android) {
        log.info(`Linking ${name} android dependency`);
        registerDependencyAndroid(name, dconfig.android, pconfig.android);
      }

      if (pconfig.ios && dconfig.ios) {
        log.info(`Linking ${name} ios dependency`);
        registerDependencyIOS(dconfig.ios, pconfig.ios);
      }

      if (pconfig.android && !isEmpty(dconfig.assets)) {
        log.info(`Copying assets from ${name} to android project`);
        copyAssetsAndroid(dconfig.assets, pconfig.android.assetsPath);
      }

      if (pconfig.ios && !isEmpty(dconfig.assets)) {
        log.info(`Linking assets from ${name} to ios project`);
        copyAssetsIOS(dconfig.assets, pconfig.ios);
      }
    });
};
