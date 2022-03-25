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
 * actionName: getBookmarkList
 *
 * @param {String}  entityName          name of entity (story or fileCollection)
 * @param {Number}  offset              result offset for pagination purpose
 * @param {Number}  limit               limit of result number
 * @param {String}  sortBy              title, name, date
*/

const validEntities = [
  'story',          // title, createDate
  'fileCollection'  // name, createDate
];

const paramTypes = {
  entityName: 'string',
  limit: 'number',
  offset: 'number',
  sortBy: 'string'
};

const validSortBy = ['title', 'name', 'createDate'];

const getBookmarkListParams = {
  limit: globalFetchLimit,
  offset: 0,
  sortBy: 'name'
};

export default function getBookmarkList(data) {
  // js-bridge params with defaults
  const bridgeParams = {
    ...getBookmarkListParams,
    ...data.data.params
  };

  // Validate Params
  const invalidParams = validateParams(bridgeParams, paramTypes, validSortBy);

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

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.get('/me/bookmarks', 'webapi', {
      params: {
        limit: bridgeParams.limit,
        offset: bridgeParams.offset,
        sortBy: (bridgeParams.sortBy === 'createDate' || bridgeParams.sortBy === 'date') ? 'date' : 'name',
        type: bridgeParams.entityName === 'fileCollection' ? 'files' : 'story'
      }
    })
  };
}
