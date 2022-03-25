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
import uniqueId from 'lodash/uniqueId';
import BtnAddSearch from 'components/BtnAddSearch/BtnAddSearch';
import Checkbox from 'components/Checkbox/Checkbox';
import Radio from 'components/Radio/Radio';

export default class CheckboxList extends Component {
  static propTypes = {
    name: PropTypes.string,
    itemList: PropTypes.array,
    fetchItemsAsync: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    searchLabel: PropTypes.string,
    showCounter: PropTypes.bool,
    singleSelection: PropTypes.bool,
    showAddBtn: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeCheckbox: PropTypes.func,
    onChangeRadio: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  handleChange(val) {
    // Item selected from dropdown list, so intsert new value in the itemList array
    // Propagate event
    if (this.props.onChange) {
      this.props.onChange(val, this.state);
    }
  }

  handleCheckboxChange(event) {
    if (this.props.onChangeCheckbox) {
      this.props.onChangeCheckbox(event);
    }
  }

  handleRadioChange(val) {
    if (this.props.onChangeRadio) {
      this.props.onChangeRadio(val, this);
    }
  }

  render() {
    const {
      name,
      itemList,
      fetchItemsAsync,
      searchPlaceholder,
      searchLabel,
      showCounter
    } = this.props;
    const self = this;
    const styles = require('./CheckboxList.less');

    return (
      <ul className={styles.CheckboxList}>
        {itemList && itemList.map(function(result) {
          return (<li key={uniqueId(name)}>
            {!self.props.singleSelection && <Checkbox
              //{...result}
              data-type={result.type}
              data-term={result.term}
              name={'checkbox-' + result.id}
              label={result.term}
              value={result.id}
              checked={result.isSelected}
              onChange={self.handleCheckboxChange}
            />
            }
            {self.props.singleSelection && <Radio
              //{...result}
              type="radio"
              name={name}
              key={'radio-' + (result.id || result.value + result.unit)}
              value={result.id || result.value + result.unit}
              label={result.term}
              checked={result.isSelected || result.checked}
              onChange={self.handleRadioChange}
            />
            }
            {showCounter && <span>({result.count})</span>}
          </li>);
        })}
        {this.props.showAddBtn && <li><BtnAddSearch
          name={name}
          placeholder={searchPlaceholder}
          btnLabel={searchLabel}
          itemList={fetchItemsAsync}
          onChange={this.handleChange}
        /></li>}
      </ul>
    );
  }
}
