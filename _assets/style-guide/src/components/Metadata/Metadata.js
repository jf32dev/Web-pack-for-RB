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
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import MetadataItem from './MetadataItem';

const messages = defineMessages({
  marketing: { id: 'marketing', defaultMessage: 'Marketing' },
  crm: { id: 'crm', defaultMessage: 'CRM' },
  addItemField: { id: 'add-item-field', defaultMessage: 'Add {item} Field' },
  property: { id: 'property', defaultMessage: 'Property' },
  value: { id: 'value', defaultMessage: 'Value' },
});

/**
 * Metadata are used on Stories Edit.
 */
export default class MetadataView extends Component {
  static propTypes = {
    /** List type. <code>{id: 1, name: Marketing, propertyTypes: []}</code>*/
    entity: PropTypes.object.isRequired,

    /** Array of items saved for current Entity */
    items: PropTypes.array,

    /** currency symbol to be used */
    currency: PropTypes.string,

    /** Sets disabled state to inputs */
    readonly: PropTypes.bool,

    disableAddButton: PropTypes.bool,
    addItem: PropTypes.bool,
    deleteItem: PropTypes.bool,

    /** Required when addItem is passed */
    onAdd: function(props) {
      if (typeof props.onAdd !== 'function') {
        return new Error('onAdd is required when addItem is provided.');
      }
      return null;
    },

    /** Required when deleteItem is passed */
    onDelete: function(props) {
      if (typeof props.onDelete !== 'function') {
        return new Error('onDelete is required when deleteItem is provided.');
      }
      return null;
    },

    /** Handler when the value of an item is changed */
    onChange: PropTypes.func,

    /** Shows an error message next to the button */
    error: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    items: [],
    entities: [],
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleAddClick(event) {
    this.props.onAdd(event, this.props.entity.id);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      entity,
      currency,
      items,
      readonly,
      onChange,
      onDelete,
      className,
      error,
    } = this.props;
    const styles = require('./Metadata.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      Metadata: true,
      readonly: readonly,
    }, className);

    // Translations
    const strings = generateStrings(messages, formatMessage, { item: entity.name });

    return (
      <div className={itemClasses} style={this.props.style}>
        <h3>{strings[entity.name.toLowerCase()]}</h3>
        {items && items.length > 0 && <ul className={styles.itemList}>
          <li>
            <h4 className={styles.subHeader}>{strings.property}</h4>
            <h4 className={styles.subHeader}>{strings.value}</h4>
          </li>
          {items && items.map((result) => (
            <li key={result.metadataId}>
              <MetadataItem
                properties={entity.propertyTypes}
                currency={currency}
                readonly={readonly}
                onChange={onChange}
                onDelete={onDelete}
                deleteItem={this.props.deleteItem}
                {...result}
              />
            </li>
          ))}
        </ul>}
        {!readonly && this.props.addItem && <Btn
          data-id="add"
          disabled={this.props.disableAddButton}
          inverted
          onClick={this.handleAddClick}
        >
          {strings.addItemField}
        </Btn>}
        {error && error.message && <span className={styles.error}>{error.message}</span>}
      </div>
    );
  }
}
