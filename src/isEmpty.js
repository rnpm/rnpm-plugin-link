/**
 * Given an array, it returns false if array is either undefined
 * or it's length equals to 0.
 */
module.exports = function isEmpty(array) {
  return !array || array.length === 0;
};
