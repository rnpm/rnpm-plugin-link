module.exports = function makePackagePatch(packageInstance, params) {
  const processedInstance = packageInstance.replace(
    /\$\{(\w+)\}/g,
    (pattern, paramName) => params[paramName]
      ? `this.getResources().getString(R.strings.${paramName})`
      : null
  );

  return {
    pattern: '.addPackage(new MainReactPackage())',
    patch: `\n                .addPackage(${processedInstance})`,
  };
};
