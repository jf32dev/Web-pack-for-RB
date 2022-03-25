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
 * @author Rubenson Barrios <ruebnson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import ComponentItem from '../../views/ComponentItem';

import Praises from 'components/Praises/Praises';

const samplePraises = require('../../static/praises.json');

export default class PraisesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: {
        'id': 200,
        'type': 'people',
        'name': 'Rubenson Barrios',
        'thumbnail': 'https://push.bigtincan.org/f/Dm9jEkGXJpW6KRWbN5O0/avatar/f8f81f2d481420510651d0ced2fd296a933e87063364ce007cb9ff3b99cfe5b7.png',
        'role': 'Web Developer',
        'isFollowed': false
      },
      praises: samplePraises,
      showingPraises: samplePraises.slice(-3),
      showAllPraises: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleAddPraise = this.handleAddPraise.bind(this);
    this.handleDeletePraise = this.handleDeletePraise.bind(this);
  }

  onShowMore() {
    this.setState({
      showAllPraises: true,
      showingPraises: this.state.praises,
    });
  }

  handleAddPraise(praise) {
    const currentUser = this.state.currentUser;
    const time = Math.round(new Date().getTime() / 1000);
    const id = time;
    const praises = this.state.showAllPraises ? this.state.praises : this.state.praises.slice(-3);

    this.setState({
      praises: Object.assign([], this.state.praises).concat([{ id: id, time: time, message: praise, praisedBy: currentUser }]),
      showingPraises: Object.assign([], praises).concat([{ id: id, time: time, message: praise, praisedBy: currentUser }])
    });
  }

  handleDeletePraise() {

  }

  handleClick(e) {
    console.log(e.target.value);
  }

  render() {
    return (
      <section id="ModalView">
        <h1>Praises</h1>
        <p>TODO: Fix examples and update docs.</p>

        <h3>PropTypes</h3>
        <ul>
          <li><strong>praises</strong> <code>array</code> - List of Praises <code>id, message, time, praisedBy (User obj)</code></li>
          <li><strong>canAddPraise</strong> <code>bool</code></li>
          <li><strong>canDeletePraise</strong> <code>bool</code> - Admins can delete praises from another user</li>
          <li><strong>onAddPraise</strong> <code>func</code></li>
          <li><strong>onDeletePraise</strong> <code>func</code></li>
          <li><strong>onUserClick</strong> <code>func</code></li>
          <li><strong>onKeyUp</strong> <code>func</code> </li>
          <li><strong>emptyHeading</strong> <code>string</code> </li>
          <li><strong>emptyMessage</strong> <code>string</code> </li>
          <li><strong>deleteLabel</strong> <code>string</code> </li>
          <li><strong>cancelLabel</strong> <code>string</code> </li>
          <li><strong>confirmDeleteMessage</strong> <code>string</code> </li>
        </ul>

        <ComponentItem>
          <h4>Praises
            {!this.state.showAllPraises && this.state.showingPraises.length > 0 &&
              <span style={{ color: '#f26724', marginLeft: '20px', cursor: 'pointer' }} onClick={::this.onShowMore}>More...</span>
            }
          </h4>
          <Praises
            praises={this.state.showingPraises}
            onUserClick={this.handleClick}
            onAddPraise={this.handleAddPraise}
            onDeletePraise={this.handleDeletePraise}
            canDeletePraise
            canAddPraise
          />
        </ComponentItem>
      </section>
    );
  }
}
