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
 * actionName: editStory
 *
 * @param {Number}   storyId           story story id
 * @param {Number}   channelId         primary channel id
 * @param {String}   title             story description message
 * @param {String}   description       story message description
 * @param {String}   excerpt           story message excerpt
 * @param {Number}   expiryTimeStamp   unix timestamp
 * @param {String}   expiryTimeStampTz named time zone, e.g. 'Australia / Sydney'
 * @param {Boolean}  notify            unix timestamp
 * @param {Boolean}  visual            Show Create Story UI instead of post
 * @param {Array}    attachmentURLs    Array of fileURLs to upload
 * @param {Array}    tags              Array of tags
 * @param {Array}    files             Array of files
 * @param {Array}    events            Array of events
*/

const paramTypes = {
  storyId: 'number',
  channelId: 'number',
  title: 'string',
  description: 'string',
  excerpt: 'string',
  expiryTimeStamp: 'number',
  expiryTimeStampTz: 'string',
  notify: 'boolean',
  visual: 'boolean',
  attachmentURLs: 'object',
  tags: 'object',
  files: 'object',
  events: 'object'
};

export default function editStory(data, files, resData = {}) {
  const bridgeParams = data.data.params;

  // Validate Params
  const invalidParams = validateParams(bridgeParams, paramTypes);

  // Error if no storyId or channelId
  if (!bridgeParams.storyId || !bridgeParams.channelId || !bridgeParams.title) {
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter: `storyId` or `channelId` or `title`'
      }
    };

    // Invalid parameters
  } else if (invalidParams.length) {
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: `Invalid Parameter: ${invalidParams[0]}`
      }
    };
  }

  // v5 Story body
  const body = {
    ...resData,
    channels: [{
      id: bridgeParams.channelId,
      alias: 0
    }],
    message: bridgeParams.description || resData.message, //casting description to message
    excerpt: bridgeParams.excerpt || resData.excerpt,
    expiresAt: bridgeParams.expiryTimeStamp || resData.expiresAt,
    expiresAtTz: bridgeParams.expiryTimeStampTz || resData.expiresAtTz || 'Australia/Sydney',
    name: bridgeParams.title || resData.name,
    notify: bridgeParams.notify,
    files: bridgeParams.files || files || resData.files,
    id: bridgeParams.storyId,
    tags: bridgeParams.tags || resData.tags,
    events: bridgeParams.events || resData.events
  };

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.post('/story/save', 'webapi', {
      data: {
        body: JSON.stringify(body)
      }
    })
  };
}
