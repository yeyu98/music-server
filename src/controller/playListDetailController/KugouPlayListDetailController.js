/*
 * @Author: lzy-Jerry
 * @Date: 2023-02-19 21:33:44
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-02-23 21:05:11
 * @FilePath: src\controller\playListDetailController\KugouPlayListDetailController.js
 * @Description:
 */

const _map = require("lodash/map");
const request = require("../../utils/request");

/** ******** 酷狗音乐 ************ */

// function async_process_list(data_list, handler, handler_extra_param_list, callback) {
//   const fnDict = {};
//   data_list.forEach((item, index) => {
//     fnDict[index] = cb => handler(index, item, handler_extra_param_list, cb);
//   });
//   // 并发请求
//   async.parallel(fnDict,
//     (_, results) => callback(null, data_list.map((item, index) => results[index])));
// }

// TODO 酷狗获取歌单详情列表重定向 暂时先不动
const getKugouPlayListDetail = async (listId) => {
  // const targetUrl = `http://m.kugou.com/plist/list/${listId}?json=true`;
  // const response = await request.get(targetUrl);
  // const { data } = response;
  // console.log(targetUrl);
  // return response;
  // const playListInfo = {
  //   coverImgUrl: data.info.list.imgurl
  //     ? data.info.list.imgurl.replace("{size}", "400") : "",
  //   title: data.info.list.specialname,
  //   id: `kgplaylist_${data.info.list.specialid}`,
  //   sourceUrl: "http://www.kugou.com/yy/special/single/{size}.html"
  //     .replace("{size}", data.info.list.specialid),
  // };
  // console.log(playListInfo);

  // return {
  //   playListInfo,
  //   playList,
  // };
  // async_process_list(
  //   data.list.list.info,
  //   kg_render_playlist_result_item,
  //   [hm],
  //   (_, tracks) => resolve({
  //     tracks,
  //     info,
  //   }),
  // );
};

const getKugouAlbum = async () => {

};

const getKugouArtist = async (artistId) => {
  // const targetUrl = `http://mobilecdnbj.kugou.com/api/v3/singer/info?singerid=${artistId}`;
  // const response = await request.get(targetUrl);

  // let { data } = response;
  // data = JSON.parse(data);

  // return data;
  // const info = {
  //   cover_img_url: data.data.imgurl.replace("{size}", "400"),
  //   title: data.data.singername,
  //   id: `kgartist_${artist_id}`,
  //   source_url: "http://www.kugou.com/singer/{id}.html".replace("{id}", artist_id),
  // };
};


module.exports = {
  getKugouPlayListDetail,
  getKugouAlbum,
  getKugouArtist,
};
