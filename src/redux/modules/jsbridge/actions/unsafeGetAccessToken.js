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
 * actionName: unsafeGetAccessToken
 * This is designed to be a temporary, undocumented call
 *
 * @param {Function} jsListener*
*/
export default function unsafeGetAccessToken(data, result) {
  // jsListener not passed
  if (!data.data.jsListener) {
    console.warn('Missing Parameter `jsListener`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };
  }

  return {
    type: JSBRIDGE_SUCCESS,
    data: data,
    result: result
  };
}
