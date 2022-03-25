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
 */

import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: searchStories
 *
 * @param {String} q
 * @param {Number} limit
 * @param {Boolean} hidden
*/

export default function searchStories(data) {
  const bridgeParams = {
    ...data.data.params
  };

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
  }
  if (typeof bridgeParams.limit === 'undefined') {
    // if not supplied set to 50
    bridgeParams.limit = 50;
  }
  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.get('/search/stories', 'webapi', {
      params: {
        q: bridgeParams.q,
        limit: bridgeParams.limit,
        hidden: bridgeParams.hidden
      }
    })
  };
}
