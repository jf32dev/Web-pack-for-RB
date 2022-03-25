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
import { PromptItem } from 'components';

const PromptItemDocs = require('!!react-docgen-loader!components/PromptItem/PromptItem.js');

export default class PromptsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastEvent: null
    };

    autobind(this);
  }

  handleDismiss(event, id) {
    this.setState({
      lastEvent: 'onDismiss: ' + id
    });
  }

  handleLinkClick(id, link) {
    this.setState({
      lastEvent: 'onLinkClick: ' + link
    });
  }

  render() {
    const { lastEvent } = this.state;

    return (
      <section id="PromptsView">
        <h1>Prompts</h1>
        <p>Prompts are used in various cases such as alerting the user when an action or error has occured.</p>

        <h2>PromptItem</h2>
        <Docs {...PromptItemDocs} />

        <Debug>
          {lastEvent && <div>
            <code>{lastEvent}</code>
          </div>}
        </Debug>

        <ComponentItem>
          <PromptItem
            id="example-1"
            type="success"
            title="Successfully created Story (clickable)"
            link="http://www.example.com"
            onLinkClick={this.handleLinkClick}
            onDismiss={this.handleDismiss}
          />
          <br />
          <br />
          <PromptItem
            id="example-2"
            type="info"
            title="Info"
            message="I will call onDismiss after 5 seconds."
            autoDismiss={5}
            dismissible
            onDismiss={this.handleDismiss}
          />
          <br />
          <br />
          <PromptItem
            id="example-3"
            type="warning"
            title="Warning"
            message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            dismissible
            onDismiss={this.handleDismiss}
          />
          <br />
          <br />
          <PromptItem
            id="example-4"
            type="error"
            title="Error"
            message="Story publishing failed"
            onDismiss={this.handleDismiss}
          />
          <br />
          <br />
          <PromptItem
            id="example-5"
            type="chat"
            title="Chat User"
            message="Message recieved..."
            link="/chat/9001"
            dismissible
            onLinkClick={this.handleLinkClick}
            onDismiss={this.handleDismiss}
          />
        </ComponentItem>
      </section>
    );
  }
}
