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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _get from 'lodash/get';
import _differenceWith from 'lodash/differenceWith';
import _omit from 'lodash/omit';

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  getOAuthClientsList,
  getOAuthClient,
  createOAuthClient,
  editOAuthClient,
  deleteOAuthClient,
  getOAuthScopes,
  setData,
} from 'redux/modules/admin/oAuth';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import AdminCustomApps from 'components/Admin/AdminCustomApps/AdminCustomApps';
import CreateModal from 'components/Admin/AdminCustomApps/CreateModal';
import SearchUserModal from 'components/Admin/SearchUserModal';
import DeleteModal from 'components/Admin/AdminCustomApps/DeleteModal';

const LIST = 'list';
const EDIT = 'edit';

const messages = defineMessages({
  cancel: {
    id: 'cancel', defaultMessage: 'Cancel'
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  },
  applicationName: {
    id: 'application-name',
    defaultMessage: 'Application Name',
  },
  OAuth2Credentials: {
    id: 'OAuth-2.0-Credentials',
    defaultMessage: 'OAuth 2.0 credentials',
  },
  clientID: {
    id: 'client-ID',
    defaultMessage: 'Client ID',
  },
  clientSecret: {
    id: 'client-secret',
    defaultMessage: 'Client Secret',
  },
  OAuth2RedirectURI: {
    id: 'OAuth-2.0-RedirectURI',
    defaultMessage: 'OAuth 2.0 redirect URI',
  },
  OAuth2RedirectURIDesc: {
    id: 'OAuth-2.0-Redirect-URI-Desc',
    defaultMessage: 'The redirect URI is the URL in your application that will receive OAuth 2.0 callbacks.',
  },
  applicationScopes: {
    id: 'application-scopes',
    defaultMessage: 'Application Scopes',
  },
  applicationScopesDesc: {
    id: 'application-scopes-desc',
    defaultMessage: 'Select the scopes shown on the OAuth consent screen when users authorize your app.',
  },
  createEditUsers: {
    id: 'create-edit-users',
    defaultMessage: 'Create/edit users',
  },
  createEditUserGroups: {
    id: 'create-edit-user-groups',
    defaultMessage: 'Create/edit user groups',
  },
  modifyChannels: {
    id: 'modify-channels',
    defaultMessage: 'Modify {channels}'
  },
  modifyStories: {
    id: 'modify-stories',
    defaultMessage: 'Modify {stories}'
  },
  modifyContentStructure: {
    id: 'modify-content-structure',
    defaultMessage: 'Modify content structure'
  },
  readChannelData: {
    id: 'read-channel-data',
    defaultMessage: 'Read {channel} data'
  },
  readFormData: {
    id: 'read-form-data',
    defaultMessage: 'Read form data'
  },
  readStoryData: {
    id: 'read-story-data',
    defaultMessage: 'Read {story} data'
  },
  readUserData: {
    id: 'read-user-data',
    defaultMessage: 'Read user data'
  },
  readUserGroupData: {
    id: 'read-user-group-data',
    defaultMessage: 'Read user group data'
  },
  readUserSettings: {
    id: 'read-user-settings',
    defaultMessage: 'Read user settings'
  },
  trackStoryAndFileInteractions: {
    id: 'track-story-and-file-interactions',
    defaultMessage: 'Track {story} and file interactions'
  },
  connectAs: {
    id: 'connect-as',
    defaultMessage: 'Connect As'
  },
  connectAsDesc: {
    id: 'connect-as-desc',
    defaultMessage: 'OAuth 2.0 with API key authentication restricts access to groups and content based on the selected user.'
  },
  changeUser: {
    id: 'change-user',
    defaultMessage: 'Change User'
  },
  performActionsDesc: {
    id: 'perform-actions-desc',
    defaultMessage: 'Selecting this option will allow the Application to perform actions as any user, including Administrators.'
  },
  performActionsOnUsers: {
    id: 'perform-actions-on-users',
    defaultMessage: 'Perform actions on behalf of users.'
  },
  noApplications: {
    id: 'no-applications',
    defaultMessage: 'No Applications'
  },
  noApplicationsInfo: {
    id: 'no-applications-info',
    defaultMessage: 'You don’t have any applications. Click to add an app.'
  },
  addApplication: {
    id: 'add-application',
    defaultMessage: 'Add Application'
  },
  application: {
    id: 'application',
    defaultMessage: 'Application'
  },
  authType: {
    id: 'auth-type',
    defaultMessage: 'Auth type'
  },
  edit: {
    id: 'edit',
    defaultMessage: 'Edit'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  },
  chooseAuthMethod: {
    id: 'choose-auth-method',
    defaultMessage: 'Choose Auth Method'
  },
  standardOAuth: {
    id: 'standard-OAuth',
    defaultMessage: 'Standard OAuth 2.0 (User Authentication)'
  },
  apiOAuth: {
    id: 'apiOAuth',
    defaultMessage: 'OAuth 2.0 with API key (Server Authentication)'
  },
  standardOAuthDesc: {
    id: 'standard-OAuth-desc',
    defaultMessage: 'Require Bigtincan Hub users to log in to authorize your app.'
  },
  apiOAuthDesc: {
    id: 'api-OAuth-desc',
    defaultMessage: 'Allows your app to authenticate with Bigtincan Hub using an API key instead of user credentials.'
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete'
  },
  userAuthentication: {
    id: 'user-authentication',
    defaultMessage: 'User Authentication'
  },
  serverAuthentication: {
    id: 'server-authentication',
    defaultMessage: 'Server Authentication'
  },
  scopesErrorMsg: {
    id: 'scopes-error-msg',
    defaultMessage: 'scopes cannot be empty'
  },
  nameErrorMsg: {
    id: 'name-error-msg',
    defaultMessage: 'application name cannot be empty'
  },
  apiKey: {
    id: 'api-key',
    defaultMessage: 'API Key'
  },
  apiKeyDesc: {
    id: 'api-key-desc',
    defaultMessage: 'This API key can be used in combination with your OAuth 2.0 client credentials to authenticate with Bigtincan Hub.'
  },
  appCreateSuccessfully: {
    id: 'app-create-successfully',
    defaultMessage: 'Custom App created successfully'
  },
  appSaveSuccessfully: {
    id: 'app-save-successfully',
    defaultMessage: 'Custom App saved successfully'
  },
  appDeleteSuccessfully: {
    id: 'app-delete-successfully',
    defaultMessage: 'Custom App deleted successfully'
  },
  confirmDelete: { id: 'confirm-delete', defaultMessage: 'Confirm Delete' },
  confirmDeleteUserMessage: { id: 'confirm-delete-app-message', defaultMessage: 'Are you sure you want to delete this App from the System?' },
  generateClientId: {
    id: 'generate-client-id',
    defaultMessage: 'Save To Generate Client ID',
  },
  generateClientSecret: {
    id: 'generate-client-secret',
    defaultMessage: 'Save To Generate Client Secret',
  },
  generateAPIkey: {
    id: 'generate-API-key',
    defaultMessage: 'Save To Generate API key',
  },
  back: {
    id: 'back',
    defaultMessage: 'Back',
  },
  done: {
    id: 'done',
    defaultMessage: 'Done',
  },
  copyErrorMsg: {
    id: 'copy-error-msg',
    defaultMessage: 'Failed to copy to clipboard',
  },
  copySuccessMsg: {
    id: 'copy-success-msg',
    defaultMessage: 'Copied {authMethod} to clipboard',
  },
  deletePermanentInfo: {
    id: 'delete-permanent-info',
    defaultMessage: 'Deleting "{appName}" is a permanent action that cannot be undone.',
  },
  allUsersLoggedOut: {
    id: 'all-users-logged-out',
    defaultMessage: 'All existing users will be logged out.',
  },
  allTokenDestroyed: {
    id: 'all-token-destroyed',
    defaultMessage: 'All access tokens will be revoked and destroyed.',
  },
  confirmDeleteInfo: {
    id: 'confirm-delete-info',
    defaultMessage: 'Are you sure you want to delete this application?',
  },
  enterNameLabel: {
    id: 'enter-name-label',
    defaultMessage: 'Enter Application name to confirm delete.',
  },
  deleteApplication: {
    id: 'delete-application',
    defaultMessage: 'Delete {appName}',
  },
});

