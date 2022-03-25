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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import AdminUserMetadataItem from './AdminUserMetadataItem';
import AdminUserMetadataModal from './AdminUserMetadataModal';

/**
 * Admin User Metadata
 */
export default class AdminUserMetadata extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,
    /** data */
    list: PropTypes.array,
    showBulkUpload: PropTypes.bool,
    loading: PropTypes.bool,

    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    onChangeValues: PropTypes.func,
    onRemove: PropTypes.func,
    onSave: PropTypes.func,

    onBulkUploadClick: function(props) {
      if (props.showBulkUpload && typeof props.onBulkUploadClick !== 'function') {
        return new Error('onBulkUploadClick is required when showBulkUpload is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      customUserMetadata: 'Custom User Metadata',
      attributeName: 'Attribute Name',
      attribute: 'Attribute',
      hidden: 'Hidden',
      locked: 'Locked',
      addMetadata: 'Add Metadata',
      values: 'Values',
      save: 'Save'
    },
    list: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isValuesModalVisible: false
    };
    autobind(this);

    this.max = 50;
  }

  handleBulkUpload() {
    if (typeof this.props.onBulkUploadClick === 'function') {
      this.props.onBulkUploadClick();
    }
  }

  handleOnChange(data) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data);
    }
  }

  handleOnValueChange(data) {
    if (typeof this.props.onChangeValues === 'function') {
      this.props.onChangeValues(data);
    }
    if (this.state.isValuesModalVisible) {
      this.handleToggleModal();
    }
  }

  handleEditClick(event, context) {
    this.setState({
      isValuesModalVisible: !this.state.isValuesModalVisible,
      metadataSelected: {
        id: context.id,
        attribute: context.attribute,
        values: context.values
      }
    });
  }

  handleToggleModal() {
    this.setState({
      isValuesModalVisible: !this.state.isValuesModalVisible
    });
  }

  render() {
    const {
      list,
      loading,
      showBulkUpload,
      strings,

      onSave,
    } = this.props;
    const styles = require('./AdminUserMetadata.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminUserMetadata: true,
    }, this.props.className);

    const unique = {};
    list.forEach((i) => {
      if (!unique[i.attribute.toLowerCase().trim()]) {
        unique[i.attribute.toLowerCase().trim()] = i.attribute.trim();
      }
      return unique;
    });

    const isThereDuplicatedAttr = Object.keys(unique).map(a => unique[a]).length !== list.length;
    //const isThereDuplicatedAttr = [...(new Set(list.map(({ attribute }) => attribute)))].length !== list.length;
    const isError = list.findIndex(item => item.attribute === '') > -1 || isThereDuplicatedAttr;
    const isModified = list.filter(item => item.isModified).length > 0;

    return (
      <div className={classes} style={this.props.style}>
        <header>
          <div className={styles.customUserMetadata}>
            <h3>{strings.customUserMetadata}</h3>
            <div>{strings.customUserMetadataDesc}</div>
          </div>
          <Btn
            borderless inverted disabled={isError || !isModified || loading}
            onClick={onSave}
          >
            {strings.save}
          </Btn>
        </header>

        {showBulkUpload && <Btn
          icon="zoomIn-fill"
          borderless
          className={styles.bulkUploadBtn}
          onClick={this.handleBulkUpload}
        >
          {strings.bulkImport}
        </Btn>}

        {list.length > 0 && <div className={styles.tableHeader}>
          <div>
            {strings.attribute}
            <span className={styles.counter}>{list.length} / {this.max}</span>
          </div>
          <div>{strings.values}</div>
          <div>{strings.hidden}</div>
          <div>{strings.locked}</div>
          <div />
        </div>}

        {list.map((item, ix) => (<AdminUserMetadataItem
          {...item}
          id={item.id}
          isDuplicated={list.filter(att => att.attribute.toLowerCase() === item.attribute.toLowerCase()).length > 1}
          index={ix + 1}
          key={ix + '-' + item.id}
          attribute={item.attribute}
          list={item.values}
          isHidden={item.isHidden}
          isLocked={item.locked}
          onChange={this.handleOnChange}
          onEditClick={this.handleEditClick}
          onRemove={this.props.onRemove}
          onBlurText={this.props.onBlurText}
          strings={strings}
        />))}

        <Btn
          borderless
          inverted
          small
          className={styles.bulkAddBtn}
          disabled={list.length >= this.max || isError || loading}
          onClick={this.props.onAdd}
        >
          {strings.addMetadata}
        </Btn>

        {<AdminUserMetadataModal
          {...this.state.metadataSelected}
          isVisible={this.state.isValuesModalVisible}
          onCancel={this.handleToggleModal}
          onUpdate={this.handleOnValueChange}
        />}
      </div>
    );
  }
}
