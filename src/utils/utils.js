/*
 * @Author: lzy-Jerry
 * @Date: 2023-01-05 21:27:05
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-18 09:47:20
 * @FilePath: \music\music-server\src\utils\utils.js
 * @Description: 工具函数
 */

const { aesEncrypt, rsaEncrypt } = require("../crypto/crypto");

/**
 * @description: url上获取指定参数
 * @param {*} name
 * @param {*} url
 * @return {*}
 */
function getParameterByName(name, url) {
  // 从url上取某个参数的值
  // if (!url) url = window.location.href;
  const replacedName = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${replacedName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * @description: 生成指定长度hash串
 * @param {*} size
 * @return {*}
 */
function getRandomHexString(size) {
  const result = [];
  const choice = "012345679abcdef".split("");
  for (let i = 0; i < size; i += 1) {
    const index = Math.floor(Math.random() * choice.length);
    result.push(choice[index]);
  }
  return result.join("");
}

/**
 * @description: 生成加密参数只针对网易云api
 * @param {*} text
 * @return {*}
 */
const encryptRequestParams = (text) => {
  const modulus = `00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a8
  76aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b
  7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7`;
  const nonce = "0CoJUm6Qyw8W8jud";
  const pubKey = "010001";
  text = JSON.stringify(text);
  const secKey = getRandomHexString(16);
  const ivString = "0102030405060708";
  const encText = aesEncrypt(aesEncrypt(text, nonce, ivString), secKey, ivString);
  const encSecKey = rsaEncrypt(secKey, pubKey, modulus);
  const data = {
    params: encText,
    encSecKey,
  };

  return data;
};


module.exports = {
  getParameterByName,
  encryptRequestParams,
};
