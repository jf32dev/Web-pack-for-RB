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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Btn from 'components/Btn/Btn';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import Loader from 'components/Loader/Loader';

/**
 * Display Association lock list
 */
export default class AssociationList extends PureComponent {
  static propTypes = {
    /** list data, sample: [{"id":"242","name":"Alex Macfarlane Smith","email":"alex.macfarlane.smith@bigtincan.com","totalDevices":"14 Devices","dateAdded":"16/05/2016"}]  */
    list: PropTypes.array,

    /** onClick callback method to show the delete warning modal and total devices detail modal  */
    onClick: PropTypes.func,

    onSort: PropTypes.func,

    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    list: [],
    emptyHeading: 'Empty',
    emptyMessage: 'No files are available',
    strings: {
      name: 'Name',
      totalDevices: 'Total Devices',
      dateAdded: 'Date Added',
      delete: 'Delete'
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      sortKey: '',
      reverseSort: false,
      filter: null,
    };

    this.handleChangeDebounce = _compose(
      _debounce(this.handleChange.bind(this), 300),
      _clone
    );

    autobind(this);
  }

  sortList(list, key, reverse, search) {
    const { onSort } = this.props;
    if (onSort && typeof onSort === 'function') {
      onSort(list, key, reverse, search);
    }
  }

  handleChange(event) {
    event.preventDefault();
    const { dataset, type, value } = event.currentTarget;
    const key = event.currentTarget.dataset.key;
    let newState = {};

    if (dataset.action === 'sort') {
      newState = { sortKey: key, filter: this.state.filter };

      if (key === this.state.sortKey) {
        newState.reverseSort = !this.state.reverseSort;
      }
    } else if (dataset.action === 'filter') {
      newState = { filter: this.state.filter === null ? '' : null };
    } else if (type === 'text' || dataset.action === 'clear') {
      newState = { filter: value || '' };
    }

    this.sortList(
      this.props.list,
      key,
      typeof newState.reverseSort === 'undefined' || newState.reverseSort === null ? this.state.reverseSort : newState.reverseSort,
      newState.filter || ''
    );
    this.setState(newState);
  }

  render() {
    const {
      strings,
      onClick,
      list,
      loadingMore,
    } = this.props;
    const { filter, sortKey } = this.state;
    const styles = require('./AssociationList.less');
    const cx = classNames.bind(styles);
    const listClasses = cx({
      List: true,
      listList: true,
      inline: this.props.inline
    }, this.props.className);

    const sortHeaderClasses = cx({
      sortHeadings: true,
      reverseSort: this.state.reverseSort,
    });

    return (
      <div className={listClasses} style={this.props.style}>
        <header className={styles.header}>
          <ul className={sortHeaderClasses}>
            {['name', 'totalDevices', 'dateAdded'].map(item => (
              <li
                key={item}
                className={styles[item] + ' ' + (sortKey === item ? styles.activeSortKey : styles.sortKey)}
              >
                <span
                  data-key={item}
                  data-action="sort"
                  onClick={this.handleChange}
                >
                  {strings[item]}
                </span>
                {item === 'name' && <Btn
                  data-action="filter"
                  icon="filter"
                  borderless
                  onClick={this.handleChange}
                  className={filter !== null ? styles.active : undefined}
                />}
              </li>
            ))}
            <li />
          </ul>
        </header>
        <ol>
          {filter !== null && <li>
            <Text
              className={styles.filterText}
              onChange={this.handleChangeDebounce}
              onClearClick={this.handleChange}
              showClear
            />
          </li>}
          {list.map((obj, index) => (
            <li key={index}>
              <div><div>{obj.name}</div><div>{obj.email}</div></div>
              <div className={styles.itemTotalDevices}>
                <span
                  onClick={onClick} data-id={obj.id} data-user={obj.name}
                  data-action="isDeviceModalVisible"
                >
                  {obj.totalDevices > 1 ? `${obj.totalDevices} ${strings.devices}` : `${obj.totalDevices} ${strings.device}`}
                </span>
              </div>
              <div><span>{obj.dateAdded}</span></div>
              <div>
                <Btn
                  onClick={onClick} warning data-id={obj.id}
                  data-name="device" data-action="isDeleteVisible"
                >{strings.delete}</Btn>
              </div>
            </li>
          ))}
        </ol>
        {loadingMore && <Loader className={styles.listLoader} type="content" />}
      </div>
    );
  }
}
