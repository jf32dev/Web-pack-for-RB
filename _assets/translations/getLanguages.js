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
const keys = require('./keys');

const options = {
  apiKey: keys.apiKey,
  secret: keys.secret,
  projectId: keys.projectId
};

onesky.getLanguages(options).then((content) => {
  const response = JSON.parse(content);
  console.log('----------------');
  console.log('CODE  |    %   ');
  console.log('----------------');

  response.data.forEach(lang => {
    const ready = lang.is_ready_to_publish;
    const percent = lang.translation_progress;
    let codeDiv = lang.code.length === 2 ? '    | ' : ' | ';

    let percentDiv = ' | ';
    if (percent.length === 4) {
      codeDiv += '  ';
      percentDiv = ' | ';
    } else if (percent.length === 5) {
      codeDiv += ' ';
      percentDiv = ' | ';
    }

    console.log((ready ? '\x1b[32m' : '') + lang.code + codeDiv + percent + percentDiv + (ready ? '✔\x1b[0m' : ''));
  });

  console.log('----------------');
  console.log('Total: ' + response.meta.record_count);
  console.log('----------------');
}).catch((error) => {
  console.error(error);
});
