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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadAuthSettings,
  login,
  logout,
  refreshAuth,
  setTokens
} from 'redux/modules/auth';

// Containers use lazyLoad in production (webpack/prod.config.js)
import App from 'containers/App/App';
import Signin from 'containers/Signin/Signin';

import Bundle from 'components/Bundle/Bundle';
import Loader from 'components/Loader/Loader';

const webappV4Routes = ['#story/', '#file/', '#people/', '#tab/'];

export default withRouter(@connect(
  state => (state.auth),
  bindActionCreatorsSafe({
    loadAuthSettings,
    login,
    logout,
    refreshAuth,
    setTokens
  })
)class Auth extends PureComponent {
  static propTypes = {
    /** access token */
    BTCTK_A: PropTypes.string,

    /** refresh token */
    BTCTK_R: PropTypes.string,

    /** api auth error */
    error: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autobind(this);

    this.refreshTimeout = null;
    this.state = {
      singleSignOnLogout: false
    };

    // Translate old webapp v4 hash URLs
    this.handleV4Route(props);
  }

  UNSAFE_componentWillMount() {
    const tokens = this.getTokens();

    // Tokens exist
    if (tokens.BTCTK_A && tokens.BTCTK_A !== 'null' && tokens.BTCTK_A !== 'undefined') {
      this.props.setTokens(tokens);

      // No tokens - load auth settings for Signin page
    } else {
      this.props.loadAuthSettings();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const d = new Date();

    // Error after obtaining access_token
    // Try to re-authorise if we have a refresh_token
    if (nextProps.error && this.props.restored && this.props.BTCTK_R) {
      localStorage.removeItem('BTCTK_A');
      localStorage.removeItem('expires_in');
      this.props.refreshAuth();

      // New access_token set
    } else if (nextProps.BTCTK_A && nextProps.BTCTK_A !== this.props.BTCTK_A) {
      // Time when current access_token will expire
      const expiresTime = d.getTime() + (nextProps.expires_in - 300) * 1000;

      // ms from now until token refresh
      const refreshTime = parseInt(expiresTime, 10) - Date.now();

      // Set tokens to localStorage
      localStorage.setItem('BTCTK_A', nextProps.BTCTK_A);
      localStorage.setItem('BTCTK_R', nextProps.BTCTK_R);
      localStorage.setItem('expires_in', nextProps.expires_in);

      // Timeout to auto-refresh auth
      this.refreshTimeout = window.setTimeout(this.props.refreshAuth, refreshTime);

      // Redirect user to SAML SLO logout page
    } else if (nextProps.samlLogoutURL && nextProps.samlLogoutURL !== this.props.samlLogoutURL) {
      window.location.replace(nextProps.samlLogoutURL);
      this.setState({ singleSignOnLogout: true });

      // access_token cleared - log out and reload auth settings
    } else if (!nextProps.BTCTK_R && this.props.BTCTK_R) {
      localStorage.clear();
      window.clearTimeout(this.refreshTimeout);
      this.props.loadAuthSettings();
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.refreshTimeout);
  }

  /**
   * Check user has access_token
   * Looks for access_token in queryString and localStorage
   * e.g. ?access_token=12345678&refresh_token=133337
   * @return {Object}
   */
  getTokens() {
    // Parse location query string
    const { query, hash } = this.props.location;
    let tokens = {};

    // access_token passed via query string (SAML)
    if (query.access_token) {
      tokens = {
        BTCTK_A: query.access_token,
        BTCTK_R: query.refresh_token,
        expires_in: query.expires_in
      };
      // Strip query string from URL
      this.props.history.replace(this.props.history.location.pathname);

    // access_token passed via fragment Url
    } else if (hash && hash.indexOf('access_token')) {
      // Convert fragment URI to object
      const arr = hash.slice(1).split(/&|=/); // remove the "?", "&" and "="
      const params = {};

      for (let i = 0; i < arr.length; i += 2) {
        const key = arr[i];
        const value = arr[i + 1];
        params[key] = value; // build the object
      }

      tokens = {
        BTCTK_A: params.access_token,
        BTCTK_R: params.refresh_token,
        expires_in: params.expires_in
      };

      // Strip fragment URl string from URL
      this.props.history.replace(this.props.history.location.pathname);

    // refresh_token exists in localStorage (assume access_token)
    } else if (localStorage.getItem('BTCTK_R') !== null && localStorage.getItem('BTCTK_R') !== 'null') {
      tokens = {
        BTCTK_A: localStorage.getItem('BTCTK_A'),
        BTCTK_R: localStorage.getItem('BTCTK_R'),
        expires_in: localStorage.getItem('expires_in')
      };

    // SAML login error
    } else if (query._sem) {  // eslint-disable-line
      console.info('SAML login error');  // eslint-disable-line

    // can't find any tokens, clear localStorage
    } else {
      localStorage.clear();
    }

    return tokens;
  }

  handleV4Route(nextProps) {
    // Translate old webapp v4 hash URLs
    webappV4Routes.forEach(page => {
      if (nextProps.location.hash && nextProps.location.hash.indexOf(page) >= 0) {
        const tabPath = page.substring(1) === 'tab/' ? 'content' : '';
        const customPath = `${tabPath}/${page.substring(1)}${nextProps.location.hash.split(page)[1]}`;
        if (this.props.location.pathname !== nextProps.location.pathname && nextProps.history.action !== 'REPLACE') {
          this.previousLocation.pathname = customPath;
          window.previousLocation.pathname = customPath;
        }
        window.location.replace(customPath);
      }
    });
  }

  renderRoute(RouteComponent) {
    if (process.env.NODE_ENV === 'production') {
      return (
        <Bundle load={RouteComponent}>
          {(Comp) => <Comp />}
        </Bundle>
      );
    }
    return <RouteComponent />;
  }

  render() {
    const { BTCTK_A, error, loaded } = this.props;
    const { singleSignOnLogout } = this.state;
    const styles = require('./Auth.less');

    // authSettings loaded, check if it was SSO, and not currently logging Out
    if (!BTCTK_A && loaded && !singleSignOnLogout && !this.props.loggingOut) {
      return this.renderRoute(Signin);

      // Access token available, load app
    } else if (BTCTK_A && !error) {
      return this.renderRoute(App);
    }

    // Access token not available and authSettings not loaded
    return (
      <div className={styles.loader} style={{ opacity: 0 }}>
        <Loader type="app" />
      </div>
    );
  }
});
