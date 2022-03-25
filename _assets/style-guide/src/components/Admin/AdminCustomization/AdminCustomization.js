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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Checkbox from 'components/Checkbox/Checkbox';
import IconRadioGroup from './IconRadioGroup';
import LogoEditItem from './LogoEditItem';
import PickerList from './PickerList';
import Select from 'react-select';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';

/**
 * Admin Customization
 */
export default class AdminCustomization extends PureComponent {
  static propTypes = {
    colors: PropTypes.object,

    /** iOS Link checkbox value */
    iosLinkChecked: PropTypes.bool,

    /** Android Link checkbox value */
    androidLinkChecked: PropTypes.bool,

    /** Windows Link checkbox value */
    windowsLinkChecked: PropTypes.bool,

    /** Apple Link inputs */
    appleLinkInput: PropTypes.string,

    /** Android Link inputs */
    androidLinkInput: PropTypes.string,

    /** Windows Link inputs */
    windowsLinkInput: PropTypes.string,

    /** select version of the customization */
    version: PropTypes.string,

    /** version 4 Web Login Logo Image Url */
    webLoginLogo: PropTypes.string,
    /** version 4 Web Company Logo Image Url */
    webCompanyLogo: PropTypes.string,
    /** version 4 Device Landscape Screen Image Url */
    deviceLandscapeScreen: PropTypes.string,
    /** version 4 Device Portrait Screen Image Url */
    devicePortraitScreen: PropTypes.string,

    /** Web Login Logo Image Url */
    v5WebLoginLogo: PropTypes.string,
    /** Web Login Logo Image Url */
    webLoginWallpaper: PropTypes.string,
    /** Web Login Logo Image Url */
    v5DeviceLandscapeScreen: PropTypes.string,
    /** Web Login Logo Image Url */
    deviceMainCompanyLogo: PropTypes.string,
    /** Web Login Logo Image Url */
    webUserEnrolWallpaper: PropTypes.string,

    authString: PropTypes.string,

    /** onChange method to get the updated value */
    onChange: PropTypes.func,
    /** onChange method to get the image file */
    onImageUpload: PropTypes.func,
    /** onError method when getting the image file */
    onError: PropTypes.func,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      colors: 'Colors',
      baseColor: 'Base Color',
      lightBaseColor: 'Light Base Color',
      darkBaseColor: 'Dark Base Color',
      autoGenerateTitle: 'Automatically generate light and dark colours',
      applicationLinks: 'Application Links',
      applicationLinksInfo: 'Display direct links to download the app on the Sign-in screen',
      insertLink: 'Insert link',
      iOS: 'iOS',
      android: 'Android',
      windows: 'Windows',
      logos: 'Logos',
      version4: 'Version 4',
      version5: 'Version 5',
      webApp: 'Web App',
      loginPageLogo: 'Login Page Logo',
      mainCompanyLogo: 'Main Company Logo',
      imageRequirements: 'Image Requirements',
      uploadImage: 'Upload Image',
      webLogoPosition: 'This logo appears on the top center of the Login screen.',
      device: 'Device',
      landscapeSplashScreen: 'Landscape Splash Screen',
      portraitSplashScreen: 'Portrait Splash Screen',
      loginWallpaper: 'Login Page Wallpaper',
      webLoginWallpaperPosition: 'Upload an image to be displayed as the wallpaper in User Self Enrolment Form.',
      v5MainCompanyLogoPosition: 'This logo appears on the top left-hand corner of the screen.',
      deviceMainCompanyLogoPosition: 'This logo appears towards the top of the device screen.',
      appIcon: 'App Icon',
      appIconDesc: 'Only Available on iOS devices running iOS 10.3 or greater.',
      userSelfEnrollmentWallpaper: 'User Self Enrollment Wallpaper',
      warning: 'Warning',
      cancel: 'Cancel',
      enable: 'Enable',
      colourCheckWarningDesc: 'Enabling this will override your previous color settings.',
    },
    version: 'version5',
    imageLinks: {},
    authString: ''
  };

  constructor(props) {
    super(props);

    this.checkboxList = ['ios', 'android', 'windows'];
    this.versions = ['version4', 'version5'];
    this.version4 = [{
      id: 'webLoginLogo',
      imageType: 'v4LoginPageLogo',
      title: `${props.strings.webApp} - ${props.strings.loginPageLogo}`,
      size: '518 × 114 px',
      positionDesc: props.strings.webLogoPosition
    }, {
      id: 'webCompanyLogo',
      imageType: 'v4MainCompanyLogo',
      title: `${props.strings.webApp} - ${props.strings.mainCompanyLogo}`,
      size: '518 × 114 px',
      positionDesc: props.strings.webCompanyPosition
    }, {
      id: 'deviceLandscapeScreen',
      imageType: 'v4LandscapeSplashScreen',
      title: `${props.strings.device} - ${props.strings.landscapeSplashScreen}`,
      size: '2048 × 1536 px',
      positionDesc: props.strings.deviceLandscapePosition
    }, {
      id: 'devicePortraitScreen',
      imageType: 'v4PortraitSplashScreen',
      title: `${props.strings.device} - ${props.strings.portraitSplashScreen}`,
      size: '1536 × 2048 px',
      positionDesc: props.strings.devicePortraitScreenPosition
    }];

    this.version5 = [{
      id: 'v5WebLoginLogo',
      imageType: 'v5LoginPageLogo',
      title: `${props.strings.webApp} - ${props.strings.loginPageLogo}`,
      size: '518 × 114 px',
      positionDesc: props.strings.webLogoPosition
    }, {
      id: 'webLoginWallpaper',
      imageType: 'v5LoginPageWallpaper',
      title: `${props.strings.webApp} - ${props.strings.loginWallpaper}`,
      size: '450 × 450 px',
      positionDesc: props.strings.webLoginWallpaperPosition
    }, {
      id: 'v5WebMainCompanyLogo',
      imageType: 'v5WebMainCompanyLogo',
      title: `${props.strings.webApp} - ${props.strings.mainCompanyLogo}`,
      size: '60 × 60 px',
      positionDesc: props.strings.v5MainCompanyLogoPosition
    }, {
      id: 'webUserEnrolWallpaper',
      imageType: 'v5LoginPageWallpaper',
      title: `${props.strings.webApp} - ${props.strings.userSelfEnrollmentWallpaper}`,
      size: '450 × 450 px',
      positionDesc: props.strings.webUserEnrolWallpaperPosition
    }, {
      id: 'v5DeviceLandscapeScreen',
      imageType: 'v4MainCompanyLogo',
      title: `${props.strings.device} - ${props.strings.mainCompanyLogo}`,
      size: '200 × 60 px',
      positionDesc: props.strings.deviceMainCompanyLogoPosition
    }];

    autobind(this);

    this.handleChangeDebounce = _compose(
      _debounce(this.handleChange.bind(this), 300),
      _clone
    );
    this.handleHexChangeDebounce = _compose(
      _debounce(this.handleHexChange.bind(this), 300),
      _clone
    );
  }

  handleChange(e) {
    const { type, value, name } = e.currentTarget;

    let update = {};

    if (type === 'radio') {
      update = {
        appIcon: value
      };
    } else if (type === 'text') {
      update = {
        [`${name}LinkInput`]: value
      };
    } else if (type === 'checkbox') {
      update = {
        [`${name}LinkChecked`]: !this.props[`${name}LinkChecked`]
      };
    }

    this.updateValue(update);
  }

  handleSelect({ value }) {
    this.updateValue({
      version: value
    });
  }

  updateValue(update) {
    const { onChange } = this.props;
    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  handleHexChange(colors) {
    this.updateValue({
      colors,
    });
  }

  render() {
    const {
      strings,
      version,
      colors,
      appIcon,
      onImageUpload,
      authString,
      onError
    } = this.props;
    const styles = require('./AdminCustomization.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminCustomization: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <h3 className={styles.colorsTitle}>{strings.colors}</h3>
        <PickerList
          baseTitle={strings.baseColor}
          lightBaseTitle={strings.lightBaseColor}
          darkBaseTitle={strings.darkBaseColor}
          checkBoxTitle={strings.autoGenerateTitle}
          strings={strings}
          defaultValues={colors}
          onChange={this.handleHexChangeDebounce}
        />
        <div className={styles.linkContainer}>
          <h3>{strings.applicationLinks}</h3>
          <p>{strings.applicationLinksInfo}</p>
          {this.checkboxList.map(k => (
            <div key={k} className={styles.links}>
              <Checkbox
                label={strings[k]}
                name={k}
                value={`${k}LinkChecked`}
                checked={this.props[`${k}LinkChecked`]}
                className={styles.linkCheckbox}
                onChange={this.handleChange}
              />
              <Text
                id={k}
                name={k}
                defaultValue={this.props[`${k}LinkInput`]}
                className={styles.linkInput}
                type="text"
                placeholder={strings.insertLink}
                onChange={this.handleChangeDebounce}
              />
            </div>
          ))}
        </div>
        <div className={styles.logos}>
          <h3>{strings.logos}</h3>
          <Select
            id="version"
            name="version"
            value={version || this.versions[1]}
            options={this.versions.map(k => ({ value: k, label: strings[k] }))}
            clearable={false}
            onChange={this.handleSelect}
            className={styles.select}
          />
        </div>
        <div className={styles.logoWrap}>
          {this[version].map(item => (
            this.props[`${item.id}`] !== 'disabled' && <LogoEditItem
              key={item.id}
              title={item.title}
              itemId={item.id}
              imageType={item.imageType}
              onImageUpload={onImageUpload}
              url={this.props[`${item.id}`] !== 'loading' ? this.props[`${item.id}`] : ''}
              isLoading={this.props[`${item.id}`] === 'loading'}
              strings={strings}
              onError={onError}
              positionDesc={item.positionDesc}
              size={item.size}
              authString={authString}
            />
          ))}
          {false && <div>
            <h3 className={styles.appIconTitle}>{strings.device} - {strings.appIcon}</h3>
            <div className={styles.appIconDesc}>{strings.appIconDesc}</div>
            <IconRadioGroup
              onChange={this.handleChange}
              selectedValue={appIcon}
            />
          </div>}
        </div>
      </div>
    );
  }
}
