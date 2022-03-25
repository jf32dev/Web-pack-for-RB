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
export const GET_OPPORTUNITY_STAGES = 'admin/crmIntegration/GET_OPPORTUNITY_STAGES';
export const GET_OPPORTUNITY_STAGES_SUCCESS = 'admin/crmIntegration/GET_OPPORTUNITY_STAGES_SUCCESS';
export const GET_OPPORTUNITY_STAGES_FAIL = 'admin/crmIntegration/GET_OPPORTUNITY_STAGES_FAIL';

export const GET_CRM_LIST = 'admin/crmIntegration/ET_CRM_LIST';
export const GET_CRM_LIST_SUCCESS = 'admin/crmIntegration/GET_CRM_LIST_SUCCESS';
export const GET_CRM_LIST_FAIL = 'admin/crmIntegration/GET_CRM_LIST_FAIL';

export const GET_CRM_SETTING = 'admin/crmIntegration/GET_CRM_SETTING';
export const GET_CRM_SETTING_SUCCESS = 'admin/crmIntegration/GET_CRM_SETTING_SUCCESS';
export const GET_CRM_SETTING_FAIL = 'admin/crmIntegration/GET_CRM_SETTING_FAIL';

export const SET_CRM_SETTING = 'admin/crmIntegration/SET_CRM_SETTING';
export const SET_CRM_SETTING_SUCCESS = 'admin/crmIntegration/SET_CRM_SETTING_SUCCESS';
export const SET_CRM_SETTING_FAIL = 'admin/crmIntegration/SET_CRM_SETTING_FAIL';

export const SET_CRM_ACCOUNT = 'admin/crmIntegration/SET_CRM_ACCOUNT';
export const SET_CRM_ACCOUNT_SUCCESS = 'admin/crmIntegration/SET_CRM_ACCOUNT_SUCCESS';
export const SET_CRM_ACCOUNT_FAIL = 'admin/crmIntegration/SET_CRM_ACCOUNT_FAIL';

export const REVOKE_AUTHENTICATION = 'admin/crmIntegration/REVOKE_AUTHENTICATION';
export const REVOKE_AUTHENTICATION_SUCCESS = 'admin/crmIntegration/REVOKE_AUTHENTICATION_SUCCESS';
export const REVOKE_AUTHENTICATION_FAIL = 'admin/crmIntegration/REVOKE_AUTHENTICATION_FAIL';

export const CLOSE = 'admin/email/CLOSE';
export const SET_DATA = 'admin/email/SET_DATA';

/**
 * Initial State
 */
export const initialState = {
  crmList: [],
  stages: [],
  crmListLoaded: false,
  crmListLoading: false,
  crmSettingLoaded: false,
  crmSettingLoading: false,
  opportunityStageLoaded: false,
  opportunityStageLoading: false,
  setCrmSettingLoaded: false,
  setCrmSettingLoading: false,
  error: null,
};

/**
 * Reducer
 */
