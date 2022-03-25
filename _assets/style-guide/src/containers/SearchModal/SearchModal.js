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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import { Btn, SearchModal, WebsiteModal } from 'components';

const SearchModalDocs = require('!!react-docgen-loader!components/SearchModal/SearchModal.js');

export default class SearchView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalSearchIsOpen: false,
      modalWebsiteIsOpen: false,
      searchValue: ''
    };
    autobind(this);
  }

  toggleModalSearch() {
    this.setState({ modalSearchIsOpen: !this.state.modalSearchIsOpen });
  }
  toggleModalWebsite() {
    this.setState({ modalWebsiteIsOpen: !this.state.modalWebsiteIsOpen });
  }

  handleSearchChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  render() {
    const searchData = {
      recent: [
        /*{keyword: 'Cloud Integration', type: 'stories'},
        {keyword: 'Strategic Influence', type: 'files'},
        {keyword: 'Marketing Materials 2015', type: 'feeds'},
        {keyword: 'On-site data manuals', type: 'stories'},
        {keyword: 'Servicing Records', type: 'stories'}*/
      ],
      popular: [
        { keyword: 'Business Enterprise in Australia', type: 'stories' },
        { keyword: 'Marketing Strategy Development', type: 'stories' },
        { keyword: 'General Meetings', type: 'meetings' },
        { keyword: 'Networking Industry Presentation', type: 'files' },
        { keyword: 'Visual Search Engine', type: 'stories' },
        { keyword: 'Online Marketplaces', type: 'stories' },
        { keyword: 'Search Engine Optimisation', type: 'stories' },
      ]
    };

    const websiteData = {
      id: 1,
      name: 'Test url',
      url: 'http://test1.com',
    };

    return (
      <section id="ModalView">
        <h1>SearchModal</h1>
        <Docs {...SearchModalDocs} />

        <ComponentItem>
          <Btn onClick={this.toggleModalSearch}>Launch SearchModal</Btn>
          <SearchModal
            {...searchData}
            placeholder="Search"
            searchValue={this.state.searchValue}
            onSearchInputChange={this.handleSearchChange}
            isVisible={this.state.modalSearchIsOpen}
            onClose={this.toggleModalSearch}
            emptyRecentHeading="No recent searches found"
            emptyPopularHeading="No popular searches found"
            backdropClosesModal
            onAnchorClick={() => {}}
            escClosesModal
          />
        </ComponentItem>

      {/* TODO: move to own container */ }
        <h3>Website Modal PropTypes</h3>
        <ul>
          <li><strong>recent</strong> <code>array</code> - List of Recent searches <code>{'keyword: text, type: stories'}</code></li>
          <li><strong>popular</strong> <code>array</code> - List of Popular searches <code>{'keyword: text, type: stories'}</code></li>
          <li><strong>placeholder</strong> <code>string</code></li>
          <li><strong>isVisible</strong> <code>bool</code></li>
          <li><strong>onKeyUp</strong> <code>func</code> - What to do when the user is typing on search field.</li>
          <li><strong>onCancel</strong> <code>func</code> - Handle cancel events on the modal; typically sets the open state to false</li>
          <li><strong>backdropClosesModal</strong> <code>bool</code> - clicking backdrop will dismiss modal</li>
          <li><strong>escClosesModal</strong> <code>bool</code> - ESC key will dismiss modal</li>
          <li><strong>emptyHeading</strong> <code>string</code> </li>
          <li><strong>emptyMessage</strong> <code>string</code> </li>
        </ul>

        <ComponentItem>
          <Btn onClick={this.toggleModalWebsite}>Launch WebsiteModal</Btn>
          <WebsiteModal
            {...websiteData}
            //onKeyUp={this.handleSearchChange}
            headerLabel={websiteData.id ? 'Edit Website' : 'Add Website'}
            isVisible={this.state.modalWebsiteIsOpen}
            onCancel={this.toggleModalWebsite}
            onClick={this.toggleModalWebsite}
            backdropClosesModal escClosesModal
          />
        </ComponentItem>
      </section>
    );
  }
}
