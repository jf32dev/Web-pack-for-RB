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

import uniqBy from 'lodash/uniqBy';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Btn from 'components/Btn/Btn';
import Select from 'react-select';
import SelectSearchValue from './SelectSearchValue';

export default class UserMetadataItem extends Component {
  static propTypes = {
    valueSelected: PropTypes.object,
    attributeList: PropTypes.array,
    valuesList: PropTypes.array,

    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      valueSelected: props.valueSelected,
    };
    autobind(this);
  }

  handleOnChange(newVal) {
    this.setState({ valueSelected: newVal });

    // Propagate event
    if (this.props.onChange) {
      this.props.onChange(newVal, this.state);
    }
  }

  handleOnDelete(event) {
    // Propagate event
    if (this.props.onDelete) {
      this.props.onDelete(event, this.props);
    }
  }

  render() {
    const {
      valueSelected,
      attributeList,
      valuesList,
      className,
    } = this.props;
    const styles = require('./UserMetadataItem.less');
    const cx = classNames.bind(styles);

    const attributeSelected = attributeList.find(attr => attr.id === valueSelected.attribute.id) || valueSelected.attribute || {};
    const options = valuesList.filter(item => item.attribute.id === valueSelected.attribute.id) || [];
    options.push(valueSelected);

    const classes = cx({
      dropdown: true,
      dropdownDisabled: !!attributeSelected.locked,
    }, className);

    return (
      <div className={styles.itemContainer}>
        <div>
          <Select
            name={valueSelected.attributeValue}
            value={this.state.valueSelected.id}
            options={uniqBy(options, 'id')}
            searchable
            placeholder="Choose one value!"
            onChange={this.handleOnChange}
            clearable={false}
            disabled={!!attributeSelected.locked}
            className={classes}
            valueComponent={SelectSearchValue}
            valueKey="id"
            labelKey="attributeValue"
          />
        </div>
        {!attributeSelected.locked && <Btn warning className={styles.deleteBtn} onClick={this.handleOnDelete}>Delete</Btn>}
      </div>
    );
  }
}
