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

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import CustomSelect from './CustomSelect';
import Loader from 'components/Loader/Loader';
import UserMetadataItem from './UserMetadataItem';

const messages = defineMessages({
  addAttributes: { id: 'add-attributes', defaultMessage: 'Add attributes' },
});

/**
 * UserMetadata
 */
export default class UserMetadata extends PureComponent {
  static propTypes = {
    attributeList: PropTypes.array,
    valuesList: PropTypes.array,
    valuesSelectedList: PropTypes.array,

    onChange: PropTypes.func,
    onDelete: PropTypes.func,

    onAdd: PropTypes.func,
    onResetNewItemList: PropTypes.func,
    onChangeNewItem: PropTypes.func,

    userMetadataLoaded: PropTypes.bool,
    userMetadataLoading: PropTypes.bool,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchFilter: ''
    };
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
    this.setState({ 'searchFilter': '' });

    /* Add selected items to metadata */
    if (typeof this.props.onAdd === 'function') {
      this.props.onAdd(items);
    }
  }

  handleResetNewItems() {
    this.setState({ 'searchFilter': '' });

    /* remove status checked to new items list */
    if (typeof this.props.onResetNewItemList === 'function') {
      this.props.onResetNewItemList();
    }
  }

  handleChangeNewItems(event, item, toggle) {
    if (typeof this.props.onChangeNewItem === 'function') {
      this.props.onChangeNewItem(item, toggle);
    }
  }

  handleOnFilterChange(newFilter) {
    this.setState({ 'searchFilter': newFilter });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      attributeList,
      valuesList,
      valuesSelectedList,
    } = this.props;
    const styles = require('./UserMetadata.less');
    const cx = classNames.bind(styles);
    const headingClasses = cx({
      //'icon-copy': true,
      headingAdd: true,
    });

    if (!this.props.userMetadataLoaded || this.props.userMetadataLoading) {
      return <Loader type="content" style={{ 'left': '50%', 'height': '5rem' }} />;
    }

    // Translations
    const strings = generateStrings(messages, formatMessage);

    let valueListFiltered = valuesList;
    if (this.state.searchFilter) {
      valueListFiltered = valueListFiltered.filter(obj => obj.attributeValue.toLowerCase().indexOf(this.state.searchFilter.toLowerCase()) > -1);
    }

    return (
      <section className={styles.userMetadata}>
        {valuesSelectedList && valuesSelectedList.length > 0 && <ul className={styles.itemList}>
          {valuesSelectedList.map((result) => (
            <li key={result.id}>
              <UserMetadataItem
                valueSelected={result}
                attributeList={attributeList}
                valuesList={valuesList}
                onChange={this.handleChange}
                onDelete={this.handleDelete}
              />
            </li>
          ))}
        </ul>}

        <div className={styles.addContainer}>
          <h4 className={headingClasses}>{strings.addAttributes}</h4>
          <CustomSelect
            valuesList={valueListFiltered}
            onReset={this.handleResetNewItems}
            onChange={this.handleChangeNewItems}
            onAdd={this.handleOnAdd}
            onFilterChange={this.handleOnFilterChange}
          />
        </div>
      </section>
    );
  }
}
