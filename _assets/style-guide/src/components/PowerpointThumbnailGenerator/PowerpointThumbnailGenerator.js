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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const PowerpointThumbnailGenerator = props => {
  const {
    baseUrl,
    id,
    category,
    onLoad,
    onGetSlideThumbnails,
    onError
  } = props;

  const btcFrameRef = useRef();

  const handleFrameLoaded = frame => {
    if (btcFrameRef.current) {
      btcFrameRef.current.contentWindow.postMessage('getSlideThumbnails?', '*');
    }

    onLoad(frame);
  };

  // Recieve message from BTC iFrame
  const receiveMessage = ({ source, data }) => {
    if (source !== btcFrameRef.current.contentWindow) {
      return; // Skip message in this event listener
    }

    if (typeof data === 'string' && data.indexOf('slideshowtimeupdate') < 0) {
      // Total Slides
      if (data.indexOf('getSlideThumbnails') > -1) {
        const slideThumbnails = data.split(':')[1];
        onGetSlideThumbnails(JSON.parse(slideThumbnails));
      }
    }
  };

  useEffect(() => {
    // Listen for BTC events
    window.addEventListener('message', receiveMessage, false);

    handleFrameLoaded();
    return () => {
    // Remove BTC event listener
      window.removeEventListener('message', receiveMessage);
    };
  }, []);

  return (
    <iframe
      style={{ display: 'none' }}
      ref={btcFrameRef}
      src={baseUrl + 'index.html?fileid=' + id}
      width="100%"
      height="100%"
      sandbox={category === 'btc' ? null : 'allow-same-origin allow-scripts allow-popups allow-forms'}
      onError={onError}
      onLoad={handleFrameLoaded}
    />
  );
};

PowerpointThumbnailGenerator.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

  /** base url of the html string */
  baseUrl: PropTypes.string,

  /** Provides slide thumbnails */
  onGetSlideThumbnails: PropTypes.func,

  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default PowerpointThumbnailGenerator;
