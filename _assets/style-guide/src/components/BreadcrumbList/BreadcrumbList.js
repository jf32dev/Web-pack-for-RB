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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import _debounce from 'lodash/debounce';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import DropMenu from 'components/DropMenu/DropMenu';
import TriggerList from 'components/TriggerList/TriggerList';
import Text from 'components/Text/Text';

/**
 * Convenience wrapper for <code>Breadcrumbs</code>, <code>TriggerList</code> and <code>DropMenu</code>.
 * Supports multiple lists (max 2) and transitions between them.
 */
export default class BreadcrumbList extends PureComponent {
  static propTypes = {
    /** Index of active list */
    activeList: PropTypes.number,

    /** Disable animations */
    disableAnimation: PropTypes.bool,

    /** Array of valid list props for <code>TriggerList</code> */
    lists: PropTypes.array.isRequired,

    /** Pass a component to render in <code>DropMenu</code> */
    menuComponent: PropTypes.node,

    /** Position prop for <code>DropMenu</code> */
    menuPosition: PropTypes.shape({
      top: PropTypes.string,
      right: PropTypes.string,
      botttom: PropTypes.string,
      left: PropTypes.string
    }),

    /** Valid path objects, passed to Breadcrumbs */
    paths: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })).isRequired,

    /** List width must be set if using animations */
    width: function(props) {
      if (!props.disableAnimation && (!props.width && typeof width !== 'number')) {
        return new Error('`width` must be provided if `disableAnimation` is false');
      }
      return null;
    },

    /** Pass all strings as key/value pairs */
    strings: PropTypes.object,

    /** Breadcrumbs onPathClick */
    onPathClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object,
    hasFilter: PropTypes.bool,
    onTabSearch: function(props) {
      if (props.hasFilter && typeof props.onTabSearch !== 'function') {
        return new Error('onTabSearch is required when hasFilter is provided.');
      }
      return null;
    },
    onChannelSearch: function(props) {
      if (props.hasFilter && typeof props.onChannelSearch !== 'function') {
        return new Error('onChannelSearch is required when hasFilter is provided.');
      }
      return null;
    },
  };

  static defaultProps = {
    activeList: 0,
    disableAnimation: false,
    lists: [],
    menuComponent: null,
    menuPosition: {
      left: '-5rem',
      right: 'inherit'
    },
    paths: [],
    width: null,
    strings: {
      name: 'Name',
      storyCount: 'Story count',
      date: 'Date',
      title: 'Title',
      priority: 'Priority',
      likes: 'Likes',
      mostRead: 'Most read',
      leastRead: 'Least read',
      authorFirstName: 'Author first name',
      authorLastName: 'Author last name',
      contentIq: 'Content IQ',
      filterTabs: 'Filter Tabs',
      filterChannels: 'Filter Channels'
    },
    hasFilter: false,
    tabSearchTerm: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      shouldAnimate: false,
      tabFilterTerm: props.tabSearchTerm,
      channelFilterTerm: ''
    };

    autobind(this);

    this.handleFilterTermChange = _debounce(this.handleFilterTermChange.bind(this), 300);

    // refs
    this.dropmenu = null;
    this.list = [];
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Determine if animations should occur
    if (!this.props.disableAnimation && !this.state.shouldAnimate) {
      if (this.props.activeList === 0 && nextProps.activeList === 1) {
        this.setState({ shouldAnimate: true });
      } else if (this.props.activeList === 1 && nextProps.activeList === 0) {
        this.setState({ shouldAnimate: true });
      }
    }
    if (this.props.activeList === 1 && this.state.channelFilterTerm !== '' && this.props.clearChannelFilter) {
      this.props.onToggleClearChannelFilter(false);
      this.setState({
        channelFilterTerm: ''
      });
    }
  }

  handlePathClick(event) {
    event.preventDefault();

    // Propagate event if clicking anchor
    if (event.currentTarget.getAttribute('href')) {
      this.props.onPathClick(event);
      this.setState({ channelFilterTerm: '' });

      // Trigger DropMenu when clickkng non-anchor
    } else if (event.currentTarget.dataset.path) {
      if (this.dropmenu && this.dropmenu.refs.dropmenu) {
        this.dropmenu.refs.dropmenu.click();
      }
    }
  }

  renderList(list, index) {
    const { width, disableAnimation, tabSearchTerm, channelSearchTerm, baseColour } = this.props;
    const listStyle = {
      ...list.listProps.style,
      width: width,
      left: (!disableAnimation && this.state.shouldAnimate && index > 0) ? width : null
    };

    return (
      <TriggerList
        key={`list-${index}`}
        ref={(c) => { this.list[index] = c; }}
        {...list}
        listProps={{
          ...list.listProps,
          style: listStyle,
          searchTerm: index === 0 ? tabSearchTerm : channelSearchTerm
        }}
        {...{ baseColour }}
      />
    );
  }

  handleFilterTermChange(filterTerm) {
    this.handleGetTabChannelData(filterTerm);
  }

  handleChange(event) {
    const filterTerm = event.target.value;
    const filterType = event.target.getAttribute('data-type');
    this.setState({
      [filterType]: filterTerm
    }, () =>  {
      if (filterTerm.length >= 2) {
        this.handleFilterTermChange(filterTerm.trim());
      } else if (filterTerm.length === 0) {
        this.handleFilterTermChange();
      }
    });
  }

  handleFilterClear(filterType) {
    this.setState({
      [filterType]: ''
    }, () =>  this.handleGetTabChannelData());
  }

  handleGetTabChannelData(filterTerm = '') {
    const {
      activeList,
      onTabSearch,
      onChannelSearch,
    } = this.props;
    if (activeList === 0) {
      onTabSearch(0, filterTerm);
    } else {
      onChannelSearch(0, filterTerm);
    }
  }

  render() {
    const { shouldAnimate, tabFilterTerm, channelFilterTerm } = this.state;
    const {
      activeList,
      disableAnimation,
      lists,
      menuComponent,
      menuPosition,
      paths,
      width,
      hasFilter,
      strings,
    } = this.props;
    const styles = require('./BreadcrumbList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BreadcrumbList: true,
      hasDropMenu: !!menuComponent
    }, this.props.className);

    // Apply height/width if passed
    const style = {
      ...this.props.style,
      width: width || null
    };

    const listTransitionClasses = cx({
      transitionWrapper: true,
      animationsEnabled: (!disableAnimation && shouldAnimate) && lists.length > 1 && width,

      list0ActiveNoAnimate: (disableAnimation || !shouldAnimate) && activeList === 0,
      list1ActiveNoAnimate: (disableAnimation || !shouldAnimate) && activeList === 1,

      list0ActiveAnimate: (!disableAnimation && shouldAnimate) && activeList === 0 && width,
      list1ActiveAnimate: (!disableAnimation && shouldAnimate) && activeList === 1 && width
    });

    // Apply height/width if passed
    const listTransitionStyles = {
      width: width * lists.length || null
    };

    return (
      <div className={classes} style={style}>
        <header>
          <Breadcrumbs
            paths={paths}
            className={styles.breadcrumbs}
            onPathClick={this.handlePathClick}
          />
          {menuComponent && <DropMenu
            ref={(c) => { this.dropmenu = c; }}
            icon="triangle"
            position={menuPosition}
            className={styles.dropMenu}
          >
            {menuComponent}
          </DropMenu>}
        </header>
        {hasFilter && <Text
          icon="search"
          aria-label="search"
          placeholder={activeList === 0 && strings.filterTabs || strings.filterChannels}
          data-type={activeList === 0 && 'tabFilterTerm' || 'channelFilterTerm'}
          showClear={activeList === 0 ? tabFilterTerm.length > 0 : channelFilterTerm.length > 0}
          value={activeList === 0 ? tabFilterTerm : channelFilterTerm}
          onChange={this.handleChange}
          onClearClick={this.handleFilterClear.bind(this, activeList === 0 && 'tabFilterTerm' || 'channelFilterTerm')}
          className={styles.filterContent}
        />}
        <div className={styles.listWrapper}>
          <div
            className={listTransitionClasses}
            style={listTransitionStyles}
          >
            {this.renderList(lists[activeList], activeList)}
          </div>
        </div>
      </div>
    );
  }
}
