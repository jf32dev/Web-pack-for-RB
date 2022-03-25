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
import { Btn, WebItemLegacy, WebItem } from 'components';

const WebItemDocs = require('!!react-docgen-loader!components/WebItemLegacy/WebItemLegacy.js');

export default class WebItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({ lastClick: event.currentTarget.getAttribute('href') });
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  render() {
    const { grid, lastClick } = this.state;

    return (
      <section id="WebItemView">
        <h1>WebItem</h1>
        <Docs {...WebItemDocs} />

        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
          </div>
          <div>
            <code>{lastClick}</code>
          </div>
        </Debug>

        <h2>{grid ? 'Grid' : 'List'}</h2>
        <ComponentItem>
          <WebItemLegacy
            id={1}
            name="Another website"
            url="http://www.test.com"
            isPersonal
            thumbnail="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg"
            grid={grid}
            onClick={this.handleClick}
          />
          <WebItemLegacy
            id={2}
            name="My personal Website"
            url="http://myreallylongwebsitenameiswearthisthinggoesonforquiteawhileiwonderifthereisamaximum.com/au/cooltesterguy/one/two/three/four/five/six/seven/eleven"
            showUrl
            showEdit
            grid={grid}
            onClick={this.handleClick}
          />
          <WebItem
            id={3}
            name="youtube test"
            url="https://www.youtube.com"
            thumbnail="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg"
            onClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
