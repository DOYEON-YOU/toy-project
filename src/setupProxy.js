const { createProxyMiddleware } = require("http-proxy-middleware");
const target = "http://192.168.0.25:5555/";

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target : target,
            changeOrigin : true
        })
    )
}