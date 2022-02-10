const path = require("path");
const mdconfig = require("../mdConfig");
const { version } = require(path.join(process.cwd(), "package.json"));
const $http = require("./http");
const { createCatchAsyncFun } = require("../utils/index");
const catchAsyncFun = createCatchAsyncFun((error) => {
  // 错误日志上报 todo
  global.logger.error("网络请求模块报错", error.response || error);
  global.spinner.stop(true);
  console.error("版本：v" + version + " 部署失败，详细请查看 deploy.log 日志");
  throw 996;
});

module.exports = {
  // 上传二进制文件
  uploadFile(form, headers) {
    return catchAsyncFun(
      $http({
        url: mdconfig.fileApi,
        method: "POST",
        data: form,
        headers,
      })
    );
  },
  // 上传HTML
  uploadActIndexPage(Content, headers) {
    const data = {
      Path: mdconfig.Path,
      TenantId: mdconfig.TenantId,
      AppId: mdconfig.AppId,
      McatAppId: mdconfig.McatAppId,
      Content,
      Folder: "pages",
    };
    if (mdconfig.pageId) {
      data.Id = mdconfig.pageId;
    }
    return catchAsyncFun(
      $http({
        url: mdconfig.pageApi,
        method: "POST",
        data,
        headers,
      })
    );
  },
  // 清理缓存
  clearPageCache() {
    return catchAsyncFun(
      $http({
        url: mdconfig.clearCacheApi,
        method: "GET",
        isReturnAll:true
      })
    );
  },
};
