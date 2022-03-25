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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BulkListItem from 'components/BulkListItem/BulkListItem';
import BulkUserImportUpload from 'components/BulkUserImportUpload/BulkUserImportUpload';
import BulkUserImportUploadProgress from 'components/BulkUserImportUploadProgress/BulkUserImportUploadProgress';
import BulkUserImportUploadResult from 'components/BulkUserImportUploadResult/BulkUserImportUploadResult';
import Modal from 'components/Modal/Modal';
import Btn from 'components/Btn/Btn';
import ComponentItem from 'views/ComponentItem';
import Docs from '../../views/Docs';
import bulkData from './bulkListItemProcessApiResponse.json';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import autobind from 'class-autobind';

const messages = defineMessages({
  importingUsers: { id: 'importing-users', defaultMessage: 'Importing users...' },
  viewResults: { id: 'view-results', defaultMessage: 'View Results' },
  viewErrors: { id: 'view-errors', defaultMessage: 'View Errors' },
  bulkImportUsers: { id: 'bulk-import-users', defaultMessage: 'Bulk Import Users' },
  upload: { id: 'upload', defaultMessage: 'Upload' },
  uploading: { id: 'uploading', defaultMessage: 'Uploading...' },
  dragListUsersOrBrowse: { id: 'drag-list-users-or-browse', defaultMessage: 'Drag a list of users here or browse to upload a CSV file.' },
  downloadSampleCSV: { id: 'download-sample-csv-file', defaultMessage: 'Download sample CSV file' },
  browse: { id: 'browse', defaultMessage: 'Browse' },
  allUsers: { id: 'all-users', defaultMessage: 'All Users' },
  existingUsers: { id: 'n-existing-users', defaultMessage: '{totalUsers} existing users' },
  download: { id: 'download', defaultMessage: 'Download' },
  row: { id: 'row', defaultMessage: 'Row' },
  importedUsers: { id: 'imported-n-users', defaultMessage: 'Imported {totalRecords} Users' },
  failedImportedUsers: { id: 'n-users-could-not-import', defaultMessage: '{failedRecords} users could not be imported' },
  filterErrors: { id: 'filter-errors', defaultMessage: 'Filter errors:' },
  downloadUserErrors: { id: 'download-user-errors', defaultMessage: 'Download User with Errors' },
  showAll: { id: 'show-all', defaultMessage: 'Show All' },
  moreDetails: { id: 'more-details', defaultMessage: 'More details' },
  uploadingFile: { id: 'uploading-fie', defaultMessage: 'Uploading' },
  sample: { id: 'sample', defaultMessage: 'Sample' },
  activeJobError: { id: 'an-active-job-is-already-running', defaultMessage: 'An active job is already running' },
  bulkUploadUsers: { id: 'bulk-upload-users', defaultMessage: 'Bulk Upload Users' },
  bulkAddOrEditUsers: { id: 'bulk-add-or-edit-users', defaultMessage: 'Bulk Add or Edit Users' }
});

const BulkListItemDocs = require('!!react-docgen-loader!components/BulkListItem/BulkListItem.js');

