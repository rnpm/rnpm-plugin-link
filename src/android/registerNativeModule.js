const path = require('path');
const semver = require('semver');

module.exports = function registerNativeModule(name, dependencyConfig, projectConfig) {
  const rnpkg = require(
    path.join(projectConfig.folder, 'node_modules', 'react-native', 'package.json')
  );

  if (semver.lt(rnpkg.version, '0.18.0')) {
    return require('./patches/0.17').apply(null, arguments);
  }

  return require('./patches/0.18').apply(null, arguments);
};
