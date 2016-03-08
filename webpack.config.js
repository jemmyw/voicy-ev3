const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  debug: true,
  devtool: 'source-map',

  entry: [
    'webpack/hot/dev-server',
    './src/styles/main.scss',
    './src/index.js'
  ],

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './build'),
    publicPath: '/public/'
  },

  resolve: { extensions: [ '', '.js', '.jsx' ] },

  module: {
    noParse: [
    ],
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /cyclejs\-aws/],
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css',
          'postcss',
        ],
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css',
          'postcss',
          'sass',
        ],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      },
      {
        test: /\.(woff2?|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loaders: [ 'url?limit=10000' ],
      },
      { 
        test: /bootstrap\/dist\/js\/umd\//, 
        loaders: ['imports?jQuery=jquery']
      },
      {
        test: /\.swf$/,
        loaders: ['file?name=[path][name].[ext]']
      }
    ]
  },

  postcss: [ autoprefixer ],

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}
