// 日志打印配置
const path = require("path");
const log4js = require("log4js");
log4js.configure({
  appenders: {
    file: { type: "file", filename: path.join(process.cwd(), "deploy.log") },
  },
  categories: { default: { appenders: ["file"], level: "info" } },
});
global.logger = log4js.getLogger();
