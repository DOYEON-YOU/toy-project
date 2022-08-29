const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyUrl = 'http://192.168.0.38:5000/'

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: proxyUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
