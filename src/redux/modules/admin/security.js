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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

/**
 * Action Types
 */
export const GET_GENERAL = 'admin/security/GET_GENERAL';
export const GET_GENERAL_SUCCESS = 'admin/security/GET_GENERAL_SUCCESS';
export const GET_GENERAL_FAIL = 'admin/security/GET_GENERAL_FAIL';

export const UPDATE_SECURITY = 'admin/UPDATE_SECURITY';
export const UPDATE_SECURITY_SUCCESS = 'admin/UPDATE_SECURITY_SUCCESS';
export const UPDATE_SECURITY_FAIL = 'admin/UPDATE_SECURITY_FAIL';

export const GET_SECURITY = 'admin/GET_SECURITY';
export const GET_SECURITY_SUCCESS = 'admin/GET_SECURITY_SUCCESS';
export const GET_SECURITY_FAIL = 'admin/GET_SECURITY_FAIL';

export const GET_PASSWORDRULES = 'admin/security/GET_PASSWORDRULES';
export const GET_PASSWORDRULES_SUCCESS = 'admin/security/GET_PASSWORDRULES_SUCCESS';
export const GET_PASSWORDRULES_FAIL = 'admin/security/GET_PASSWORDRULES_FAIL';

export const SET_PASSWORDRULES = 'admin/security/SET_PASSWORDRULES';
export const SET_PASSWORDRULES_SUCCESS = 'admin/security/SET_PASSWORDRULES_SUCCESS';
export const SET_PASSWORDRULES_FAIL = 'admin/security/SET_PASSWORDRULES_FAIL';

//story device
export const GET_ASSOCIATIONLOCK_USERS_GET = 'admin/security/GET_ASSOCIATIONLOCK_USERS_GET';
export const GET_ASSOCIATIONLOCK_USERS_GET_SUCCESS = 'admin/security/GET_ASSOCIATIONLOCK_USERS_GET_SUCCESS';
export const GET_ASSOCIATIONLOCK_USERS_GET_FAIL = 'admin/security/GET_ASSOCIATIONLOCK_USERS_GET_FAIL';

export const GET_ASSOCIATIONLOCK_DEVICES_GET = 'admin/security/GET_ASSOCIATIONLOCK_DEVICES_GET';
export const GET_ASSOCIATIONLOCK_DEVICES_GET_SUCCESS = 'admin/security/GET_ASSOCIATIONLOCK_DEVICES_GET_SUCCESS';
export const GET_ASSOCIATIONLOCK_DEVICES_GET_FAIL = 'admin/security/GET_ASSOCIATIONLOCK_DEVICES_GET_FAIL';

export const DELETE_ASSOCIATIONLOCK = 'admin/security/DELETE_ASSOCIATIONLOCK';
export const DELETE_ASSOCIATIONLOCK_SUCCESS = 'admin/security/DELETE_ASSOCIATIONLOCK_SUCCESS';
export const DELETE_ASSOCIATIONLOCK_FAIL = 'admin/security/DELETE_ASSOCIATIONLOCK_FAIL';

export const GET_BROWSERRESTRICTIONS = 'admin/security/GET_BROWSERRESTRICTIONS';
export const GET_BROWSERRESTRICTIONS_SUCCESS = 'admin/security/GET_BROWSERRESTRICTIONS_SUCCESS';
export const GET_BROWSERRESTRICTIONS_FAIL = 'admin/security/GET_BROWSERRESTRICTIONS_FAIL';

export const SET_BROWSERRESTRICTIONS = 'admin/security/SET_BROWSERRESTRICTIONS';
export const SET_BROWSERRESTRICTIONS_SUCCESS = 'admin/security/SET_BROWSERRESTRICTIONS_SUCCESS';
export const SET_BROWSERRESTRICTIONS_FAIL = 'admin/security/SET_BROWSERRESTRICTIONS_FAIL';

