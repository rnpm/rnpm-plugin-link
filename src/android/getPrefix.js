const path = require('path');
const semver = require('semver');

module.exports = function getPrefix(config) {
  const rnpkg = require(
    path.join(config.folder, 'node_modules', 'react-native', 'package.json')
  );

  var prefix = 'patches/0.18';

  if (semver.lt(rnpkg.version, '0.18.0')) {
    prefix = 'patches/0.17';
  }

  return prefix;
};
