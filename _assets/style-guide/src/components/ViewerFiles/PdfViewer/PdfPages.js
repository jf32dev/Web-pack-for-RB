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

/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM, { findDOMNode } from 'react-dom';
import autobind from 'class-autobind';

const THUMBNAIL_WIDTH = 106; // px

const RenderingStates = {
  INITIAL: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3
};

class PageItem extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    active: PropTypes.any
  };

  render() {
    const { number } = this.props;
    const styles = require('./PdfPages.less');

    return (
      <div id={'thumbnailContainer' + number} className={styles.pdfThumbnail}>
        <div className={styles.thumbnailSelectionRing} />
        <p>{number}</p>
      </div>
    );
  }
}

/**
 * @typedef {Object} PDFThumbnailViewOptions
 * @property {HTMLDivElement} container - The viewer element.
 * @property {number} id - The thumbnail's unique ID (normally its number).
 * @property {PageViewport} defaultViewport - The page viewport.
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {PDFRenderingQueue} renderingQueue - The rendering queue object.
 */

/**
 * @class
 * @implements {IRenderableView}
 */
const PDFThumbnailView = ((function PDFThumbnailViewClosure() {
  /**
   * @constructs PDFThumbnailView
   * @param {PDFThumbnailViewOptions} options
   */
  function PDFThumbnailViewFunc(options) {
    const container = options.container;
    const id = options.id;
    const defaultViewport = options.defaultViewport;
    const linkService = options.linkService;
    const renderingQueue = options.renderingQueue;

    this.id = id;
    this.renderingId = 'thumbnail' + id;

    this.pdfPage = null;
    this.rotation = 0;
    this.viewport = defaultViewport;
    this.pdfPageRotate = defaultViewport.rotation;

    this.linkService = linkService;
    this.renderingQueue = renderingQueue;

    this.hasImage = false;
    this.resume = null;
    this.renderingState = RenderingStates.INITIAL;

    this.pageWidth = this.viewport.width;
    this.pageHeight = this.viewport.height;
    this.pageRatio = this.pageWidth / this.pageHeight;

    this.canvasWidth = THUMBNAIL_WIDTH;
    this.canvasHeight = (this.canvasWidth / this.pageRatio) | 0;
    this.scale = this.canvasWidth / this.pageWidth;

    const anchor = document.createElement('a');
    anchor.href = linkService.getAnchorUrl('#page=' + id);
    anchor.onclick = function stopNavigation() {
      linkService.page = id;
      return false;
    };

    /*const div = document.createElement('div');
    div.id = 'thumbnailContainer' + id;
    div.className = 'pdfThumbnail';
    this.div = div;

    if (id === 1) {
      // Highlight the thumbnail of the first page when no page number is
      // specified (or exists in cache) when the document is loaded.
      div.classList.add('pdfThumbnailSelected');
    }

    const ring = document.createElement('div');
    ring.className = 'thumbnailSelectionRing';
    //const borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
    //ring.style.width = this.canvasWidth + borderAdjustment + 'px';
    //ring.style.height = this.canvasHeight + borderAdjustment + 'px';
    this.ring = ring;

    div.appendChild(ring);

    //caption
    const cap = document.createElement('p');
    cap.innerHTML = id;
    cap.className = 'thumbnailCaption';
    div.appendChild(cap);

    anchor.appendChild(div);*/

    container.appendChild(anchor);
    const view = this;
    const myPageItem = ReactDOM.render(<PageItem number={id} active={(id === 1)} />, anchor);
    const myDiv = findDOMNode(myPageItem);
    view.div = myDiv;
    view.ring = myDiv.firstElementChild;
  }

  function getTempCanvas(width, height) {
    let tempCanvas = PDFThumbnailView.tempImageCache;
    if (!tempCanvas) {
      tempCanvas = document.createElement('canvas');
      PDFThumbnailView.tempImageCache = tempCanvas;
    }
    tempCanvas.width = width;
    tempCanvas.height = height;

    // Since this is a temporary canvas, we need to fill the canvas with a white
    // background ourselves. |_getPageDrawContext| uses CSS rules for this.
    const ctx = tempCanvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    return tempCanvas;
  }

  PDFThumbnailViewFunc.prototype = {
    setPdfPage: function PDFThumbnailView_setPdfPage(pdfPage) {
      this.pdfPage = pdfPage;
      this.pdfPageRotate = pdfPage.rotate;
      const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
      this.viewport = pdfPage.getViewport(1, totalRotation);
      this.reset();
    },

    reset: function PDFThumbnailView_reset() {
      if (this.renderTask) {
        this.renderTask.cancel();
      }
      this.hasImage = false;
      this.resume = null;
      this.renderingState = RenderingStates.INITIAL;

      this.pageWidth = this.viewport.width;
      this.pageHeight = this.viewport.height;
      this.pageRatio = this.pageWidth / this.pageHeight;

      this.canvasHeight = (this.canvasWidth / this.pageRatio) | 0;
      this.scale = (this.canvasWidth / this.pageWidth);

      this.div.removeAttribute('data-loaded');
      const ring = this.ring;
      const childNodes = ring.childNodes;
      for (let i = childNodes.length - 1; i >= 0; i--) {
        ring.removeChild(childNodes[i]);
      }
      //const borderAdjustment = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
      //ring.style.width = this.canvasWidth + borderAdjustment + 'px';
      //ring.style.height = this.canvasHeight + borderAdjustment + 'px';

      if (this.canvas) {
        // Zeroing the width and height causes Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        this.canvas.width = 0;
        this.canvas.height = 0;
        delete this.canvas;
      }
      if (this.image) {
        this.image.removeAttribute('src');
        delete this.image;
      }
    },

    update: function PDFThumbnailView_update(rotation) {
      if (typeof rotation !== 'undefined') {
        this.rotation = rotation;
      }
      const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
      this.viewport = this.viewport.clone({
        scale: 1,
        rotation: totalRotation
      });
      this.reset();
    },

    /**
     * Returns scale factor for the canvas. It makes sense for the HiDPI displays.
     * @return {Object} The object with horizontal (sx) and vertical (sy)
                        scales. The scaled property is set to false if scaling is
                        not required, true otherwise.
     */
    getOutputScale: function(ctx) {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                              ctx.mozBackingStorePixelRatio ||
                              ctx.msBackingStorePixelRatio ||
                              ctx.oBackingStorePixelRatio ||
                              ctx.backingStorePixelRatio || 1;
      const pixelRatio = devicePixelRatio / backingStoreRatio;
      return {
        sx: pixelRatio,
        sy: pixelRatio,
        scaled: pixelRatio !== 1
      };
    },

    /**
     * @private
     */
    _getPageDrawContext: function PDFThumbnailView_getPageDrawContext(noCtxScale) {
      const canvas = document.createElement('canvas');
      this.canvas = canvas;
      const ctx = canvas.getContext('2d');
      const outputScale = this.getOutputScale(ctx);
      canvas.width = (this.canvasWidth * outputScale.sx) | 0;
      canvas.height = (this.canvasHeight * outputScale.sy) | 0;
      canvas.style.width = this.canvasWidth + 'px';
      canvas.style.height = this.canvasHeight + 'px';

      if (!noCtxScale && outputScale.scaled) {
        ctx.scale(outputScale.sx, outputScale.sy);
      }

      const image = document.createElement('img');
      this.image = image;

      image.id = this.renderingId;
      image.className = 'thumbnailImage';
      //image.setAttribute('aria-label', mozL10n.get('thumb_page_canvas', { page: this.id }, 'Thumbnail of Page {{page}}'));

      image.style.width = canvas.style.width;
      image.style.height = canvas.style.height;

      return ctx;
    },

    /**
     * @private
     */
    _convertCanvasToImage: function PDFThumbnailView_convertCanvasToImage() {
      if (!this.canvas) {
        return;
      }
      this.image.src = this.canvas.toDataURL();

      this.div.setAttribute('data-loaded', true);
      this.ring.appendChild(this.image);

      // Zeroing the width and height causes Firefox to release graphics
      // resources immediately, which can greatly reduce memory consumption.
      this.canvas.width = 0;
      this.canvas.height = 0;
      delete this.canvas;
    },

    draw: function PDFThumbnailView_draw() {
      if (this.renderingState !== RenderingStates.INITIAL) {
        console.error('Must be in new state before drawing');
      }
      if (this.hasImage) {
        return Promise.resolve(undefined);
      }
      this.hasImage = true;
      this.renderingState = RenderingStates.RUNNING;

      let resolveRenderPromise;
      let rejectRenderPromise;
      const promise = new Promise(function (resolve, reject) {
        resolveRenderPromise = resolve;
        rejectRenderPromise = reject;
      });

      const self = this;
      const ctx = this._getPageDrawContext();
      const drawViewport = this.viewport.clone({ scale: this.scale });
      const renderContinueCallback = function renderContinueCallback(cont) {
        if (!self.renderingQueue.isHighestPriority(self)) {
          self.renderingState = RenderingStates.PAUSED;
          self.resume = function resumeCallback() {
            self.renderingState = RenderingStates.RUNNING;
            cont();
          };
          return;
        }
        cont();
      };

      const renderContext = {
        canvasContext: ctx,
        viewport: drawViewport
      };
      const renderTask = this.renderTask = this.pdfPage.render(renderContext);
      renderTask.onContinue = renderContinueCallback;

      function thumbnailDrawCallback(error) {
        // The renderTask may have been replaced by a new one, so only remove
        // the reference to the renderTask if it matches the one that is
        // triggering this callback.
        if (renderTask === self.renderTask) {
          self.renderTask = null;
        }
        if (error === 'cancelled') {
          rejectRenderPromise(error);
          return;
        }
        self.renderingState = RenderingStates.FINISHED;
        self._convertCanvasToImage();

        if (!error) {
          resolveRenderPromise(undefined);
        } else {
          rejectRenderPromise(error);
        }
      }

      renderTask.promise.then(
        function pdfPageRenderCallback() {
          thumbnailDrawCallback(null);
        },
        function pdfPageRenderError(error) {
          thumbnailDrawCallback(error);
        }
      );


      return promise;
    },

    setImage: function PDFThumbnailView_setImage(pageView) {
      const img = pageView.canvas;
      if (this.hasImage || !img) {
        return;
      }
      if (!this.pdfPage) {
        this.setPdfPage(pageView.pdfPage);
      }
      this.hasImage = true;
      this.renderingState = RenderingStates.FINISHED;

      const ctx = this._getPageDrawContext(true);
      const canvas = ctx.canvas;

      if (img.width <= 2 * canvas.width) {
        ctx.drawImage(img, 0, 0, img.width, img.height,
                      0, 0, canvas.width, canvas.height);
        this._convertCanvasToImage();
        return;
      }
      // drawImage does an awful job of rescaling the image, doing it gradually.
      const MAX_NUM_SCALING_STEPS = 3;
      let reducedWidth = canvas.width << MAX_NUM_SCALING_STEPS;
      let reducedHeight = canvas.height << MAX_NUM_SCALING_STEPS;
      const reducedImage = getTempCanvas(reducedWidth, reducedHeight);
      const reducedImageCtx = reducedImage.getContext('2d');

      while (reducedWidth > img.width || reducedHeight > img.height) {
        reducedWidth >>= 1;
        reducedHeight >>= 1;
      }
      reducedImageCtx.drawImage(img, 0, 0, img.width, img.height,
                                0, 0, reducedWidth, reducedHeight);
      while (reducedWidth > 2 * canvas.width) {
        reducedImageCtx.drawImage(reducedImage,
                                  0, 0, reducedWidth, reducedHeight,
                                  0, 0, reducedWidth >> 1, reducedHeight >> 1);
        reducedWidth >>= 1;
        reducedHeight >>= 1;
      }
      ctx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight,
                    0, 0, canvas.width, canvas.height);
      this._convertCanvasToImage();
    }
  };

  return PDFThumbnailViewFunc;
})());

