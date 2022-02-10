# 介绍

mta-deploy-cli 是一个基于 Nodejs 进行快速部署的工具，结合 Vue CLI 打包后的项目一起使用，主要服务于 2021 猫态中台项目的前端页面部署

- 将`HTML`页面转换为 `base64字符串`，通过 `axios` 上传页面和静态资源到服务器


# 使用

`mta-deploy-cli`默认是在需要部署的项目的根目录读取`mdcli.config.js`配置文件，也可以通过命令：`mta-deploy-cli -config mdcli.config.prod.js`指定读取某个配置文件

`mdcli.config.js`配置文件示例：
```js
module.exports = {
  pageId: 20, // 页面ID
  Path: "login", // 页面访问路径
  TenantId: 10002, // 租户ID
  McatAppId:1005, // 猫态应用ID
  AppId: 1005, // 应用ID
  pageApi: "https://mcatplatformmanager.p.b2co.cn/api/PageRoute/Update", // 上传html页面的接口
  fileApi: "https://astaway.p.b2co.cn/api/fileservicepublic/File/upload", // 上传静态资源的接口
  clearCacheApi:"https://local-astaway-m.p.b2co.cn/pages/clearcache", // 清理缓存接口
  /**
   * 参与处理js代码的方法，返回一个字符串类型，将改变需要上传的文件内容
   * @param {String} code 当前读取的文件内容
   * @param {Object} file 当前文件的一些信息
   * @returns {String} 返回的文件内容，必须是字符串类型
   */
  jsCodeHandling(code) {
    return code.replace(
      /\$static_origin/g,
      `"+window.McatConfig.staticOrigin+"`
    );
  },
};

```

`mdcli.config.js`配置文件相关属性说明：

|属性名|类型|示例值|说明|
|  ----  | ----  | ---- | --- |
|pageId|Number|87|(选填)需要更新的页面ID，首次部署的时候可以为空|
|Path|String|spa|(必填)页面访问路径，例如spa，则是 域名/pages/spa |
|TenantId|Number|10002|(必填)租户ID|
|McatAppId|Number|1005|(必填)猫态应用ID|
|AppId|Number|1005|(必填)应用ID|
|pageApi|String|http://...|(必填)html页面更新的地址，防止经常改变，所以作为配置在外部配置|
|fileApi|String|http://...|(必填)二进制文件的上传地址，防止经常改变，所以作为配置在外部配置|
|clearCacheApi|String|http://...|(选填)部署成功后清理缓存，防止经常改变，所以作为配置在外部配置|
|includeEXT|Array[String]|[".js"]|(选填)可以上传的二进制文件扩展名,默认值 [".js", ".css", ".gif", ".png", ".jpg", ".jpeg", ".icon"]|
|jsCodeHandling|function(code, file)|jsCodeHandling(code){return code}|参与处理js代码的方法，返回一个字符串类型，将改变需要上传的文件内容。拥有两个参数，code:读取的文件的文本内容，类型String;file:该文件的一些基础属性，类型是Object|


修改需要部署的项目的`vue.config.js`文件，顶部添加`const mdcliConfig = require("./mdcli.config");`，显式设置`outputDir`和`indexPath`属性，并且约定`publicPath`：
```js
outputDir:"dist"
indexPath:"index.html"
publicPath: process.env.NODE_ENV === "production" ? `$static_origin/${mdcliConfig.Path}` : "./",
```

在命令行执行`md-cli`命令开始部署
```
md-cli
```
```
md-cli -proxy 127.0.0.1:8888
```

指定读取某个配置(默认读取的是 mdcli.config.js)
```
mta-deploy-cli -config mdcli.config.prod.js
```