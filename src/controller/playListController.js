const axios = require("axios");
const $ = require("cheerio");

module.exports = async (ctx, next) => {
    // 入参 offset source
    const order = 'hot';
    const offset = ctx.query?.offset;
    const baseUrl = `http://music.163.com/discover/playlist/?order=${order}`
    const targetUrl = offset ? `${baseUrl}&limit=35&offset=${offset}` : baseUrl
    
    const resp = await axios.get(targetUrl, {
    })

    

    // axios.get(targetUrl).then(resp => {
        // let { data } = resp;
        // data = $.parseHTML(data);
        // result = resp
        // $(data).find('.m-cvrlst li').each(function () {
        //     const defaultPlaylist = {
        //         cover_img_url: '', // 歌单图片url
        //         title: '', // 歌单标题
        //         id: '', // 歌单id
        //         source_url: '',
        //     };
    
        //     defaultPlaylist.cover_img_url = $(this).find('img')[0].attribs.src;
        //     defaultPlaylist.title = $(this).find('div a')[0].attribs.title;
        //     const url2 = $(this).find('div a')[0].attribs.href;
        //     const listId = getParameterByName('id', url2);
        //     defaultPlaylist.id = `neplaylist_${listId}`;
        //     defaultPlaylist.source_url = `http://music.163.com/#/playlist?id=${listId}`;
        //     result.push(defaultPlaylist);
        // });
    // })

    ctx.body = {
        status: 200,
        message: "success",
        targetUrl
    }

}