PDFThumbnailView.tempImageCache = null;

/**
 * @typedef {Object} PDFThumbnailViewerOptions
 * @property {HTMLDivElement} container - The container for the thumbnail
 *   elements.
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {PDFRenderingQueue} renderingQueue - The rendering queue object.
 */

/**
 * Simple viewer control to display thumbnails for pages.
 * @class
 * @implements {IRenderableView}
 */
const PDFThumbnailViewer = ((function PDFThumbnailViewerClosure() {
  function watchScroll(viewAreaElement, callback) {
    let rAF = null;

    const state = {
      down: true,
      lastY: viewAreaElement.scrollTop/*,
      _eventHandler: debounceScroll*/
    };

    const debounceScroll = function debounceScroll() {
      if (rAF) {
        return;
      }
      // schedule an invocation of scroll for next animation frame.
      rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
        rAF = null;

        const currentY = viewAreaElement.scrollTop;
        const lastY = state.lastY;
        if (currentY !== lastY) {
          state.down = currentY > lastY;
        }
        state.lastY = currentY;
        callback(state);
      });
    };

    viewAreaElement.addEventListener('scroll', debounceScroll, true);
    return state;
  }

  /**
   * @constructs PDFThumbnailViewer
   * @param {PDFThumbnailViewerOptions} options
   */
  function PDFThumbnailViewerFunc(options) {
    this.container = options.container;
    this.renderingQueue = options.renderingQueue;
    this.linkService = options.linkService;

    this.scroll = watchScroll(this.container, this._scrollUpdated.bind(this));
    this._resetView();
  }

  PDFThumbnailViewerFunc.prototype = {
    /**
     * @private
     */
    _scrollUpdated: function PDFThumbnailViewer_scrollUpdated() {
      this.renderingQueue.renderHighestPriority();
    },

    getThumbnail: function PDFThumbnailViewer_getThumbnail(index) {
      return this.thumbnails[index];
    },

    /**
     * Use binary search to find the index of the first item in a given array which
     * passes a given condition. The items are expected to be sorted in the sense
     * that if the condition is true for one item in the array, then it is also true
     * for all following items.
     *
     * @returns {Number} Index of the first array element to pass the test,
     *                   or |items.length| if no such element exists.
     */
    binarySearchFirstItem: function(items, condition) {
      let minIndex = 0;
      let maxIndex = items.length - 1;

      if (items.length === 0 || !condition(items[maxIndex])) {
        return items.length;
      }
      if (condition(items[minIndex])) {
        return minIndex;
      }

      while (minIndex < maxIndex) {
        const currentIndex = (minIndex + maxIndex) >> 1;
        const currentItem = items[currentIndex];
        if (condition(currentItem)) {
          maxIndex = currentIndex;
        } else {
          minIndex = currentIndex + 1;
        }
      }
      return minIndex; /* === maxIndex */
    },

    /**
     * Generic helper to find out what elements are visible within a scroll pane.
     */
    getVisibleElements: function(scrollEl, views, sortByVisibility) {
      const top = scrollEl.scrollTop;
      const bottom = top + scrollEl.clientHeight;
      const left = scrollEl.scrollLeft;
      const right = left + scrollEl.clientWidth;

      function isElementBottomBelowViewTop(view) {
        const element = view.div;
        const elementBottom =
          element.offsetTop + element.clientTop + element.clientHeight;
        return elementBottom > top;
      }

      const visible = [];

      const firstVisibleElementInd = (views.length === 0) ? 0 :
        this.binarySearchFirstItem(views, isElementBottomBelowViewTop);

      for (let i = firstVisibleElementInd, ii = views.length; i < ii; i++) {
        const view = views[i];
        const element = view.div;
        const currentHeight = element.offsetTop + element.clientTop;
        const viewHeight = element.clientHeight;

        if (currentHeight > bottom) {
          break;
        }

        const currentWidth = element.offsetLeft + element.clientLeft;
        const viewWidth = element.clientWidth;
        if (currentWidth + viewWidth < left || currentWidth > right) {
          continue;
        }
        const hiddenHeight = Math.max(0, top - currentHeight) +
          Math.max(0, currentHeight + viewHeight - bottom);
        const percentHeight = ((viewHeight - hiddenHeight) * 100 / viewHeight) | 0;

        visible.push({
          id: view.id,
          x: currentWidth,
          y: currentHeight,
          view: view,
          percent: percentHeight
        });
      }

      const first = visible[0];
      const last = visible[visible.length - 1];

      if (sortByVisibility) {
        visible.sort(function(a, b) {
          const pc = a.percent - b.percent;
          if (Math.abs(pc) > 0.001) {
            return -pc;
          }
          return a.id - b.id; // ensure stability
        });
      }
      return { first: first, last: last, views: visible };
    },

    /**
     * @private
     */
    _getVisibleThumbs: function PDFThumbnailViewer_getVisibleThumbs() {
      return this.getVisibleElements(this.container, this.thumbnails);
    },

    scrollThumbnailIntoView: function PDFThumbnailViewer_scrollThumbnailIntoView(page) {
      const selected = document.querySelector('.pdfThumbnailSelected');
      if (selected) {
        selected.classList.remove('pdfThumbnailSelected');
      }
      const thumbnail = document.getElementById('thumbnailContainer' + page);
      if (thumbnail) {
        thumbnail.classList.add('pdfThumbnailSelected');
      }
      const visibleThumbs = this._getVisibleThumbs();
      const numVisibleThumbs = visibleThumbs.views.length;

      // If the thumbnail isn't currently visible, scroll it into view.
      if (numVisibleThumbs > 0) {
        const first = visibleThumbs.first.id;
        // Account for only one thumbnail being visible.
        const last = (numVisibleThumbs > 1 ? visibleThumbs.last.id : first);
        if (page <= first || page >= last) {
          //scrollIntoView(thumbnail, { top: THUMBNAIL_SCROLL_MARGIN });
          thumbnail.scrollIntoView();
        }
      }
    },

    get pagesRotation() {
      return this._pagesRotation;
    },

    set pagesRotation(rotation) {
      this._pagesRotation = rotation;
      for (let i = 0, l = this.thumbnails.length; i < l; i++) {
        const thumb = this.thumbnails[i];
        thumb.update(rotation);
      }
    },

    cleanup: function PDFThumbnailViewer_cleanup() {
      const tempCanvas = PDFThumbnailView.tempImageCache;
      if (tempCanvas) {
        // Zeroing the width and height causes Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        tempCanvas.width = 0;
        tempCanvas.height = 0;
      }
      PDFThumbnailView.tempImageCache = null;
    },

    /**
     * @private
     */
    _resetView: function PDFThumbnailViewer_resetView() {
      this.thumbnails = [];
      this._pagesRotation = 0;
      this._pagesRequests = [];
    },

    setDocument: function PDFThumbnailViewer_setDocument(pdfDocument) {
      if (this.pdfDocument) {
        // cleanup of the elements and views
        const thumbsView = this.container;
        while (thumbsView.hasChildNodes()) {
          thumbsView.removeChild(thumbsView.lastChild);
        }
        this._resetView();
      }

      this.pdfDocument = pdfDocument;
      if (!pdfDocument) {
        return Promise.resolve();
      }

      return pdfDocument.getPage(1).then(function (firstPage) {
        const pagesCount = pdfDocument.numPages;
        const viewport = firstPage.getViewport(1.0);
        for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
          const thumbnail = new PDFThumbnailView({
            container: this.container,
            id: pageNum,
            defaultViewport: viewport.clone(),
            linkService: this.linkService,
            renderingQueue: this.renderingQueue
          });
          this.thumbnails.push(thumbnail);
        }
      }.bind(this));
    },

    /**
     * @param {PDFPageView} pageView
     * @returns {PDFPage}
     * @private
     */
    _ensurePdfPageLoaded: function PDFThumbnailViewer_ensurePdfPageLoaded(thumbView) {
      if (thumbView.pdfPage) {
        return Promise.resolve(thumbView.pdfPage);
      }
      const pageNumber = thumbView.id;
      if (this._pagesRequests[pageNumber]) {
        return this._pagesRequests[pageNumber];
      }
      const promise = this.pdfDocument.getPage(pageNumber).then(
        function (pdfPage) {
          thumbView.setPdfPage(pdfPage);
          this._pagesRequests[pageNumber] = null;
          return pdfPage;
        }.bind(this));
      this._pagesRequests[pageNumber] = promise;
      return promise;
    },

    ensureThumbnailVisible: function PDFThumbnailViewer_ensureThumbnailVisible(page) {
      // Ensure that the thumbnail of the current page is visible
      // when switching from another view.
      //scrollIntoView(document.getElementById('thumbnailContainer' + page));
      document.getElementById('thumbnailContainer' + page).scrollIntoView();
    },

    forceRendering: function () {
      const visibleThumbs = this._getVisibleThumbs();
      const thumbView = this.renderingQueue.getHighestPriority(visibleThumbs,
                                                             this.thumbnails,
                                                             this.scroll.down);
      if (thumbView) {
        this._ensurePdfPageLoaded(thumbView).then(function () {
          this.renderingQueue.renderView(thumbView);
        }.bind(this));
        return true;
      }
      return false;
    }
  };

  return PDFThumbnailViewerFunc;
})());


