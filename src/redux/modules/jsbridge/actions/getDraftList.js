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
 * actionName: getDraftList (returns empty on web)
 * @param {Number}  offset              offset for pagination purpose
 * @param {Number}  limit               limit of result number
*/

export default function getDraftList(data) {
  // js-bridge params with defaults
  const bridgeParams = {
    ...data.data.params
  };

  // Invalid parameters
  if (bridgeParams.offset && typeof bridgeParams.offset !== 'number'
    || bridgeParams.limit && typeof bridgeParams.limit !== 'number') {
    console.warn('Invalid Parameter `offset` or `limit`')  // eslint-disable-line
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
    data: data
  };
}
