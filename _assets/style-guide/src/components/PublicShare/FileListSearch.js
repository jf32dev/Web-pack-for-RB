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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import FileList from './FileList/FileList';
import Accordion from 'components/Accordion/Accordion';
import Text from 'components/Text/Text';

/**
 * shows files list and make the search
 */
export default class FileListSearch extends PureComponent {
  static propTypes = {
    /** array of files */
    list: PropTypes.array,

    /** download all btn event */
    onDownloadAllClick: PropTypes.func,

    /** single download btn event */
    onDownloadFileClick: PropTypes.func,

    onActiveFilePosition: PropTypes.func,

    /** files list item click event */
    onFileClick: PropTypes.func,

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

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    emptyHeading: 'Empty',
    emptyMessage: 'No files are available',
    strings: {
      files: 'Files',
      searchFiles: 'Search files',
      name: 'Name',
    },
    activeId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
    autobind(this);
  }

  // Search ============= Start
  handleChange(e) {
    this.setState({
      searchValue: e.currentTarget.value
    });
    // this.updateValues(e.currentTarget.value);
  }

  handleClear() {
    this.setState({
      searchValue: ''
    });
    this.updateValues('');
  }

  render() {
    const { strings, list, onDownloadAllClick, onDownloadFileClick, onFileClick, style, activeId, onActiveFilePosition } = this.props;
    const styles = require('./FileListSearch.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FileListSearch: true
    }, this.props.className);

    return (
      <div className={classes} style={style}>
        <Accordion
          title={strings.files}
          defaultOpen
          className={styles.accordion}
        >
          <Text
            id="search"
            icon="search"
            data-type="search"
            placeholder={strings.searchFiles}
            value={this.state.searchValue}
            showClear={this.state.searchValue !== ''}
            onChange={this.handleChange}
            onClearClick={this.handleClear}
            className={styles.textInput}
          />
          <FileList
            list={list}
            search={this.state.searchValue}
            onDownloadAllClick={onDownloadAllClick}
            onDownloadFileClick={onDownloadFileClick}
            onActiveFilePosition={onActiveFilePosition}
            onFileClick={onFileClick}
            activeId={activeId}
            className={styles.fileList}
          />
        </Accordion>
      </div>
    );
  }
}
