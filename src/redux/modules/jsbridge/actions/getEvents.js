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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import moment from 'moment-timezone';

import { validateEvents } from '../helpers/helpers';
import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: getEvents
 * @param {Function} jsListener
*/

const paramTypes = {
  'fromDate': 'number',
  'toDate': 'number',
  'offset': 'number',
  'limit': 'number',
  'channels': 'object'
};

export default function getEvents(data) {
  const bridgeParams = { ...data.data.params };

  // Validate Params
  const invalidParams = validateEvents(bridgeParams, paramTypes);

  // jsListener not passed
  if (!data.data.jsListener) {
    console.warn('Missing Parameter `jsListener`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };
  } else if (invalidParams.length) {
    console.warn(`Invalid Parameter: '${invalidParams[0]}'`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
  }

  const {
    fromDate,
    toDate,
    offset,
    limit,
    channels
  } = bridgeParams;

  const convertStart = moment(fromDate * 1000).format();
  const convertEnd = moment(toDate * 1000).format();
  const formattedStart = `${convertStart.slice(0, 22)}${convertStart.slice(23)}`;
  const formattedEnd = `${convertEnd.slice(0, 22)}${convertEnd.slice(23)}`;

  const apiReadyParams = {
    'between[start]': formattedStart,
    'between[end]': formattedEnd,
    offset: offset || 0,
    limit: limit || 100
  };
  if (channels && channels.length) {
    apiReadyParams['channelIds[]'] = channels.map(id => id);
  }

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.get('/events', 'webapi', {
      params: {
        ...apiReadyParams
      }
    })
  };
}
