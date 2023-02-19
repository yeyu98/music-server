/*
 * @Author: lzy-Jerry
 * @Date: 2022-12-25 19:40:14
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-02-19 21:25:11
 * @FilePath: \music\music-server\src\controller\index.js
 * @Description:
 */
const playListController = require("./playListController"); // 歌单列表
const playListDetailController = require("./playListDetailController/index"); // 歌单详情
const lyricController = require("./lyricController"); // 歌词
const searchController = require("./searchController"); // 搜索
const playerUrlController = require("./playerUrlController"); // 播放地址
const defaultController = require("./defaultController"); // 默认

module.exports = {
  defaultController,
  playListController,
  playListDetailController,
  lyricController,
  searchController,
  playerUrlController,
};
