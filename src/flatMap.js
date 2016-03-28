module.exports = function flatMap(arr, mapper) {
  return arr.reduce(
    (acc, item) => acc.concat(mapper(item)),
    []
  );
};
