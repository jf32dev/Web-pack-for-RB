/* eslint-disable react/no-did-update-set-state */
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
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  getAllBulkImportJobs,
  getBulkImportJob,
  uploadFile,
  setData
} from 'redux/modules/admin/bulkUserImport';

import Modal from 'components/Modal/Modal';
import Btn from 'components/Btn/Btn';
import BulkListItem from 'components/BulkListItem/BulkListItem';
import BulkUserImportUpload from 'components/BulkUserImportUpload/BulkUserImportUpload';
import BulkUserImportUploadResult from 'components/BulkUserImportUploadResult/BulkUserImportUploadResult';
import BulkUserImportUploadProgress from 'components/BulkUserImportUploadProgress/BulkUserImportUploadProgress';
import Loader from 'components/Loader/Loader';
import PromptItem from 'components/PromptItem/PromptItem';

const messages = defineMessages({
  importingUsers: { id: 'importing-users', defaultMessage: 'Importing users...' },
  importingMetadata: { id: 'importing-metadata', defaultMessage: 'Importing metadata...' },
  viewResults: { id: 'view-results', defaultMessage: 'View Results' },
  viewErrors: { id: 'view-errors', defaultMessage: 'View Errors' },
  bulkImportUsers: { id: 'bulk-import-users', defaultMessage: 'Bulk Import Users' },
  upload: { id: 'upload', defaultMessage: 'Upload' },
  uploading: { id: 'uploading', defaultMessage: 'Uploading...' },
  dragListUsersOrBrowse: { id: 'drag-list-users-or-browse', defaultMessage: 'Drag a list of users here or browse to upload a CSV file.' },
  dragListUsersMetadataOrBrowse: { id: 'drag-list-users-metadata-or-browse', defaultMessage: 'Drag a list of users metadata here or browse to upload a CSV file.' },
  downloadSampleCSV: { id: 'download-sample-csv-file', defaultMessage: 'Download sample CSV file' },
  browse: { id: 'browse', defaultMessage: 'Browse' },
  allUsers: { id: 'all-users', defaultMessage: 'All Users' },
  existingUsers: { id: 'n-existing-users', defaultMessage: '{totalUsers} existing users' },
  download: { id: 'download', defaultMessage: 'Download' },
  row: { id: 'row', defaultMessage: 'Row' },
  importedUsers: { id: 'imported-n-users', defaultMessage: 'Imported {totalRecords} Users' },
  importedUsersMetadata: { id: 'imported-n-users-metadata', defaultMessage: 'Imported {totalRecords} user metadata' },
  importedMetadatas: { id: 'imported-n-metadatas', defaultMessage: 'Imported {totalRecords} Metadatas' },
  failedImportedUsers: { id: 'n-users-could-not-import', defaultMessage: '{failedRecords} users could not be imported' },
  failedImportedUsersMetadata: { id: 'n-user-metadata-could-not-import', defaultMessage: '{failedRecords} user metadata could not be imported' },
  filterErrors: { id: 'filter-errors', defaultMessage: 'Filter errors:' },
  downloadUserErrors: { id: 'download-user-errors', defaultMessage: 'Download User with Errors' },
  downloadMetadataErrors: { id: 'download-metadata-errors', defaultMessage: 'Download user metadata with errors' },
  showAll: { id: 'show-all', defaultMessage: 'Show All' },
  errorDetails: { id: 'error-details', defaultMessage: 'More details' },
  uploadingFile: { id: 'uploading-fie', defaultMessage: 'Uploading' },
  sample: { id: 'sample', defaultMessage: 'Sample' },
  activeJobError: { id: 'an-active-job-is-already-running', defaultMessage: 'An active job is already running' },
  bulkUploadUsers: { id: 'bulk-upload-users', defaultMessage: 'Bulk Upload Users' },
  bulkImportMetadata: { id: 'bulk-import-metadata', defaultMessage: 'Bulk Import Metadata' },
  bulkAddOrEditUsers: { id: 'bulk-add-or-edit-users', defaultMessage: 'Bulk Add or Edit Users' },
  bulkAddOrEditUsersMetadata: { id: 'bulk-add-or-edit-users-metadata', defaultMessage: 'Bulk Add or Edit Users Metadata' }
});

