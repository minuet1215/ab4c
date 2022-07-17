const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://13.125.70.158:5001/", // todo
      changeOrigin: true,
    })
  );
};
