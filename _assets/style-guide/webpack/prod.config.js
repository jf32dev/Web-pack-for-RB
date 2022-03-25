/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of BigTinCan Mobile Pty Ltd and its suppliers,
 * if any. The intellectual and technical concepts contained herein are proprietary to BigTinCan Mobile Pty Ltd and its
 * suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction of this material is strictly forbidden unless prior
 * written permission is obtained from BigTinCan Mobile Pty Ltd.
 *
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const TerserPlugin = require('terser-webpack-plugin-legacy');

const relativeAssetsPath = '../build';
const assetsPath = path.join(__dirname, relativeAssetsPath);

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// global and components (inline) styles extracted separately
const extractGlobal = new ExtractTextPlugin({ filename: 'global-[chunkhash].css' });
const extractComponents = new ExtractTextPlugin({ filename: 'components-[chunkhash].css', allChunks: true });

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': ['babel-polyfill', './src/index.js']
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        use: [{
          loader: 'babel-loader',
          // options defined here -- .babelrc causes problems with hub-react-server
          options: {
            presets: [['env', { 'modules': false, 'useBuiltIns': 'entry' }], 'react', 'stage-0'],
            plugins: ['transform-decorators-legacy'],
            forceEnv: 'production'
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /global.less$/,
        use: extractGlobal.extract({
          use: ['css-loader', 'postcss-loader', 'less-loader']
        }),
        exclude: /node_modules/ },
      {
        test: /^((?!global).)*less$/,
        use: extractComponents.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                sourceMap: true,
                localIdentName: '[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'less-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true
              }
            }
          ]
        }),
        exclude: /node_modules/
      },
      {
        test: /\.gif|.png|.jpg$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      },
      {
        test: /\.txt|.md|.raw$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    extensions: ['.json', '.js']
  },
  plugins: [
    // Remove existing files from build dir
    new WebpackCleanupPlugin(),

    // Generate index.html to build dir
    new HtmlWebpackPlugin({
      template: 'src/static/index.html',
      inject: 'body'
    }),

    // Copy assets to build dir
    new CopyWebpackPlugin([
      { from: 'assets/btc-font/styleguide/', to: 'assets/btc-font/styleguide/' },
      { from: 'src/static/', to: 'src/static/' },
      { from: 'src/libs/fonts/', to: 'src/libs/fonts/' },
      { from: 'node_modules/pdfjs-dist/cmaps/', to: 'node_modules/pdfjs-dist/cmaps/' },
      { from: 'node_modules/pdfjs-dist/web/images/', to: 'node_modules/pdfjs-dist/web/images/' },
    ]),

    // Extract global styles to separate css file
    extractGlobal,
    extractComponents,

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // set global vars
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    //new webpack.optimize.UglifyJsPlugin(),
    new TerserPlugin(),

    // execute shell commands
    new WebpackShellPlugin({
      onBuildExit: ['node ./assets/postcss/process.js'],
      dev: false
    })
  ]
};
