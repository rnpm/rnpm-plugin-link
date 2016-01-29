const semver = require('semver');

module.exports = function getPrefix(rnVersion) {
  return semver.lt(rnVersion, '0.18.0')
    ? require('./0.17/makeMainActivityPatch')
    : require('./0.18/makeMainActivityPatch');
};
