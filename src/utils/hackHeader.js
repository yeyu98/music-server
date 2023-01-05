const hackHeader = (url) => {
  let isReplaceOrigin = true; // 是否替换origin
  let isAddOrigin = true; // 是否添加origin
  let refererValue = false;


  if (url.indexOf("://music.163.com/") !== -1) {
    refererValue = "http://music.163.com/";
  }
  if (url.indexOf("://gist.githubusercontent.com/") !== -1) {
    refererValue = "https://gist.githubusercontent.com/";
  }

  if (url.indexOf("c.y.qq.com/") !== -1 || (url.indexOf("i.y.qq.com/") !== -1)
        || (url.indexOf("qqmusic.qq.com/") !== -1)
        || (url.indexOf("music.qq.com/") !== -1)
        || (url.indexOf("imgcache.qq.com/") !== -1)) {
    refererValue = "https://y.qq.com/";
  }

  if (url.indexOf(".kugou.com/") !== -1) {
    refererValue = "http://www.kugou.com/";
  }

  if (url.indexOf(".kuwo.cn/") !== -1) {
    refererValue = "http://www.kuwo.cn/";
  }

  if (url.indexOf(".bilibili.com/") !== -1) {
    refererValue = "http://www.bilibili.com/";
    isReplaceOrigin = false;
    isAddOrigin = false;
  }

  return {
    refererValue,
    isReplaceOrigin,
    isAddOrigin,
  };
};
module.exports = {
  hackHeader,
};
