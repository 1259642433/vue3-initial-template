// webpack rules

module.exports.vueLoader = {
  module: {
    rules: [{
      test: /\.vue$/,
      use: ['vue-loader']
    }]
  }
}
module.exports.cssLoader = {
  module: {
    rules: [{
      test: /\.(css|scss|sass)$/,
      use: ['style-loader', 'css-loader', {
        loader: 'sass-loader',
        options: {
          implementation: require('dart-sass')
        }
      }]
    }]
  }
}