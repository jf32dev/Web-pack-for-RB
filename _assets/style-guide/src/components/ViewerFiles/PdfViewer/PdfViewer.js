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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

/**
* Wrapper for PDF.js
* PDF.js Find service is wrapped into PdfFind.
* See <a href="https://github.com/mozilla/pdf.js">PDF.JS</a> for more information.
* <a href="http://www.pdfscripting.com/public/Free-Sample-PDF-Files-with-scripts.cfm">Useful test files</a>
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import FullScreen from 'components/Fullscreen/Fullscreen';
import Icon from 'components/Icon/Icon';
import Loader from 'components/Loader/Loader';

import PdfDocument from './PdfDocument';
import PdfFind from './PdfFind';
import PdfOutline from './PdfOutline';
import PdfPages from './PdfPages';
import ViewerToolbar from 'components/Viewer/ViewerToolbar';

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  tableOfContents: { id: 'table-of-contents', defaultMessage: 'Table of Contents' },
  unlockFile: { id: 'unlock-file', defaultMessage: 'Unlock File' },
  passwordProtected: { id: 'password-protected', defaultMessage: 'Password Protected File' },
  passwordMessage: { id: 'password-message', defaultMessage: 'Enter password to open this file' },
});

const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.25;
const MAX_SCALE = 4.0;
const DEFAULT_SCALE = 1.0;

/**
 *  Wrapper for PDF.js
 * * PDF.js Content is rendered in PdfDocument component.
 * * PDF.js Find service is wrapped into PdfFind.
 * * PDF.js Page navigation is wrapped into PdfPages.
 */
export default class PdfViewer extends Component {
  static propTypes = {
    /** URL to PDF file */
    url: PropTypes.string.isRequired,

    /** Set current page, can be used to start PDF at a set page on load */
    currentPage: PropTypes.number,

    /** Initial 'find' query, loads page with highlighted text */
    initialQuery: PropTypes.string,

    /** Auth string required for secure storage */
    authString: PropTypes.string,

    /** States opened/closed of side panel*/
    togglePartConst: PropTypes.any,

    /** Callback once pdf document loaded */
    onDocumentComplete: PropTypes.func,

    /** Callback if pdf document failed to load */
    onDocumentError: PropTypes.func,

    /** Callback if pdf document outline opened or closed */
    onOutlineComplete: PropTypes.func,

    /** Callback if an anchor is clicked in pdf document */
    onAnchorClick: PropTypes.func,

    /** Callback if a page is clicked clicked in pdf document */
    onPageClick: PropTypes.func,

    /** Callback when a pdf document page is rendered, returns pageIndex */
    onPageRendered: PropTypes.func,

    /** Callback on page changed by scroll or click*/
    onCurrentPageChange: PropTypes.func,

    /** Callback when all side panels  (Find/Outline/Pages..) are closed */
    onSidePanelClose: PropTypes.func,

    /** Callback when anchor is clicked in the pdf */
    onPageAnchorClick: PropTypes.func
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    togglePartConst: {
      None: '',
      PdfFind: 'PdfFind',
      PdfOutline: 'PdfOutline', //not used, if outline s not togged but open modal
      PdfPages: 'PdfPages'
    },
    authString: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.currentPage || 1,
      totalPages: 0,
      scale: DEFAULT_SCALE,
      rotate: 0,
      outline: [],
      loading: true,
      pdfViewer: null,
      togglePart: props.togglePartConst.None,
      fullScreenToggle: false,
      toolBarVisible: false,
      password: '',
      needPassword: false,
      query: props.initialQuery,
      findContents: [],
      findResults: [],
    };
    autobind(this);