export const DELETE_BROWSERRESTRICTIONS = 'admin/security/DELETE_BROWSERRESTRICTIONS';
export const DELETE_BROWSERRESTRICTIONS_SUCCESS = 'admin/security/DELETE_BROWSERRESTRICTIONS_SUCCESS';
export const DELETE_BROWSERRESTRICTIONS_FAIL = 'admin/security/DELETE_BROWSERRESTRICTIONS_FAIL';

export const GET_DEVICEPINRULES = 'admin/security/GET_DEVICEPINRULES';
export const GET_DEVICEPINRULES_SUCCESS = 'admin/security/GET_DEVICEPINRULES_SUCCESS';
export const GET_DEVICEPINRULES_FAIL = 'admin/security/GET_DEVICEPINRULES_FAIL';

export const SET_DEVICEPINRULES = 'admin/security/SET_DEVICEPINRULES';
export const SET_DEVICEPINRULES_SUCCESS = 'admin/security/SET_DEVICEPINRULES_SUCCESS';
export const SET_DEVICEPINRULES_FAIL = 'admin/security/SET_DEVICEPINRULES_FAIL';

//AdminSecurityAuthentication
export const GET_LDAP = 'admin/security/GET_LDAP';
export const GET_LDAP_SUCCESS = 'admin/security/GET_LDAP_SUCCESS';
export const GET_LDAP_FAIL = 'admin/security/GET_LDAP_FAIL';

export const GET_SAML = 'admin/security/GET_SAML';
export const GET_SAML_SUCCESS = 'admin/security/GET_SAML_SUCCESS';
export const GET_SAML_FAIL = 'admin/security/GET_SAML_FAIL';

export const GET_OAUTHSETTINGS = 'admin/security/GET_OAUTHSETTINGS';
export const GET_OAUTHSETTINGS_SUCCESS = 'admin/security/GET_OAUTHSETTINGS_SUCCESS';
export const GET_OAUTHSETTINGS_FAIL = 'admin/security/GET_OAUTHSETTINGS_FAIL';

export const SET_OAUTHSETTINGS = 'admin/security/SET_OAUTHSETTINGS';
export const SET_OAUTHSETTINGS_SUCCESS = 'admin/security/SET_OAUTHSETTINGS_SUCCESS';
export const SET_OAUTHSETTINGS_FAIL = 'admin/security/SET_OAUTHSETTINGS_FAIL';

export const SET_SAML = 'admin/security/SET_SAML';
export const SET_SAML_SUCCESS = 'admin/security/SET_SAML_SUCCESS';
export const SET_SAML_FAIL = 'admin/security/SET_SAML_FAIL';

export const SET_LDAP_AD = 'admin/security/SET_LDAP_AD';
export const SET_LDAP_AD_SUCCESS = 'admin/security/SET_LDAP_AD_SUCCESS';
export const SET_LDAP_AD_FAIL = 'admin/security/SET_LDAP_AD_FAIL';

export const SET_LDAP_EDIR = 'admin/security/SET_LDAP_EDIR';
export const SET_LDAP_EDIR_SUCCESS = 'admin/security/SET_LDAP_EDIR_SUCCESS';
export const SET_LDAP_EDIR_FAIL = 'admin/security/SET_LDAP_EDIR_FAIL';

export const LDAP_TEST = 'admin/security/LDAP_TEST';
export const LDAP_TEST_SUCCESS = 'admin/security/LDAP_TEST_SUCCESS';
export const LDAP_TEST_FAIL = 'admin/security/LDAP_TEST_FAIL';

export const GET_DNSALIAS = 'admin/security/GET_DNSALIAS';
export const GET_DNSALIAS_SUCCESS = 'admin/security/GET_DNSALIAS_SUCCESS';
export const GET_DNSALIAS_FAIL = 'admin/security/GET_DNSALIAS_FAIL';

export const GET_ALL_DNSALIAS = 'admin/security/GET_ALL_DNSALIAS';
export const GET_ALL_DNSALIAS_SUCCESS = 'admin/security/GET_ALL_DNSALIAS_SUCCESS';
export const GET_ALL_DNSALIAS_FAIL = 'admin/security/GET_ALL_DNSALIAS_FAIL';

