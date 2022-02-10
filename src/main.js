#!/usr/bin/env node
require("./plugins/log4js");
require("./plugins/spinner");
const { version } = require("../package.json");
if (process.argv.includes("-v")) {
  // 打印版本
  console.log(`v${version}`);
} else {
  // 开始打包
  const coreHandler = require("./core/index");
  global.spinner.start();
  coreHandler();
}
