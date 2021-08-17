// webpack 插件

const path = require('path')
const resolve = dir => path.join(__dirname, '..', dir)
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader/dist/index')

module.exports.htmlWebpackPlugin = function () {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve('./public/index.html'),
        filename: 'index.html',
        title: 'vue3-initial-template' // <%= htmlWebpackPlugin.options.title %>
      })
    ]
  }
}

module.exports.vueLoaderPlugin = function () {
  return {
    plugins: [
      new VueLoaderPlugin(),
    ]
  }
}

module.exports.defineWebpackPlugin = function () {
  return {
    plugins: [
      new webpack.DefinePlugin({
        /**
         * 为了在最终的打包中获取正确的tree-shaking配置，
         * 3.0开始需要定义赋值两个全局变量__VUE_OPTIONS_API__，__VUE_PROD_DEVTOOLS__
         * 虽然不用定义这些全局常量也可以正常打包,但是会报warning
         */
        // 启用/禁用Vue Options API，默认：true
        // Options API即2.X中export default结构体中的data之类的,设置为false之后只能使用vue3的composition API
        __VUE_OPTIONS_API__: true,
        // 在生产环境中启用/禁用devtools支持，默认为false
        __VUE_PROD_DEVTOOLS__: false,
      })
    ]
  }
}