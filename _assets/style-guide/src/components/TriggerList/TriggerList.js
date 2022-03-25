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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import List from 'components/List/List';

/**
 * Wraps a regular <code>List<code>.
 * Calls <code>onGetList()</code> on mount and scroll.
 */
export default class TriggerList extends PureComponent {
  static propTypes = {
    list: PropTypes.array,

    /** passed to <code>List</code> */
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    isLoadingMore: PropTypes.bool,
    isComplete: PropTypes.bool,
    error: PropTypes.object,

    /** passed to <code>List</code> */
    listProps: PropTypes.object,

    /** called on mount and list scroll */
    onGetList: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleListScroll = this.handleListScroll.bind(this);

    // refs
    this.list = null;
  }

  UNSAFE_componentWillMount() {
    this.props.onGetList(0);
  }

  handleListScroll(event) {
    const target = event.target;
    const { isLoadingMore, isComplete } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    if (scrollBottom >= loadTrigger && !isLoadingMore) {
      // Load more list
      if (!isComplete) {
        this.props.onGetList(this.props.list.length);
      }
    }
  }

  render() {
    const {
      list,
      isLoaded,
      isLoading,
      error,
      baseColour,
    } = this.props;

    return (
      <List
        list={list}
        ref={(c) => { this.list = c; }}
        loading={!error && !isLoaded && isLoading}
        loadingMore={isLoaded && isLoading}
        error={error}
        onScroll={this.handleListScroll}
        {...this.props.listProps}
        {...{ baseColour }}
      />
    );
  }
}
