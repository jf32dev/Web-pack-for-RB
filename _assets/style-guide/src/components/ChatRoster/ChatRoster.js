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

/* eslint-disable react/no-will-update-set-state */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import List from 'react-virtualized/dist/commonjs/List';

import Blankslate from 'components/Blankslate/Blankslate';
import ChatRosterItem from './ChatRosterItem';
import Text from 'components/Text/Text';

/**
 * Displays a sorted list of Chat Users.
 * Uses <code>react-virtualized</code> to render list items.
 */
export default class ChatRoster extends PureComponent {
  static propTypes = {
    activeUserId: PropTypes.number,

    /** user objects with messages array */
    roster: PropTypes.array,
    sortBy: PropTypes.oneOf(['name', 'time']),
    noteType: PropTypes.oneOf(['message', 'email']),

    showSearch: PropTypes.bool,

    /** Use react-virtualized to render list - dimensions of list must be known */
    virtualized: PropTypes.bool,

    /** Passed to <code>react-virtualized</code> */
    height: function(props) {
      if (props.virtualized && typeof props.height !== 'number') {
        return new Error('height is required when virtualized is provided.');
      }
      return null;
    },

    /** Passed to <code>react-virtualized</code> */
    rowHeight: function(props) {
      if (props.virtualized && typeof props.rowHeight !== 'number') {
        return new Error('rowHeight is required when virtualized is provided.');
      }
      return null;
    },

    /** Passed to <code>react-virtualized</code> */
    width: function(props) {
      if (props.virtualized && typeof props.width !== 'number') {
        return new Error('width is required when virtualized is provided.');
      }
      return null;
    },

    onEmptyActionClick: PropTypes.func,
    onUserClick: PropTypes.func.isRequired,

    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    roster: [],
    sortBy: 'name',
    noteType: 'message',
    strings: {
      rosterEmptyHeading: 'Message a colleague',
      rosterEmptyMessage: 'You can instantly message someone within your organisation. Find out details on a new project or just work out lunch plans.',
      rosterEmptyActionText: 'Start a conversation',
      noResults: 'No Results',
      search: 'Search'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedRoster: this.sortRoster(this.props.roster, this.props.sortBy),
      searchValue: '',
      scrollToIndex: 0
    };
    autobind(this);

    // refs
    this.users = {};
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.roster !== this.props.roster || nextProps.sortBy !== this.props.sortBy) {
      let sortedRoster = this.sortRoster(nextProps.roster, nextProps.sortBy);
      if (this.state.searchValue) {
        sortedRoster = this.filterRoster(sortedRoster, this.state.searchValue);
      }
      this.setState({ sortedRoster: sortedRoster });
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // filter roster when searching
    if (nextState.searchValue !== this.state.searchValue) {
      const filteredRoster = this.filterRoster(nextProps.roster, nextState.searchValue);
      this.setState({ sortedRoster: filteredRoster });

    // scroll to active user
    } else if (nextProps.activeUserId && nextProps.activeUserId !== this.props.activeUserId) {
      const index = nextState.sortedRoster.findIndex(u => u.id === nextProps.activeUserId);
      if (index > -1) {
        this.setState({
          scrollToIndex: index
        });
      }
    }
  }

  sortRoster(roster, sortBy) {
    if (sortBy === 'name') {
      return this.sortRosterByName(roster);
    }
    return this.sortRosterByTime(roster);
  }

  // Sort roster by recipient name
  sortRosterByName(roster) {
    const sortedRoster = roster.slice(0).sort(function(a, b) {
      return typeof a.name === 'string' && a.name.localeCompare(b.name);
    });
    return sortedRoster;
  }

  // Sort roster by message time (newest first and empty messages on top)
  sortRosterByTime(roster) {
    const sortedRoster = roster.slice(0).sort(function(b, a) {
      if (a.messages.length && b.messages.length) {
        return a.messages[a.messages.length - 1].time - b.messages[b.messages.length - 1].time;
      } else if (a.messages.length && !b.messages.length) {
        return -1;
      } else if (a.messages.length && b.messages.length) {
        return 0;
      }
      return 1;
    });
    return sortedRoster;
  }

  // Filter roster by name
  filterRoster(roster, name) {
    const filteredRoster = roster.slice(0).filter(function(user) {
      return user.name && user.name.toLowerCase().indexOf(name) > -1;  // ignore case
    });
    const sortedFilteredRoster = this.sortRosterByName(filteredRoster);
    return sortedFilteredRoster;
  }

  handleSearchChange(event) {
    this.setState({ searchValue: event.target.value.toLowerCase() });  // ignore case
  }

  renderRegularList() {
    const { sortedRoster } = this.state;

    return (
      <ul>
        {sortedRoster.map(user => (
          user.name && <li key={'rosterUser-' + user.id}>
            <ChatRosterItem
              ref={user.id}
              isActive={user.id === this.props.activeUserId}
              noteType={this.props.noteType}
              onClick={this.props.onUserClick}
              {...user}
            />
          </li>
        ))}
      </ul>
    );
  }

  renderVirtualizedList() {
    const { sortedRoster } = this.state;
    const styles = require('./ChatRoster.less');

    return (
      <List
        height={this.props.height}
        rowCount={sortedRoster.length}
        rowHeight={this.props.rowHeight}
        rowRenderer={this.renderVirtualItem}
        scrollToIndex={this.state.scrollToIndex}
        width={this.props.width}
        className={styles.virtualizedList}
      />
    );
  }

  renderVirtualItem(props) {
    const {
      index,
      //isScrolling,
      //isVisible,
      key,
      //parent,
      style
    } = props;
    const user = this.state.sortedRoster[index];

    return (
      <div key={key} style={style}>
        <ChatRosterItem
          ref={(c) => { this.users[user.id] = c; }}
          active={user.id === this.props.activeUserId}
          noteType={this.props.noteType}
          onClick={this.props.onUserClick}
          {...user}
        />
      </div>
    );
  }

  render() {
    const {
      roster,
      showSearch,
      virtualized,
      strings,
      onEmptyActionClick
    } = this.props;
    const { sortedRoster } = this.state;
    const styles = require('./ChatRoster.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatRoster: true,
      empty: !sortedRoster.length
    }, this.props.className);

    if (!roster.length) {
      return (
        <div className={classes}>
          <Blankslate
            heading={strings.rosterEmptyHeading}
            message={strings.rosterEmptyMessage}
            middle
          >
            {onEmptyActionClick && <p className={styles.emptyAction} onClick={onEmptyActionClick}>{strings.rosterEmptyActionText}</p>}
          </Blankslate>
        </div>
      );
    }

    const listRenderFunc = virtualized ? this.renderVirtualizedList : this.renderRegularList;

    return (
      <div className={classes}>
        {showSearch && <div className={styles.searchWrap}>
          <Text
            placeholder={strings.search}
            icon="search"
            value={this.state.searchValue}
            onChange={this.handleSearchChange}
          />
        </div>}
        {!sortedRoster.length && <Blankslate
          icon="chat"
          message={strings.noResults}
          middle
        />}
        {sortedRoster.length > 0 && listRenderFunc()}
      </div>
    );
  }
}
