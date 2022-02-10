const path = require("path");
const fs = require("fs");
const vueConfig = require(path.join(process.cwd(), "vue.config"));
const service = require("../service/index");
const { string2base64 } = require("../utils/index");
const mdconfig = require("../mdConfig");

// 上传首页
module.exports = async function (fileItem) {
  if (fileItem.basename !== vueConfig.indexPath) return;
  // 读取首页
  fs.readFile(fileItem.fullpath, "utf8", async (err, data) => {
    if (err) throw err;
    // 遍历上传不通类型的活动首页
    const Content = string2base64(data);
    global.logger.info(`html的bese64：`, Content);
    const [, homeData] = await service.uploadActIndexPage(Content);
    global.logger.info(`上传html 成功：`, homeData);
    if(mdconfig.clearCacheApi){
      global.logger.info(`清理缓存：`, mdconfig.clearCacheApi);
      const [, cacheData] = await service.clearPageCache();
      global.logger.info(`清理缓存成功`, cacheData);
    }
  });
};
