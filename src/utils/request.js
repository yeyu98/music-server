const { Axios } = require("axios");
const hackHeader = require("./hackHeader");

const axiosInstance = new Axios({
  timeout: "30000",
});

const request = {};

axiosInstance.interceptors.request.use((config) => {
  const configHeaders = config.headers;
  const headers = {
    "Accept-Encoding": "*",
    "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
  };
  const action = hackHeader(config.url);

  console.log(action);
  console.log(config);
  headers.referer = action.refererValue;

  if (action.isAddOrigin || (action.isReplaceOrigin && configHeaders.Origin === undefined)) {
    headers.origin = action.refererValue;
  }

  config.headers = {
    ...config.headers,
    ...headers,
  };

  console.log(config);

  return config;
}, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("response --->>>", response);
    return response;
  },
  (error) => Promise.reject(error),
);


request.get = (url, options) => axiosInstance.get(url, options).then((res) => res.data);

request.post = (url, data, options) => axiosInstance.post(url, data, options)
  .then((res) => res.data);

module.exports = request;
