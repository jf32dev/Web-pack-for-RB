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
 * @package hub-web-app-v5
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { setModalState, setReferrerPath } from 'redux/modules/search';
import { searchTags } from 'redux/modules/tag';

import SearchModal from 'components/SearchModal/SearchModal';

const DEFAULT_TYPE = 'files';

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  popularSearches: { id: 'popular-searches', 'defaultMessage': 'Popular Searches' },
  recentSearches: { id: 'recent-searches', 'defaultMessage': 'Recent Searches' },
  tagSearches: { id: 'tag-searches', 'defaultMessage': 'Tag Searches' },
  noRelatedTags: { id: 'no-related-tags', 'defaultMessage': 'No related tags' }
});

@connect(state => {
  const { tag, search } = state;
  return {
    tags: tag.allTags,
    ...search
  };
},
bindActionCreatorsSafe({ setModalState, setReferrerPath, searchTags })
)
export default class SearchListener extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const path = this.context.router.route.location.pathname;
    const href = event.currentTarget.getAttribute('href');

    this.props.setReferrerPath(path);
    this.props.setModalState(false);
    this.context.router.history.push(href, { modal: true });
  }

  handleModalClose() {
    this.props.setModalState(false);
  }

  handleSearchChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  handleSearchKeyUp(event) {
    // Enter keycode
    if (event.keyCode === 13) {
      event.preventDefault();
      const path = this.context.router.route.location.pathname;
      this.props.setReferrerPath(path);
      this.props.setModalState(false);
      this.context.router.history.push({
        pathname: '/search',
        query: { keyword: this.state.searchValue, type: DEFAULT_TYPE },
        state: { modal: true }
      });
    }
    if (this.state.searchValue !== '') {
      this.props.searchTags({
        keyword: this.state.searchValue
      });
    }
  }

  handleTagSelected(tag) {
    const path = this.context.router.route.location.pathname;
    this.props.setReferrerPath(path);
    this.context.router.history.push({
      pathname: '/search',
      query: { keyword: tag.name, type: DEFAULT_TYPE, refType: 'tag' },
      state: { modal: true }
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { tags } = this.props;
    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <SearchModal
        isVisible={this.props.isModalVisible}
        backdropClosesModal
        escClosesModal
        tags={tags}
        popular={this.props.popularSearches}
        recent={this.props.recentSearches}
        searchValue={this.state.searchValue}
        strings={strings}
        onAnchorClick={this.handleAnchorClick}
        onClose={this.handleModalClose}
        onSearchInputChange={this.handleSearchChange}
        onSearchKeyUp={this.handleSearchKeyUp}
        onTagSelected={this.handleTagSelected}
      />
    );
  }
}
