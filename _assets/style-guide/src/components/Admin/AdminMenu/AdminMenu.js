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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import MenuItem from './MenuItem';

export default class AdminMenu extends PureComponent {
  static propTypes = {
    /** Index of active list */
    activeList: PropTypes.number,

    /** Array of menu list */
    lists: PropTypes.array.isRequired,

    /** Valid root URL <code>/admin</code> */
    basePath: PropTypes.string.isRequired,

    /** List width must be set if using animations */
    width: function(props) {
      if (!props.disableAnimation && (!props.width && typeof width !== 'number')) {
        return new Error('`width` must be provided if `disableAnimation` is false');
      }
      return null;
    },

    /** Pass all strings as key/value pairs */
    strings: PropTypes.object.isRequired,

    /** Handle menu click */
    onClick: PropTypes.func.isRequired,

    isMenuCollapse: PropTypes.bool,
    showToggleMenu: PropTypes.bool,

    /** Handle collapse/expand menu click */
    onToggleMenu: function(props) {
      if (props.showToggleMenu && typeof props.onToggleMenu !== 'function') {
        return new Error('onToggleMenu is required when showToggleMenu is provided.');
      }
      return null;
    },

    /** Item/Url selected */
    selectedUrl: PropTypes.string,

    /** Menu option object selected */
    selectedMenu: PropTypes.array,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    activeList: 0,
    lists: [],
    basePath: '/admin',
    width: null
  };

  constructor(props) {
    super(props);
    this.state = {
      shouldAnimate: false
    };
    autobind(this);
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

    // Expand menu when a subitem is selected
    if (this.props.activeList === 0 && nextProps.activeList === 1) {
      this.props.onToggleMenu(true);
    }
  }

  handleMenuClick(event, context) {
    event.preventDefault();

    // Propagate event if clicking anchor
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, context);
    }
  }

  handleToggleMenu() {
    this.props.onToggleMenu();
  }

  renderSubList() {
    const {
      lists,
      selectedMenu,
      selectedUrl,
      strings,
      width,
    } = this.props;
    const styles = require('./AdminMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminMenuList: true,
      subList: true
    });
    const listStyle = {
      width: width,
      left: width
    };

    let menuList = [];
    if (typeof selectedMenu === 'object') {
      const tmpList = lists.filter(option => option.name === selectedMenu[0].name)[0];
      menuList = tmpList ? tmpList.options : [];
    }

    return (<div id="AdminMenuList" className={classes} style={listStyle}>
      <ul className={styles.list}>
        {menuList.map(item => (
          <li key={'admin-' + item.type + '-' + item.name}>
            <MenuItem
              {...item}
              basePath={this.props.basePath}
              selectedUrl={selectedUrl}
              optionSelected={selectedMenu}
              onClick={this.handleMenuClick}
              isMenuCollapse={this.props.isMenuCollapse}
              strings={strings}
            />
          </li>
        ))}
      </ul>
    </div>);
  }

  renderMainList() {
    const {
      lists,
      selectedMenu,
      selectedUrl,
      strings,
      width,
    } = this.props;
    const styles = require('./AdminMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminMenuList: true,
      indexList: true
    });
    const headerClasses = cx({
      header: true,
      indexList: true,
      collapseHeader: !!this.props.isMenuCollapse
    });

    const menuSections = [
      { type: 'system', list: lists.filter(option => option.type === 'system') },
      { type: 'users', list: lists.filter(option => option.type === 'users') },
      { type: 'content', list: lists.filter(option => option.type === 'content') },
      { type: 'advanced', list: lists.filter(option => option.type === 'advanced') }
    ];

    const styleWrapper = {
      width: width
    };

    return (<div className={styles.mainWrapper} style={styleWrapper}>
      {menuSections.map(menuList => {
        if (menuList.list.length === 0) return (<div key={menuList.type} />);
        return (<div key={menuList.type} className={classes}>
          <h4 className={headerClasses} title={strings[menuList.type]}>{strings[menuList.type]}</h4>
          <ul className={styles.list}>
            {menuList.list.map(item => (
              <li key={'admin-' + item.type + '-' + item.name}>
                <MenuItem
                  {...item}
                  basePath={this.props.basePath}
                  selectedUrl={selectedUrl}
                  optionSelected={selectedMenu}
                  onClick={this.handleMenuClick}
                  isMenuCollapse={this.props.isMenuCollapse}
                  strings={strings}
                />
              </li>
            ))}
          </ul>
        </div>);
      })}
    </div>);
  }

  render() {
    const { shouldAnimate } = this.state;
    const {
      activeList,
      showToggleMenu,
      width,
      selectedMenu
    } = this.props;
    const styles = require('./AdminMenu.less');

    const cx = classNames.bind(styles);
    const classes = cx({
      AdminMenu: true
    }, this.props.className);

    const listTransitionClasses = cx({
      transitionWrapper: true,
      collapseMenu: width < 100, // menu is collapsed
      animationsEnabled: shouldAnimate && width,
      list0ActiveAnimate: shouldAnimate && activeList === 0 && width,
      list1ActiveAnimate: shouldAnimate && activeList === 1 && width
    });

    const toggleIconClasses = cx({
      toggleIcon: true,
      active: width < 100 // menu is collapsed
    });

    // Apply height/width if passed
    const style = {
      ...this.props.style,
      width: width
    };

    // Apply height/width if passed
    const listTransitionStyles = {
      width: width * 2  // 2 lists
    };
    const collapseStyle = {
      width: width
    };

    // Displays main menu if there isnt any submenu
    let showMainList = true;
    if (!selectedMenu.length || selectedMenu.length === 1 && selectedMenu[0].options && !selectedMenu[0].options.length) {
      showMainList = true;
    } else {
      showMainList = false;
    }

    return (
      <div className={classes} style={style}>
        <div className={styles.listWrapper} style={collapseStyle}>
          {showToggleMenu && activeList !== 1 && <div className={toggleIconClasses} onClick={this.handleToggleMenu} />}
          <div
            className={listTransitionClasses}
            style={listTransitionStyles}
          >
            {showMainList && this.renderMainList()}
            {!showMainList && this.renderSubList(selectedMenu)}
          </div>
        </div>
      </div>
    );
  }
}
