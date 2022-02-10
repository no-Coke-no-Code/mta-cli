const path = require("path");
const { version } = require(path.join(process.cwd(), "package.json"));
const https = require("https");
const axios = require("axios");
const options = {
  baseURL: "",
  timeout: 15 * 60 * 1000,
  // 不校验https证书
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
};

// 获取是否代理的参数
if (process.argv.includes("-proxy")) {
  const index = process.argv.findIndex((item) => item === "-proxy");
  const [host, port] = process.argv[index + 1].split(":");
  options.proxy = {
    host,
    port,
  };
}

const instance = axios.create(options);
// 计算请求次数
let httpCount = 0;

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    httpCount++;
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { data, config } = response;
    // 判断此接口是否需要完整返回后端返回的数据
    if (config.isReturnAll) {
      if (--httpCount === 0) {
        global.spinner.stop(true);
        console.log("版本：v" + version + " 部署成功 ");
      }
      return data;
    }
    if (data && data.Code === 1) {
      if (--httpCount === 0) {
        global.spinner.stop(true);
        console.log("版本：v" + version + " 部署成功 ");
      }
      return response.data;
    } else {
      return Promise.reject(data);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

module.exports = instance;
