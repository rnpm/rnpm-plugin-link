const isEmpty = require('./isEmpty');

/**
 * Returns last item from an array
 */
module.exports = function lastItem(array) {
  return !isEmpty(array)
    ? array[array.length - 1]
    : void 0;
};
