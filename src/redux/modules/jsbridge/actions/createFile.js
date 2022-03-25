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
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: createFile
 *
 * @param {String}   fileData         // base64 data
 * @param {String}   fileName         // ignored on web app
 * @param {String}   fileExt          // png/pdf
*/

const paramTypes = {
  fileData: 'string',
  fileName: 'string',
  fileExt: 'string'
};

const validExt = ['csv', 'json', 'pdf', 'png', 'txt'];

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) { // eslint-disable-line
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: mimeString
  });
}

export default function createFile(data) {
  const bridgeParams = data.data.params;

  // Validate Params
  const invalidParams = validateParams(bridgeParams, paramTypes);

  // Error required params not set
  if (!bridgeParams.fileData || !bridgeParams.fileName || !bridgeParams.fileExt) {
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

    // Invalid fileExt
  } else if (validExt.indexOf(bridgeParams.fileExt) === -1) {
    console.warn(`Invalid Parameter \`fileExt\`. Must be one of: ${validExt.toString()}`)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };
  }

  // Set valid mime from supported extensions
  let mimeType = '';
  switch (bridgeParams.fileExt) {
    case 'csv':
      mimeType = 'text/csv';
      break;
    case 'json':
      mimeType = 'application/json';
      break;
    case 'pdf':
      mimeType = 'application/pdf';
      break;
    case 'png':
      mimeType = 'image/png';
      break;
    case 'txt':
      mimeType = 'text/plain';
      break;
    default:
      break;
  }

  const dataUrl = `data:${mimeType};base64,${bridgeParams.fileData}`;
  const blob = dataURItoBlob(dataUrl);
  const url = `fileName:${bridgeParams.fileName},${URL.createObjectURL(blob)}`;

  return {
    type: JSBRIDGE_SUCCESS,
    data: data,
    result: {
      tempURL: url
    }
  };
}
