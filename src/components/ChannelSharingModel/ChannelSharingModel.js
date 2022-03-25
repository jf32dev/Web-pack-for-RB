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
 * @author Shibu Bhattarai <Shibu.Bhattarai@bigtincan.com>
 */
//get, difference, uniqueId
import { get, differenceBy, sortBy, uniqueId } from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import UserThumb from 'components/UserThumb/UserThumb';
import Checkbox from 'components/Checkbox/Checkbox';

import Text from 'components/Text/Text';
import Loader from 'components/Loader/Loader';
import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Icon  from 'components/Icon/Icon';
import SVGIcon from 'components/SVGIcon/SVGIcon';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  searchPeople,
  shareChannel,
  getShareChannelUsers,
  removeChannelSharing
} from 'redux/modules/channelShare';
import { createPrompt } from 'redux/modules/prompts';
import { mapUsers } from 'redux/modules/entities/helpers';

const messages = defineMessages({
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  save: { id: 'save', defaultMessage: 'Save' },
  done: { id: 'done', defaultMessage: 'Done' },
  searchByNameOrEmail: { id: 'search-by-name-or-email', defaultMessage: 'Search by name or email address' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
  emptyMessage: { id: 'search-empty-message', defaultMessage: 'Your search criteria returned no matched results. Please try again.' },
  saving: { id: 'saving', defaultMessage: 'Saving' },
  sharingDescription: { id: 'sharing-description', defaultMessage: 'Allow users to publish content or invite others to this {channel}.' },
  savedSuccessfully: { id: 'saved-successfully', defaultMessage: 'Saved successfully.' },
  manageSharing: { id: 'manage-sharing', defaultMessage: 'Manage Sharing' },
  user: { id: 'user', defaultMessage: 'User' },
  addUser: { id: 'add-user', defaultMessage: 'Add User' },
  addUsers: { id: 'add-users', defaultMessage: 'Add Users' },
  publish: { id: 'publish', defaultMessage: 'Publish' },
  manage: { id: 'manage', defaultMessage: 'Manage' },
  addToShareMessage: { id: 'add-share-msg', defaultMessage: 'Enter a users name or email address to share this {channel} with them.' },
  noShareMessage: { id: 'no-share-message', defaultMessage: 'Add users to allow them to see {stories} published in this {channel}.' }
});

@connect(state => {
  const { channelShare, entities, settings } = state;
  return {
    ...channelShare,
    users: mapUsers(channelShare.searchPeople, entities),
    myUser: settings.user
  };
}, bindActionCreatorsSafe({
  searchPeople,
  shareChannel,
  getShareChannelUsers,
  removeChannelSharing,
  createPrompt
}))
export default class ChannelSharingModel extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    channelDetails: PropTypes.object
  };

  static defaultProps = {
    isVisible: false
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      searchActive: false,
      isValid: false,
      allUsers: [],
      currentShareUsers: [],
      currentPendingShareUsers: [],
      sharing: false,
      searching: false
    };
    this.initialShareUsers = [];
    this.pendingOperation = [];
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({
      searching: true
    });
    this.props.getShareChannelUsers(this.props.channelDetails.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, { ...naming });
    if (!get(this.props, 'peopleLoaded', false) && get(nextProps, 'peopleLoaded', false)) {
      const currentSearchUsers = nextProps.users;
      const allUsers = Object.assign([], this.state.allUsers);
      currentSearchUsers.forEach((user) => {
        const isFound =  allUsers.some((cacheUser) => cacheUser.id === user.id);
        if (!isFound) {
          allUsers.push(user);
        }
      });
      this.setState({
        allUsers: sortBy(allUsers, (user) => user.name.toLowerCase()),
        searching: false
      });
    }
    if (!get(this.props, 'shareUsersLoaded', false) && get(nextProps, 'shareUsersLoaded', false)) {
      const tmpList = [];
      Object.assign([], nextProps.shareUsers).forEach((item) => {
        tmpList.push({
          ...item,
          userId: item.user.id
        });
        const tmpUser = Object.assign({}, item.user);
        this.initialShareUsers.push({
          user: tmpUser,
          meta: Object.assign({}, item.meta),
          userId: tmpUser.id
        });
      });
      this.setState({
        currentShareUsers: tmpList,
        searchActive: tmpList.length === 0,
        searching: false
      });
    }
    if (get(nextProps, 'channelShareCompleteUserId', 0) > 0) {
      this.pendingOperation = this.pendingOperation.filter((id) => id !== get(nextProps, 'channelShareCompleteUserId', 0));
      if (this.pendingOperation.length === 0) {
        this.setState({
          sharing: false
        });
        this.props.createPrompt({
          id: uniqueId('info-'),
          type: 'info',
          message: strings.savedSuccessfully,
          dismissible: true,
          autoDismiss: 5
        });
        const { onClose } = this.props;
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
        this.props.getShareChannelUsers(this.props.channelDetails.id);
      } else {
        this.startUpdating();
      }
    }
  }

  getPeopleItem(item, styles, authString) {
    const internItem = Object.assign({}, item);
    return (
      <div key={item.userId} className={styles.userItem}>
        <div className={styles.user}>
          <UserThumb
            className={styles.userThumb}
            name={internItem.user.name}
            thumbnail={internItem.user.thumbnail}
            authString={authString}
          />
          <div className={styles.details}>
            <div className={styles.name}>{internItem.user.name}</div>
            <div className={styles.email}>{internItem.user.email}</div>
          </div>
        </div>
        <div className={styles.publish}>
          <Checkbox
            name={'publish_enabled_' + internItem.user.name}
            value={internItem.userId}
            checked={internItem.meta.canPublish}
            onChange={this.handlePublishToggleEnable}
          /></div>
        <div className={styles.invite}>
          <Checkbox
            name={'invite_enabled_' + internItem.user.name}
            value={internItem.userId}
            checked={internItem.meta.canInvite}
            onChange={this.handleInviteToggleEnable}
          />
        </div>
        <div className={styles.action}>
          <div className={styles.closeIcon} onClick={this.handleRemoveFromShareItem.bind(this, internItem)} />
        </div>
      </div>);
  }

  getSearchPeopleItems(peopleListFilter, styles, authString) {
    const { currentPendingShareUsers, currentShareUsers } = this.state;
    return peopleListFilter.map((item) => {
      const currentPendingAdded = currentPendingShareUsers.some((user) => user.userId === item.id);
      const allreadyAdded = currentShareUsers.some((user) => user.userId === item.id);
      const added = currentPendingAdded || allreadyAdded;
      return (<div key={item.id} className={allreadyAdded ? styles.userItemDisable : styles.userItem}>
        <div className={styles.user} onClick={allreadyAdded ? () => {} : this.handleAddToShareList.bind(this, item)}>
          <UserThumb
            className={styles.userThumb}
            name={item.name}
            thumbnail={item.thumbnail}
            authString={authString}
          />
          <div className={styles.details}>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.email}>{item.email}</div>
          </div>
        </div>
        <div className={styles.action}>
          <Checkbox
            name={'invite_enabled_' + item.id}
            value={item.id}
            checked={added}
            disabled={allreadyAdded}
            onChange={allreadyAdded ? () => {} : this.handleAddToShareList.bind(this, item)}
          />
        </div>
      </div>);
    });
  }

  startUpdating() {
    if (this.pendingOperation.length > 0) {
      const currentOperation = this.pendingOperation.pop();
      if (currentOperation.type === 'ADD') {
        this.props.shareChannel(currentOperation);
      }
      if (currentOperation.type === 'REMOVED') {
        this.props.removeChannelSharing(currentOperation.channelId, currentOperation.userId);
      }
    }
  }

  mapToOperationItem(type, item) {
    return {
      type: type,
      userId: item.userId,
      channelId: this.props.channelDetails.id,
      canPublish: item.meta.canPublish ? 1 : 0,
      canInvite: item.meta.canInvite ? 1 : 0,
    };
  }

  handleSave() {
    const { currentShareUsers, searchActive, currentPendingShareUsers } = this.state;
    if (searchActive) {
      const mergeCurrentShareUsers = currentShareUsers.concat(currentPendingShareUsers);
      this.setState({
        currentShareUsers: mergeCurrentShareUsers,
        currentPendingShareUsers: [],
        searchActive: false
      });
    } else {
      this.pendingOperation = [];
      this.pendingOperation = currentShareUsers.map((item) => {
        const oldItem = this.initialShareUsers.find((_internalItem) => item.userId === _internalItem.userId);
        if (oldItem) {
          if (oldItem.meta.canInvite !== item.meta.canInvite || oldItem.meta.canPublish !== item.meta.canPublish) {
            //Change in old sharing item
            return this.mapToOperationItem('ADD', item);
          }
        } else {
          //new Item added
          return this.mapToOperationItem('ADD', item);
        }
        return null;
      }).filter(Boolean);
      const newRemoved = differenceBy(this.initialShareUsers, currentShareUsers, (item) => item.userId);
      this.pendingOperation = this.pendingOperation.concat(newRemoved.map((userShare) => this.mapToOperationItem('REMOVED', userShare)).filter(Boolean));
      this.setState({
        sharing: true
      });
      this.startUpdating();
    }
  }

  handleSearchClear() {
    this.setState({ searchTerm: '', searching: false, allUsers: [] });
  }

  handleSearch(event) {
    this.setState({ searchTerm: event.currentTarget.value, searching: true });
    this.props.searchPeople({
      keyword: event.currentTarget.value
    });
  }

  handlePublishToggleEnable(event) {
    const { checked, value } = event.target;
    const currentUserId = +value;
    const currentShareUsers = Object.assign([], this.state.currentShareUsers.map((item) => {
      const tmpUserShare = Object.assign({}, item);
      if (item.userId === currentUserId) {
        tmpUserShare.meta.canPublish = checked;
        return tmpUserShare;
      }
      return tmpUserShare;
    }));
    this.setState({
      currentShareUsers,
      isValid: this.isOperationValid(currentShareUsers)
    });
  }

  handleInviteToggleEnable(event) {
    const { checked, value } = event.target;
    const currentUserId = +value;
    const currentShareUsers = Object.assign([], this.state.currentShareUsers.map((item) => {
      const tmpUserShare = Object.assign({}, item);
      if (item.userId === currentUserId) {
        tmpUserShare.meta.canInvite = checked;
        return tmpUserShare;
      }
      return tmpUserShare;
    }));
    this.setState({
      currentShareUsers,
      isValid: this.isOperationValid(currentShareUsers)
    });
  }

  handleAddToShareList(user) {
    let currentPendingShareUsers = Object.assign([], this.state.currentPendingShareUsers);
    const isAdded = currentPendingShareUsers.some(addedUser => addedUser.userId === user.id);
    if (isAdded) {
      currentPendingShareUsers = currentPendingShareUsers.filter(addedUser => addedUser.userId !== user.id);
    } else {
      currentPendingShareUsers.push({
        userId: user.id,
        user,
        meta: {
          canPublish: false,
          canInvite: false,
        }
      });
    }
    this.setState({
      currentPendingShareUsers,
      isValid: this.isOperationValid(currentPendingShareUsers)
    });
  }

  handleRemoveFromShareItem(user) {
    const currentShareUsers = Object.assign([], this.state.currentShareUsers.filter(item => item.userId !== user.userId));

    this.setState({
      currentShareUsers,
      isValid: this.isOperationValid(currentShareUsers)
    });
  }

  handleClose() {
    const { onClose } = this.props;
    const { searchActive, currentShareUsers } = this.state;
    if (searchActive && currentShareUsers.length > 0) {
      this.setState({
        searchActive: false,
        currentPendingShareUsers: []
      });
    } else if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }

  isOperationValid(currentShareUsers) {
    const newAdded = differenceBy(currentShareUsers, this.initialShareUsers, (item) => item.userId);
    const newRemoved = differenceBy(this.initialShareUsers, currentShareUsers, (item) => item.userId);
    const newOperationAction = newAdded.concat(newRemoved);
    let changed = false;
    currentShareUsers.forEach((item) => {
      const oldItem = this.initialShareUsers.find((_internalItem) => item.userId === _internalItem.userId);
      if (oldItem) {
        if (oldItem.meta.canInvite !== item.meta.canInvite || oldItem.meta.canPublish !== item.meta.canPublish) {
          changed = true;
        }
      }
    });
    return newOperationAction.length > 0 || changed;
  }

  renderBlankContent(styles, message, addUsers) {
    const { searchActive } = this.state;
    return (
      <div className={styles.Blankslate}>
        <div className={styles.peopleSvg}>
          <SVGIcon type="people" />
        </div>
        <p>{message}</p>
        {addUsers && <Btn inverted onClick={() => this.setState({ searchActive: !searchActive })}>
          <span>{addUsers}</span>
        </Btn>}
      </div>
    );
  }

  renderGridHeader(styles, strings) {
    return (
      <div className={styles.gridHeader}>
        <div className={styles.user}>{strings.user}</div>
        <div className={styles.publish}>{strings.publish}</div>
        <div className={styles.invite}>{strings.manage}</div>
        <div className={styles.action} />
      </div>
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { isVisible,
      peopleLoaded,
      shareUsersLoading
    } = this.props;
    const { allUsers, currentShareUsers, currentPendingShareUsers, sharing, searching } = this.state;
    const authString = get(this.context.settings, 'authString', '');
    const { searchTerm, searchActive, isValid } = this.state;
    const searchTearmLowerCase = searchTerm.toLowerCase();
    const styles = require('./ChannelSharingModel.less');
    const strings = generateStrings(messages, formatMessage, { ...naming, homeScreenName: '' });
    const peopleListFilter = allUsers.filter(bundle => (bundle.name || '').toLowerCase().indexOf(searchTearmLowerCase) !== -1 || (bundle.email || '').toLowerCase().indexOf(searchTearmLowerCase) !== -1);
    const currentPendingCount = currentPendingShareUsers.length;
    const showGridTitle = !(searching || shareUsersLoading || currentShareUsers.length === 0);
    return (
      <Modal
        className={styles.channelSharingDialog}
        isVisible={isVisible}
        escClosesModal
        fixedAutoHeight
        width="medium"
        headerChildren={
          <span className={styles.modelHeader}>
            {searchActive && <span className={styles.headerTitle}>{strings.addUsers}</span>}
            {!searchActive && <span className={styles.headerTitle}>{strings.manageSharing}</span>}
            {currentShareUsers.length > 0 && !searchActive && <span className={styles.search} onClick={() => this.setState({ searchActive: !searchActive })}>
              <Icon name="plus" className={styles.searchIcon} />
            </span>}
          </span>
        }
        footerChildren={(<div>
          <Btn
            alt
            large
            onClick={this.handleClose}
            style={{ marginRight: '0.5rem' }}
          >
            {strings.cancel}
          </Btn>
          <Btn inverted disabled={!isValid} large style={{ marginLeft: '0.5rem' }} loading={sharing} onClick={this.handleSave}>
            {!searchActive && !sharing && <span>{strings.done}</span>}
            {sharing && <span>{strings.saving}</span>}
            {searchActive && !sharing && currentPendingCount > 0 && <FormattedMessage
              id="n-add-users"
              defaultMessage="Add {itemCount, plural, one {# user} other {# users}}"
              values={{ itemCount: currentPendingCount }}
              tagName="span"
            />}
            {searchActive && currentPendingCount === 0 && <span>{strings.addUser}</span>}
          </Btn>
        </div>)}
        onClose={this.handleClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div className={styles.dialogBody}>
          <div className={styles.bodyContainer}>
            { searchActive &&
            <div className={styles.header} data-name="active">
              <Text
                className={styles.search}
                id="config-search"
                icon="search"
                placeholder={strings.searchByNameOrEmail}
                value={searchTerm}
                showClear={!!(searchTerm && searchTerm.length > 0)}
                onChange={this.handleSearch}
                onClearClick={this.handleSearchClear}
              />
            </div>
            }
            { !searchActive && showGridTitle &&
              <div className={showGridTitle ? styles.normalHeader : styles.normalHeaderWithoutGrid}>
                <div className={styles.nameContainer}>
                  <h4>{strings.sharingDescription}</h4>
                </div>
                {showGridTitle && this.renderGridHeader(styles, strings)}
              </div>
              }
            <div className={styles.list} data-name={searchActive ? 'active' : ''}>
              {!searchActive && currentShareUsers.map((item) => this.getPeopleItem(item, styles, authString, strings))}
              {searchActive && peopleLoaded && peopleListFilter.length > 0 && this.getSearchPeopleItems(peopleListFilter, styles, authString, strings)}
              {searchActive && peopleListFilter.length === 0  && !searching && <div className={styles.noContent}>
                {this.renderBlankContent(styles, strings.addToShareMessage)}
              </div>
              }
              {!searchActive && currentShareUsers.length === 0 && !searching && <div className={styles.noUserContent}>
                {this.renderBlankContent(styles, strings.noShareMessage, strings.addUsers)}
              </div>
              }
              {(searching || shareUsersLoading) &&
              <div className={styles.loaderContainer}>
                <Loader
                  type="content"
                  style={{ margin: '0 auto', height: '100%' }}
                />
              </div>}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
