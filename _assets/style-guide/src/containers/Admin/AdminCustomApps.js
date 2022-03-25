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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import Debug from '../../views/Debug';

import AdminCustomApps from 'components/Admin/AdminCustomApps/AdminCustomApps';
import AuthModal from 'components/Admin/AdminCustomApps/AuthModal';
import UsersModal from 'components/Admin/AdminCustomApps/UsersModal'
const list = require('../../static/admin/customAppsList.json');
const users = require('../../static/users.json');
import { Btn } from 'components';
const LIST = 'list';
const EDIT = 'edit';

const AdminCustomAppsDocs = require('!!react-docgen-loader!components/Admin/AdminCustomApps/AdminCustomApps.js');

export default class AdminCustomAppsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list,
      isAuthVisible: false,
      isUsersVisible: false,
      view: EDIT,
      triggerList: [],
      triggerListLoaded: false,
      triggerListLoading: true,
      triggerListLoadingMore: false,
      triggerListIsComplete: false,
    };
    autobind(this);
  }

  handleTestSettingClick(event) {
    event.preventDefault();
    console.info('click');
  }

  handleChange(update) {
    this.setState({
      values: {
        ...this.state.values,
        ...update,
      },
      update,
    });
  }

  handleToggleList() {
    this.setState({
      list: this.state.list.length > 0 ? [] : list
    })
  }

  handleClick(e) {
    const { dataset } = e.currentTarget;
    console.log(dataset.type);
  }

  handleToggleAuth() {
    this.setState({
      isAuthVisible: !this.state.isAuthVisible,
      isUsersVisible: false,
    });
  }

  handleToggleUsers() {
    this.setState({
      isUsersVisible: !this.state.isUsersVisible,
      isAuthVisible: false,
      triggerList: [],
      triggerListLoaded: false,
      triggerListLoading: true,
      triggerListLoadingMore: false,
      triggerListIsComplete: false,
    });
  }

  handleToggleView() {
    this.setState({
      view: this.state.view === LIST ? EDIT : LIST
    });
  }

  /* triggerList */
  handleGetList(offset) {
    const itemCount = 10;
    const newList = users.slice(offset, offset + 10);

    this.setState({
      triggerList: [...this.state.triggerList, ...newList],
      triggerListLoaded: true,
      triggerListLoading: newList.length === itemCount,
      triggerListLoadingMore: newList.length < itemCount,
      triggerListIsComplete: newList.length < itemCount,
    });
  }

  render() {
    const {
      isAuthVisible,
      view,
      isUsersVisible,
      triggerList,
      triggerListLoaded,
      triggerListLoading,
      triggerListLoadingMore,
      triggerListIsComplete,
    } = this.state;

    return (
      <section id="BlankView">
        <h1>Admin Custom Apps View</h1>
        <Docs {...AdminCustomAppsDocs} />
        <Debug>
          <div>
            <Btn small onClick={this.handleToggleList}>toogle list</Btn>
            <Btn small onClick={this.handleToggleAuth}>toogle Auth Modal</Btn>
            <Btn small onClick={this.handleToggleView}>toogle View</Btn>
            <Btn small onClick={this.handleToggleUsers}>toogle Users Modal</Btn>
          </div>
        </Debug>
        <ComponentItem>
          <AdminCustomApps list={this.state.list} view={view} user={users[2]}/>
          <AuthModal isVisible={isAuthVisible} onClick={this.handleClick} onClose={this.handleToggleAuth} />
          <UsersModal
            isVisible={isUsersVisible}
            onClick={this.handleClick}
            onClose={this.handleToggleUsers}
            list={triggerList}
            isLoaded={triggerListLoaded}
            isLoading={triggerListLoading}
            isLoadingMore={triggerListLoadingMore}
            isComplete={triggerListIsComplete}
            onGetList={this.handleGetList}
          />
        </ComponentItem>
      </section>
    );
  }
}
