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

import AudioVideo from 'components/ViewerFiles/AudioVideo';

const AudioVideoDocs = require('!!react-docgen-loader!components/ViewerFiles/AudioVideo.js');

export default class AudioVideoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      platform: require('platform')
    };
    autobind(this);
  }

  handleFullScreenClick(event) {
    console.log(event);
  }

  render() {
    const { platform } = this.state;

    // Enable autoPlay for iOS Safari
    const autoPlay = platform.name === 'Safari' && platform.os.family === 'iOS';

    return (
      <section id="AudioVideoView">
        <h1>AudioVideo</h1>
        <Docs {...AudioVideoDocs} />

        <ComponentItem style={{ height: '500px', position: 'relative' }}>
          <AudioVideo
            url={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            alternateUrl={'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/87/Schlossbergbahn.webm/Schlossbergbahn.webm.480p.webm'}
            title="Demonstration"
            height="75%"
            width="75%"
            autoPlay={autoPlay}
            startTime={5}
            isVideo
            onFullscreenClick={this.handleFullScreenClick}
          />
        </ComponentItem>

        <ComponentItem style={{ height: '500px', position: 'relative' }}>
          <AudioVideo
            url={'https://www2.iis.fraunhofer.de/AAC/ChID-BLITS-EBU-Narration.mp4'}
            title="Demonstration"
            autoPlay={autoPlay}
            startTime={20}
          />
        </ComponentItem>
      </section>
    );
  }
}
