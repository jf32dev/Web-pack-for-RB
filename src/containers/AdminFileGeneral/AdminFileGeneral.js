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
  getCustomFilesMetadata,
  setCustomFilesMetadata,
  setData
} from 'redux/modules/admin/filesGeneral';
import { createPrompt } from 'redux/modules/prompts';

import FileGeneral from 'components/Admin/AdminFileGeneral/AdminFileGeneral';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';
import Loader from 'components/Loader/Loader';
import uniqueId from 'lodash/uniqueId';

const messages = defineMessages({
  general: {
    id: 'general',
    defaultMessage: 'General'
  },
  customFileDetail: {
    id: 'custom-file-detail',
    defaultMessage: 'Custom File Detail'
  },
  metadataFieldLabel: {
    id: 'metadata-field-label',
    defaultMessage: 'Metadata field label'
  },
  detailsFieldLabel: {
    id: 'details-field-label',
    defaultMessage: 'Details field label'
  },
  fileDetailLabel: {
    id: 'file-detail-label',
    defaultMessage: 'File Detail Label'
  },
  showIcon: {
    id: 'show-icon-on-files-with-custom-detail',
    defaultMessage: 'Show icon on files with custom detail'
  },
  hintText: {
    id: 'hint-text',
    defaultMessage: 'Hint text'
  },
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
  }
});

@connect(state => ({
  ...state.admin.filesGeneral,
}),
bindActionCreatorsSafe({
  getCustomFilesMetadata,
  setCustomFilesMetadata,
  setData,

  createPrompt
})
)
export default class AdminFileGeneral extends Component {
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
    if (this.props.getCustomFilesMetadata) {
      this.props.getCustomFilesMetadata();
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
    const { translations } = this.context.settings;
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
      this.props.setCustomFilesMetadata(values);
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
        {!loading && <FileGeneral
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
