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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';
import ImageViewer from 'components/ViewerFiles/ImageViewer/ImageViewer';

const ImageDocs = require('!!react-docgen-loader!components/ViewerFiles/ImageViewer/ImageViewer.js');
const word = require('../../static/files.json')[9];

export default class ImageViewerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPages: false,
    };
    autobind(this);
  }

  handleError(event) {
    console.log(event);
  }

  handlePagesToggle() {
    this.setState({ showPages: !this.state.showPages });
  }

  render() {
    return (
      <section id="ImageViewerView">
        <h1>ImageViewer</h1>
        <Docs {...ImageDocs} />

        <h1>Single Image</h1>
        <ComponentItem style={{ height: '500px' }}>
          <ImageViewer
            //url="src/static/200px_height.png"
            url="src/static/200px_width.png"
            onError={this.handleError}
          />
        </ComponentItem>

        <h2>Multiple Images</h2>
        <p><Btn onClick={this.handlePagesToggle}>Toggle Pages</Btn></p>
        <ComponentItem style={{ height: '500px', overflow: 'hidden' }}>
          <ImageViewer
            pages={word.pages}
            showPages={this.state.showPages}
            onError={this.handleError}
            multi
          />
        </ComponentItem>
      </section>
    );
  }
}
