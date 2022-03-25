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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getEmailNotificationLogo,
  uploadEmailNotificationLogo,
} from 'redux/modules/admin/emails';
import { createPrompt } from 'redux/modules/prompts';

import Btn from 'components/Btn/Btn';
import ImageCropModal from 'components/ImageCropModal/ImageCropModal';
import Loader from 'components/Loader/Loader';
import uniqueId from 'lodash/uniqueId';

const messages = defineMessages({
  imageRequirements: {
    id: 'image-recommended',
    defaultMessage: 'Image Recommended',
  },
  uploadImage: {
    id: 'upload-Image',
    defaultMessage: 'Upload Image'
  },
  webLogoPosition: {
    id: 'web-logo-position',
    defaultMessage: 'This logo appears on the top center of the Login screen.'
  },
  warning: {
    id: 'warning',
    defaultMessage: 'Warning'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  notificationLogo: {
    id: 'notification-logo',
    defaultMessage: 'Notification logo'
  },
});

@connect(state => state.admin.emails,
  bindActionCreatorsSafe({
    getEmailNotificationLogo,
    uploadEmailNotificationLogo,
    createPrompt
  })
)
/* Email notification logo */
export default class AdminNotificationLogo extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.thumbnailBase64 && nextProps.thumbnailBase64 !== prevState.thumbnailBase64) {
      return {
        thumbnailBase64: nextProps.thumbnailBase64,
        thumbnailURL: ''
      };
    }
    if (nextProps.notificationLogo && nextProps.notificationLogo !== prevState.thumbnailURL) {
      return {
        thumbnailURL: nextProps.notificationLogo,
        thumbnailBase64: ''
      };
    }
    if (nextProps.error && nextProps.error !== prevState.error) {
      return {
        error: nextProps.error.message,
      };
    }

    return { ...nextProps, error: null };
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      imagePickerModalVisible: false,
      imageUploaded: '',
      thumbnailBase64: '',
      thumbnailURL: ''
    };
    autobind(this);
    // refs
    this.fileUpload = null;
  }

  componentDidMount() {
    if (typeof this.props.getEmailNotificationLogo === 'function') {
      this.props.getEmailNotificationLogo();
    }
  }

  handleError(error) {
    const noteErrorMsg = (<FormattedMessage
      id="general-error"
      defaultMessage="Admin General Error"
    />);
    this.props.createPrompt({
      id: 'general-error',
      type: 'error',
      title: 'Error',
      message: error.message || noteErrorMsg,
      dismissible: true,
      autoDismiss: 5
    });
  }

  addAuthPaths(url, authString) {
    if (url.indexOf('?') > -1) {
      return url + authString;
    }
    return url + authString.replace('&', '?');
  }

  getDefaultBackground() {
    return (
      <svg width="2048px" height="2048px" viewBox="0 0 2048 2048" version="1.1">
        <g id="Generic-" transform="translate(697.692338, 1142.375199) scale(-1, 1) rotate(-210.000000) translate(-697.692338, -1142.375199) translate(-1209.807662, -804.124801)">
          <rect fillOpacity="0.1" x="1741.26545" y="276.48" width="819.2" height="3481.6" />
          <rect fillOpacity="0.1" x="1741.26545" y="1095.68" width="2073.6" height="819.2" />
          <rect fillOpacity="0.05" x="1741.04992" y="3073.77927" width="1740.8" height="819.2" />
          <rect fillOpacity="0.1" x="0.280369026" y="1096.00058" width="1740.8" height="819.2" />
          <rect fillOpacity="0.15" x="922.065455" y="276.48" width="819.2" height="3481.6" />
          <rect fillOpacity="0.1" transform="translate(1556.945455, 1520.640000) rotate(-315.000000) translate(-1556.945455, -1520.640000) " x="1147.34545" y="-220.16" width="819.2" height="3481.6" />
          <rect fillOpacity="0.119999997" transform="translate(2167.031645, 2068.945455) rotate(-315.000000) translate(-2167.031645, -2068.945455) " x="1757.43165" y="328.145455" width="819.2" height="3481.6" />
        </g>
      </svg>
    );
  }

  // Upload Image functions
  handleImagePickerCancel() {
    this.setState({
      imagePickerModalVisible: false,
      imageUploaded: '',
    });
  }

  handleImagePickerSave(file) {
    const newFile = file;
    if (typeof this.props.uploadEmailNotificationLogo === 'function') {
      this.props.uploadEmailNotificationLogo(newFile, this.props.compliance.senderName);
    }
  }

  // Upload Image functions
  handleThumbnailClick() {
    this.fileUpload.value = '';
    this.fileUpload.click();
  }

  handleFileUploadSelected(event) {
    const files = event.target.files; // FileList object

    if (files.length && files[0].size <= 1024 * 1024 * 1) { // not bigger than 1MB
      this.processFileUpload(files[0]);
    } else {
      const imageSizeErrorMesage = (<FormattedMessage
        id="image-size-should-be-less-n"
        defaultMessage="Images size should be less than 1MB"
        values={{ size: '1MB' }}
      />);

      this.props.createPrompt({
        id: uniqueId(),
        type: 'warning',
        title: 'Warning',
        message: imageSizeErrorMesage,
        dismissible: true,
        autoDismiss: 5
      });
      this.setState({
        imagePickerModalVisible: false,
        imageUploaded: '',
      });
    }
  }

  processFileUpload(f) {
    const self = this;
    const reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function() {
      return function(e) {
        self.setState({
          imageUploaded: e.target.result,
          imagePickerModalVisible: true,
        });
      };
    }(f));

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString } = this.context.settings;
    const {
      notificationLogoLoading,
      notificationLogoUploading
    } = this.props;
    const {
      thumbnailURL,
      thumbnailBase64
    } = this.state;
    const styles = require('./AdminNotificationLogo.less');
    const strings = generateStrings(messages, formatMessage);

    const cx = classNames.bind(styles);
    const classes = cx({
      NotificationLogo: true,
      loading: notificationLogoLoading || notificationLogoUploading,
    }, this.props.className);

    const thumbnailBackground = thumbnailURL ?
      `url(${this.addAuthPaths(thumbnailURL, authString)})` :
      `url(${thumbnailBase64})`;

    return (
      <div style={{ padding: '0 2.35rem' }}>
        {notificationLogoLoading && <Loader type="page" />}
        {!notificationLogoLoading && <div>
          <div
            onClick={this.handleThumbnailClick}
            className={classes}
            style={{ backgroundImage: thumbnailBackground }}
          >
            {!thumbnailURL && !thumbnailBase64 && this.getDefaultBackground()}
            {notificationLogoUploading && <Loader className={styles.load} type="content" />}
          </div>
          <div className={styles.content}>
            <h5>{strings.imageRequirements}:</h5>
            <span>140 x 40px</span>
          </div>
          <Btn inverted onClick={this.handleThumbnailClick}>{strings.uploadImage}</Btn>
          <input
            ref={(c) => { this.fileUpload = c; }}
            type="file"
            accept="image/*"
            className={styles.hidden}
            onChange={this.handleFileUploadSelected}
          />
          <ImageCropModal
            backdropClosesModal
            escClosesModal
            isVisible={this.state.imagePickerModalVisible}
            imageUploaded={this.state.imageUploaded}

            width={140}
            height={40}
            onClose={this.handleImagePickerCancel}
            onSave={this.handleImagePickerSave}
          />
        </div>}
        {_get(this.state, 'error', false) && this.props.createPrompt({
          id: 'general-error',
          type: 'error',
          title: 'Error',
          message: this.props.error.message,
          dismissible: true,
          autoDismiss: 5
        })}
      </div>
    );
  }
}
