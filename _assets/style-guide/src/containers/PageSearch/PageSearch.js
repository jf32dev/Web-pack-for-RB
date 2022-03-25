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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <Rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import {
  Btn,
  PageSearchFileItem,
  PageSearchFilter,
  PageSearchInput,
  PageSearchStoryItem
} from 'components';

const PageSearchInputDocs = require('!!react-docgen-loader!components/PageSearchInput/PageSearchInput.js');
const PageSearchFileItemDocs = require('!!react-docgen-loader!components/PageSearchFileItem/PageSearchFileItem.js');
const PageSearchStoryItemDocs = require('!!react-docgen-loader!components/PageSearchStoryItem/PageSearchStoryItem.js');

const staticFiles = require('static/filesSearch.json');
const staticStory = require('static/storiesSearch.json');
const channels = require('static/channels.json');

export default class PageSearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      searchType: 'all',
      isChecked: false,
      isSearchFilterOpen: false
    };
    autobind(this);
  }

  handleActionClick(action, file) {
    console.log(action, file.id);
  }

  handleCheckedChange(event) {
    this.setState({
      checked: event.currentTarget.checked
    });
  }

  handleSearchClick(query, filters) {
    console.log('Search is clicked');
  }

  handleSearchTypeChange(type) {
    this.setState({ searchType: type });
  }

  handleCheckboxChange(type) {
    this.setState({ isChecked: !this.state.isChecked });
  }

  handleOpenSearchFilter(data) {
    console.log(data);
    this.setState({ isSearchFilterOpen: !this.state.isSearchFilterOpen });
  }

  render() {
    return (
      <section id="BlockSearch">
        <h1>Page Search</h1>
        <p>Components for the 'Page' based search.</p>

        <h2>PageSearchInput</h2>
        <Docs {...PageSearchInputDocs} />

        <ComponentItem style={{
          backgroundImage: 'url(src/static/images/bg_blocksearch.jpg)',
          display: 'block',
          width: '100%',
          backgroundPosition: '0% 70%',
          backgroundSize: 'cover',
          padding: '5rem 0',
          justifyContent: 'center'
        }}
        >
          <PageSearchInput
            searchType={this.state.searchType}
            full
            suggestions={['test', 'data', 'testing', 'transfer', 'powerpoint', 'btca', 'login']}
            onSearchTypeChange={this.handleSearchTypeChange}
            onSearchClick={this.handleSearchClick}
            style={{ margin: 'auto' }}
          />
        </ComponentItem>

        <h2>PageSearch Open Modal Filter</h2>
        {/*<Docs {...PageSearchStoryItemDocs} />*/}
        <ComponentItem>
          <Btn
            inverted
            large
            onClick={this.handleOpenSearchFilter}
          >
            Open Search Filter
          </Btn>

          <PageSearchFilter
            escClosesModal
            backdropClosesModal
            locations={[...channels.slice(0, 6)]}
            width="medium"
            headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>Header</p>}
            footerChildren={(<div>
              <Btn alt large onClick={this.handleOpenSearchFilter}>Cancel</Btn>
            </div>)}
            onClose={this.handleOpenSearchFilter}
            isVisible={this.state.isSearchFilterOpen}
          />
        </ComponentItem>

        <h2>PageSearchStoryItem</h2>
        <Docs {...PageSearchStoryItemDocs} />

        <ComponentItem>
          <PageSearchStoryItem
            {...staticStory[2]}
            onClick={this.handleActionClick}
          />
          <PageSearchStoryItem
            {...staticStory[3]}
            onClick={this.handleActionClick}
          />
        </ComponentItem>

        <h2>PageSearchFileItem</h2>
        <Docs {...PageSearchFileItemDocs} />

        <ComponentItem>
          <PageSearchFileItem
            {...staticFiles[0]}
            showContentApprovedBadge
            canAddToCanvas
            isGrid
            showOpenStackBtn
            onClick={this.handleActionClick}
          />
          <PageSearchFileItem
            {...staticFiles[6]}
            isChecked={this.state.isChecked}
            isGrid
            isSelectModeEnabled
            canAddToCanvas
            onClick={this.handleActionClick}
            onCheckboxChange={this.handleCheckboxChange}
          />
          <PageSearchFileItem
            {...staticFiles[1]}
            isGrid
            isSelectModeEnabled
            showContentApprovedBadge
            onClick={this.handleActionClick}
          />
          <PageSearchFileItem
            {...staticFiles[4]}
            isGrid
            canAddToCanvas
            showContentApprovedBadge
            onClick={this.handleActionClick}
          />
          <PageSearchFileItem
            {...staticFiles[5]}
            isGrid
            canAddToCanvas
            onClick={this.handleActionClick}
          />
          <PageSearchFileItem
            {...staticFiles[0]}
            showContentApprovedBadge
            onClick={this.handleActionClick}
          />
          <PageSearchFileItem
            {...staticFiles[6]}
            onClick={this.handleActionClick}
          />
          <PageSearchFileItem
            {...staticFiles[1]}
            showContentApprovedBadge
            onClick={this.handleActionClick}
          />
          <PageSearchFileItem
            {...staticFiles[4]}
            showContentApprovedBadge
            onClick={this.handleActionClick}
          />
          <PageSearchFileItem
            {...staticFiles[5]}
            onClick={this.handleActionClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
