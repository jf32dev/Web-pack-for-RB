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
 * @package hub-web-app-v5
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

const pdfjsLib = require('pdfjs-dist/build/pdf.js');
window.PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.js');

// Some PDFs need external cmaps.
const CMAP_URL = '/node_modules/pdfjs-dist/cmaps/';
const CMAP_PACKED = true;

/**
 * @param  {Object} page
 * @param  {Number} size
 * @return {String}
 */
const makeThumb = (page, size) => {
  // draw page to fit into input size canvas
  const desiredWidth = size;
  const viewPort = page.getViewport(1.0);

  const scale = desiredWidth / viewPort.width;
  const scaledViewport = page.getViewport(scale);

  const canvas = document.createElement('canvas');
  canvas.height = scaledViewport.height;
  canvas.width = scaledViewport.width;

  return page.render({
    canvasContext: canvas.getContext('2d'),
    viewport: scaledViewport
  }).promise.then(function () {
    return canvas.toDataURL();
  });
};

/**
 * @param  {String} source
 * @param  {Number} size
 * @return {Array}
 */
const generatePdfThumbnails = async (source, size, pageIndexToGenerateThumbnail) => {
  const pdfDocument = await pdfjsLib.getDocument({
    url: source,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
  });

  return Promise.all(pageIndexToGenerateThumbnail.map(num =>
    pdfDocument.getPage(num).then(page => makeThumb(page, size))
      .then(thumbnail => ({
        page: num,
        thumbnail
      }))
  ));
};

export default generatePdfThumbnails;
