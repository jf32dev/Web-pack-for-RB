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
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: addInterestArea/removeInterestArea
 *
 * @param {Number} id   interest area id
*/
export default function addInterestArea(data, action) {
  const bridgeParams = {
    ...data.data.params
  };

  // Error if no id
  if (!bridgeParams.id) {
    console.warn('Missing Parameter `id`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

  // Invalid parameters
  } else if (typeof bridgeParams.id !== 'number') {
    console.warn('Invalid Parameter `id`')  // eslint-disable-line
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
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.post('/usersettings/setInterestAreas', 'webapi', {
      params: {
        id: bridgeParams.id,
        selected: action === 'addInterestArea' ? 1 : 0
      }
    })
  };
}
