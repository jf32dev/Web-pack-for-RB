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
 * actionName: getEntity
 *
 * @param {String} entityName         name of entity
 * @param {Number} id                 id of the entity (or special value 'myProfileId', 'currentFileId')
*/

const validEntities = [
  'file',
  'story',
  'user'
];

export default function getEntity(data, currentFileId, myProfileId) {
  const bridgeParams = {
    ...data.data.params
  };

  // Error if no entityName or id passed
  if (!bridgeParams.entityName || !bridgeParams.id) {
    console.warn('Missing Parameter: `entityName` or `id`')  // eslint-disable-line
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
    console.warn(`Invalid entityName: ${bridgeParams.entityName}`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

  // Invalid file id
  } else if (bridgeParams.entityName === 'file' && (typeof bridgeParams.id !== 'number' && bridgeParams.id !== 'currentFileId')) {
    console.warn(`Invalid file id: ${bridgeParams.id}`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

  // Invalid user id
  } else if (bridgeParams.entityName === 'user' && (typeof bridgeParams.id !== 'number' && bridgeParams.id !== 'myProfileId')) {
    console.warn(`Invalid user id: ${bridgeParams.id}`)  // eslint-disable-line
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
      apiPath = '/story/get';
      apiParams.permId = bridgeParams.id;

      // Password Protected
      if (bridgeParams.password) {
        apiParams.password = bridgeParams.password;
      }
      break;
    case 'file':
      apiPath = '/file/get';
      apiParams.id = bridgeParams.id === 'currentFileId' ? currentFileId : bridgeParams.id;
      apiParams.include_story = 1;
      break;
    case 'user':
      apiPath = '/user/profile';
      apiParams.id = bridgeParams.id === 'myProfileId' ? myProfileId : bridgeParams.id;
      apiParams.include_groups = 1;
      apiParams.include_followers = 1;
      apiParams.include_following = 1;
      apiParams.include_subscribed_stories = 1;
      break;
    default:
      break;
  }

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.get(apiPath, 'webapi', {
      params: apiParams
    })
  };
}
