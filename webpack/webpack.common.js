// webpack 通用配置
const path = require('path')
const resolve = dir => path.join(__dirname, '..', dir)
const {
  merge
} = require('webpack-merge')
const {
  htmlWebpackPlugin,
  vueLoaderPlugin
} = require('./webpack.plugins')
const {
  vueLoader,
  cssLoader
} = require('./webpack.rules')

module.exports = merge({
  // mode: 'development', 根据dotenv引入的配置文件定义的NODE_ENV变动
  // process.env.NODE_ENV === 'development' ? 'web' : 'browserslist',
  target: 'web',
  entry: resolve('./src/main.js'),
  output: {
    path: resolve('dist'),
    filename: 'js/[name].js' // 静态资源文件名
  }
}, htmlWebpackPlugin(), vueLoaderPlugin(), vueLoader, cssLoader)