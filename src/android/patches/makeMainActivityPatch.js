module.exports = function makeMainActivityPatch(androidConfig, params) {
  const classPattern = 'public class MainActivity extends ';
  const packageInstance = androidConfig.packageInstance.replace(
    /\$\{(\w+)\}/g,
    (pattern, paramName) => params[paramName] ? `"${params[paramName]}"` : null
  );

  return function applyMainActivityPatch(content) {
    const isReactActivity = content.match(new RegExp(`${classPattern}(\\w*)`))[1] === 'ReactActivity';

    const packagePattern = isReactActivity
      ? 'new MainReactPackage()'
      : '.addPackage(new MainReactPackage())';

    const packagePatch = isReactActivity
      ? `,\n        ${packageInstance}`
      : `\n                .addPackage(${packageInstance})`;

    return content
      .replace(classPattern, `${androidConfig.packageImportPath}\n\n${classPattern}`) // makes the import patch
      .replace(packagePattern, `${packagePattern}${packagePatch}`); // adds the package instance to the list of packages;
  };
};
