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
 * @copyright 2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */
import _uniqueId from 'lodash/uniqueId';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Checkbox from 'components/Checkbox/Checkbox';
import Dialog from 'components/Dialog/Dialog';
import Icon from 'components/Icon/Icon';
import Text from 'components/Text/Text';

/**
 * Admin User Metadata
 */
export default class AdminUserMetadataItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    attribute: PropTypes.string,
    index: PropTypes.number,
    list: PropTypes.array,

    isHidden: PropTypes.bool,
    isLocked: PropTypes.bool,

    onEditClick: PropTypes.func,
    onChange: PropTypes.func,
    onHiddenToggle: PropTypes.func,
    onLockedToggle: PropTypes.func,
    onRemove: PropTypes.func,
    onBlurText: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      attributeName: 'Attribute Name',
      noValues: 'No values',
      confirmRemoveHeader: 'Are you sure you want to delete this Metadata? Deleting Metadata cannot be undone.'
    },
    list: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmRemoveAttribute: false
    };
    autobind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        id: this.props.id,
        param: 'attribute',
        value: event.currentTarget.value
      });
    }
  }

  handleToggleConfirmRemove() {
    this.setState({
      confirmRemoveAttribute: !this.state.confirmRemoveAttribute
    });
  }

  handleRemove(event) {
    event.preventDefault();
    if (typeof this.props.onRemove === 'function') {
      this.props.onRemove(this.props.id);
    }
  }

  handleEditClick(event) {
    event.preventDefault();
    if (typeof this.props.onEditClick === 'function') {
      this.props.onEditClick(event, this.props);
    }
  }

  handleCheckboxToggle(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        id: this.props.id,
        param: event.currentTarget.dataset.name,
        value: !!event.currentTarget.checked
      });
    }
  }

  handleOnBlurText(event) {
    if (typeof this.props.onBlurText === 'function') {
      this.props.onBlurText(event, this.props);
    }
  }

  render() {
    const {
      attribute,
      index,
      isDuplicated,
      isHidden,
      isLocked,
      list,
      strings,
    } = this.props;

    const styles = require('./AdminUserMetadataItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminUserMetadataItem: true,
      inputError: isDuplicated,
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <div>
          <span className={styles.tableIndex}>{index}</span>
          <Text
            autoFocus={!attribute}
            id="attribute"
            name="attribute"
            placeholder={strings.attributeName}
            inline
            //width="88%"
            value={attribute}
            style={{ width: '90%' }}
            className={styles.inputClass}
            onChange={this.handleInputChange}
            onBlur={this.handleOnBlurText}
          />
        </div>
        <div className={styles.valuesWrapper}>
          <div>
            {list.map((item, ix) => (<span key={`${_uniqueId(item.id)}`}>
              {item.attributeValue.trim()}{ix + 1 < list.length ? ',' : null}&nbsp;
            </span>))}
            {list.length === 0 && <span className={styles.placeholder}>({strings.noValues})</span>}
          </div>
          <Icon
            name="edit-box"
            onClick={this.handleEditClick}
            className={styles.editBtn}
          />
        </div>
        <div>
          <Checkbox
            name={`${this.props.id}-visibility`}
            data-name="isHidden"
            value={1}
            checked={!!isHidden}
            onChange={this.handleCheckboxToggle}
          />
        </div>
        <div>
          <Checkbox
            name={`${this.props.id}-locked`}
            data-name="locked"
            value={1}
            checked={!!isLocked}
            onChange={this.handleCheckboxToggle}
          />
        </div>
        <div>
          <Icon
            name="zoomIn"
            onClick={this.handleToggleConfirmRemove}
            className={styles.deleteBtn}
          />
        </div>

        {this.state.confirmRemoveAttribute && <Dialog
          title={strings.deleteMetadata}
          isVisible
          confirmText={strings.delete}
          onCancel={this.handleToggleConfirmRemove}
          onConfirm={this.handleRemove}
        >
          <p className={styles.removeMsg}>{strings.confirmRemoveHeader}</p>
        </Dialog>}
      </div>
    );
  }
}
