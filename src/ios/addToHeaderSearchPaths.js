const mapHeaderSearchPaths = require('./headerSearchPathIter');

module.exports = function addToHeaderSearchPaths(project, path) {
  mapHeaderSearchPaths(project, searchPaths => searchPaths.concat(path));
};
