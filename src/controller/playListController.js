const cheerio = require("cheerio");
const request = require("../utils/request");
const { getParameterByName } = require("../utils/request");

module.exports = async (ctx, next) => {
  // 入参 offset source
  try {
    const order = "hot";
    const { offset } = ctx.query;
    const baseUrl = `http://music.163.com/discover/playlist/?order=${order}`;
    const targetUrl = offset ? `${baseUrl}&limit=35&offset=${offset}` : baseUrl;

    const resp = await request.get(targetUrl, {
      headers: { "Accept-Encoding": "*" },
    });

    const { data } = resp;
    // $.
    // data = $.parseHTML(data);
    console.log(data);
    const $ = cheerio.load(data);
    console.log($(".m-cvrlst"));

    const result = [];
    // $(".m-cvrlst").find("li").each(function () {
    //   const coverImageUrl = $(this).find("img")[0].attribs.src;
    //   const { title } = $(this).find("div a")[0].attribs;
    //   const url = $(this).find("div a")[0].attribs.href;
    //   const listId = getParameterByName("id", url);
    //   const id = `neplaylist_${listId}`;
    //   const sourceUrl = `http://music.163.com/#/playlist?id=${listId}`;

    //   console.log(this);

    //   result.push({
    //     coverImageUrl,
    //     title,
    //     url,
    //     listId,
    //     id,
    //     sourceUrl,
    //   });
    // });

    console.log(result);


    ctx.body = {
      status: 200,
      message: "success",
    //   data: result,
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
