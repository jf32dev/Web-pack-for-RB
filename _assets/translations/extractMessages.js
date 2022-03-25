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

/* eslint-disable */

const babel = require('babel-core');
const exec = require('child_process').exec;
const fs = require('fs');
const getDirName = require('path').dirname;
const mkdirp = require('mkdirp');
const walk = require('walk');

// Options
const outputDir = './_assets/translations/extractedMessages';
const inputDirs = [
  './src/components',
  './src/containers',
  './_assets/style-guide/src/components'
];

// Helper to create directories when writing file
function writeFile(path, contents, cb) {
  mkdirp(getDirName(path), (err) => {
    if (err) {
      return cb(err);
    }
    return fs.writeFile(path, contents, cb);
  });
}

// Write JSON string to file
function writeJSONToFile(obj) {
  const string = JSON.stringify(obj.messages, null, '  ');
  const outputFile = outputDir + '/' + obj.path.replace('.js', '.json');
  const warnings = [];

  // Check if any strings are using naming variables
  // Looks for usages of 'story' etc. without curly braces
  obj.messages.forEach(msg => {
    if (msg.defaultMessage.toLowerCase().match(/([^{]|^)\b(tabs?|channels?|story|stories)\b/)) {
      warnings.push(msg);
    }
  });

  writeFile(outputFile, string, () => {
    const icon = !warnings.length ? '\x1b[32m✔' : '\x1b[31m✘';

    // Log parsed file
    console.log(`${icon} ${obj.path}\x1b[0m`);

    // Log warnings
    if (warnings.length) {
      warnings.forEach(msg => {
        console.log(`${JSON.stringify(msg, null, '  ')}`);
      });
    }
  });
}

// Parse JS file
function parseFile(f) {
  const data = fs.readFileSync(f, 'utf8');
  const processed = babel.transform(data, {
    presets: [['env', { 'modules': false, 'useBuiltIns': 'entry' }], 'react', 'stage-0'],
    plugins: ['transform-decorators-legacy', 'react-intl']
  }); // => { code, map, ast, metadata['react-intl'].messages };

  // Check for unparsable usage of react-intl
  if (processed.code.indexOf('formatMessage({') > -1) {
    console.log(`\x1b[31m ${f}: unparsable usage of react-intl\x1b[0m`);
  }

  const messages = processed.metadata['react-intl'].messages;
  if (messages.length) {
    const obj = {
      path: f.replace('./', ''),
      messages: messages,
    };
    return writeJSONToFile(obj);
  }

  return false;
}

// Process directories asynchronously
function processDirectories(dirs) {
  dirs.forEach(dir => {
    console.log('Processing: ' + dir);

    const files = [];
    const walker = walk.walk(dir, {
      followLinks: false,
      filters: ['libs']
    });

    walker.on('file', (root, stat, next) => {
      if (stat.name.substr(-3) === '.js') {
        files.push(root + '/' + stat.name);
      }
      next();
    });

    walker.on('end', () => {
      files.forEach(f => {
        parseFile(f);
      });
    });
  });
}

// Remove existing files in outputDir
exec('rm -r ' + outputDir, (err) => {
  if (!err) {
    console.log('Removed: ' + outputDir + '/**');
  }
  return processDirectories(inputDirs);
});
