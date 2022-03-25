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
 * @copyright 2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import FileItem from 'components/FileItem/FileItem';
import Modal from 'components/Modal/Modal';

const messages = defineMessages({
  uploadingMetadata: { id: 'uploading-metadata', defaultMessage: 'Uploading Metadata' },
  uploadCompleted: { id: 'upload-completed', defaultMessage: 'Upload Completed' },
  importCompleted: { id: 'import-completed', defaultMessage: 'Import Completed' },
  metadataSuccessfullyUploaded: { id: 'metadata-successfully-uploaded', defaultMessage: 'Metadata successfully uploaded' },
  metadataCurrentlyImported: { id: 'metadata-currently-being-imported', defaultMessage: 'Your metadata is currently being imported' },
  metadataSuccessfullyImported: { id: 'metadata-successfully-imported', defaultMessage: 'Metadata successfully imported' },
  metadataCompletedDate: { id: 'metadata-completed-date', defaultMessage: 'Completed {completedDate}' },

  close: { id: 'close', defaultMessage: 'Close' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  uploading: { id: 'uploading', defaultMessage: 'Uploading' },
});

/**
 * Uploading Metadata File process
 */
export default class UploadingMetadata extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    percent: PropTypes.number,

    isVisible: PropTypes.bool,
    isUploading: PropTypes.bool,
    isUploaded: PropTypes.bool,
    isImportCompleted: PropTypes.bool,
    lastUploadTime: PropTypes.string,

    onClose: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    percent: 0,
    isUploading: false,
    isUploaded: false,
    isImportCompleted: false,
    isVisible: false,
    lastUpload: 0
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      isImportCompleted,
      isUploaded,
      isUploading,
      isVisible,
      lastUploadTime,
      name,
      onClose,
      percent,

      className
    } = this.props;
    const styles = require('./UploadingMetadata.less');

    const cx = classNames.bind(styles);
    const classes = cx({
      modalBody: true,
    }, className);

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { completedDate: lastUploadTime });

    let title = strings.uploadingMetadata;
    if (isUploaded && !isImportCompleted) {
      title = strings.uploadCompleted;
    } else if (isImportCompleted) title = strings.importCompleted;

    return (
      <Modal
        isVisible={isVisible}
        escClosesModal
        width="medium"
        headerTitle={title}
        onClose={onClose}
        bodyClassName={classes}
        footerClassName={styles.footer}
        footerChildren={(
          <div>
            <Btn
              alt
              large
              onClick={this.props.onClose}
              style={{ marginRight: '0.5rem' }}
            >
              {isUploading ? strings.cancel : strings.close}
            </Btn>
          </div>
        )}
      >
        {isUploading && <div className={styles.loadingWrap}>
          <FileItem
            thumbSize="large"
            grid
            id={1}
            category="csv"
            description={name}
          />
          <div className={styles.barWrapper}>
            <div className={styles.progressHeader}>
              <span>{strings.uploading}...</span>
              <span>{percent}%</span>
            </div>
            <div className={styles.progressBar}>
              <span style={{ width: percent + '%' }} />
            </div>
          </div>
        </div>}

        {isUploaded && <div className={styles.loadingWrap}>
          <FileItem
            thumbSize="large"
            grid
            id={1}
            category="csv"
            description={name}
          />
          <div className={styles.contentMessage}>
            <h4>{strings.metadataSuccessfullyUploaded}</h4>
            <div>{strings.metadataCurrentlyImported}</div>
          </div>
        </div>}

        {isImportCompleted && <div className={styles.loadingWrap}>
          <FileItem
            thumbSize="large"
            grid
            id={1}
            category="csv"
            description={name}
          />
          <div className={styles.contentMessage}>
            <h4>{strings.metadataSuccessfullyImported}</h4>
            <div>{strings.metadataCompletedDate}</div>
          </div>
        </div>}
      </Modal>
    );
  }
}
