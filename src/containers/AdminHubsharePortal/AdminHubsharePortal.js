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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import {
  getHubshareConfiguration,
  setHubshareCustomText,

  setHubshareSettings,
} from 'redux/modules/admin/general';

import Loader from 'components/Loader/Loader';
import AdminHubsharePortal from 'components/Admin/AdminHubsharePortal/AdminHubsharePortal';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';

const messages = defineMessages({
  hubshareCustomTextPlaceholder: {
    id: 'custom-text-placeholder',
    defaultMessage: 'Add your custom message',
  },
  hubshareCustomTextFooter: {
    id: 'custom-text-footer',
    defaultMessage: 'Custom Portal Footer Message',
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  options: {
    id: 'options',
    defaultMessage: 'Options'
  },
  disableForwardingHubshares: {
    id: 'disable-forwarding-hubshares',
    defaultMessage: 'Disable Forwarding HubShares'
  },
  disableFileDownloads: {
    id: 'disable-file-downloads',
    defaultMessage: 'Disable File Downloads'
  }
});

@connect(state => state.admin.general,
  bindActionCreatorsSafe({
    getHubshareConfiguration,
    setHubshareCustomText,
    setHubshareSettings
  })
)
export default class AdminHubsharePortalContainer extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.properties = {
      disableForward: 'disableForward',
      customText: 'customText',
      disableDownload: 'disableDownload'
    };
    this.state = {
      updatedData: {}
    };
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getHubshareConfiguration) {
      this.props.getHubshareConfiguration();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.state.isDifferent) {
      this.setState({
        updatedData: {
          disableForward: nextProps.disableForward,
          disableDownload: nextProps.disableDownload,
          customText: nextProps.customText,
        }
      });
    } else if (nextProps.updated) {
      this.setState({
        isDifferent: false,
        saveLoading: false
      });
    }
  }

  handleSave() {
    const { updatedData } = this.state;
    if (this.props.setHubshareCustomText && updatedData.customText) {
      this.props.setHubshareCustomText(updatedData.customText);
    }

    if (this.props.setHubshareSettings) {
      this.props.setHubshareSettings({
        disableForward: updatedData.disableForward,
        disableDownload: updatedData.disableDownload
      });
    }

    if (!_isEmpty(updatedData)) {
      this.setState({
        saveLoading: true
      });
    }
  }

  handleChange(update) {
    this.setState({
      updatedData: {
        ...this.state.updatedData,
        ...update
      }
    }, () => {
      let isDifferent = false;

      Object.keys(this.state.updatedData).forEach(key => {
        if (!isDifferent) {
          isDifferent = JSON.stringify(this.state.updatedData[key]) !== JSON.stringify(this.props[key]);
        }
      });

      this.setState({
        isDifferent
      });
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      loading,
      className,
      customText,
      style,
      disableForward,
      disableDownload
    } = this.props;
    const { updatedData, isDifferent, saveLoading } = this.state;

    const propsValue = !_isEmpty(updatedData) ? updatedData : {
      disableForward,
      disableDownload,
      customText
    };

    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        <AdminHubsharePortal
          {...propsValue}
          strings={strings}
          saveDisabled={!isDifferent}
          onChange={this.handleChange}
          onSave={this.handleSave}
          saveLoading={saveLoading}
        />
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={isDifferent} />}
      </div>
    );
  }
}