export const GET_SAML_SETTINGS = 'admin/security/GET_SAML_SETTINGS';
export const GET_SAML_SETTINGS_SUCCESS = 'admin/security/GET_SAML_SETTINGS_SUCCESS';
export const GET_SAML_SETTINGS_FAIL = 'admin/security/GET_SAML_SETTINGS_FAIL';

export const SET_DNSALIAS = 'admin/security/SET_DNSALIAS';
export const SET_DNSALIAS_SUCCESS = 'admin/security/SET_DNSALIAS_SUCCESS';
export const SET_DNSALIAS_FAIL = 'admin/security/SET_DNSALIAS_FAIL';

export const DELETE_DNSALIAS = 'admin/security/DELETE_DNSALIAS';
export const DELETE_DNSALIAS_SUCCESS = 'admin/security/DELETE_DNSALIAS_SUCCESS';
export const DELETE_DNSALIAS_FAIL = 'admin/security/DELETE_DNSALIAS_FAIL';

export const VALIDATE_DNSALIAS = 'admin/security/VALIDATE_DNSALIAS';
export const VALIDATE_DNSALIAS_SUCCESS = 'admin/security/VALIDATE_DNSALIAS_SUCCESS';
export const VALIDATE_DNSALIAS_FAIL = 'admin/security/VALIDATE_DNSALIAS_FAIL';

export const RESET_DNS_VALIDATION = 'admin/security/RESET_DNS_VALIDATION';
export const UPDATE_HASUNSAVEDDNSALIAS = 'admin/security/UPDATE_HASUNSAVEDDNSALIAS';

export const GET_APPLICATIONKEYS = 'admin/security/GET_APPLICATIONKEYS';
export const GET_APPLICATIONKEYS_SUCCESS = 'admin/security/GET_APPLICATIONKEYS_SUCCESS';
export const GET_APPLICATIONKEYS_FAIL = 'admin/security/GET_APPLICATIONKEYS_FAIL';

export const SET_APPLICATIONKEYS = 'admin/security/SET_APPLICATIONKEYS';
export const SET_APPLICATIONKEYS_SUCCESS = 'admin/security/SET_APPLICATIONKEYS_SUCCESS';
export const SET_APPLICATIONKEYS_FAIL = 'admin/security/SET_APPLICATIONKEYS_FAIL';

export const GET_LIST = 'admin/security/GET_LIST';
export const GET_LIST_SUCCESS = 'admin/security/GET_LIST_SUCCESS';
export const GET_LIST_FAIL = 'admin/security/GET_LIST_FAIL';

export const POST = 'admin/security/POST';
export const POST_SUCCESS = 'admin/security/POST_SUCCESS';
export const POST_FAIL = 'admin/security/POST_FAIL';

export const PUT = 'admin/security/PUT';
export const PUT_SUCCESS = 'admin/security/PUT_SUCCESS';
export const PUT_FAIL = 'admin/security/PUT_FAIL';

export const DELETE = 'admin/security/DELETE';
export const DELETE_SUCCESS = 'admin/security/DELETE_SUCCESS';
export const DELETE_FAIL = 'admin/security/DELETE_FAIL';

export const PATCH = 'admin/security/PATCH_CSPWHITELIST';
export const PATCH_SUCCESS = 'admin/security/PATCH_SUCCESS';
export const PATCH_FAIL = 'admin/security/PATCH_FAIL';

export const CLOSE = 'admin/security/CLOSE';

export const GET_USERS = 'associationlock/users/get';
export const GET_DEVICES = 'associationlock/devices/get';
export const ASSOCIATIONLOCK = 'associationlock';
export const BROWSERRESTRICTIONS = 'browserrestrictions';
export const DEVICEPINRULES = 'devicepinrules';
export const LDAP = 'ldap';
export const SAML = 'saml';
export const LDAP_AD = 'ldap/ad';
export const LDAP_EDIR = 'ldap/edir';
export const LDAP_TEST_POST = 'ldap/test';
export const OAUTHSETTINGS = 'oauthsettings';
export const SET_DATA = 'emailTemplates/SET_DATA';
export const APPLICATIONKEYS = 'applicationKeys';
export const cspwhitelist = 'cspwhitelist';
export const cspsettings = 'cspsettings';

