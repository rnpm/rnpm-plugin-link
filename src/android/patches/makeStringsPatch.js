const toCamelCase = require('to-camel-case');

module.exports = function makeStringsPatch(params, prefix) {
  const patch = Object.keys(params).map(param => '    ' +
    '<string moduleConfig="true" ' +
      `name="${toCamelCase(`${prefix}-${param}`)}">${params[param]}</string>`
  ).join('\n') + '\n';

  return {
    pattern: '<resources>\n',
    patch: patch,
  };
};
