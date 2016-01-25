const append = (scope, pattern, patch) =>
  scope.replace(pattern, `${pattern}\n${patch}`);

module.exports = function makeBuildPatch(name) {
  /**
   * Replace pattern by patch in the passed content
   * @param  {String} content Content of the build.gradle file
   * @return {String}         Patched content of build.gradle
   */
  return function applyBuildPatch(content) {
    const pattern = `dependencies {`;
    const patch = `    compile project(':${name}')`;

    return append(content, pattern, patch);
  };
};
