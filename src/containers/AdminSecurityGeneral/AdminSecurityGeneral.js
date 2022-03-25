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

import {
  getSetting,
  setSetting,
} from 'redux/modules/admin/security';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';

import AdminSecurityGeneralEdit from 'components/Admin/AdminSecurityGeneralEdit/AdminSecurityGeneralEdit';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';


const messages = defineMessages({
  email: {
    id: 'email',
    defaultMessage: 'Email'
  },
  hideShareCCfield: {
    id: 'hide-share-CC-field',
    defaultMessage: 'Hide Share CC field',
  },
  add: {
    id: 'add',
    defaultMessage: 'Add'
  },
  shareBCCAddresses: {
    id: 'share-bcc-addresses',
    defaultMessage: 'Share BCC addresses'
  },
  javaScript: {
    id: 'javascript',
    defaultMessage: 'JavaScript'
  },
  disableFileJS: {
    id: 'disable-file-js',
    defaultMessage: 'Disable JavaScript in files'
  },
  disableStoryDescJS: {
    id: 'disable-story-desc-js',
    defaultMessage: 'Disable JavaScript in {story} descriptions'
  },
  watermark: {
    id: 'watermark',
    defaultMessage: 'Watermark',
  },
  overlayText: {
    id: 'overlay-text',
    defaultMessage: 'Overlay Text'
  },
  tintColor: {
    id: 'tint-color',
    defaultMessage: 'Tint Color'
  },
  opacity: {
    id: 'opacity',
    defaultMessage: 'Opacity'
  },
  preview: {
    id: 'preview',
    defaultMessage: 'Preview'
  },
  secureStorage: {
    id: 'secure-storage',
    defaultMessage: 'Secure Storage'
  },
  blurEmailThumbnails: {
    id: 'blur-email-thumbnails',
    defaultMessage: 'Blur email thumbnails',
  },
  firstNameLastName: {
    id: 'first-name-last-name',
    defaultMessage: 'First Name + Last Name'
  },
  lastNameFirstName: {
    id: 'last-name-first-name',
    defaultMessage: 'Last Name + First Name'
  },
  customText: {
    id: 'custom-text',
    defaultMessage: 'Custom Text'
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  }
});

@connect(
  state => state.admin.security,
  bindActionCreatorsSafe({
    // getSecurity,
    setSetting,
    getSetting,
    createPrompt
  })
)
export default class AdminSecurityGeneralView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.properties = {
      isShareCCHidden: 'hideShareCcField',
      shareBccAddressList: 'shareBccAddresses',
      isJsInFileDisable: 'disableJavascriptInFiles',
      isJsInStoryDescDisable: 'disableJavascriptStoryDesc',
      overlayText: 'fileOverlayText',
      tintColour: 'fileOverlayColour',
      opacity: 'fileOverlayOpacity',
      isSecureStorage: 'secureStorage'
    };
    this.state = {
      updatedData: {}
    };
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getSetting) {
      this.props.getSetting();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const list = nextProps.shareBccAddresses ? nextProps.shareBccAddresses : nextProps.sharedBccAddresses;
    if (!this.state.isDifferent) {
      this.setState({
        updatedData: {
          shareBccAddresses: list,
          hideShareCcField: nextProps.hideShareCcField,
          disableJavascriptInFiles: nextProps.disableJavascriptInFiles,
          disableJavascriptStoryDesc: nextProps.disableJavascriptStoryDesc,
          fileOverlayText: nextProps.fileOverlayText,
          fileOverlayColour: nextProps.fileOverlayColour,
          fileOverlayOpacity: nextProps.fileOverlayOpacity,
          secureStorage: {
            ...nextProps.secureStorage
          }
        }
      });
    } else if (nextProps.updated) {
      this.setState({
        isDifferent: false,
        saveLoading: false
      });
    }

    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'security-general-error',
        type: 'warning',
        title: 'Warning',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleChange(update) {
    const newUpdate = Object.keys(this.properties).reduce((obj, key) => {
      if (Object.prototype.hasOwnProperty.call(update, key)) {
        return { ...obj, [this.properties[key]]: update[key] };
      }
      return obj;
    }, {});

    this.setState({
      updatedData: {
        ...this.state.updatedData,
        ...newUpdate
      }
    }, () => {
      let isDifferent = false;

      Object.keys(this.state.updatedData).forEach(key => {
        if (!isDifferent) {
          if (key === 'shareBccAddresses') {
            isDifferent = JSON.stringify(this.state.updatedData[key].sort()) !== JSON.stringify(this.props[key] ? this.props[key] : this.props.sharedBccAddresses);
          } else if (key === 'secureStorage') {
            isDifferent = JSON.stringify(this.state.updatedData[key].blurEmailThumbnails) !== JSON.stringify(this.props.blurThumbnails !== undefined ? this.props.blurThumbnails : this.props[key].blurEmailThumbnails);
          } else {
            isDifferent = JSON.stringify(this.state.updatedData[key]) !== JSON.stringify(this.props[key]);
          }
        }
      });
      this.setState({
        isDifferent
      });
    });
  }

  handleSave() {
    const { updatedData } = this.state;
    const updatedParam = {};
    Object.keys(updatedData).forEach(key => {
      switch (key) {
        case 'shareBccAddresses': {
          if (JSON.stringify(updatedData[key]) !== JSON.stringify(this.props[key] ? this.props[key] : this.props.sharedBccAddresses)) {
            updatedParam[key] = JSON.stringify(updatedData[key]);
          }
          break;
        }
        case 'secureStorage': {
          if (JSON.stringify(updatedData[key].blurEmailThumbnails) !== JSON.stringify(this.props.blurThumbnails !== undefined ? this.props.blurThumbnails : this.props[key].blurEmailThumbnails)) {
            updatedParam.blurThumbnails = updatedData[key].blurEmailThumbnails ? 1 : 0;
          }
          break;
        }
        default:
          if (JSON.stringify(updatedData[key]) !== JSON.stringify(this.props[key])) {
            if (typeof updatedData[key] === 'boolean') {
              updatedParam[key] = updatedData[key] ? 1 : 0;
            } else {
              updatedParam[key] = updatedData[key];
            }
          }
          break;
      }
    });

    if (!_isEmpty(updatedParam)) {
      this.props.setSetting(updatedParam);
      this.setState({
        saveLoading: true
      });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming, user } = this.context.settings;
    const { updatedData, isDifferent, saveLoading } = this.state;
    const {
      loading,
      className,
      style,
    } = this.props;

    const propsValue = !_isEmpty(updatedData) !== false ? Object.keys(this.properties).reduce((obj, key) => {
      if (Object.prototype.hasOwnProperty.call(this.state.updatedData, this.properties[key])) {
        return { ...obj, [key]: updatedData[this.properties[key]] };
      }
      return obj;
    }, {}) : {};

    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <AdminSecurityGeneralEdit
          onChange={this.handleChange}
          {...propsValue}
          userFirstName={user.firstname}
          userLastName={user.lastname}
          userEmail={user.email}
          strings={strings}
          saveDisabled={!isDifferent}
          saveLoading={saveLoading}
          onSave={this.handleSave}
        />}
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={isDifferent} />}
      </div>
    );
  }
}
