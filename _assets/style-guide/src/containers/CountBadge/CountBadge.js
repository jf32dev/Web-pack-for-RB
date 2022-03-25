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

import CountBadge from 'components/CountBadge/CountBadge';

const CountBadgeDocs = require('!!react-docgen-loader!components/CountBadge/CountBadge.js');

export default class CountBadgeView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  render() {
    return (
      <section id="CountBadgeView">
        <h1>CountBadge</h1>
        <Docs {...CountBadgeDocs} />

        <h2>Medium</h2>
        <ComponentItem>
          <CountBadge
            title="Three"
            value={3}
            href="#cool"
            onClick={this.handleAnchorClick}
          />
          <CountBadge
            title="Two Thousand"
            value={2000}
            href="#cool"
            onClick={this.handleAnchorClick}
          />
          <CountBadge
            title="12 Thousand"
            value={12000}
            href="#cool"
            onClick={this.handleAnchorClick}
          />
          <CountBadge
            title="Four Million"
            value={4000000}
            href="#cool"
            onClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h2>Large</h2>
        <ComponentItem>
          <CountBadge
            title="Three"
            value={3}
            href="#cool"
            size="large"
            onClick={this.handleAnchorClick}
          />
          <CountBadge
            title="Two Thousand"
            value={2000}
            href="#cool"
            size="large"
            onClick={this.handleAnchorClick}
          />
          <CountBadge
            title="12 Thousand"
            value={12000}
            href="#cool"
            size="large"
            onClick={this.handleAnchorClick}
          />
          <CountBadge
            title="Four Million"
            value={4000000}
            href="#cool"
            size="large"
            onClick={this.handleAnchorClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
