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

import { validateParams } from '../helpers/helpers';
import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: searchResult
 *
 * @param {String} keywords
 * @param {String} type
 * @param {Number} limit
 * @param {Number} offset
*/

const paramTypes = {
  keywords: 'string',
  type: 'string',
  limit: 'number',
  offset: 'number'
};

const validTypes = [
  'all',
  'tags',
  'stories',
  'files',
  'comments',
  'users',
  'feeds',
  'events',
  'notes'
];

export default function searchResult(data) {
  const bridgeParams = {
    ...data.data.params
  };

  let type = 'all';
  switch (bridgeParams.type) {
    case 'users':
      type = 'people';
      break;
    case 'events':
      type = 'meetings';
      break;
    default:
      type = bridgeParams.type;
      break;
  }

  // Validate Params
  const invalidParams = validateParams(bridgeParams, paramTypes);

  // Validate Types
  const invalidTypes = bridgeParams.type && validTypes.indexOf(bridgeParams.type) === -1;

  // Error if no keywords
  if (!bridgeParams.keywords) {
    console.warn('Missing Parameter `keywords`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

  // Invalid parameters
  } else if (invalidParams.length) {
    console.warn('Invalid Parameter: ' + invalidParams[0])  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
  } else if (invalidTypes) {
    console.warn('Invalid Type: ' + bridgeParams.type)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 103,
        message: 'Invalid Type'
      }
    };
  }

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.get('/search/all', 'webapi', {
      params: {
        keyword: bridgeParams.keywords,
        limit: bridgeParams.limit || 10,
        offset: bridgeParams.offset || 0,
        type: type
      }
    })
  };
}
