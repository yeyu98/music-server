/*
 * @Author: lzy-Jerry
 * @Date: 2023-02-19 21:30:13
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-02-20 20:09:30
 * @Description:
 */

const _map = require("lodash/map");
const request = require("../../utils/request");

/** ******** QQ音乐 ************ */

function getImageUrl(qqimgid, type) {
  if (qqimgid == null) {
    return "";
  }
  let category = "";
  if (type === "artist") {
    category = "mid_singer_300";
  }
  if (type === "album") {
    category = "mid_album_300";
  }

  const s = [category, qqimgid[qqimgid.length - 2], qqimgid[qqimgid.length - 1], qqimgid].join("/");
  const url = `http://imgcache.qq.com/music/photo/${s}.jpg`;
  return url;
}

const isPlayAble = (song) => {
  const switchFlag = song.switch.toString(2).split("");
  switchFlag.pop();
  switchFlag.reverse();
  const playFlag = switchFlag[0];
  const tryFlag = switchFlag[13];
  return ((playFlag === "1") || ((playFlag === "1") && (tryFlag === "1")));
};

const converSongInfo = (song) => ({
  id: `qqtrack_${song.songmid}`,
  title: song.songname,
  artist: song.singer[0].name,
  artistId: `qqartist_${song.singer[0].mid}`,
  album: song.albumname,
  albumId: `qqalbum_${song.albummid}`,
  imgUrl: getImageUrl(song.albummid, "album"),
  source: "qq",
  sourceUrl: `http://y.qq.com/#type=song&mid=${song.songmid}&tpl=yqq_song_detail`,
  url: `qqtrack_${song.songmid}`,
  disabled: !isPlayAble(song),
});

const getQQPlayListDetail = async (playListId) => {
  const targetUrl = `${"http://i.y.qq.com/qzone-music/fcg-bin/fcg_ucc_getcdinfo_"
  + "byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&jsonpCallback="
  + "jsonCallback&nosign=1&disstid="}${playListId}&g_tk=5381&loginUin=0&hostUin=0`
  + "&format=jsonp&inCharset=GB2312&outCharset=utf-8&notice=0"
  + "&platform=yqq&jsonpCallback=jsonCallback&needNewCode=0";

  let data = await request.get(targetUrl);
  data = data.slice("jsonCallback(".length, -")".length);
  data = JSON.parse(data);

  const playListInfo = {
    coverImgUrl: data.cdlist[0].logo,
    title: data.cdlist[0].dissname,
    id: `qqplaylist_${playListId}`,
    sourceUrl: `http://y.qq.com/#type=taoge&id=${playListId}`,
  };

  const playList = _map(data.cdlist[0].songlist, (item) => converSongInfo(item));

  return {
    playListInfo,
    playList,
  };
};

const getQQAlbum = async (albumId) => {
  const targetUrl = `${"http://i.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg"
  + "?platform=h5page&albummid="}${albumId}&g_tk=938407465`
  + "&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8"
  + "&notice=0&platform=h5&needNewCode=1&_=1459961045571"
  + "&jsonpCallback=asonglist1459961045566";

  let data = await request.get(targetUrl);
  data = data.slice(" asonglist1459961045566(".length, -")".length);
  data = JSON.parse(data);

  const albumInfo = {
    coverImgUrl: getImageUrl(albumId, "album"),
    title: data.data.name,
    id: `qqalbum_${albumId}`,
    sourceUrl: `http://y.qq.com/#type=album&mid=${albumId}`,
  };

  const album = data.data.list.map((item) => converSongInfo(item));
  return {
    album,
    albumInfo,
  };
};

// TODO 接口失效
const getQQArtist = async (artistId) => {
  const targetUrl = `${"http://i.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg"
  + "?platform=h5page&order=listen&begin=0&num=50&singermid="}${artistId}`
  + "&g_tk=938407465&uin=0&format=jsonp&"
  + "inCharset=utf-8&outCharset=utf-8&notice=0&platform="
  + "h5&needNewCode=1&from=h5&_=1459960621777&"
  + "jsonpCallback=ssonglist1459960621772";

  let data = await request.get(targetUrl);
  data = data.slice(" ssonglist1459960621772(".length, -")".length);
  data = JSON.parse(data);

  const artistInfo = {
    coverImgUrl: getImageUrl(artistId, "artist"),
    title: data.data.singer_name,
    id: `qqartist_${artistId}`,
    sourceUrl: `http://y.qq.com/#type=singer&mid=${artistId}`,
  };

  const artist = data.data.list.map((item) => converSongInfo(item.musicData));
  return {
    artist,
    artistInfo,
  };
};


module.exports = {
  getQQPlayListDetail,
  getQQAlbum,
  getQQArtist,
};
