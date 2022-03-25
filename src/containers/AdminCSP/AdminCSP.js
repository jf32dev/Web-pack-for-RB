/* eslint-disable react/no-did-update-set-state */
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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  getList,
  put,
  post,
  deleteById,
  cspwhitelist,
  cspsettings,
} from 'redux/modules/admin/security';
import { createPrompt } from 'redux/modules/prompts';

import CSP from 'components/Admin/AdminCSP/AdminCSP';
import Loader from 'components/Loader/Loader';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';

const messages = defineMessages({
  contentSecurityPolicy: { id: 'content-security-policy', defaultMessage: 'Content Security Policy' },
  contentSecurityPolicyDesc: {
    id: 'content-security-policy-desc',
    defaultMessage: 'This Whitelist allows you to make certain URLs available in the Hub. Add the relevant URLs to this list and specify one or more options you would like to make available in the dropdown provided.'
  },
  url: {
    id: 'url',
    defaultMessage: 'URL',
  },
  options: {
    id: 'options',
    defaultMessage: 'Options',
  },
  allow: {
    id: 'allow',
    defaultMessage: 'Allow',
  },
  remove: {
    id: 'remove',
    defaultMessage: 'Remove',
  },
  addUrl: {
    id: 'addUrl',
    defaultMessage: 'Add URL',
  },
  scripts: {
    id: 'scripts',
    defaultMessage: 'Scripts',
  },
  apiCalls: {
    id: 'api-calls',
    defaultMessage: 'API calls',
  },
  stylesheets: {
    id: 'stylesheets',
    defaultMessage: 'Stylesheets',
  },
  images: {
    id: 'images',
    defaultMessage: 'Images',
  },
  media: {
    id: 'media',
    defaultMessage: 'Media',
  },
  fonts: {
    id: 'fonts',
    defaultMessage: 'Fonts',
  },
  forms: {
    id: 'forms',
    defaultMessage: 'Forms'
  },
  duplicateUrlMsg: {
    id: 'duplicateUrlMsg',
    defaultMessage: 'Sorry, that url already exists. Try another url.'
  },
  globalSettings: {
    id: 'global-settings',
    defaultMessage: 'Global Settings'
  },
  warning: {
    id: 'warning',
    defaultMessage: 'Warning'
  },
  warningDesc: {
    id: 'warning-desc',
    defaultMessage: 'Any rules and options you apply may impact existing custom applications and content. Please be aware of how changes to your Content Security Policy will affect your company.',
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  }
});

const convertList = (list) => {
  if (list.length > 0 && Object.prototype.hasOwnProperty.call(list[0], 'name')) {
    return list.map(item => ({
      id: item.id,
      url: 'https://' + item.name,
      allowConnect: item.options.apiCalls,
      allowImage: item.options.images,
      allowMedia: item.options.media,
      allowScripts: item.options.scripts,
      allowStyle: item.options.stylesheets,
      allowFonts: item.options.fonts,
    }));
  }

  if (list.length > 0 && Object.prototype.hasOwnProperty.call(list[0], 'url')) {
    return list.map(item => ({
      id: item.id,
      name: item.url.replace('https://', ''),
      options: {
        apiCalls: item.allowConnect,
        images: item.allowImage,
        media: item.allowMedia,
        scripts: item.allowScripts,
        stylesheets: item.allowStyle,
        fonts: item.allowFonts
      }
    }));
  }
  return list;
};

