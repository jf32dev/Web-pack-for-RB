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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import SVGIcon from './SVGIcon';
import List from 'components/List/List';
import AdminFormField from 'components/Admin/AdminUtils/FormField/FormField';

/**
 * shows groups of users
 */
export default class UserGroup extends PureComponent {
  static propTypes = {
    allGroupList: PropTypes.array,

    nickname: PropTypes.string,

    name: PropTypes.string,

    onChange: PropTypes.func,

    isEdit: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      userGroups: 'User Groups',
      searchUserGroups: 'Search user groups',
      selected: 'Selected',
      userSelectedInfo: '4 User Group selected',
      usersSelectedInfo: '4 User Groups selected',
      serviceName: 'Service name',
    },
    allGroupList: [],
    nickname: '',
    name: '',
    isEdit: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      isSelected: props.isEdit,
    };
    autobind(this);
  }

  handleInputChange (update) {
    this.setState(update);
    this.updateValues({
      action: 'groupSearch',
      value: update.search
    });
  }

  handleCheckboxClick(e) {
    this.updateValues({
      action: 'groupChecked',
      id: e.currentTarget.name,
      value: e.currentTarget.checked
    });

    if (this.state.isSelected) {
      this.setState({
        isSelected: false
      });
    }
  }

  handleClearSearch() {
    this.setState({
      search: ''
    });
    this.updateValues({
      action: 'groupSearch',
      value: ''
    });
  }

  handleClick() {
    this.updateValues({
      action: 'sortUser',
    });

    if (!this.state.isSelected) {
      this.setState({
        isSelected: true
      });
    }
  }

  updateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  render() {
    const styles = require('./UserGroup.less');
    const { nickname, name, strings, allGroupList, onScroll, loadingMore } = this.props;
    const { search, isSelected } = this.state;

    const cx = classNames.bind(styles);
    const classes = cx({
      UserGroup: true
    }, this.props.className);

    const selectedLength = allGroupList.filter(item => item.isSelected).length;

    return (
      <div className={classes}>
        {nickname && <div className={styles.folderConnectionTitle}>
          <div className={styles.label}>{strings.userGroups}</div>
          <div><SVGIcon type={nickname} className={styles.svgIcon} /><span className={styles.name}>{name}</span></div>
        </div>}
        <div>
          <h4>
            {selectedLength > 1 ? strings.usersSelectedInfo : strings.userSelectedInfo}
          </h4>
          <AdminFormField
            type="text"
            dataKey="search"
            id="search"
            icon="search"
            className={styles.search}
            placeholder={strings.searchUserGroups}
            value={search}
            showClear={search.length > 0}
            onChange={this.handleInputChange}
            onClearClick={this.handleClearSearch}
          />
        </div>
        <div className={styles.selected}>
          <h5 onClick={this.handleClick} data-type="selected" className={isSelected ? '' : styles.deselect}>
            {strings.selected}
            {isSelected && <span />}
          </h5>
        </div>
        <div className={styles.list}>
          <List
            list={allGroupList.map(item => ({
              ...item,
              id: +item.id,
              className: `${styles.groupItemDiv} ${item.isSelected || item.isActive ? styles.groupItemActived : ''}`,
            }))}
            itemProps={{
              thumbSize: 'small',
              showCheckbox: true,
              onCheckboxClick: this.handleCheckboxClick,
              search,
            }}
            onItemClick={() => {}}
            keyPrefix="1"
            className={styles.searchResultList}
            emptyHeading={strings.noResultsInSearchPlaceholder}
            emptyMessage={strings.noResultsInSearchMessage}
            icon="group"
            loadingMore={loadingMore}
            onScroll={onScroll}
          />
        </div>
      </div>
    );
  }
}
