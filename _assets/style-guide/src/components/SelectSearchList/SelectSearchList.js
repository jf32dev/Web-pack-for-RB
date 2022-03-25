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
import Select from 'react-select';

import SelectSearchValue from './SelectSearchValue';
import SelectCustomOption from './SelectSearchItem';

export default class SelectSearchList extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    itemList: PropTypes.func,

    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      valueSelected: ''
    };
  }

  handleOnChange(val) {
    this.setState({ valueSelected: val });

    // Propagate event
    if (this.props.onChange) {
      this.props.onChange(val, this.state);
    }
  }

  render() {
    const { placeholder, itemList } = this.props;

    return (
      <Select.Async
        name={this.props.name}
        value={this.state.valueSelected}
        className={this.props.className}
        loadOptions={itemList}
        optionComponent={SelectCustomOption}
        valueComponent={SelectSearchValue}
        onChange={::this.handleOnChange}
        placeholder={placeholder}
        valueKey="id"
        labelKey="term"
      />
    );
  }
}
