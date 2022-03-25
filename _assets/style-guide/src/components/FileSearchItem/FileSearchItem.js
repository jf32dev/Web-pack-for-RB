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
 * @package hub-web-app-v5
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import FileSearchThumb from 'components/FileSearchThumb/FileSearchThumb';
import SearchItemDescription from 'components/SearchItemDescription/SearchItemDescription';
import SearchItemInfo from 'components/SearchItemInfo/SearchItemInfo';

/**
 * Wraps FileItem with custom children.
 */
export default class FileSearchItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    filename: PropTypes.string.isRequired,
    description: PropTypes.string,
    searchResult: PropTypes.object,
    tags: PropTypes.array,
    /** Valid story data */
    story: PropTypes.object,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,
    onInfoIconClick: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string,

    bookmarks: PropTypes.array.isRequired,
    onHandleBookmarkClick: PropTypes.func.isRequired,
    onHandleShareFileClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    searchResult: {},
    authString: '',
    tags: [],
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  render() {
    const styles = require('./FileSearchItem.less');

    return (
      <div className={styles.fileSearchItem} onClick={this.handleClick}>
        <FileSearchThumb
          {...this.props}
        />
        <SearchItemDescription
          {...this.props}
          onBookmarkClick={this.props.onHandleBookmarkClick}
          onShareClick={this.props.onHandleShareFileClick}
        />
        <SearchItemInfo
          {...this.props}
        />
      </div>
    );
  }
}
