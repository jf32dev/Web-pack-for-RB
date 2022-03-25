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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';
import FileItem from 'components/FileItem/FileItem';

const messages = defineMessages({
  more: { id: 'more', defaultMessage: 'More' },
  select: { id: 'select', defaultMessage: 'Select' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  downloadSelected: { id: 'download-selected', defaultMessage: 'Download Selected' },
  viewSelected: { id: 'view-selected', defaultMessage: 'View Selected' },
});

/**
 * <code>FileList</code> behaves differently to a standard <code>List</code>
 */
export default class FileList extends Component {
  static propTypes = {
    /** items passed to <code>FileItem</code> */
    list: PropTypes.array,

    /** file categories to ignore */
    ignore: PropTypes.array,

    /** grid view */
    grid: PropTypes.bool,

    /** show file info icon */
    showInfo: PropTypes.bool,

    /** Show checkbox (passed to FileItem) */
    showCheckbox: PropTypes.bool,

    /** Shows sortable header */
    showHeader: PropTypes.bool,

    /** Shows file thumbnails if available */
    showThumb: PropTypes.bool,

    /** Pass valid size: small, medium, large */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Show Download All/Selected options */
    showDownload: PropTypes.bool,

    /** toggles select mode */
    onSelectToggle: PropTypes.func,

    /** can be used if you wish to change a property on toggle (i.e. <code>thumbSize</code> */
    onGridToggleClick: PropTypes.func,

    /** "Download All" link will also show in header menu */
    onDownloadAllClick: PropTypes.func,

    /** "View All" link will also show in header menu */
    onViewAllClick: PropTypes.func,

    /** "Download Selected" link will also show in header menu */
    onDownloadSelectedClick: PropTypes.func,
    onViewSelectedClick: PropTypes.func,

    /** Passed to <code>FileItem</code> as <code>onDownloadClick</code> */
    onDownloadFileClick: PropTypes.func,

    /** Passed to <code>FileItem</code> as <code>onClick</code> */
    onFileClick: PropTypes.func,
    onInfoIconClick: PropTypes.func,
    onTagMoreClick: PropTypes.func,
    /** DEPRECATED - use showCheckbox instead */
    select: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use showCheckbox.'
        );
      }
      return null;
    },

    /** DEPRECATED - use thumbSize instead */
    thumbWidth: function(props, propName, componentName) {
      if (props[propName] && !props.thumbSize) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use a valid thumbSize instead.'
        );
      }
      return null;
    },

    emptyHeading: PropTypes.string,
    emptyMessage: PropTypes.string,

    authString: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object,

    itemClassName: PropTypes.string,
    itemStyle: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    list: [],
    ignore: [],
    emptyHeading: 'Empty',
    emptyMessage: 'No files are available'
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      gridView: this.props.grid,
      selectView: this.props.showCheckbox,
      selectedCount: 0,
      sortedList: this.props.list,
      sortKey: 'sequence',
      reverseSort: false,
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.list.length) {
      this.sortList(this.props.list, this.state.sortKey, this.state.reverseSort);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.grid !== this.props.grid) {
      this.setState({ gridView: nextProps.grid });
    }

    if (nextProps.showCheckbox !== this.props.showCheckbox) {
      this.setState({ selectView: nextProps.showCheckbox });
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextProps.list.length && nextProps.list !== this.props.list) {
      this.sortList(nextProps.list, nextState.sortKey, nextState.reverseSort);
    }

    if (nextState.sortKey !== this.state.sortKey || nextState.reverseSort !== this.state.reverseSort) {
      this.sortList(nextProps.list, nextState.sortKey, nextState.reverseSort);
    }

    // Get number of selected files
    if (nextState.selectView && !this.state.selectView || nextState.sortedList !== this.state.sortedList) {
      const selectedCount = nextProps.list.filter(f => f.isSelected);
      const selectedAndNotBlocked = nextProps.list.filter(f => f.isSelected && f.downloadUrl && f.shareStatus !== 'blocked');
      this.setState({  // eslint-disable-line react/no-will-update-set-state
        selectedCount: selectedCount.length || 0,
        downloadSelectedIsValid: selectedAndNotBlocked.length > 0
      });
    }
  }

  sortList(list, key, reverse) {
    let newList = [...list];

    // Different sorting methods for strings/integers
    switch (key) {
      case 'description':
      case 'shareStatus':
      case 'category':
        if (reverse) {
          newList.sort((b, a) => a[key].localeCompare(b[key]));
        } else {
          newList.sort((a, b) => a[key].localeCompare(b[key]));
        }

        break;
      default:  // sequence, size, date
        if (reverse) {
          newList.sort((b, a) => a[key] - b[key]);
        } else {
          newList.sort((a, b) => a[key] - b[key]);
        }
        break;
    }

    if (this.props.ignore) {
      newList = this.filterIgnored(newList, this.props.ignore);
    }

    this.setState({ sortedList: newList });
  }

  filterIgnored(list, ignore) {
    const newList = list.filter(function(file) {
      return ignore.indexOf(file.category) === -1;
    });

    return newList;
  }

  handleGridToggleClick(event) {
    // Propagate event if handler is passed
    if (this.props.onGridToggleClick) {
      this.props.onGridToggleClick(event);

    // Set gridView state if no handler available
    } else {
      this.setState({ gridView: !this.state.gridView });
    }
  }

  handleSelectToggle(event) {
    // Propagate event if handler is passed
    if (this.props.onSelectToggle) {
      this.props.onSelectToggle(event);

    // Set selectView state if no handler available
    } else {
      this.setState({ selectView: !this.state.selectView });
    }
  }

  handleSortClick(event) {
    event.preventDefault();
    const key = event.currentTarget.dataset.key;
    if (key === 'tag') { return; }
    const newState = { sortKey: key };

    if (key === this.state.sortKey) {
      newState.reverseSort = !this.state.reverseSort;
    }

    this.setState(newState);
  }

  renderHeadings() {
    const { thumbSize } = this.props;
    const styles = require('./FileList.less');

    // thumbWidth is deprecated
    let width = this.props.thumbWidth || 60;
    if (thumbSize === 'medium') {
      width = '3.375rem';
    } else if (thumbSize === 'small') {
      width = '3.25 rem';
    }

    // Widths should match FileItem CSS
    const sortableHeadings = [
      { key: 'sequence', title: 'No.', width: width },
      { key: 'description', title: 'Title' },
      { key: 'shareStatus', title: 'Share Status' },
      { key: 'category', title: 'Type' },
      { key: 'size', title: 'Size' },
      { key: 'dateAdded', title: 'Date Modified' }
    ];

    return (
      sortableHeadings.map(heading =>
        (<li
          key={heading.key}
          data-key={heading.key}
          className={styles[heading.key] + ' ' + (heading.key === this.state.sortKey ? styles.activeSortKey : styles.sortKey)}
          onClick={this.handleSortClick}
          style={{ width: heading.width }}
        >
          {heading.title}
        </li>)
      )
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      showHeader,
      showDownload,
      onDownloadAllClick,
      onViewAllClick,
      onDownloadSelectedClick,
      onViewSelectedClick
    } = this.props;
    const { gridView, selectView, selectedCount, downloadSelectedIsValid, sortedList } = this.state;
    const styles = require('./FileList.less');
    const cx = classNames.bind(styles);
    const listClasses = cx({
      FileList: true,
      listList: !gridView,
      gridList: gridView,
      inline: this.props.inline
    }, this.props.className);

    const sortHeaderClasses = cx({
      sortHeadings: true,
      reverseSort: this.state.reverseSort,
    });

    // Show Blankslate if empty
    if (!sortedList.length) {
      return (
        <Blankslate
          icon="files"
          heading={this.props.emptyHeading}
          message={this.props.emptyMessage}
        />
      );
    }

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const controlBlock = () => (<div className={styles.controls}>
      <span className={styles.selectToggle} onClick={this.handleSelectToggle}>{strings.select}</span>
      <DropMenu
        data-id="file-menu"
        title={strings.more}
        width="12.5rem"
        icon="more"
        activeIcon="more-fill"
        className={styles.fileListDropMenu}
      >
        <ul>
          <li data-id="grid" className={gridView ? 'icon-list' : 'icon-grid'} onClick={this.handleGridToggleClick}>
            {gridView ? <FormattedMessage id="toggle-list" defaultMessage="Toggle List" /> : <FormattedMessage id="toggle-grid" defaultMessage="Toggle Grid" />}
          </li>
          <li data-id="select" className={styles.selectMenuItem + ' ' + (selectView ? 'icon-stop' : 'icon-stop-fill')} onClick={this.handleSelectToggle}>
            <FormattedMessage id="toggle-select" defaultMessage="Toggle Select" />
          </li>
          {(showDownload && onDownloadAllClick) && <li data-id="download-all" className="icon-download" onClick={onDownloadAllClick}>
            <FormattedMessage id="download-all" defaultMessage="Download All" />
          </li>}
          {onViewAllClick && <li data-id="view-all" className="icon-search" onClick={onViewAllClick}>
            <FormattedMessage id="view-all" defaultMessage="View All" />
          </li>}
        </ul>
      </DropMenu>
    </div>);

    return (
      <div className={listClasses} style={this.props.style}>
        {showHeader && <header className={styles.header}>
          {selectView && <div className={styles.selectControls}>
            <Btn onClick={this.handleSelectToggle} alt small>{strings.cancel}</Btn>
            <span className={styles.selectedCount}>
              {selectedCount > 0 && <FormattedMessage
                id="n-files-selected"
                defaultMessage="{itemCount, plural, one {# File} other {# Files}} Selected"
                values={{ itemCount: selectedCount }}
              />}
            </span>
            {showDownload && onDownloadSelectedClick && <Btn
              onClick={onDownloadSelectedClick}
              disabled={!downloadSelectedIsValid}
              inverted
              small
            >
              {strings.downloadSelected}
            </Btn>}
            <Btn
              onClick={onViewSelectedClick} disabled={!selectedCount} inverted
              small
            >{strings.viewSelected}</Btn>
          </div>}
          {gridView && !selectView && <span className={styles.count}>
            <FormattedMessage
              id="n-files"
              defaultMessage="{itemCount, plural, one {# File} other {# Files}}"
              values={{ itemCount: sortedList.length }}
            />
          </span>}
          {!gridView && !selectView && <ul className={sortHeaderClasses}>
            { this.renderHeadings() }
            { !selectView && controlBlock() }
          </ul>}
          { (gridView || selectView) && controlBlock() }
        </header>}
        <ol>
          {sortedList.map(file => (
            <li key={file.id}><FileItem
              thumbSize={this.props.thumbSize}
              thumbWidth={this.props.thumbWidth}
              showThumb={this.props.showThumb}
              grid={gridView}
              showCheckbox={selectView}
              showDownload={showDownload}
              authString={this.props.authString}
              onClick={this.props.onFileClick}
              onDownloadClick={this.props.onDownloadFileClick}
              className={this.props.itemClassName}
              style={this.props.itemStyle}
              showInfo={this.props.showInfo}
              onInfoIconClick={this.props.onInfoIconClick}
              onTagMoreClick={this.props.onTagMoreClick}
              {...file}
              fileSettings={this.props.fileSettings}
            /></li>
          ))}
        </ol>
      </div>
    );
  }
}
