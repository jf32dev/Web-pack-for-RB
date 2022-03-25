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
import classNames from 'classnames/bind';
import ColourPicker from 'components/ColourPicker/ColourPicker';

import DropMenu from 'components/RecordAudio/DropMenu';  // TODO: replace with normal DropMenu
// import _debounce from 'lodash/debounce';

/**
 * PickerDropDown description
 */
export default class PickerDropDown extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    title: PropTypes.string,

    hex: PropTypes.string,

    itemId: PropTypes.string,

    disabled: PropTypes.bool,

    showHex: PropTypes.bool,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      dropMenuActive: false,
    };
    autobind(this);
  }

  handleDropMenu() {
    const { dropMenuActive } = this.state;
    const { disabled } = this.props;

    if (!disabled) {
      this.setState({
        dropMenuActive: !dropMenuActive
      });
    }
  }

  handleColourChange({ hex }) {
    const { onChange, itemId } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(hex, itemId);
    }
  }

  render() {
    const { className, title, style, hex, disabled, showHex } = this.props;
    const { dropMenuActive } = this.state;
    const styles = require('./PickerDropDown.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PickerDropDown: true,
    }, className);

    return (
      <div className={classes} style={style}>
        <div className={styles.colourTitle}>{title}</div>
        <div className={styles.wrapper}>
          <div>
            <DropMenu
              icon="stop-fill"
              width="auto"
              className={styles.dropMenu}
              disabled={disabled}
              iconCustomStyle={{ color: hex }}
              onOpen={this.handleDropMenu}
              onClose={this.handleDropMenu}
              active={dropMenuActive}
            >
              <ColourPicker
                hex={hex}
                isVisible
                onChange={this.handleColourChange}
              />
            </DropMenu>
          </div>
          {showHex && <span>{hex}</span>}
        </div>
      </div>
    );
  }
}
