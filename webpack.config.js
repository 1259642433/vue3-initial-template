const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const commonConfig = require(resolve("./webpack/webpack.common"));
const devConfig = require(resolve("./webpack/webpack.dev"));
const prodConfig = require(resolve("./webpack/webpack.prod"))
const {defineWebpackPlugin} = require('./webpack/webpack.plugins')
const { merge } = require("webpack-merge");
//载入环境文件变量
const dotenv = require('dotenv')
const resolveClientEnv = require('./webpack/utils/resolveClientEnv')

/**
 * 获取传参mode,加载对应环境文件
 * 注：这里的mode并非webpackcli传参mode，而是自定义变量mode
 */
module.exports = ({mode}) => {
    init({mode})

    console.log(process.env.NODE_ENV)

    var envConfig = {}
    if (process.env.NODE_ENV === "development") {
        envConfig = devConfig
    } else if (process.env.NODE_ENV === "production") {
        envConfig = prodConfig
    } else{
        envConfig = devConfig
    }

    const defineOptions = {
        env:resolveClientEnv(process)
    }

    return merge(
        { mode: process.env.NODE_ENV },
        commonConfig,
        envConfig,
        defineWebpackPlugin(defineOptions)
    );
}
/**
 * 环境文件配置与vue脚手架使用方法不同，通过变量传入，而不是--mode，因为这会与webpack本身的配置传参有所冲突
 * 本来也想像vue脚手架那样写一个service中间服务层启动webpack的，
 * 但是本身只是想拿mode这个参数实现dotenv不同文件加载的切换
 * 写中间服务层的话，script中写的webpack很多其他的参数也要一起中间服务层解析传入就很麻烦了。
 * 所以干脆就用--env定义自定义参数了
 */
/**
 * 注意：
 * vue脚手架也是写了一个中间层service，vuecli的--mode是传给这个中间层的
 * 再通过minimist解析命令行获取键值,所以vuecli脚手架能接受debug这种参数，
 * 在处理之后传给webpack，而不是直接传给webpack的
 * webpack命令行--mode [参数] 参数本身只支持 development production none 三个值，其他值是直接报错弹出的
 * "vue-cli-service serve --mode debug" 与 "webpack serve --mode development"传参mode不是同一个东西
 */
function init({mode}) {
    /**
     * 载入环境文件
     * 如果有设置mode，先载入对应环境文件(.env.mode)，然后再载入默认环境文件(.env)
     */
    if (mode) loadEnv(mode)
    loadEnv()

    //处理当前环境对应文件中读取到的变量
    // const clientEnv = dotenv.config()
    // const clientModeEnv = dotenv.config()
    // if (clientEnv.error) {
    //     throw clientEnv.error
    // }
    // const env = resolveClientEnv(clientEnv.parsed)

    // console.log('dotenv',clientEnv)
    // console.log('env:',env)
}

function loadEnv(mode) {
    const basePath = resolve(`.env${mode ? `.${mode}` : ``}`)
    const localPath = `${basePath}.local`

    const load = path => {
        try {
            const env = dotenv.config({
                path,
                debug: process.env.DEBUG
            })
        } catch (err) {
            // only ignore error if file is not found
            if (err.toString().indexOf('ENOENT') < 0) {
                throw err
            }
        }
    }

    load(localPath)
    load(basePath)

    if (mode) {
        const defaultNodeEnv = ['production', 'development', 'none'].includes(mode) ?
            mode :
            'production'
        if (process.env.NODE_ENV == null) {
            process.env.NODE_ENV = defaultNodeEnv
        }
        if (process.env.BABEL_ENV == null) {
            process.env.BABEL_ENV = defaultNodeEnv
        }
    }
}