export const globalFetchLimit = 100;

const reduceName = 'security';

/**
 * Initial State
 */
export const initialState = {
  loaded: false,
  loading: true,
  updated: false,
  updating: false,
  deleting: false,
  deleted: false,
  associationLock: [],
  devices: [],
  associationLockLoading: false,
  currentUserId: null,
  browserRestrictions: [],
  error: null,
  currentSelectedDnsAlias: null,
  alias: '',
  dnsAliases: [],
  dnsAliasUrl: [],
  dnsAliasAvailabilities: {
    new: true
  },
  hasUnsavedDnsAlias: {
    new: false
  },
  samlLoading: false,
  showingSaveDnsDialogue: false,
  modified: false,
  cspwhitelist: [],
  cspsettings: {
    allowModals: false,
    allowSandboxedForms: false,
    allowScriptUnsafeInline: false,
    allowScriptUnsafeEval: false,
  },
  secureStorage: {
    enabled: false,
    blurEmailThumbnails: false
  }
};

/**
 * Reducer
 */
export default function adminSecurity(state = initialState, action = {}) {
  const loadingTrueList = [
    GET_GENERAL,
    GET_PASSWORDRULES,
    GET_BROWSERRESTRICTIONS,
    GET_DEVICEPINRULES,
    GET_LDAP,
    GET_SAML,
    GET_SECURITY,
    GET_OAUTHSETTINGS,
    GET_DNSALIAS,
    GET_APPLICATIONKEYS,
  ];

  const loadedTrueList = [
    GET_GENERAL_SUCCESS,
    GET_PASSWORDRULES_SUCCESS,
    GET_BROWSERRESTRICTIONS_SUCCESS,
    GET_DEVICEPINRULES_SUCCESS,
    GET_LDAP_SUCCESS,
    GET_SAML_SUCCESS,
    GET_SECURITY_SUCCESS,
    GET_OAUTHSETTINGS_SUCCESS,
    GET_DNSALIAS_SUCCESS,
    GET_APPLICATIONKEYS_SUCCESS
  ];

  const loaded = (action.customLoad || 'load') + 'ed';
  const loading = (action.customLoad || 'load') + 'ing';

  switch (action.type) {
    case GET_GENERAL:
    case UPDATE_SECURITY:
    case GET_PASSWORDRULES:
    case SET_PASSWORDRULES:
    case GET_ASSOCIATIONLOCK_USERS_GET:
    case DELETE_ASSOCIATIONLOCK:
    case GET_ASSOCIATIONLOCK_DEVICES_GET:
    case GET_BROWSERRESTRICTIONS:
    case SET_BROWSERRESTRICTIONS:
    case DELETE_BROWSERRESTRICTIONS:
    case GET_DEVICEPINRULES:
    case SET_DEVICEPINRULES:
    case GET_SECURITY:
    case GET_LDAP:
    case GET_SAML:
    case GET_OAUTHSETTINGS:
    case SET_OAUTHSETTINGS:
    case SET_SAML:
    case GET_APPLICATIONKEYS:
    case SET_APPLICATIONKEYS:
    case SET_LDAP_AD:
    case SET_LDAP_EDIR:
      return {
        ...state,
        loaded: false,
        loading: loadingTrueList.indexOf(action.type) > -1,
        updated: false,
        updating: action.type === UPDATE_SECURITY || action.type === SET_PASSWORDRULES,
        ldapAdUpdating: action.type === SET_LDAP_AD,
        ldapEdirUpdating: action.type === SET_LDAP_EDIR,
        ldapSamlUpdating: action.type === SET_SAML,
        oauthUpdating: action.type === SET_OAUTHSETTINGS,
        associationLockLoading: action.type === GET_ASSOCIATIONLOCK_USERS_GET,
        deleting: action.type === DELETE_ASSOCIATIONLOCK,
        deleted: false,
        currentUserId: null,
        error: null
      };
    case LDAP_TEST:
      return {
        ...state,
        ldapTestResult: {},
      };
    case GET_GENERAL_SUCCESS:
    case UPDATE_SECURITY_SUCCESS:
    case GET_SECURITY_SUCCESS:
    case GET_PASSWORDRULES_SUCCESS:
    case SET_PASSWORDRULES_SUCCESS:
    case GET_DEVICEPINRULES_SUCCESS:
    case SET_DEVICEPINRULES_SUCCESS:
    case GET_LDAP_SUCCESS:
    case GET_SAML_SUCCESS:
    case GET_OAUTHSETTINGS_SUCCESS:
    case SET_OAUTHSETTINGS_SUCCESS:
    case SET_SAML_SUCCESS:
    case SET_LDAP_AD_SUCCESS:
    case SET_LDAP_EDIR_SUCCESS:
    case GET_APPLICATIONKEYS_SUCCESS:
    case SET_APPLICATIONKEYS_SUCCESS: {
      let newState = { ...action.result };
      if (action.params && action.params.key === 'blurThumbnails') {
        newState = {
          secureStorage: {
            ...state.secureStorage,
            blurEmailThumbnails: action.result.blurThumbnails
          }
        };
      }
      return {
        ...state,
        loaded: loadedTrueList.indexOf(action.type) > -1,
        loading: false,
        updated: action.type === UPDATE_SECURITY_SUCCESS || action.type === SET_PASSWORDRULES_SUCCESS,
        updating: false,
        ldapAdUpdating: false,
        ldapEdirUpdating: false,
        ldapSamlUpdating: false,
        oauthUpdating: false,
        associationLockLoading: false,
        activeForest: action.activeForest ? JSON.parse(action.activeForest) : state.activeForest,
        ...newState
      };
    }
    case GET_ASSOCIATIONLOCK_DEVICES_GET_SUCCESS:
      return {
        ...state,
        currentUserId: action.userId,
        devices: action.result
      };
    case GET_ASSOCIATIONLOCK_USERS_GET_SUCCESS:
      return {
        ...state,
        associationLock: action.offset > 0 ? state.associationLock.concat(action.result) : action.result,
        associationLockLoading: false,
        associationLockComplete: action.result.length < globalFetchLimit,
        associationLockError: null
      };
    case DELETE_ASSOCIATIONLOCK_SUCCESS:
      return {
        ...state,
        associationLock: state.associationLock.filter(item => +item.userId !== +action.userId)
      };
    case GET_BROWSERRESTRICTIONS_SUCCESS:
      return {
        ...state,
        browserRestrictions: action.result
      };
    case SET_BROWSERRESTRICTIONS_SUCCESS: {
      if (action.id) {
        return {
          ...state,
          browserRestrictions: state.browserRestrictions.map(item => (Number(item.id) === Number(action.result.id)
            ? action.result : item))
        };
      }

      return {
        ...state,
        browserRestrictions: state.browserRestrictions.concat(action.result)
      };
    }

    case DELETE_BROWSERRESTRICTIONS_SUCCESS:
      return {
        ...state,
        browserRestrictions: state.browserRestrictions.filter(item => Number(item.id) !== Number(action.id))
      };
    case LDAP_TEST_SUCCESS:
      return {
        ...state,
        ldapTestResult: {
          isError: action.result.status === 0,
          message: JSON.stringify(action.result),
        }
      };
    case GET_LIST:
    case PATCH:
    case POST:
    case PUT:
    case DELETE:
    case PATCH_SUCCESS:
    case DELETE_SUCCESS:
      return {
        ...state,
        [loaded]: [PATCH_SUCCESS, DELETE_SUCCESS].indexOf(action.type) > -1,
        [loading]: [GET_LIST, PATCH, POST, PUT, DELETE].indexOf(action.type) > -1,
        error: null,
      };
    case POST_SUCCESS:
      return {
        ...state,
        [loaded]: action.type === POST_SUCCESS,
        [loading]: action.type === POST,
        [action.name]: state[action.name].map(item => (+item.id === -1 ? action.result : item)),
        error: null,
      };
    case GET_LIST_SUCCESS: {
      return {
        ...state,
        [loaded]: action.type === GET_LIST_SUCCESS,
        [loading]: false,
        [action.name]: action.result
      };
    }
    case GET_GENERAL_FAIL:
    case UPDATE_SECURITY_FAIL:
    case GET_PASSWORDRULES_FAIL:
    case SET_PASSWORDRULES_FAIL:
    case GET_ASSOCIATIONLOCK_USERS_GET_FAIL:
    case DELETE_ASSOCIATIONLOCK_FAIL:
    case GET_ASSOCIATIONLOCK_DEVICES_GET_FAIL:
    case GET_DEVICEPINRULES_FAIL:
    case GET_BROWSERRESTRICTIONS_FAIL:
    case SET_DEVICEPINRULES_FAIL:
    case SET_BROWSERRESTRICTIONS_FAIL:
    case DELETE_BROWSERRESTRICTIONS_FAIL:
    case GET_SECURITY_FAIL:
    case GET_LDAP_FAIL:
    case GET_SAML_FAIL:
    case GET_OAUTHSETTINGS_FAIL:
    case SET_OAUTHSETTINGS_FAIL:
    case SET_LDAP_AD_FAIL:
    case SET_LDAP_EDIR_FAIL:
    case LDAP_TEST_FAIL:
    case GET_DNSALIAS_FAIL:
    case SET_DNSALIAS_FAIL:
    case GET_APPLICATIONKEYS_FAIL:
    case SET_APPLICATIONKEYS_FAIL:
    case GET_LIST_FAIL:
    case POST_FAIL:
    case PUT_FAIL:
    case PATCH_FAIL:
    case DELETE_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        updated: false,
        updating: false,
        deleting: false,
        deleted: false,
        associationLockLoading: false,
        //new api return error if the field is null
        ldapSamlUpdating: action.type === SET_SAML,
        error: action.error
      };
    case SET_SAML_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        updated: false,
        updating: false,
        associationLockLoading: false,
        ldapSamlUpdating: false,
        error: action.error
      };
    case GET_DNSALIAS_SUCCESS: {
      return {
        ...state,
        loaded: true,
        loading: false,
        alias: action.result.alias || action.result,
        dnsAliasUrl: action.result.urls || []
      };
    }
    case SET_DNSALIAS:
    case DELETE_DNSALIAS:
      return {
        ...state,
        updated: false,
        updating: true,
        modified: false,
      };

    case SET_DNSALIAS_SUCCESS:
    case DELETE_DNSALIAS_SUCCESS:
      return {
        ...state,
        updated: true,
        updating: false,
        hasUnsavedDnsAlias: action.id ? {
          ...state.hasUnsavedDnsAlias,
          [action.id]: false
        } : {
          ...state.hasUnsavedDnsAlias,
          new: false
        },
      };

    case UPDATE_HASUNSAVEDDNSALIAS: {
      return {
        ...state,
        hasUnsavedDnsAlias: action.id ? {
          ...state.hasUnsavedDnsAlias,
          [action.id]: action.status
        } : {
          ...state.hasUnsavedDnsAlias,
          new: action.status
        }
      };
    }

    case VALIDATE_DNSALIAS: {
      return {
        ...state,
        updating: false
      };
    }
    case GET_ALL_DNSALIAS: {
      return {
        ...state,
        loaded: true,
        loading: false,
        dnsAliases: []
      };
    }
    case GET_ALL_DNSALIAS_SUCCESS: {
      return {
        ...state,
        dnsAliases: action.result,
        updated: true,
        updating: false
      };
    }

    case GET_SAML_SETTINGS: {
      return {
        ...state,
        samlLoading: true,
        currentSelectedDnsAlias: action.params.dnsAlias
      };
    }
    case GET_SAML_SETTINGS_SUCCESS: {
      return {
        ...state,
        samlLoading: false,
        ...action.result
      };
    }
    case GET_SAML_SETTINGS_FAIL: {
      return {
        ...state,
        samlLoading: false,
        ...action.result
      };
    }
    case VALIDATE_DNSALIAS_SUCCESS: {
      return {
        ...state,
        dnsAliasAvailabilities: {
          ...state.dnsAliasAvailabilities,
          [action.id]: action.result.isAvailable
        }
      };
    }
    case VALIDATE_DNSALIAS_FAIL: {
      return {
        ...state,
      };
    }

    case SET_DATA: {
      return {
        ...state,
        ...action.params
      };
    }

    case CLOSE:
      return initialState;

    case RESET_DNS_VALIDATION:
      return {
        ...state,
        dnsAliasAvailabilities: {
          ...state.dnsAliasAvailabilities,
          [action.id]: true
        }
      };

    default:
      return state;
  }
}
/**
 * Action Creators
 */
