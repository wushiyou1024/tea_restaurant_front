module.exports = {
    // ...
    devServer: {
      proxy: {
        '/api': {
			//后端访问路径
            target: 'http://127.0.0.1:8080',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
             '^/api': ''
           }
        }
      }
    }
  }