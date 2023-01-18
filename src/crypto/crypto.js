/*
 * @Author: lzy-Jerry
 * @Date: 2023-01-18 09:35:15
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-18 10:04:11
 * @FilePath: \music\music-server\src\crypto\crypto.js
 * @Description:
 */

const aesjs = require("./aes");
const { MD5 } = require("./md5");

const bigInt = require("./big-integer");

function aesEncrypt(text, secKey, ivString) {
  const pad = 16 - (text.length % 16);
  for (let i = 0; i < pad; i += 1) {
    text += String.fromCharCode(pad);
  }
  const key = aesjs.util.convertStringToBytes(secKey);
  // The initialization vector, which must be 16 bytes
  const iv = aesjs.util.convertStringToBytes(ivString);
  let textBytes = aesjs.util.convertStringToBytes(text);
  // eslint-disable-next-line new-cap
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const cipherArray = [];
  while (textBytes.length !== 0) {
    const block = aesCbc.encrypt(textBytes.slice(0, 16));
    Array.prototype.push.apply(cipherArray, block);
    textBytes = textBytes.slice(16);
  }
  let ciphertext = "";
  for (let i = 0; i < cipherArray.length; i += 1) {
    ciphertext += String.fromCharCode(cipherArray[i]);
  }
  ciphertext = btoa(ciphertext);
  return ciphertext;
}

function hexify(text) {
  return text.split("").map((x) => x.charCodeAt(0).toString(16)).join("");
}

function zfill(num, size) {
  let s = `${num}`;
  while (s.length < size) s = `0${s}`;
  return s;
}

function expmod(base, exp, mymod) {
  let result;
  if (exp.eq(0)) return bigInt(1, 10);
  if (exp.mod(bigInt(2, 10)).eq(0)) {
    let newexp = bigInt(exp);
    newexp = newexp.shiftRight(1);
    result = expmod(base, newexp, mymod).modPow(2, mymod);
    return result;
  }
  result = expmod(base, exp.subtract(bigInt(1, 10)), mymod).multiply(base).mod(mymod);
  return result;
}

function rsaEncrypt(text, pubKey, modulus) {
  const reversedText = text.split("").reverse().join("");
  const base = bigInt(hexify(reversedText), 16);
  const exp = bigInt(pubKey, 16);
  const mod = bigInt(modulus, 16);
  const bigNumber = expmod(base, exp, mod);
  const rs = bigNumber.toString(16);
  return zfill(rs, 256).toLowerCase();
}

module.exports = { aesEncrypt, rsaEncrypt, MD5 };
