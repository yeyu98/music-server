/*
 * @Author: lzy-Jerry
 * @Date: 2023-01-05 22:42:33
 * @LastEditors: lzy-Jerry
 * @LastEditTime: 2023-01-18 11:23:06
 * @FilePath: \music\music-server\src\utils\hackHeader.js
 * @Description:
 */
const hackHeader = (url) => {
  let isReplaceOrigin = true; // 是否替换origin
  let isAddOrigin = true; // 是否添加origin
  let refererValue = "";

  const NETEASE = "://music.163.com/";
  const GET_USER_CONTENT = "://gist.githubusercontent.com/";

  const C_Y_QQ = "c.y.qq.com/";
  const I_Y_QQ = "i.y.qq.com/";
  const MUISC_QQ = "music.qq.com/";
  const QQ_MUSIC_QQ = "qqmusic.qq.com/";
  const IMG_CACHE_QQ = "imgcache.qq.com/";

  const KU_GOU = ".kugou.com/";
  const KU_WO = ".kuwo.cn/";
  const BILIBILI = ".bilibili.com/";

  const NETEASE_MUSIC = "http://music.163.com/"; // 网易云
  const GIST = "https://gist.githubusercontent.com/"; // 不知名页面
  const QQ_MUSIC = "https://y.qq.com/"; // 酷狗音乐
  const KU_GOU_MUSIC = "http://www.kugou.com/"; // 酷狗音乐
  const KU_WO_MUSIC = "http://www.kuwo.cn/"; // 酷我音乐
  const BILIBILI_MUSIC = "http://www.bilibili.com/"; // 哔哩哔哩音乐

  const urlMatch = {
    [NETEASE]: NETEASE_MUSIC,
    [GET_USER_CONTENT]: GIST,
    [KU_GOU]: KU_GOU_MUSIC,
    [KU_WO]: KU_WO_MUSIC,
    [BILIBILI]: BILIBILI_MUSIC,
    [C_Y_QQ]: QQ_MUSIC,
    [I_Y_QQ]: QQ_MUSIC,
    [MUISC_QQ]: QQ_MUSIC,
    [QQ_MUSIC_QQ]: QQ_MUSIC,
    [IMG_CACHE_QQ]: QQ_MUSIC,
  };

  Object.keys(urlMatch).forEach((item) => {
    if (url.indexOf(item) !== -1) {
      refererValue = urlMatch[item];
    }
    // NOTE 就歌单列表查询来说需不需要添加origin以及referer貌似都不太重要...
    if (refererValue === BILIBILI_MUSIC) {
      isReplaceOrigin = false;
      isAddOrigin = false;
    }
  });

  return {
    refererValue,
    isReplaceOrigin,
    isAddOrigin,
  };
};

module.exports = hackHeader;
