var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var fs = require('fs');
var path = require('path');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  contentBase: 'public',
  hot: true,
  debug: true,
  devtool: 'source-map',
  historyApiFallback: true,
  stats: {colors: true},
})
  .listen(3000, function (err) {
    if (err) {
      console.log(err);
    }

    console.log('Listening at localhost:3000');
  });
