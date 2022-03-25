import PropTypes from 'prop-types';
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

/* eslint-disable import/no-dynamic-require */

import React, { Component } from 'react';
import autobind from 'class-autobind';

/**
 * Wrapper for PDF.js
 * See <a href="https://github.com/mozilla/pdf.js">PDF.JS</a> for more information.
 * <a href="http://www.pdfscripting.com/public/Free-Sample-PDF-Files-with-scripts.cfm">Useful test files</a>
 */
export default class PdfDocument extends Component {
  static propTypes = {
    /** n-based value of the page to render */
    currentPage: PropTypes.number,

    password: PropTypes.string,

    /** angle to rotate */
    rotate: PropTypes.number,

    /** scale in/out */
    scale: PropTypes.any,

    authString: PropTypes.string,

    onDocumentComplete: PropTypes.func,
    onDocumentError: PropTypes.func,
    onPageComplete: PropTypes.func,
    onOutlineComplete: PropTypes.func,
    onPageAnchorClick: PropTypes.func,
    onPageClick: PropTypes.func,
    onCurrentPageChange: PropTypes.func
  };

  static defaultProps = {
    currentPage: 1,
    rotate: 0,
    scale: 1,
    authString: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      pdf: '',
      password: ''
    };
    autobind(this);

    // refs
    this.frame = null;
  }

  componentDidMount() {
    require(['pdfjs-dist/web/pdf_viewer'], this.getDocument);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Load new document if url changes
    // should destroy old documnet here
    if (nextProps.url && nextProps.url !== this.props.url || nextProps.password !== this.props.password) {
      if (nextProps.password !== this.props.password) {
        this.setState({ password: nextProps.password }, this.getDocument);
      } else {
        this.getDocument();
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.currentPage !== this.props.currentPage
        || nextProps.scale !== this.props.scale
        || nextProps.rotate !== this.props.rotate) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (this.pdfViewer) {
      if (this.pdfViewer.currentScaleValue !== this.props.scale) {
        this.pdfViewer.currentScaleValue = this.props.scale;
      }

      if (this.pdfViewer.pagesRotation !== this.props.rotate) {
        this.pdfViewer.pagesRotation = this.props.rotate;
      }

      if (this.pdfViewer.currentPageNumber !== this.props.currentPage) {
        this.pdfViewer.currentPageNumber = this.props.currentPage;
      }
    }
  }

  componentWillUnmount() {
    if (this.state.pdf) {
      this.state.pdf.cleanup();
      this.state.pdf.destroy();
    }
  }

  getDocument() {
    this.loadPDFDocument(this.props.url + this.props.authString);
  }

  setupEvents() {
    // Set default scale/rotation on pageinit
    this.frame.addEventListener('pagesinit', () => {
      this.pdfViewer.currentScaleValue = 'page-width';  // default scale hard-coded
      this.pdfViewer.pagesRotation = 0;
    });

    // Set up event propagations
    this.frame.addEventListener('pagechange', (e) => {
      if (this.props.currentPage !== e.pageNumber) {
        this.props.onCurrentPageChange(e, e.pageNumber);
      }
    });

    this.frame.addEventListener('pagerendered', (e) => {
      // try to scroll the highlighted search into view
      if (this.props.onPageRendered) {
        const pageNumber = e.detail.pageNumber;
        const pageIndex = pageNumber - 1;
        this.props.onPageRendered(pageIndex);
      }
      const pagesCollection = document.getElementsByClassName('page');
      const pages = [].slice.call(pagesCollection);
      pages.forEach((page) => {
        const hyperlinksCollection = page.getElementsByTagName('a');
        const hyperlinks = ([].slice.call(hyperlinksCollection)).filter((item) => {
          const { classList, href } = item;
          return (!(classList.contains('internalLink')) || (href || '').indexOf('#') === 0);
        });
        hyperlinks.forEach((hyperlink) => {
          const tmpHyperlink = hyperlink;
          tmpHyperlink.onclick = (anchorEventArg) => {
            if (this.props.onPageAnchorClick) {
              anchorEventArg.preventDefault();
              this.props.onPageAnchorClick(anchorEventArg.currentTarget);
            }
          };
        });
      });
    });

    this.frame.addEventListener('scalechange', (e) => {
      if (this.props.scale !== e.scale) {
        this.props.onScaleChange(e, e.scale);
      }
      this.pdfViewer.update();
    }, true);
  }

  loadPDFDocument(url) {
    const { pdf, password } = this.state;
    if (pdf) {
      pdf.cleanup();
    }

    require('!style-loader!css-loader!./libs/pdf_viewer.css');
    window.PDFJS.workerSrc = require('file-loader!pdfjs-dist/build/pdf.worker.js');
    window.PDFJS.imageResourcesPath = '/node_modules/pdfjs-dist/web/images/';
    window.PDFJS.cMapUrl = '/node_modules/pdfjs-dist/cmaps/';
    window.PDFJS.cMapPacked = true;

    // Return promise
    return window.PDFJS.getDocument({ url: url, password: password })
      .then(this.handleDocumentComplete)
      .catch(this.props.onDocumentError);
  }

  handleDocumentComplete(pdf) {
    //pdf.getAttachments().then(result => console.log('getAttachments: ' + result));
    //pdf.getDestinations().then(result => console.log('getDestinations: ' + JSON.stringify(result)));
    //pdf.getJavaScript().then(result => console.log('getJavaScript: ' + JSON.stringify(result)));
    //pdf.getMetadata().then(result => console.log('getMetadata: ' + JSON.stringify(result)));
    //pdf.getStats().then(result => console.log('getStats: ' + JSON.stringify(result)));

    // Request PDF outline
    pdf.getOutline().then(this.handleOutlineComplete);

    // Link Service
    const pdfLinkService = new window.PDFJS.PDFLinkService();
    pdfLinkService.setDocument(pdf);

    // Create PDFViewer in iframe
    this.pdfViewer = new window.PDFJS.PDFViewer({
      container: this.frame,
      linkService: pdfLinkService
    });

    // Set document and attach link service
    this.pdfViewer.setDocument(pdf);
    pdfLinkService.setViewer(this.pdfViewer);

    // Find Controller
    const pdfFindController = new window.PDFJS.PDFFindController({
      pdfViewer: this.pdfViewer
    });
    this.pdfViewer.setFindController(pdfFindController);

    // Set up our event listeners
    this.setupEvents();
    this.setState({ pdf: pdf });

    // Show iframe
    this.frame.style.display = '';

    // Propagate event
    const { onDocumentComplete } = this.props;
    if (typeof onDocumentComplete === 'function') {
      onDocumentComplete(pdf, this.pdfViewer);
    }
  }

  handleOutlineComplete(outline) {
    // Propagate event
    const { onOutlineComplete } = this.props;
    if (typeof onOutlineComplete === 'function') {
      onOutlineComplete(outline);
    }
  }

  render() {
    const styles = require('./PdfDocument.less');

    return (
      <div
        ref={(c) => { this.frame = c; }}
        tabIndex="-1"
        className={styles.PdfDocument}
        style={{ display: 'none' }}
      >
        <div className="pdfViewer" />
      </div>
    );
  }
}
