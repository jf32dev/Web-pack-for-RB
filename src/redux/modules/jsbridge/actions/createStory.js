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
 * actionName: createStory
 *
 * @param {Number}   channelId         primary channel id
 * @param {String}   title             story title
 * @param {String}   description       story message description
 * @param {String}   excerpt           story message excerpt
 * @param {Number}   expiryTimeStamp   unix timestamp
 * @param {Number}   expiryTimeStampTz time zone string e.g. 'Australia/Sydney'
 * @param {Boolean}  notify            enable device notifications
 * @param {Boolean}  visual            Show Create Story UI instead of post
 * @param {Array}    attachmentURLs    Array of fileURLs to upload
 * @param {Array}    events            Array of events
 * @param {Array}    tags              Array of story tags
 * @param {Array}    files             Array of story files
*/

const paramTypes = {
  channelId: 'number',
  title: 'string',
  description: 'string',
  excerpt: 'string',
  message: 'string',
  expiryTimeStamp: 'number',
  expiryTimeStampTz: 'string',
  notify: 'boolean',
  visual: 'boolean',
  attachmentURLs: 'object',
  tags: 'object',
  files: 'object',
  events: 'object'
};

export default function createStory(data, files = []) {
  const bridgeParams = data.data.params;

  // v5 Story body
  const body = {
    channels: [{
      id: bridgeParams.channelId,
      alias: 0
    }],
    message: bridgeParams.description, //casting description to message
    excerpt: bridgeParams.excerpt,
    expiresAt: bridgeParams.expiryTimeStamp,
    expiresAtTz: bridgeParams.expiryTimeStampTz || 'Australia/Sydney',
    name: bridgeParams.title,
    notify: bridgeParams.notify,
    files: bridgeParams.files || files,
    tags: bridgeParams.tags,
    sharing: true,
    events: bridgeParams.events && bridgeParams.events.map(evt => ({
      title: evt.name,
      start: evt.startDate,
      end: evt.endDate,
      allDay: evt.isAllDay,
      tz: evt.timezone
    }))
  };

  // Validate Params
  const invalidParams = validateParams(bridgeParams, paramTypes);
  // Error required params not set
  if (!bridgeParams.channelId || !bridgeParams.title) {
    console.warn('Missing Parameter `channelId` or `title`')  // eslint-disable-line
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
  }

  Object.keys(body).forEach(k => {
    if (body[k] === undefined) delete body[k];
  });

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
