module.exports = function applyParams(str, params) {
  return str.replace(
    /\$\{(\w+)\}/g,
    (pattern, paramName) => params[paramName]
      ? `this.getResources().getString(R.strings.${paramName})`
      : null
  );
};
