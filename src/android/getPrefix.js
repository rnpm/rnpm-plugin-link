const semver = require('semver');

module.exports = function getPrefix(rnVersion) {
  const version = rnVersion.replace('-rc', '');
  var prefix = 'patches/0.18';

  if (semver.lt(version, '0.18.0')) {
    prefix = 'patches/0.17';
  }

  return prefix;
};
