// 合并根目录 .env 环境变量
const path = require("path");
// 日志打印配置
const { getFileList } = require("./utils/index");
const uploadBinaryFile = require("./strategy/uploadBinaryFile");
const uploadIndexPage = require("./strategy/uploadIndexPage");
const vueConfig = require(path.join(process.cwd(), "vue.config"));

module.exports = function () {
  const filePathList = getFileList(vueConfig.outputDir);

  for (let fileItem of filePathList) {
    // 上传二进制文件
    if (fileItem.basename === vueConfig.indexPath) {
      uploadIndexPage(fileItem);
      break;
    }
  }

  // 上传二进制文件
  uploadBinaryFile(filePathList);
};
