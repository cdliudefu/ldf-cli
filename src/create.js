const fs = require("fs");
const utils = require("../utils/index");
const npm = require("./install");

const { green, blue, red, yellow } = utils;

// 三变量判断异常操作
const fileCount = 0; // 文件数量
const dirCount = 0; // 文件夹数量
const flat = 0; // readir数量
const isInstall = false; //

const revisePackageJson = (res, sourcePath) => {
  return new Promise((resolve) => {
    fs.readFile(sourcePath + "/package.json", (err, data) => {
      if (err) {
        throw err;
      }
      const { author, name } = res;
      let json = data.toString();
      json = json.replace(/demoName/g, name.trim());
      json = json.replace(/demoAuthor/g, author.trim());
      const path = process.cwd() + "/package.json";
      fs.writeFile(path, new Buffer(json), () => {
        green("创建文件：" + path);
        resolve();
      });
    });
  });
};

const runProject = () => {
  try {
    const doing = npm(["start"]);
    doing();
  } catch (error) {
    red("自动启动失败，请手动npm start启动项目");
  }
};

const completeControl = (cb) => {
  if (fileCount === 0 && dirCount === 0 && flat === 0) {
    green("------构建完成-----");
    if (cb && !isInstall) {
      isInstall = true;
      blue("------开始install-------");
      cb(() => {
        blue("-------完成install--------");
        runProject();
      });
    }
  }
};

const dirExist = (sourcePath, currentPath, copyCallback, cb) => {
  fs.existsSync(currentPath, (ext) => {
    if (ext) {
      copyCallback(sourcePath, currentPath);
    } else {
      fs.mkdirSync(currentPath, () => {
        fileCount--;
        dirCount--;
        copyCallback(sourcePath, currentPath, cb);
        yellow("创建文件夹：" + currentPath);
        completeControl(cb);
      });
    }
  });
};

const copy = (sourcePath, currentPath, cb) => {
  flat++;
  fs.readdir(sourcePath, (err, paths) => {
    flat--;
    if (err) {
      throw err;
    }
    paths.forEach((path) => {
      if (path !== ".git" && path !== "package.json") {
        fileCount++;
      }
      const newSourcePath = sourcePath + "/" + path;
      const newCurrentPath = currentPath + "/" + path;
      fs.stat(newSourcePath, (err, stat) => {
        if (err) {
          throw err;
        }
        if (stat.isFile() && path !== "package.json") {
          const readSteam = fs.createReadStream(newSourcePath);
          const writeSteam = fs.createWriteStream(newCurrentPath);
          readSteam.pipe(writeSteam);
          green("创建文件：" + newCurrentPath);
          fileCount--;
          completeControl(cb);
        } else if (stat.isDirectory()) {
          if (path !== ".git" && path !== "package.json") {
            dirCount++;
            dirExist(newSourcePath, newCurrentPath, copy, cb);
          }
        }
      });
    });
  });
};

module.exports = function (res) {
  green("-----开始构建------");
  console.log("_dirname:", __dirname);
  const sourcePath = __dirname.slice(0, -3) + "template";
  blue("当前路径：" + process.cwd());
  /**修改package.json */
  revisePackageJson(res, sourcePath).then(() => {
    copy(sourcePath, process.cwd(), npm());
  });
};
