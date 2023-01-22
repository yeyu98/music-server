/*
 * @Author: lzy-Jerry
 * @Date: 2022-12-25 19:46:30
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-22 22:57:46
 * @FilePath: \music\music-server\src\controller\playListDetailController.js
 * @Description: 歌单详情查询
 */

const _map = require("lodash/map");
const request = require("../utils/request");
const { encryptRequestParams } = require("../utils/utils");


const isPlayable = (songInfo) => ((songInfo.status >= 0) && (songInfo.fee !== 4));
const jointArtistName = (artists) => _map(artists, (artist) => (artist.name)).join("/");

/**
 * NOTE 请求返回的数据需要parse一下
 * @description: 网易云获取歌单详情api
 * @param {*} id
 * @return {*}
 */
const getNeteasePlayListDetail = async (playListId) => {
  const targetUrl = "http://music.163.com/weapi/v3/playlist/detail";
  const d = {
    id: playListId,
    offset: 0,
    total: true,
    limit: 1000,
    n: 1000,
    csrf_token: "",
  };
  const encryptData = encryptRequestParams(d);
  let data = await request.post(targetUrl, encryptData, {
    isFormData: true,
  });
  data = JSON.parse(data);

  const playListData = data?.playlist;

  const playListInfo = {
    id: `neplaylist_${playListId}`,
    coverImgUrl: playListData?.coverImgUrl,
    title: playListData?.name,
    source_url: `http://music.163.com/#/playlist?id=${playListId}`,
  };

  const playList = _map(playListData?.tracks, (item) => ({
    id: `netrack_${item.id}`,
    title: item.name,
    artist: item.ar[0].name,
    artistId: `neartist_${item.ar[0].id}`,
    album: item.al.name,
    albumId: `nealbum_${item.al.id}`,
    sourceUrl: `http://music.163.com/#/song?id=${item.id}`,
    imgUrl: item.al.picUrl,
    url: `netrack_${item.id}`,
    source: "netease",
  }));

  return {
    playListInfo,
    playList,
  };
};

/**
 * TODO 某些专辑里面可能含有vip音乐此时会返回提示绑定手机后续需要处理一下这个error
 * NOTE 返回的data依然需要parse
 * @description: 获取网易云歌手专辑
 * @param {*} albumId
 * @return {*}
 */
const getNeteaseAlbum = async (albumId) => {
  const targetUrl = `http://music.163.com/api/album/${albumId}`;

  let data = await request.get(targetUrl);
  data = JSON.parse(data);

  const albumData = data?.album;

  const albumInfo = {
    coverImgUrl: albumData?.picUrl,
    title: albumData?.name,
    id: `nealbum_${albumData?.id}`,
    sourceUrl: `http://music.163.com/#/album?id=${albumData?.id}`,
  };

  const album = _map(albumData?.songs, (songInfo) => ({
    id: `netrack_${songInfo.id}`,
    title: songInfo.name,
    artist: songInfo.artists[0].name,
    artistId: `neartist_${songInfo.artists[0].id}`,
    album: songInfo.album.name,
    albumId: `nealbum_${songInfo.album.id}`,
    source: "netease",
    sourceUrl: `http://music.163.com/#/song?id=${songInfo.id}`,
    imgUrl: songInfo.album.picUrl,
    url: `netrack_${songInfo.id}`,
    disabled: !isPlayable(songInfo),
  }));

  return {
    album,
    albumInfo,
  };
};

/**
 * @description: 获取网易云歌手下对应的歌曲
 * @param {*} artistId
 * @return {*}
 */
const getNeteaseArtist = async (artistId) => {
  const targetUrl = `http://music.163.com/api/artist/${artistId}`;

  let data = await request.get(targetUrl);
  data = JSON.parse(data);

  const artistData = data?.artist;
  console.log(data);

  const artistInfo = {
    cover_img_url: artistData.picUrl,
    title: artistData.name,
    id: `neartist_${artistData.id}`,
    source_url: `http://music.163.com/#/artist?id=${data.artist.id}`,
  };

  const artist = _map(data?.hotSongs, (songInfo) => ({
    id: `netrack_${songInfo.id}`,
    title: songInfo.name,
    artist: songInfo.artists.length > 1
      ? jointArtistName(songInfo.artists)
      : songInfo.artists[0].name,
    artist_id: `neartist_${songInfo.artists[0].id}`,
    album: songInfo.album.name,
    album_id: `nealbum_${songInfo.album.id}`,
    source: "netease",
    source_url: `http://music.163.com/#/song?id=${songInfo.id}`,
    img_url: songInfo.album.picUrl,
    url: `netrack_${songInfo.id}`,
    disabled: !isPlayable(songInfo),
  }));

  return {
    artist,
    artistInfo,
  };
};

const musicTypeMap = {
  neplaylist: getNeteasePlayListDetail,
  nealbum: getNeteaseAlbum,
  neartist: getNeteaseArtist,
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

