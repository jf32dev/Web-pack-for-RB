/* eslint-disable no-underscore-dangle */
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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _get from 'lodash/get';
import _orderBy from 'lodash/orderBy';
import _uniqBy from 'lodash/uniqBy';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import getKloudlessConfig from 'helpers/getKloudlessConfig';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
//redux
import {
  crudFiles,
  setFiles,
  setData,
  SYNC_ENGINE,
  getMoreContent
} from 'redux/modules/admin/files';
import {
  loadAllGroups,
  globalFetchLimit as globalStructureFetchLimit
} from 'redux/modules/admin/structure';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import AdminSyncEngine from 'components/Admin/AdminFiles/AdminSyncEngine';
import SyncCreateModal from 'components/Admin/AdminFiles/SyncCreateModal';
import SyncEditModal from 'components/Admin/AdminFiles/SyncEditModal';
import Dialog from 'components/Dialog/Dialog';

const messages = defineMessages({
  connectCloudServiceFolder: {
    id: 'connect-cloud-service-folder',
    defaultMessage: 'Connect cloud service folder'
  },
  serviceName: {
    id: 'service-name',
    defaultMessage: 'Service Name',
  },
  serviceProvider: {
    id: 'service-provider',
    defaultMessage: 'Service Provider'
  },
  enabled: {
    id: 'enabled',
    defaultMessage: 'Enabled'
  },
  edit: {
    id: 'edit',
    defaultMessage: 'Edit'
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete'
  },
  folderConnection: {
    id: 'folder-connection',
    defaultMessage: 'Folder Connection'
  },
  adminFolderConnection: {
    id: 'admin-folder-connection',
    defaultMessage: 'Admin Folder Connection'
  },
  name: {
    id: 'name',
    defaultMessage: 'Name'
  },
  connection: {
    id: 'connection',
    defaultMessage: 'Connection'
  },
  connectEntireAccount: {
    id: 'connect-entire-account',
    defaultMessage: 'Connect the entire account'
  },
  modified: {
    id: 'modified',
    defaultMessage: 'Modified'
  },
  userGroups: {
    id: 'user-groups',
    defaultMessage: 'User Groups'
  },
  searchUserGroups: {
    id: 'search-user-groups',
    defaultMessage: 'Search User Groups'
  },
  selected: {
    id: 'selected',
    defaultMessage: 'Selected'
  },
  userSelectedInfo: {
    id: 'user-selected-info',
    defaultMessage: '{usersCount} User Group selected'
  },
  usersSelectedInfo: {
    id: 'users-selected-info',
    defaultMessage: '{usersCount} User Groups selected'
  },
  userImpersonation: {
    id: 'user-impersonation',
    defaultMessage: 'User impersonation'
  },
  userName: {
    id: 'user-name',
    defaultMessage: 'User name'
  },
  root: {
    id: 'root',
    defaultMessage: 'Root'
  },
  emptyServiceMessage: {
    id: 'empty-service-message',
    defaultMessage: 'No service available'
  },
  emptyFileMessage: {
    id: 'empty-file-message',
    defaultMessage: 'No file available'
  },
  emptyHeading: {
    id: 'empty-heading',
    defaultMessage: 'No result'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  confirm: {
    id: 'confirm',
    defaultMessage: 'Confirm'
  },
  back: {
    id: 'back',
    defaultMessage: 'Back'
  },
  syncEntireCloudAccount: {
    id: 'sync-the-entire-cloud-account',
    defaultMessage: 'Sync the entire Cloud account',
  },
  s3Desc: {
    id: 's3-desc',
    defaultMessage: 'Please note: Amazon S3 does not support maintaining sync when a file is renamed.'
  },
  azureDesc: {
    id: 'azure-desc',
    defaultMessage: 'This provider does not support file/folder syncing after the initial sync (download). Future changes in the repository will not be applied.'
  },
  sugarsyncDesc: {
    id: 'sugarsync-desc',
    defaultMessage: 'This provider does not support file/folder syncing after the initial sync (download). Future changes in the repository will not be applied.'
  },
  editCloudServiceSync: {
    id: 'edit-cloud-service-sync',
    defaultMessage: 'Edit cloud service sync'
  },
  deleteSyncMsg: {
    id: 'delete-sync-msg',
    defaultMessage: 'Are you sure you want to delete this service?'
  },
  warning: {
    id: 'warning',
    defaultMessage: 'Warning',
  },
  syncEngineCreatedSuccessfully: {
    id: 'sync-engine-created-successfully',
    defaultMessage: '{nickname} connected successfully'
  },
});

@connect(state => {
  const repositoryObject = _get(state, 'admin.files.service.repositoryList', {});
  const repositoryList = _orderBy(Object.keys(repositoryObject).map(key => repositoryObject[key]), ['sequence'], ['desc']);
  const allGroups = state.admin.structure.allGroups.map(id => (
    state.entities.groups[id]
  )).concat(_get(state, 'admin.files.service.repoGroups', []).map(item => ({
    ...item,
    id: +item.groupId,
    name: item.title,
    childCount: item.usersCount,
    type: 'group',
    childType: 'user',
    colour: item.colour || '#F26724',
    isSelected: true,
  })));

  return {
    ...state.admin.files,
    service: {
      ...state.admin.files.service,
      repositoryList,
    },
    users: _get(state, 'admin.files.team', []),
    syncEngine: state.admin.files.services,
    allGroups: _uniqBy(allGroups, 'id'),
    allGroupsLoading: state.admin.structure.allGroupsLoading,
    allGroupsComplete: state.admin.structure.allGroupsComplete,
    allGroupsError: state.admin.structure.allGroupsError,
    allGroupsOffset: state.admin.structure.allGroupsOffset,
  };
}, bindActionCreatorsSafe({
  crudFiles,
  setFiles,
  setData,
  loadAllGroups,
  createPrompt,
  getMoreContent
}))
export default class AdminSyncEngineView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

  static defaultProps = {
    syncEngine: [],
    service: {},
    contents: [],
  };

  constructor(props) {
    super(props);
    this.default = {
      currentService: {},
      syncRootPath: false,
      sortUsers: [],
    };
    this.state = {
      index: 1,
      isCreateVisible: false,
      isEditVisible: false,
      isDeleteVisible: false,
      newNextPage: false,
      ...this.default,
    };
    this.isAdded = false;
    this.search = '';

    this.timer = null;
    this.authenticatorScript = document.createElement('script');

    this.adminAccountsWithoutUserImpersonation = ['s3', 'sharepoint', 'egnyte'];
    autobind(this);
  }

  componentDidMount() {
    if (this.props.crudFiles) {
      this.props.crudFiles(`${SYNC_ENGINE}/services`, { admin: 1 }, 'get');
    }

    if (window.Kloudless === undefined && !document.getElementById('kloudless')) {
      const { source, id, async } = getKloudlessConfig();
      this.authenticatorScript.src = source;
      this.authenticatorScript.id = id;
      this.authenticatorScript.async = async;
      document.body.appendChild(this.authenticatorScript);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'Files-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    if (this.props.serviceLoading && !nextProps.serviceLoading) {
      this.setState({
        currentService: {
          groupIds: _get(nextProps, 'service.repoGroups', []).map(item => +item.groupId)
        },
        sortUsers: _get(nextProps, 'service.repoGroups', []).map(item => +item.groupId)
      });
    }

    if (this.props.nextPage !== nextProps.nextPage) {
      this.setState({ newNextPage: true });
    } else {
      this.setState({ newNextPage: false });
    }
  }

  initializeKloudless = (scope, isAdmin, callback) => {
    if (window.Kloudless !== undefined && document.getElementById('syncEngineAuthenticateBtn')) {
      const client_id = this.context.settings.crm.appId;
      const sandbox = this.context.settings.crm.sandbox;

      const options = {
        client_id,
        scope: isAdmin && `${scope}:admin` || scope,
        developer: sandbox === 1 || sandbox === true
      };

      // Launch the Authenticator when the button is clicked
      window.Kloudless.authenticator(document.getElementById('syncEngineAuthenticateBtn'), options, this.handleAuthenticateKloudless);
      const authenticatorId = window.Kloudless._authenticators_by_element[document.getElementById('syncEngineAuthenticateBtn').outerHTML];
      callback(authenticatorId);
    }
  }

  handleChange(update) {
    const { currentService } = this.state;
    if (!this.props.loading) {
      if (['create', 'edit', 'delete'].indexOf(update.action) > -1) {
        const action = update.action.charAt(0).toUpperCase() + update.action.slice(1);
        this.setState({
          ...this.default,
          currentService: {
            id: (update.action === 'edit' || update.action === 'delete') ? update.id : 0
          },
          index: 1,
          [`is${action}Visible`]: true,
        });
        if (['create', 'edit'].indexOf(update.action) > -1) {
          this.props.crudFiles(`${SYNC_ENGINE}/service`, { id: update.action === 'edit' ? update.id : 0 }, 'get', 'serviceLoad');
        }
        if (update.action === 'edit') {
          this.props.loadAllGroups(0, null, 1);
        }
      } else if (update.action === 'authenticate') {
        this.setState({
          currentService: {
            ...currentService,
            ...update,
          }
        });
        this.initializeKloudless(update.scope, update.isAdmin, authenticatorId =>  window.Kloudless._authenticators[authenticatorId].clickHandler());
      } else if (update.action === 'userSelected') {
        const currentCloud = this.props.service.repositoryList.find(item => item.nickname === currentService.scope) || {};
        this.setState({
          currentService: {
            ...currentService,
            ...update,
            paths: [{
              name: currentCloud.name,
              path: ''
            }],
            folderId: null,
          }
        });
        this.props.crudFiles(`${SYNC_ENGINE}/repository`, {
          accountId: currentService.id,
          asUser: _get(update, 'user.userId', null)
        }, 'get', 'repositoryLoad');
      } else if (update.action === 'content') {
        this.props.crudFiles(`${SYNC_ENGINE}/repository`, {
          accountId: currentService.id,
          asUser: _get(currentService, 'user.userId', null),
          folderId: update.id
        }, 'get', 'repositoryLoad');
        if (update.type !== 'syncing') {
          this.setState({
            currentService: {
              ...currentService,
              paths: currentService.paths.concat({
                name: update.name,
                path: update.id
              }),
              folderId: null,
            }
          });
        }
      } else if (update.action === 'path') {
        let index = currentService.paths.findIndex(item => item.path === update.path);

        if (update.path === undefined) {
          index = 0;
        }

        this.props.crudFiles(`${SYNC_ENGINE}/repository`, {
          accountId: currentService.id,
          asUser: _get(currentService, 'user.userId', null),
          folderId: update.path
        }, 'get', 'repositoryLoad');

        this.setState({
          currentService: {
            ...currentService,
            paths: currentService.paths.slice(0, index + 1),
            folderId: null,
          }
        });
      } else if (update.action === 'updateIndex') {
        if (update.index === 3 && this.props.loadAllGroups) {
          this.props.loadAllGroups(0, null, 1);
          this.setState({
            index: update.index,
          });
        } else if (update.index === 4) {
          this.setState({
            index: update.index,
          });
          const data = {
            accountId: currentService.id,
            repoDescription: currentService.repoDescription,
            enabled: true,
            groupIds: JSON.stringify(_get(currentService, 'groupIds', [])),
            nickname: currentService.scope,
            asUser: _get(currentService, 'user.userId', null),
            folderId: currentService.folderId,
          };
          this.props.crudFiles(`${SYNC_ENGINE}/service`, data, 'post', 'postLoad', {
            services: this.props.services.concat({
              id: 'new',
              description: data.repoDescription,
              folderId: data.folderId,
              nickname: data.nickname,
              enabled: true,
              sync: 1,
              deleted: 0,
            })
          });
          this.timer = window.setTimeout(this.handleCloseModal, 1500);
        } else if (update.index === 2 && this.state.index === 3) {
          this.setState({
            index: update.index,
          });
        }
      } else if (update.action === 'groupSearch') {
        this.search = update.value;
        if (this.props.loadAllGroups) {
          this.props.loadAllGroups(0, this.search, 1);
        }
      } else if (update.action === 'groupChecked') {
        const groupIds = _get(currentService, 'groupIds', []);
        this.setState({
          currentService: {
            ...currentService,
            groupIds: update.value ? groupIds.concat(+update.id) : groupIds.filter(item => item !== +update.id)
          }
        });
      } else if (update.action === 'repoDescription') {
        this.setState({
          currentService: {
            ...currentService,
            [update.action]: update.value
          }
        });
      } else if (update.action === 'syncRootPath') {
        this.setState({
          [update.action]: update.value,
          currentService: {
            ...currentService,
            folderId: update.value ? 'root' : null
          }
        });
      } else if (update.action === 'checked') {
        const { services } = this.props;
        const service = services.find(item => +item.id === +update.id);
        this.props.crudFiles(`${SYNC_ENGINE}/service`, JSON.stringify({
          ...service,
          accountId: service.accountId,
          repoDescription: service.description,
          enabled: update.value
        }), 'put', 'load', { services: services.map(item => ({
          ...item,
          enabled: item.id === service.id ? update.value : item.enabled
        })) });
      } else if (update.action === 'sortUser') {
        this.setState({
          sortUsers: _get(this.state, 'currentService.groupIds', []),
        });
      } else if (update.action === 'contentChecked') {
        this.setState({
          currentService: {
            ...currentService,
            folderId: currentService.folderId === update.currentCheckedId ? null : update.currentCheckedId
          }
        });
      } else if (update.action === 'editSave') {
        const { id, nickname, accountId, folderId, asUser, enabled } = this.props.service;
        const body = {
          id,
          nickname,
          accountId,
          folderId,
          groupIds: currentService.groupIds,
          repoDescription: update.description,
          asUser,
          enabled,
        };
        this.props.crudFiles(`${SYNC_ENGINE}/service`, body, 'put', 'putLoad', {
          services: this.props.syncEngine.map(item => (+item.id === +body.id ? {
            ...body,
            description: update.description,
            sync: item.sync
          } : item)),
        });
        this.handleCloseModal();
      }
    }
  }

  handleCloseModal() {
    this.setState({
      isCreateVisible: false,
      isEditVisible: false,
      isDeleteVisible: false,
      ...this.default,
    });
    if (this.props.setData) {
      this.props.setData({
        contents: [],
        paths: null
      });
    }
    this.search = '';
    this.timer = null;
  }

  // kloudless functions
  handleAuthenticateKloudless(result) {
    if (!result.error) {
      const filteredResult = {
        id: result.account.id,
        service: result.account.service
      };
      const { currentService } = this.state;
      if (_get(currentService, 'isAdmin', false) && !this.adminAccountsWithoutUserImpersonation.includes(filteredResult.service)) {
        this.props.crudFiles(`${SYNC_ENGINE}/users`, { id: filteredResult.id }, 'get', 'user');
      } else {
        this.props.crudFiles(`${SYNC_ENGINE}/repository`, { accountId: filteredResult.id }, 'get', 'repositoryLoad');
      }
      const currentCloud = this.props.service.repositoryList.find(item => item.nickname === filteredResult.service) || {};
      this.setState({
        currentService: {
          ...this.state.currentService,
          ...filteredResult,
          paths: [{
            name: currentCloud.name,
            path: ''
          }],
          folderId: null
        },
        index: 2,
      });
    }
  }

  handleUserGroupScroll(e) {
    const target = e.target;
    const {
      allGroupsLoading,
      allGroupsComplete,
    } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    if (scrollBottom >= loadTrigger && !allGroupsComplete && !allGroupsLoading) {
      // Load more
      if (this.props.loadAllGroups) {
        this.props.loadAllGroups(this.props.allGroupsOffset + globalStructureFetchLimit, this.search, 1);
      }
    }
  }

  handleDeleteDialogConfirm() {
    if (this.props.crudFiles) {
      this.props.crudFiles(`${SYNC_ENGINE}/service`, { id: this.state.currentService.id }, 'del', 'delLoad', {
        tableName: 'services',
        id: this.state.currentService.id
      });
    }
    this.handleCloseModal();
  }

  handleCompareContentItem(a, b) {
    if (this.state.sortUsers.indexOf(a.id) > -1 && this.state.sortUsers.indexOf(b.id) > -1) {
      return a.id > b.id ? 1 : -1;
    }

    if (this.state.sortUsers.indexOf(a.id) > -1 && !(this.state.sortUsers.indexOf(b.id) > -1)) {
      return -1;
    }

    if (!(this.state.sortUsers.indexOf(a.id) > -1) && this.state.sortUsers.indexOf(b.id) > -1) {
      return 1;
    }

    if (!(this.state.sortUsers.indexOf(a.id) > -1) && !(this.state.sortUsers.indexOf(b.id) > -1)) {
      return a.id > b.id ? 1 : -1;
    }
    // a must be equal to b
    return 0;
  }

  handleListScroll(event) {
    const target = event.target;
    const {
      loading,
      hasMoreContent,
      currentFolderId,
      nextPage
    } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    // Don't trigger if already loading
    if (scrollBottom >= loadTrigger && !loading) {
      // Load more
      const asUser = _get(this.state.currentService, 'user.userId', null);
      if (hasMoreContent && this.state.newNextPage) {
        this.props.getMoreContent(currentFolderId, nextPage, this.state.currentService.id, asUser);
      }
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      loading,
      serviceLoading,
      syncEngine,
      service,
      users,
      contents,
      allGroups,
      allGroupsComplete,
      className,
      style,
      nextPage
    } = this.props;

    const { isCreateVisible, isEditVisible, isDeleteVisible, currentService, index, syncRootPath } = this.state;

    const strings = generateStrings(messages, formatMessage, {
      usersCount: _get(currentService, 'groupIds', []).length || 0,
      nickname: _get(currentService, 'paths.0.name', '')
    });

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <AdminSyncEngine
          onChange={this.handleChange}
          strings={strings}
          syncEngine={syncEngine}
          emptyMessage={strings.noServiceAvailable}
        />}
        <SyncCreateModal
          {...this.props}
          isVisible={isCreateVisible}
          loading={serviceLoading}
          onClose={this.handleCloseModal}
          cloudServices={_get(service, 'repositoryList', [])}
          scope={currentService.scope}
          isAdmin={currentService.isAdmin}
          allGroupList={allGroups.map(item => ({
            ...item,
            isSelected: currentService.groupIds && currentService.groupIds.indexOf(item.id) > -1
          })).slice().sort(this.handleCompareContentItem)}
          onChange={this.handleChange}
          users={users}
          index={index}
          strings={strings}
          userGroups={users}
          folderId={currentService.folderId}
          selectedUser={currentService.user}
          paths={currentService.paths}
          contents={contents}
          onUserGroupScroll={this.handleUserGroupScroll}
          repoDescription={currentService.repoDescription}
          syncRootPath={syncRootPath}
          loadingMore={!allGroupsComplete}
          onHandleListScroll={this.handleListScroll}
          nextPage={nextPage}
          adminAccountsWithoutUserImpersonation={this.adminAccountsWithoutUserImpersonation}
        />
        <SyncEditModal
          strings={strings}
          name={_get(service.repositoryList.find(item => item.nickname === service.nickname), 'name', '')}
          nickname={service.nickname}
          description={service.description}
          isVisible={isEditVisible}
          loading={serviceLoading}
          onClose={this.handleCloseModal}
          allGroupList={allGroups.map(item => ({
            ...item,
            isSelected: currentService.groupIds && currentService.groupIds.indexOf(item.id) > -1
          })).slice().sort(this.handleCompareContentItem)}
          onChange={this.handleChange}
          onUserGroupScroll={this.handleUserGroupScroll}
          loadingMore={!allGroupsComplete}
        />
        <Dialog
          title={strings.warning}
          message={strings.deleteSyncMsg}
          cancelText={strings.cancel}
          confirmText={strings.delete}
          isVisible={isDeleteVisible}
          onCancel={this.handleCloseModal}
          onConfirm={this.handleDeleteDialogConfirm}
        />
        <button
          id="syncEngineAuthenticateBtn"
          type="button"
          style={{ display: 'none' }}
        />
      </div>
    );
  }
}
