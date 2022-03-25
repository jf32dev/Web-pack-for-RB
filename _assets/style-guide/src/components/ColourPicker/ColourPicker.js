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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ChromePicker from 'react-color/lib/components/chrome/Chrome';

/**
 * This is a wrapper component for <a href="https://casesandberg.github.io/react-color/">react-color</a>.
 */
export default class ColourPicker extends PureComponent {
  static propTypes = {
    /** Current colour as a hex string */
    hex: PropTypes.string,

    /** Pass all strings as an objec1t */
    strings: PropTypes.object,

    /** Handle visiblity */
    isVisible: PropTypes.bool,

    /** Called every time colour is changed */
    onChange: PropTypes.func.isRequired,

    /** Called when a colour pick is completed */
    onChangeComplete: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    hex: '#F26724'
  };

  handleClick(event) {
    event.stopPropagation();
  }

  render() {
    if (!this.props.isVisible) {
      return null;
    }

    return (
      <div
        className={this.props.className}
        style={this.props.style}
        onClick={this.handleClick}
      >
        <ChromePicker
          disableAlpha
          color={{ hex: this.props.hex }}
          onChange={this.props.onChange}
          onChangeComplete={this.props.onChangeComplete}
        />
      </div>
    );
  }
}
