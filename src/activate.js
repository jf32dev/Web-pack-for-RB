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

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Activate from 'containers/Activate/Activate';
import MediaContext from 'components/MediaContext/MediaContext';

import ApiClient from './helpers/ApiClient';
import ConnectedIntlProvider from './helpers/ConnectedIntlProvider';
import createStore from './redux/create';

const client = new ApiClient();

const store = createStore(client);

// Global stylesheet
require('./less/activate.less');

// Check token exists and is valid
// ?t=token
const params = window.location.search;
const sampleParam = '?t=c2b244b26623588ac036d86697636d62';

// Redirect to Signin if token is invalid
if (!params || params.length !== sampleParam.length || params.indexOf('?t=') !== 0) {
  window.location = '/';
}

ReactDOM.render(
  <ConnectedIntlProvider store={store} defaultLocale="en">
    <AppContainer>
      <MediaContext>
        <Activate
          token={params.split('?t=')[1]}
        />
      </MediaContext>
    </AppContainer>
  </ConnectedIntlProvider>,
  document.getElementById('app')
);
