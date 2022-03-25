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

import Blankslate from 'components/Blankslate/Blankslate';
import Text from 'components/Text/Text';
import ItemList from './ItemList';

export default class AdminIndex extends PureComponent {
  static propTypes = {
    /** Valid root URL <code>/admin</code> */
    basePath: PropTypes.string.isRequired,

    /** Array of menu list */
    list: PropTypes.array.isRequired,

    /** Pass all strings as key/value pairs */
    strings: PropTypes.object.isRequired,

    placeholder: PropTypes.string,

    /** handle click on link */
    onAnchorClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    basePath: '/admin',
    list: [],
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      filterInputValue: '',
    };

    // refs
    this.filterInput = null;
    this.filterList = null;
    this.filterContainer = null;

    autobind(this);
  }

  componentDidMount() {
    this.filterInput.focus();
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // Add window event listener
    if (!this.state.filterInputValue && nextState.filterInputValue) {
      this.addWindowClickEvent();
    } else if (this.state.filterInputValue && !nextState.filterInputValue) {
      this.removeWindowClickEvent();
    }
  }

  componentDidUpdate() {
    // scroll window to display full dropdown options
    if (this.state.filterInputValue && this.filterList) {
      const buffer = 10;
      const menuContainerRect = this.filterList.getBoundingClientRect();
      if (window.innerHeight < menuContainerRect.bottom + buffer) {
        window.scrollBy(0, menuContainerRect.bottom + buffer - window.innerHeight);
      }
    }
  }

  componentWillUnmount() {
    this.removeWindowClickEvent();
  }

  addWindowClickEvent() {
    document.addEventListener('click', this.handleWindowClick, false);
  }

  removeWindowClickEvent() {
    document.removeEventListener('click', this.handleWindowClick, false);
  }

  handleWindowClick(event) {
    // Enable mouse pointing
    document.body.style.pointerEvents = 'auto';

    // Check if we are not clicking on the options
    const container = this.filterContainer;
    const isContainer = container === event.target || container === event.target.offsetParent;

    if (!isContainer && !container.contains(event.target)) {
      this.setState({ filterInputValue: '' });
      event.stopPropagation();
    }
  }

  handleChange(event) {
    this.setState({ filterInputValue: event.currentTarget.value });
  }

  handleFilterClear() {
    this.setState({ filterInputValue: '' });
  }

  filterMenuLinks() {
    const {
      list,
      strings,
    } = this.props;
    const {
      filterInputValue,
    } = this.state;
    const nList = [];

    for (const itemValue of list) {
      if (itemValue.options && itemValue.options.length) {
        for (const itemOptions of itemValue.options) {
          const isValueInParent = strings[itemValue.name] ? strings[itemValue.name].toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1 : false;
          const isValueInChild = strings[itemOptions.name] ? strings[itemOptions.name].toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1 : false;
          // Creates an array with filters applied
          if (!filterInputValue || isValueInParent || isValueInChild) {
            nList.push([
              { value: itemValue.name, label: strings[itemValue.name] },
              { value: itemOptions.name, label: strings[itemOptions.name] },
            ]);
          }
        }

        // Creates and Array with only 1 level and filters applied
      } else if (!filterInputValue || strings[itemValue.name].toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1) {
        nList.push([{ value: itemValue.name, label: strings[itemValue.name] }]);
      }
    }
    return nList;
  }

  render() {
    const {
      filterInputValue,
    } = this.state;
    const {
      strings,
      onAnchorClick,
    } = this.props;
    const styles = require('./AdminIndex.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminIndex: true,
    }, this.props.className);
    const classesList = cx({
      list: filterInputValue,
    });
    const filterList = this.filterMenuLinks();

    return (
      <Blankslate
        iconSize={144}
        icon="gear-fill"
        message={strings.selectCategoryOrSearchBelow || 'Browse settings on the left or search for settings below.'}
        className={classes}
      >
        <div
          ref={(c) => { this.filterContainer = c; }}
          className={styles.containerList}
        >
          <Text
            ref={(c) => { this.filterInput = c; }}
            icon="search"
            placeholder="Search Settings"
            value={filterInputValue}
            showClear={!!filterInputValue}
            onChange={this.handleChange}
            onClearClick={this.handleFilterClear}
            className={styles.searchInput}
          />
          <div ref={(c) => { this.filterList = c; }} className={classesList}>
            {filterInputValue && <ul>
              {filterList.map((item, index) => (
                <li key={'filterMenu_' + item[0].value + index}>
                  <ItemList
                    path={item}
                    basePath={this.props.basePath}
                    strings={strings}
                    onClick={onAnchorClick}
                  />
                </li>
              ))}
            </ul>}
          </div>
        </div>
      </Blankslate>
    );
  }
}
