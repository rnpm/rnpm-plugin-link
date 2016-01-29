const semver = require('semver');

module.exports = function getPrefix(rnVersion) {
  const version = rnVersion.replace('-rc', '');
  return semver.satisfies(version, '>= 0.18.0')
    ? 'patches/0.18'
    : 'patches/0.17';
};
