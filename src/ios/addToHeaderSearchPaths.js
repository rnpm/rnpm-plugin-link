const mapHeaderSettings = require('./headerSearchPathIter');

module.exports = function addToHeaderSearchPaths(project, path) {
  mapHeaderSettings(project, headerSearchPaths =>
    headerSearchPaths.concat(path)
  );
};
