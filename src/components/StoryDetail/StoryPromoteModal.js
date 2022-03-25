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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import autobind from 'class-autobind';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  addContact,
  addMultipleContact,
  removeContactById,
  searchGroups,
  searchUsers,
  sendPromote,
  setData,
  reset,
  resetLists,
} from 'redux/modules/story/promote';
import { createPrompt } from 'redux/modules/prompts';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import SelectSearch from 'components/SelectSearch/SelectSearch';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';

// Common list
import List from 'components/List/List';

const messages = defineMessages({
  promoteStory: { id: 'promote-story', defaultMessage: 'Promote {story}' },
  promote: { id: 'promote', defaultMessage: 'Promote' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  title: { id: 'title', defaultMessage: 'Title' },
  message: { id: 'message', defaultMessage: 'Message' },
  method: { id: 'method', defaultMessage: 'Method' },
  push: { id: 'push', defaultMessage: 'Push' },
  email: { id: 'email', defaultMessage: 'Email' },
  or: { id: 'or', defaultMessage: 'Or' },
  specifyUsersAndGroups: { id: 'specify-users-groups', defaultMessage: 'Specify users and groups' },
  sendTo: { id: 'send-to', defaultMessage: 'Send to' },
  everyone: { id: 'everyone', defaultMessage: 'Everyone' },
  choose: { id: 'choose', defaultMessage: 'Choose' },
  addUsersOrGroups: { id: 'add-users-or-groups', defaultMessage: 'Add Users or Groups' },
  users: { id: 'users', defaultMessage: 'Users' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  noResultsInSearchPlaceholder: { id: 'no-contacts-selected', defaultMessage: 'No Contacts Selected' },
});

const USERS = 'users';
const GROUPS = 'groups';

function mapStateToProps(state) {
  const users = state.promote.users ? state.promote.users
    .map(item => ({
      id: item.id,
      colour: item.colour || item.defaultColour,
      isSelected: !!item.isSelected,
      name: item.name,
      thumbnail: item.thumbnail,
      type: item.type === 'user' ? 'people' : item.type,
      childCount: item.childCount || item.usersCount,
      noLink: true,
      showFollow: false, // for userItem component
      email: item.email
    })) : [];

  const groups = state.promote.groups ? state.promote.groups
    .map(item => ({
      id: item.id,
      colour: item.colour || item.defaultColour,
      isSelected: !!item.isSelected,
      name: item.name,
      thumbnail: item.thumbnail,
      type: item.type,
      childCount: item.childCount || item.usersCount,
    })) : [];

  return {
    ...state.promote,
    toAddress: state.promote.toAddress.filter(contact => !contact.deleted),
    users: users,
    groups: groups
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    addContact,
    addMultipleContact,
    removeContactById,
    searchGroups,
    searchUsers,
    sendPromote,
    setData,
    reset,
    resetLists
  }),
  null,
  {
    areStatesEqual: (next, prev) => {
      return (
        prev.users === next.users && prev.promote === next.promote
      );
    }
  }
)
export default class StoryPromoteModal extends Component {
  static propTypes = {
    id: PropTypes.number,
    isVisible: PropTypes.bool,
    title: PropTypes.string,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchContactValue: '',
      contactsMenuSelected: USERS
    };
    autobind(this);

    // refs
    this.modalContainer = null;
    this.selectSearch = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { error, saved } = nextProps;
    const { naming } = this.context.settings;

    // Confirmation message
    if (!this.props.saved && saved) {
      const sentMessage = (
        <FormattedMessage
          id="story-promoted"
          defaultMessage="{story} promoted"
          values={{ story: naming.story }}
        />
      );
      this.props.createPrompt({
        id: uniqueId('promote-'),
        type: 'info',
        message: sentMessage,
        dismissible: true,
        autoDismiss: 5
      });

      this.setState({
        searchContactValue: '',
        contactsMenuSelected: USERS
      }, () => this.props.reset());
    }

    // Handle sent errors
    if (error.message && (error.message !== this.props.error.message)) {
      this.props.createPrompt({
        id: uniqueId('sendError-'),
        type: 'error',
        title: 'Error',
        message: error.message,
        dismissible: true,
        autoDismiss: 10
      });
      this.props.setData({ error: '' });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // scroll window to display full dropdown options
    if (this.props.users !== prevProps.users || this.props.groups !== prevProps.groups) {
      const container = this.modalContainer;
      if (container) {
        this.timer = window.setTimeout(() => {
          window.clearTimeout(this.timer);
          container.parentNode.scrollTop = container.parentNode.offsetHeight + 100;
        }, 500);
      }
    }

    // Trigger search when menu is Toggled
    if (this.state.searchContactValue && this.state.contactsMenuSelected !== prevState.contactsMenuSelected) {
      this.handleSearchContacts(this.state.searchContactValue);
    } else if (!this.state.searchContactValue && prevState.searchContactValue) {
      this.props.resetLists();
    }
  }

  handleInputChange(event) {
    const data = {};
    if (event) {
      data[event.target.name] = event.target.value;
      this.props.setData(data);
    }
  }

  handleToggleSendToType(event) {
    this.props.setData({ toAll: +event.currentTarget.value });
  }

  handleNavMenuClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    this.setState({
      contactsMenuSelected: href,
    });
  }

  // Search Contacts
  handleSearchContacts(keyword, offset = 0) {
    const { user } = this.context.settings;

    switch (this.state.contactsMenuSelected) {
      case USERS:
        if (keyword && typeof this.props.searchUsers === 'function') {
          this.props.searchUsers({
            keyword: keyword,
            offset: offset
          });
        }
        break;
      case GROUPS:
        if (keyword && typeof this.props.searchGroups === 'function') {
          this.props.searchGroups({
            keyword: keyword,
            offset: offset,
            userId: user.id
          });
        }
        break;
      default:
        break;
    }
  }

  handleSearchInputChange(event) {
    const keyword = event.currentTarget.value;

    this.setState(
      { searchContactValue: keyword },
      this.handleSearchContacts(keyword, 0)
    );
  }

  handleAddRemoveContact(itemAdded, itemRemoved) {
    if (itemAdded) {
      let newItem = '';
      if (itemAdded.type === 'people') {
        newItem = this.props.users.find(item => item.id === itemAdded.id);
      } else if (itemAdded.type === 'group') {
        newItem = this.props.groups.find(item => item.id === itemAdded.id);
      }

      this.props.addContact({
        id: newItem.id,
        name: newItem.name,
        deleted: false,
        ...newItem
      }, 'toAddress');
    } else if (itemRemoved) {
      this.handleRemoveContact(itemRemoved.id, itemRemoved.type);
    }

    // Reset unselected files
    this.setState({
      unSelectedItem: {}
    });
  }

  handleRemoveContact(id, type) {
    if (this.props.removeContactById && typeof this.props.removeContactById === 'function') {
      this.props.removeContactById(id, type);
    }
  }

  handleRemoveSelectedContact(event, context) {
    if (this.props.removeContactById && typeof this.props.removeContactById === 'function') {
      this.setState(
        {
          unSelectedItem: { id: context.props.id },
        },
        this.handleRemoveContact(context.props.id, context.props.type)
      );
    }
  }

  handlePromoteClick() {
    this.props.sendPromote({
      ...this.props
    });
  }

  handleOnClose() {
    this.setState({
      searchContactValue: '',
      contactsMenuSelected: USERS
    }, () => this.props.reset());
  }

  render() {
    const { groups, groupsLoading, message, users, usersLoading, toAddress, title } = this.props;
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);
    const styles = require('./StoryPromoteModal.less');

    const itemList = {
      items: this.state.contactsMenuSelected === USERS ? users : groups,
      isLoading: this.state.contactsMenuSelected === USERS ? usersLoading : groupsLoading,
      inputValue: this.state.searchContactValue,
      unSelectedItem: this.state.unSelectedItem,
    };

    return (
      <Modal
        autosize
        backdropClosesModal
        escClosesModal
        isVisible={this.props.isVisible}
        headerTitle={strings.promoteStory}
        onClose={this.handleOnClose}
        footerChildren={(
          <div>
            <Btn
              large
              alt
              onClick={this.handleOnClose}
            >
              {strings.cancel}
            </Btn>
            <Btn
              large
              inverted
              loading={this.props.saving}
              disabled={!this.props.toAddress.length && !this.props.toAll || !message}
              onClick={this.handlePromoteClick}
            >
              {strings.promote}
            </Btn>
          </div>
        )}
      >
        <div ref={(c) => { this.modalContainer = c; }} className={styles.StoryPromoteModal}>
          <div className={styles.row}>
            <h3>{strings.title}</h3>
            <Text
              name="title"
              defaultValue={title}
              readOnly
            />
          </div>

          <div className={styles.row}>
            <h3>{strings.message}</h3>
            <Textarea
              name="message"
              value={message}
              rows={4}
              onChange={this.handleInputChange}
            />
          </div>

          <div className={styles.row}>
            <h3>{strings.sendTo}</h3>
            <div>
              <RadioGroup
                name="type"
                selectedValue={+this.props.toAll}
                onChange={this.handleToggleSendToType}
                className={styles.radio}
                options={[{
                  label: strings.everyone,
                  value: 1
                }, {
                  label: strings.choose + '...',
                  value: 0
                }]}
              />

              {!this.props.toAll && <div>
                <SelectSearch
                  ref={(c) => { this.selectSearch = c; }}
                  id="select-search"
                  leftAlignIcon
                  width={420}
                  placeholder={strings.addUsersOrGroups}
                  {...itemList}
                  selectedItems={toAddress}
                  showNavigationMenu
                  menuSelected={this.state.contactsMenuSelected}
                  menuOptions={[
                    { name: strings.users, url: USERS },
                    { name: strings.groups, url: GROUPS }
                  ]}
                  onNavMenuClick={this.handleNavMenuClick}
                  onChange={() => {}}
                  onInputChange={this.handleSearchInputChange}
                  onToggleItem={this.handleAddRemoveContact}
                />

                <List
                  list={toAddress.map(item => ({
                    ...item,
                    id: Number(item.id)
                  }))}
                  itemProps={{
                    className: styles.groupItemDiv,
                    thumbSize: 'small',
                    showThumb: true,
                    showAdmin: true,
                    showAdministratorCheckbox: false,
                    onAdministratorCheckboxClick: false,
                    showDelete: true,
                    onDeleteClick: this.handleRemoveSelectedContact,
                  }}
                  onItemClick={() => {}}
                  keyPrefix="2"
                  className={styles.List}
                  emptyHeading={strings.noResultsInSearchPlaceholder}
                  emptyMessage=""
                  icon="group"
                />
              </div>}

            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
