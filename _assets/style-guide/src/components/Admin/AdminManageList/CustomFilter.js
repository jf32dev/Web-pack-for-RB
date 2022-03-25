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
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Text from 'components/Text/Text';
import CustomFilterItem from './CustomFilterItem';

export default class CustomFilter extends Component {
  static propTypes = {
    filterList: PropTypes.array,
    filterType: PropTypes.string,

    /** Add button is pressed */
    onAdd: PropTypes.func,

    /** on Search Filter change */
    onFilterChange: PropTypes.func,

    /** Clear filter */
    onReset: PropTypes.func,

    className: PropTypes.string,
  };

  static defaultProps = {
    strings: {
      placeholder: 'Filter',
      noResults: 'No Results'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      focusedOptionIndex: -1,
      isSecondLevelOpened: !!props.filterType, // show second level listing
      list: props.filterList,
      originalList: props.filterList,
      filterType: props.filterType,
      searchValue: props.filterValue,
      openDropdownList: false,
    };

    // refs
    this.componentDropdown = null;
    this.componentInput = null;

    autobind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.clickDocument, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (this.props.filterList !== nextProps.filterList) {
      this.setState({
        list: nextProps.filterList,
        originalList: nextProps.filterList,
      });
    }
    if (this.componentInput && !nextState.openDropdownList) this.componentInput.text.focus();
    if (nextProps.filterType && nextProps.filterType !== this.props.filterType) {
      this.setState({ filterType: nextProps.filterType });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickDocument, false);
  }

  clickDocument(event) {
    const dropMenu = this.componentDropdown;
    const addInput = this.componentInput ? this.componentInput.text : null;
    const isList = dropMenu === event.target || dropMenu === event.target.offsetParent;
    const isInput = addInput === event.target || addInput === event.target.offsetParent;

    // Check if we are not clicking on the list
    if (event.target.classList.contains('labelCustomSelectItem') ||
      (this.state.isSecondLevelOpened && this.state.list.length > 0 && event.target.classList.contains('customSelectItem')) ||
      (this.state.list.length > 0 && isList || dropMenu && dropMenu.contains(event.target)) ||
      (isInput || addInput && addInput.contains(event.target))
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.hideDropDownList();
  }

  selectFocusedOption(event) {
    const item = this.state.list[this.state.focusedOptionIndex];
    if (this.state.focusedOptionIndex >= 0 && item) {
      this.handleCustomItemClick(event, item);
    }
  }

  focusAdjacentOption(dir) {
    const maxLength = this.state.list.length - 1;
    let focusOption = this.state.focusedOptionIndex >= 0 ? this.state.focusedOptionIndex : 0;

    switch (dir) {
      case 'next':
        if (focusOption < maxLength) {
          focusOption += 1;
        }
        break;
      case 'previous':
        if (focusOption) {
          focusOption -= 1;
        }
        break;
      default:
        break;
    }
    this.setState({
      openDropdownList: true,
      focusedOptionIndex: focusOption
    });
  }

  handleSearchKeyDown(event) {
    this.setState({ openDropdownList: true });

    switch (event.keyCode) {
      case 9:
      case 27:
        // Trigger Tab focus out
        this.hideDropDownList();
        break;
      case 38: // up
        this.focusAdjacentOption('previous');
        break;
      case 40: // down
        this.focusAdjacentOption('next');
        break;
      case 13: // enter
        if (!this.state.openDropdownList) return;
        event.stopPropagation();
        this.selectFocusedOption(event);
        break;
      default:
        break;
    }
  }

  handleSearchChange(event) {
    this.setState({
      searchValue: event.currentTarget.value,
      list: this.state.originalList
    });

    if (typeof this.props.onFilterChange === 'function') {
      this.props.onFilterChange(event.currentTarget.value, this.state.filterType);
    }
  }

  handleSearchClear() {
    this.setState({
      searchValue: '',
      filterType: '',
      isSecondLevelOpened: false
    });

    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  }

  hideDropDownList() {
    this.setState({
      openDropdownList: false,
      list: this.props.filterList, // reset list
      originalList: this.props.filterList,
    });
  }

  handleShowDropDownList() {
    this.setState({ openDropdownList: true });
  }

  handleCustomItemClick(event, context) {
    event.preventDefault();
    event.stopPropagation();

    const type = !this.state.isSecondLevelOpened ? context.name : this.state.filterType;
    // Toggle list attributes and value list
    this.setState({
      filterType: type,
      searchValue: '',
      list: this.state.isSecondLevelOpened ? this.props.filterList : [],
      isSecondLevelOpened: true,
      focusedOptionIndex: -1,
      openDropdownList: false
    });

    if (this.componentInput && !this.state.openDropdownList) this.componentInput.text.focus();
  }

  render() {
    const {
      className,
      strings
    } = this.props;
    const {
      list,
    } = this.state;
    const styles = require('./CustomFilter.less');
    const cx = classNames.bind(styles);

    const classes = cx({
      input: true,
      isOpen: this.state.openDropdownList
    }, className);

    return (
      <div className={styles.customSelect}>
        <div className={styles.fakeField}>
          {this.state.filterType && <span className={styles.fakeLabel + ' customSelectItem'}>{this.state.filterType}: </span>}
          <Text
            ref={(c) => { this.componentInput = c; }}
            placeholder={this.props.placeholder}
            value={this.state.searchValue}
            showClear={!!this.state.searchValue || this.state.isSecondLevelOpened}
            readOnly={!this.state.isSecondLevelOpened}
            onChange={this.handleSearchChange}
            onClearClick={this.handleSearchClear}
            //onBlur={this.hideDropDownList}
            onKeyDown={this.handleSearchKeyDown}
            onFocus={this.handleShowDropDownList}
            onClick={this.handleShowDropDownList}
            className={classes}
          />
        </div>
        {!this.state.isSecondLevelOpened && this.state.openDropdownList && list && list.length > 0 &&
        <div ref={(c) => { this.componentDropdown = c; }} className={styles.innerDropDownList}>
          {list.map((result, ix) => {
            const data = {
              id: result.id,
              name: result.name
            };

            return (
              <CustomFilterItem
                key={result.id}
                onClick={this.handleCustomItemClick}
                isFocused={ix === this.state.focusedOptionIndex}
                {...data}
              />
            );
          })}
        </div>
        }
        {!this.state.isSecondLevelOpened && this.state.openDropdownList && (!list || list.length === 0) && <ul className={styles.innerDropDownList}>
          <li className={styles.noResult}>{strings.noResults}</li>
        </ul>}
      </div>
    );
  }
}
