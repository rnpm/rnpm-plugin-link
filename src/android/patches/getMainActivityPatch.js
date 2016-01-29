const semver = require('semver');

module.exports = function getPrefix(rnVersion) {
  const version = rnVersion.replace('-rc', '');
  return semver.satisfies(version, '>= 0.18.0')
    ? require('./0.18/makeMainActivityPatch')
    : require('./0.17/makeMainActivityPatch');
};
