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

// Detect supported browser
export default function checkBrowser() {
  const platform = require('platform');  // eslint-disable-line
  const { os } = platform;
  const name = platform.name.toLowerCase();
  const version = parseInt(platform.version, 10);

  // Let everyone in by default
  // and cherry pick browsers to block
  let supportedBrowser = true;

  // Detect Android/iOS devices
  if ((os.family === 'Android' || os.family === 'iOS') && (name === 'chrome mobile' || name === 'firefox mobile' || name === 'safari')) {
    supportedBrowser = true;
    // All other browsers
  } else {
    // Disable support in detected browsers
    switch (name) {
      case 'chrome':
        if (parseInt(version, 10) < 44) {
          supportedBrowser = false;
        }
        break;
      case 'firefox':
        if (parseInt(version, 10) < 31) {
          supportedBrowser = false;
        }
        break;
      case 'safari':
        if (parseInt(version, 10) < 9) {
          supportedBrowser = false;
        }
        break;
      case 'ie':
        if (parseInt(version, 10) < 11) {
          supportedBrowser = false;
        }
        break;
      case 'microsoft edge':
        supportedBrowser = true;
        break;
      case 'electron':
        if (parseInt(version, 10) < 8) {
          supportedBrowser = false;
        }
        break;
      default:
        supportedBrowser = false;
        break;
    }
  }

  return {
    ...platform,
    supported: supportedBrowser
  };
}
