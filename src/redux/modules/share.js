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

import union from 'lodash/union';

export const LOAD = 'share/LOAD';
export const LOAD_SUCCESS = 'share/LOAD_SUCCESS';
export const LOAD_FAIL = 'share/LOAD_FAIL';

export const SELECT_FILE = 'share/SELECT_FILE';
export const REMOVE_FILE = 'share/REMOVE_FILE';
export const SET_DATA = 'share/SET_DATA';
export const CLOSE = 'share/CLOSE';

export const SEND_SHARE = 'share/SEND_SHARE';
export const SEND_SHARE_SUCCESS = 'share/SEND_SHARE_SUCCESS';
export const SEND_SHARE_FAIL = 'share/SEND_SHARE_FAIL';

export const LOAD_CRM_ENTITY = 'share/CRM_ENTITY';
export const LOAD_CRM_ENTITY_SUCCESS = 'share/CRM_ENTITY_SUCCESS';
export const LOAD_CRM_ENTITY_FAIL = 'share/CRM_ENTITY_FAIL';

export const SEARCH_CRM_BY_ENTITIES = 'share/SEARCH_CRM_BY_ENTITIES';
export const SEARCH_CRM_BY_ENTITIES_SUCCESS = 'share/SEARCH_CRM_BY_ENTITIES_SUCCESS';
export const SEARCH_CRM_BY_ENTITIES_FAIL = 'share/SEARCH_CRM_BY_ENTITIES_FAIL';
export const ADD_CRM_FILTER = 'share/ADD_CRM_FILTER';

export const SEARCH_CONTACT = 'share/SEARCH_CONTACT';
export const SEARCH_CONTACT_SUCCESS = 'share/SEARCH_CONTACT_SUCCESS';
export const SEARCH_CONTACT_FAIL = 'share/SEARCH_CONTACT_FAIL';

export const ADD_CONTACT = 'share/ADD_CONTACT';
export const ADD_MULTIPLE_CONTACT = 'share/ADD_MULTIPLE_CONTACT';
export const REMOVE_CONTACT = 'share/REMOVE_CONTACT';

export const RESET = 'share/RESET';

export const initialState = {
  id: 0,
  files: [],
  url: '',
  toAddress: [],
  ccAddress: [],
  subject: '',
  message: '',
  sharingPublic: false,
  langCode: '',

  isVisible: false,
  isStoryPickerVisible: false,

  loaded: false,
  loading: false,
  loadError: {},

  saving: false,
  saved: false,
  saveError: {},
  preview: '',
  previewLoading: false,

  //Share
  sending: false,
  sent: false,
  sendError: {},

  crmEntities: [],
  loadedEntity: false,
  loadingEntity: false,
  loadEntityError: {},
  crmAccountType: {},

  crmByEntitiesLoading: false,
  crmByEntitiesLoaded: true,
  crmByEntitiesError: {},
  crmByEntities: [],
  crmAccountFilter: [],
  crmNextPage: '',
  crmNextPageLoading: false,

  contacts: [],
  contactsLoaded: false,
  contactsLoading: false,
  contactsError: false,
  ccContacts: [],
  ccContactsLoaded: false,
  ccContactsLoading: false,
};

