var webpack = require('webpack');
//const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
  context: __dirname + '/public/js',
  entry: [
    'bootstrap-loader',
    './index.js'
  ],
  output: {
    path: __dirname + '/public/build',
    //publicPath: __dirname + '/public/js',
    publicPath: '/build/',
    filename: 'bundle.js'
  },

  devServer: {
    contentBase: 'public'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['ng-annotate']
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: "raw-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      { test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },

  resolve: {
    alias: {
      'npm': __dirname+'/node_modules'
    },
    extensions: ['', '.js'] // not sure what this does
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};
