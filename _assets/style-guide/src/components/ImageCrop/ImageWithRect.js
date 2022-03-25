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

import React, { Component } from 'react';

/**
 * Used to display the cropping rect
 */
export default class ImageWithRect extends Component {
  constructor(props) {
    super(props);

    // refs
    this.root = null;
  }

  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  redraw() {
    const img = new Image();

    img.onload = function (context, rect, width, height) {
      const ctx = context;
      ctx.drawImage(img, 0, 0, width, height);

      if (rect) {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(
          Math.round(rect.x * width) + 0.5,
          Math.round(rect.y * height) + 0.5,
          Math.round(rect.width * width),
          Math.round(rect.height * height)
        );
      }
    }.bind(this, this.root.getContext('2d'), this.props.rect, this.props.width, this.props.height);

    img.src = this.props.image;
  }

  render() {
    return (<canvas
      ref={(c) => { this.root = c; }}
      style={this.props.style}
      width={this.props.width}
      height={this.props.height}
    />);
  }
}
