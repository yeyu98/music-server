/*
 * @Author: lzy-Jerry
 * @Date: 2022-12-25 19:46:20
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-20 16:11:02
 * @FilePath: \music\music-server\src\controller\playListController.js
 * @Description: 歌单列表查询
 */
const cheerio = require("cheerio");
const request = require("../utils/request");
const { getParameterByName } = require("../utils/utils");
const C = require("../utils/constants");

/**
 * 歌单查询接口
 * 支持通用查询分页${offset}
 * 各平台api支持传入不同的入参查询各种方式后续再梳理
 * 目前所有从接口返回的data都需要通过parse解析，除了网易云..
*/

const getNeteasePlayList = async (ctx) => {
  const { offset, order = "hot", cat = "" } = ctx.query;
  const baseUrl = `http://music.163.com/discover/playlist/?order=${order}&cat=${cat}`;
  const targetUrl = offset ? `${baseUrl}&limit=35&offset=${offset}` : baseUrl;

  const data = await request.get(targetUrl);
  const $ = cheerio.load(data);
  const playList = [];

  $(".m-cvrlst li").each(function () {
    const coverImageUrl = $(this).find("img")[0].attribs.src;
    const { title } = $(this).find("div a")[0].attribs;
    const url = $(this).find("div a")[0].attribs.href;
    const listId = getParameterByName("id", url);
    const id = `neplaylist_${listId}`;
    const sourceUrl = `http://music.163.com/#/playlist?id=${listId}`;

    playList.push({
      coverImageUrl,
      title,
      url,
      listId,
      id,
      sourceUrl,
    });
  });
  return playList;
};

const getQQPlayList = async (ctx) => {
  const { offset = 0 } = ctx.query;
  const targetUrl = `https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?rnd=0.4781484879517406&g_tk=732560869&jsonpCallback=MusicJsonCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&categoryId=10000000&sortId=5&sin=${offset}&ein=${49 + offset}`;
  let data = await request.get(targetUrl);
  data = data.slice("MusicJsonCallback(".length, -")".length);
  data = JSON.parse(data);

  const playList = data?.data?.list.map((item) => ({
    coverImageUrl: item.imgurl,
    title: item.dissname,
    id: `qqplaylist_${item.dissid}`,
    sourceUrl: `http://y.qq.com/#type=taoge&id=${item.dissid}`,
  }));

  return playList;
};

const getKuWoPlayList = async (ctx) => {
  const { offset = 0 } = ctx.query;
  const targetUrl = `http://www.kuwo.cn/www/categoryNew/getPlayListInfoUnderCategory?type=taglist&digest=10000&id=37&start=${offset}&count=50`;
  let data = await request.get(targetUrl);
  data = JSON.parse(data);
  const playList = data?.data[0]?.data.map((item) => ({
    coverImageUrl: item.img,
    title: item.name,
    id: `kwplaylist_${item.id}`,
    source_url: `http://www.kuwo.cn/playlist/index?pid=${item.id}`,
  }));
  return playList;
};

const getKuGouPlayList = async (ctx) => {
  const { offset = 0 } = ctx.query;
  const targetUrl = `${"http://m.kugou.com/plist/index"
  + "&json=true&page="}${offset}`;
  let data = await request.get(targetUrl);
  data = JSON.parse(data);

  const playList = data.plist.list.info.map((item) => ({
    // NOTE 酷狗歌单封面存在400 || 240的尺寸需要在{size}中传入
    coverImageUrl: item.imgurl ? item.imgurl.replace("{size}", "400") : "",
    title: item.specialname,
    id: `kgplaylist_${item.specialid}`,
    source_url: "http://www.kugou.com/yy/special/single/{size}.html".replace("{size}", item.specialid),
  }));
  return playList;
};

const getBilibiliPlayList = async (ctx) => {
  const { offset = 0 } = ctx.query;
  const targetUrl = `https://www.bilibili.com/audio/music-service-c/web/menu/hit?ps=20&pn=${offset}`;
  let data = await request.get(targetUrl);
  data = JSON.parse(data);

  const playList = data.data.data.map((item) => ({
    coverImageUrl: item.cover,
    title: item.title,
    id: `biplaylist_${item.menuId}`,
    source_url: `https://www.bilibili.com/audio/am${item.menuId}`,
  }));
  return playList;
};

const registerPlayList = {
  [C.NETEASE]: getNeteasePlayList,
  [C.QQ]: getQQPlayList,
  [C.KUGOU]: getKuGouPlayList,
  [C.KUWO]: getKuWoPlayList,
  [C.BILIBILI]: getBilibiliPlayList,
};

module.exports = async (ctx, next) => {
  try {
    const { source = C.NETEASE } = ctx.query;
    const getPlayList = registerPlayList[source];
    const playList = await getPlayList(ctx);

    ctx.body = {
      status: 200,
      message: "success",
      data: playList,
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
