const isEmpty = require('./isEmpty');

/**
 * Returns last item from an array
 */
module.exports = function lastItem(array) {
  return isEmpty(array)
    ? void 0
    : array[array.length - 1];
};
