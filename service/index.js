// 要完全实现这个service的话要写很多东西，弃用
// 仿照vue-cli-service编写的service
// 本身只是为了实现dotenv的mode与webpack启动命令行里的mode分离，所以写了这个service中间层去处理这些传入的参数变量
// 后面发现要处理很多东西,不如直接script单独定义传入一个dotenv的mode的变量

const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const dotenv = require('dotenv')
const spawn = require('child_process').spawn;
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv, {
  boolean: [
    // build
    'modern',
    'report',
    'report-json',
    'inline-vue',
    'watch',
    // serve
    'open',
    'copy',
    'https',
    // inspect
    'verbose'
  ]
})
console.log(process.argv.slice(2),args)
/**
 * 从script命令行中获取mode
 * 该mode主要是dotenv读取env文件所用,不与webpack的mode对应，也并非NODE_ENV，建议将NODE_ENV定义在env文件中
 */
const mode = args.mode

/**
 * 载入环境文件
 * 如果有设置mode，先载入对应环境文件(.env.mode)，然后再载入默认环境文件(.env)
 */
if(mode) loadEnv(mode)
loadEnv()

// windows系统应执行bin文件夹中的webpack.cmd,属实是给我整麻了😅
var webpackProcess = spawn('webpack.cmd',['serve'])

webpackProcess.stdout.on('data', chunk => {
  console.log(chunk.toString());
})

webpackProcess.stderr.on('data', data => {
  console.log(data);
})

webpackProcess.on('error', (err) => {
  console.log('err:',err);
});

webpackProcess.on('close', code => {
  console.log('close code : ' + code);
})

webpackProcess.on('exit', code => {
  console.log('exit code : ' + code);
})

function loadEnv(mode){
    const basePath = resolve(`.env${mode ? `.${mode}` : ``}`)
    const localPath = `${basePath}.local`

    const load = path => {
      try {
        const env = dotenv.config({ path, debug: process.env.DEBUG })
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
      const defaultNodeEnv = ['production','development','none'].includes(mode)
        ? mode
        : 'production'
      if (process.env.NODE_ENV == null) {
        process.env.NODE_ENV = defaultNodeEnv
      }
      if (process.env.BABEL_ENV == null) {
        process.env.BABEL_ENV = defaultNodeEnv
      }
    }
}