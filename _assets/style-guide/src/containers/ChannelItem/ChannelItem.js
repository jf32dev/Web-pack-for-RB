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

import ChannelItem from 'components/ChannelItem/ChannelItem';
import ChannelSettings from 'components/ChannelSettings/ChannelSettings';
import AdminChannelSettings from 'components/Admin/AdminChannelSettings/AdminChannelSettings';

const ChannelItemDocs = require('!!react-docgen-loader!components/ChannelItem/ChannelItem.js');
const ChannelSettingsDocs = require('!!react-docgen-loader!components/ChannelSettings/ChannelSettings.js');
const AdminChannelSettingsDocs = require('!!react-docgen-loader!components/Admin/AdminChannelSettings/AdminChannelSettings.js');

const channels = require('../../static/channels.json');

export default class ChannelItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      showCheckbox: false,
      width: 'auto',
      lastClick: null,

      channel: channels[0],
      sortOrder: 'date'
    };
    autobind(this);
  }

  handleClick(event, channel) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor ChannelItem
    if (!href) {
      this.setState({ lastClick: channel.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  handleEditClick(event) {
    event.preventDefault();
    this.setState({ lastClick: 'edit clicked' });
  }

  handleOptionChange(event) {
    const option = event.currentTarget.dataset.option;
    const checked = event.currentTarget.checked;

    this.setState({
      grid: checked,
      lastClick: option + ': ' + checked
    });
  }

  handleSortOrderChange(selected) {
    this.setState({
      sortOrder: selected.value,
      lastClick: 'sort order: ' + selected.value
    });
  }

  handleSubscribeClick() {
    const { channel } = this.state;
    this.setState({
      channel: {
        ...channel,
        isSubscribed: !channel.isSubscribed
      },
      lastClick: 'isSubscribed toggled'
    });
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleShowCheckbox() {
    this.setState({ showCheckbox: !this.state.showCheckbox });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  render() {
    const { grid, showCheckbox, width, lastClick } = this.state;

    return (
      <section id="ChannelItemView">
        <h1>ChannelItem</h1>
        <Docs {...ChannelItemDocs} />
        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={showCheckbox} onClick={this.handleToggleShowCheckbox}>showCheckbox</Btn>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem style={{ width: width }}>
          <ChannelItem
            {...channels[0]}
            grid={grid}
            showCheckbox={showCheckbox}
            showSubscribe
            thumbSize={grid ? 'large' : 'small'}
            onClick={this.handleClick}
            onSubscribeClick={this.handleClick}
          />
          <ChannelItem
            {...channels[1]}
            note="Example note..."
            grid={grid}
            showCheckbox={showCheckbox}
            showThumb
            showEdit
            thumbSize={grid ? 'large' : 'small'}
            isSelected
            onClick={this.handleClick}
          />
          <ChannelItem
            {...channels[2]}
            note="I have no anchor tag"
            grid={grid}
            showCheckbox={showCheckbox}
            isActive
            showAdmin
            showEdit
            showUnlink
            noLink
            showThumb
            thumbSize={grid ? 'large' : 'small'}
            onClick={this.handleClick}
          />
        </ComponentItem>

        <h2>ChannelSettings</h2>
        <Docs {...ChannelSettingsDocs} />
        <ComponentItem>
          <ChannelSettings
            channel={this.state.channel}
            sortOrder={this.state.sortOrder}
            isGrid={this.state.grid}
            onAnchorClick={this.handleClick}
            onEditClick={this.handleEditClick}
            onOptionChange={this.handleOptionChange}
            onSortOrderChange={this.handleSortOrderChange}
            onSubscribeClick={this.handleSubscribeClick}
          />
        </ComponentItem>

        <h2>AdminChannelSettings</h2>
        <Docs {...AdminChannelSettingsDocs} />
        <ComponentItem>
          <AdminChannelSettings
            channel={this.state.channel}
            sortOrder={this.state.sortOrder}
            onAnchorClick={this.handleClick}
            showSave
            showRemove
            onSaveClick={() => { console.log('Saving...'); }}
            onRemoveClick={() => { console.log('Removing...'); }}
            onOptionChange={() => { console.log('Changed'); }}
            onSortOrderChange={this.handleSortOrderChange}
            onSubscribeClick={this.handleSubscribeClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
