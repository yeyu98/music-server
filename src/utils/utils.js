import { Axios } from "axios";
import hackHeader from "./hackHeader";

const axiosInstance = new Axios({
  timeout: "30000",
});

axiosInstance.interceptors.request.use((config) => {
  const configHeaders = config.headers;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
  };
  const action = hackHeader(config.url);
  headers.Referer = action.refererValue;

  if (action.isAddOrigin || (action.isReplaceOrigin && configHeaders.Origin === undefined)) {
    headers.Origin = action.refererValue;
  }


  config.headers = {
    ...config.headers,
    ...headers,
  };


  return config;
}, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => Promise.reject(error),
);
