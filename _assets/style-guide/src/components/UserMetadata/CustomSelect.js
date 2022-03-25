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
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';

export default class CustomSelect extends Component {
  static propTypes = {
    valuesList: PropTypes.array,

    /** Checkbox is selected - unselected */
    onChange: PropTypes.func,

    /** Add button is pressed */
    onAdd: PropTypes.func,

    /** Reset all selected items */
    onReset: PropTypes.func,

    /** on Search Filter change */
    onFilterChange: PropTypes.func,

    className: PropTypes.string,
  };

  static defaultProps = {
    strings: {
      select: 'Select',
      noResults: 'No Results'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      enableButton: false,
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

  componentWillUnmount() {
    document.removeEventListener('click', this.clickDocument, false);
  }

  clickDocument(event) {
    const componentList = ReactDOM.findDOMNode(this.componentDropdown);
    const componentInput = ReactDOM.findDOMNode(this.componentInput);

    if ((componentList && componentList.contains(event.target)) || (componentInput && componentInput.contains(event.target))) {
      return;
    }

    this.hideDropDownList();
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  }

  handleSearchKeyDown(event) {
    // Trigger Tab focus out
    if (event.keyCode === 9) {
      this.hideDropDownList();
    }
  }

  handleSearchChange(event) {
    this.setState({ searchValue: event.currentTarget.value });
    if (typeof this.props.onFilterChange === 'function') {
      this.props.onFilterChange(event.currentTarget.value);
    }
  }

  handleSearchClear() {
    this.setState({ searchValue: '' });
  }

  hideDropDownList() {
    this.setState({ openDropdownList: false });
  }

  handleTextFocus() {
    this.setState({ openDropdownList: true });
  }

  handleOnAdd(event) {
    event.preventDefault();
    this.setState({ searchValue: '' });

    // Propagate event
    if (typeof this.props.onAdd === 'function') {
      this.props.onAdd(this.props.valuesList.filter(item => item.checked));
    }
  }

  handleCheckboxChange(event) {
    const id = event.currentTarget.value;
    const itemSelected = this.props.valuesList.filter(item => item.id === parseInt(event.currentTarget.value, 10));
    const isThereItemChecked = this.props.valuesList.filter(item => item.checked && item.id !== parseInt(id, 10));

    if (event.currentTarget.checked || (isThereItemChecked && isThereItemChecked.length > 0)) {
      this.setState({ enableButton: true });
    } else {
      this.setState({ enableButton: false });
    }

    // Propagate event
    if (this.props.onChange) {
      this.props.onChange(event, itemSelected ? itemSelected[0] : '', event.currentTarget.checked);
    }
  }

  render() {
    const {
      valuesList,
      className,
      strings
    } = this.props;
    const styles = require('./CustomSelect.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      input: true,
      isOpen: this.state.openDropdownList
    }, className);

    return (
      <div className={styles.customSelect}>
        <Text
          ref={(c) => { this.componentInput = c; }}
          width="350px"
          placeholder={'– ' + strings.select + ' –'}
          value={this.state.searchValue}
          showClear={!!this.state.searchValue}
          onChange={this.handleSearchChange}
          onClearClick={this.handleSearchClear}
          //onBlur={this.hideDropDownList}
          onKeyDown={this.handleSearchKeyDown}
          onFocus={this.handleTextFocus}
          className={classes}
        />
        {this.state.openDropdownList && valuesList && valuesList.length > 0 && <ul ref={(c) => { this.componentDropdown = c; }} className={styles.innerDropDownList}>
          {valuesList.map((result) => (
            <li key={result.id}>
              <a className={styles.item}>
                <Checkbox
                  label={result.attributeValue}
                  name={result.attributeValue}
                  value={result.id}
                  onChange={this.handleCheckboxChange}
                  className={styles.checkboxCustom}
                  defaultChecked={result.checked}
                  inline
                />
              </a>
            </li>
          ))}
        </ul>}

        {this.state.openDropdownList && valuesList && valuesList.length > 0 &&
        <Btn
          disabled={!this.state.enableButton}
          inverted
          large
          className={styles.fullWidthButton}
          onClick={this.handleOnAdd}
        >
          Add
        </Btn>
        }

        {this.state.openDropdownList && (!valuesList || valuesList.length === 0) && <ul className={styles.innerDropDownList}>
          <li className={styles.noResult}>{strings.noResults}</li>
        </ul>}
      </div>
    );
  }
}
