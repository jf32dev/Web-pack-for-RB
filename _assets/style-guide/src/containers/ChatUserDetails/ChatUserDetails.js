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
  ChatUserDetails,
} from 'components';

const ChatUserDetailsDocs = require('!!react-docgen-loader!components/ChatUserDetails/ChatUserDetails.js');

const sampleRoster = require('../../static/roster.json');

export default class ChatUserDetailsView extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event);
  }

  render() {
    return (
      <section id="ChatUserDetails">
        <h1>ChatUserDetails</h1>
        <Docs {...ChatUserDetailsDocs} />
        <ComponentItem>
          <ChatUserDetails
            user={sampleRoster[0]}
            note="Example note..."
            onAnchorClick={this.handleAnchorClick}
            onCallClick={this.handleAnchorClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
