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
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import FileItem from 'components/FileItem/FileItem';
import autobind from 'class-autobind';

export default class BulkUserImportUpload extends Component {
  static propTypes = {
    onFileDropAccepted: PropTypes.func,
    onSampleCsvClick: PropTypes.func,
    onFileUploading: PropTypes.func,
    strings: PropTypes.object,

    heading: PropTypes.string,
    message: PropTypes.string,
    showSampleFiles: PropTypes.bool
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    showSampleFiles: false,
  };

  constructor(props) {
    super(props);
    // refs
    this.state = {
      forceReject: false
    };
    this.fileDropzone = null;
    autobind(this);
  }

  handleBrowseClick(event) {
    event.preventDefault();
    if (this.fileDropzone) {
      this.fileDropzone.open();
    }
  }

  /**
   * Files
   */
  handleFileDropAccepted(files) {
    if (typeof this.props.onFileDropAccepted === 'function' && !this.fileDropzone.isFileDialogActive) {
      this.props.onFileDropAccepted(files);
    }
  }

  handleFileDropRejected(files) {
    if (typeof this.props.onFileDropRejected === 'function') {
      this.props.onFileDropRejected(files);
    }
  }

  handleFileDialogCancel() {
    this.fileDropzone.isFileDialogActive = false;
    this.setState({
      forceReject: false
    });
  }

  handleDragOver(event) {
    /*eslint-disable */
    if (this.fileDropzone.isFileDialogActive && !this.state.forceReject) {
      this.setState({
        forceReject: true
      })
    } else if (this.state.forceReject) {
      this.setState({
        forceReject: false
      })
    }

    if (event.dataTransfer) {
      if (this.fileDropzone.node.className.indexOf('Reject') >=0 || this.fileDropzone.isFileDialogActive) {
        event.dataTransfer.dropEffect = 'none';
      } else {
        event.dataTransfer.dropEffect = 'copy';
      }
    }
    /*eslint-enable */
  }

  render() {
    const {
      heading,
      message,
      strings,
    } = this.props;

    const styles = require('./BulkUserImportUpload.less');
    const customClasses = `${styles.blankslateWrap} ${styles.blankslateMessage}`;

    let dropzoneClasses = styles.thumbnailDropzone;

    if (this.state.forceReject) {
      dropzoneClasses = `${styles.thumbnailDropzone} ${styles.thumbnailDropzoneReject}`;
    }

    return (
      <div className={styles.bulkUserImportUploadContainer}>
        <Dropzone
          ref={(node) => { this.fileDropzone = node; }}
          accept=".csv,text/csv,application/vnd.ms-excel"
          multiple={false}
          disableClick
          className={dropzoneClasses}
          activeClassName={styles.thumbnailDropzoneActive}
          rejectClassName={styles.thumbnailDropzoneReject}
          onDropAccepted={this.handleFileDropAccepted}
          onDropRejected={this.handleFileDropRejected}
          onDragOver={this.handleDragOver}
          onFileDialogCancel={this.handleFileDialogCancel}
        >
          <Blankslate
            className={customClasses}
            heading={heading}
            message={message}
            iconSize={32}
            icon={
              <FileItem
                thumbSize="large"
                grid
                id={1}
                category="csv"
                description=""
                onClick={this.handleBrowseClick}
              />
            }
          />
          <Btn inverted onClick={this.handleBrowseClick} className={styles.browseButton}>{strings.browse}</Btn>
        </Dropzone>
        {this.props.showSampleFiles && <Fragment>
          <p className={styles.downloadSampleCSV}>{strings.downloadSampleCSV}</p>
          <div className={styles.sampleContainer}>
            <p>{strings.sample}</p>
            <span className={styles.downloadIcon} onClick={this.props.onSampleCsvClick} />
          </div>
        </Fragment>}
      </div>
    );
  }
}
