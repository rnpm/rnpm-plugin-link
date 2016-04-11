module.exports = function makeStringsPatch(params) {
  const patch = Object.keys(params).map(key =>
    `    <string moduleConfig="true" name="${key}">${params[key]}</string>`
  ).join('\n') + '\n';

  return {
    pattern: '<resources>\n',
    patch: patch,
  };
};
