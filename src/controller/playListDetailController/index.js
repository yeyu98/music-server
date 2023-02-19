/*
 * @Author: lzy-Jerry
 * @Date: 2022-12-25 19:46:30
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-02-19 21:38:48
 * @FilePath: \music\music-server\src\controller\playListDetailController\index.js
 * @Description:
 */

const Netease = require("./NeteasePlayListDetailController");
const Kuwo = require("./KwPlayListDetailController");
const QQ = require("./QQPlayListDetailController");
const Kugou = require("./KugouPlayListDetailController");
const Bilibili = require("./BilibiliPlayListDetailController");


const musicTypeMap = {
  neplaylist: Netease.getNeteasePlayListDetail,
  nealbum: Netease.getNeteaseAlbum,
  neartist: Netease.getNeteaseArtist,

  qqplaylist: QQ.getQQPlayListDetail,
  qqalbum: QQ.getQQAlbum,
  qqartist: QQ.getQQArtist,

  kwplaylist: Kuwo.getKuwoPlayListDetail,
  kwalbum: Kuwo.getKuwoAlbum,
  kwartist: Kuwo.getKuwoArtist,

  kgplaylist: Kugou.getKugouPlayListDetail,
  kgalbum: Kugou.getKugouAlbum,
  kgartist: Kugou.getKugouArtist,

  biplaylist: Bilibili.getBilibiliPlayListDetail,
  bialbum: Bilibili.getBilibiliAlbum,
  biartist: Bilibili.getBilibiliArtist,
};

module.exports = async (ctx, next) => {
  try {
    const { listId = "" } = ctx.query;
    const [type, id] = listId.split("_");
    const getPlayListDetail = musicTypeMap[type];

    const playListDetail = await getPlayListDetail(id);

    ctx.body = {
      status: 200,
      message: "success",
      data: playListDetail,
    };

    next();
  } catch (err) {
    ctx.body = {
      status: 500,
      message: "failed",
    };
    console.log("err --->>>", err);
  }
};

