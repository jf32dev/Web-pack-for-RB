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

/* eslint-disable react/no-find-dom-node */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Text from 'components/Text/Text';
import AdminCustomSelectItem from './AdminCustomSelectItem';

export default class AdminCustomSelect extends Component {
  static propTypes = {
    attributeList: PropTypes.array,

    /** Add button is pressed */
    onAdd: PropTypes.func,

    /** Clear filter */
    onReset: PropTypes.func,

    className: PropTypes.string,
  };

  static defaultProps = {
    strings: {
      select: 'Select',
      addAttribute: 'Add attribute...',
      noResults: 'No Results'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      focusedOptionIndex: -1,
      isSecondLevelOpened: false, // show second level listing
      list: props.attributeList,
      originalList: props.attributeList,
      searchParent: '',
      searchValue: '',
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.attributeList !== nextProps.attributeList) {
      this.setState({
        list: nextProps.attributeList,
        originalList: nextProps.attributeList,
      });
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const {
      graphType,
      graphId,
      isGraphEnabled
    } = this.state;

    // Fetch graph data
    if (!isGraphEnabled && nextState.isGraphEnabled || (isGraphEnabled && graphType !== nextState.graphType)) {
      const type = nextState.graphType || graphType;
      const id = nextState.graphId || graphId;
      this.props.loadCompleteStructure(type, id);
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
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
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
    const keyword = event.currentTarget.value;
    let filteredList = this.state.originalList;

    if (keyword) {
      const name = this.state.isSecondLevelOpened ? 'attributeValue' : 'attribute';
      filteredList = this.state.originalList.filter(item => (
        item[name].toLowerCase().indexOf(keyword.toLowerCase()) > -1
      ));
    }

    this.setState({
      searchValue: keyword,
      list: filteredList
    });
  }

  handleSearchClear() {
    this.setState({
      searchValue: '',
      searchParent: ''
    });
  }

  hideDropDownList() {
    this.setState({
      openDropdownList: false,
      list: this.props.attributeList, // reset list
      originalList: this.props.attributeList,
      isSecondLevelOpened: false
    });
  }

  handleShowDropDownList() {
    this.setState({ openDropdownList: true });
  }

  handleCustomItemClick(event, context) {
    event.preventDefault();
    event.stopPropagation();

    // Toggle list attributes and value list
    this.setState({
      searchParent: !this.state.isSecondLevelOpened ? context.name : this.state.searchParent,
      searchValue: '',
      list: this.state.isSecondLevelOpened ? this.props.attributeList : (context.values || []),
      originalList: this.state.isSecondLevelOpened ? this.props.attributeList : (context.values || []),
      isSecondLevelOpened: !this.state.isSecondLevelOpened,
      focusedOptionIndex: -1,
      openDropdownList: !this.state.isSecondLevelOpened
    });

    if (this.componentInput && this.state.openDropdownList) this.componentInput.text.focus();
    if ((this.state.isSecondLevelOpened || !context.values || !context.values.length) && typeof this.props.onAdd === 'function') {
      this.props.onAdd({
        id: context.id,
        name: context.name
      });
    }
  }

  render() {
    const {
      className,
      strings
    } = this.props;
    const {
      list,
    } = this.state;
    const styles = require('./AdminCustomSelect.less');
    const cx = classNames.bind(styles);

    const classes = cx({
      input: true,
      isOpen: this.state.openDropdownList
    }, className);

    return (
      <div className={styles.customSelect}>
        <div className={styles.fakeField}>
          {this.state.isSecondLevelOpened && this.state.searchParent && <span className={styles.fakeLabel + ' customSelectItem'}>{this.state.searchParent}: </span>}
          <Text
            ref={(c) => { this.componentInput = c; }}
            //width={'350px'}
            placeholder={strings.addAttribute}
            value={this.state.searchValue}
            showClear={!!this.state.searchValue || this.state.isSecondLevelOpened}
            onChange={this.handleSearchChange}
            onClearClick={this.handleSearchClear}
            //onBlur={this.hideDropDownList}
            onKeyDown={this.handleSearchKeyDown}
            onFocus={this.handleShowDropDownList}
            className={classes}
          />
        </div>
        {this.state.openDropdownList && list && list.length > 0 &&
          <div ref={(c) => { this.componentDropdown = c; }} className={styles.innerDropDownList}>
            {list.map((result, ix) => {
              const data = {
                id: result.id,
              };
              if (this.state.isSecondLevelOpened) {
                // values list
                data.name = result.attributeValue;
                data.values = [];
                // Main level attribute list
              } else {
                data.name = result.attribute;
                data.values = result.values;

                // Do not show empty attributes
                if (!result.values || !result.values.length) return false;
              }

              return (
                <AdminCustomSelectItem
                  key={result.id}
                  onClick={this.handleCustomItemClick}
                  isFocused={ix === this.state.focusedOptionIndex}
                  {...data}
                />
              );
            })}
          </div>
        }

        {this.state.openDropdownList && (!list || list.length === 0) && <ul className={styles.innerDropDownList}>
          <li className={styles.noResult}>{strings.noResults}</li>
        </ul>}
      </div>
    );
  }
}
