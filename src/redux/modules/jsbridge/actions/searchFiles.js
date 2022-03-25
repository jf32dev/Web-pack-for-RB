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
 * @author Shibu Bhattarai <shibu.bhattarai@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import { globalFetchLimit, validateParamsWithOutTypes } from '../helpers/helpers';

import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: searchFiles
 *
 * @param {String} q
 * @param {Number} limit
 * @param {Boolean} hidden
 * @param {Boolean} shareable
*/

const validParamTypes = [
  'q',
  'limit',
  'hidden',
  'shareable'
];

const getListParams = {
  limit: globalFetchLimit
};

export default function searchFiles(data) {
  const bridgeParams = {
    ...getListParams,
    ...data.data.params
  };

  // Validate Params
  const invalidParams = validateParamsWithOutTypes(bridgeParams, validParamTypes);

  // Error if no keywords
  if (!bridgeParams.q) {
    console.warn('Missing Parameter `q`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

    // Invalid parameters
  } else if (bridgeParams.q && bridgeParams.q.length < 2) {
    console.warn('Parameter `q` must be atleast 2 character')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Parameter `q` must be at least 2 character'
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
    promise: (client) => client.get('/search/files', 'webapi', {
      params: {
        q: bridgeParams.q,
        limit: bridgeParams.limit,
        hidden: bridgeParams.hidden,
        shareable: bridgeParams.shareable
      }
    })
  };
}
