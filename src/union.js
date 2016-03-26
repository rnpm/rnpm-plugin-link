const uniq = require('./uniq');

/**
 * Returns unique array of items by the value returned from `getItemId`
 */
module.exports = function union(arrays) {
  return uniq(arrays.reduce((acc, arr) => acc.concat(arr), []));
};
