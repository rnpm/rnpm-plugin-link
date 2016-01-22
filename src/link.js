const path = require('path');
const log = require('npmlog');
const uniq = require('lodash.uniq');
const async = require('async');

const isEmpty = require('./isEmpty');
const registerDependencyAndroid = require('./android/registerNativeModule');
const registerDependencyIOS = require('./ios/registerNativeModule');
const copyAssetsAndroid = require('./android/copyAssets');
const copyAssetsIOS = require('./ios/copyAssets');

log.heading = 'rnpm-link';

const commandStub = (cb) => cb();

/**
 * Returns an array of dependencies that should be linked/checked.
 */
const getProjectDependencies = () => {
  const pjson = require(path.join(process.cwd(), './package.json'));
  return Object.keys(pjson.dependencies).filter(name => name !== 'react-native');
};

const makeLink = (project, dependency) => (cb) => {
  if (project.android && dependency.config.android) {
    log.info(`Linking ${dependency.name} android dependency`);

    const didLinkAndroid = registerDependencyAndroid(
      dependency.name,
      dependency.config.android,
      project.android
    );

    if (didLinkAndroid) {
      log.info(`Android module ${dependency.name} has been successfully linked`);
    } else {
      log.info(`Android module ${dependency.name} is already linked`);
    }
  }

  if (project.ios && dependency.config.ios) {
    log.info(`Linking ${dependency.name} ios dependency`);

    const didLinkIOS = registerDependencyIOS(dependency.config.ios, project.ios);

    if (didLinkIOS) {
      log.info(`iOS module ${dependency.name} has been successfully linked`);
    } else {
      log.info(`iOS module ${dependency.name} is already linked`);
    }
  }

  cb();
};

const makeLinkAssets = (project, assets) => (cb) => {
  if (isEmpty(assets)) {
    return cb();
  }

  if (project.ios) {
    log.info('Linking assets to ios project');
    copyAssetsIOS(assets, project.ios);
  }

  if (project.android) {
    log.info('Linking assets to android project');
    copyAssetsAndroid(assets, project.android.assetsPath);
  }

  log.info(`Assets has been successfully linked to your project`);

  cb();
};

/**
 * Updates project and linkes all dependencies to it
 *
 * If optional argument [packageName] is provided, it's the only one that's checked
 */
module.exports = function link(config, args, callback) {

  try {
    const project = config.getProjectConfig();
  } catch (err) {
    log.error('ERRPACKAGEJSON', `No package found. Are you sure it's a React Native project?`);
    return;
  }

  const packageName = args[0];

  const dependencies =
    (packageName ? [packageName] : getProjectDependencies())
    .map(name => {
      try {
        return {
          config: config.getDependencyConfig(name),
          name,
        };
      } catch (err) {
        log.warn(
          'ERRINVALIDPROJ',
          `Project ${name} is not a react-native library`
        );
      }
    })
    .filter(dependency => dependency);

  const tasks = dependencies.map((dependency) => (next) =>
    async.waterfall([
      dependency.config.commands.prelink || commandStub,
      makeLink(project, dependency),
      dependency.config.commands.postlink || commandStub,
    ], next)
  );

  const assets = uniq(
    dependencies.reduce(
      (assets, dependency) => assets.concat(dependency.config.assets),
      project.assets
    ),
    asset => path.basename(asset)
  );

  tasks.push(makeLinkAssets(project, assets));

  async.series(tasks, callback || () => {});
};
