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

import RevisionItem from 'components/RevisionItem/RevisionItem';

const RevisionItemDocs = require('!!react-docgen-loader!components/RevisionItem/RevisionItem.js');

const revisions = require('../../static/revisions.json');

export default class RevisionItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 'auto',
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, form) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor RevisionItem
    if (!href) {
      this.setState({ lastClick: form.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  render() {
    const { width, lastClick } = this.state;

    return (
      <section id="RevisionItem">
        <h1>RevisionItem</h1>
        <p>Note: <code>RevisionItem</code> does not have a grid prop. If the <code>permId</code> matches <code>id</code>, the Published badge will render.</p>

        <Docs {...RevisionItemDocs} />
        <Debug>
          <div>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem style={{ width: width }}>
          <RevisionItem onClick={this.handleClick} showThumb {...revisions[0]} />
          <RevisionItem onClick={this.handleClick} showThumb {...revisions[1]} />
          <RevisionItem onClick={this.handleClick} showThumb {...revisions[2]} />
        </ComponentItem>
      </section>
    );
  }
}
