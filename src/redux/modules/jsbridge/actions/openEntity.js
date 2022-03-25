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
 * actionName: openEntity
 *
 * @param {String} entityName*
 * @param {Number} id*
 * @param {Boolean} disableLegacyRouting
*/
const validTypes = [
  'tab',
  'channel',
  'story',
  'file',
  'fileCollection',
  'user',
];
export default function openEntity(data, result) {
  const bridgeParams = {
    ...data.data.params
  };

  // Error if invalid entityName or id
  if (!bridgeParams.entityName || !bridgeParams.id) {
    console.warn('Missing parameter `entityName` or `id`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

  // Invalid parameters
  } else if (bridgeParams.entityName && validTypes.indexOf(bridgeParams.entityName) === -1) {
    console.warn('Invalid Parameter `entityName`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
  }

  // Error
  if (!result) {
    console.warn('Invalid Request')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 1,
        message: 'Invalid Request'
      }
    };
  }
  const { entityName, id } = data.data.params;
  // v5 API path
  let apiPath = '';
  // v5 API params
  const apiParams = {};
  switch (entityName) {
    case 'story': {
      apiPath = '/story/get';
      apiParams.permId = id;
      // Get Story details
      return {
        types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
        data,
        promise: (client) => client.get(apiPath, 'webapi', {
          params: apiParams
        })
      };
    }
    case 'channel': {
      apiPath = `/channels/${id}`;
      // Get channel details
      return {
        types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
        data,
        promise: (client) => client.get(apiPath, 'webapi')
      };
    }
    default:
      break;
  }
  return {
    type: JSBRIDGE_SUCCESS,
    data: data,
    result: result
  };
}
