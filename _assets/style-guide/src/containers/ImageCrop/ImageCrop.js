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
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import { ImageCrop } from 'components';

const ImageCropDocs = require('!!react-docgen-loader!components/ImageCrop/ImageCrop.js');

export default class ImageCropView extends Component {
  handleOnImageChange(image) {
    console.log('Image updated');
    console.log(image);
  }

  render() {
    return (
      <section id="ImageCropView">
        <h1>ImageCrop</h1>
        <Docs {...ImageCropDocs} />

        <h2>Basic example</h2>
        <ComponentItem>
          <ImageCrop
            image="/src/static/logo.png"
            showZoom
            onImageChange={this.handleOnImageChange}
          />
        </ComponentItem>
      </section>
    );
  }
}
