/*
 * @Author: lzy-Jerry
 * @Date: 2023-02-19 21:29:53
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-02-24 08:46:37
 * @Description:
 */

const _map = require("lodash/map");
const request = require("../../utils/request");


/** ******** 酷我音乐 ************ */

function htmlDecode(str) {
  return str.replace(/(&nbsp;)/g, " ");
}

const getCoverImageUrl = async (coverId) => {
  const targetUrl = `${"http://artistpicserver.kuwo.cn/pic.web?"
    + "type=rid_pic&pictype=url&size=240&rid="}${coverId}`;
  const imgUrl = await request.get(targetUrl);
  return imgUrl;
};


const getKuwoPlayListDetail = async (listId) => {
  const targetUrl = `${"http://nplserver.kuwo.cn/pl.svc?"
  + "op=getlistinfo&pn=0&rn=200&encode=utf-8&keyset=pl2012&pcmp4=1"
  + "&pid="}${listId}&vipver=MUSIC_9.0.2.0_W1&newver=1`;

  let data = await request.get(targetUrl);
  data = JSON.parse(data);

  const playListInfo = {
    coverImgUrl: data.pic,
    title: data.title,
    id: `kwplaylist_${data.id}`,
    sourceUrl: `http://www.kuwo.cn/playlist/index?pid=${data.id}`,
  };

  // 用index为索引生成两个数组一个结果集，一个图片请求集 等请求都拿到之后再遍历结果集 将所有的图片都逐一塞回
  // NOTE 耗时暂时勉强过的去... 后续优化

  const requestImageCallbacks = [];
  const playList = _map(data?.musiclist, (item) => {
    requestImageCallbacks.push(getCoverImageUrl(item.id));
    return {
      id: `kwtrack_${item.id}`,
      title: htmlDecode(item.name),
      artist: item.artist,
      artistId: `kwartist_${item.artistid}`,
      album: htmlDecode(item.album),
      albumId: `kwalbum_${item.albumid}`,
      source: "kuwo",
      sourceUrl: `http://www.kuwo.cn/yinyue/${item.id}`,
      imgUrl: "",
      url: `xmtrack_${item.id}`,
      lyricUrl: item.id,
    };
  });
  const imageList = await Promise.all(requestImageCallbacks);
  playList.forEach((item, index) => {
    item.imgUrl = imageList[index];
  });


  return {
    size: playList.length,
    playList,
    playListInfo,
  };
};
const getKuwoAlbum = async () => {

};
const getKuwoArtist = async () => {

};


module.exports = {
  getKuwoPlayListDetail,
  getKuwoArtist,
  getKuwoAlbum,
};
