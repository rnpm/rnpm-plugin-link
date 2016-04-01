var inquirer = require('inquirer');

module.exports = (questions) => new Promise((resolve, reject) => {
  if (!questions) {
    return resolve({});
  }

  try {
    inquirer.prompt(questions, resolve);
  } catch (e) {
    reject(e);
  }
});
