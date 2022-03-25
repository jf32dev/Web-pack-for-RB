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

import {
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: closeFileViewer
 *
 * @param {String} option         all, currentTab
*/

const validOptions = [
  'all',
  'currentTab',
];

export default function closeFileViewer(data, result) {
  const bridgeParams = {
    ...data.data.params
  };

  // Error
  if (!result) {
    console.warn('Invalid Request')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 100,
        message: 'Invalid Request'
      }
    };

  // Error if no option
  } else if (!bridgeParams.option) {
    console.warn('Missing Parameter `option`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

  // Unsupported Value
  } else if (validOptions.indexOf(bridgeParams.option) === -1) {
    console.warn('Unsupported Value `option`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
  }

  return {
    type: JSBRIDGE_SUCCESS,
    data: data,
    result: true
  };
}
