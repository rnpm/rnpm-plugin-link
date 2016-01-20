const mapHeaderSettings = require('./headerSearchPathIter');

/**
 * Given Xcode project and absolute path, it makes sure there are no headers referring to it
 */
module.exports = function addToHeaderSearchPaths(project, path) {
  mapHeaderSettings(project, (headerSearchPaths) =>
    headerSearchPaths.filter(searchPath !== path)
  );
};
