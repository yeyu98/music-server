/*
 * @Author: lzy-Jerry
 * @Date: 2023-01-05 22:52:33
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-18 10:43:23
 * @FilePath: \music\music-server\.eslintrc.js
 * @Description: eslint 配置
 */
const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: ["airbnb-base"],
  rules: {
    // 双引号
    quotes: ["error", "double"],
    // 强制驼峰写法
    camelcase: "warn",
    "no-multiple-empty-lines": ["error", { max: 5 }],
    // 确保在导入路径内一致使用文件扩展名
    "import/extensions": "off",
    // 确保导入指向可以解析的文件/模块
    "import/no-unresolved": "off",
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    // 禁止匿名函数
    "func-names": "off",
    // 设置import可以导入devDependencies中的包
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
  },
});
