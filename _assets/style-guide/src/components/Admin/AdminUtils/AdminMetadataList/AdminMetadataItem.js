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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Select from 'react-select';
import AdminSelectSearchValue from './AdminSelectSearchValue';

class OptionItem extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isDisabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    option: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleMouseDown (event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  handleMouseEnter (event) {
    this.props.onFocus(this.props.option, event);
  }

  handleMouseMove (event) {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  render () {
    const styles = require('./AdminMetadataItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      itemWrap: true,
      isFocused: this.props.isFocused,
      isSelected: this.props.isSelected,
    });

    return (
      <div
        className={classes}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
      >
        <span className={styles.item}>
          {this.props.children}
        </span>
      </div>
    );
  }
}

export default class AdminMetadataItem extends PureComponent {
  static propTypes = {
    valueSelected: PropTypes.object,
    attributeList: PropTypes.array,

    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    valueSelected: {},
    attributeList: []
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
      this.props.onChange(newVal, this.state.valueSelected);
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
      valuesSelectedList,
      attributeList,
      className,
    } = this.props;
    const styles = require('./AdminMetadataItem.less');
    const cx = classNames.bind(styles);

    const selectedId = valueSelected.attribute ? valueSelected.attribute.id : 0;
    const attributeSelected = attributeList.find(attr => attr.id === selectedId) || { ...valueSelected.attribute, values: (valueSelected.attribute.values || []) } || {};
    const { values, ...parseAttribute } = attributeSelected;
    let options = attributeSelected.values.filter(item => !valuesSelectedList.find(obj => obj.id === item.id));
    options = options.map(obj => ({ ...obj, attribute: { ...parseAttribute, name: parseAttribute.attribute } }));
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
            //isVisible={!!attributeSelected.visibility}
            className={classes}
            optionComponent={OptionItem}
            valueComponent={AdminSelectSearchValue}
            valueKey="id"
            labelKey="attributeValue"
          />

        </div>
        <span
          className={styles.removeBtn}
          onClick={this.handleOnDelete}
        />
      </div>
    );
  }
}
