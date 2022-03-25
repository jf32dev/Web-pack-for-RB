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

import { LOAD_SETTINGS_SUCCESS } from './settings';

export const LOAD_FAIL = 'auth/LOAD_FAIL';

export const LOAD_AUTH_SETTINGS = 'auth/LOAD_AUTH_SETTINGS';
export const LOAD_AUTH_SETTINGS_SUCCESS = 'auth/LOAD_AUTH_SETTINGS_SUCCESS';
export const LOAD_AUTH_SETTINGS_FAIL = 'auth/LOAD_AUTH_SETTINGS_FAIL';

export const REFRESH_SUCCESS = 'auth/REFRESH_SUCCESS';

export const LOGIN = 'auth/LOGIN';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAIL = 'auth/LOGIN_FAIL';

export const RESET_PASSWORD = 'auth/RESET_PASSWORD';
export const RESET_PASSWORD_SUCCESS = 'auth/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAIL = 'auth/RESET_PASSWORD_FAIL';

export const LOGOUT = 'auth/LOGOUT';
export const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'auth/LOGOUT_FAIL';

export const SET_TOKENS = 'auth/SET_TOKENS';

export const ACTIVATE = 'auth/ACTIVATE';
export const ACTIVATE_SUCCESS = 'auth/ACTIVATE_SUCCESS';
export const ACTIVATE_FAIL = 'auth/ACTIVATE_FAIL';

export const VERIFY_ACTIVATE_TOKEN = 'auth/VERIFY_ACTIVATE_TOKEN';
export const VERIFY_ACTIVATE_TOKEN_SUCCESS = 'auth/VERIFY_ACTIVATE_TOKEN_SUCCESS';
export const VERIFY_ACTIVATE_TOKEN_FAIL = 'auth/VERIFY_ACTIVATE_TOKEN_FAIL';

export const RECOVER = 'auth/RECOVER';
export const RECOVER_SUCCESS = 'auth/RECOVER_SUCCESS';
export const RECOVER_FAIL = 'auth/RECOVER_FAIL';

export const initialState = {
  loaded: false,
  loading: false,
  loggedIn: false,
  loggingOut: false,
  loginSettings: {
    appstoreBitmask: 15,
    appLinks: 'on',
    iosAppDownload: 'https://itunes.apple.com/us/app/bigtincan-hub/id1057042059?mt=8',
    androidAppDownload: 'https://play.google.com/store/apps/details?id=com.bigtincan.mobile.hub',
    windowsAppDownload: 'http://www.windowsphone.com/en-us/store/app/bigtincan-hub/6644204c-501e-4624-beee-c51fbcf4a2ff',
    companyName: 'Bigtincan',
    cloud: 'on',
    ldap: 'off',
    saml: 'off',
    image: '',
    logo: '/static/img/logo_with_text.png',
    theme: {
      baseColor: '#F26724',
      darkBaseColor: '#B03100',
      lightBaseColor: '#FBD4BF',
      accentColor: '#43b7f1',
      baseText: '#ffffff',
      backgroundColor: '#ffffff',
      textIcons: '#ffffff',

      primaryText: '#222222',
      secondaryText: '#666666',
      dividerColor: '#dddddd',
      disabledColor: '#999999',

      infoColor: '#ffe5a7',
      errorColor: '#bf1515',
      destructiveColor: '#FF0000',
      successColor: '#04d97e',
    },
    text: '',
    textColour: '#fff',
    countryCode: ''
  },
  BTCTK_A: null,
  BTCTK_R: null,
  expires_in: null,
  resettingPassword: false,
  resetDone: false,
  samlLogoutURL: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        loginSettings: {
          ...initialState.loginSettings
        },
        BTCTK_A: null,
        BTCTK_R: null,
        expires_in: null,
        error: action.error
      };

    case LOAD_AUTH_SETTINGS:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case LOAD_AUTH_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        loginSettings: {
          appstoreBitmask: action.result.appstoreBitmask,
          appLinks: action.result.appLinks,
          iosAppDownload: action.result.iosAppDownload,
          androidAppDownload: action.result.androidAppDownload,
          windowsAppDownload: action.result.windowsAppDownload,
          companyName: action.result.companyName,
          cloud: 'on',
          ldap: action.result.ldap,
          saml: action.result.saml,
          image: action.result.wallpaper,
          logo: action.result.logo,
          theme: {
            ...initialState.loginSettings.theme,
            ...action.result.theme
          },
          text: action.result.loginText,
          textColour: action.result.loginTextColour,
          countryCode: action.result.countryCode
        }
      };
    case LOAD_AUTH_SETTINGS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        loginSettings: {
          ...initialState.loginSettings
        },
        error: action.error
      };

    case REFRESH_SUCCESS:
      return {
        ...state,
        restored: true,
        loggedIn: true,
        BTCTK_A: action.result.oauth2.access_token,
        BTCTK_R: action.result.oauth2.refresh_token,
        expires_in: action.result.oauth2.expires_in
      };

    case LOGIN:
      return {
        ...state,
        loggingIn: true,
        loggedIn: false,
        loggedOut: false,
        loginError: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        restored: true,
        BTCTK_A: action.result.oauth2.access_token,
        BTCTK_R: action.result.oauth2.refresh_token,
        expires_in: action.result.oauth2.expires_in
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        restored: false,
        BTCTK_A: null,
        BTCTK_R: null,
        expires_in: null,
        loginError: action.error
      };
    case RESET_PASSWORD:
      return {
        ...state,
        resettingPassword: false,
        resetDone: false,
        error: null
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resettingPassword: false,
        resetDone: true
      };
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        resettingPassword: false,
        resetDone: false,
        error: action.error
      };
    case LOGOUT:
      return {
        ...initialState,
        BTCTK_A: null,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: false,
        loggingOut: false,
        samlLogoutURL: action.result.saml_slo_redirect_url
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        loggedOut: false,
        logoutError: action.error
      };

    case SET_TOKENS:
      return {
        ...state,
        restored: true, // tokens restored from localStorage
        BTCTK_A: action.data.BTCTK_A,
        BTCTK_R: action.data.BTCTK_R,
        expires_in: action.data.expires_in
      };

    case ACTIVATE:
      return {
        ...state,
        activateLoading: true
      };
    case ACTIVATE_SUCCESS:
      return {
        ...state,
        activateLoading: false,
        activateSubmitted: true
      };
    case ACTIVATE_FAIL:
      return {
        ...state,
        activateLoading: false,
        activateError: action.error
      };
    case VERIFY_ACTIVATE_TOKEN_FAIL:
      return {
        ...state,
        invalidToken: true
      };

    case LOAD_SETTINGS_SUCCESS:
      return {
        ...state,
        loggedIn: true
      };

    default:
      return state;
  }
}

