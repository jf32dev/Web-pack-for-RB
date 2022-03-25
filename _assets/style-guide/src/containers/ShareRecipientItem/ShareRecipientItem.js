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

import ShareRecipientItem from 'components/ShareRecipientItem/ShareRecipientItem';

const ShareRecipientItemDocs = require('!!react-docgen-loader!components/ShareRecipientItem/ShareRecipientItem.js');

const shares = require('../../static/shares.json');

export default class ShareRecipientItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, context) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor ShareRecipientItem
    if (!href) {
      this.setState({ lastClick: context.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  render() {
    const { lastClick } = this.state;
    const users = shares[0].users;

    return (
      <section id="ShareRecipientItemView">
        <h1>ShareRecipientItem</h1>
        <Docs {...ShareRecipientItemDocs} />
        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem>
          <ShareRecipientItem
            {...users[0]}
            rootUrl={'/share/' + shares[0].id}
            onClick={this.handleClick}
          />
          <ShareRecipientItem
            {...users[1]}
            rootUrl={'/share/' + shares[0].id}
            isActive
            onClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
