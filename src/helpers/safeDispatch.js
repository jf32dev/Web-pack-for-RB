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

import uniqueId from 'lodash/uniqueId';
import { bindActionCreators } from 'redux';
import { refreshAuth } from 'redux/modules/auth';
import { createPrompt } from 'redux/modules/prompts';

function createErrorPrompt(title, message) {
  return createPrompt({
    id: uniqueId('error-'),
    type: 'error',
    title: title,
    message: message,
    dismissible: true,
    autoDismiss: 10
  });
}

export function bindSafeDispatch(dispatch) {
  return (...args) => {
    const ret = dispatch(...args);
    if (ret && typeof ret.catch === 'function') {
      return ret.catch((error) => {
        let resolved = {};

        // Validation error
        if (error.message && error.message === 'Validation failed') {
          resolved = error;  // reducer handles error object

        // Auth error
        } else if (error.code && error.code === 200) {
          //dispatch(createErrorPrompt('200', error.message));
          resolved = error;  // reducer handles error object

        // Parsing error (most likely a PHP error)
        } else if (error.message && error.message === 'Parser is unable to parse the response') {
          dispatch(createErrorPrompt(error.message));
          resolved = error;

        // Forbidden action
        } else if (error.message && error.message === 'You are not allowed perform this action') {
          dispatch(createErrorPrompt(error.message));

        // Server error
        } else if (error.message && error.message === 'Unexpected Server Error') {
          dispatch(createErrorPrompt(error.message));

        // Error code 101 (Access token expired)
        } else if (error.code && error.code === 101) {
          dispatch(refreshAuth());

        // Error contacting API server (no connection?)
        } else if (error.name === 'Error' && typeof error.message === 'string') {
          //dispatch(createErrorPrompt(error.message));
          resolved = error;  // reducer handles error object
        }

        // Return an empty promise that's never resolved. This way, .then()
        // will never trigger for the callers.
        return new Promise(() => resolved);
      });
    }
    return ret;
  };
}

export function bindActionCreatorsSafe(actionCreators) {
  return dispatch => {  // eslint-disable-line
    return bindActionCreators(actionCreators, (...args) => {  // eslint-disable-line
      return bindSafeDispatch(dispatch)(...args);
    });
  };
}
