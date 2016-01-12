const spawn = require('child_process').spawn;
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

  const assets = uniq(
    dependencies.reduce(
      (assets, dependency) => assets.concat(dependency.config.assets),
      project.assets
    ),
    asset => path.basename(asset)
  );

  const tasks = dependencies.map((dependency) => (next) => {
    const prelink = (cb) => {
      if (dependency.config.hooks && dependency.config.hooks.prelink) {
        const hook = spawn(dependency.config.hooks.prelink, {
          stdio: 'inherit',
          stdin: 'inherit',
        });

        hook.on('close', function prelink(code) {
          if (code) {
            process.exit(code);
          }

          cb();
        });
      } else {
        cb();
      }
    };

    const postlink = (cb) => {
      if (dependency.config.hooks && dependency.config.hooks.postlink) {
        const hook = spawn(dependency.config.hooks.postlink, {
          stdio: 'inherit',
          stdin: 'inherit',
        });

        hook.on('close', function postlink(code) {
          if (code) {
            process.exit(code);
          }

          cb();
        });
      } else {
        cb();
      }
    };

    async.waterfall([prelink, (cb) => {
      if (project.android && dependency.config.android) {
        log.info(`Linking ${dependency.name} android dependency`);
        registerDependencyAndroid(
          dependency.name,
          dependency.config.android,
          project.android
        );
      }

      if (project.ios && dependency.config.ios) {
        log.info(`Linking ${dependency.name} ios dependency`);
        registerDependencyIOS(dependency.config.ios, project.ios);
      }

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

      cb();
    }, postlink, next]);
  });

  async.series(tasks, callback || () => {});
};
