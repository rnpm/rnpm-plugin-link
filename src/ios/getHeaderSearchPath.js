const path = require('path');
const union = require('lodash.union');

/**
 * Returns last item from an array
 */
const lastItem = (array) => array[array.length - 1];

/**
 * Given an array of headers it returns search path so Xcode can find them
 * If there are multiple header files located accross different folders,
 * it finds the top-most one and returns recursive version of it
 */
module.exports = function getHeaderSearchPath(sourceDir, headers) {
  const directories = union(
    headers.map(path.dirname)
  );

  if (directories.length === 1) {
    return `"$(SRCROOT)/${path.relative(sourceDir, directories[0])}"`;
  }

  const directory = directories.reduce((topMostDir, currentDir) => {
    const currentFolders = currentDir.split(path.sep);
    const topMostFolders = topMostDir.split(path.sep);

    if (currentFolders.length === topMostFolders.length
      && lastItem(currentFolders) !== lastItem(topMostFolders)) {
      return currentFolders.slice(0, -1).join(path.sep);
    }

    return currentFolders.length < topMostFolders.length
      ? currentDir
      : topMostDir;
  });

  return `"$(SRCROOT)/${path.relative(sourceDir, directory)}/**"`;
};
