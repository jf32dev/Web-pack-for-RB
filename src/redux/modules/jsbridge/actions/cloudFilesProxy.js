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
 * actionName: cloudFilesProxy
 *
 * @param {String} url
 * @param {String} method     GET, POST, PATCH, DELETE
 * @param {String} source     dynamics, salesforce
 * @param {Object} body       key/value pairs to be sent as JSON
 * @param {Array}  headers    array of key/value pairs
*/

const validMethods = ['GET', 'POST', 'PATCH', 'DELETE'];
const validSources = ['dynamics', 'salesforce'];

export default function cloudFilesProxy(data) {
  const bridgeParams = {
    ...data.data.params
  };
  const { url, method, source, body, headers, ...rest } = bridgeParams;

  // Missing Parameters
  if (!url || !source) {
    console.warn('Missing Parameter `url` or `source`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

  // Invalid method
  } else if (validMethods.indexOf(method) === -1) {
    console.warn(`Invalid Parameter \`method\`. Must be one of: ${validMethods.toString()}`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

  // Invalid source
  } else if (validSources.indexOf(source) === -1) {
    console.warn(`Invalid Parameter \`source\`. Must be one of: ${validSources.toString()}`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

  // Invalid headers
  } else if (headers && (typeof headers !== 'object' || (typeof headers === 'object' && !headers.length))) {
    console.warn(`Invalid Parameter \`headers\`. Must be an array of key/value pairs.`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
  }

  const apiPath = '/cloudfiles/proxy';
  let promise;
  switch (method) {
    case 'GET':
      promise = (client) => client.get(apiPath, 'webapi', {
        headers: headers,
        params: {
          url: url,
          source: source,
          ...rest
        }
      });
      break;
    case 'POST':
      promise = (client) => client.post(apiPath, 'webapi', {
        body: body,
        headers: headers,
        params: {
          url: url,
          source: source
        }
      });
      break;
    case 'PATCH':
      promise = (client) => client.patch(apiPath, 'webapi', {
        body: body,
        headers: headers,
        params: {
          url: url,
          source: source
        }
      });
      break;
    case 'DELETE':
      promise = (client) => client.del(apiPath, 'webapi', {
        headers: headers,
        params: {
          url: url,
          source: source
        }
      });
      break;
    default:
      break;
  }

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise
  };
}
