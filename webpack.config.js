const path =require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'cityPicker.js',
    libraryTarget: 'umd',
    library: 'cityPicker'
  },
  // externals: {
  //   zepto: {
  //     commonjs2: 'zepto',
  //     commonjs: 'zepto',
  //     root: '$'
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					'css-loader'
				]
      },
      {
        test: require.resolve('zepto'),
        loader: 'exports-loader?window.Zepto!script-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/assets/index.html')
    }),
    new webpack.ProvidePlugin({
      $: 'zepto'
    })
  ]
}