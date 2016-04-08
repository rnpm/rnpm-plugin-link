const log = require('npmlog');
const path = require('path');
const uniq = require('lodash').uniq;
const pkg = require('../package.json');

const isEmpty = require('lodash').isEmpty;
const registerDependencyAndroid = require('./android/registerNativeModule');
const registerDependencyIOS = require('./ios/registerNativeModule');
const copyAssetsAndroid = require('./android/copyAssets');
const copyAssetsIOS = require('./ios/copyAssets');
const getProjectDependencies = require('./getProjectDependencies');
const getDependencyConfig = require('./getDependencyConfig');

log.heading = 'rnpm-link';

const commandStub = (cb) => cb();
const dedupeAssets = (assets) => uniq(assets, asset => path.basename(asset));

const promisify = (func) => () => new Promise((resolve, reject) =>
  func((err, res) => err ? reject(err) : resolve(res))
);

function promiseWaterfall(tasks) {
  return tasks.reduce(
    (prevTaskPromise, task) => prevTaskPromise.then(task),
    Promise.resolve()
  );
}

const linkDependency = (project, dependency) => {
  const tasks = [];

  if (project.ios && dependency.config.ios) {
    log.info(`Linking ${dependency.name} ios dependency`);
    tasks.push(registerDependencyIOS(dependency.config.ios, project.ios));
  }

  if (project.android && dependency.config.android) {
    log.info(`Linking ${dependency.name} android dependency`);
    tasks.push(registerDependencyAndroid(
      dependency.name,
      dependency.config.android,
      dependency.config.params,
      project.android
    ));
  }

  return Promise.all(tasks)
    .then(results => {
      const didLinkAndroid = results[0];
      const didLinkIOS = results[1];

      if (didLinkAndroid) {
        log.info(`Android module ${dependency.name} has been successfully linked`);
      } else {
        log.info(`Android module ${dependency.name} is already linked`);
      }

      if (didLinkIOS) {
        log.info(`iOS module ${dependency.name} has been successfully linked`);
      } else {
        log.info(`iOS module ${dependency.name} is already linked`);
      }
    })
    .catch(err => {
      log.error(
        `It seems something went wrong while linking. Error: ${err.message} \n`
        + `Please file an issue here: ${pkg.bugs.url}`
      );
      throw err;
    });
};

const linkAssets = (project, assets) => {
  if (isEmpty(assets)) {
    return;
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
};

/**
 * Updates project and linkes all dependencies to it
 *
 * If optional argument [packageName] is provided, it's the only one that's checked
 */
module.exports = function link(config, args) {
  try {
    const project = config.getProjectConfig();
  } catch (err) {
    log.error('ERRPACKAGEJSON', `No package found. Are you sure it's a React Native project?`);
    return Promise.reject(err);
  }

  const packageName = args[0];

  const dependencies = getDependencyConfig(
    config,
    packageName ? [packageName] : getProjectDependencies()
  );

  const assets = dedupeAssets(dependencies.reduce(
    (assets, dependency) => assets.concat(dependency.config.assets),
    project.assets
  ));

  return Promise.all(
    dependencies.map(dependency => promiseWaterfall([
      () => promisify(dependency.config.commands.prelink || commandStub),
      () => linkDependency(project, dependency),
      () => promisify(dependency.config.commands.postlink || commandStub),
    ]))
  ).then(() => linkAssets(project, assets));
};
