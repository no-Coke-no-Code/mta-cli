const mdconfig = require("../mdConfig");
const FormData = require("form-data");
const fs = require("fs");
const service = require("../service/index");
const { getFormLength } = require("../utils/index");
const string2fileStream = require("string-to-file-stream");
// 需要用二进制接口上传的扩展名文件
const binaryIncludeEXT =
  mdconfig.includeEXT && mdconfig.includeEXT.length
    ? mdconfig.includeEXT
    : [".js", ".css", ".gif", ".png", ".jpg", ".jpeg", ".icon"];

// 上传二进制的资源文件
module.exports = async function uploadBinaryFile(fileList) {
  if (!fileList || !fileList.length) return;
  const binaryFileList = fileList.filter((fileItem) =>
    binaryIncludeEXT.includes(fileItem.extname)
  );
  if (binaryFileList.length === 0) return;
  const form = new FormData();
  binaryFileList.forEach((fileItem, index) => {
    // 中间处理js代码
    if ( fileItem.extname === '.js' &&  typeof mdconfig.jsCodeHandling === "function") {
      const data = fs.readFileSync(fileItem.fullpath);
      form.append(
        "",
        string2fileStream(mdconfig.jsCodeHandling(data.toString(), fileItem))
      ); // 文件内容
    } else {
      form.append("", fs.createReadStream(fileItem.fullpath)); // 文件内容
    }

    form.append(
      `fileName${index}`,
      `${mdconfig.Path}/${fileItem.dirName}/${fileItem.basename}`
    ); // 文件名
  });
  form.append("isRandomName", "false"); // 不重命名
  const length = await getFormLength(form);
  const headers = form.getHeaders(); // 必须
  headers["content-length"] = length; // 必须
  // 上传到服务器
  const [, fileData] = await service.uploadFile(form, headers);

  global.logger.info("二进制文件上传：" + JSON.stringify(fileData.Data));
};