export function getSecurity(name) {
  const path = `/admin/security/${name}/get`;
  const type = `admin/security/GET_${name.toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function getDNSAliases() {
  const path = '/dnsaliases';
  return {
    types: [GET_ALL_DNSALIAS, GET_ALL_DNSALIAS_SUCCESS, GET_ALL_DNSALIAS_FAIL],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function getSamlSettings(dnsAlias) {
  const path = `/samlsettings/${dnsAlias}`;
  return {
    types: [GET_SAML_SETTINGS, GET_SAML_SETTINGS_SUCCESS, GET_SAML_SETTINGS_FAIL],
    params: {
      dnsAlias
    },
    promise: (client) => client.get(path, 'webapi')
  };
}

export function setSamlSettings(update) {
  const path = '/samlsettings';
  return {
    types: [SET_SAML, SET_SAML_SUCCESS, SET_SAML_FAIL],
    promise: (client) => client.post(path, 'webapi', {
      data: update
    })
  };
}
export function setSetting(update) {
  const path = '/admin/security/setsetting';

  return {
    types: [UPDATE_SECURITY, UPDATE_SECURITY_SUCCESS, UPDATE_SECURITY_FAIL],
    params: {
      key: Object.keys(update)[0],
      value: update[Object.keys(update)[0]]
    },
    promise: (client) => client.post(path, 'webapi', {
      params: update
    })
  };
}

export function getSetting() {
  const path = '/admin/security/getsetting';

  return {
    types: [GET_SECURITY, GET_SECURITY_SUCCESS, GET_SECURITY_FAIL],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function setCustomSecurity(name, update) {
  const path = `/admin/security/${name}/set`;
  const type = `admin/security/SET_${name.toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.post(path, 'webapi', {
      data: {
        param: Object.keys(update)[0],
        value: update[Object.keys(update)[0]],
      },
    })
  };
}

