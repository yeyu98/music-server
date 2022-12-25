const Koa = require("koa")
const service = new Koa()
/* 
service.on("request", (req, res )=>{

    res.send({....})
})

*/

// x-response-time
service.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const end = Date.now()
    console.log("x-response-time")
    ctx.set("X-response-time", `${end-start}ms`)
})

service.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const end = Date.now()
    const ms = end-start
    console.log(`logger --->>> ${ms}`)
})

service.use(async ctx => {
    const { req, res } = ctx
    ctx.body = "Hello,world!"
    ctx.status = 200
})

service.listen(30000)

