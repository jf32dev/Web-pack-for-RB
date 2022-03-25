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
 * actionName: openMenu
 *
 * @param {String} menuType*
*/
const validTypes = [
  'chat',
  'company',
  'content',
  'me',
  'meetings',
  'notes',
  'notifications',
  'search',
  'blocksearch'
];
export default function openMenu(data, result) {
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

  // Missing menuType
  } else if (!bridgeParams.menuType) {
    console.warn('Missing parameter `menuType`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

  // Invalid parameters
  } else if (bridgeParams.menuType && validTypes.indexOf(bridgeParams.menuType) === -1) {
    console.warn('Invalid Parameter: `menuType`')  // eslint-disable-line
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
    result: result
  };
}