export default function share(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return { ...state, loading: true };
    case LOAD_SUCCESS:
      return { ...state, loading: false, loaded: true, ...action.result };
    case LOAD_FAIL:
      return { ...state, loading: false, loaded: false, loadError: action.error };

    case SET_DATA:
      return {
        ...state,
        ...action.data
      };
    case SELECT_FILE: {
      // Toggle selected attribute on file
      const newFiles = [...state.files];
      const index = newFiles.findIndex(f => f.id === action.fileId);

      if (index > -1) {
        newFiles[index].isSelected = !newFiles[index].isSelected;
      }
      return {
        ...state,
        files: newFiles
      };
    }

    case REMOVE_FILE: {
      // Remove selected file
      let newFiles = [...state.files];
      if (!action.removeAll && action.fileId) {
        const file = newFiles.find(f => f.id === action.fileId);
        newFiles = newFiles.filter(f => f.id !== action.fileId && f.filename !== file.filename);
      } else {
        newFiles = newFiles.filter(f => (f.permId === action.storyId && f.shareStatus === 'mandatory'));
      }

      return {
        ...state,
        files: newFiles
      };
    }

    case SEND_SHARE: {
      return { ...state,
        sending: action.params.preview ? state.sending : true,
        sent: action.params.preview ? state.sent : false,
        previewLoading: !action.params.preview ? state.previewLoading : true,
        preview: action.params.preview ? '' : state.preview,
      };
    }
    case SEND_SHARE_SUCCESS:
      return { ...state,
        preview: action.params.preview ? action.result.preview : state.preview,
        previewLoading: !action.params.preview ? state.previewLoading : false,
        sending: action.params.preview ? state.sending : false,
        sent: action.params.preview ? state.sent : true,
        subject: action.params.preview ? state.subject : '',
        message: action.params.preview ? state.message : '',
        files: action.params.preview ? state.files : [],
        toAddress: action.params.preview ? state.toAddress : [],
        ccAddress: action.params.preview ? state.ccAddress : [],
        isVisible: action.params.preview ? state.isVisible : false,
      };
    case SEND_SHARE_FAIL:
      return {
        ...state,
        previewLoading: !action.params.preview ? state.previewLoading : false,
        sending: action.params.preview ? state.sending : false,
        sent: action.params.preview ? state.sent : false,
        sendError: action.error
      };

    case RESET:
      return { ...initialState,
        id: 0,
        files: [],
        url: '',
        crmAccountType: {},
        crmAccountFilter: [],
        toAddress: [],
        ccAddress: [],
        subject: '',
        message: '',
        sharingPublic: false,

        isVisible: false,
        isStoryPickerVisible: false,
      };

    case LOAD_CRM_ENTITY:
      return { ...state, loadingEntity: true };
    case LOAD_CRM_ENTITY_SUCCESS:
      return { ...state, loadingEntity: false, loadedEntity: true, crmEntities: action.result };
    case LOAD_CRM_ENTITY_FAIL:
      return { ...state, loadingEntity: false, loadedEntity: false, loadEntityError: action.error };

    case SEARCH_CRM_BY_ENTITIES:
      return {
        ...state,
        crmByEntitiesLoading: true,
        crmNextPageLoading: !!action.params.crmNextPage
      };
    case SEARCH_CRM_BY_ENTITIES_SUCCESS: {
      return {
        ...state,
        crmByEntitiesLoading: false,
        crmByEntitiesLoaded: true,
        crmByEntities: action.params.page ? union(state.crmByEntities, action.result.objects) : action.result.objects,
        crmNextPage: action.result.nextPage,
        crmNextPageLoading: false,
      };
    }
    case SEARCH_CRM_BY_ENTITIES_FAIL: {
      return {
        ...state,
        crmByEntitiesLoading: false,
        crmByEntitiesLoaded: false,
        crmByEntitiesError: action.error,
        crmNextPageLoading: false,
      };
    }

    case ADD_CRM_FILTER: {
      return {
        ...state,
        [action.attribute]: [...state[action.attribute], action.data]
      };
    }

    case SEARCH_CONTACT: {
      const contactData = {};
      switch (action.attribute) {
        case 'ccContacts':
          contactData.ccContactsLoading = true;
          break;
        default:
          contactData.contactsLoading = true;
          break;
      }
      return { ...state, ...contactData };
    }
    case SEARCH_CONTACT_SUCCESS: {
      const contactData = {};
      switch (action.attribute) {
        case 'ccContacts':
          contactData.ccContactsLoading = false;
          contactData.ccContactsLoaded = true;
          contactData.ccContacts = action.result;
          break;
        default:
          contactData.contactsLoading = false;
          contactData.contactsLoaded = true;
          contactData.contacts = action.result;
          break;
      }
      return { ...state, ...contactData };
    }
    case SEARCH_CONTACT_FAIL: {
      const contactData = {};
      switch (action.attribute) {
        case 'ccContacts':
          contactData.ccContactsLoading = false;
          contactData.ccContactsLoaded = false;
          break;
        default:
          contactData.contactsLoading = false;
          contactData.contactsLoaded = false;
          break;
      }
      return { ...state, ...contactData, contactsError: action.error };
    }
    case ADD_CONTACT: {
      return {
        ...state,
        [action.attribute]: [...state[action.attribute], action.data]
      };
    }
    case ADD_MULTIPLE_CONTACT: {
      return {
        ...state,
        [action.attribute]: [...state[action.attribute], ...action.data]
      };
    }
    case REMOVE_CONTACT:
      return {
        ...state,
        [action.attribute]: state[action.attribute].slice(0, state[action.attribute].length - 1)
      };

    case CLOSE:
      return { ...initialState };

    default:
      return state;
  }
}

export function loadStory(permId) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/story/get?permId=' + permId, 'webapi')
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    data
  };
}
export function selectFile(fileId) {
  return {
    type: SELECT_FILE,
    fileId: fileId
  };
}
export function removeFile(fileId, removeAll = false, storyId = 0) {
  return {
    type: REMOVE_FILE,
    fileId: fileId,
    removeAll: removeAll,
    storyId: storyId
  };
}

