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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Blankslate from 'components/Blankslate/Blankslate';
import FileItem from 'components/FileItem/FileItem';
import filesize from 'filesize';

/**
 * <code>FileList</code> behaves differently to a standard <code>List</code>
 */
export default class FileList extends PureComponent {
  static propTypes = {
    search: PropTypes.string,
    /** items passed to <code>FileItem</code> */
    list: PropTypes.array,

    /** "Download All" link will also show in header menu */
    onDownloadAllClick: PropTypes.func,

    /** Passed to <code>FileItem</code> as <code>onDownloadClick</code> */
    onDownloadFileClick: PropTypes.func,

    /** Passed to <code>FileItem</code> as <code>onClick</code> */
    onFileClick: PropTypes.func,

    onActiveFilePosition: PropTypes.func,

    /** Sets <code>isActive</code> on list item if ID matches */
    activeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /** DEPRECATED - use activeId instead */
    selectedId: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use activeId.'
        );
      }
      return null;
    },

    emptyHeading: PropTypes.string,
    emptyMessage: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object,

    itemClassName: PropTypes.string,
    itemStyle: PropTypes.object
  };

  static defaultProps = {
    list: [],
    ignore: [],
    emptyHeading: 'Empty',
    emptyMessage: 'No files are available',
    strings: {
      name: 'Name',
      downloadAll: 'Download All'
    },
    search: '',
    activeId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      // selectView: this.props.select,
      // selectedCount: 0,
      sortedList: this.props.list,
      sortKey: 'name',
      reverseSort: false,
    };

    this.nodes = [];
    autobind(this);
  }

  componentDidMount() {
    if (this.props.onActiveFilePosition && +this.props.activeId > 0) {
      this.props.onActiveFilePosition(this.nodes[this.props.activeId].offsetTop);
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextProps.list.length && nextProps.list !== this.props.list) {
      this.sortList(nextProps.list, nextState.sortKey, nextState.reverseSort);
    }

    if (nextState.sortKey !== this.state.sortKey || nextState.reverseSort !== this.state.reverseSort) {
      this.sortList(nextProps.list, nextState.sortKey, nextState.reverseSort);
    }
  }

  sortList(list, key, reverse) {
    let newList = [...list];

    // Different sorting methods for strings/integers
    switch (key) {
      case 'name':
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

  handleSortClick(event) {
    event.preventDefault();
    const key = event.currentTarget.dataset.key;
    const newState = { sortKey: key };

    if (key === this.state.sortKey) {
      newState.reverseSort = !this.state.reverseSort;
    }

    this.setState(newState);
  }

  render() {
    const {
      onDownloadAllClick,
      onDownloadFileClick,
      activeId,
      strings,
    } = this.props;
    const { sortedList } = this.state;
    const styles = require('./FileList.less');
    const cx = classNames.bind(styles);
    const listClasses = cx({
      FileList: true,
      listList: true,
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
          middle
          heading={this.props.emptyHeading}
          message={this.props.emptyMessage}
        />
      );
    }

    return (
      <div className={listClasses} style={this.props.style}>
        <header className={styles.header}>
          <ul className={sortHeaderClasses}>
            <li
              data-key="name"
              className={this.state.sortKey === 'name' ? styles.activeSortKey : styles.sortKey}
              onClick={this.handleSortClick}
            >
              {strings.name}
            </li>
            <li onClick={onDownloadAllClick} data-type="downloadAll">
              <span className={styles.downloadIcon}>{strings.downloadAll}</span>
            </li>
          </ul>
        </header>
        <ol>
          {sortedList.map((file, index) => _get(file, 'name', '').toLowerCase().indexOf(_get(this.props, 'search', '').toLowerCase()) > -1 && (
            <li
              key={index}
              className={file.id.toString() === activeId.toString() ? styles.isActive : ''}
              ref={node => { this.nodes[file.id] = node; }}
            >
              <FileItem
                thumbSize="small"
                thumbWidth={this.props.thumbWidth}
                className={this.props.itemClassName}
                onClick={this.props.onFileClick}
                style={this.props.itemStyle}
                description=""
                {...file}
              >
                <div className={styles.itemTitle}>
                  <div className={styles.name} title={file.name}>{file.name}</div>
                  {file.size && <div className={styles.size}>
                    {filesize(file.size)}
                  </div>}
                </div>
                {file.downloadUrl &&
                <div
                  className={styles.download} data-type="download" data-url={file.downloadUrl}
                  onClick={onDownloadFileClick}
                >
                  <span
                    id={file.id}
                    className={styles.downloadIcon}
                  />
                </div>}
              </FileItem>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
