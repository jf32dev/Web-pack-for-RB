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
 * actionName: proxyRequest
 *
 * @param {Number} url        (renamed from apiPath)
 * @param {Number} method     GET, POST, PATCH, PUT, DELETE (renamed from apiMethod)
 * @param {Object} body       key/value pairs to be sent as JSON
 * @param {Object} data       key/value pairs to be sent as FormData (renamed from apiData)
 * @param {Array}  headers    array of key/value pairs
 * @param {bool}  disableCredentials    boolean disable credentials in the headers (default true)
 */

const validMethods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

export default function proxyRequest(bridgeData) {
  const bridgeParams = {
    ...bridgeData.data.params
  };
  const { url, method, body, data, headers, disableCredentials, ...rest } = bridgeParams;

  // Set Disable credentials as default
  const withCredentials = typeof disableCredentials === 'undefined' ? false : !disableCredentials;

  // Missing Parameters
  if (!url || !method) {
    console.warn('Missing Required Parameter')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: bridgeData,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

    // Invalid url (must start with https)
  } else if (url.indexOf('https') !== 0) {
    console.warn(`Invalid Parameter \`url\`. Must be https`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: bridgeData,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

    // Invalid method
  } else if (validMethods.indexOf(method) === -1) {
    console.warn(`Invalid Parameter \`method\`. Must be one of: ${validMethods.toString()}`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: bridgeData,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
    // Invalid headers
  } else if (headers && (typeof headers !== 'object' || (Array.isArray(headers) && !headers.length))) {
    console.warn(`Invalid Parameter \`headers\`. Must be an object or array of key/value pairs.`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: bridgeData,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
  }

  let promise;
  switch (method) {
    case 'GET':
      promise = (client) => client.get(url, 'custom', {
        headers: headers,
        params: rest,
        disableCredentials: !withCredentials,
      }).catch(err => err.response);
      break;
    case 'POST':
      promise = (client) => client.post(url, 'custom', {
        body: body,
        data: data,
        headers: headers,
        disableCredentials: !withCredentials,
      }).catch(err => err.response);
      break;
    case 'PATCH':
      promise = (client) => client.patch(url, 'custom', {
        body: body,
        data: data,
        headers: headers,
        disableCredentials: !withCredentials,
      }).catch(err => err.response);
      break;
    case 'PUT':
      promise = (client) => client.put(url, 'custom', {
        body: body,
        data: data,
        headers: headers,
        disableCredentials: !withCredentials,
      }).catch(err => err.response);
      break;
    case 'DELETE':
      promise = (client) => client.del(url, 'custom', {
        headers: headers,
        disableCredentials: !withCredentials,
      }).catch(err => err.response);
      break;
    default:
      break;
  }

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data: bridgeData,
    promise,
  };
}
