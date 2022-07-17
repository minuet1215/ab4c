const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      // target: "http://localhost:5001/", // ! : local
      target: "http://www.4cut.shop/", // ! : dev
      changeOrigin: true,
    })
  );
};
