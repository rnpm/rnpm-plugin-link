module.exports = function makeBuildPatch(name) {
  const patch = `    compile project(':${name}')`;

  /**
   * Replace pattern by patch in the passed content
   * @param  {String} content Content of the build.gradle file
   * @return {String}         Patched content of build.gradle
   */
  const applyBuildPatch = (content) => {
    const pattern = `dependencies {`;
    return content.replace(pattern, `${pattern}\n${patch}`);
  };

  applyBuildPatch.patch = patch;

  return applyBuildPatch;
};
