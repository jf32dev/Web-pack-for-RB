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

import React, { Component } from 'react';
import autobind from 'class-autobind';

import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import PresentationViewer from 'components/ViewerFiles/PresentationViewer/PresentationViewer';
import PowerpointThumbnailGenerator from 'components/PowerpointThumbnailGenerator/PowerpointThumbnailGenerator';


const PresentationViewerDocs = require('!!react-docgen-loader!components/ViewerFiles/PresentationViewer/PresentationViewer.js');
const PowerpointThumbnailGeneratorDocs = require('!!react-docgen-loader!components/PowerpointThumbnailGenerator/PowerpointThumbnailGenerator.js');


const btcp = require('../../static/btcp.json');

export default class PresentationViewerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      loading: true,
      totalPages: 1,
      thumbPanelVisible: false,
      slideThumbnails: []
    };

    this.isToolbarVisible = true;

    autobind(this);
  }

  handleLoad() {
    this.setState({ loading: false });
  }

  handleError(event) {
    console.log(event);
  }

  handleGetSlideCount(event, data) {
    this.setState({ totalPages: data.slideCount });
  }

  handleGetSlideThumbnails(slideThumbnails) {
    this.setState({
      slideThumbnails: slideThumbnails
    });
  }

  handleSlideChange(event, data) {
    this.setState({ currentPage: data.currentSlide });
  }

  handleThumbPanelChange(event, data) {
    this.setState({ thumbPanelVisible: data.thumbPanelVisible });
  }

  render() {
    return (
      <section id="PresentationViewerView">
        <h1>PresentationViewer</h1>
        <Docs {...PresentationViewerDocs} />
        <ComponentItem style={{ height: '500px' }}>
          <PresentationViewer
            id={btcp.id}
            baseUrl={btcp.baseUrl}
            isToolbarVisible={this.isToolbarVisible}
            currentSlide={this.state.currentPage}
            thumbPanelVisible={this.state.thumbPanelVisible}
            onGetSlideCount={this.handleGetSlideCount}
            onSlideChange={this.handleSlideChange}
            onThumbPanelChange={this.handleThumbPanelChange}
            onLoad={this.handleLoad}
            onError={this.handleError}
          />
        </ComponentItem>

        <h2>PowerpointThumbnailGenerator</h2>
        <p>Provides method called <code>onGetSlideThumbnails</code> to get thumbnails of powerpoint files.</p>
        <Docs {...PowerpointThumbnailGeneratorDocs} />
        <ComponentItem style={{ height: '500px' }}>
          <PowerpointThumbnailGenerator
            id={btcp.id}
            baseUrl={btcp.baseUrl}
            onGetSlideThumbnails={this.handleGetSlideThumbnails}
            onLoad={this.handleLoad}
            onError={this.handleError}
          />

          {this.state.slideThumbnails.map((thumb, index) => (
            <img
              key={index}
              src={`${btcp.baseUrl}${thumb}`}
              alt={thumb}
              style={{
                margin: '1rem'
              }}
            />
          ))}

          {this.state.slideThumbnails &&
            <pre>
              <code>
                {JSON.stringify(this.state.slideThumbnails,null, 4)}
            </code>
            </pre>
          }
        </ComponentItem>
      </section>
    );
  }
}
