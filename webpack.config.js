var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var path = require('path');

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  node: {
    child_process: 'empty'
  },
  entry: {
    canvasStreamerServer: "./src/js/mainServer.js",
    canvasStreamerClient: "./src/js/mainClient.js",
    '/demo/DemoServer': "./src/js/demo/Server.js",
    '/demo/DemoClient': "./src/js/demo/Client.js"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-class-properties', 'transform-decorators-legacy'],
      }
    }, {
      test: /\.css$/, // Only .css files
      loader: 'style!css!postcss' // Run both loaders
    }, {
      test: /\.scss$/, // Only .scss files
      loader: 'style!css!sass!postcss' // Run both loaders
    }, {
      //images
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        //  'url-loader?limit=8192',
        'file?hash=sha512&digest=hex&name=img/[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }, {
      //fonts
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file?hash=sha512&digest=hex&name=fonts/[hash].[ext]'
    }]
  },
  postcss: [autoprefixer({
    browsers: ['last 2 versions']
  })],
  output: {
    path: 'build/',
    filename: '[name].js'
  },
  plugins: debug ? [definePlugin] : [
    definePlugin,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourcemap: false
    }),
  ],
};
