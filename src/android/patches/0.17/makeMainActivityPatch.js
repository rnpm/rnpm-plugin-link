const addPackagePatch = require('./addPackagePatch');

const append = (scope, pattern, patch) =>
  scope.replace(pattern, `${pattern}\n${patch}`);

module.exports = function makeMainActivityPatch(config) {
  const importPattern = `import android.app.Activity;`;
  const packagePattern = `.addPackage(new MainReactPackage())`;

  /**
   * Make a MainActivity.java program patcher
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  return function applyMainActivityPatch(content) {
    const patched = append(
      content,
      importPattern,
      config.packageImportPath
    );

    return append(
      patched,
      packagePattern,
      addPackagePatch(config)
    );
  };
};
