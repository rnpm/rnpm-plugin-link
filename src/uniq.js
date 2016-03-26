/**
 * Returns unique array of items by the value returned from `getItemId`
 */
module.exports = function uniq(arr, getItemId) {
  return arr.reduce(
    (acc, item) => {
      const id = typeof getItemId === 'function' ? getItemId(item) : item;
      return acc.ids.indexOf(id) >= 0
        ? acc
        : { list: acc.list.concat(item), ids: acc.ids.concat(id) };
    },
    { list: [], ids: [] }
  ).list;
};
