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
import autobind from 'class-autobind';
import Select from 'react-select';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Text from 'components/Text/Text';

const messages = defineMessages({
  delete: { id: 'delete', defaultMessage: 'Delete' },
  selectAProperty: { id: 'select-a-property', defaultMessage: 'Select a property' },
  selectAValue: { id: 'select-a-value', defaultMessage: 'Select a value' },
});

/**
 * MetadataItem used on Metadata table.
 */
export default class MetadataItem extends Component {
  static propTypes = {
    metadataId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    propertyId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,

    /** Array List of properties available in Entity */
    properties: PropTypes.array,

    /** Currency to be used */
    currency: PropTypes.string,

    /** Sets disabled state to inputs */
    readonly: PropTypes.bool,

    deleteItem: PropTypes.bool,

    onChange: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleOnDelete() {
    // Propagate event
    if (this.props.onDelete) {
      this.props.onDelete(this.props);
    }
  }

  handleOnChange(propertyId, value) {
    // Propagate event
    if (this.props.onChange) {
      const item = {
        metadataId: this.props.metadataId,
        categoryId: this.props.categoryId,
        propertyId: propertyId,
        value: value,
      };
      this.props.onChange(item);
    }
  }

  // Property changed
  handleOnSelectChange(val) {
    this.handleOnChange(val.id, '');
  }

  // Value changed
  handleOnValueSelectChange(val) {
    this.handleOnChange(this.props.propertyId, val.id);
  }

  handleOnTextChange(e) {
    e.preventDefault();
    this.handleOnChange(this.props.propertyId, e.currentTarget.value);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      deleteItem,
      properties,
      currency,
      readonly,
    } = this.props;
    const styles = require('./Metadata.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const property = properties.find(obj => obj.id === parseInt(this.props.propertyId, 10));
    const predefined = [];

    if (property && property.predefined && property.predefined.length) {
      property.predefined.forEach(function (value) {
        predefined.push({ id: value, name: value });
      });
    }

    return (
      <div>
        <Select
          className={styles.customSelect}
          value={this.props.propertyId}
          options={properties}
          searchable={false}
          placeholder={strings.selectAProperty}
          onChange={this.handleOnSelectChange}
          clearable={false}
          disabled={readonly}
          labelKey="name"
          valueKey="id"
        />

        {this.props.propertyId > 0 && property.isTrait > 0 && predefined.length === 0 &&
        // it's a custom attribute
        <Text
          key={'custom-' + property.name}
          className={styles.customInput}
          placeholder={property && property.name}
          value={this.props.value}
          disabled={readonly}
          onChange={this.handleOnTextChange}
          inline
          width="100%"
        />}

        {this.props.propertyId > 0 && !property.isTrait > 0 &&
        // it's a number input
        <span className={styles.currencyContainer}>
          <Text
            key={'number-' + property.name}
            className={styles.currencyInput}
            placeholder={currency}
            value={this.props.value}
            disabled={readonly}
            onChange={this.handleOnTextChange}
            inline
            //type="number"
            width="100%"
          />
          <span className={styles.currencyLabel}>{currency}</span>
        </span>}

        {this.props.propertyId > 0 && property.isTrait > 0 && predefined.length > 0 &&
        // it's a predefined attribute
        <Select
          className={styles.customSubSelect}
          name={property.name}
          value={this.props.value}
          options={predefined}
          searchable={false}
          disabled={readonly}
          placeholder={strings.selectAValue}
          onChange={this.handleOnValueSelectChange}
          clearable={false}
          labelKey="name"
          valueKey="id"
        />}

        {!readonly && deleteItem && <Btn
          className={styles.deleteBtn}
          onClick={this.handleOnDelete}
          warning
        >
          {strings.delete}
        </Btn>}
      </div>
    );
  }
}
