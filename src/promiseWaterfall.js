module.exports = function promiseWaterfall(tasks) {
  const values = [];

  if (tasks.length === 0) {
    return Promise.resolve(values);
  }

  const firstTask = tasks.shift();

  return tasks.reduce(
    (prevTaskPromise, task) => prevTaskPromise.then(prevTaskValue => {
      values.push(prevTaskValue);
      return task(prevTaskValue);
    }),
    Promise.resolve(firstTask())
  )
  .then(lastTaskValue => values.concat(lastTaskValue));
};
