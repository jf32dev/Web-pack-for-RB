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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import CodeMirror from 'codemirror';

require('codemirror/addon/mode/overlay');

CodeMirror.defineMode('btcEmail', function (config) {
  const btcEmailOverlay = {
    token: function (stream) {
      // check for {
      if (stream.match('[[')) {
        // if not a char
        if (!stream.eatWhile(/[\w]/)) {
          return null;
        }
        if (stream.match(']]')) {
          return 'btcEmail';
        }
      }
      while (stream.next() && !stream.match('[[', false)) {} //eslint-disable-line
      return null;
    }
  };
  return CodeMirror.overlayMode(CodeMirror.getMode(config, 'text/html'), btcEmailOverlay);
});
