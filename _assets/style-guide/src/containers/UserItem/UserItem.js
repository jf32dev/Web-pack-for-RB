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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import { Btn, UserItem, UserItemNew } from 'components';

const UserItemDocs = require('!!react-docgen-loader!components/UserItem/UserItem.js');

const users = require('../../static/users.json');

export default class UserItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      width: 'auto',
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, user) {
    event.preventDefault();
    let action = event.currentTarget.getAttribute('href');
    if (!action) {
      action = 'userId: ' + user.props.id;
    }

    this.setState({ lastClick: 'onClick: ' + action });
  }

  handleCallClick(event, user) {
    this.setState({ lastClick: 'onCallClick: ' + user.props.id });
  }

  handleChatClick(event, user) {
    this.setState({ lastClick: 'onChatClick: ' + user.props.id });
  }

  handleFollowClick(event, user) {
    this.setState({ lastClick: 'onFollowClick: ' + user.props.id });
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  render() {
    const { grid, width, lastClick } = this.state;

    return (
      <section id="UserItemView">
        <h1>UserItem</h1>
        <Docs {...UserItemDocs} />

        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>{lastClick}</code>
          </div>
        </Debug>

        <h2>{grid ? 'Grid' : 'List'} - Tiny</h2>
        {!grid && <p>User name restricted to one line.</p>}
        {grid && <p>User info is hidden and only first initial is displayed.</p>}
        <ComponentItem style={{ width: width }}>
          <UserItem
            presence={50}
            thumbSize="tiny"
            grid={grid}
            inList
            showFollow={false}
            showEdit
            onClick={this.handleClick}
            onEditClick={this.handleClick}
            {...users[2]}
          />
          <UserItem
            presence={70}
            thumbSize="tiny"
            grid={grid}
            inList
            isActive
            onClick={this.handleClick}
            {...users[3]}
          />
          <UserItem
            presence={100}
            thumbSize="tiny"
            showFollow
            inList
            grid={grid}
            onClick={this.handleClick}
            onFollowClick={this.handleFollowClick}
            {...users[4]}
          />
          <UserItem
            note="Custom note"
            thumbSize="tiny"
            grid={grid}
            showCall
            showChat
            showFollow
            inList
            noLink
            onClick={this.handleClick}
            onCallClick={this.handleCallClick}
            onChatClick={this.handleChatClick}
            onFollowClick={this.handleFollowClick}
            {...users[5]}
          />
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Small</h2>
        {!grid && <p>User name restricted to one line.</p>}
        {grid && <p>User info is hidden and a tooltip is displayed on hover.</p>}
        <ComponentItem style={{ width: width }}>
          <UserItem
            presence={50}
            thumbSize="small"
            grid={grid}
            inList
            onClick={this.handleClick}
            showEdit
            onEditClick={this.handleClick}
            {...users[2]}
          />
          <UserItem
            presence={70}
            thumbSize="small"
            grid={grid}
            inList
            isActive
            onClick={this.handleClick}
            {...users[3]}
          />
          <UserItem
            presence={100}
            thumbSize="small"
            showFollow
            inList
            grid={grid}
            onClick={this.handleClick}
            onFollowClick={this.handleFollowClick}
            {...users[4]}
          />
          <UserItem
            note="Custom note"
            thumbSize="small"
            grid={grid}
            showCall
            showChat
            showFollow
            inList
            noLink
            onClick={this.handleClick}
            onCallClick={this.handleCallClick}
            onChatClick={this.handleChatClick}
            onFollowClick={this.handleFollowClick}
            {...users[5]}
          />
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Medium</h2>
        {!grid && <p>User name restricted to two lines.</p>}
        {grid && <p>User name restricted to two lines.</p>}
        <ComponentItem style={{ width: width }}>
          <UserItem
            presence={50}
            thumbSize="medium"
            inList
            grid={grid}
            onClick={this.handleClick}
            {...users[3]}
          />
          <UserItem
            presence={70}
            thumbSize="medium"
            showFollow
            inList
            grid={grid}
            onClick={this.handleClick}
            onFollowClick={this.handleFollowClick}
            {...users[4]}
          />
          <UserItem
            presence={100}
            note="Custom note"
            thumbSize="medium"
            showCall
            showChat
            showFollow
            inList
            noLink
            isActive
            grid={grid}
            onClick={this.handleClick}
            onCallClick={this.handleCallClick}
            onChatClick={this.handleChatClick}
            onFollowClick={this.handleFollowClick}
            {...users[5]}
          />
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Large</h2>
        {!grid && <p>User name restricted to three lines.</p>}
        {grid && <p>User name restricted to two lines.</p>}
        <ComponentItem style={{ width: width }}>
          <UserItem
            presence={50}
            thumbSize="large"
            inList
            grid={grid}
            onClick={this.handleClick}
            onFollowClick={this.handleFollowClick}
            {...users[3]}
          />
          <UserItem
            presence={70}
            thumbSize="large"
            grid={grid}
            showFollow
            inList
            isActive
            onClick={this.handleClick}
            onFollowClick={this.handleFollowClick}
            {...users[4]}
          />
          <UserItem
            presence={100}
            note="Custom note"
            grid={grid}
            thumbSize="large"
            showCall
            showChat
            showFollow
            inList
            noLink
            onClick={this.handleClick}
            onCallClick={this.handleCallClick}
            onChatClick={this.handleChatClick}
            onFollowClick={this.handleFollowClick}
            {...users[5]}
          />
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - New</h2>
        {!grid && <p>User name restricted to three lines.</p>}
        {grid && <p>User name restricted to two lines.</p>}
        <ComponentItem style={{ width: width }}>
          <UserItemNew
            grid={grid}
            presence={100}
            hasUserActions
            applyPadding
            {...users[11]}
          />
        </ComponentItem>
      </section>
    );
  }
}
