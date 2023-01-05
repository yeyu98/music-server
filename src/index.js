const Koa = require("koa")
const app = new Koa()
const router = require("./router/index")

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(30000)

