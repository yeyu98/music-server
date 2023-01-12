const Router = require("koa-router");
const defaultController = require("../controller/defaultController");

const router = new Router();
const {
  playListController,
  playListDetailController,
  searchController,
  lyricController,
  playerUrlController,
} = require("../controller/index");

// 默认路由
router.get("/", defaultController);
// 歌单列表
router.get("/playList", playListController);
// 歌单详情
router.get("/playListDetail", playListDetailController);
// 搜索
router.get("/search", searchController);
// 歌词
router.get("/lyric", lyricController);
// 歌曲地址
router.get("/playerUrl", playerUrlController);


module.exports = router;
