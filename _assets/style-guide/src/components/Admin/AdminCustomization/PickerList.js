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

import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import tinycolor from 'tinycolor2';

import Checkbox from 'components/Checkbox/Checkbox';
import Dialog from 'components/Dialog/Dialog';
import PickerDropDown from '../AdminSecurityGeneralEdit/PickerDropDown';

/**
 * PickerList description
 */
export default class PickerList extends PureComponent {
  static propTypes = {
    defaultValues: PropTypes.shape({
      base: PropTypes.string,
      lightBase: PropTypes.string,
      darkBase: PropTypes.string,
      checked: PropTypes.bool,
    }),

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    customProp2: [],
    strings: {},
    defaultValues: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      base: props.defaultValues.base || '#000000',
      lightBase: props.defaultValues.lightBase || '#000000',
      darkBase: props.defaultValues.darkBase || '#000000',
      checked: props.defaultValues.checked || false,
    };

    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.defaultValues && this.props.defaultValues !== nextProps.defaultValues) {
      this.setState(nextProps.defaultValues);
    }
  }

  handleChange(e) {
    const { name, checked } = e.currentTarget;
    if (name === 'autoGenerate' && checked) {
      this.setState({
        dialogVisible: true,
        checked: false,
      });
    } else if (name === 'autoGenerate' && !checked) {
      this.setState({
        checked: false,
      });
      this.sendProps({
        base: this.state.base,
        lightBase: this.state.lightBase,
        darkBase: this.state.darkBase,
        checked: false,
      });
    }
  }

  handleDialogCloseClick() {
    this.setState({
      dialogVisible: false,
      checked: false,
    });
  }

  handleDialogConfirmClick() {
    this.setState({
      dialogVisible: false,
      checked: true,
    });
    this.updateColors(this.state.base);
  }

  handleHexChange(hex, itemId) {
    if (this.state.checked) {
      this.updateColors(hex);
    } else {
      this.sendProps({
        base: this.state.base,
        lightBase: this.state.lightBase,
        darkBase: this.state.darkBase,
        checked: false,
        [itemId]: hex,
      });
    }

    this.setState({
      [itemId]: hex
    });
  }

  updateColors(hex) {
    const color = tinycolor(hex);
    let update = {};
    if (this.state.lightBase !== color.clone().lighten(35).toString()) {
      update = {
        lightBase: color.clone().lighten(35).toString()
      };
      this.sendProps(update.lightBase, 'lightBase');
    }

    if (this.state.darkBase !== color.clone().darken(15).toString()) {
      update = {
        ...update,
        darkBase: color.clone().darken(15).toString()
      };
    }

    this.sendProps({
      base: hex,
      lightBase: this.state.lightBase,
      darkBase: this.state.darkBase,
      ...update,
      checked: true,
    });

    if (!_isEmpty(update)) {
      this.setState(update);
    }
  }

  sendProps(update) {
    const { onChange } = this.props;
    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  render() {
    const { checkBoxTitle, strings } = this.props;
    const { checked } = this.state;
    const styles = require('./PickerList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PickerList: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.list}>
          {['base', 'lightBase', 'darkBase'].map(k => (
            <PickerDropDown
              key={k}
              itemId={k}
              title={this.props[k + 'Title']}
              onChange={this.handleHexChange}
              hex={this.state[k]}
              disabled={k !== 'base' && checked}
            />
          ))}
        </div>
        <Checkbox
          label={checkBoxTitle}
          name="autoGenerate"
          className={styles.checkbox}
          checked={checked}
          onChange={this.handleChange}
        />
        <Dialog
          isVisible={this.state.dialogVisible}
          title={strings.warning + '!'}
          message={strings.colourCheckWarningDesc}
          cancelText={strings.cancel}
          confirmText={strings.enable}
          onCancel={this.handleDialogCloseClick}
          onConfirm={this.handleDialogConfirmClick}
        />
      </div>
    );
  }
}
