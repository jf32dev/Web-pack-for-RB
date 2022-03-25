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
 * @package  hub-web-app-v5
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

const path = require('path');

module.exports = (config) => {
  config.set({
    browsers: ['ChromeHeadless'],
    singleRun: true,  // set false to watch for changes and re-run
    frameworks: ['mocha'],
    files: [
      // Run individual test
      { pattern: 'src/redux/modules/__tests__/admin.security.test.js', watched: false },

      // Run all tests
      //{ pattern: 'src/**/*.test.js', watched: false },
    ],
    preprocessors: {
      'src/**/*.test.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    webpack: {
      devtool: 'inline-source-map',
      externals: {
        jsdom: 'window',
        cheerio: 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
        'react/addons': true
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            use: ['babel-loader'],
            exclude: /node_modules/
          },
          {
            test: /\.json$/,
            loader: 'json-loader',
            exclude: /node_modules/
          },
          {
            test: /global.less$/,
            use: [
              'style-loader',
              'css-loader',
              'postcss-loader',
              'less-loader'
            ],
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
              'postcss-loader',
              'less-loader'
            ],
            exclude: /node_modules/
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/,
            loader: 'url-loader',
            options: { limit: 10240 }
          }
        ]
      },
      resolve: {
        modules: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '_assets/style-guide/src'),
          'node_modules'
        ],
        extensions: ['.json', '.js']
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
};
