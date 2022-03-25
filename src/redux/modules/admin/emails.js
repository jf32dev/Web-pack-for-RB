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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

/**
 * Action Types
 */
export const GET_SMTP = 'admin/emails/GET_SMTP';
export const GET_SMTP_SUCCESS = 'admin/emails/GET_SMTP_SUCCESS';
export const GET_SMTP_FAIL = 'admin/emails/GET_SMTP_FAIL';

export const UPDATE_EMAIL = 'admin/UPDATE_EMAIL';
export const UPDATE_EMAIL_SUCCESS = 'admin/UPDATE_EMAIL_SUCCESS';
export const UPDATE_EMAIL_FAIL = 'admin/UPDATE_EMAIL_FAIL';

export const TEST_SMTP = 'admin/emails/TEST_SMTP';
export const TEST_SMTP_SUCCESS = 'admin/emails/TEST_SMTP_SUCCESS';
export const TEST_SMTP_FAIL = 'admin/emails/TEST_SMTP_FAIL';

export const GET_COMPLIANCE = 'admin/emails/GET_COMPLIANCE';
export const GET_COMPLIANCE_SUCCESS = 'admin/emails/GET_COMPLIANCE_SUCCESS';
export const GET_COMPLIANCE_FAIL = 'admin/emails/GET_COMPLIANCE_FAIL';

export const GET_EMAIL_NOTIFICATION_LOGO = 'admin/emails/GET_EMAIL_NOTIFICATION_LOGO';
export const GET_EMAIL_NOTIFICATION_LOGO_SUCCESS = 'admin/emails/GET_EMAIL_NOTIFICATION_LOGO_SUCCESS';
export const GET_EMAIL_NOTIFICATION_LOGO_FAIL = 'admin/emails/GET_EMAIL_NOTIFICATION_LOGO_FAIL';

export const SET_EMAIL_NOTIFICATION_LOGO = 'admin/emails/SET_EMAIL_NOTIFICATION_LOGO';
export const SET_EMAIL_NOTIFICATION_LOGO_SUCCESS = 'admin/emails/SET_EMAIL_NOTIFICATION_LOGO_SUCCESS';
export const SET_EMAIL_NOTIFICATION_LOGO_FAIL = 'admin/emails/SET_EMAIL_NOTIFICATION_LOGO_FAIL';

export const CLOSE = 'admin/email/CLOSE';
export const SET_DATA = 'admin/email/SET_DATA';

/**
 * Initial State
 */
export const initialState = {
  compliance: {},
  complianceLoaded: false,
  complianceLoading: false,

  loaded: false,
  loading: false,
  updated: false,
  updating: false,
  tested: false,
  testing: false,
  error: null,

  notificationLogo: null,
  notificationLogoLoading: false,
  notificationLogoLoaded: false,
  notificationLogoUploading: false,
  thumbnailBase64: null
};

/**
 * Reducer
 */
export default function adminEmail(state = initialState, action = {}) {
  switch (action.type) {
    case GET_COMPLIANCE:
    case GET_SMTP:
    case UPDATE_EMAIL:
    case TEST_SMTP:
      return {
        ...state,
        complianceLoading: action.type === GET_COMPLIANCE,
        complianceLoaded: false,
        loaded: false,
        loading: action.type === GET_SMTP,
        updated: false,
        updating: action.type === UPDATE_EMAIL,
        tested: false,
        testing: action.type === TEST_SMTP,
        error: null,
        toAddress: null
      };

    case GET_SMTP_SUCCESS:
    case UPDATE_EMAIL_SUCCESS:
    case TEST_SMTP_SUCCESS: {
      return {
        ...state,
        loaded: action.type === GET_SMTP_SUCCESS,
        loading: false,
        updated: action.type === UPDATE_EMAIL_SUCCESS,
        updating: false,
        tested: action.type === TEST_SMTP_SUCCESS,
        testing: false,
        ...action.result

      };
    }
    case GET_COMPLIANCE_FAIL:
    case GET_SMTP_FAIL:
    case UPDATE_EMAIL_FAIL:
    case TEST_SMTP_FAIL:
      return {
        ...state,
        complianceLoaded: false,
        complianceLoading: false,
        loaded: false,
        loading: false,
        updated: false,
        updating: false,
        tested: false,
        testing: false,
        error: action.error,
      };

    case GET_COMPLIANCE_SUCCESS: {
      return {
        ...state,
        complianceLoaded: action.type === GET_COMPLIANCE_SUCCESS,
        complianceLoading: false,
        compliance: { ...action.result }
      };
    }

    case GET_EMAIL_NOTIFICATION_LOGO: {
      return {
        ...state,
        notificationLogoLoaded: false,
        notificationLogoLoading: true,
      };
    }

    case GET_EMAIL_NOTIFICATION_LOGO_SUCCESS: {
      return {
        ...state,
        notificationLogoLoaded: true,
        notificationLogoLoading: false,
        notificationLogo: action.result.notification_logo,
        compliance: { ...state.compliance, senderName: action.result.notification_from_name }
      };
    }

    case GET_EMAIL_NOTIFICATION_LOGO_FAIL: {
      return {
        ...state,
        notificationLogoLoaded: false,
        notificationLogoLoading: false,
        error: action.error,
      };
    }

    case SET_EMAIL_NOTIFICATION_LOGO: {
      return {
        ...state,
        notificationLogoUploading: true,
      };
    }

    case SET_EMAIL_NOTIFICATION_LOGO_SUCCESS: {
      return {
        ...state,
        thumbnailBase64: action.params.logo,
        notificationLogoUploading: false,
      };
    }

    case SET_EMAIL_NOTIFICATION_LOGO_FAIL: {
      return {
        ...state,
        notificationLogoUploading: false,
        error: action.error,
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

    default:
      return state;
  }
}
/**
 * Action Creators
 */
export function getEmails(name) {
  const path = `/admin/emails/${name}/get`;
  const type = `admin/emails/GET_${name.toUpperCase()}`;

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function getEmailNotificationLogo() {
  return {
    types: [GET_EMAIL_NOTIFICATION_LOGO, GET_EMAIL_NOTIFICATION_LOGO_SUCCESS, GET_EMAIL_NOTIFICATION_LOGO_FAIL],
    promise: (client) => client.get('/company_emails/get_settings', 'webapi4')
  };
}

export function uploadEmailNotificationLogo(base64, senderName) {
  return {
    types: [SET_EMAIL_NOTIFICATION_LOGO, SET_EMAIL_NOTIFICATION_LOGO_SUCCESS, SET_EMAIL_NOTIFICATION_LOGO_FAIL],
    params: {
      logo: base64
    },
    promise: (client) => client.post('/company_emails/save_settings', 'webapi4', {
      data: {
        notification_from_name: senderName,
        notification_logo_base64: base64
      },
    })
  };
}

export function updateEmails(update, name) {
  const path = name ? `/admin/emails/${name}/set` : '/admin/emails/smtp/set';

  return {
    types: [UPDATE_EMAIL, UPDATE_EMAIL_SUCCESS, UPDATE_EMAIL_FAIL],
    ...update,
    promise: (client) => client.post(path, 'webapi', {
      params: update
    })
  };
}

export function testSMTP(address) {
  const path = '/admin/emails/smtp/test';

  return {
    types: [TEST_SMTP, TEST_SMTP_SUCCESS, TEST_SMTP_FAIL],
    promise: (client) => client.post(path, 'webapi', {
      data: {
        toAddress: address
      },
    })
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}
