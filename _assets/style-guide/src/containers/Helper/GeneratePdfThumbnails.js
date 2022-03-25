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

import React, { useEffect, useState } from 'react';
import ComponentItem from '../../views/ComponentItem';

import generatePdfThumbnails from 'helpers/generatePdfThumbnails';
import { Loader } from 'components';

const stories = require('../../static/stories.json');

const ImageComp = ({ src, index }) => (<div style={{ margin: '1rem', display: 'inline-block' }}>
  <img src={src} alt={index} />
  <p>Page Index: {index}</p>
</div>);

const GeneratePdfThumbnailsView = () =>  {
  const [thumbnails, setThumbnails] = useState(null);

  useEffect(() => {
    async function generateThumbnails() {
      try {
        const thumbnailsResult = await generatePdfThumbnails('/src/static/medical.pdf', 150);
        setThumbnails(thumbnailsResult);
      } catch (err) {
        console.error(err);
      }
    }
    generateThumbnails();
  }, []);

  return (
    <section id="HubShareConsoleView">
      <h1>generatePdfThumbnails</h1>
      <p>Helper function to generate thumbnails from given pdf</p>
      <pre>
        <p><b>Parameters:</b></p>
        <code><b>src:</b> source of pdf</code>
        <code><b>size:</b> desired thumbnail size</code>
      </pre>
      <ComponentItem>
        {
          thumbnails && thumbnails.map(({ thumbnail, index }) => <ImageComp key={index} src={thumbnail} index={index} />) || <Loader type="content" />
        }
      </ComponentItem>
    </section>
  );
};

export default GeneratePdfThumbnailsView;