export function setTokens(tokens) {
  return {
    type: SET_TOKENS,
    data: {
      BTCTK_A: tokens.BTCTK_A,
      BTCTK_R: tokens.BTCTK_R,
      expires_in: tokens.expires_in
    }
  };
}

export function loadAuthSettings() {
  return {
    types: [
      LOAD_AUTH_SETTINGS,
      LOAD_AUTH_SETTINGS_SUCCESS,
      LOAD_AUTH_SETTINGS_FAIL
    ],
    promise: client => client.get('/system/authSettings')
  };
}

export function login(email, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client =>
      client.post('/signin', 'webapi', {
        data: {
          email: email,
          password: password
        }
      })
  };
}

export function resetPassword(token, password) {
  return {
    types: [RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL],
    promise: client =>
      client.patch('/passwordReset', 'webapi', {
        data: {
          token,
          password
        }
      })
  };
}

export function loginLDAP(username, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client =>
      client.post('/signin', 'webapi', {
        data: {
          ldap_username: username,
          password: password
        }
      })
  };
}

export function refreshAuth() {
  return {
    types: [null, REFRESH_SUCCESS, LOGIN_FAIL],
    promise: client =>
      client.post('/signin', 'webapi', {
        data: {
          refresh_token: localStorage.getItem('BTCTK_R'),
          grant_type: 'refresh_token'
        }
      })
  };
}

export function logout() {
  return function(dispatch) {
    dispatch({
      types: [null, null, null],
      promise: client => client.post('/jinfonet/btcLogout.jsp', 'report') // Revoke jReport Session
    });

    dispatch({
      types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
      promise: client => client.get('/signout')
    });
  };
}

export function activateUser(token, password, confirmPassword) {
  return {
    types: [ACTIVATE, ACTIVATE_SUCCESS, ACTIVATE_FAIL],
    promise: client => client.post('/activate', 'webapi', {
      data: {
        token: token,
        password: password,
        confirm_password: confirmPassword
      }
    })
  };
}

export function verifyActivateToken(token) {
  return {
    types: [VERIFY_ACTIVATE_TOKEN, VERIFY_ACTIVATE_TOKEN_SUCCESS, VERIFY_ACTIVATE_TOKEN_FAIL],
    promise: client => client.post('/activate/verify', 'webapi', {
      data: {
        t: token
      }
    })
  };
}

export function recoverPassword() {
  return {
    types: [RECOVER, RECOVER_SUCCESS, RECOVER_FAIL],
    promise: client => client.get('/forgotPassword')
  };
}
