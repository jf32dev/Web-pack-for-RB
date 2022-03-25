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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import { validateParams } from '../helpers/helpers';
import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';
import { stringify } from 'qs';

/**
 * actionName: getFeaturedList
 * @param {String} entityName         name of entity
*/


const validEntities = [
  'story'
];

const paramTypes = {
  entityName: 'string'
};


export default function getNewList(data) {
  // js-bridge params with defaults
  const bridgeParams = {
    ...data.data.params
  };

  // Validate Params
  const invalidParams = validateParams(bridgeParams, paramTypes);

  // Error if no entityName
  if (!bridgeParams.entityName) {
    console.warn('Missing Parameter: `entityName`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

    // Invalid entityName
  } else if (validEntities.indexOf(bridgeParams.entityName) === -1) {
    console.warn('Invalid Parameter: `entityName`: ' + bridgeParams.entityName)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

    // Invalid parameters
  } else if (invalidParams.length) {
    console.warn('Invalid Parameter: `' + invalidParams[0] + '`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
  }

  // v5 API path
  let apiPath = '';

  // v5 API params
  const apiParams = {};

  switch (bridgeParams.entityName) {
    case 'story':
      apiPath = '/company/featured_stories';
      apiParams.enhanced_view = 0;
      break;
    default:
      console.warn('Unsupported Entity: ') + bridgeParams.entityName;  // eslint-disable-line
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
    promise: (client) => client.get(apiPath, 'webapi', {
      params: stringify(apiParams)
    })
  };
}
