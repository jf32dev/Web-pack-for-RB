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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

/**
 * Action Types
 */
export const LOAD_EMAIL_TYPES = 'admin/emailTemplates/LOAD_EMAIL_TYPES';
export const LOAD_EMAIL_TYPES_SUCCESS = 'admin/emailTemplates/LOAD_EMAIL_TYPES_SUCCESS';
export const LOAD_EMAIL_TYPES_FAIL = 'admin/emailTemplates/LOAD_EMAIL_TYPES_FAIL';

export const GET_TEMPLATE = 'admin/emailTemplates/GET_TEMPLATE';
export const GET_TEMPLATE_SUCCESS = 'admin/emailTemplates/GET_TEMPLATE_SUCCESS';
export const GET_TEMPLATE_FAIL = 'admin/emailTemplates/GET_TEMPLATE_FAIL';

export const RESET_TEMPLATE = 'admin/emailTemplates/RESET_TEMPLATE';
export const RESET_TEMPLATE_SUCCESS = 'admin/emailTemplates/RESET_TEMPLATE_SUCCESS';
export const RESET_TEMPLATE_FAIL = 'admin/emailTemplates/RESET_TEMPLATE_FAIL';

export const SAVE_TEMPLATE = 'admin/emailTemplates/SAVE_TEMPLATE';
export const SAVE_TEMPLATE_SUCCESS = 'admin/emailTemplates/SAVE_TEMPLATE_SUCCESS';
export const SAVE_TEMPLATE_FAIL = 'admin/emailTemplates/SAVE_TEMPLATE_FAIL';

export const SAVE_SUBJECT = 'admin/emailTemplates/SAVE_SUBJECT';
export const SAVE_SUBJECT_SUCCESS = 'admin/emailTemplates/SAVE_SUBJECT_SUCCESS';
export const SAVE_SUBJECT_FAIL = 'admin/emailTemplates/SAVE_SUBJECT_FAIL';

export const SEND_TEST = 'admin/emailTemplates/SEND_TEST_SUBJECT';
export const SEND_TEST_SUCCESS = 'admin/emailTemplates/SEND_TEST_SUCCESS';
export const SEND_TEST_FAIL = 'admin/emailTemplates/SEND_TEST_FAIL';

export const SET_DATA = 'emailTemplates/SET_DATA';

/**
 * Initial State
 */
export const initialState = {
  categories: [],
  categoriesLoaded: false,
  categoriesLoading: false,

  categorySelected: '',
  subHeaderSelected: '',
  langCode: '',

  subject: '',
  inky: '',
  css: '',
  template: '',
  variables: [],

  testEmailSentStatus: false,

  defaultLayout: false,
  isSubjectChanged: false,
  isTemplateChanged: false,
  isSaving: false,
  loading: false,
  loaded: false,
  error: null,
};

/**
 * Reducer
 */