/**
 * Displays a PDF.js outline
 */
export default class PdfPages extends Component {
  static propTypes = {
    pdf: PropTypes.object.isRequired,
    pdfViewer: PropTypes.object.isRequired,
    currentPage: PropTypes.number,
    onPageClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.thumbnailView = null;
  }

  componentDidMount() {
    this.loadThumbnail();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentPage !== prevProps.currentPage) {
      this.props.pdfViewer.thumbnailViewer.scrollThumbnailIntoView(this.props.currentPage);
    }
  }

  loadThumbnail() {
    const pdfRenderingQueue = this.props.pdfViewer.renderingQueue;
    const pdfLinkService = this.props.pdfViewer.linkService;
    const thumbnailContainer = this.thumbnailView;
    const pdfThumbnailViewer = new PDFThumbnailViewer({
      container: thumbnailContainer,
      renderingQueue: pdfRenderingQueue,
      linkService: pdfLinkService
    });

    this.props.pdfViewer.thumbnailViewer = pdfThumbnailViewer;

    pdfThumbnailViewer.pdfLinkService = pdfLinkService;
    pdfThumbnailViewer.pdfRenderingQueue = pdfRenderingQueue;

    pdfRenderingQueue.onIdle = pdfThumbnailViewer.cleanup.bind(this);
    pdfRenderingQueue.setThumbnailViewer(pdfThumbnailViewer);
    pdfRenderingQueue.isThumbnailViewEnabled = true;

    pdfThumbnailViewer.setDocument(this.props.pdf);

    setTimeout(() => {
      pdfThumbnailViewer.renderingQueue.renderHighestPriority();
      pdfThumbnailViewer.scrollThumbnailIntoView(this.props.currentPage);
    }, 100);
  }

  render() {
    const styles = require('./PdfPages.less');

    return (
      <div ref={(c) => { this.thumbnailView = c; }} className={styles.PdfPages} />
    );
  }
}
