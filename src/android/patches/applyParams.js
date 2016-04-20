const toCamelCase = require('to-camel-case');

module.exports = function applyParams(str, params, prefix) {
  return str.replace(
    /\$\{(\w+)\}/g,
    (pattern, paramName) => {
      const formattedName = toCamelCase(`${prefix}-${paramName}`);

      return params[paramName]
      ? `this.getResources().getString(R.strings.${formattedName})`
      : null;
    }
  );
};
