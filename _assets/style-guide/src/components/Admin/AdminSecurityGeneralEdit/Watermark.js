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

import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

/**
 * Blank description
 */
export default class Watermark extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    watermarkSettings: PropTypes.object,

    onAnchorClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    watermarkSettings: {
      text: '__firstnamelastname__',
      opacity: '0.2',
      colour: '#444444',

      userFirstName: 'Public',
      userLastName: 'Viewer',
      userEmail: 'public@viewer'
    }
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.watermark = null;
    autobind(this);
  }

  componentDidMount() {
    this.applyWatermark(this.props.watermarkSettings);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_isEqual(this.props.watermarkSettings, nextProps.watermarkSettings)) {
      this.applyWatermark(nextProps.watermarkSettings);
    }
  }

  applyWatermark(watermarkSettings) {
    if (this.watermark) {
      const canvas = this.watermark;
      const ctx = canvas.getContext('2d');
      const font = '24pt "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif';
      let text = watermarkSettings.text;

      // Watermark variables
      switch (text) {
        case '__firstnamelastname__':
          text = watermarkSettings.userFirstName + ' ' + watermarkSettings.userLastName;
          break;
        case '__lastnamefirstname__':
          text = watermarkSettings.userLastName + ' ' + watermarkSettings.userFirstName;
          break;
        case '__email__':
          text = watermarkSettings.userEmail;
          break;
        default:
          break;
      }

      // Set canvas dimensions equal to window
      canvas.height = window.innerHeight - 95;
      canvas.width = window.innerWidth;

      // Calculate text width to use as watermark text width
      ctx.font = font;
      const textWidth = ctx.measureText(text).width || 300;

      // Create watermark text
      const watermarkText = document.createElement('canvas');
      const ctx2 = watermarkText.getContext('2d');

      // Set dimensions of text
      watermarkText.width = textWidth + 30;  // add some padding
      watermarkText.height = 100;

      // Write to canvas
      ctx2.globalAlpha = watermarkSettings.opacity;
      ctx2.font = font;
      ctx2.fillStyle = watermarkSettings.colour;
      ctx2.fillText(text, 0, 50);

      // Create pattern from text
      const watermarkPattern = document.createElement('canvas');
      const watermarkCtx = watermarkPattern.getContext('2d');
      const pattern = watermarkCtx.createPattern(watermarkText, 'repeat');

      // Add pattern to image canvas
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = pattern;
      ctx.rotate(-45 * Math.PI / 180);
      ctx.fill();
    }
  }

  render() {
    const styles = require('./Watermark.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Watermark: true,
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <canvas
          ref={(c) => { this.watermark = c; }}
          className={styles.watermarkCanvas}
        />
      </div>
    );
  }
}
