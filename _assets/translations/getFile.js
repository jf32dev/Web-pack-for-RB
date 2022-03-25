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

/* eslint-disable */

const onesky = require('onesky-utils');
const fs = require('fs');
const args = require('optimist').argv;
const keys = require('./keys');

// Help message
const help = ' -l [langCode]\n -o [outputDir]';

// Exit and display help if outputDir/langCode not set
if (!args.o || !args.l || args.h || args.help) {
  console.log(help);
  process.exit(0);
}

const options = {
  language: args.l,
  apiKey: keys.apiKey,
  secret: keys.secret,
  projectId: keys.projectId,
  fileName: 'en.json'  // source file is always en.json
};

onesky.getFile(options).then((content) => {
  const totalKeys = Object.keys(JSON.parse(content)).length
  const outputPath = args.o + args.l + '.json';

  if (totalKeys) {
    fs.writeFile(outputPath, content, 'utf8', (err) => {
      if (err) {
        return console.log('\x1b[31m' + err);
      }
      const message = '  \x1b[32m✔ Successfully wrote ' + totalKeys + ' strings to file: ' + outputPath + '\x1b[0m';
      console.log(message);
    });
  }
}).catch((error) => {
  console.error(error);
});
