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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import {
  getFilesDefaults,
  setFilesDefaults,
  setData
} from 'redux/modules/admin/filesDefaults';
import { createPrompt } from 'redux/modules/prompts';

import FileDefaults from 'components/Admin/AdminFileDefaults/AdminFileDefaults';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';
import Loader from 'components/Loader/Loader';
import uniqueId from 'lodash/uniqueId';

const messages = defineMessages({
  save: {
    id: 'save',
    defaultMessage: 'Save'
  },
  savedSuccessfully: {
    id: 'saved-successfully',
    defaultMessage: 'Saved successfully'
  },
  customFileMetadataDesc: {
    id: 'custom-file-metadata-desc',
    defaultMessage: 'The custom text field will only be available to publishers on web'
  },
  defaultFilesExpiration: {
    id: 'default-files-expiration',
    defaultMessage: 'Default Files Expiration'
  },
  enableFilesExpireDefaults: {
    id: 'enable-file-expire-defaults',
    defaultMessage: 'File will expire after'
  },
  filesExpireDefaultsNote: {
    id: 'file-expire-defaults-note',
    defaultMessage: 'When files expire they are no longer accessible in Hub, but can be restored from the {story} archive.'
  },
  enableFilesExpireWarning: {
    id: 'enable-file-expire-warning',
    defaultMessage: 'File expiry warning'
  },
  filesExpireWarningNote: {
    id: 'file-expire-warning-note',
    defaultMessage: '{story} author will be notified {filesExpireWarningDays} day(s) before files are due to expire. A second warning is sent on the day the file is due to expire. This setting cannot be customised for individual files.'
  },
  filesExpireWarningNote2: {
    id: 'file-expire-warning-note-2',
    defaultMessage: 'Default notification will be sent 24 hours before file expiration regardless of this setting.'
  },
  expiryDaysChangeWarning: {
    id: 'expire-days-change-warning',
    defaultMessage: 'Another warning email will be sent for any files that haven\'t yet expired, but have already sent a warning.'
  },
  days: {
    id: 'days',
    defaultMessage: 'days'
  },
  customFileDetails: {
    id: 'custom-file-details',
    defaultMessage: 'Custom File Details'
  },
  customFileDetailsEnabled: {
    id: 'cusotm-file-details-enabled',
    defaultMessage: 'Custom File Details Enabled'
  },
});

@connect(state => ({
  ...state.admin.filesDefaults,
}),
bindActionCreatorsSafe({
  getFilesDefaults,
  setFilesDefaults,
  setData,
  createPrompt
})
)
export default class AdminFileDefaults extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isDifferent: false
    };
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getFilesDefaults) {
      this.props.getFilesDefaults();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'Files-generalerror',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    } else if (nextProps.updated) {
      this.props.createPrompt({
        id: uniqueId('updated-'),
        type: 'success',
        message: this.updateStrings().savedSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Set flag for modified attributes
    const isModified = !_isEqual(nextProps.data, nextProps.dataOrig);
    this.setState({
      isDifferent: isModified
    });

    if (!this.props.updated && nextProps.updated) {
      this.setState({
        isDifferent: false
      });
    }
  }

  updateStrings() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const translations = { ...naming, filesExpireWarningDays: this.props.data.filesExpireWarningDays || 0 };
    return generateStrings(messages, formatMessage, translations);
  }

  handleChange(values) {
    if (typeof this.props.setData === 'function') {
      this.props.setData(values);
    }
  }

  handleSave() {
    if (typeof this.props.setData === 'function') {
      const { data } = this.props;
      const values = {
        ...data,
        frequency: data.turnedOn ? data.frequency : 'none'
      };
      this.props.setFilesDefaults(values);
    }
  }

  render() {
    const {
      data,
      loading,
      updating,

      className,
      style,
    } = this.props;

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <FileDefaults
          {...data}
          saveLoading={loading || updating}
          saveDisabled={!this.state.isDifferent}
          strings={this.updateStrings()}
          onChange={this.handleChange}
          onSave={this.handleSave}
        />}
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={this.state.isDifferent} />}
      </div>
    );
  }
}
