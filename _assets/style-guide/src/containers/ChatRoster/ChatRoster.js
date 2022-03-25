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
import Docs from '../../views/Docs';
import {
  Btn,
  ChatRoster,
} from 'components';

const ChatRosterDocs = require('!!react-docgen-loader!components/ChatRoster/ChatRoster.js');

const sampleRoster = require('../../static/roster.json');

export default class ChatRosterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortByExample: 'time',
      activeUserId: sampleRoster[0].id
    };
    autobind(this);
  }

  handleToggleSortClick(event) {
    event.preventDefault();
    let newSort = 'name';
    if (this.state.sortByExample === 'name') {
      newSort = 'time';
    }
    this.setState({ sortByExample: newSort });
  }

  handleRandomActiveUserClick() {
    const randomUser = sampleRoster[Math.floor(Math.random() * sampleRoster.length)];

    this.setState({
      activeUserId: randomUser.id
    });
  }

  handleExampleRosterUserClick(component, event) {
    event.preventDefault();
    this.setState({ activeUserId: parseInt(component.props.id, 10) });
  }

  render() {
    return (
      <section id="ChatRosterView">
        <h1>ChatRoster</h1>
        <Docs {...ChatRosterDocs} />
        <p><Btn onClick={this.handleToggleSortClick} small>Toggle Sort</Btn> ({this.state.sortByExample})</p>
        <p><Btn onClick={this.handleRandomActiveUserClick} small>Random Active User</Btn> ({this.state.activeUserId})</p>

        <ComponentItem style={{ height: 300, width: 400, overflow: 'hidden' }}>
          <ChatRoster
            activeUserId={this.state.activeUserId}
            roster={sampleRoster}
            sortBy={this.state.sortByExample}
            showSearch
            virtualized
            height={205}
            rowHeight={62}
            width={366}
            onUserClick={this.handleExampleRosterUserClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
