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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import Select from 'react-select';

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import PipsRangeSlider from 'components/RangeSlider/PipsRangeSlider';

import Watermark from './Watermark';
import PickerDropDown from './PickerDropDown';

const WATERMARK_FIRSTNAMELASTNAME = '__firstnamelastname__';
const WATERMARK_LASTNAMEFIRSTNAME = '__lastnamefirstname__';
const WATERMARK_EMAIL = '__email__';
const WATERMARK_CUSTOMTEXT = '__customtext__';

/**
 * SecurityGeneral Component for edit Security General information
 */
export default class WatermarkEditor extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** Watermark's Overlay text type */
    overlayText: PropTypes.string,

    /** Watermark's tintColour hex code */
    tintColour: PropTypes.string,

    /** Watermark's opacity value */
    opacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** Secure Storage */
    isSecureStorage: PropTypes.object,

    /** onChange method, trigger every time some input changes */
    onChange: PropTypes.func,

    styles: PropTypes.object
  };

  static defaultProps = {
    overlayText: WATERMARK_FIRSTNAMELASTNAME,
    tintColour: '#dddddd',
    opacity: '0',
    userFirstName: 'Jason',
    userLastName: 'Huang',
    userEmail: 'email@bigtincan.com',
    isSecureStorage: {
      blurEmailThumbnails: false,
      enabled: false
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      hex: props.tintColour || '#dddddd',
      opacity: props.opacity || '0',
      overlayText: props.overlayText || WATERMARK_FIRSTNAMELASTNAME,
    };

    autobind(this);
  }

  handleRangeSliderChange(opacity) {
    const { onDebounceChange } = this.props;

    if (onDebounceChange && typeof onDebounceChange === 'function') {
      onDebounceChange({ opacity });
    }
    this.setState({
      opacity
    });
  }

  handleChange(e) {
    const { value, name } = e.currentTarget;
    const { onDebounceChange } = this.props;

    let update = {};
    let result = value;

    if (name === 'overlayText') {
      update = {
        [name]: value,
      };
    } else if (name === 'opacity') {
      if (result > 100) result = 100;
      if (result < 0) result = 0;
      result = parseInt(result, 10) || 0;
      update = {
        [name]: result,
      };
    }

    this.setState({
      [name]: result
    });

    if (onDebounceChange && typeof onDebounceChange === 'function') {
      onDebounceChange(update);
    }
  }

  handleSelect({ value }) {
    const { onChange } = this.props;
    const overlayText = value === WATERMARK_CUSTOMTEXT ? '' : value;

    if (onChange && typeof onChange === 'function') {
      onChange({ overlayText });
    }
    this.setState({
      overlayText
    });
  }

  handleHexChange(hex) {
    const { onDebounceChange } = this.props;
    if (onDebounceChange && typeof onDebounceChange === 'function') {
      onDebounceChange({ tintColour: hex });
    }
    this.setState({
      hex,
    });
  }

  handleKeyDown(event) {
    //prevent maxlength
    if (event.target.value.length >= 3 && event.keyCode > 47 && event.keyCode < 58) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }

    switch (event.keyCode || event.which) {
      case 187: // minus -
      case 188: // point .
      case 189: // plus +
      case 190: // comma ,
      case 17: // control ,
      case 91: // command ,
      case 69: // letter E ,
        event.stopPropagation();
        event.preventDefault();
        break;
      default:
        break;
    }

    return true;
  }

  render() {
    const {
      strings,
      isSecureStorage,
      userFirstName,
      userLastName,
      userEmail,
      styles,
      onCheckboxChange
    } = this.props;

    const {
      overlayText,
      opacity,
      hex,
    } = this.state;

    const overlayTextList = [{
      value: WATERMARK_FIRSTNAMELASTNAME,
      label: strings.firstNameLastName
    }, {
      value: WATERMARK_LASTNAMEFIRSTNAME,
      label: strings.lastNameFirstName
    }, {
      value: WATERMARK_EMAIL,
      label: strings.email
    }, {
      value: WATERMARK_CUSTOMTEXT,
      label: strings.customText
    }];

    return (
      <div className={styles.watermarkContainer}>
        <div className={styles.watermarkControlContainer}>
          <label htmlFor="overlayText">{strings.overlayText}</label>
          <Select
            id="overlayText"
            name="overlayText"
            value={overlayTextList.filter(item => item.value === overlayText).length > 0 ? overlayText : WATERMARK_CUSTOMTEXT}
            options={overlayTextList}
            clearable={false}
            onChange={this.handleSelect}
            className={styles.overlayTextSelector}
          />
          {(overlayText === WATERMARK_CUSTOMTEXT ||
            overlayTextList.filter(item => item.value === overlayText).length === 0) &&
            <Text
              id="overlayText"
              className={styles.overlayTextInput}
              name="overlayText"
              defaultValue={overlayText}
              onChange={this.handleChange}
            />
          }
          <PickerDropDown
            title={strings.tintColor}
            hex={hex}
            showHex
            onChange={this.handleHexChange}
            className={styles.pickerContainer}
          />
          <div className={styles.opacityContainer}>
            <Text
              id={'opacity_' + opacity}
              name="opacity"
              defaultValue={opacity}
              label={strings.opacity}
              min={0}
              max={100}
              size={3}
              pattern="(100|([0-9][0-9])|[1-9])"
              type="number"
              className={styles.opacityText}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
            <span className={styles.opacityPercentage}>%</span>
          </div>
          {false && <div className={styles.PipsRangeSliderContainer}>
            <PipsRangeSlider
              barColour={['#f5f5f5', '#f5f5f5']}
              onChange={this.handleRangeSliderChange}
              value={parseInt(opacity, 10) || 0}
            />
          </div>}
          {isSecureStorage.enabled &&
          <React.Fragment>
            <h3>{strings.secureStorage}</h3>
            <Checkbox
              label={strings.blurEmailThumbnails}
              name="isSecureStorage"
              className={styles.checkbox}
              checked={isSecureStorage.blurEmailThumbnails}
              onChange={onCheckboxChange}
            />
          </React.Fragment>
          }
        </div>
        <div className={styles.watermarkWrapper}>
          <label htmlFor="watermark">{strings.preview}</label>
          <Watermark
            name="watermark"
            className={styles.watermark}
            watermarkSettings={{
              text: overlayText,
              opacity: opacity / 100,
              colour: this.state.hex,
              userFirstName: userFirstName,
              userLastName: userLastName,
              userEmail: userEmail,
            }}
          />
        </div>
      </div>
    );
  }
}
