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

import DropMenu from 'components/DropMenu/DropMenu';
import CreateMenu from 'components/CreateMenu/CreateMenu';
import ProfileMenu from 'components/ProfileMenu/ProfileMenu';
import AddFileMenu from 'components/AddFileMenu/AddFileMenu';
import ShareMenu from 'components/ShareMenu/ShareMenu';

const DropMenuDocs = require('!!react-docgen-loader!components/DropMenu/DropMenu.js');
const CreateMenuDocs = require('!!react-docgen-loader!components/CreateMenu/CreateMenu.js');
const ProfileMenuDocs = require('!!react-docgen-loader!components/ProfileMenu/ProfileMenu.js');
const AddFileMenuDocs = require('!!react-docgen-loader!components/AddFileMenu/AddFileMenu.js');
const ShareMenuDocs = require('!!react-docgen-loader!components/ShareMenu/ShareMenu.js');

const users = require('../../static/users.json');

export default class DropMenuView extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const type = event.currentTarget.dataset.type;

    if (href) console.log(href);
    if (type) console.log(type);
  }
  handleSelectClick(context) {
    console.log(context);
  }

  handleProfileButtonClick() {
    console.log('Sign out!');
  }

  render() {
    return (
      <section id="DropMenuView">
        <h1>DropMenu</h1>
        <Docs {...DropMenuDocs} />

        <h2>Examples</h2>
        <ComponentItem>
          <DropMenu
            heading="Full width menu"
            icon="plus"
            position={{ left: 0, right: 0 }}
          >
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          </DropMenu>
          <br />
          <DropMenu
            heading="Menu with fixed width"
            icon="search"
            position={{ left: 0, right: 0 }}
            style={{ width: 200 }}
          >
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          </DropMenu>
          <br />
          <DropMenu
            heading="Button Style"
            button
            position={{ left: 0, right: 0 }}
          >
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          </DropMenu>
        </ComponentItem>

        <h2>CreateMenu</h2>
        <Docs {...CreateMenuDocs} />
        <ComponentItem>
          <CreateMenu
            draft
            form
            note
            quicklink
            share
            story
            web
            onAnchorClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h2>ProfileMenu</h2>
        <Docs {...ProfileMenuDocs} />
        <ComponentItem>
          <ProfileMenu
            user={users[3]}
            onAnchorClick={this.handleAnchorClick}
            onButtonClick={this.handleProfileButtonClick}
          />
        </ComponentItem>

        <h2>AddFileMenu</h2>
        <Docs {...AddFileMenuDocs} />
        <ComponentItem>
          <AddFileMenu
            desktop
            file
            form
            web
            cloud
            onItemClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h2>ShareMenu</h2>
        <Docs {...ShareMenuDocs} />
        <ComponentItem>
          <ShareMenu
            service="Saleforce"
            onClick={this.handleSelectClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
