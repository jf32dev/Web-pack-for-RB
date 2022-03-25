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
 * @package hub-web-app-v5
 * @copyright 2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Textarea from 'components/Textarea/Textarea';
import autobind from 'class-autobind';

const messages = defineMessages({
  editHeaderValues: { id: 'edit-attribute-values', defaultMessage: 'Edit "{attribute}" Values' },
  update: { id: 'update', defaultMessage: 'Update' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  delimitedValueInfo: { id: 'enter-newline-delimited-info', defaultMessage: 'Enter values separated by a newline' },
});

export default class AdminUserMetadataModal extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    attribute: PropTypes.string,
    values: PropTypes.array,

    isVisible: PropTypes.bool,

    onCancel: PropTypes.func,
    onUpdate: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    values: []
  };

  static getDerivedStateFromProps(props, state) {
    // Update State with new attribute
    if (props.id !== state.id || props.isVisible !== state.isVisible) {
      return {
        isVisible: props.isVisible,
        id: props.id,
        plainValues: props.values.map(item => item.attributeValue).join('\n')
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible,
      id: props.id,
      plainValues: props.values.map(item => item.attributeValue).join('\n')
    };
    autobind(this);
  }

  handleOnChange(event) {
    const value = event.currentTarget.value;
    this.setState({
      plainValues: value
    });
  }

  handleOnUpdate() {
    const tmpList = this.state.plainValues.trim().split('\n');
    const unique = {};
    tmpList.forEach((i) => {
      if (!unique[i.toLowerCase().trim()]) {
        unique[i.toLowerCase().trim()] = i.trim();
      }
      return unique;
    });

    const valueList = Object.keys(unique).map(a => unique[a]);
    //valueList = Array.from(new Set(valueList)); // Remove duplicates
    const oldList = [...this.props.values];

    // Get new ids for tmp item
    let minId = Math.min(...oldList.map(item => item.tmpId || item.id));

    const list = valueList.map(item => {
      minId = minId <= 0 ? minId - 1 : -1;
      const existingItem = oldList.find(val => val.attributeValue === item.trim());
      const id = existingItem && existingItem.id ? existingItem.id : this.props.id.toString() + minId.toString();

      const data = {};
      if (!existingItem || existingItem && !existingItem.id) {
        data.tmpId = minId;
      }

      return {
        id: id,
        attributeValue: item.trim(),
        ...data
      };
    });

    if (typeof this.props.onUpdate === 'function') {
      this.props.onUpdate({
        id: this.props.id,
        param: 'values',
        value: list.filter(i => i.attributeValue)
      });
    }
  }

  render() {
    const { attribute } = this.props;
    const { plainValues } = this.state;
    const { formatMessage } = this.context.intl;
    const styles = require('./AdminUserMetadataModal.less');
    // Translations
    const strings = generateStrings(messages, formatMessage, { attribute: attribute });

    const origValues = this.props.values.map(item => item.attributeValue).join(',\n');

    return (
      <Modal
        headerTitle={strings.editHeaderValues}
        isVisible={this.state.isVisible}
        width="medium"
        escClosesModal
        footerClassName={styles.modalFooter}
        onClose={this.props.onCancel}
        footerChildren={(
          <div>
            <Btn
              alt
              large
              onClick={this.props.onCancel}
              style={{ marginRight: '0.5rem' }}
            >
              {strings.cancel}
            </Btn>
            <Btn
              large
              inverted
              onClick={this.handleOnUpdate}
              disabled={origValues === plainValues}
            >{strings.update}</Btn>
          </div>
        )}
      >
        <h5 className={styles.info}>{strings.delimitedValueInfo}</h5>
        <Textarea
          key={this.state.id}
          placeholder={strings.comments}
          value={plainValues}
          name="description"
          onChange={this.handleOnChange}
          rows={10}
          className={styles.textArea}
          //autosize
        />
      </Modal>
    );
  }
}
