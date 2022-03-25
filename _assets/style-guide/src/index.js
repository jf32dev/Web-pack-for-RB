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
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

// Intl polyfill for Safari
if (!global.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en.js');
  require('intl/locale-data/jsonp/en-GB.js');
  require('intl/locale-data/jsonp/es.js');
}

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';

import App from './app';

// Set available locales
addLocaleData(enLocaleData);
addLocaleData({ locale: 'en-GB', parentLocale: 'en' });
addLocaleData(esLocaleData);

// Set current locale and load JSON
const currentLocale = 'en';
const messages = require('./locales/' + currentLocale + '.json');  // eslint-disable-line

// Global style
require('./libs/less/global.less');

const render = Component => {
  ReactDOM.render(
    <IntlProvider defaultLocale="en" locale={currentLocale} messages={messages}>
      <AppContainer>
        <Component />
      </AppContainer>
    </IntlProvider>, document.getElementById('app')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./app', () => {
    render(App);
  });
}
