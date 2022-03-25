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
 * @package hub-web-app-v5
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

const path = require('path');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  devtool: 'eval',
  devServer: {
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    port: 3000,
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: {
      colors: true
    },
    watchOptions: {
      ignore: /node_modules/
    }
  },
  entry: {
    index: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './src/index'
    ],
    activate: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './src/activate'
    ],
    download: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './src/download'
    ],
    recover: [
      'babel-polyfill',
      './src/recover'
    ],
  },
  output: {
    path: __dirname,
    filename: 'build/[name].js',
    chunkFilename: 'build/[name]-[chunkhash].js',
    publicPath: 'http://localhost:3000/',
    pathinfo: true
  },
  module: {
    rules: [
      {
        test: /.js?$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader, css-loader'],
        exclude: /node_modules/
      },
      {
        test: /global.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
        exclude: /node_modules/
      },
      {
        test: /^((?!global).)*less$/,
        use: [
          'style-loader',
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
              sourceMap: true
            }
          }
        ],
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
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.txt|.md|.raw$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../_assets/style-guide/src'),
      'node_modules'
    ],
    extensions: ['.json', '.js']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'build/vendor.js',
      minChunks: ({resource}) => /node_modules/.test(resource),
    }),

    new webpack.DefinePlugin({
      __DEVELOPMENT__: true
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new StyleLintPlugin({
      files: ['src/**/*.less', '_assets/style-guide/src/**/*.less'],
      //fix: true,
      quiet: false
    })
  ]
};
