/*
 * @Author: lzy-Jerry
 * @Date: 2022-12-25 19:46:20
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-16 21:11:36
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

module.exports = async (ctx, next) => {
  try {
    const { offset, order = "hot", cat = "" } = ctx.query;
    const baseUrl = `http://music.163.com/discover/playlist/?order=${order}&cat=${cat}`;
    const targetUrl = offset ? `${baseUrl}&limit=35&offset=${offset}` : baseUrl;

    const resp = await request.get(targetUrl);
    const { data } = resp;
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
