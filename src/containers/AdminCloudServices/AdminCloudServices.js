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
  CLOUD_SERVICES,
} from 'redux/modules/admin/files';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import AdminCloudServices from 'components/Admin/AdminFiles/AdminCloudServices';

const messages = defineMessages({
  service: {
    id: 'service',
    defaultMessage: 'Service'
  },
  myFiles: {
    id: 'my-files',
    defaultMessage: 'My Files',
  },
  syncEngine: {
    id: 'sync-engine',
    defaultMessage: 'Sync Engine'
  }
});

@connect(state => state.admin.files,
  bindActionCreatorsSafe({
    getFiles,
    setFiles,
    createPrompt
  })
)
export default class AdminCloudServicesView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getFiles) {
      this.props.getFiles(CLOUD_SERVICES);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  handleChange(set, update) {
    if (!_isEmpty(update) && this.props.setFiles) {
      this.props.setFiles(CLOUD_SERVICES, { cloudServices: update }, { cloudServices: set });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;

    const {
      loading,
      cloudServices,
      className,
      style,
    } = this.props;

    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <AdminCloudServices
          strings={strings}
          cloudServices={cloudServices}
          onChange={this.handleChange}
        />}
      </div>
    );
  }
}
