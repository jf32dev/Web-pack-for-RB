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
import _get from 'lodash/get';
import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import Loader from 'components/Loader/Loader';

// Common list
import List from 'components/List/List';

/**
 * reusable component for group list, could use input to filter the list
 */
export default class GroupList extends PureComponent {
  static propTypes = {
    /** Active groups */
    activeGroups: PropTypes.array,

    /** all the groups when user click the input box */
    all: PropTypes.array,

    /** Show activeGroups list */
    showList: PropTypes.bool,

    placeholder: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    noResultsInSearchPlaceholder: PropTypes.string,

    /** input callback */
    onSearchInput: PropTypes.func,

    /** add */
    onAddGroupItem: PropTypes.func,

    /** delete */
    onRemoveGroupItem: PropTypes.func,

    onScroll: PropTypes.func,

    loadingMore: PropTypes.bool,

    loading: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    activeGroups: [],
    all: [],
    showList: true,
    placeholder: 'Search...',
    noResultsInSearchPlaceholder: '',
    noResultsInSearchMessage: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isSearchVisible: false,
    };
    this.isMouseOver = true;

    this.handleDebounceChange = _compose(
      _debounce(props.onSearchInputChange.bind(this), 300),
      _clone
    );
    autobind(this);
  }

  componentDidMount() {
    //FIXME have to use mousedown, may have other solution
    window.addEventListener('mousedown', this.handleWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleWindowClick);
  }

  handleClick(e) {
    const { type } = e.currentTarget;
    if (type === 'text' && !this.state.isSearchVisible) {
      this.setState({
        isSearchVisible: true,
      });
    }
  }

  handleWindowClick(event) {
    if (!this.isMouseOver && this.state.isSearchVisible) {
      this.setState({ isSearchVisible: false });
      event.stopPropagation();
    }
  }

  handleMouseOut() {
    if (this.isMouseOver) {
      this.isMouseOver = false;
    }
  }

  handleMouseOver() {
    if (!this.isMouseOver) {
      this.isMouseOver = true;
    }
  }

  //handle props methods
  handleGroupListClick(e) {
    const { dataset } = e.currentTarget;
    const action = _get(dataset, 'action', false);
    const id = _get(dataset, 'id', false);

    if (action === 'add') {
      this.handleUpdate(Number(id), 'onAddGroupItem');
    } else if (action === 'delete') {
      this.handleUpdate(Number(id), 'onRemoveGroupItem');
    }
  }

  handleUpdate(value, method) {
    if (this.props[method] && typeof this.props[method] === 'function') {
      this.props[method](value);
    }
  }

  render() {
    const {
      activeGroups,
      all,
      showList,
      placeholder,
      onScroll,
      noResultsInSearchPlaceholder,
      noResultsInSearchMessage,
      loadingMore,
      className,
      style
    } = this.props;
    const { isSearchVisible } = this.state;
    const styles = require('./GroupList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      GroupList: true,
      displayGroupList: isSearchVisible
    }, className);

    const searchListClasses = cx({
      searchList: true,
      display: isSearchVisible
    });

    const inputClasses = cx({
      input: true,
      displayInput: true
    });

    // Pre-select items from search list
    const allGroups = all.map(obj => {
      const tmpItem = obj;
      tmpItem.isActive = activeGroups.findIndex(ag => (+ag.id === +obj.id)) > -1;
      tmpItem.isSelected = tmpItem.isActive; // backward compatibility
      return tmpItem;
    });
    return (
      <div className={classes} style={style}>
        <div className={inputClasses}>
          <Text
            icon="search"
            name="search"
            data-action="search"
            placeholder={placeholder}
            onClick={this.handleClick}
            onChange={this.handleDebounceChange}
            onMouseOut={this.handleMouseOut}
            onMouseOver={this.handleMouseOver}
          />
        </div>
        <div
          className={searchListClasses} onMouseOut={this.handleMouseOut} onMouseOver={this.handleMouseOver}
          onScroll={onScroll}
        >
          <div className={styles.searchResultListContainer}>
            <List
              list={allGroups.map(item => ({
                ...item,
                id: Number(item.id),
                className: `${styles.groupItemDiv} ${item.isSelected || item.isActive ? styles.groupItemActived : ''}`,
              }))}
              itemProps={{
                thumbSize: 'small',
                showThumb: true,
                showAdmin: true,
                showAdd: true,
                onAddClick: this.handleGroupListClick,
                onTickClick: this.handleGroupListClick
              }}
              onItemClick={() => {}}
              keyPrefix="1"
              className={styles.searchResultList}
              emptyHeading={noResultsInSearchPlaceholder}
              emptyMessage={noResultsInSearchMessage}
              icon="group"
            />
            {loadingMore && <Loader type="content" style={{ margin: '0 auto' }} />}
          </div>
        </div>
        {showList && <div className={styles.groupItems}>
          <List
            list={activeGroups.map(item => ({
              ...item,
              id: Number(item.id)
            }))}
            itemProps={{
              className: styles.groupItemDiv,
              thumbSize: 'small',
              showThumb: true,
              showAdmin: true,
              showAdministratorCheckbox: this.props.showAdministratorCheckbox,
              onAdministratorCheckboxClick: this.props.onAdministratorCheckboxClick,
              showDelete: true,
              onDeleteClick: this.handleGroupListClick,
            }}
            onItemClick={() => {}}
            keyPrefix="2"
            className={styles.List}
            emptyHeading={noResultsInSearchPlaceholder}
            emptyMessage={noResultsInSearchMessage}
            icon="group"
          />
        </div>}
      </div>
    );
  }
}
