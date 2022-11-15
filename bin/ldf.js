#!/usr/bin/env node
"use strict";

const commander = require("commander");
const create = require("../src/create");
const start = require("../src/start");
const inquirer = require("../src/inquire");
const utils = require("../utils/index");

const { green, yellow, blue } = utils;

const program = new commander().Command();

// 版本号
program.version("1.0.0");

// 创建项目
program
  .command("create")
  .description("create a project")
  .action(function () {
    green("👽 👽 👽 " + "欢迎使用rux,轻松构建react ts项目～🎉🎉🎉");
    inquirer.create().then((res) => {
      if (res.conf) {
        create(res);
      }
    });
  });

//运行项目
program
  .command("start")
  .description("start a project")
  .action(function () {
    green("---------运行项目------------");
    start("start").then(() => {
      green("-----✅  ✅运行完成-------");
    });
  });

// 编译项目
program
  .command("build")
  .description("build a project")
  .action(function () {
    green("------构建项目--------");
    start("build").then(() => {
      green("-------✅  ✅构建完成--------");
    });
  });

program.parse(process.argv);