@connect(state => ({
  list: convertList(state.admin.security.cspwhitelist),
  cspSettings: {
    'sandbox: allow-modals': state.admin.security.cspsettings.allowModals,
    'sandbox: allow-popups': state.admin.security.cspsettings.allowPopups,
    'sandbox: allow-forms': state.admin.security.cspsettings.allowSandboxedForms,
    'script: unsafe-inline': state.admin.security.cspsettings.allowScriptUnsafeInline,
    'script: unsafe-eval': state.admin.security.cspsettings.allowScriptUnsafeEval,
  },
  error: state.admin.security.error,
  loading: state.admin.security.loading,
}), bindActionCreatorsSafe({
  getList: (name = cspwhitelist) => getList(name),
  getSetting: (name = cspsettings) => getList(name, 'cspSettingsLoad'),
  putSetting: (data) => put(cspsettings, '', {
    allowModals: data['sandbox: allow-modals'],
    allowPopups: data['sandbox: allow-popups'],
    allowSandboxedForms: data['sandbox: allow-forms'],
    allowScriptUnsafeEval: data['script: unsafe-eval'],
    allowScriptUnsafeInline: data['script: unsafe-inline'],
  }),
  put: (data) => {
    const { id } = data;
    const result = { ...data };
    delete result.id;
    return put(cspwhitelist, id, convertList([result])[0]);
  },
  deleteById: (id) => deleteById(cspwhitelist, id),
  post: (data) => {
    const result = { ...data };
    delete result.id;
    return post(cspwhitelist, convertList([result])[0]);
  },
  createPrompt
}))
export default class AdminCSP extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      cspSettings: {},
      list: [],
      isSettingsChanged: false,
      newWhiteList: [],
      updateChangesList: [],
      removeListId: []
    };
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getList) {
      this.props.getList().then(() => {
        this.setState({ list: this.props.list });
      });
    }

    if (this.props.getSetting) {
      this.props.getSetting().then(() => {
        this.setState({ cspSettings: this.props.cspSettings });
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'user-metadata-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleAdd() {
    // Setting unique placeholder id so when users update url/options, it will update the correct object.
    let max;
    let newId;
    if (this.state.list.length) {
      max = this.state.list.reduce((prev, current) => {
        return (+prev.id > +current.id) ? prev : current;
      });
      newId = max.id + 1;
    } else {
      newId = 1;
    }

    const newWhiteList = {
      id: newId,
      name: '',
      options: {
        apiCalls: false,
        images: false,
        media: false,
        scripts: false,
        fonts: false,
        stylesheets: false
      }
    };

    this.setState({
      list: [
        ...this.state.list,
        newWhiteList
      ],
      isSettingsChanged: false
    });
  }

  handleRemove(id) {
    const {
      list,
      newWhiteList
    } = this.state;

    // update existing and new link list display but not saving yet
    const updateList = list.filter(obj => obj.id !== +id);
    const updateNewList = newWhiteList.filter(obj => obj.id !== +id);

    // only add id to remove if it already exists in backend (saved)
    const existingListId = this.props.list.map(obj => obj.id);
    const removeList = [...new Set([...this.state.removeListId, +id])].filter(ids => existingListId.includes(ids));
    this.setState({
      list: [...updateList],
      newWhiteList: [...updateNewList],
      removeListId: [...removeList]
    }, () => this.handleSettingsChanged());
  }

  handleSaveChange() {
    const {
      updateChangesList,
      newWhiteList,
      removeListId,
      cspSettings,
      list
    } = this.state;

    // remove items
    if (removeListId.length) {
      removeListId.forEach(id => this.props.deleteById(id));
      this.setState({ removeListId: [] });
    }

    // Check if global settings were changed
    if (!_isEqual(this.props.cspSettings, cspSettings)) {
      this.props.putSetting({ ...cspSettings });
    }

    // Check if existing link and options were changed
    if (!_isEqual(this.props.list, list) && updateChangesList.length) {
      updateChangesList.forEach(obj => {
        this.props.put(obj, this.props.list);
      });

      this.setState({ updateChangesList: [] });
    }

    // Check if there's new url links to save
    if (!_isEqual(this.props.list, list) && newWhiteList.length) {
      newWhiteList.forEach(obj => {
        const objToSave = { ...obj };
        delete objToSave.id;
        this.props.post(objToSave);
      });
      this.setState({ newWhiteList: [] });
    }

    this.setState({ isSettingsChanged: false });
  }

  handleGlobalSettingsChange(result) {
    const settings = [
      'sandbox: allow-modals',
      'sandbox: allow-popups',
      'sandbox: allow-forms',
      'script: unsafe-inline',
      'script: unsafe-eval'
    ];

    const changedSetting = settings.find(setting => Object.prototype.hasOwnProperty.call(result, setting));

    if (changedSetting) {
      this.setState({
        cspSettings: {
          ...this.state.cspSettings,
          [changedSetting]: result[changedSetting]
        },
      }, () => {
        this.handleSettingsChanged();
      });
    }
  }

  handleWhiteListUrlChange(result) {
    const {
      list,
      updateChangesList,
      newWhiteList,
      removeListId
    } = this.state;

    // display error if there's duplicate url
    if (list.map(item => item.name).indexOf(result.name) > -1 && result.name.length) {
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage);
      this.props.createPrompt({
        id: 'security-csp-error',
        type: 'error',
        title: 'Error',
        message: strings.duplicateUrlMsg,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // spread oldState when setting new state to include previous changes made by user
    const oldState = list.find(item => +item.id === +result.id);
    const keys = Object.keys(result);
    let fullUpdate;

    if (keys[1] === 'name') { // update url string
      fullUpdate = {
        ...oldState,
        name: result.name,
      };
    } else { // update options
      fullUpdate = {
        ...oldState,
        options: {
          ...oldState.options,
          [keys[1]]: result[keys[1]]
        },
      };
    }

    const isExistingUrl = this.props.list.some(obj => obj.id === fullUpdate.id);

    // check if user has already made changes and if it's existing url link
    if (updateChangesList.length && isExistingUrl) {
      const indexOfItemToChange = updateChangesList.findIndex(e => e.id === fullUpdate.id);

      // check if url to update already exists in this.state.updateChangesList
      if (indexOfItemToChange > -1) {
        const toChangeList = [...updateChangesList];
        toChangeList[indexOfItemToChange] = fullUpdate;
        this.setState({ updateChangesList: toChangeList });
      } else {
        this.setState({ updateChangesList: [...updateChangesList, fullUpdate] });
      }
    } else if (isExistingUrl) { // if no changes yet and if it's updating existing url links
      this.setState({ updateChangesList: [fullUpdate] });
    }

    // Add new links to newWhiteList state
    if (!isExistingUrl && !newWhiteList.some(obj => obj.id === fullUpdate.id)) {
      this.setState({ newWhiteList: [...newWhiteList, fullUpdate] });
    } else if (newWhiteList.length) {
      const indexOfItemToChange = newWhiteList.findIndex(e => e.id === fullUpdate.id);
      if (indexOfItemToChange > -1) {
        const toChangeList = [...newWhiteList];
        toChangeList[indexOfItemToChange] = fullUpdate;
        this.setState({ newWhiteList: toChangeList });
      }
    }

    // if new link id is already in removeListId and updateChangesList, remove id from removeListId (e.g. user deleted id 52 and added 52 again)
    if (removeListId.find(removeId => +removeId === +fullUpdate.id)) {
      const newRemoveList = removeListId.filter(id => +id !== +fullUpdate.id);
      this.setState({ removeListId: [...newRemoveList] });
    }

    // update list to display newest changes
    const newList = [...list];
    const index = list.findIndex(e => e.id === fullUpdate.id);
    newList[index] = fullUpdate;

    this.setState({ list: [...newList] }, () => {
      this.handleSettingsChanged();
    });
  }

  handleSettingsChanged() {
    const {
      list,
      cspSettings,
      removeListId
    } = this.state;

    // check if any url links are empty string
    const emptyName = list.some(e => e.name.length === 0);
    if (!emptyName && (!_isEqual(this.props.cspSettings, cspSettings) || !_isEqual(this.props.list, list) || removeListId.length)) {
      this.setState({ isSettingsChanged: true });
    } else {
      this.setState({ isSettingsChanged: false });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      loading,
    } = this.props;
    const {
      list,
      cspSettings,
      isSettingsChanged
    } = this.state;
    const strings = generateStrings(messages, formatMessage);

    return (
      <div>
        {loading && <Loader type="page" />}
        {!loading && <CSP
          strings={strings}
          list={list}
          settings={cspSettings}
          onAdd={this.handleAdd}
          onUpdate={this.handleUpdate}
          onRemove={this.handleRemove}
          isAddDisabled={list.some(obj => obj.name.length === 0)}
          onHandleSaveChange={this.handleSaveChange}
          onHandleGlobalSettingsChange={this.handleGlobalSettingsChange}
          isSettingsChanged={isSettingsChanged}
          onHandleWhiteListUrlChange={this.handleWhiteListUrlChange}
        />}
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={isSettingsChanged} />}
      </div>
    );
  }
}