export function setCustomSecurityMultiKeys(name, update) {
  const path = `/admin/security/${name}/set`;
  let type = `admin/security/SET_${name.toUpperCase()}`;
  if (name.indexOf('/') > -1) {
    type = `admin/security/SET_${name.split('/').join('_').toUpperCase()}`;
  }

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    ...update,
    promise: (client) => client.post(path, 'webapi', {
      data: update,
    })
  };
}

export function setCustomSecurityMultiKeysForm(name, update) {
  const path = `/admin/security/${name}/set`;
  let type = `admin/security/SET_${name.toUpperCase()}`;
  if (name.indexOf('/') > -1) {
    type = `admin/security/SET_${name.split('/').join('_').toUpperCase()}`;
  }

  // Attach file as FormData
  const formData = new FormData();
  for (const prop in update) {
    if (Object.prototype.hasOwnProperty.call(update, prop)) {
      formData.append(prop, update[prop]);
    }
  }

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    ...update,
    promise: (client) => client.post(path, 'webapi', {
      data: formData
    })
  };
}

/* get list */
export function getSecurityList(name, offset = -1, sortBy, params = {}) {
  const path = `/admin/security/${name}`;
  const type = `admin/security/GET_${name.split('/').join('_').toUpperCase()}`;

  let properties = {};

  if (offset > -1) {
    properties = {
      ...properties,
      limit: globalFetchLimit,
      offset,
    };
  }

  if (sortBy) {
    properties = {
      ...properties,
      sortBy,
    };
  }

  if (params) {
    properties = {
      ...properties,
      ...params,
    };
  }

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    ...properties,
    promise: (client) => client.get(path, 'webapi', {
      params: properties
    })
  };
}

