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

import superagent from 'superagent';
import EventEmitter from './EventEmitter';

const methods = ['get', 'post', 'put', 'patch', 'del'];

export default class ApiClient extends EventEmitter {
  constructor() {
    super();
    const self = this;

    // arrow funciton not working with babel-preset-env & react-hot-loader
    // https://github.com/gaearon/react-hot-loader/issues/662
    // https://github.com/gaearon/react-hot-loader/issues/695
    methods.forEach(function (method) {
      self[method] = (path, source, { headers, body, data, params, progress, disableCredentials } = {}) => new Promise((resolve, reject) => {
        // Alternate URL for webapi v4 (to remove)
        let apiPath;
        switch (source) {
          case 'custom':
            apiPath = path;
            break;
          case 'report':
            apiPath = window.BTC.REPORT_URL + path;
            break;
          case 'webapi4':
            apiPath = window.BTC.BTCAPI4 + path;
            break;
          default:
            apiPath = window.BTC.BTCAPI + path;
            break;
        }

        // Our superagent request
        const request = superagent[method](apiPath);

        // Set credentials to allow cookies
        if (!disableCredentials) {
          request.withCredentials();
        }

        // Append access_token to all requests except signin, report logout and custom API calls
        if (
          apiPath.indexOf('signin') < 0
          && apiPath.indexOf('btcLogout') < 0
          && localStorage.getItem('BTCTK_A')
          && source !== 'custom'
        ) {
          request.set({ Authorization: 'Bearer ' + localStorage.getItem('BTCTK_A') });
        }

        // TODO: update Report server to use Authorization: Bearer
        if (apiPath.indexOf('btcLogout') > 0) {
          request.set({ 'Accept': 'application/x-www-form-urlencoded' }).withCredentials();
        }
        // Attach custom headers
        if (headers && Array.isArray(headers) && headers.length) {
          headers.forEach((h) => {
            request.set(h);
          });
        } else if (headers) {
          request.set(headers);
        }

        // Attach uploadData to request
        if (params && (params.uploadData || params.customParams)) {
          const attrName = Object.keys(params.uploadData)[0];
          params.uploadData[attrName].forEach((f) => {
            request.attach(attrName, f, f.filename);
          });
          delete params.uploadData;  // eslint-disable-line

          if (params.customParams && Object.keys(params.customParams).forEach((key) => {
            request.field(key, params.customParams[key]);
          }));

          delete params.customParams;  // eslint-disable-line

          // Progress event
          if (progress) {
            request.on('progress', progress);
          }
        }

        // Request payload
        if (params && !params.customParams) {
          request.query(params);
        }

        // Send as JSON
        if (body) {
          request.send(body);

          // Send as FormData
        } else if (data) {
          request.type('form').send(data);
        }

        request.end((err, result = {}) => {
          if (err) {
            if (result.body && result.body.scope === 'auth') {
              self.emit('oauthError', result.body);
            }
            reject(result.body || err);
          } else {
            resolve(result);
          }
          //err ? reject(result.body || err) : resolve(result)
        });  // eslint-disable-line
      });
    });
  }
}
