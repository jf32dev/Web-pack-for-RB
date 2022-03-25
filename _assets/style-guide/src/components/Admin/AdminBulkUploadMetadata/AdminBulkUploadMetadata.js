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
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import classNames from 'classnames/bind';

import Dropzone from 'react-dropzone';
import moment from 'moment';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import FileItem from 'components/FileItem/FileItem';
import Modal from 'components/Modal/Modal';
import SVGIcon from 'components/SVGIcon/SVGIcon';

import UploadingMetadata from './UploadingMetadata';

const messages = defineMessages({
  browse: { id: 'browse', defaultMessage: 'Browse' },
  bulkImportMetadata: { id: 'bulk-import-metadata', defaultMessage: 'Bulk Import Metadata' },
  bulkUploadUsersInfo: { id: 'upload-csv-file-users-info', defaultMessage: 'Upload a CSV with a list of users metadata to edit in bulk.' },
  dropListUserMetadataOrBrowse: { id: 'drop-list-metadata-here-browse-upload-csv', defaultMessage: 'Drop a list of users metadata here or browse to upload a CSV file.' },
  metadataUnavailable: { id: 'metadata-import-temporarily-unavailable', defaultMessage: 'Metadata import temporarily unavailable' },
  metadataUnavailableMsg: { id: 'metadata-import-temporarily-unavailable-msg', defaultMessage: 'Metadata cannot be imported until the current upload is processed.' },
  lastUpload: { id: 'last-upload', defaultMessage: 'Last upload:' },
  viewSummary: { id: 'view-summary', defaultMessage: 'View Summary' },

  uploadingFile: { id: 'uploading-file', defaultMessage: 'Uploading file' },
  waitProcessMsg: { id: 'metadata-can-not-be-imported-upload-processed', defaultMessage: 'Metadata cannot be imported until current upload is processed.' },
  viewProgress: { id: 'viewProgress', defaultMessage: 'View Progress' },

  dowloadSampleCsvFile: { id: 'download-sample-csv-file', defaultMessage: 'Download sample CSV file' },
  allUsers: { id: 'all-users', defaultMessage: 'All Users' },
  existingUsers: { id: 'n-existing-users', defaultMessage: '{totalUsers} existing users' },
  close: { id: 'close', defaultMessage: 'Close' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  status: { id: 'status', defaultMessage: 'Status' },
  processing: { id: 'processing', defaultMessage: 'Processing' },
  uploading: { id: 'uploading', defaultMessage: 'Uploading' },
});

export const PROCESSING = 'processing';
export const DONE = 'done';

/**
 * User Metadata Bulk Upload modal
 */
export default class AdminBulkUploadMetadata extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    lastUpload: PropTypes.number,
    /** Valid upload status: <code>new, processing, done</code> */
    status: PropTypes.oneOf(['new', 'processing', 'done']),

    loading: PropTypes.bool,
    isFileUploaded: PropTypes.bool,
    isVisible: PropTypes.bool,
    isUploading: PropTypes.bool,

    onClose: PropTypes.func,
    onFileDropAccepted: PropTypes.func,
    onFileDropRejected: PropTypes.func,
    onSampleCsvClick: PropTypes.func,
    onAllUsersCsvClick: PropTypes.func,
    onOpenSummary: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    isUploading: false
  };

  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      fileName: '',
    };
    // refs
    this.fileDropzone = null;
    autobind(this);
  }

  handleBrowseClick(event) {
    event.preventDefault();
    if (this.fileDropzone) {
      this.fileDropzone.open();
    }
  }

  handleOpenSummary(event) {
    event.preventDefault();
    if (typeof this.props.onOpenSummary === 'function') {
      this.props.onOpenSummary();
    }
  }

  /**
   * Files
   */
  handleFileDropAccepted(files) {
    if (typeof this.props.onFileDropAccepted === 'function') {
      this.props.onFileDropAccepted(files);
      this.setState({ fileName: files[0].name });
    }
  }

  handleFileDropRejected() {
    if (typeof this.props.onFileDropRejected === 'function') {
      this.props.onFileDropRejected();
    }
  }

  handleToggleClose() {
    this.setState({
      isUploading: !this.state.isUploading
    });
  }

  handleToggleCancel() {
    this.setState({
      isUploading: !this.state.isUploading
    });
  }

  render() {
    const {
      isFileUploaded,
      isUploading,
      isVisible,
      lastUpload,
      onClose,
      status,

      className
    } = this.props;
    const styles = require('./AdminBulkUploadMetadata.less');

    const percent = 20;
    const initialState = !isUploading && !isFileUploaded;
    const cx = classNames.bind(styles);
    const classes = cx({
      contentWrap: true,
      paddingTopBottom: initialState
    }, className);

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { totalUsers: 10 });

    const isMainModalVisible = isVisible && !(isUploading || isFileUploaded || DONE === status);

    return (
      <div>
        <Modal
          isVisible={isMainModalVisible}
          escClosesModal
          width="medium"
          headerTitle={strings.bulkImportMetadata}
          onClose={onClose}
          bodyClassName={styles.modalBody}
          footerClassName={styles.footer}
          footerChildren={(
            <div>
              <Btn
                alt
                large
                onClick={this.props.onClose}
                style={{ marginRight: '0.5rem' }}
              >
                {PROCESSING === status ? strings.close : strings.cancel}
              </Btn>
            </div>
          )}
        >
          {initialState && <div className={classes}>
            {PROCESSING === status && <div className={styles.info}>{strings.status}: <span>{strings.processing}</span></div>}
            {PROCESSING !== status && lastUpload === 0 && <div className={styles.info}>{strings.bulkUploadUsersInfo}</div>}
            {PROCESSING !== status && lastUpload > 0 && <div className={styles.info}>
              {strings.lastUpload} <span>{moment(lastUpload).format('hh:mm a - DD MMM YYYY')}</span>
              <Btn onClick={this.handleOpenSummary} className={styles.browseBtn}>{strings.viewSummary}</Btn>
            </div>}

            {PROCESSING !== status && <Dropzone
              ref={(node) => { this.fileDropzone = node; }}
              accept="text/csv"
              multiple={false}
              disableClick
              className={styles.thumbnailDropzone}
              activeClassName={styles.thumbnailDropzoneActive}
              rejectClassName={styles.thumbnailDropzoneReject}

              onDropAccepted={this.handleFileDropAccepted}
              onDropRejected={this.handleFileDropRejected}
            >
              <Blankslate
                className={styles.blankslateWrap}
                message={strings.dropListUserMetadataOrBrowse}
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

              <Btn inverted onClick={this.handleBrowseClick} className={styles.browseBtn}>{strings.browse}</Btn>
            </Dropzone>}

            {PROCESSING === status && <div className={styles.containerWrap}>
              <Blankslate
                className={styles.blankslateWrap}
                iconSize={32}
                icon={<SVGIcon type="uploadingFile" style={{ marginTop: '-0.25rem' }} />}
                heading={strings.metadataUnavailable}
                message={strings.metadataUnavailableMsg}
              />
              {/*<Btn inverted onClick={this.handleBrowseClick} className={styles.browseBtn}>{strings.browse}</Btn>*/}
            </div>}

            <div className={styles.downloadInfo}>
              <h3>{strings.dowloadSampleCsvFile}</h3>
              <Btn onClick={this.props.onAllUsersCsvClick} className={styles.browseBtn}>{strings.allUsers}</Btn>
              <Btn onClick={this.props.onSampleCsvClick} className={styles.browseBtn}>{strings.existingUsers}</Btn>
            </div>
          </div>}
        </Modal>

        <UploadingMetadata
          isVisible={isUploading || isFileUploaded || DONE === status}
          isUploading={isUploading}
          isUploaded={isFileUploaded}
          isImportCompleted={DONE === status}
          lastUploadTime={lastUpload ? moment(lastUpload).format('DD MMM YYYY') : 0}
          thumbSize="large"
          grid
          id={1}
          category="csv"
          name={this.state.fileName}
          percent={percent}
          onClose={this.props.onClose}
        />
      </div>
    );
  }
}