export function deleteSecurity(name, params) {
  const path = `/admin/security/${name}/delete`;
  const type = `admin/security/DELETE_${name.toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    ...params,
    promise: (client) => client.post(path, 'webapi', {
      data: params,
    })
  };
}


export function customSecurityPost(name, params) {
  const path = `/admin/security/${name}`;
  const type = `admin/security/${name.split('/').join('_').toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    ...params,
    promise: (client) => client.post(path, 'webapi', {
      data: params,
    })
  };
}

export function getDnsAlias() {
  const path = '/dnsaliases';

  return {
    types: [GET_DNSALIAS, GET_DNSALIAS_SUCCESS, GET_DNSALIAS_FAIL],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function validateDnsAlias({ alias, id }) {
  const path = '/dnsalias/availability';

  return {
    types: [VALIDATE_DNSALIAS, VALIDATE_DNSALIAS_SUCCESS, VALIDATE_DNSALIAS_FAIL],
    id: id,
    promise: (client) => client.get(path, 'webapi', { params: { alias } })
  };
}

export function resetDnsValidation(id) {
  return {
    type: RESET_DNS_VALIDATION,
    id: id
  };
}

export function deleteDnsAlias(id) {
  const path = `/dnsalias/${id}`;

  return {
    types: [DELETE_DNSALIAS, DELETE_DNSALIAS_SUCCESS, DELETE_DNSALIAS_FAIL],
    promise: (client) => client.del(path, 'webapi')
  };
}

export function setDnsAlias(alias) {
  const path = '/dnsalias';

  return {
    types: [SET_DNSALIAS, SET_DNSALIAS_SUCCESS, SET_DNSALIAS_FAIL],
    promise: (client) => client.post(path, 'webapi', {
      data: {
        alias: alias,
      },
    })
  };
}

export function updateDnsAlias({ id, newAlias }) {
  const path = `/dnsalias/${id}`;

  return {
    types: [SET_DNSALIAS, SET_DNSALIAS_SUCCESS, SET_DNSALIAS_FAIL],
    id: id,
    promise: (client) => client.put(path, 'webapi', {
      body: {
        newAlias: newAlias,
      },
    })
  };
}

export function updateHasUnSavedDnsAlias({ id, status }) {
  return {
    type: UPDATE_HASUNSAVEDDNSALIAS,
    id: id,
    status: status
  };
}

export function getList(name, customLoad = 'load') {
  const path = `/admin/${reduceName}/${name}`;
  return {
    types: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    customLoad,
    name,
    promise: (client) => client.get(path, 'webapi')
  };
}

export function post(name, params, customLoad = 'postLoad') {
  const path = `/admin/${reduceName}/${name}`;
  return {
    types: [POST, POST_SUCCESS, POST_FAIL],
    customLoad,
    name,
    promise: (client) => client.post(path, 'webapi', {
      body: params,
    })
  };
}

export function put(name, id, params, customLoad = 'putLoad') {
  const path = `/admin/${reduceName}/${name}${id ? '/' + id : ''}`;
  return {
    types: [PUT, PUT_SUCCESS, PUT_FAIL],
    customLoad,
    promise: (client) => client.put(path, 'webapi', {
      body: params
    })
  };
}

export function patch(name, id, params, customLoad = 'patchLoad') {
  const path = `/admin/${reduceName}/${name}/${id}`;
  return {
    types: [PATCH, PATCH_SUCCESS, PATCH_FAIL],
    customLoad,
    promise: (client) => client.patch(path, 'webapi', {
      body: params
    })
  };
}
//
export function deleteById(name, id, customLoad = 'deleteLoad') {
  const path = `/admin/${reduceName}/${name}/${id}`;
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    customLoad,
    promise: (client) => client.del(path, 'webapi')
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}
