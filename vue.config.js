const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  outputDir: './docs',
  indexPath: 'index.html',
  filenameHashing: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: 8080,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://xxx.fun',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
