export const hackHeader = () => {
    const isReplaceOrigin = true; // 是否替换origin
    const isAddOrigin = true; // 是否添加origin

    if (url.indexOf("://music.163.com/") !== -1) {
        referer_value = "http://music.163.com/";
    }
    if (url.indexOf("://gist.githubusercontent.com/") !== -1) {
        referer_value = "https://gist.githubusercontent.com/";
    }

    if (url.indexOf("c.y.qq.com/") !== -1 || (url.indexOf("i.y.qq.com/") !== -1)
        || (url.indexOf("qqmusic.qq.com/") !== -1)
        || (url.indexOf("music.qq.com/") !== -1)
        || (url.indexOf("imgcache.qq.com/") !== -1)) {
        referer_value = "https://y.qq.com/";
    }

    if (url.indexOf(".kugou.com/") !== -1) {
        referer_value = "http://www.kugou.com/";
    }

    if (url.indexOf(".kuwo.cn/") !== -1) {
        referer_value = "http://www.kuwo.cn/";
    }

    if (url.indexOf(".bilibili.com/") !== -1) {
        referer_value = "http://www.bilibili.com/";
        replace_origin = false;
        add_origin = false;
    }





}
