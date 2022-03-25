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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const supportedLocales = require('../src/helpers/supportedLocales');

const relativeAssetsPath = '../build';
const assetsPath = path.join(__dirname, relativeAssetsPath);

// global and components (local) styles extracted separately
const extractGlobal = new ExtractTextPlugin({ filename: 'global-[chunkhash].css' });
const extractComponents = new ExtractTextPlugin({
  filename: (getPath) => {
    const name = getPath('[name]');

    // standalone pages with own css
    if (name === 'activate' || name === 'download' || name === 'recover') {
      return getPath('[name]-[chunkhash]') + '.css';
    }

    return getPath('components-[chunkhash].css');
  },
  allChunks: true
});

// Containers that use lazyLoading (code splitting)
const bundleContainers = [
  // Public routes
  'PublicBroadcast',
  'PublicFiles',
  'PublicFileSharing',
  "ResetPassword",

  // Auth routes
  'App',
  'Signin',
  "ChangePassword",

  // App routes
  'Activity',
  'Admin',
  'Archive',
  'BlockSearch',
  'Canvas',
  'Calendar',
  'ChatRoot',
  'Comments',
  'Company',
  'Content',
  'Forms',
  'Help',
  'Me',
  'NoteEdit',
  'Notes',
  'PageSearch',
  'Reports',
  'Search',
  'Settings',
  'Shares',
  'Story',
  'UserDetail',
  'UserEdit'
];

module.exports = {
  //devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    index: ['babel-polyfill', './src/index.js'],
    activate: ['babel-polyfill', './src/activate.js'],
    download: ['babel-polyfill', './src/download.js'],
    recover: ['babel-polyfill', './src/recover.js'],
  },
  output: {
    path: assetsPath,
    publicPath: '/',
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  externals: {
    './src/config.js': 'config'
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        use: 'babel-loader',
        exclude: new RegExp('node_modules|libs|containers\\/(' + bundleContainers.join('|') + ')\\/\\w+.js')
      },
      {
        test: new RegExp('containers\\/(' + bundleContainers.join('|') + ')\\/\\w+.js'),
        use: ['bundle-loader?lazy', 'babel-loader'],
        exclude: /node_modules|libs/
      },
      {
        test: /global.less$/,
        use: extractGlobal.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }, 'postcss-loader', 'less-loader']
        }),
        exclude: /node_modules/
      },
      {
        test: /^((?!global).)*less$/,
        use: extractComponents.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: true,
                importLoaders: 2,
                sourceMap: true,
                localIdentName: '[hash:base64:5]'
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
    // Remove existing files from build dir
    new WebpackCleanupPlugin({
      exclude: ['icons'],
    }),

    // Generate index.html to build dir
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'static/template.html',
      title: 'Bigtincan Hub',
      inject: 'body',
      excludeChunks: ['activate', 'download', 'recover'],
    }),

    // Generate activate.html to build dir
    new HtmlWebpackPlugin({
      filename: 'activate.html',
      template: 'static/template.html',
      title: 'Activate Account - Bigtincan Hub',
      chunks: ['activate']
    }),

    // Generate download.html to build dir
    new HtmlWebpackPlugin({
      filename: 'download.html',
      template: 'static/template.html',
      title: 'Bigtincan Mobile Apps',
      chunks: ['download']
    }),

    // Generate recover.html to build dir
    new HtmlWebpackPlugin({
      filename: 'recover.html',
      template: 'static/template.html',
      title: 'Recover Password - Bigtincan Hub',
      chunks: ['recover']
    }),

    // Copy assets to build dir
    new CopyWebpackPlugin([
      { from: 'src/config.js', to: 'config.js.example' },
      { from: 'agreements.html' },
      { from: 'aup.html' },
      { from: 'download.html' },
      { from: 'eula.html' },
      { from: 'privacy.html' },
      { from: 'robots.txt' },
      { from: 'static/favicon.ico' },
      { from: 'static/manifest.json' },
      { from: 'static/saml_auth_story.html' },
      { from: 'static/img', to: 'static/img' },
      { from: 'static/templates', to: 'static/templates' },
      { from: 'node_modules/pdfjs-dist/cmaps/', to: 'node_modules/pdfjs-dist/cmaps/' },
      { from: 'node_modules/pdfjs-dist/web/images/', to: 'node_modules/pdfjs-dist/web/images/' },
      { from: '.well-known/', to: '.well-known' },
    ]),

    // Generate favicon
    // https://github.com/jantimon/favicons-webpack-plugin
    new FaviconsWebpackPlugin({
      logo: './static/logo.png',
      // The prefix for all image files (might be a folder or a name)
      prefix: 'icons/',
      // Emit all stats of the generated icons
      emitStats: false,
      // The name of the json containing all favicon information
      statsFilename: 'iconstats-[hash].json',
      // Generate a cache file with control hashes and
      // don't rebuild the favicons until those hashes change
      persistentCache: true,
      // Inject the html into the html-webpack-plugin
      inject: true,
      background: '#fff',
      title: 'Bigtincan Hub',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        firefox: true,
        opengraph: true,
        twitter: true,
        windows: true
      }
    }),

    // Extract global styles to separate css file
    extractGlobal,
    extractComponents,

    // set global vars
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEVELOPMENT__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // Specify moment locales to include
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, new RegExp(supportedLocales.join('|'))),

    // optimizations
    /*
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'build/vendor-[chunkhash].js',
      minChunks: Infinity,
    }),
    */

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    }),

    // execute shell commands
    new WebpackShellPlugin({
      onBuildExit: ['node ./_assets/postcss/process.js'],
      dev: false
    })
  ]
};
