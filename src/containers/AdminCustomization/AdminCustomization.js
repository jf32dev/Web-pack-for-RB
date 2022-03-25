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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getGeneral,
  setCustomGeneralJson,
  uploadFileCustomization,
} from 'redux/modules/admin/general';
import { createPrompt } from 'redux/modules/prompts';

import AdminCustomizationEditor from 'components/Admin/AdminCustomization/AdminCustomization';
import Loader from 'components/Loader/Loader';

const CUSTOMIZATION = 'customization';

const messages = defineMessages({
  colors: {
    id: 'colors',
    defaultMessage: 'Colors'
  },
  baseColor: {
    id: 'base-color',
    defaultMessage: 'Base Color',
  },
  lightBaseColor: {
    id: 'light-base-color',
    defaultMessage: 'Light Base Color'
  },
  darkBaseColor: {
    id: 'dark-base-color',
    defaultMessage: 'Dark Base Color'
  },
  autoGenerateTitle: {
    id: 'auto-generate-title',
    defaultMessage: 'Automatically generate light and dark colors'
  },
  applicationLinks: {
    id: 'application-links',
    defaultMessage: 'Application Links'
  },
  applicationLinksInfo: {
    id: 'application-links-info',
    defaultMessage: 'Display direct links to download the app on the Sign-in screen.'
  },
  insertLink: {
    id: 'insert-link',
    defaultMessage: 'Insert link'
  },
  ios: {
    id: 'ios',
    defaultMessage: 'iOS',
  },
  android: {
    id: 'android',
    defaultMessage: 'Android'
  },
  windows: {
    id: 'windows',
    defaultMessage: 'Windows'
  },
  logos: {
    id: 'logos',
    defaultMessage: 'Logos'
  },
  version4: {
    id: 'version-4',
    defaultMessage: 'Version 4'
  },
  version5: {
    id: 'version-5',
    defaultMessage: 'Version 5'
  },
  webApp: {
    id: 'web-app',
    defaultMessage: 'Web App'
  },
  loginPageLogo: {
    id: 'login-page-logo',
    defaultMessage: 'Login Page Logo'
  },
  mainCompanyLogo: {
    id: 'main-company-logo',
    defaultMessage: 'Main Company Logo'
  },
  imageRequirements: {
    id: 'image-requirements',
    defaultMessage: 'Image Requirements',
  },
  uploadImage: {
    id: 'upload-Image',
    defaultMessage: 'Upload Image'
  },
  webLogoPosition: {
    id: 'web-logo-position',
    defaultMessage: 'This logo appears on the top center of the Login screen.'
  },
  device: {
    id: 'device',
    defaultMessage: 'Device'
  },
  landscapeSplashScreen: {
    id: 'landscape-splash-screen',
    defaultMessage: 'Landscape Splash Screen'
  },
  webCompanyPosition: {
    id: 'web-company-position',
    defaultMessage: 'This logo appears on the top left-hand corner of the screen.'
  },
  deviceLandscapePosition: {
    id: 'device-landscape-position',
    defaultMessage: 'This image is used as the splash screen when the device is viewed in landscape mode.'
  },
  devicePortraitScreenPosition: {
    id: 'device-portrait-screen-position',
    defaultMessage: 'This image is used as the splash screen when the device is viewed in portrait mode.'
  },
  portraitSplashScreen: {
    id: 'portrait-splash-screen',
    defaultMessage: 'Portrait Splash Screen',
  },
  loginWallpaper: {
    id: 'login-wallpaper',
    defaultMessage: 'Login Page Wallpaper'
  },
  webLoginWallpaperPosition: {
    id: 'web-login-wallpaper-position',
    defaultMessage: 'This image is displayed as the wallpaper on the Login screen.'
  },
  webUserEnrolWallpaperPosition: {
    id: 'web-user-enrol-wallpaper-position',
    defaultMessage: 'This image is displayed as the wallpaper on the User Self Enrollment Login screen.'
  },
  v5MainCompanyLogoPosition: {
    id: 'v5-main-company-logo-position',
    defaultMessage: 'This logo appears on the top left-hand corner of the screen.'
  },
  deviceMainCompanyLogoPosition: {
    id: 'device-main-company-logo-position',
    defaultMessage: 'This logo appears towards the top of the device screen.'
  },
  appIcon: {
    id: 'app-icon',
    defaultMessage: 'App Icon'
  },
  appIconDesc: {
    id: 'app-icon-desc',
    defaultMessage: 'Only Available on iOS devices running iOS 10.3 or greater.'
  },
  warning: {
    id: 'warning',
    defaultMessage: 'Warning'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  colourCheckWarningDesc: {
    id: 'color-check-warning-desc',
    defaultMessage: 'Enabling this will override your previous color settings.'
  },
  userSelfEnrollmentWallpaper: {
    id: 'user-self-enrollment-wallpaper',
    defaultMessage: 'User Self Enrollment Wallpaper'
  }
});

@connect(state => state.admin.general,
  bindActionCreatorsSafe({
    getGeneral,
    setCustomGeneralJson,
    uploadFileCustomization,
    createPrompt
  })
)
export default class AdminCustomization extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    appstoreBitmask: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      version: 'version5'
    };
    this.linksProperties = {
      iosLinkInput: 'iosAppDownload',
      androidLinkInput: 'androidAppDownload',
      windowsLinkInput: 'windowsAppDownload',
      blackberryLinkInput: 'blackberryAppDownload',
    };

    this.linksCheckedProperties = {
      iosLinkChecked: 1,
      androidLinkChecked: 2,
      windowsLinkChecked: 4,
      blackberryLinkChecked: 8,
    };

    this.colorsProperties = {
      base: 'tintColour',
      lightBase: 'lightTintColour',
      darkBase: 'darkTintColour',
      checked: 'isTintGenerated',
    };

    this.imagesProperties = {
      webLoginLogo: 'logoWebappLogin',
      webCompanyLogo: 'logoWebapp',
      deviceLandscapeScreen: 'splashScreen',
      devicePortraitScreen: 'splashScreenPortrait',
      v5WebLoginLogo: 'logoWebappLoginV5',
      webLoginWallpaper: 'wallpaperLogin',
      v5WebMainCompanyLogo: 'logoWebappV5',
      webUserEnrolWallpaper: 'wallpaperSelfEnrol',
      v5DeviceLandscapeScreen: 'logoDevice',
    };

    autobind(this);
  }

  componentDidMount() {
    if (this.props.getGeneral) {
      this.props.getGeneral(CUSTOMIZATION);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'general-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleChange(update) {
    const updateKey = Object.keys(update)[0];
    // console.log(update);
    if (updateKey === 'colors') {
      const colorsUpdate = Object.keys(update[updateKey]).reduce((obj, key) => ({
        ...obj,
        [this.colorsProperties[key]]: update[updateKey][key]
      }), {});
      this.updateValue(colorsUpdate);
    } else if (Object.keys(this.linksProperties).indexOf(updateKey) > -1) {
      this.updateValue({
        [this.linksProperties[updateKey]]: update[updateKey]
      });
    } else if (Object.keys(this.linksCheckedProperties).indexOf(updateKey) > -1) {
      // this.props.appstoreBitmask
      this.updateValue({
        appstoreBitmask: update[updateKey] ? this.props.appstoreBitmask + this.linksCheckedProperties[updateKey] : this.props.appstoreBitmask - this.linksCheckedProperties[updateKey]
      });
    } else if (updateKey === 'version') {
      // this.props.appstoreBitmask
      this.setState(update);
    }
  }

  updateValue(update) {
    if (this.props.setCustomGeneralJson) {
      this.props.setCustomGeneralJson(CUSTOMIZATION, { values: JSON.stringify(update) });
    }
  }

  handleImageUpload(file, itemId) {
    const { fileDefaults } = this.context.settings;
    const newFile = file;
    newFile.id = itemId;
    newFile.convertSettings = fileDefaults.convertSettings;
    newFile.shareStatus = fileDefaults.shareStatus;
    newFile.hasWatermark = false;
    if (this.props.uploadFileCustomization) {
      this.props.uploadFileCustomization(this.imagesProperties[itemId], [newFile]);
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

  render() {
    const { formatMessage } = this.context.intl;
    const { authString } = this.context.settings;
    const {
      loading,
      tintColour,
      darkTintColour,
      lightTintColour,
      isTintGenerated,

      appstoreBitmask,

      logoWebapp,
      logoDevice,
      splashScreen,
      splashScreenPortrait,
      logoWebappLoginV5,
      logoWebappV5,
      wallpaperSelfEnrol,
      logoWebappLogin,
      wallpaperLogin,
      className,
      style,
    } = this.props;

    const binaryString = ('0000' + appstoreBitmask.toString(2)).slice(-4);
    const showAppLinks = Object.keys(this.linksProperties).reduce((obj, key) => ({
      ...obj,
      [`${key.replace('Input', '')}Checked`]: binaryString.charAt(Object.keys(this.linksProperties).length - 1 - Object.keys(obj).length / 2) === '1',
      [key]: this.props[this.linksProperties[key]]
    }), {});

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <AdminCustomizationEditor
          strings={generateStrings(messages, formatMessage)}
          authString={authString}
          colors={{
            base: tintColour,
            lightBase: lightTintColour,
            darkBase: darkTintColour,
            checked: isTintGenerated,
          }}
          {...showAppLinks}
          version={this.state.version}
          webLoginLogo={logoWebappLogin}
          webCompanyLogo={logoWebapp}
          deviceLandscapeScreen={splashScreen}
          devicePortraitScreen={splashScreenPortrait}
          v5WebLoginLogo={logoWebappLoginV5}
          webLoginWallpaper={wallpaperLogin}
          v5WebMainCompanyLogo={logoWebappV5}
          webUserEnrolWallpaper={wallpaperSelfEnrol}
          v5DeviceLandscapeScreen={logoDevice}
          onChange={this.handleChange}
          onImageUpload={this.handleImageUpload}
          onError={this.handleError}
        />}
      </div>
    );
  }
}
