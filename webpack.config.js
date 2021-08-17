const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const commonConfig = require(resolve("./webpack/webpack.common"));
const devConfig = require(resolve("./webpack/webpack.dev"));
const prodConfig = require(resolve("./webpack/webpack.prod"))
const {defineWebpackPlugin} = require('./webpack/webpack.plugins')
const { merge } = require("webpack-merge");

module.exports = ({mode}) => {

    var envConfig = {}
    if (mode === "development") {
        envConfig = devConfig
    } else if (mode === "production") {
        envConfig = prodConfig
    } else if(mode !== 'none') {
        mode = 'development'
        envConfig = devConfig
    }

    return merge(
        { mode: mode },
        commonConfig,
        envConfig,
        defineWebpackPlugin
    );
}