export default class BulkListItemView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      currentFileName: '',
      modalVisible: false,
      modalUploadVisible: false,
      modalUploadProgressVisible: false,
      modalUploadResultVisible: false,
      resultRecord: {}
    }
    autobind(this);
  }

  handleFileUploading(files) {
    this.setState({
      currentFileName: files[0].name,
    }, () => {
      console.log(this.state.currentFileName);
    });
  }

  handleToggleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }

  handleToggleModalUpload() {
    this.setState({
      modalUploadVisible: !this.state.modalUploadVisible
    });
  }

  handleToggleModalUploadProgress() {
    this.setState({
      modalUploadProgressVisible: !this.state.modalUploadProgressVisible
    });
  }

  handleToggleModalUploadResult() {
    this.setState({
      modalUploadResultVisible: !this.state.modalUploadResultVisible
    });
  }

  handleClick() {
    return
  }

  handleSampleCsvClick() {
    console.log('Sample Csv Clicked');
  }

  handleAllUsersCsvClick() {
    console.log('All users Csv Clicked');
  }

  // Hanndling Files
  handleFileDropped(context) {
    console.log(context);
  }

  handleResultClick(id) {
    const resultRecord = bulkData.find(data => data.id === id)
    this.setState({
      resultRecord,
      modalUploadResultVisible: true
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { currentFileName } = this.state;
    // Translations
    const strings = generateStrings(messages, formatMessage, { 
      totalUsers: 10,
      totalRecords: this.state.resultRecord.completedRecords,
      failedRecords: this.state.resultRecord.totalRecords - this.state.resultRecord.completedRecords
    });

    const list = bulkData.map((data, ix) => {
      return (
        <ComponentItem key={`${ix}-${data.id}`}>
          <BulkListItem
            id={data.id}
            completedRecords={data.completedRecords}
            fileName={data.filename}
            status={data.status}
            totalRecords={data.totalRecords}
            uploadedAt={data.uploadedAt}
            user={data.user}
            errors={data.errors}
            strings={strings}
            onResultClick={this.handleResultClick}
          />
        </ComponentItem>
      )
    });

    const modalList = bulkData.map((data, ix) => (
      <BulkListItem
        key={`${ix}-${data.id}`}
        id={data.id}
        completedRecords={data.completedRecords}
        fileName={data.filename}
        status={data.status}
        totalRecords={data.totalRecords}
        uploadedAt={data.uploadedAt}
        user={data.user}
        hasErrors={data.hasErrors}
        strings={strings}
        onResultClick={this.handleResultClick}
      />
    ));

    const styles = require('../../components/BulkListItem/BulkListItem.less');
    const modalHeader = (
      <div className={styles.modalHeader}>
        <p style={{ fontSize: '16px' }}>{strings.bulkImportUsers}</p>
        <a onClick={this.handleClick}>{strings.upload}</a>
      </div>
    )
    const resultHeader = (
      <div className={styles.modalHeader}>
        <p style={{ fontSize: '16px' }}>{strings.bulkImportUsers} > {this.state.resultRecord.filename}</p>
      </div>
    )

    return (
      <section id="bulk-list-item-view">
        <h1>Bulk user list item</h1>
        <Docs {...BulkListItemDocs} />
        <p>This is a list item that shows the progress of the bulk user upload API.</p>
        {list}
        <h2>Modal</h2>
        <p>This shows the bulk user list items, upload and, upload progress view inside a modal.</p>
        <p>Upload progress view button is disabled until a csv file is uploaded.</p>
        <p>Note about upload view and Upload Progress view, it should not be escapable by clicking the backdrop. This is for styleguide only.</p>
        <ComponentItem>
          <Btn onClick={this.handleToggleModal}>Launch Modal</Btn>
          <Btn onClick={this.handleToggleModalUpload}>Launch Upload Modal</Btn>
          <Btn onClick={this.handleToggleModalUploadProgress} disabled={!currentFileName}>Launch Upload Progress Modal</Btn>
        </ComponentItem>
        <Modal
          isVisible={this.state.modalVisible}
          width="medium"
          headerChildren={modalHeader}
          footerCloseButton
          onClose={this.handleToggleModal}
        >
          {modalList}
        </Modal>
        <Modal
          isVisible={this.state.modalUploadVisible}
          width="medium"
          headerTitle={strings.upload}
          footerChildren={<Btn alt large onClick={this.handleToggleModal2} style={{ marginRight: '0.5rem' }}>Back</Btn>}
          backdropClosesModal
          onClose={this.handleToggleModalUpload}
        >
          <BulkUserImportUpload
            strings={strings}
            onFileDropAccepted={this.handleFileDropped}
            onAllUsersCsvClick={this.handleAllUsersCsvClick}
            onSampleCsvClick={this.handleSampleCsvClick}
            onFileUploading={this.handleFileUploading}
          />
        </Modal>
        <Modal
          isVisible={this.state.modalUploadProgressVisible}
          width="medium"
          headerTitle={`Uploading "${currentFileName}"`}
          backdropClosesModal
          onClose={this.handleToggleModalUploadProgress}
        >
          <BulkUserImportUploadProgress
            strings={strings}
            currentFileName={currentFileName}
            completedRecords={654}
            totalRecords={1000}
          />
        </Modal>
        <Modal
          isVisible={this.state.modalUploadResultVisible}
          width="medium"
          headerChildren={resultHeader}
          backdropClosesModal
          footerCloseButton
          onClose={this.handleToggleModalUploadResult}
        >
          <BulkUserImportUploadResult
            strings={strings}
            resultRecord={this.state.resultRecord}
          />
        </Modal>
      </section>
    )
  }
}
