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
 * @copyright 2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import { validateParams, validateEmailsInArray, validateMandatoryParamsNotEmpty } from '../helpers/helpers';
import {
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR, JSBRIDGE_REQUEST
} from '../actions';

/**
 * actionName: createShare
 *
 * @param {Array}    to        // array of email ids to send hub share to
 * @param {String}   cc        // array of email ids to send hub share to
 * @param {String}   subject   // subject of email
 * @param {String}   message   // optional message
 * @param {array}    files     // array of file IDs to share
 * @param {boolean}  visual    // default true. When true - shows hubshare UI with prefilled data. If false, sends off the hub share
 Response on success
*/

const paramTypes = {
  to: '[object Array]',
  files: '[object Array]',
  visual: 'boolean'
};

export default function createShare(data, result) {
  const bridgeParams = data.data.params;

  // Validate Params
  const invalidParams = validateParams(bridgeParams, {
    cc: '[object Array]',
    subject: 'string',
    message: 'string',
    ...paramTypes
  });
  const listOfEmptyParams = validateMandatoryParamsNotEmpty(bridgeParams, paramTypes);
  const invalidEmailTo = validateEmailsInArray(bridgeParams.to);
  const invalidEmailCc = validateEmailsInArray(bridgeParams.cc);

  // Parsing API response with errors
  if (result) {
    if (result.sent) {
      console.warn(`HubShare modal is opened.`)  // eslint-disable-line
      return {
        type: JSBRIDGE_SUCCESS,
        data: data,
        result: { sent: true }
      };
    }

    console.warn(`Invalid value for parameter. ${result.message}`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: result.code,
        message: result.message
      }
    };
  } else if (!bridgeParams.visual && typeof bridgeParams.visual !== 'undefined' && listOfEmptyParams.length > 0) {
    console.warn('Missing Parameter')  // eslint-disable-line
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
  } else if (invalidEmailTo.length || invalidEmailCc.length) {
    const errorMsg = invalidEmailTo.length ? `to: ${invalidEmailTo[0]}` : `cc: ${invalidEmailCc[0]}`;
    console.warn(`Invalid value for Parameter ${errorMsg}`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: `Invalid value for Parameter ${errorMsg}`
      }
    };
  }

  const { to, cc, files, ...requestData } = bridgeParams;
  const emails =  [];
  if (to && to.length) emails.push(...to);
  if (cc && cc.length) emails.push(...cc);

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.post('/story/serverShare', 'webapi', {
      params: {
        emails: JSON.stringify(emails),
        files: JSON.stringify([...files]),
        ...requestData,
      }
    })
  };
}
