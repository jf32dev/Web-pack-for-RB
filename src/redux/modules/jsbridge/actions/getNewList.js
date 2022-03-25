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

import { globalFetchLimit, validateParams } from '../helpers/helpers';
import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: getNewList
 *
 * @param {String} entityName         name of entity
 * @param {Number} offset             result offset for pagination purpose
 * @param {Number} limit              limit of result number
*/

const validEntities = [
  'story'
];

const paramTypes = {
  entityName: 'string',
  limit: 'number',
  offset: 'number'
};

const getNewListParams = {
  limit: globalFetchLimit,
  offset: 0
};

export default function getNewList(data) {
  // js-bridge params with defaults
  const bridgeParams = {
    ...getNewListParams,
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

  /**
   * Valid entityName: story
   */
  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.get('/company/latest_stories', 'webapi', {
      params: {
        limit: bridgeParams.limit,
        offset: bridgeParams.offset
      }
    })
  };
}
