// 终端提供打印颜色库
const chalk = require("chalk");

const colors = ["green", "blue", "yellow", "red"];

const utils = {};

colors.forEach((color) => {
  utils[color] = function (text, isConole = true) {
    return isConole ? console.log(chalk[color](text)) : chalk[color](text);
  };
});

module.exports = utils;
