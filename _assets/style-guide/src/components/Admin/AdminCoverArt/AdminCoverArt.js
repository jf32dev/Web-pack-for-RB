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

import MultiSelect from 'components/MultiSelect/MultiSelect';
import TriggerList from 'components/TriggerList/TriggerList';
import TabItem from 'components/TabItem/TabItem';

/**
 * Cover Art page
 */
export default class AdminCoverArt extends PureComponent {
  static propTypes = {
    /** input search tags [{ label, value }]*/
    searchTags: PropTypes.array,

    /** image list*/
    list: PropTypes.array,

    /** the same as TriggerList*/
    isLoaded: PropTypes.bool,
    /** the same as TriggerList*/
    isLoading: PropTypes.bool,
    /** the same as TriggerList*/
    isLoadingMore: PropTypes.bool,
    /** the same as TriggerList*/
    isComplete: PropTypes.bool,

    /** sort the list*/
    sort: PropTypes.oneOf(['asc', 'desc']),
    /** the same as TriggerList*/
    onGetList: PropTypes.func,

    onClick: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    searchTags: [],
    list: [],
    strings: {
      recentlyUploaded: 'Recently Uploaded',
    }
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }


  handleAddValue(event, context) {
    // Add new item selected
    this.updateValues({
      searchTags: [
        ...this.props.searchTags,
        { value: context.value, label: context.label },
      ]
    });
  }

  handleMultiRemove(event, context) {
    this.updateValues({
      searchTags: this.props.searchTags.filter(o => o.value !== context.value)
    });
  }

  handlePopValue() {
    const { searchTags } = this.props;
    if (Array.isArray(searchTags) && searchTags.length) {
      this.updateValues({
        searchTags: searchTags.slice(0, searchTags.length - 1)
      });
    }
  }

  updateValues(update) {
    const { onUpdate } = this.props;

    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate(update);
    }
  }

  render() {
    const {
      className,
      style,
      strings,
      searchTags,
      list,
      isLoaded,
      isLoading,
      isLoadingMore,
      isComplete,
      sort,
      onGetList,
      onClick,
    } = this.props;
    const styles = require('./AdminCoverArt.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminCoverArt: true,
    }, className);

    const recentlyUploadedClasses = cx({
      recentlyUploaded: true,
      asc: sort === 'asc',
      desc: sort === 'desc'
    }, className);

    return (
      <div className={classes} style={style}>
        <MultiSelect
          value={searchTags}
          placeholder="Please search me!"
          keyValue="value"
          keyLabel="label"
          multi
          onAddValue={this.handleAddValue}
          canRemove
          onInputChange={() => {}}
          onRemoveClick={this.handleMultiRemove}
          onPopValue={this.handlePopValue}
          backspaceRemoves
        />
        <div
          className={recentlyUploadedClasses}
          onClick={onClick}
          data-type={sort}
          data-name="recentlyUploaded"
        >
          {strings.recentlyUploaded}
        </div>
        <div className={styles.coverArtImages}>
          <TriggerList
            list={list}
            isLoaded={isLoaded}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            isComplete={isComplete}
            onGetList={onGetList}
            listProps={{
              itemComponent: TabItem,
              grid: true,
              showThumb: true,
              noLink: true,
              onItemClick: onClick,
              itemProps: {
                thumbWidth: '10rem'
              },
            }}
          />
        </div>
      </div>
    );
  }
}
