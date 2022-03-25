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

import loadLocaleData from '../../helpers/loadLocaleData';

export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => {  // eslint-disable-line arrow-body-style
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action;

      // Regular Actions
      if (!promise) {
        // Load locale data
        if (action.type === 'intl/LOAD_LOCALE') {
          return loadLocaleData(action.locale).then((messages) => next({ ...action, messages }));
        }

        // Other actions
        return next(action);
      }

      // Actions with API call has REQUEST, SUCCESS & FAILURE
      const [REQUEST, SUCCESS, FAILURE] = types;

      // Ignore null value
      if (REQUEST) {
        next({ ...rest, type: REQUEST });
      }

      const actionPromise = promise(client);
      actionPromise.then(
        function(resp) {
          const result = resp && resp.body;
          if (SUCCESS && (result !== null || resp.statusCode === 204)) { // Or Item Deleted
            next({ ...rest, result, type: SUCCESS, headers: resp.headers });
          } else if (SUCCESS && result === null) {  // API has failed
            let error = { message: 'API response is null' };

            // JS bridge proxyRequest may return http errors
            if (resp.status >= 400 && resp.status <= 500) {
              error = {
                code: resp.status,
                message: resp.statusText  || error.message
              };
            }

            next({ ...rest, error: error, type: FAILURE });
          }
        },
        function(error) {
          if (FAILURE) {
            next({ ...rest, error, type: FAILURE });
          }
        }
      ).catch((error) => {
        // Log TypeError
        if (error.name === 'TypeError') {
          console.error(error);  // eslint-disable-line
        } else {
          // All other errors pass to reducer as FAILURE
          next({ ...rest, error, type: FAILURE });
        }
      });

      return actionPromise;
    };
  };
}
