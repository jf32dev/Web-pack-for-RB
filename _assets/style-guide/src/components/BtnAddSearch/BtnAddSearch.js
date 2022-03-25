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

/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import SelectSearchList from 'components/SelectSearchList/SelectSearchList';

export default class BtnAddSearch extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    btnLabel: PropTypes.string,
    placeholder: PropTypes.string,
    itemList: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      elementState: 'button',
      currentItem: {},
      isItemSelected: false,
      manualLoading: true
    };
    autobind(this);
  }

  handleCancelClick(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ elementState: 'button' });
  }

  handleClick(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ elementState: 'showList' });
  }

  handleCustomSyncChange(val) {
    //When a value is selected in the dropdown list
    this.setState({ elementState: 'button', currentItem: val });

    // Propagate event
    if (this.props.onChange) {
      this.props.onChange(val, this.state);
    }
  }

  render() {
    const {
      name,
      placeholder,
      itemList,
      btnLabel
    } = this.props;
    const styles = require('./BtnAddSearch.less');
    const itemStyle = { position: 'relative' };

    let componentToDisplay;

    switch (this.state.elementState) {
      case 'showList':
        componentToDisplay = (
          <div style={itemStyle}>
            <a
              href={'#' + btnLabel} title={btnLabel} className={styles.btnRemove + ' icon-close'}
              onClick={this.handleCancelClick}
            />
            <SelectSearchList
              className={styles.searchSelect}
              name={name}
              placeholder={placeholder}
              itemList={itemList}
              onChange={this.handleCustomSyncChange}
            />
          </div>
        );
        break;
      case 'button':
      default:
        componentToDisplay = (
          <a
            href={'#' + btnLabel} title={btnLabel} className={styles.btnAdd + ' icon-plus'}
            onClick={this.handleClick}
          >
            {btnLabel}
          </a>
        );
        break;
    }

    return (
      componentToDisplay
    );
  }
}
