/**
 * Returns items grouped by the key
 */
module.exports = function groupBy(items, getItemKey) {
  return items.reduce((acc, item) => {
    const key = getItemKey(item);

    if (!acc[key]) {
      acc[key] = [item];
    } else {
      acc[key] = acc[key].concat(item);
    }

    return acc;
  }, {});
};
