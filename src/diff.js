module.exports = function diff(array, exclude) {
  return array.filter(item => exclude.indexOf(item) === -1);
};