    // refs
    this.PdfComponent = null;
    this.PdfViewer = null;
    this.txtPassword = null;
    this.viewerToolbar = null;
  }

  componentDidMount() {
    // When the component is mounted, grab a reference and add a DOM listener;
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage && nextProps.currentPage !== this.state.currentPage) {
      this.handleCurrentPageChange(null, nextProps.currentPage);
    }
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  findText(query) {
    // Don't search until query is over 2 characters
    // prevents freezing of the UI
    const findController = this.state.pdfViewer.findController;
    let cur_query = query.toLowerCase().trim();
    if (query.length < 2) {
      cur_query = '';
    }

    findController.executeCommand('find', {
      query: cur_query,
      phraseSearch: true,
      caseSensitive: false,
      highlightAll: true
    });

    findController.onUpdateState = (state) => {
      if (state === 3) {
        this.setState({
          findResults: [],
          findContents: []
        });
      } else if ((!findController.pageMatches[0] || findController.pageMatches[0].length === 0) && query && query.length > 3) {
        this.setState({
          findResults: [0]
        });
      }
    };

    findController.onUpdateResultsCount = () => {
      const results = findController.pageMatches;
      const contents = findController.pageContents;
      this.setState({
        findResults: results,
        findContents: contents
      });
    };
  }

  handleKeyDown() {
    if (document.activeElement.value === undefined) {
      //not currently in a text input
      this.PdfViewer.frame.focus();
    }
  }

  handleMouseOver() {
    if (!this.state.toolBarVisible) {
      this.setState({ toolBarVisible: true });
    }

    if (this.props.onHandleMouseOver) {
      this.props.onHandleMouseOver(this.PdfViewer);
    }
  }

  handleMouseOut() {
    if (this.state.toolBarVisible) {
      this.setState({ toolBarVisible: false });
    }

    if (this.props.onHandleMouseOut) {
      this.props.onHandleMouseOut(this.PdfViewer);
    }
  }

  handleAnchorClick(event) {
    event.preventDefault();

    // Propagate to parent
    if (typeof this.props.onAnchorClick === 'function') {
      this.props.onAnchorClick(event);
    }
  }

  handleDocumentComplete(pdf, pdfViewer) {
    this.setState({
      pdf: pdf,
      pdfViewer: pdfViewer,
      totalPages: pdf.numPages,
      loading: false
    });

    // Execute find if initialQuery is set
    if (this.props.initialQuery) {
      this.findText(this.props.initialQuery);
    }

    // Propagate to parent
    if (typeof this.props.onDocumentComplete === 'function') {
      this.props.onDocumentComplete(this.props.id, pdf, pdfViewer);
    }
  }

  handleDocumentError(event) {
    if (event.name === 'PasswordException') {
      this.setState({ needPassword: true });
    } else if (typeof this.props.onDocumentError === 'function') {
      this.props.onDocumentError(this.props.id, event);
    }
  }

  handlePassChange() {
    const password = this.txtPassword.value;
    if (!password) return;
    this.setState({ needPassword: false, password: password });
  }

  handleKeyEnter(event) {
    if (event.key === 'Enter') {
      this.handlePassChange();
    }
  }

  handlePageComplete(data) {
    this.handleCurrentPageChange(null, data.currentPage);

    if (typeof this.props.onHandlePdfResize === 'function') {
      this.props.onHandlePdfResize(this.PdfViewer);
    }
  }

  handleOutlineComplete(outline) {
    if (outline && outline.length) {
      this.setState({
        outline: outline
      });

      // Propagate event
      if (typeof this.props.onOutlineComplete === 'function') {
        this.props.onOutlineComplete(this.props.id, true);
      }
    }
  }

  handleOutlineItemClick(event, dest) {
    /*if (dest && dest[0]) {
      const goToDestination = (data) => {
        this.state.pdf.getPageIndex(data[0]).then(pageIndex => {
          this.handleCurrentPageChange(null, parseInt(pageIndex + 1, 10));
        });
      };

      if (typeof dest === 'string') {
        this.state.pdf.getDestination(dest).then(goToDestination);
      } else {
        goToDestination(dest);
      }
    }*/
    this.state.pdfViewer.linkService.navigateTo(dest);
  }

  handleOutlineCloseClick() {
    this.setState({ togglePart: this.props.togglePartConst.None });
  }

  handleExitFullScreen() {
    this.setState({ fullScreenToggle: false, scale: this.originalScale });
    this.originalScale = undefined;
  }

  handleToolbarItemClick(event, action) {
    switch (action) {
      case 'fullscreen':

        if (!this.state.fullScreenToggle) {
          //keep original scale before going fullscreen
          this.originalScale = this.state.scale;
        }

        this.setState({
          togglePart: this.props.togglePartConst.None,
          scale: 1.5,
          fullScreenToggle: !this.state.fullScreenToggle
        });

        // inform parent state changed
        if (this.props.onSidePanelClose) this.props.onSidePanelClose();

        break;
      case 'prevPage': {
        let newPage = this.state.currentPage - 1;
        if (newPage < 1) {
          newPage = this.state.totalPages;
        }
        this.handleCurrentPageChange(null, newPage);
        //this.setState({ currentPage: newPage });
        break;
      }
      case 'nextPage': {
        let newPage = this.state.currentPage + 1;
        if (newPage > this.state.totalPages) {
          newPage = 1;
        }
        this.handleCurrentPageChange(null, newPage);
        //this.setState({ currentPage: newPage });
        break;
      }
      case 'zoomIn': {
        let newScale = this.state.scale;
        newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
        newScale = Math.ceil(newScale * 10) / 10;
        newScale = Math.min(MAX_SCALE, newScale);
        this.setState({ scale: newScale });
        this.viewerToolbar.handleZoomMenuClose();
        break;
      }
      case 'zoomOut': {
        let newScale = this.state.scale;
        newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
        newScale = Math.floor(newScale * 10) / 10;
        newScale = Math.max(MIN_SCALE, newScale);
        this.setState({ scale: newScale });
        this.viewerToolbar.handleZoomMenuClose();
        break;
      }
      case 'zoomPageFit': {
        this.state.pdfViewer.currentScaleValue = 'page-fit';
        this.viewerToolbar.handleZoomMenuClose();
        break;
      }
      case 'zoomPageWidth': {
        this.state.pdfViewer.currentScaleValue = 'page-width';
        this.viewerToolbar.handleZoomMenuClose();
        break;
      }
      case 'zoom25': {
        this.state.pdfViewer.currentScaleValue = 0.25;
        this.viewerToolbar.handleZoomMenuClose();
        break;
      }
      case 'zoom50': {
        this.state.pdfViewer.currentScaleValue = 0.5;
        this.viewerToolbar.handleZoomMenuClose();
        break;
      }
      case 'zoom75': {
        this.state.pdfViewer.currentScaleValue = 0.75;
        this.viewerToolbar.handleZoomMenuClose();
        break;
      }
      case 'zoom100': {
        this.state.pdfViewer.currentScaleValue = 1;
        this.viewerToolbar.handleZoomMenuClose();
        break;
      }
      case 'rotate': {
        // rotate may change current page, keep a fixed page number to reinstate
        const fixedPage = this.state.currentPage;
        const newrotate = (this.state.rotate + 90) % 360;
        this.setState({ rotate: newrotate }, () => {
          // reinstate page number
          this.setState({ currentPage: fixedPage });
        });
        break;
      }
      default:
        break;
    }
  }

  handleDefaultPageWidthZoom() {
    window.setTimeout(() => {
      this.state.pdfViewer.currentScaleValue = 'page-width';
    }, 1);
  }

  handleToggleFind() {
    if (this.state.togglePart === this.props.togglePartConst.PdfFind) {
      this.setState({ togglePart: this.props.togglePartConst.None });
    } else {
      this.setState({ togglePart: this.props.togglePartConst.PdfFind });
    }

    if (typeof this.props.onHandlePdfResize === 'function') {
      this.props.onHandlePdfResize(this.PdfViewer);
    }
    this.handleDefaultPageWidthZoom();
  }

  handleToggleOutline() {
    //this.setState({ showToc: true });
    if (this.state.togglePart === this.props.togglePartConst.PdfOutline) {
      this.setState({ togglePart: this.props.togglePartConst.None });
    } else {
      this.setState({ togglePart: this.props.togglePartConst.PdfOutline });
    }

    if (typeof this.props.onHandlePdfResize === 'function') {
      this.props.onHandlePdfResize(this.PdfViewer);
    }
    this.handleDefaultPageWidthZoom();
  }

  handleTogglePages() {
    if (this.state.togglePart === this.props.togglePartConst.PdfPages) {
      this.setState({ togglePart: this.props.togglePartConst.None });
    } else {
      this.setState({ togglePart: this.props.togglePartConst.PdfPages });
    }

    if (typeof this.props.onPdfResize === 'function') {
      this.props.onPdfResize(this.PdfViewer);
      this.handleDefaultPageWidthZoom();
    }
  }

  handleCurrentPageChange(event, pageNumber) {
    if (this.state.currentPage === pageNumber) return;
    this.setState({ currentPage: pageNumber });
    // propagate to parent
    if (typeof this.props.onCurrentPageChange === 'function') {
      this.props.onCurrentPageChange(event, pageNumber);
    }

    if (this.state.togglePart === this.props.togglePartConst.PdfFind) {
      setTimeout(() => {
        const page = this.state.pdfViewer._pages[this.state.currentPage - 1];
        if (page.textLayer) {
          const els = page.textLayer.textLayerDiv.getElementsByClassName('highlight');
          const el = els[0];
          if (el) el.scrollIntoView();
        }
      }, 1000);
    }
  }

  handleScaleChange(event, newScale) {
    this.setState({ scale: newScale });
  }

  handlePageClick(event, page) {
    this.setState({ currentPage: page });
    // propagate to parent
    if (typeof this.props.onPageClick === 'function') {
      this.props.onPageClick(event, page);
    }
  }

  handleQueryChange(query) {
    this.setState({ query: query });
    this.findText(query);
  }

  render() {
    const { currentPage, scale, rotate, togglePart, loading, outline, pdf, query, fullScreenToggle, toolBarVisible, password, needPassword } = this.state;
    const { url, authString, togglePartConst } = this.props;
    const { formatMessage } = this.context.intl;

    const styles = require('./PdfViewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PdfViewer: true
    }, this.props.className);

    const loaderWrapperStyle = {
      width: '100%',
      height: '100%'
    };

    const loaderStyle = {
      left: '50%',
      top: '50%'
    };

    // Translations
    const strings = generateStrings(messages, formatMessage);

    let displayStyle = {};
    if (needPassword) {
      displayStyle = { display: 'none' };
    } else {
      displayStyle = { height: '100%' };
    }

    return (
      <div
        ref={(c) => { this.PdfComponent = c; }}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        className={classes}
      >
        {needPassword &&
          <div className={styles.PasswordBlock}>
            <Icon name="lock" size={64} className={styles.LockIcon} /> <br />
            <span className={styles.PasswordProtected}>{strings.passwordProtected}</span> <br />
            <div className={styles.PasswordMessage}>{strings.passwordMessage}</div>
            <input
              ref={(c) => { this.txtPassword = c; }}
              type="password"
              className={styles.input}
              onKeyPress={this.handleKeyEnter}
            /><br />

            <Btn
              type="submit"
              inverted
              large
              onClick={this.handlePassChange}
            >
              {strings.unlockFile}
            </Btn>
          </div>
        }

        <FullScreen
          fullScreenToggle={fullScreenToggle}
          onExitFullScreen={this.handleExitFullScreen}
          style={displayStyle}
        >
          {this.props.children}
          {(togglePart === togglePartConst.PdfFind) && <PdfFind
            pdf={pdf}
            placeholder={strings.search}
            pdfViewer={this.state.pdfViewer}
            query={query}
            contents={this.state.findContents}
            results={this.state.findResults}
            onPageClick={this.handlePageClick}
            onQueryChange={this.handleQueryChange}
          />}
          {(togglePart === togglePartConst.PdfOutline) && <PdfOutline
            pdf={pdf}
            outline={outline}
            heading={strings.tableOfContents}
            onItemClick={this.handleOutlineItemClick}
            onCloseClick={this.handleOutlineCloseClick}
          />}
          {(togglePart === togglePartConst.PdfPages) && <PdfPages
            pdf={pdf}
            pdfViewer={this.state.pdfViewer}
            currentPage={currentPage}
            onPageClick={this.handlePageClick}
          />}
          {loading && <div style={loaderWrapperStyle}>
            <Loader style={loaderStyle} type="content" />
          </div>}
          {!loading && <ViewerToolbar
            ref={(c) => { this.viewerToolbar = c; }}
            currentPage={currentPage}
            totalPages={this.state.totalPages}
            fullscreen={!this.props.hasWatermark}
            zoom={this.state.scale}
            rotate={!this.state.fullscreen}
            onCurrentPageChange={this.handleCurrentPageChange}
            onItemClick={this.handleToolbarItemClick}
            visible={toolBarVisible}
            zoomMenuDisabled={false}
          />}
          <PdfDocument
            ref={(c) => { this.PdfViewer = c; }}
            url={url}
            authString={authString}
            password={password}
            currentPage={currentPage}
            scale={scale}
            rotate={rotate}
            togglePart={togglePart}
            onDocumentComplete={this.handleDocumentComplete}
            onDocumentError={this.handleDocumentError}
            onPageComplete={this.handlePageComplete}
            onOutlineComplete={this.handleOutlineComplete}
            onPageClick={this.handlePageClick}
            onCurrentPageChange={this.handleCurrentPageChange}
            onScaleChange={this.handleScaleChange}
            onPageRendered={this.props.onPageRendered}
            onPageAnchorClick={this.props.onPageAnchorClick}
          />
        </FullScreen>
      </div>
    );
  }
}
