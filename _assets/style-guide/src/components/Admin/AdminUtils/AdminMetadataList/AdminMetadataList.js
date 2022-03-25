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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import AdminCustomSelect from './AdminCustomSelect';
import Loader from 'components/Loader/Loader';
import AdminMetadataItem from './AdminMetadataItem';


/**
 * Metadata Dropdown list
 */
export default class AdminMetadataList extends PureComponent {
  static propTypes = {
    attributeList: PropTypes.array,
    valuesSelectedList: PropTypes.array,

    onChange: PropTypes.func,
    onDelete: PropTypes.func,

    onAdd: PropTypes.func,
    onResetNewItemList: PropTypes.func,
    onChangeNewItem: PropTypes.func,

    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    width: PropTypes.number,

    listClassName: PropTypes.string,
    className: PropTypes.string,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    width: 255,
    attributeList: [],
    valuesSelectedList: []
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleDelete(event, context) {
    event.preventDefault();
    if (this.props.onDelete) {
      this.props.onDelete(event, context);
    }
  }

  handleChange(newVal, context) {
    if (this.props.onChange) {
      this.props.onChange(newVal, context);
    }
  }

  // Custom dropdown list
  handleOnAdd(items) {
    /* Add selected items to metadata */
    if (typeof this.props.onAdd === 'function') {
      this.props.onAdd(items);
    }
  }

  handleResetNewItems() {
    /* remove status checked to new items list */
    if (typeof this.props.onResetNewItemList === 'function') {
      this.props.onResetNewItemList();
    }
  }

  render() {
    const {
      attributeList,
      valuesSelectedList,
      width,
      listClassName,
      className,
    } = this.props;
    const styles = require('./AdminMetadataList.less');

    if (!this.props.loaded || this.props.loading) {
      return <Loader type="content" style={{ 'left': '50%', 'height': '5rem' }} />;
    }

    // Filter selected values
    const attributesAvailableList = attributeList.map(obj => {
      const tmpObj = { ...obj };
      if (obj.values && obj.values.length) {
        tmpObj.values = tmpObj.values.filter(vl => valuesSelectedList.filter(item => item.id === vl.id).length === 0);
      }

      if (!tmpObj.values || tmpObj.values.length === 0) tmpObj.hide = true;
      return tmpObj;
    });

    const cx = classNames.bind(styles);
    const classes = cx({
      Metadata: true,
    }, className);
    const selectedListClasses = cx({
      itemList: true,
    }, listClassName);

    return (
      <section className={classes} style={{ width: (width + 2) + 'px' }}>
        <div className={styles.addContainer} style={{ width: width + 'px' }}>
          <AdminCustomSelect
            attributeList={attributesAvailableList.filter(obj => !obj.hide)}
            onAdd={this.handleOnAdd}
            onReset={this.handleResetNewItems}
          />
        </div>

        {valuesSelectedList && valuesSelectedList.length > 0 && <ul className={selectedListClasses} style={{ width: width + 'px' }}>
          {valuesSelectedList.map((result) => (
            <li key={result.id}>
              <AdminMetadataItem
                valueSelected={result}
                valuesSelectedList={valuesSelectedList}
                attributeList={attributeList}
                onChange={this.handleChange}
                onDelete={this.handleDelete}
              />
            </li>
          ))}
        </ul>}
      </section>
    );
  }
}
