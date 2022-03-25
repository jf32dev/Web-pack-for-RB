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
import BroadcastLogin from 'components/Broadcast/BroadcastLogin';
import Broadcast from 'components/Broadcast/Broadcast';
import Docs from '../../views/Docs';
import Debug from '../../views/Debug';

const BroadcastLoginDocs = require('!!react-docgen-loader!components/Broadcast/BroadcastLogin.js');
const BroadcastDocs = require('!!react-docgen-loader!components/Broadcast/Broadcast.js');

const btcp = require('../../static/btcp.json');

export default class BroadcastView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: null,
    };

    this.status = {
      active: true,
      passwordRequired: false,
      name: 'Tim Wang',
      thumbnail: ''
    };

    autobind(this);
  }

  handleLogin(name, pwd) {
    this.setState({ lastClick: `name: ${name}; pwd: ${pwd}` });
  }

  handleClick(event) {
    this.setState({ lastClick: event.currentTarget.dataset.action });
  }

  render() {
    const { lastClick } = this.state;

    return (
      <section id="BlankView">
        <h1>Broadcast</h1>
        <Docs {...BroadcastLoginDocs} />
        <Debug>
          <div>
            <code>onLogin: {lastClick}</code>
          </div>
        </Debug>
        <ComponentItem>
          <BroadcastLogin {...this.status} onLogin={this.handleLogin} />
        </ComponentItem>
        <ComponentItem>
          <BroadcastLogin {...Object.assign({}, this.status, { passwordRequired: true })} onLogin={this.handleLogin} />
        </ComponentItem>
        <ComponentItem>
          <BroadcastLogin {...Object.assign({}, this.status, { active: false })} onLogin={this.handleLogin} />
        </ComponentItem>
        <Docs {...BroadcastDocs} />
        <ComponentItem style={{ height: '500px', background: 'black' }}>
          <Broadcast
            broadcast={btcp}
            htmlCode=""
            onClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
