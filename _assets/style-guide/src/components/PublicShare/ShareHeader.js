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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import UserItem from 'components/UserItem/UserItem';
import Select from 'react-select';

import Btn from 'components/Btn/Btn';

/**
 * a message box for showing the title, date, and user simple info, need to put the user object as props
 */
export default class ShareHeader extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    title: PropTypes.string,

    /** date format is */
    date: PropTypes.string,

    /** File can be downloaded */
    isDownloadDisabled: PropTypes.bool,

    showDownload: PropTypes.bool,

    /** Allows to share files */
    showShare: PropTypes.bool,

    /** user object */
    user: PropTypes.object,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** Allows to download an specific file */
    onDownloadFileClick: function (props) {
      if (props.showDownload && typeof props.onDownloadFileClick !== 'function') {
        return new Error('onDownloadFileClick is required when showDownload is provided.');
      }
      return null;
    },

    /** Allows to forward content */
    onHandleShareClick: function (props) {
      if (props.showShare && typeof props.onHandleShareClick !== 'function') {
        return new Error('onHandleShareClick is required when showShare is provided.');
      }
      return null;
    },

    /** if onClick is false or undefined, the user item's style would be un clickable */
    onHandleFileClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    isDownloadDisabled: false,
    showDownload: true,
    showShare: true,
    strings: {
      share: 'Share',
      download: 'Download'
    },
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleDownloadFileClick(event) {
    if (typeof this.props.onDownloadFileClick === 'function') {
      this.props.onDownloadFileClick(event, this.props);
    }
  }

  render() {
    const {
      activeFileId,
      companyLogoUrl,
      files,
      isDownloadDisabled,
      onHandleFileClick,
      onHandleShareClick,
      showDownload,
      showShare,
      user,

      className,
      strings,
    } = this.props;
    const styles = require('./ShareHeader.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ShareHeader: true
    }, className);

    const shareBtn = cx({
      btn: true,
      share: true,
      desktop: true
    }, className);

    const shareBtnMobile = cx({
      btn: true,
      share: true,
      mobile: true
    }, className);

    const downloadBtn = cx({
      btn: true,
      disabled: isDownloadDisabled,
      download: true
    }, className);

    const currentFile = files.find(item => item.id === activeFileId);

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.left}>
          {currentFile &&
            <div className={styles.headerSubtitle}>
              <div className={styles.selectContainer}>
                <span className={styles.filesText}>Files: </span>
                <Select
                  className={styles.select}
                  value={{ label: currentFile.name, value: currentFile.id }}
                  options={files.map(f => ({ label: f.name, value: f.id, className: styles.menuOption }))}
                  clearable={false}
                  searchable={false}
                  onChange={onHandleFileClick}
                />
                <div className={styles.fileCount}>{files.length}</div>
              </div>
              <div className={styles.downloadShareContainer}>
                {showDownload && currentFile &&
                  <Btn
                    className={downloadBtn} disabled={isDownloadDisabled} data-name="download"
                    data-type="download" data-url={currentFile.downloadUrl} onClick={this.handleDownloadFileClick}
                  >{strings.download}</Btn>
                }
                <div className={styles.mobileDivider} />
                {showShare && currentFile &&
                  <Btn className={shareBtnMobile} data-name="share" onClick={onHandleShareClick}>{strings.share}</Btn>
                }
              </div>
            </div>
          }

        </div>
        <div className={styles.center}>
          <div className={styles.companyLogo} style={{ backgroundImage: 'url(' + companyLogoUrl + ')' }} />
          {user && <UserItem
            className={styles.right}
            thumbSize="tiny"
            noLink
            {...user}
          />}
          {showShare && currentFile &&
            <Btn className={shareBtn} data-name="share" onClick={onHandleShareClick}>{strings.share}</Btn>
          }
        </div>
      </div>
    );
  }
}
