const fs = require("fs");
const path = require("path");

// 字符串转换成base64字符串
exports.string2base64 = function (string) {
  return Buffer.from(string).toString("base64");
};

/**
 * 深层读取文件夹里面的文件列表
 * @param {String} dir 文件夹路径
 * @param {Array[String]} excludeEXT 需要排除的扩展名文件
 */
exports.getFileList = function (dir) {
  const list = [];
  const stack = [dir];
  while (stack.length > 0) {
    const childPath = stack.pop();
    const arr = fs.readdirSync(childPath);
    arr.forEach((item) => {
      const fullpath = path.join(childPath, item);
      const stats = fs.statSync(fullpath);
      if (stats.isDirectory()) {
        stack.push(fullpath);
      } else {
        const extname = path.extname(fullpath);
        const basename = path.basename(fullpath);
        const dirName = childPath.replace(dir, "").replace("\\", "");
        list.push({
          fullpath,
          dirName,
          extname,
          basename,
        });
      }
    });
  }
  return list;
};

// async 方法的处理
exports.createCatchAsyncFun = (errorHandle) => {
  return async (fn) => {
    try {
      return [null, await fn];
    } catch (error) {
      typeof errorHandle === "function" && errorHandle(error);
      return [error, null];
    }
  };
};

// 获取 form-data 实例的长度
exports.getFormLength = (form) => {
  return new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        reject(err);
      }
      resolve(length);
    });
  });
};

// 读取目录下的模块文件
const load = function (path, name) {
  if (name) {
    return require(path + name);
  }
  return require(path);
};
exports.loadDir = function (dir) {
  const patcher = {};
  fs.readdirSync(dir).forEach(function (filename) {
    if (!/\.js$/.test(filename)) {
      return;
    }
    var name = path.basename(filename, ".js");
    var _load = load.bind(null, path.join(dir, name));

    patcher.__defineGetter__(name, _load);
  });

  return patcher;
};