export default function adminCRMIntegration(state = initialState, action = {}) {
  switch (action.type) {
    case GET_OPPORTUNITY_STAGES:
    case GET_OPPORTUNITY_STAGES_SUCCESS:
      return {
        ...state,
        opportunityStageLoaded: action.type === GET_OPPORTUNITY_STAGES_SUCCESS,
        opportunityStageLoading: action.type === GET_OPPORTUNITY_STAGES,
        ...action.result,
        error: null,
      };
    case GET_CRM_LIST:
    case GET_CRM_LIST_SUCCESS:
      return {
        ...state,
        crmListLoaded: action.type === GET_CRM_LIST_SUCCESS,
        crmListLoading: action.type === GET_CRM_LIST,
        crmList: action.result || [],
        error: null,
      };
    case GET_CRM_SETTING:
    case GET_CRM_SETTING_SUCCESS:
      return {
        ...state,
        crmSettingLoaded: action.type === GET_CRM_SETTING_SUCCESS,
        crmSettingLoading: action.type === GET_CRM_SETTING,
        ...action.result,
        error: null,
      };
    case SET_CRM_SETTING:
    case SET_CRM_SETTING_SUCCESS:
      return {
        ...state,
        setCrmSettingLoaded: action.type === SET_CRM_SETTING_SUCCESS,
        setCrmSettingLoading: action.type === SET_CRM_SETTING,
        ...action.result,
        error: null,
      };
    case SET_CRM_ACCOUNT:
    case SET_CRM_ACCOUNT_SUCCESS:
      return {
        ...state,
        setCrmAccountLoaded: action.type === SET_CRM_ACCOUNT_SUCCESS,
        setCrmAccountLoading: action.type === SET_CRM_ACCOUNT,
        error: null,
      };
    case REVOKE_AUTHENTICATION:
    case REVOKE_AUTHENTICATION_SUCCESS:
      return {
        ...state,
        revokeAuthenticationLoaded: action.type === REVOKE_AUTHENTICATION_SUCCESS,
        revokeAuthenticationLoading: action.type === REVOKE_AUTHENTICATION,
        stages: [],
        error: null,
      };
    case GET_OPPORTUNITY_STAGES_FAIL:
    case GET_CRM_LIST_FAIL:
    case GET_CRM_SETTING_FAIL:
    case SET_CRM_SETTING_FAIL:
    case SET_CRM_ACCOUNT_FAIL:
      return {
        ...state,
        crmListLoaded: false,
        crmListLoading: false,
        crmSettingLoaded: false,
        crmSettingLoading: false,
        opportunityStageLoaded: false,
        opportunityStageLoading: false,
        error: action.error,
      };

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
//TODO update api to v5
/**
 * Action Creators
 */
export function getCrmList() {
  const types = [GET_CRM_LIST, GET_CRM_LIST_SUCCESS, GET_CRM_LIST_FAIL];
  return {
    types,
    promise: (client) => client.get('/crmSettings/getCrmList', 'webapi4')
  };
}

export function getCrmSetting(crmSource, crmDescription) {
  const types = [GET_CRM_SETTING, GET_CRM_SETTING_SUCCESS, GET_CRM_SETTING_FAIL];
  return {
    types,
    params: {
      crmSource,
      crmDescription,
    },
    promise: (client) => client.get('/crmSettings/get', 'webapi4', {
      params: {
        crm_source: crmSource,
        type: 'admin'
      } })
  };
}

export function getOpportunityStage(cloudAccountId) {
  const types = [GET_OPPORTUNITY_STAGES, GET_OPPORTUNITY_STAGES_SUCCESS, GET_OPPORTUNITY_STAGES_FAIL];
  return {
    types,
    promise: (client) => client.get('/crmSettings/getOpportunityStages', 'webapi4', {
      params: {
        cloud_account_id: cloudAccountId,
      } })
  };
}

function getFormData(update) {
  const formData = new FormData();
  for (const prop in update) {
    if (Object.prototype.hasOwnProperty.call(update, prop)) {
      if (Array.isArray(update[prop])) {
        formData.append(prop, JSON.stringify(update[prop]));
      } else {
        formData.append(prop, update[prop]);
      }
    }
  }

  return formData;
}

export function setCrmSetting(update) {
  const types = [SET_CRM_SETTING, SET_CRM_SETTING_SUCCESS, SET_CRM_SETTING_FAIL];

  return {
    types,
    promise: (client) => client.post('/crmSettings/save', 'webapi4', {
      data: update
    })
  };
}

export function setCrmAccount(update) {
  const types = [SET_CRM_ACCOUNT, SET_CRM_ACCOUNT_SUCCESS, SET_CRM_ACCOUNT_FAIL];

  return {
    types,
    promise: (client) => client.post('/crmSettings/saveCrmAccount', 'webapi4', {
      body: getFormData(update)
    })
  };
}

export function revokeAuthentication(update) {
  const types = [REVOKE_AUTHENTICATION, REVOKE_AUTHENTICATION_SUCCESS, REVOKE_AUTHENTICATION_FAIL];

  return {
    types,
    promise: (client) => client.post('/crmSettings/revokeAuthentication', 'webapi4', {
      body: getFormData(update)
    })
  };
}
