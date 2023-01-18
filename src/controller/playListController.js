/*
 * @Author: lzy-Jerry
 * @Date: 2022-12-25 19:46:20
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-18 10:44:15
 * @FilePath: \music\music-server\src\controller\playListController.js
 * @Description: 歌单列表查询
 */
const cheerio = require("cheerio");
const request = require("../utils/request");
const { getParameterByName } = require("../utils/utils");

/**
 * 歌单查询接口
 * 支持查询顺序${order}、分页${offset}、分类${cat}
*/

const getNeteasePlayList = async (ctx) => {
  const { offset, order = "hot", cat = "" } = ctx.query;
  const baseUrl = `http://music.163.com/discover/playlist/?order=${order}&cat=${cat}`;
  const targetUrl = offset ? `${baseUrl}&limit=35&offset=${offset}` : baseUrl;

  const response = await request.get(targetUrl);
  const { data } = response;
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
  const response = await request.get(targetUrl);
  let { data } = response;
  data = data.slice("MusicJsonCallback(".length, -")".length);
  data = JSON.parse(data);

  const playList = data.data.list.map((item) => ({
    coverImageUrl: item.imgurl,
    title: item.dissname,
    id: `qqplaylist_${item.dissid}`,
    sourceUrl: `http://y.qq.com/#type=taoge&id=${item.dissid}`,
  }));

  return playList;
};

const KuwoPlayList = (ctx) => {
  const { offset = 0 } = ctx.query;
  const targetUrl = `http://www.kuwo.cn/www/categoryNew/getPlayListInfoUnderCategory?type=taglist&digest=10000&id=37&start=${offset}&count=50`;
  const response = request.get(targetUrl);
  const { data = [] } = response.data;
  const playList = data[0]?.data?.map((item) => ({
    coverImageUrl: item.img,
    title: item.name,
    id: `kwplaylist_${item.id}`,
    source_url: `http://www.kuwo.cn/playlist/index?pid=${item.id}`,
  }));
  return playList;
};


module.exports = async (ctx, next) => {
  try {
    const playList = await KuwoPlayList(ctx);

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
    console.log(err);
  }
};
