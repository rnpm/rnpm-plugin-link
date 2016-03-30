var inquirer = require('inquirer');

module.exports = (questions) => new Promise((resolve, reject) => {
  try {
    inquirer.prompt(questions, resolve);
  } catch (e) {
    reject(e);
  }
});
