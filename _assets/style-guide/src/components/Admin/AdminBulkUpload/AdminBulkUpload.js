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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import classNames from 'classnames/bind';

import Dropzone from 'react-dropzone';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import BulkUploadForm from './BulkUploadForm';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import NavMenu from 'components/NavMenu/NavMenu';
import SVGIcon from 'components/SVGIcon/SVGIcon';
import moment from 'moment';

import BulkUploadError from './BulkUploadError';

const messages = defineMessages({
  create: { id: 'create', defaultMessage: 'Create' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  validate: { id: 'validate', defaultMessage: 'Validate' },
  download: { id: 'download', defaultMessage: 'Download' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  back: { id: 'back', defaultMessage: 'Back' },
  browse: { id: 'browse', defaultMessage: 'Browse' },
  bulkEditUsers: { id: 'bulk-edit-users', defaultMessage: 'Bulk Edit Users' },
  bulkDeleteUsers: { id: 'bulk-delete-users', defaultMessage: 'Bulk Delete Users' },
  bulkUploadUsersInfo: { id: 'upload-csv-file-users-info', defaultMessage: 'Upload a CSV with a list of users to create or edit in bulk.' },
  dropListUsersOrBrowse: { id: 'drop-list-users-here-browse-upload-csv', defaultMessage: 'Drop a list of users here or browse to upload a CSV file.' },

  bulkDeleteUsersInfo: { id: 'upload-csv-file-delete-users-info', defaultMessage: 'Upload a CSV file with a list of users to delete in bulk.' },
  uploadingFile: { id: 'uploading-file', defaultMessage: 'Uploading file' },
  waitProcessMsg: { id: 'please-wait-upload-finish', defaultMessage: 'Please wait until the current upload is finished before trying again.' },

  csvFileShowingAllUsers: { id: 'a-csv-file-showing-all-users', defaultMessage: 'a CSV file showing all of your users.' },
  sampleCsvFile: { id: 'a-sample-csv-file', defaultMessage: 'a sample CSV file.' },
  userSuccessfullyCreated: { id: 'user-successfully-created', defaultMessage: 'Import users process has been scheduled.' },
  userSuccessfullyDeleted: { id: 'user-successfully-deleted', defaultMessage: 'User Successfully Deleted' },
  maximumUsersWarning: { id: 'maximum-users-warning', defaultMessage: 'Please note that Bulk Uploads are limited to 999 users at a time' },
  lastUpload: { id: 'last-upload', defaultMessage: 'Last Upload: ' },
});

export const UPLOAD = 'upload';
export const VALIDATE = 'validate';
export const CREATE = 'create';
export const SUCCESS = 'success';
export const STATUS = 'status';
export const PROCESSING = 'processing';

/**
 * Users Bulk Upload modal
 */
export default class AdminBulkUpload extends PureComponent {
  static propTypes = {
    languageList: PropTypes.object,
    groupList: PropTypes.array,
    configurationBundleList: PropTypes.array,
    currentUserRole: PropTypes.number,
    summary: PropTypes.object,

    loading: PropTypes.bool,
    isVisible: PropTypes.bool,
    showDelete: PropTypes.bool,
    isUploading: PropTypes.bool,

    onClose: PropTypes.func,
    onFileDropAccepted: PropTypes.func,
    onFileDropRejected: PropTypes.func,

    onAddGroupItem: PropTypes.func,
    onRemoveGroupItem: PropTypes.func,
    onGroupSearchChange: PropTypes.func,
    onGroupScroll: PropTypes.func,
    onSave: PropTypes.func
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    isUploading: false,
    languageList: {},
    summary: {},
  };

  constructor(props) {
    super(props);
    this.baseUrl = '/bulkupload';

    this.state = {
      selectedUrl: this.baseUrl + '/edit',
      overrideSettings: {
        sendInvite: true
      },
      mode: UPLOAD,
    };

    // refs
    this.fileDropzone = null;
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.isValidated && nextProps.isValidated && this.state.mode !== CREATE) {
      this.setState({
        mode: CREATE
      });
    }

    if ((!this.props.isCreated && nextProps.isCreated) || (!this.props.isDeleted && nextProps.isDeleted)) {
      this.setState({
        mode: SUCCESS
      });

      this.timer = window.setTimeout(() => {
        window.clearTimeout(this.timer);
        this.timer = undefined;
        this.props.onClose();
      }, 2000);
    }

    if (_get(nextProps, 'bulkImportStatus.status', '') === 'processing' && this.state.mode !== PROCESSING) {
      this.setState({
        mode: PROCESSING
      });
    }

    if (_get(this.props, 'bulkImportStatus.status', '') === 'processing' &&
        _get(nextProps, 'bulkImportStatus.status', '') !== 'processing') {
      this.setState({
        mode: UPLOAD
      });
    }
  }

  handleNavItemClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    this.setState({
      selectedUrl: href,
      overrideSettings: {
        sendInvite: true
      }
    });
  }

  handleBrowseClick() {
    event.preventDefault();
    if (this.fileDropzone) {
      this.fileDropzone.open();
    }
  }

  handleOnChange(context) {
    this.setState({
      overrideSettings: {
        ...this.state.overrideSettings,
        ...context
      }
    });
  }

  handleSave() {
    if (typeof this.props.onSave === 'function') {
      this.props.onSave(this.state.overrideSettings, this.state.selectedUrl === this.baseUrl + '/delete');
    }
  }

  handleValidate() {
    if (typeof this.props.onValidate === 'function') {
      this.props.onValidate(this.state.overrideSettings, this.state.selectedUrl === this.baseUrl + '/delete');
    }
  }

  /**
   * Files
   */
  handleFileDropAccepted(bulkUploadFiles) {
    this.fileDropzone.value = '';
    const { selectedUrl } = this.state;

    if (this.state.selectedUrl === this.baseUrl + '/delete') {
      this.props.onValidate({
        file: bulkUploadFiles[0]
      }, selectedUrl === this.baseUrl + '/delete');
    } else {
      this.setState({
        overrideSettings: {
          ...this.state.overrideSettings,
          file: bulkUploadFiles[0]
        },
        mode: VALIDATE,
      });
    }
  }

  handleFileDropRejected() {
    if (typeof this.props.onFileDropRejected === 'function') {
      this.props.onFileDropRejected();
    }
  }

  handleSampleCsvClick() {
    const { authString } = this.context.settings;
    const url = `${window.BTC.BTCAPI4}/user/bulk_export?type=sample${authString}`;
    const newWindow = window.open(url, '_self');
    newWindow.opener = null;
  }

  handleSampleDeleteCsvClick() {
    const url = `${window.BTC.BTCAPI4.replace('/webapi', '')}/sample-user-deletions.csv`;
    const newWindow = window.open(url, '_self');
    newWindow.opener = null;
  }

  handleAllUsersCsvClick() {
    const { authString } = this.context.settings;
    const url = `${window.BTC.BTCAPI4}/user/bulk_export?type=full${authString}`;
    const newWindow = window.open(url, '_self');
    newWindow.opener = null;
  }

  handleGoUpdate() {
    const update = {
      mode: this.state.selectedUrl !== this.baseUrl + '/delete' ? VALIDATE : UPLOAD
    };
    if (this.state.selectedUrl === this.baseUrl + '/delete') {
      update.overrideSettings = {
        sendInvite: true
      };
    }
    this.setState(update);
  }

  handleCheckStatus() {
    this.setState({
      mode: STATUS
    });
  }

  handleGoUpload() {
    this.setState({
      mode: UPLOAD
    });
  }

  render() {
    const {
      configurationBundleList,
      languageList,
      groupList,
      isVisible,
      onClose,
      className
    } = this.props;
    const { selectedUrl, overrideSettings } = this.state;
    const styles = require('./AdminBulkUpload.less');

    const cx = classNames.bind(styles);
    const classes = cx({
      contentWrap: true,
      paddingTopBottom: this.state.mode === UPLOAD,
    }, className);

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, {
      deleteNum: this.props.summary.users_to_be_deleted || 0
    });

    let menuList = [
      { name: strings.bulkEditUsers, url: this.baseUrl + '/edit' },
      { name: strings.bulkDeleteUsers, url: this.baseUrl + '/delete' },
    ];

    if (this.state.mode !== UPLOAD) {
      menuList = [menuList[selectedUrl === this.baseUrl + '/delete' ? 1 : 0]];
    }
    const selectedUrlTmp = selectedUrl || menuList[0].url;

    let footerTmp = null;

    if (this.state.mode === VALIDATE) {
      footerTmp = {
        footerChildren: (<div>
          <Btn
            alt large onClick={this.props.onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted
            large
            onClick={this.handleValidate}
            loading={this.props.loading}
            style={{ marginLeft: '0.5rem' }}
            disabled={overrideSettings.setPassword === 'from_form' && overrideSettings.newPassword !== overrideSettings.confirmPassword}
          >
            {strings.validate}
          </Btn>
        </div>)
      };
    }
    if (this.state.mode === CREATE) {
      let disableForward = false;
      if (_get(this.props, 'summary.users_to_be_deleted', 0) === 0 && selectedUrl === this.baseUrl + '/delete') {
        disableForward = true;
      }

      if (selectedUrl === this.baseUrl + '/edit') {
        if (+_get(this.props, 'summary.metadata_imported', 0) === 0 &&
            +_get(this.props, 'summary.existing_users_updated', 0) === 0 &&
            +_get(this.props, 'summary.users_imported', 0) === 0) {
          disableForward = true;
        }
      }

      footerTmp = {
        footerChildren: (<div>
          <Btn
            alt large onClick={this.handleGoUpdate}
            style={{ marginRight: '0.5rem' }}
          >{strings.back}</Btn>
          <Btn
            inverted
            large
            onClick={this.handleSave}
            disabled={disableForward}
            loading={this.props.loading}
            style={{ marginLeft: '0.5rem' }}
          >
            {selectedUrl !== this.baseUrl + '/delete' ? strings.create : strings.delete}
          </Btn>
        </div>)
      };
    }

    if (this.state.mode === STATUS) {
      footerTmp = {
        footerChildren: (<div>
          <Btn
            alt large onClick={this.handleGoUpload}
            style={{ marginRight: '0.5rem' }}
          >{strings.back}</Btn>
        </div>)
      };
    }

    if (this.state.mode === SUCCESS) {
      return (<Modal
        isVisible
        autosize={false}
        className={styles.modalTransition}
        bodyClassName={styles.confirmationBodyModal}
        headerClassName={styles.hideHeader}
        backdropClosesModal
        escClosesModal
        onClose={() => {}}
      >
        <svg className={styles.checkmark} viewBox="0 0 52 52">
          <circle
            className={styles.checkmark__circle} cx="26" cy="26"
            r="25" fill="none"
          />
          <path className={styles.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <h3>{selectedUrl === this.baseUrl + '/delete' ? strings.userSuccessfullyDeleted : strings.userSuccessfullyCreated}</h3>
      </Modal>);
    }

    return (
      <Modal
        key={this.state.mode}
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        headerChildren={
          <NavMenu
            list={menuList}
            selectedUrl={selectedUrlTmp}
            horizontal
            secondary
            className={menuList.length === 1 ? styles.singleHeader : styles.multiHeader}
            onItemClick={this.handleNavItemClick}
          />
        }
        onClose={onClose}
        headerClassName={styles.headerClassName}
        bodyClassName={styles.modalBody}
        {...footerTmp}
      >
        {this.state.mode === UPLOAD && selectedUrlTmp === this.baseUrl + '/edit' && <div className={classes}>
          <div className={styles.info}>{strings.bulkUploadUsersInfo}</div>

          <Dropzone
            ref={(node) => { this.fileDropzone = node; }}
            accept="text/csv"
            multiple={false}
            className={styles.thumbnailDropzone}
            activeClassName={styles.thumbnailDropzoneActive}
            rejectClassName={styles.thumbnailDropzoneReject}

            onDropAccepted={this.handleFileDropAccepted}
            onDropRejected={this.handleFileDropRejected}
          >
            <Blankslate
              className={styles.blankslateWrap}
              iconSize={32}
              icon={<SVGIcon type="file" style={{ marginTop: '-0.25rem' }} />}
            />
          </Dropzone>
          <div className={styles.infoBottom}>{strings.dropListUsersOrBrowse}</div>
          <Btn
            inverted large onClick={this.handleBrowseClick}
            className={styles.browseBtn}
          >{strings.browse}</Btn>

          <div className={styles.downloadInfo}>
            <p>{strings.maximumUsersWarning}</p>
            <p><span onClick={this.handleSampleCsvClick}>{strings.download}</span> {strings.sampleCsvFile}</p>
            <p><span onClick={this.handleAllUsersCsvClick}>{strings.download}</span> {strings.csvFileShowingAllUsers}</p>
            {!_isEmpty(this.props.bulkImportStatus) && this.props.bulkImportStatus.started_at && <p>
              {strings.lastUpload}
              <span onClick={this.handleCheckStatus}>
                {moment.unix(this.props.bulkImportStatus.started_at).format('DD/MM/YYYY hh:mm a')}
              </span
            ></p>}
          </div>
        </div>}

        {this.state.mode === PROCESSING && <div className={styles.loadingWrap}>
          <Blankslate
            className={styles.blankslateWrap}
            icon={<SVGIcon type="uploadingFile" style={{ marginTop: '-0.25rem' }} />}
            heading={strings.uploadingFile + '...'}
            message={strings.waitProcessMsg}
          >
            <div className={styles.loading}>
              <Loader type="content" />
            </div>
          </Blankslate>
        </div>}

        {this.state.mode === VALIDATE && selectedUrl !== this.baseUrl + '/delete' && <BulkUploadForm
          {...this.state.overrideSettings}
          fileName={_get(this.state.bulkUploadFile, 'name', 'imported_users.csv')}
          languageList={languageList}
          groupList={groupList}
          configurationBundleList={configurationBundleList}
          currentUserRole={this.props.currentUserRole}

          metadataAttributes={this.props.metadataAttributes}
          metadataValues={this.props.metadataValues}

          groupSelectedList={this.state.overrideSettings.group}
          group={Array.isArray(this.state.overrideSettings.group) ? 'from_form' : 'from_csv'}

          onAddGroupItem={this.props.onAddGroupItem}
          onRemoveGroupItem={this.props.onRemoveGroupItem}
          onGroupSearchChange={this.props.onGroupSearchChange}
          onGroupScroll={this.props.onGroupScroll}
          onChange={this.handleOnChange}
        />}

        {this.state.mode === CREATE && <BulkUploadError
          isDelete={selectedUrl === this.baseUrl + '/delete'}
          file={this.state.overrideSettings.file}
          summary={this.props.summary}
          errors={selectedUrl === this.baseUrl + '/delete' ? this.props.validEmails : this.props.errors}
        />}

        {this.state.mode === STATUS && <BulkUploadError
          summary={this.props.bulkImportStatus.summary}
          errors={this.props.bulkImportStatus.errors}
        />}

        {this.state.mode === UPLOAD && selectedUrlTmp === this.baseUrl + '/delete' && <div className={classes}>
          <div className={styles.info}>{strings.bulkDeleteUsersInfo}</div>

          <Dropzone
            ref={(node) => { this.fileDropzone = node; }}
            accept="text/csv"
            multiple={false}
            className={styles.thumbnailDropzone}
            activeClassName={styles.thumbnailDropzoneActive}
            rejectClassName={styles.thumbnailDropzoneReject}

            onDropAccepted={this.handleFileDropAccepted}
            onDropRejected={this.handleFileDropRejected}
          >
            <Blankslate
              className={styles.blankslateWrap}
              icon={<SVGIcon type="trash" style={{ marginTop: '-0.25rem' }} />}
            />
          </Dropzone>
          <div className={styles.infoBottom}>{strings.dropListUsersOrBrowse}</div>
          <Btn
            inverted large onClick={this.handleBrowseClick}
            className={styles.browseBtn}
          >{strings.browse}</Btn>

          <div className={styles.downloadInfo}>
            <p>{strings.maximumUsersWarning}</p>
            <p><span onClick={this.handleSampleDeleteCsvClick}>{strings.download}</span> {strings.sampleCsvFile}</p>
            <p><span style={{ opacity: 0 }}>&nbsp;</span></p>
          </div>
        </div>}
      </Modal>
    );
  }
}
