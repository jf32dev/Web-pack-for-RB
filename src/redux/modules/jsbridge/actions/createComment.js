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
 * actionName: createComment
 *
 * @param {Number}  storyId         story id
 * @param {String}  message         comment message
*/
export default function createComment(data) {
  const bridgeParams = data.data.params;

  // v5 API params
  const apiParams = {
    id: bridgeParams.storyId,
    comment: bridgeParams.message
  };

  // Error if no storyId or message passed
  if (!bridgeParams.storyId || !bridgeParams.message) {
    console.warn('Missing Parameter `storyId` or `message`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

  // Invalid parameters
  } else if (typeof bridgeParams.storyId !== 'number' || typeof bridgeParams.message !== 'string') {
    console.warn('Invalid Parameter `storyId` or `message`')  // eslint-disable-line
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
    promise: (client) => client.post('/story/comment', 'webapi', {
      params: apiParams
    })
  };
}
