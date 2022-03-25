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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
//redux
import {
  getFiles,
  setFiles,
  FILE_UPLOADS,
} from 'redux/modules/admin/files';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import AdminFileUploads from 'components/Admin/AdminFiles/AdminFileUploads';
import Dialog from 'components/Dialog/Dialog';

const messages = defineMessages({
  transcodeVideos: {
    id: 'transcode-videos',
    defaultMessage: 'Transcode Videos'
  },
  allowedFileUploads: {
    id: 'allowed-file-uploads',
    defaultMessage: 'Allowed File Uploads',
  },
  serverDefinedBlockedFiles: {
    id: 'server-defined-blocked-files',
    defaultMessage: 'Server Defined Blocked Files [ {forbiddenExtensions} ]'
  },
  addFileFormat: {
    id: 'add-file-format',
    defaultMessage: 'Add file format'
  },
  add: {
    id: 'add',
    defaultMessage: 'Add'
  },
  resetDefaults: {
    id: 'reset-defaults',
    defaultMessage: 'Reset Defaults'
  },
  resetToDefaultSettings: {
    id: 'reset-to-default-settings',
    defaultMessage: 'Reset to default settings'
  },
  resetToDefaultSettingsMsg: {
    id: 'reset-to-default-settings-msg',
    defaultMessage: 'Are you sure you want to reset to default settings? All customizations will be removed.'
  },
  removeFileFormat: {
    id: 'remove-file-format',
    defaultMessage: 'Remove {fileFormat}'
  },
  removeFileFormatMsg: {
    id: 'remove-file-format-msg',
    defaultMessage: 'Are you sure you want to remove {fileFormat}?'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  continue: {
    id: 'continue',
    defaultMessage: 'Continue'
  },
  fileFormatSuccessfullyAdded: {
    id: 'file-format-successfully-added',
    defaultMessage: 'File Format added successfully'
  },
  fileFormatBlockedMsg: {
    id: 'file-format-block-msg',
    defaultMessage: '\'{fileFormat}\' can’t be added. This format has been blocked by the server.'
  },
  fileFormatAlreadyAddedMsg: {
    id: 'file-format-already-added-msg',
    defaultMessage: '\'{fileFormat}\' has already been added to the list.'
  }
});

@connect(state => state.admin.files,
  bindActionCreatorsSafe({
    getFiles,
    setFiles,
    createPrompt
  })
)
export default class AdminFileUploadsView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    allowedExtensions: [],
    forbiddenExtensions: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isDialogVisible: false,
      fileFormat: '',
    };
    this.isAdded = false;
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getFiles) {
      this.props.getFiles(FILE_UPLOADS);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, {
      fileFormat: this.state.fileFormat,
      forbiddenExtensions: this.props.forbiddenExtensions
    });
    /*success*/
    if (!_get(this.props, `${FILE_UPLOADS}Updated`, false) && _get(nextProps, `${FILE_UPLOADS}Updated`, false) && this.isAdded) {
      this.props.createPrompt({
        id: 'file-uploads-updated-success',
        type: 'success',
        message: strings.fileFormatSuccessfullyAdded,
        dismissible: false,
        autoDismiss: 5
      });
    }
    if (this.props.allowedExtensions.length < nextProps.allowedExtensions.length && !this.isAdded) {
      this.isAdded = true;
    }
    if (this.props.allowedExtensions.length >= nextProps.allowedExtensions.length && this.isAdded) {
      this.isAdded = false;
    }
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'Files-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleChange(update) {
    const key = Object.keys(update)[0];
    const { allowedExtensions } = this.props;

    let params = {};
    if (key === 'videoTranscode') {
      params = update;
    } else if (key === 'input') {
      params = {
        allowedExtensions: [...allowedExtensions, update.input]
      };
    } else if (key === 'dialog') {
      this.setState({
        isDialogVisible: true,
        fileFormat: update.id || '',
      });
    } else if (key === 'currentValue') {
      this.setState({
        fileFormat: update[key]
      });
    }


    if (!_isEmpty(params) && this.props.setFiles) {
      this.props.setFiles(FILE_UPLOADS, params);
    }
  }

  handleDialogConfirm() {
    this.handleCloseDialog();
    if (this.props.setFiles) {
      this.props.setFiles(FILE_UPLOADS, this.state.fileFormat === '' ? {
        resetExtensions: true
      } : {
        allowedExtensions: this.props.allowedExtensions.filter(item => item !== this.state.fileFormat)
      }, null, this.state.fileFormat === '');
    }
  }

  handleCloseDialog() {
    this.setState({
      isDialogVisible: false,
      fileFormat: '',
    });
  }

  render() {
    const { formatMessage } = this.context.intl;

    const {
      loading,
      allowedExtensions,
      videoTranscode,
      forbiddenExtensions,
      className,
      style,
    } = this.props;

    const {
      fileFormat,
      isDialogVisible,
    } = this.state;

    const strings = generateStrings(messages, formatMessage, {
      fileFormat: fileFormat,
      forbiddenExtensions,
    });

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <AdminFileUploads
          strings={strings}
          allowedExtensions={allowedExtensions}
          videoTranscode={videoTranscode}
          onChange={this.handleChange}
          forbiddenExtensions={forbiddenExtensions}
        />}
        <Dialog
          title={fileFormat === '' ? strings.resetToDefaultSettings : strings.removeFileFormat}
          message={fileFormat === '' ? strings.resetToDefaultSettingsMsg : strings.removeFileFormatMsg}
          cancelText={strings.cancel}
          confirmText={strings.continue}
          isVisible={isDialogVisible}
          onCancel={this.handleCloseDialog}
          onConfirm={this.handleDialogConfirm}
        />
      </div>
    );
  }
}
