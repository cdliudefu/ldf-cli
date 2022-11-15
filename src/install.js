const which = require("which");

const findNpm = () => {
  const npms = process.platform === "win32" ? ["npm.cmd"] : ["npm"];
  for (let i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log("use npm:" + npms[i]);
      return npms[i];
    } catch (error) {
      throw new Error("please install npm");
    }
  }
};

const runCmd = (cmd, args, fn) => {
  args = args || [];
  let runner = require("child_process").spawn(cmd, args, {
    stdio: "inherit",
  });

  runner.on("close", (code) => {
    if (fn) {
      fn(code);
    }
  });
};

module.exports = function (installArg = ["install"]) {
  const npm = findNpm();
  return function (done) {
    runCmd(which.sync(npm), installArg, () => {
      done && done();
    });
  };
};
