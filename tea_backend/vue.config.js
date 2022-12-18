module.exports = {
    // ...
    devServer: {
      proxy: {
        '/api': {
			//后端访问路径
            target: 'http://192.168.0.108:8080',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
             '^/api': ''
           }
        }
      }
    }
  }