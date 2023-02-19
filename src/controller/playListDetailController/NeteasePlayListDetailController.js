
const _map = require("lodash/map");
const request = require("../../utils/request");
const { encryptRequestParams } = require("../../utils/utils");

/** ******** 网易云音乐 ************ */

const isPlayable = (songInfo) => ((songInfo.status >= 0) && (songInfo.fee !== 4));
/**
 * @description: 歌手名拼接
 * @param {*} artists
 * @param {*} artist
 * @return {*}
 */
const jointArtistName = (artists) => {
  if (artists?.length === 0) return "";
  if (artists?.length === 1) return artists[0].name;
  return _map(artists, (artist) => (artist.name)).join("/");
};


/**
 * NOTE 请求返回的数据需要parse一下
 * TODO 获取歌手名字时有可能存在数组第一个是歌曲名第二个开始才是歌手名
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
 * TODO 有时候请求专辑时会获取失败提示绑定手机号啥的，这个请求时会偶现得看看原因是啥
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
    artist: jointArtistName(songInfo.artists),
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
    artist: jointArtistName(songInfo.artists),
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


module.exports = {
  getNeteasePlayListDetail,
  getNeteaseAlbum,
  getNeteaseArtist,
};
