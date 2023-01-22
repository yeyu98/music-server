/*
 * @Author: lzy-Jerry
 * @Date: 2023-01-05 21:26:02
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-22 21:30:07
 * @FilePath: \music\music-server\src\utils\request.js
 * @Description:
 */
const { Axios } = require("axios");
const qs = require("qs");
const hackHeader = require("./hackHeader");

const axiosInstance = new Axios({
  timeout: "30000",
});

const request = {};

axiosInstance.interceptors.request.use((config) => {
  const configHeaders = config.headers;
  let headers = {
    "Accept-Encoding": "*",
    "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
  };
  const action = hackHeader(config.url);
  headers.referer = action.refererValue;
  if (action.isAddOrigin || (action.isReplaceOrigin && configHeaders.Origin === undefined)) {
    headers.origin = action.refererValue;
  }

  // NOTE 网易云api中的歌单详情、搜索、歌词、bootstrap以及bilibili中的artist都需要form序列化
  if (config.isFormData) {
    headers = {
      ...headers,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    config.data = qs.stringify(config.data);
  }

  config.headers = {
    ...config.headers,
    ...headers,
  };

  console.log("config --->>>", config);

  return config;
}, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);


request.get = (url, options) => axiosInstance.get(url, options).then((res) => res.data);

request.post = (url, data, options) => axiosInstance.post(url, data, options)
  .then((res) => res.data);

module.exports = request;
