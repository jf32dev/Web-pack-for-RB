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
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import AvatarEditor from 'react-avatar-editor';

import Btn from 'components/Btn/Btn';
import ImageWithRect from './ImageWithRect';

const messages = defineMessages({
  preview: { id: 'preview', defaultMessage: 'Preview' },
  imageCropNote: { id: 'image-crop-note', defaultMessage: 'Drag image above to reposition. Use slider to scale image.' },
});

/**
 * Image Crop: <a href="https://github.com/mosch/react-avatar-editor">react-avatar-editor</a>
 */
export default class ImageCrop extends Component {
  static propTypes = {
    /** Image to crop */
    image: PropTypes.string.isRequired,

    /** Canvas width */
    width: PropTypes.number,

    /** Canvas height */
    height: PropTypes.number,
    showZoom: PropTypes.bool,
    showBorderRadius: PropTypes.bool,

    /** resize Image to */
    resize: PropTypes.bool,
    resizeHeight: PropTypes.number,
    resizeWidth: PropTypes.number,

    /** Return new Image cropped */
    onImageChange: function(props) {
      if (typeof props.onImageChange !== 'function') {
        return new Error('onImageChange should be a callback function.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    width: 200,
    height: 200
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      borderRadius: 0,
      preview: null
    };
    autobind(this);

    // refs
    this.avatar = null;
    this.borderRadius = null;
    this.scale = null;
    this.avatarScaleUpdate = 1;
  }

  handleSave() { //parameter data
    const img = this.avatar ? this.avatar.getImage().toDataURL() : this.props.image;
    const rect = this.avatar ? this.avatar.getCroppingRect() : {};
    this.setState({ preview: img, croppingRect: rect });
    if (this.props.resize && this.avatar) {
      // create an off-screen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // set its dimension to target size
      canvas.width = this.props.resizeWidth;
      canvas.height = this.props.resizeHeight;

      // draw source image into the off-screen canvas:
      ctx.drawImage(this.avatar.getImage(), 0, 0, this.props.resizeWidth, this.props.resizeHeight);

      // encode image to data-uri with base64 version of compressed image
      this.props.onImageChange(canvas.toDataURL(), rect);
    } else {
      // Keep Image size
      this.props.onImageChange(img, rect);
    }
  }

  handleScale() {
    const scale = parseFloat(this.scale.value);
    this.setState({ scale: scale });
  }

  handleBorderRadius() {
    const borderRadius = parseInt(this.borderRadius.value, 10);
    this.setState({ borderRadius: borderRadius });
  }

  handleMouseOut() {
    //if the scale is updated, run the save method
    if (this.avatarScaleUpdate !== this.state.scale) {
      this.avatarScaleUpdate = this.state.scale;
      this.handleSave();
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      image,
      showBorderRadius,
      showPreviewButton,
      showZoom
    } = this.props;
    const styles = require('./ImageCrop.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ImageCrop: true
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={classes} style={this.props.style}>
        <AvatarEditor
          ref={(c) => { this.avatar = c; }}
          scale={this.state.scale}
          borderRadius={this.state.borderRadius}
          onMouseUp={this.handleSave}
          onImageChange={this.handleSave}
          onImageReady={this.handleSave}
          image={image}
          border={0}
          width={this.props.width}
          height={this.props.height}
        />

        {showZoom && <div className={styles.zoomSlider} onMouseOut={this.handleMouseOut}>
          <span className="icon-image" />
          <input
            ref={(c) => { this.scale = c; }}
            name="scale"
            type="range"
            onChange={this.handleScale}
            min="1"
            max="2"
            step="0.01"
            defaultValue="1"
          />
          <span className="icon-image" />
        </div>}

        <div className={styles.info}>{strings.imageCropNote}</div>

        {showBorderRadius && <div className={styles.boderRadiusSlider}>
          <span className="icon-image" />
          <input
            ref={(c) => { this.borderRadius = c; }}
            name="scale"
            type="range"
            onChange={this.handleBorderRadius}
            min="0"
            max="100"
            step="1"
            defaultValue="0"
          />
          <span className="icon-image" />
        </div>}

        {showPreviewButton && <div>
          <Btn
            borderless inverted large
            onClick={this.handleSave}
          >
            {strings.preview}
          </Btn>
          <div>
            <img
              alt={strings.preview}
              src={this.state.preview}
              style={{ borderRadius: this.state.borderRadius + 5 /* because of the 5px padding */ }}
            />
            {this.state.croppingRect && // Preview the full image with display only if there is a cropping rect
            <ImageWithRect
              width={200 * 478 / 270}
              height={200}
              image={image}
              rect={this.state.croppingRect}
              style={{
                margin: '10px 24px 32px',
                padding: 5,
                border: '1px solid #CCC'
              }}
            />}
          </div>
        </div>}
      </div>
    );
  }
}
