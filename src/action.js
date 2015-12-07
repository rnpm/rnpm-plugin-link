const path = require('path');
const log = require('npmlog');

const isEmpty = require('./isEmpty');
const registerDependencyAndroid = require('./android/registerNativeModule');
const registerDependencyIOS = require('./ios/registerNativeModule');
const copyAssetsAndroid = require('./android/copyAssets');
const copyAssetsIOS = require('./ios/copyAssets');

log.heading = 'rnpm-link';

/**
 * Returns an array of dependencies that should be linked/checked.
 */
const getProjectDependencies = () => {
  const pjson = require(path.join(process.cwd(), './package.json'));
  return Object.keys(pjson.dependencies).filter(name => name !== 'react-native');
};

/**
 * Updates project and linkes all dependencies to it
 *
 * If optional argument [packageName] is provided, it's the only one that's checked
 */
module.exports = function link(config, args) {
  const project = config.getProjectConfig();

  if (!project) {
    log.error('ERRPACKAGEJSON', `No package found. Are you sure it's a React Native project?`);
    return;
  }

  const packageName = args[0];
  const dependencies = packageName ? [packageName] : getProjectDependencies();

  const copyAssets = (assets) => {
    if (project.ios) {
      copyAssetsIOS(assets, project.ios);
    }

    if (project.android) {
      copyAssetsAndroid(assets, project.android.assetsPath);
    }
  };

  if (!isEmpty(project.assets)) {
    log.info('Linking project assets');
    copyAssets(project.assets);
  }

  dependencies
    .forEach(name => {
      const dependency = config.getDependencyConfig(name);

      if (!dependency) {
        return log.warn('ERRINVALIDPROJ', `Project ${name} is not a react-native library`);
      }

      if (project.android && dependency.android) {
        log.info(`Linking ${name} android dependency`);
        registerDependencyAndroid(name, dependency.android, project.android);
      }

      if (project.ios && dependency.ios) {
        log.info(`Linking ${name} ios dependency`);
        registerDependencyIOS(dependency.ios, project.ios);
      }

      if (!isEmpty(dependency.assets)) {
        log.info(`Linking assets from ${name}`);
        copyAssets(dependency.assets);
      }
    });
};
