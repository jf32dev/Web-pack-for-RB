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

import _get from 'lodash/get';
import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import PropTypes from 'prop-types';

import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';
import Btn from 'components/Btn/Btn';
import ItemSelected from 'components/MultiSelect/ItemSelected';

import WatermarkEditor from './WatermarkEditor';

const WATERMARK_FIRSTNAMELASTNAME = '__firstnamelastname__';

function validateEmail(email) {
  const re = /[^@]+@[^@]+\.[^@]+/;
  return re.test(email);
}

/**
 * SecurityGeneral Component for edit Security General information
 */
export default class AdminSecurityGeneralEdit extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** Hide Share CC field in the email, true or false */
    isShareCCHidden: PropTypes.bool,

    /** Share BCC addresses list */
    shareBccAddressList: PropTypes.array,

    /** Disable JavaScript in files, true or false */
    isJsInFileDisable: PropTypes.bool,

    /** Disable JavaScript in Story descriptions, true or false */
    isJsInStoryDescDisable: PropTypes.bool,

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

    className: PropTypes.string,
    style: PropTypes.object,

    saveDisabled: PropTypes.bool,
    saveLoading: PropTypes.bool,

    onSave: PropTypes.func,
  };

  static defaultProps = {
    strings: {
      email: 'Email',
      hideShareCCfield: 'Hide Share CC field',
      add: 'Add',
      shareBCCAddresses: 'Share BCC addresses',
      javaScript: 'JavaScript',
      disableFileJS: 'Disable JavaScript in files',
      disableStoryDescJS: 'Disable JavaScript in Story descriptions',
      watermark: 'Watermark',
      overlayText: 'Overlay text',
      tintColor: 'Tint Color',
      opacity: 'Opacity',
      preview: 'Preview',
      secureStorage: 'Secure Storage',
      blurEmailThumbnails: 'Blur email thumbnails',
      firstNameLastName: 'First Name + Last Name',
      lastNameFirstName: 'Last Name + First Name',
      customText: 'Custom text',
    },
    isShareCCHidden: false,
    shareBccAddressList: [],
    shareBCCAddresses: '',
    isJsInFileDisable: false,
    isJsInStoryDescDisable: false,
    overlayText: WATERMARK_FIRSTNAMELASTNAME,
    tintColour: '#dddddd',
    opacity: '0',
    userFirstName: 'Jason',
    userLastName: 'Huang',
    userEmail: 'email@bigtincan.com',
    isSecureStorage: {
      blurEmailThumbnails: false,
      enabled: false
    },
    saveDisabled: true,
    saveLoading: false
  };

  constructor(props) {
    super(props);
    this.state = {
      shareBCCAddresses: ''
    };

    autobind(this);

    this.handleDebounceChange = _compose(
      _debounce(props.onChange.bind(this), 300),
      _clone
    );
  }

  handleChange(e, context) {
    const { type, value, name } = e.currentTarget;
    const { onChange } = this.props;
    const { shareBCCAddresses, shareBCCAddressesError } = this.state;
    const removeAddressItem = _get(context, 'value', false);
    let isUpdate = true;
    let update = {};

    if (type === 'checkbox') {
      if (name === 'isSecureStorage') {
        update = {
          [name]: { ...this.props[name], blurEmailThumbnails: !this.props[name].blurEmailThumbnails },
        };
      } else {
        update = {
          [name]: !this.props[name],
        };
      }
    } else if (name === 'shareBCCAddresses') {
      this.setState({
        shareBCCAddresses: value
      });
      if (shareBCCAddressesError) {
        this.setState({
          shareBCCAddressesError: false
        });
      }
      isUpdate = false;
    } else if (name === 'addBtn') {
      if (validateEmail(shareBCCAddresses) && this.props.shareBccAddressList.indexOf(shareBCCAddresses) < 0) {
        update = {
          shareBccAddressList: this.props.shareBccAddressList.concat(shareBCCAddresses),
        };
        this.setState({
          shareBCCAddresses: ''
        });
      } else {
        this.setState({
          shareBCCAddressesError: true
        });
        isUpdate = false;
      }
    } else if (removeAddressItem) {
      update = {
        shareBccAddressList: this.props.shareBccAddressList.filter(item => item !== removeAddressItem),
      };
    } else if (name === 'overlayText') {
      update = {
        [name]: value,
      };
    } else if (name === 'opacity') {
      let result = value > 100 ? 100 : value;
      result = result < 0 ? 0 : result;
      update = {
        [name]: result,
      };
    }

    if (onChange && typeof onChange === 'function' && isUpdate) {
      onChange(update);
    }
  }

  render() {
    const { shareBCCAddresses, shareBCCAddressesError } = this.state;

    const styles = require('./AdminSecurityGeneralEdit.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SecurityGeneralEdit: true
    }, this.props.className);

    const shareBCCAddressesClasses = cx({
      shareBCCAddresses: true,
      inputError: shareBCCAddressesError
    });

    const {
      strings,
      onChange,
      isShareCCHidden,
      isJsInFileDisable,
      isJsInStoryDescDisable,
      isSecureStorage,
      overlayText,
      shareBccAddressList,
      opacity,
      userFirstName,
      userLastName,
      userEmail,
      tintColour,
      saveDisabled,
      saveLoading,
      onSave
    } = this.props;

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.btnContainer}>
          <Btn
            inverted
            large
            borderless
            loading={saveLoading}
            disabled={saveDisabled}
            onClick={onSave}
          >
            {strings.save}
          </Btn>
        </div>
        <section>
          <h3>{strings.email}</h3>
          <Checkbox
            label={strings.hideShareCCfield}
            name="isShareCCHidden"
            className={styles.checkbox}
            checked={isShareCCHidden}
            onChange={this.handleChange}
          />
          <div className={styles.shareBCCAddressesContainer}>
            <Text
              id="ShareBCCAddresses"
              className={shareBCCAddressesClasses}
              label={strings.shareBCCAddresses}
              name="shareBCCAddresses"
              placeholder="username@domain.com"
              value={shareBCCAddresses}
              onChange={this.handleChange}
            />
            <Btn
              inverted large className={styles.addBtn}
              name="addBtn" onClick={this.handleChange}
            >{strings.add}</Btn>
          </div>
          <ul>
            {shareBccAddressList && shareBccAddressList.map((item, index) => (
              <ItemSelected
                key={item + '-' + index}
                value={item}
                index={index}
                label={item}
                canRemove
                onRemoveClick={this.handleChange}
              />
            ))}
          </ul>
        </section>
        <section>
          <h3>{strings.javaScript}</h3>
          <Checkbox
            label={strings.disableFileJS}
            name="isJsInFileDisable"
            checked={isJsInFileDisable}
            className={styles.checkbox}
            onChange={this.handleChange}
          />
          <Checkbox
            label={strings.disableStoryDescJS}
            name="isJsInStoryDescDisable"
            checked={isJsInStoryDescDisable}
            className={styles.checkbox}
            onChange={this.handleChange}
          />
        </section>
        <section>
          <h3>{strings.watermark}</h3>
          <WatermarkEditor
            strings={strings}
            styles={styles}
            overlayText={overlayText}
            tintColour={tintColour}
            opacity={opacity}
            userFirstName={userFirstName}
            userLastName={userLastName}
            userEmail={userEmail}
            isSecureStorage={isSecureStorage}
            onCheckboxChange={this.handleChange}
            onChange={onChange}
            onDebounceChange={this.handleDebounceChange}
          />
        </section>
      </div>
    );
  }
}
