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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */
import moment from 'moment-timezone';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

/**
 * Displays Share Watermark on various Viewer File.
 */
export default class Watermark extends Component {
  static propTypes = {
    email: PropTypes.string,
    customText: PropTypes.string,
    opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    colour: PropTypes.string,
    showDate: PropTypes.bool,
    type: PropTypes.oneOf(['presentation'])
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    email: '',
    customText: '',
    opacity: 60,
    colour: '#444444',
    showDate: false,
    strings: {
      sentBy: 'Sent by'
    },
    type: null
  };

  constructor(props) {
    super(props);
    this.state = {
      watermarkApplied: false
    };
    autobind(this);

    this.watermark = null;
  }

  componentDidMount() {
    const { email, customText, showDate } = this.props;
    this.toggleFullScreenForPresentation();

    // Public Share landing page - Security Watermark?
    if (email || customText || showDate) {
      this.applyShareWatermark();
    }

    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('fullscreenchange', this.toggleFullScreenForPresentation);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('fullscreenchange', this.toggleFullScreenForPresentation);
  }

  toggleFullScreenForPresentation() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    this.isPresentationNotFullscreen = this.props.type === 'presentation' && !isFullscreen;
    this.handleWindowResize();
  }

  applyShareWatermark() {
    const {
      email,
      customText,
      opacity,
      colour,
      showDate,
      strings
    } = this.props;

    if (this.watermark) {
      const canvas = this.watermark;
      const ctx = canvas.getContext('2d');
      const font = 'normal 13pt "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif';
      const firstRow = email ? strings.sentBy + ': ' + email : '';
      const secondRow = moment().format('L');

      // Set canvas dimensions equal to window
      // for presentation
      if (this.isPresentationNotFullscreen) {
        canvas.height = window.innerHeight < 580 ? window.innerHeight - 95 : 580;
        canvas.width = window.innerWidth < 870 ? window.innerWidth : 870;
        // Other files
      } else if (this.props.type === 'presentation' && !this.isPresentationNotFullscreen) {
        canvas.height = 640;
        canvas.width = 980;
      } else {
        canvas.height = window.innerHeight - 95;
        canvas.width = window.innerWidth;
      }

      // Write to canvas
      ctx.globalAlpha = parseFloat(opacity / 100);
      ctx.font = font;
      //ctx.fillStyle = shareWatermarkSettings.colour;
      ctx.fillStyle = colour;

      // Calculate max width of the texts
      const arr = [];
      if (customText) arr.push(ctx.measureText(customText).width);
      if (secondRow) arr.push(ctx.measureText(secondRow).width);
      if (firstRow) arr.push(ctx.measureText(firstRow).width);

      const textWidth = Math.max(...arr) || 300;

      // height is font size
      const height = 12;
      const marginRight = this.props.type === 'presentation' ? 0 : 120;

      // change the origin coordinate to the middle of the context
      ctx.translate(canvas.width, 60);
      // as the origin is now at the center, just need to center the text
      const lineText = [];
      if (firstRow) lineText.push(firstRow);
      if (showDate) lineText.push(secondRow);
      if (customText) lineText.push(customText);

      lineText.map((row, index) => (
        ctx.fillText(row, -textWidth - marginRight, height / 2 + (index * 20))
      ));

      this.setState({ watermarkApplied: true });
    }
  }

  handleWindowResize() {
    const {
      email,
      customText,
      showDate
    } = this.props;
    // Redraw watermark
    if (this.state.watermarkApplied && (email || customText || showDate)) {
      this.applyShareWatermark();
    }
  }

  render() {
    const {
      email,
      customText,
      showDate
    } = this.props;
    const styles = require('./Viewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      watermark: this.props.type !== 'presentation',
      watermarkPresentation: this.isPresentationNotFullscreen,
      watermarkPresentationFullScreen: this.props.type === 'presentation' && !this.isPresentationNotFullscreen
    });

    const hasShareWatermark = email || customText || showDate;

    return (<canvas
      ref={(c) => { this.watermark = c; }}
      className={classes}
      style={{ display: hasShareWatermark ? 'block' : 'none' }}
    />);
  }
}
