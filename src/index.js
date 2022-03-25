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

import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import qhistory from 'qhistory';
import { stringify, parse } from 'qs';

import localForage from 'localforage';
import { persistStore, autoRehydrate } from 'redux-persist';

import Auth from 'containers/Auth/Auth';

// Public routes use lazyLoad in production (webpack/prod.config.js)
import PublicBroadcast from 'containers/PublicBroadcast/PublicBroadcast';
import PublicFiles from 'containers/PublicFiles/PublicFiles';
import PublicFileSharing_old from 'containers/PublicFileSharing/PublicFileSharing';
import ResetPassword from 'containers/ResetPassword/ResetPassword';
import ChangePassword from 'containers/ChangePassword/ChangePassword';

import Bundle from 'components/Bundle/Bundle';
import MediaContext from 'components/MediaContext/MediaContext';

import ApiClient from './helpers/ApiClient';
import checkLocalStorage from './helpers/checkLocalStorage';
import ConnectedIntlProvider from './helpers/ConnectedIntlProvider';
import createStore from './redux/create';
import loadLocaleData from './helpers/loadLocaleData';
import supportedLocales from './helpers/supportedLocales';
import initGoogleAnalytics, { logPageView } from './helpers/initGoogleAnalytics';

// Fix for IE 11 not supporting array.flat
import 'array-flat-polyfill';

// Fix for IE not supporting location.origin
if (!window.location.origin) {
  window.location.origin = window.location.protocol
    + '//'
    + window.location.hostname
    + (window.location.port ? ':' + window.location.port : '');
}

// Scheme file - load only in production
if (process.env.NODE_ENV === 'production') {
  const schemeFile = '/scheme.json';
  request
    .get(schemeFile)
    // Disable cache
    .set('Accept', 'application/json')
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('Expires', '-1')
    .set(
      'Cache-Control',
      'no-cache,no-store,must-revalidate,max-age=-1,private'
    )
    .end(function (err, res) {
      // set to global window.BTC.scheme
      // absorbed by <ColorScheme/> as a fallback
      // for browsers that do not support css variables
      if (!err) {
        window.BTC.scheme = res.body;
      }
    });
}

// Main function to run app
function runApp() {
  // localStorage not available (cookies disabled)
  if (checkLocalStorage() !== true) {
    document.body.innerHTML = '<p style="padding:10px;text-align:center;">Cookies must be enabled to use the hub.</p>';
    return;
  }

  // Config file not available.
  if (!window.BTC) {
    document.body.innerHTML = '<p style="padding:10px;text-align:center;">No config set. Rename <code>config.js.example</code></p>';
    return;
  }

  // Global stylesheet
  require('./less/global.less'); // eslint-disable-line global-require

  // Detect brower language
  const browserLanguage = require('in-browser-language'); // eslint-disable-line global-require
  const defaultLocale = 'en';
  const locale = browserLanguage.pick(supportedLocales, defaultLocale);

  // Render public routes
  function renderRoute(RouteComponent, props) {
    if (process.env.NODE_ENV === 'production') {
      return (
        <Bundle load={RouteComponent}>
          {(Comp) => <Comp {...props} />}
        </Bundle>
      );
    }
    return <RouteComponent {...props} />;
  }

  // Load locale messages before rendering
  loadLocaleData(locale).then(messages => {
    const client = new ApiClient();

    // Default intl store
    const initialIntlState = {
      supportedLocales,
      defaultLocale,
      locale,
      messages
    };

    // Create store with intl strings
    const store = createStore(
      client,
      {
        intl: initialIntlState
      },
      autoRehydrate()
    );

    // Custom history with location.search -> location.query parse support
    const history = qhistory(
      createBrowserHistory(),
      stringify,
      parse
    );

    // Initialise Google Analytics
    initGoogleAnalytics();

    // Persist store - https://github.com/rt2zz/redux-persist
    const persistConfig = {
      whitelist: [
        'canvas',
        'interactions'
      ],
      storage: localForage
    };

    /** Trigger google analytics */
    history.listen(() => {
      logPageView();
    });

    /** Listen to oauthError */
    client.subscribe('oauthError', (data) => {
      // Force password change
      if (data.code === 5) {
        // use of window.location to prevent in momery navigation in case if several api fail during loading
        window.location = '/changepassword';
      } else if (data.code === 11) {
        // it should clear the access and refresh tokens from local storage and bring the user to the login page
        localStorage.clear();
        window.location = '/';
      }
    });

    // Rehydrate store
    persistStore(store, persistConfig, () => {
      const render = () => {
        ReactDOM.render(
          <ConnectedIntlProvider store={store} defaultLocale={defaultLocale}>
            <AppContainer warnings={false}>
              <MediaContext>
                <Router history={history}>
                  <Switch>
                    <Route path="/pafs/:publicFilesId/f/:fileId" render={(props) => renderRoute(PublicFileSharing_old, props)} />
                    <Route path="/pafs/:publicFilesId" render={(props) => renderRoute(PublicFileSharing_old, props)} />
                    <Route path="/pshare/:publicBroadcastId" render={(props) => renderRoute(PublicBroadcast, props)} />
                    <Route path="/pfiles/:publicFilesId/f/:fileId" render={(props) => renderRoute(PublicFiles, props)} />
                    <Route path="/pfiles/:publicFilesId/story" render={(props) => renderRoute(PublicFiles, props)} />
                    <Route path="/pfiles/:publicFilesId" render={(props) => renderRoute(PublicFiles, props)} />
                    <Route path="/reset/:temporyToken" render={(props) => renderRoute(ResetPassword, props)} />
                    <Route path="/changepassword" render={(props) => renderRoute(ChangePassword, props)} />
                    <Auth />
                  </Switch>
                </Router>
              </MediaContext>
            </AppContainer>
          </ConnectedIntlProvider>,
          document.getElementById('app')
        );
      };

      /** Trigger google analytics for landing shares */
      logPageView();

      render();

      // Webpack Hot Module Replacement API
      if (module.hot) {
        module.hot.accept([
          'containers/Auth/Auth',
          'containers/PublicFiles/PublicFiles'
        ], () => { render(); });
      }
    }); // .purge() to clear during dev
  });
}

// Run app with Intl polyfill in place (Safari)
// https://github.com/andyearnshaw/Intl.js#intljs-and-browserifywebpack
if (!global.Intl) {
  require.ensure(['intl'], function (require) {
    require('intl');
    runApp();
  });
} else {
  runApp();
}