export default function adminEmailTemplates(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_EMAIL_TYPES:
      return {
        ...state,
        categoriesLoaded: false,
      };
    case LOAD_EMAIL_TYPES_SUCCESS: {
      return {
        ...state,
        categoriesLoaded: true,
        categoriesLoading: false,
        categories: action.result
      };
    }
    case LOAD_EMAIL_TYPES_FAIL:
      return {
        ...state,
        categoriesLoaded: false,
        categoriesLoading: false,
        error: action.error,
      };

    // TEMPLATE DATA
    case GET_TEMPLATE:
    case RESET_TEMPLATE:
      return {
        ...state,
        categorySelected: action.params.type,
        //langCode: action.params.lang,
        loaded: false,
        loading: true,
        error: null
      };
    case GET_TEMPLATE_SUCCESS:
    case RESET_TEMPLATE_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        error: null,

        defaultLayout: action.result.defaultLayout,
        subject: action.result.subject || '',
        css: action.result.css || '',
        inky: action.result.inky || '',
        template: action.result.body || '',
        variables: action.result.variables,
      };

    case GET_TEMPLATE_FAIL:
    case RESET_TEMPLATE_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error
      };


    // TEMPLATE DATA
    case SAVE_TEMPLATE:
      return {
        ...state,
        error: null,
        isSaving: true,
      };

    case SAVE_TEMPLATE_SUCCESS:
      return {
        ...state,
        isSaving: false,
        isTemplateChanged: false,
        defaultLayout: false,
        template: action.result.body || '',
      };

    case SAVE_TEMPLATE_FAIL:
      return {
        ...state,
        isSaving: false,
        isTemplateChanged: false,
        error: action.error
      };

    case SAVE_SUBJECT:
      return {
        ...state,
        error: null,
        isSaving: true,
      };

    case SAVE_SUBJECT_SUCCESS:
      return {
        ...state,
        isSaving: false,
        isSubjectChanged: false,
      };

    case SAVE_SUBJECT_FAIL:
      return {
        ...state,
        isSaving: false,
        isSubjectChanged: false,
        error: action.error
      };

    case SEND_TEST: {
      return {
        ...state,
        testEmailSentStatus: false,
      };
    }
    case SEND_TEST_SUCCESS: {
      return {
        ...state,
        testEmailSentStatus: true,
      };
    }
    case SEND_TEST_FAIL:
      return {
        ...state,
        error: action.error,
      };

    case SET_DATA: {
      return {
        ...state,
        ...action.params
      };
    }

    default:
      return state;
  }
}
/**
 * Action Creators
 */
export function loadCategories() {
  return {
    types: [LOAD_EMAIL_TYPES, LOAD_EMAIL_TYPES_SUCCESS, LOAD_EMAIL_TYPES_FAIL],
    promise: (client) => client.get('/admin/emails/template/getTypes', 'webapi')
  };
}

export function getEmailTemplate(type, lang) {
  return {
    types: [GET_TEMPLATE, GET_TEMPLATE_SUCCESS, GET_TEMPLATE_FAIL],
    params: { type: type, lang: lang },
    promise: (client) => client.get('/admin/emails/template/getData', 'webapi', {
      params: {
        type: type,
        lang_code: lang
      }
    })
  };
}

export function resetTemplate(type, lang) {
  return {
    types: [RESET_TEMPLATE, RESET_TEMPLATE_SUCCESS, RESET_TEMPLATE_FAIL],
    params: { type: type, lang: lang },
    promise: (client) => client.post('/admin/emails/template/reset', 'webapi', {
      data: {
        type: type,
        lang_code: lang
      }
    })
  };
}

export function saveTemplate(data) {
  const tempData = {};
  if (data.inky) tempData.inky = data.inky;
  if (data.css) tempData.css = data.css;

  return {
    types: [SAVE_TEMPLATE, SAVE_TEMPLATE_SUCCESS, SAVE_TEMPLATE_FAIL],
    params: {
      type: data.type,
      lang: data.langCode,
      inky: data.inky,
      css: data.css,
    },
    promise: (client) => client.post('/admin/emails/template/save', 'webapi', {
      data: {
        type: data.type,
        lang_code: data.langCode,
        ...tempData
      }
    })
  };
}

export function saveSubject(data) {
  return {
    types: [SAVE_SUBJECT, SAVE_SUBJECT_SUCCESS, SAVE_SUBJECT_FAIL],
    params: {
      type: data.type,
      lang: data.langCode,
      subject: data.subject
    },
    promise: (client) => client.post('/admin/emails/template/saveSubject', 'webapi', {
      data: {
        type: data.type,
        lang_code: data.langCode,
        subject: data.subject
      }
    })
  };
}

export function sendTestEmail(data) {
  return {
    types: [SEND_TEST, SEND_TEST_SUCCESS, SEND_TEST_FAIL],
    params: {
      type: data.type,
      lang: data.langCode,
      email: data.email
    },
    promise: (client) => client.post('/admin/emails/template/sendPreview', 'webapi', {
      data: {
        type: data.type,
        lang_code: data.langCode,
        email: data.email
      }
    })
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}
