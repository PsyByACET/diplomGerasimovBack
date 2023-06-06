const {createProxyMiddleware} = require("http-proxy-middleware");
module.exports = app => {
    app.use(
        createProxyMiddleware('/api/license', {
            target: 'https://front-vlagogaik.vercel.app',
            changeOrigin:true
        })
    )
}