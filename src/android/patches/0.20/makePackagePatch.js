const applyParams = require('../applyParams');

module.exports = function makePackagePatch(packageInstance, params) {
  const processedInstance = applyParams(packageInstance, params);

  return {
    pattern: 'new MainReactPackage()',
    patch: ',\n            ' + processedInstance,
  };
};
