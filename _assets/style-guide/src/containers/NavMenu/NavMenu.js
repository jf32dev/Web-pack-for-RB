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

import NavMenu from 'components/NavMenu/NavMenu';

const NavMenuDocs = require('!!react-docgen-loader!components/NavMenu/NavMenu.js');

export default class NavMenuView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUrl: '',
      lastClick: null
    };
    autobind(this);
  }

  handleNavItemClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    this.setState({
      selectedUrl: href,
      lastClick: href
    });
  }

  render() {
    const { selectedUrl, lastClick } = this.state;
    const menuList = [
      { name: 'General', url: '/settings/general', icon: 'gear' },
      { name: 'Interest Area', url: '/settings/interest-area', icon: 'copy' },
      { name: 'Notifications', url: '/settings/notifications', icon: 'notifications' },
      { name: 'Manage Subscriptions', url: '/settings/subscriptions', icon: 'subscription' },
      { name: 'Contact Support', url: '/settings/support', icon: 'email' },
      { name: 'Legal', url: '/settings/legal', icon: 'document' },
    ];

    return (
      <section id="NavMenuView">
        <h1>NavMenu</h1>
        <Docs {...NavMenuDocs} />

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>Vertical with icons</h2>
        <p>Side navigation for switching between pages.</p>
        <ComponentItem style={{ width: 320 }}>
          <NavMenu
            list={menuList}
            selectedUrl={selectedUrl}
            onItemClick={this.handleNavItemClick}
          />
        </ComponentItem>

        <h2>Horizontal</h2>
        <p>Used for navigation within sections of a pages.</p>
        <ComponentItem>
          <NavMenu
            list={menuList}
            selectedUrl={selectedUrl}
            horizontal
            onItemClick={this.handleNavItemClick}
          />
        </ComponentItem>

        <h2>Horizontal (secondary)</h2>
        <p>A secondary navigation required for navigating a sub-section of a page.</p>
        <ComponentItem>
          <NavMenu
            list={menuList}
            selectedUrl={selectedUrl}
            horizontal
            secondary
            onItemClick={this.handleNavItemClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
