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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchList from 'components/SearchList/SearchList';
import Text from 'components/Text/Text';

export default class PeopleList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    loadingMore: PropTypes.bool,
    error: PropTypes.object,

    searchValue: PropTypes.string,

    strings: PropTypes.object,

    onUserClick: PropTypes.func,
    onCallClick: PropTypes.func,
    onChatClick: PropTypes.func,
    onFollowClick: PropTypes.func,

    onSearchChange: PropTypes.func,
    onSearchClearClick: PropTypes.func,

    onScroll: PropTypes.func
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    strings: {
      searchPlaceholder: 'No results found',
      emptyHeading: 'No results found',
      emptyMessage: 'Your search criteria returned no matched results. Please try again.'
    }
  };

  render() {
    const {
      list,
      searchValue,
      strings,
      onCallClick,
      onChatClick
    } = this.props;
    const { user } = this.context.settings;
    const style = require('./PeopleList.less');

    return (
      <div className={style.searchContainer}>
        <div className={style.keywordWrap}>
          <Text
            icon="search"
            tabIndex={1}
            placeholder={strings.searchPlaceholder}
            value={searchValue}
            showClear
            onChange={this.props.onSearchChange}
            onClearClick={this.props.onSearchClearClick}
            className={style.keywordInput}
          />
        </div>
        <SearchList
          list={list}
          currentUser={user}
          loading={this.props.loading}
          loadingMore={this.props.loadingMore}
          error={this.props.error}
          showThumb
          showFollow
          itemProps={{
            showCall: typeof onCallClick === 'function',
            showChat: typeof onChatClick === 'function',
            onCallClick: onCallClick,
            onChatClick: onChatClick
          }}
          onItemClick={this.props.onUserClick}
          onFollowClick={this.props.onFollowClick}
          emptyHeading={strings.emptyHeading}
          emptyMessage={strings.emptyMessage}
          onScroll={this.props.onScroll}
          className={style.searchResults}
        />
      </div>
    );
  }
}
