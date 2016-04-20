const applyParams = require('../applyParams');

module.exports = function makePackagePatch(packageInstance, params) {
  const processedInstance = applyParams(packageInstance, params);

  return {
    pattern: '.addPackage(new MainReactPackage())',
    patch: `\n                .addPackage(${processedInstance})`,
  };
};