@connect(state => ({
  clients: _get(state.admin.oAuth, 'clients', []).map(item => ({
    ...item,
    id: item.clientId
  })),
  apiKeyScopes: state.admin.oAuth.api_key,
  authorizationScopes: state.admin.oAuth.authorization,
  putted: state.admin.oAuth.putted,
  deleted: state.admin.oAuth.deleted,
  error: state.admin.oAuth.error,
  loading: state.admin.oAuth.getListLoading,
}), bindActionCreatorsSafe({
  getOAuthClientsList,
  getOAuthClient,
  createOAuthClient,
  editOAuthClient,
  deleteOAuthClient,
  getOAuthScopes,
  setData,
  createPrompt
}))
export default class AdminCustomAppsView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.init = {
      isCreateVisible: false,
      isSearchUserVisible: false,
      selectedUser: null,
      selectId: null,
      view: LIST
    };

    this.state = { ...this.init };

    this.offset = -1;

    this.naming = null;
    autobind(this);
  }

  componentWillMount() {
    if (this.props.getOAuthScopes) {
      this.props.getOAuthScopes('authorization');
      this.props.getOAuthScopes('api_key');
    }

    this.naming = {
      ...this.context.settings.naming,
      authMethod: '',
      appName: ''
    };
  }

  componentDidUpdate(prevProps) {
    if ((this.props.clients.length > prevProps.clients.length) && (this.state.isCreateVisible)) {
      const different = _differenceWith(this.props.clients, prevProps.clients, (o1, o2) => o1.id === o2.id);
      this.handleSelectId(different[0].id);
      //success message
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, this.naming);

      this.props.createPrompt({
        id: 'client-create-success',
        type: 'info',
        message: strings.appCreateSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
    }

    if (this.props.putted && !prevProps.putted && (this.state.view === EDIT)) {
      //success message
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, this.naming);

      this.props.createPrompt({
        id: 'client-save-success',
        type: 'info',
        message: strings.appSaveSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
    }

    if (this.props.deleted && !prevProps.deleted && (this.state.view === LIST)) {
      //success message
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, this.naming);

      this.props.createPrompt({
        id: 'client-delete-success',
        type: 'info',
        message: strings.appDeleteSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
    }

    if (!_get(prevProps, 'error', false) && _get(this.props, 'error', false) && _get(this.props, 'error.errors.0', false)) {
      this.props.createPrompt({
        id: 'general-error',
        type: 'error',
        title: 'Error',
        message: this.props.error.errors[0].message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleSelectId(selectId) {
    const client = this.props.clients.find(item => item.id === selectId);
    this.setState({
      view: this.state.isCreateVisible ? LIST : EDIT,
      selectId,
      selectedUser: _get(client, 'user', null),
    });
  }

  handleToggleCreate() {
    this.setState({
      ...this.init,
      isCreateVisible: !this.state.isCreateVisible,
    });
  }

  handleAuthClick(e) {
    const { dataset } = e.currentTarget;
    this.setState({
      selectedUser: dataset.type === 'api_key' ? this.context.settings.user : null,
    });
  }

  handleToggleView() {
    this.setState({
      ...this.init,
      view: this.state.view === EDIT ? LIST : EDIT,
    });
  }

  handleSelectUser(selectedUser) {
    this.setState({
      selectedUser,
    });
    this.handleToggleUser();
  }

  handleToggleUser() {
    const { isSearchUserVisible } = this.state;
    this.setState({
      isSearchUserVisible: !isSearchUserVisible,
    });
  }

  handleRemoveApp(e) {
    const { dataset } = e.currentTarget;
    this.setState({
      selectId: dataset.id
    });
  }

  handleCancelAppDelete() {
    this.setState({
      selectId: null
    });
  }

  handleAppDelete() {
    if (this.props.deleteOAuthClient) {
      this.props.deleteOAuthClient(this.state.selectId);
    }
    this.handleCancelAppDelete();
  }

  handleEditApp(e) {
    const { dataset } = e.currentTarget;
    this.handleSelectId(dataset.id);
  }

  handleAppSave(update) {
    const app = _omit(update, 'user');
    if (!this.state.selectId && this.props.createOAuthClient) {
      if (this.state.selectedUser === null) {
        this.props.createOAuthClient({
          ...app,
          authMethod: 'authorization',
        });
      } else  {
        this.props.createOAuthClient({
          ...app,
          authMethod: 'api_key',
          userId: _get(this.state.selectedUser, 'id', this.context.settings.user.id)
        });
      }
    } else if (this.state.selectId && this.props.editOAuthClient) {
      if (this.state.selectedUser === null) {
        this.props.editOAuthClient({
          ...app,
          id: this.state.selectId,
          authMethod: 'authorization',
        });
      } else  {
        this.props.editOAuthClient({
          ...app,
          id: this.state.selectId,
          authMethod: 'api_key',
          userId: _get(this.state.selectedUser, 'id', this.context.settings.user.id)
        });
      }
    }
  }

  handleListLoad() {
    if (this.offset !== this.props.clients.length) {
      this.offset = this.props.clients.length;
      if (this.props.getOAuthClientsList) {
        this.props.getOAuthClientsList(this.offset);
      }
    }
  }

  handleCopyError() {
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, this.naming);

    this.props.createPrompt({
      id: 'copy-error',
      type: 'error',
      message: strings.copyErrorMsg,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleCopySuccess(authMethod) {
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, {
      ...this.naming,
      authMethod,
    });

    this.props.createPrompt({
      id: 'copy-success',
      type: 'info',
      message: strings.copySuccessMsg,
      dismissible: true,
      autoDismiss: 5
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      loading,
      clients,
      authorizationScopes,
      apiKeyScopes,
      error,

      getListLoaded,
      getListLoading,
      getListComplete,
    } = this.props;

    const { isCreateVisible, view, selectedUser, isSearchUserVisible, selectId } = this.state;

    const strings = generateStrings(messages, formatMessage, {
      ...this.naming,
      appName: (selectId !== null && view === LIST && !isCreateVisible ? this.props.clients.find(item => item.id === selectId).name : ''),
    });

    return (
      <Fragment>
        {loading && <Loader type="page" />}
        {!loading && <Fragment>
          <AdminCustomApps
            strings={strings}
            user={selectedUser}
            view={view}
            scopes={selectedUser === null ? authorizationScopes : apiKeyScopes}
            client={selectId && clients.find(item => item.id === selectId)}
            list={clients}
            onCreate={this.handleToggleCreate}
            onEditCancel={this.handleToggleView}
            onChangeUser={this.handleToggleUser}
            onRemove={this.handleRemoveApp}
            onSave={this.handleAppSave}
            onEdit={this.handleEditApp}
            onGetList={this.handleListLoad}
            onCopyError={this.handleCopyError}
            onCopySuccess={this.handleCopySuccess}
            isLoaded={getListLoaded}
            isLoading={getListLoading}
            isLoadingMore={!getListComplete}
            isComplete={getListComplete}
            error={error}
          />
          <div hidden={isSearchUserVisible}>
            <CreateModal
              strings={strings}
              bodyStyle={{ height: 'auto' }}
              isVisible={isCreateVisible}
              onClose={this.handleToggleCreate}
              onClick={this.handleAuthClick}
              client={selectId && clients.find(item => item.id === selectId)}
              user={selectedUser}
              error={error}
              onCopyError={this.handleCopyError}
              onCopySuccess={this.handleCopySuccess}
              scopes={selectedUser === null ? authorizationScopes : apiKeyScopes}
              onSave={this.handleAppSave}
              onChangeUser={this.handleToggleUser}
            />
          </div>
          <SearchUserModal
            isVisible={isSearchUserVisible}
            onSelectUser={this.handleSelectUser}
            onClose={this.handleToggleUser}
          />
          {selectId !== null && view === LIST && !isCreateVisible && <DeleteModal
            isVisible
            strings={strings}
            cancelText={strings.cancel}
            confirmText={strings.delete}
            name={this.props.clients.find(item => item.id === selectId).name}
            onCancel={this.handleCancelAppDelete}
            onConfirm={this.handleAppDelete}
          />}
        </Fragment>}
      </Fragment>
    );
  }
}