function mapStateToProps(state, ownProps) {
  const { admin } = state;
  const { bulkUserImport } = admin;
  const { bulkImportJobs, ...others } = bulkUserImport;

  return {
    bulkImportJobs: bulkImportJobs.filter(obj => obj.type === ownProps.type),
    ...others,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getAllBulkImportJobs,
    getBulkImportJob,
    uploadFile,
    setData
  })
)
export default class AdminBulkuserImport extends Component {
  static propTypes = {
    /** type of bulk imported */
    type: PropTypes.oneOf([
      'user_import',
      'user_metadata_import',
    ]).isRequired,
    showSampleFiles: PropTypes.bool,
    getList: PropTypes.func,
    getUserTotal: PropTypes.func
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  static defaultProps = {
    type: 'user_import',
    bulkImportJobs: [],
    showSampleFiles: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const bulkImportJobs = nextProps.bulkImportJobs;

    // userClosedUploadModal - check if upload modal was closed by user
    if (bulkImportJobs.length === 0 && nextProps.loaded && prevState.loading && !prevState.userClosedUploadModal) {
      return {
        ...nextProps,
        modalUploadVisible: true,
      };
    }

    if (nextProps.error && nextProps.error !== prevState.error) {
      return {
        error: nextProps.error.message,
        modalUploadProgressVisible: false,
        modalUploadVisible: false
      };
    }

    return { ...nextProps };
  }

  constructor(props) {
    super(props);
    this.state = {
      modalResultsListVisible: false,
      modalUploadVisible: false,
      modalUploadResultVisible: false,
      modalUploadProgressVisible: false,
      error: null,
      loading: props.loading,
      userClosedUploadModal: false,
      userSelectedJob: {}
    };
    autobind(this);
  }

  componentDidMount() {
    this.props.getAllBulkImportJobs(this.props.type, true);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      modalUploadProgressVisible,
      error
    } = this.state;

    const {
      progress,
      loading,
      firstLoad,
      loaded,
      bulkImportJobs,
      type
    } = this.props;

    const hasPending  = bulkImportJobs.length > 0 && bulkImportJobs.some((job) => job.status === 'pending');
    if (progress === 100 && modalUploadProgressVisible) {
      if (hasPending) {
        this.setState({
          modalUploadProgressVisible: false,
          modalUploadVisible: false
        });
      } else {
        window.clearTimeout(this.timerOne);
        this.timerOne = window.setTimeout(() => {
          this.props.getAllBulkImportJobs(this.props.type);
        }, 5000);
      }
    } else if (hasPending && !loading) {
      window.clearTimeout(this.timerOne);
      window.clearTimeout(this.timerTwo);
      this.timerTwo = window.setTimeout(() => {
        this.props.getAllBulkImportJobs(this.props.type).then((res) => {
          // call getBulkImportJob api to update status of job otherwise it will always be 'pending'
          if (res.body[0].status !== 'completed') {
            this.props.getBulkImportJob(bulkImportJobs[0].id);
          } else if (type === 'user_metadata_import' && res.body[0].status === 'completed') {
            this.props.getList();
          } else if (type === 'user_import' && res.body[0].status === 'completed') {
            this.props.getUserTotal();
          }
        });
      }, 5000);
    } else if (firstLoad && prevState.loading && !prevState.firstLoad) {
      this.setState({
        firstLoad: false
      });
    }

    if (prevProps.error !== error && error) {
      if (error.message === this.handleTranslationStrings().activeJobError) {
        this.props.getAllBulkImportJobs(this.props.type);
      }
    }

    if (bulkImportJobs.length > 0 && loaded && prevState.loading) {
      this.setState({
        modalResultsListVisible: true,
        modalUploadVisible: false,
        modalUploadProgressVisible: false
      });
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timerOne);
    window.clearTimeout(this.timerTwo);
  }

  handleTranslationStrings() {
    const { userSelectedJob } = this.state;
    const { formatMessage } = this.context.intl;
    const failedRecords = userSelectedJob && userSelectedJob.errors && userSelectedJob.errors.length || 0;
    return generateStrings(messages, formatMessage, {
      totalUsers: 10,
      totalRecords: userSelectedJob && (userSelectedJob.completedRecords - failedRecords),
      failedRecords
    });
  }

  handleToggleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }

  handleToggleModalUpload() {
    this.setState({
      modalUploadVisible: !this.state.modalUploadVisible,
      userClosedUploadModal: true,
      error: null
    }, () => {
      if (!this.state.modalUploadVisible) {
        this.props.getAllBulkImportJobs(this.props.type);
        if (this.props.bulkImportJobs.length === 0) {
          this.props.onModalUploadClose();
        }
      }
    });
  }

  handleToggleModalUploadProgress() {
    this.setState({
      modalUploadProgressVisible: !this.state.modalUploadProgressVisible
    });
  }

  handleToggleModalUploadResult() {
    this.setState({
      modalUploadResultVisible: !this.state.modalUploadResultVisible,
      error: null
    });
  }

  handleFileDropped(files) {
    this.props.uploadFile(files, this.context.store.dispatch, this.props.type);
    this.setState({
      modalUploadVisible: false,
      modalUploadProgressVisible: true,
      error: null
    });
  }

  handleErrorDismiss() {
    this.props.setData({ error: null });
  }

  handleSampleCsvClick() {
    // different sample CSV files for bulk user import and user metadata
    const downloadFilePath = this.props.type === 'user_import' ? '/admin/user/bulk/sample' : '/admin/company-metadata/bulk/sample';
    const newWindow = window.open(`${window.BTC.BTCAPI}${downloadFilePath}${this.context.settings.authString.replace('&', '?')}`);
    newWindow.opener = null;
  }

  handleResultClick(id) {
    // using the returned result instead of redux prop, `selectedJob`, because `selectedJob` will change to the newest csv imported (this.props.getBulkImportJob is being called every 5 seconds while importing new csv)
    this.props.getBulkImportJob(id).then((result) => {
      this.setState({
        userSelectedJob: result.body,
        modalUploadResultVisible: true
      });
    });
  }

  render() {
    const styles = require('./AdminBulkUserImport.less');
    const {
      bulkImportJobs
    } = this.props;

    const {
      userSelectedJob
    } = this.state;

    const hasPending  = bulkImportJobs.length > 0 && bulkImportJobs.some((job) => job.status === 'pending');

    // Translations
    const strings = this.handleTranslationStrings();

    const resultHeader = (
      <div className={styles.modalHeader}>
        <p style={{ fontSize: '16px' }}>{this.props.type === 'user_import' ? strings.bulkImportUsers : strings.bulkImportMetadata} &quot;{userSelectedJob && userSelectedJob.filename}&quot;</p>
      </div>
    );

    const uploadHeader = (
      <div className={styles.modalHeader}>
        <p style={{ fontSize: '16px' }}>{this.props.type === 'user_import' ? strings.bulkImportUsers : strings.bulkImportMetadata}</p>
        <Btn large inverted disabled={hasPending || this.state.modalUploadProgressVisible} onClick={this.handleToggleModalUpload}>{strings.upload}</Btn>
      </div>
    );

    const bulkUploadUsersHeader = (
      <div className={styles.bulkUploadUsersHeader}>
        <p>{this.props.type === 'user_import' ? strings.bulkUploadUsers : strings.bulkImportMetadata}</p>
      </div>
    );

    return (
      <section style={{ padding: '0 3.15rem 2rem 1.6rem' }}>
        {(this.props.loadingResult || this.state.firstLoad || this.props.loading) &&
        !this.state.modalResultsListVisible &&
        !this.state.modalUploadProgressVisible &&
          <Loader type="content" style={{ position: 'absolute', top: '40%', left: '30%' }} />
        }
        {this.state.error && <div className={styles.errorMsg}>
          <PromptItem
            id="upload-error"
            type="error"
            title="Error"
            message={this.state.error.message || this.state.error}
            dismissible
            onDismiss={this.handleErrorDismiss}
          />
        </div>}
        <Modal
          isVisible={this.state.modalResultsListVisible && !this.state.modalUploadVisible && bulkImportJobs.length > 0}
          width="medium"
          headerChildren={uploadHeader}
          footerCloseButton
          onClose={this.props.onModalUploadClose}
        >
          {bulkImportJobs.map((data) => (
            <BulkListItem
              key={data.id}
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
              type={this.props.type}
            />
          ))}
        </Modal>
        <Modal
          isVisible={this.state.modalUploadVisible && !this.props.loadingResult}
          width="medium"
          headerChildren={bulkUploadUsersHeader}
          footerCloseButton
          onClose={this.handleToggleModalUpload}
          disabled={hasPending}
        >
          <BulkUserImportUpload
            heading={this.props.type === 'user_import' ? strings.bulkAddOrEditUsers : strings.bulkAddOrEditUsersMetadata}
            message={this.props.type === 'user_import' ? strings.dragListUsersOrBrowse : strings.dragListUsersMetadataOrBrowse}
            strings={strings}
            showSampleFiles={this.props.showSampleFiles}
            onFileDropAccepted={this.handleFileDropped}
            onSampleCsvClick={this.handleSampleCsvClick}
          />
        </Modal>
        <Modal
          isVisible={this.state.modalUploadProgressVisible}
          width="medium"
          headerTitle={strings.uploadingFile + ' "' + (this.props.files && this.props.files[0].name) + '"'}
        >
          <BulkUserImportUploadProgress
            completedRecords={this.props.progress}
            totalRecords={100}
            strings={strings}
            currentFileName={this.props.files && this.props.files[0].name || ''}
          />
        </Modal>
        <Modal
          isVisible={this.state.modalUploadResultVisible}
          width="medium"
          headerChildren={resultHeader}
          footerCloseButton
          onClose={this.handleToggleModalUploadResult}
        >
          <BulkUserImportUploadResult
            strings={strings}
            resultRecord={userSelectedJob || {}}
            type={this.props.type}
          />
        </Modal>
      </section>
    );
  }
}
