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

import Btn from 'components/Btn/Btn';

import GroupItem from 'components/GroupItem/GroupItem';
import AdminGroupSettings from 'components/Admin/AdminGroupSettings/AdminGroupSettings';
import AdminGroupAdd from 'components/Admin/AdminGroupAdd/AdminGroupAdd';

const GroupItemDocs = require('!!react-docgen-loader!components/GroupItem/GroupItem.js');
const AdminGroupSettingsDocs = require('!!react-docgen-loader!components/Admin/AdminGroupSettings/AdminGroupSettings.js');
const AdminGroupAddDocs = require('!!react-docgen-loader!components/Admin/AdminGroupAdd/AdminGroupAdd.js');

const groups = require('../../static/groups.json');

export default class GroupItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      width: 'auto',
      lastClick: null,
      group: groups[1],
      isSaveLoading: false
    };
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    this.setState({ lastClick: href });
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  /* Admin functions */
  handleAdminChange(e, context) {
    const group = context.group;
    group.permissions = parseInt(e.currentTarget.value, 10);
    this.setState({ group: group });
  }

  handlePermissionChange(e, context) {
    const group = context.group;
    group.permissions = context.id;
    this.setState({ group: group });
  }

  handleCancel() {
    console.log('Canceling');
  }

  render() {
    const { grid, width, lastClick } = this.state;

    const smallStyle = {
      margin: grid ? '0 -0.5rem -0.5rem' : '-0.5rem'
    };

    const mediumStyle = {
      margin: grid ? '0 -0.75rem -0.75rem' : '-0.5rem'
    };

    const largeStyle = {
      margin: grid ? '0 -1rem -1rem' : '-0.5rem'
    };

    return (
      <section id="GroupItemView">
        <h1>GroupItem</h1>
        <Docs {...GroupItemDocs} />
        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>{grid ? 'Grid' : 'List'} - Small</h2>
        {!grid && <p>Group name restricted to one line.</p>}
        {grid && <p>Group info hidden and a tooltip is displayed on hover.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={smallStyle}>
            <GroupItem
              thumbSize="small"
              grid={grid}
              showThumb
              showArrow
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...groups[0]}
            />
            <GroupItem
              onClick={this.handleClick}
              thumbSize="small"
              isActive
              showThumb
              showArrow
              grid={grid}
              {...groups[1]}
            />
            <GroupItem
              note="I have no anchor tag"
              thumbSize="small"
              grid={grid}
              noLink
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...groups[2]}
            />
            <GroupItem
              thumbSize="small"
              grid={grid}
              showAdmin
              showEdit
              showUnlink
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...groups[3]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Medium</h2>
        {!grid && <p>Group name restricted to two lines.</p>}
        {grid && <p>Group name is restricted to two lines.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={mediumStyle}>
            <GroupItem
              thumbSize="medium"
              showThumb
              showArrow
              grid={grid}
              onClick={this.handleClick}
              {...groups[0]}
            />
            <GroupItem
              thumbSize="medium"
              isActive
              showThumb
              showArrow
              grid={grid}
              onClick={this.handleClick}
              {...groups[1]}
            />
            <GroupItem
              note="I have no anchor tag"
              thumbSize="medium"
              showArrow
              grid={grid}
              noLink
              onClick={this.handleClick}
              {...groups[2]}
            />
            <GroupItem
              note="I am a normal Group"
              thumbSize="medium"
              showArrow
              grid={grid}
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...groups[3]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Large</h2>
        {!grid && <p>Group name is restricted to three lines.</p>}
        {grid && <p>Group name is restricted to two line.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={largeStyle}>
            <GroupItem
              thumbSize="large"
              showThumb
              showArrow
              grid={grid}
              onClick={this.handleClick}
              {...groups[0]}
            />
            <GroupItem
              thumbSize="large"
              grid={grid}
              isActive
              showThumb
              showArrow
              onClick={this.handleClick}
              {...groups[1]}
            />
            <GroupItem
              grid={grid}
              thumbSize="large"
              showArrow
              noLink
              onClick={this.handleClick}
              {...groups[2]}
            />
            <GroupItem
              grid={grid}
              thumbSize="large"
              showArrow
              onClick={this.handleClick}
              {...groups[3]}
            />
          </div>
        </ComponentItem>

        <h2>Admin list - all users item</h2>
        <ComponentItem style={{ width: width }}>
          <GroupItem
            thumbSize="small"
            showThumb={false}
            showAdmin
            showGlobalAvatar
            showBulkUpload
            showUserDefault

            id={0}
            name={'All users'}
            type={'group'}
            childCount={20}

            onClick={this.handleClick}
            onBulkUploadClick={() => {}}
            onUserDefaultsClick={() => {}}
          />
        </ComponentItem>

        <h2>AdminGroupSettings</h2>
        <Docs {...AdminGroupSettingsDocs} />
        <ComponentItem>
          <AdminGroupSettings
            group={this.state.group}
            showSave
            showRemove
            isLoading={this.state.isSaveLoading}
            onSaveClick={() => {
              console.log('Saving...')
              this.setState({ isSaveLoading: true });
              setTimeout(() => {
                this.setState({ isSaveLoading: false });
              }, 900);
            }}
            onRemoveClick={() => { console.log('Removing...') }}
            onChange={this.handleAdminChange}
          />
        </ComponentItem>

        <h2>AdminGroupAdd</h2>
        <Docs {...AdminGroupAddDocs} />
        <ComponentItem>
          <AdminGroupAdd
            list={groups}
            showAdd
            isLoading={this.state.isSaveLoading}
            onAddClick={() => {
              console.log('Saving...')
              this.setState({ isSaveLoading: true });
              setTimeout(() => {
                this.setState({ isSaveLoading: false });
              }, 900);
            }}
            onChange={this.handlePermissionChange}
            onCancel={this.handleCancel}
          />
        </ComponentItem>
      </section>
    );
  }
}