export function sendShare(data, preview = 0) {
  // Attach Story ID
  const shareData = {};
  const toEmailList = [];
  const ccEmailList = [];
  const groupIds = [];
  const crmAccountIds = [];
  const crmEmails = [];
  const crmTasks = {};

  const setType = function (id, email, type, attribute) {
    switch (type) {
      case 'group':
        groupIds.push(id);
        break;
      case 'crm_account':
        crmAccountIds.push(id);
        break;
      case 'crm_contact':
        crmEmails.push({ id: id, email: email });
        break;
      case 'user':
      default:
        if (attribute === 'toEmail') {
          toEmailList.push(email || id);
        } else {
          ccEmailList.push(email || id);
        }
        break;
    }
  };

  if (preview) shareData.preview = preview;
  if (data.id) shareData.id = data.id;
  if (data.langCode) shareData.langCode = data.langCode;
  if (data.toAddress && data.toAddress.length) {
    data.toAddress.forEach(({ id, email, type }) => {
      setType(id, email, type, 'toEmail');
    });
  }

  if (data.ccAddress && data.ccAddress.length) {
    data.ccAddress.forEach(({ id, email, type }) => {
      setType(id, email, type, 'ccEmail');
    });
  }

  if (toEmailList.length) shareData.emails = JSON.stringify(toEmailList);
  if (ccEmailList.length) shareData.ccemails = JSON.stringify(ccEmailList);
  if (groupIds.length) shareData.groupIds = JSON.stringify(groupIds);

  if (data.subject) shareData.subject = data.subject;
  if (data.message) shareData.note = data.message;
  if (data.files) {
    //shareData.files = data.files.filter(file => file.selected || file.shareStatus === 'mandatory');
    shareData.files = data.files;
    shareData.files = JSON.stringify(shareData.files.map(obj => obj.id));
  }

  // CRM Enabled and Autheticated
  shareData.crmSource = data.source;
  if (data.authenticated && data.hasCrmIntegration) {
    if (data.logToCrm && data.crmAccountFilter && data.crmAccountFilter.length) {
      crmTasks.relatedToId = data.crmAccountFilter[0].id;
      crmTasks.relatedToName = data.crmAccountFilter[0].name;
      crmTasks.type = data.crmAccountType.type;

      switch (data.crmAccountType.type) {
        case 'lead':
          crmTasks.stage = data.crmAccountFilter[0].stage;
          break;
        case ('opportunity'):
          crmTasks.stage = data.crmAccountFilter[0].stage;
          crmTasks.amount = data.crmAccountFilter[0].amount;
          break;
        default:
          break;
      }
    }

    if (crmTasks.relatedToId) shareData.crmTask = JSON.stringify(crmTasks);
    if (crmAccountIds.length) shareData.crmAccountIds = JSON.stringify(crmAccountIds);
    if (crmEmails.length) shareData.crmContacts = JSON.stringify(crmEmails);
    shareData.logToCrm = +data.logToCrm;
  }
  return {
    params: shareData,
    types: [SEND_SHARE, SEND_SHARE_SUCCESS, SEND_SHARE_FAIL],
    promise: (client) => client.post('/story/serverShare', 'webapi', {
      data: shareData
    }),
  };
}
export function reset() {
  return {
    type: RESET
  };
}
export function close() {
  return {
    type: CLOSE
  };
}

export function searchCrmByEntities(source, type, search, limit, crmNextPage) {
  // Normalized data
  const data = {
    source: source,
    type: type,
    limit: limit || 10,
    search: search,
  };

  if (crmNextPage) data.page = crmNextPage;

  return {
    params: data,
    types: [SEARCH_CRM_BY_ENTITIES, SEARCH_CRM_BY_ENTITIES_SUCCESS, SEARCH_CRM_BY_ENTITIES_FAIL],
    promise: (client) => client.get('/crm/search', 'webapi', {
      params: data
    }),
  };
}

export function addCrmFilter(data, attribute) {
  return {
    type: ADD_CRM_FILTER,
    data,
    attribute: attribute,
  };
}

export function searchContacts(source, limit, crm_limit, search, sortBy, crm, crmFilterId, attribute = 'contacts') {
  // Normalized data
  const data = {
    limit, //hub contacts limit
    crm_limit, //crm contacts limit
    search: search,
    sortBy: sortBy,
  };

  data.crm = crm ? 1 : 0;
  if (source) data.source = source;
  if (crmFilterId) data.crmFilterId = crmFilterId;

  return {
    attribute: attribute,
    types: [SEARCH_CONTACT, SEARCH_CONTACT_SUCCESS, SEARCH_CONTACT_FAIL],
    promise: (client) => client.get('/crm/contacts', 'webapi', {
      params: data
    }),
  };
}

export function addContact(data, attribute) {
  return {
    type: ADD_CONTACT,
    data,
    attribute: attribute,
  };
}
export function addMultipleContact(data, attribute) {
  return {
    type: ADD_MULTIPLE_CONTACT,
    data,
    attribute: attribute,
  };
}

export function removeContact(attribute) {
  return {
    type: REMOVE_CONTACT,
    attribute: attribute,
  };
}
