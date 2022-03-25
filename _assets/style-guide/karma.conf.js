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

module.exports = (config) => {
  config.set({
    browsers: ['ChromeHeadless'],
    colors: true,
    frameworks: ['mocha'],
    files: [
      { pattern: 'src/components/__test__/**/*.js', watched: false },
    ],
    preprocessors: {
      'src/components/__test__/**/*.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha', 'coverage-istanbul'],
    webpack: {
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
            test: /.js?$/,
            use: [
              {
                loader: 'babel-loader',
                // options defined here -- .babelrc causes problems with hub-react-server
                options: {
                  presets: [['env', { 'modules': false, 'useBuiltIns': 'entry' }], 'react', 'stage-0'],
                  plugins: ['transform-decorators-legacy'],
                  env: {
                    'development': {
                      'plugins': ['react-hot-loader/babel']
                    }
                  }
                }
              },
              'eslint-loader'
            ],
            exclude: /node_modules/
          },
          {
            test: /\.js$/,
            include: path.resolve('src/components/'),
            exclude: /node_modules/,
            loader: 'istanbul-instrumenter-loader',
            enforce: 'post',
            options: { esModules: true },
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
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.json', '.js']
      }
    },
    plugins: [
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-coverage-istanbul-reporter'
    ],
    coverageIstanbulReporter: {
      watermarks: {
        statements: [ 50, 75 ],
        functions: [ 50, 75 ],
        branches: [ 50, 75 ],
        lines: [ 50, 75 ]
      },
      reports: [ 'text-summary' ],
    },
    webpackServer: {
      noInfo: true
    }
  });
};
