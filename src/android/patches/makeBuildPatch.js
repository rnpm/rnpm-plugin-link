module.exports = function makeBuildPatch(name) {
  return {
    pattern: 'dependencies {\n',
    patch: `    compile project(':${name}')\n`,
  };
};
