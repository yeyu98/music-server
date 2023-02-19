/*
 * @Author: lzy-Jerry
 * @Date: 2022-12-25 13:43:20
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-02-19 21:07:07
 * @FilePath: \music\music-server\src\index.js
 * @Description:
 */
const Koa = require("koa");

const app = new Koa();
const router = require("./router/index");

const PORT = 30000;

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);

console.log(`http://localhost:${PORT}`);
