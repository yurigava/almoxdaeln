var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var	HtmlwebpackPlugin	=	require('html-webpack-plugin');
var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);

if(TARGET === 'start' || !TARGET) {
  module.exports = {
    entry: path.resolve(ROOT_PATH, 'src/main.jsx'),
    output: {
      path: path.resolve(ROOT_PATH, 'build'),
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: path.resolve(ROOT_PATH, 'src')
        },
        {
          test: /\.jsx$/,
          loaders: ['babel-loader'],
          include: path.resolve(ROOT_PATH, 'src')
        }
      ]
    },
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: false,
      inline: false,
      host:'0.0.0.0',
      port:8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
			new	HtmlwebpackPlugin({
					title:	'Almox DAELN - Faça login',
          favicon: 'src/favicon.ico'
			})
    ]
  }
}
