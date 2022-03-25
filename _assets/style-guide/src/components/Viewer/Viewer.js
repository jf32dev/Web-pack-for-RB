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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import Combokeys from 'combokeys';

import Blankslate from 'components/Blankslate/Blankslate';
import Loader from 'components/Loader/Loader';

import ViewerHeader from './ViewerHeader';
import ViewerTabs from './ViewerTabs';
import ViewerToolbar from './ViewerToolbar';
import Watermark from './Watermark';

import BookmarkAllModal from './BookmarkAllModal';

import SVGIcon from 'components/SVGIcon/SVGIcon';

// File components
import AudioVideo from 'components/ViewerFiles/AudioVideo';
import Csv from 'components/ViewerFiles/Csv';
import Plaintext from 'components/ViewerFiles/Plaintext';

// Updated components
import AppViewer from 'components/ViewerFiles/AppViewer/AppViewer';
import EpubViewer from 'components/ViewerFiles/EpubViewer/EpubViewer';
import FormViewer from 'components/ViewerFiles/FormViewer/FormViewer';
import ImageViewer from 'components/ViewerFiles/ImageViewer/ImageViewer';
import LearningViewer from 'components/ViewerFiles/LearningViewer/LearningViewer';
import PdfViewer from 'components/ViewerFiles/PdfViewer/PdfViewer';
import PresentationViewer from 'components/ViewerFiles/PresentationViewer/PresentationViewer';
import SpreadsheetViewer from 'components/ViewerFiles/SpreadsheetViewer/SpreadsheetViewer';

const messages = defineMessages({
  webLink: {
    id: 'web-link',
    defaultMessage: 'Web Link',
  },
  webLinkDescription: {
    id: 'web-link-description',
    defaultMessage: 'cannot be viewed in the file viewer. Click “Open Web Link” to view the website.',
  },
  openWebLink: {
    id: 'open-web-link',
    defaultMessage: 'Open Web Link',
  },
});

/**
 * Displays supported File Types.
 */
export default class Viewer extends Component {
  static propTypes = {
    /** Files to display */
    files: PropTypes.array.isRequired,

    /** Required to submit v4 Forms -- to be removed for v5 */
    accessToken: PropTypes.string,

    /** ID of active file */
    activeFileId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /** Set the theme (light/dark) of all Viewer components */
    theme: PropTypes.oneOf(['light', 'dark']),

    /** API path for display of <code>pages</code> - consider removing this */
    apiPath: PropTypes.string,

    /** v4 API path for v4 Forms -- to remove for v5 Forms */
    apiPathv4: PropTypes.string,

    /** Initial 'find' query, loads page with highlighted text */
    initialQuery: PropTypes.string,

    /** Initial page/slide to show when the file has loadeed */
    initialPage: PropTypes.number,

    /** Displays fullscreen */
    fullscreen: PropTypes.bool,

    /** User is allow to share */
    hasShare: PropTypes.bool,

    /** User has Block Search enabled and is allow to add pages to Canvas */
    hasBlockSearch: PropTypes.bool,
    hasPageSearch: PropTypes.bool,

    /** All <code>files</code> are treated as a bookmark stack */
    isBookmarkStack: PropTypes.bool,

    /** Displays as a dock */
    isDocked: PropTypes.bool,

    /** Viewer is being displayed on a Public page, disables some functionality */
    isPublic: PropTypes.bool,

    /** Viewer is being displayed on a Public page, disables some functionality */
    isShare: PropTypes.bool,

    /** Viewer is being displayed on a Public page, disables some functionality */
    isShareAll: PropTypes.bool,

    /** Required for secure storage */
    authString: PropTypes.string,

    /** Company watermark settings */
    watermarkSettings: PropTypes.shape({
      text: PropTypes.string,
      opacity: PropTypes.string,
      colour: PropTypes.string,

      userFirstName: PropTypes.string,
      userLastName: PropTypes.string,
      userEmail: PropTypes.string,
    }),

    /** Public share landing page - watermark settings */
    shareWatermarkSettings: PropTypes.shape({
      email: PropTypes.string,
      customText: PropTypes.string,
      opacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      colour: PropTypes.string,
      showDate: PropTypes.bool,
    }),

    /** Handle Bookmark All */
    onBookmarkAll: PropTypes.func,

    /** Handle Add File (all pages) to Canvas */
    onAddFileToCanvas: PropTypes.func,

    /** Handle Add Page to Canvas */
    onAddPageToCanvas: PropTypes.func,

    /** Handle Create Story */
    onCreateStory: PropTypes.func,

    /** Handle Open Story */
    onOpenStory: PropTypes.func,

    /** Handle File Details Open */
    onOpenFileDetails: PropTypes.func,

    /** Handle show/hide */
    onCloseClick: PropTypes.func.isRequired,

    /** Handle clicking Copy to Clipboard action  */
    onCopyToClipboard: function(props) {
      if (props.copyInternalFileLink && typeof props.onCopyToClipboard !== 'function') {
        return new Error('onCopyToClipboard is required when copyInternalFileLink is provided.');
      }
      return null;
    },

    /** Handle dock toggle - does not display if not passed */
    onDockToggleClick: PropTypes.func,

    /** Handle clicking on other ViewerHeader controls */
    onHeaderItemClick: PropTypes.func.isRequired,

    /** Handle click a tab, generally sets a new active file */
    onTabClick: PropTypes.func.isRequired,

    /** Handle anchor link click a Pdf */
    onPdfAnchorClick: PropTypes.func,

    /** Handle Tab close click event, renders an 'x' in each Tab */
    onTabCloseClick: PropTypes.func,

    /** Pass new file properties with ID to update */
    onUpdateFile: PropTypes.func.isRequired,

    /** Pass files list to share */
    onShareFiles: PropTypes.func,

    /** Broadcast object */
    broadcast: PropTypes.object,

    /** call back when the broadcast start on presenter side */
    onBroadcastStart: PropTypes.func,

    onBroadcastStop: PropTypes.func,

    /** call back when presenter fill all the information and click the share btn */
    onShareClick: PropTypes.func,

    /** note component for the note */
    personalNotesElement: PropTypes.element,

    strings: PropTypes.object,

    selectTypes: PropTypes.func,

    className: PropTypes.string,
  };

  static defaultProps = {
    authString: '',
    theme: 'light',
    initialPage: 1,
    watermarkSettings: {
      text: '',
      opacity: '0.2',
      colour: '#444444',

      userFirstName: 'Public',
      userLastName: 'Viewer',
      userEmail: 'public@viewer'
    },
    shareWatermarkSettings: {
      email: '',
      customText: '',
      opacity: '60',
      colour: '#444444',
      showDate: false,
    },
    strings: {
      sentBy: 'Sent by',
      fileUnsupportedError: 'Sorry, the file you\'re trying to view is currently unsupported'
    }
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.zoomSteps = [0.5, 0.75, 1, 1.5, 2, 3, 4];

    this.state = {
      activeFile: null,
      watermarkApplied: false,
      bookmarkAllModalVisible: false,
      isBroadcastToolbarVisible: false,
      platform: require('platform')
    };

    autobind(this);

    this.viewedFiles = [];
    this.pdfCategory = ['cad', 'numbers', 'pages', 'pdf', 'word', 'visio'];

    // refs
    this.files = {};
    this.viewer = null;
    this.watermark = null;
  }

  UNSAFE_componentWillMount() {
    if (this.props.activeFileId && this.props.files) {
      this.setState({
        activeFile: this.props.files.find(file => this.props.activeFileId === file.id)
      });
    }

    if (this.props.initialPage) {
      this.props.onUpdateFile(this.props.activeFileId, {
        currentPage: this.props.initialPage
      });
    }
  }

  componentDidMount() {
    // Bind shortcut keys
    this.combokeys = new Combokeys(this.viewer);
    this.combokeys.bind(['esc'], this.handleCloseShortcut);

    // Apply css if fullscreen
    if (this.props.fullscreen) {
      document.body.style.overflow = 'hidden';
    }

    // Watermark?
    if (this.state.activeFile && this.state.activeFile.hasWatermark) {
      this.applyWatermark();
    }

    this.handlePdfSidePanelClose();
    this.viewer.focus();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.files !== this.props.files ||
        this.props.activeFileId !== nextProps.activeFileId ||
        this.props.files.filter(file => file.loading).length > 0) {
      this.setState({
        activeFile: nextProps.files.find(file => nextProps.activeFileId === file.id)
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.activeFile !== this.state.activeFile ||
      nextProps.files !== this.props.files ||
      nextProps.isDocked !== this.props.isDocked ||
      nextProps.personalNotesElement !== this.props.personalNotesElement ||
      nextState.isBroadcastToolbarVisible !== this.state.isBroadcastToolbarVisible ||
      nextState.bookmarkAllModalVisible !== this.state.bookmarkAllModalVisible) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeFile, watermarkApplied } = this.state;

    // Docked
    if (prevProps.isDocked && !this.props.isDocked) {
      this.viewer.focus();
      if (this.props.fullscreen) {
        document.body.style.overflow = 'hidden';
      }

      // Undocked
    } else if (!prevProps.isDocked && this.props.isDocked) {
      this.viewer.blur();
      if (this.props.fullscreen) {
        document.body.style.overflow = '';
      }

      // Apply Watermark if not already done
    } else if (prevState.activeFile !== activeFile && activeFile.hasWatermark && !watermarkApplied) {
      this.applyWatermark();
    }
  }

  componentWillUnmount() {
    if (this.props.fullscreen) {
      document.body.style.overflow = '';
    }

    if (this.combokeys) {
      this.combokeys.detach();
    }

    this.viewedFiles = [];
  }

  applyWatermark() {
    const { watermarkSettings } = this.props;

    if (this.watermark) {
      const canvas = this.watermark;
      const ctx = canvas.getContext('2d');
      const font = '24pt "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif';
      let text = watermarkSettings.text;

      // Watermark variables
      switch (text) {
        case '__firstnamelastname__':
          text = watermarkSettings.userFirstName + ' ' + watermarkSettings.userLastName;
          break;
        case '__lastnamefirstname__':
          text = watermarkSettings.userLastName + ' ' + watermarkSettings.userFirstName;
          break;
        case '__email__':
          text = watermarkSettings.userEmail;
          break;
        default:
          break;
      }

      // Set canvas dimensions equal to window
      canvas.height = window.innerHeight - 95;
      canvas.width = window.innerWidth;

      // Calculate text width to use as watermark text width
      ctx.font = font;
      const textWidth = ctx.measureText(text).width || 300;

      // Create watermark text
      const watermarkText = document.createElement('canvas');
      const ctx2 = watermarkText.getContext('2d');

      // Set dimensions of text
      watermarkText.width = textWidth + 30;  // add some padding
      watermarkText.height = 100;

      // Write to canvas
      ctx2.globalAlpha = parseFloat(watermarkSettings.opacity / 100);
      ctx2.font = font;
      ctx2.fillStyle = watermarkSettings.colour;
      ctx2.fillText(text, 0, 50);

      // Create pattern from text
      const watermarkPattern = document.createElement('canvas');
      const watermarkCtx = watermarkPattern.getContext('2d');
      const pattern = watermarkCtx.createPattern(watermarkText, 'repeat');

      // Add pattern to image canvas
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = pattern;
      ctx.rotate(-45 * Math.PI / 180);
      ctx.fill();

      this.setState({ watermarkApplied: true });
    }
  }

  handleDownloadClick() {
    const { authString } = this.props;
    const { activeFile } = this.state;
    if (activeFile.downloadUrl) {
      const newWindow = window.open(activeFile.downloadUrl + authString);
      newWindow.opener = null;
    }
  }

  requestFileFullscreen(file) {
    let elem = this.files[file.id].elem;

    // btc file
    if (file.data) {
      elem = this.files[file.id].btcFrame;

      // cad/pdf file
    } else if (file.category === 'cad' || file.category === 'pdf') {
      elem = this.files[file.id].canvas;
    } else if (file.category === 'app' || file.category === 'btc') {
      elem = this.files[file.id].btcFrame;
    }

    if (!elem.mozFullScreenElement && !elem.webkitDisplayingFullscreen && !elem.msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else if (elem.exitFullscreen) {
      elem.exitFullscreen();
    } else if (elem.msExitFullscreen) {
      elem.msExitFullscreen();
    } else if (elem.mozCancelFullScreen) {
      elem.mozCancelFullScreen();
    } else if (elem.webkitExitFullscreen) {
      elem.webkitExitFullscreen();
    }
  }

  toggleBookmarkAllModal() {
    this.setState({ bookmarkAllModalVisible: !this.state.bookmarkAllModalVisible });
  }

  /** ViewerHeader handlers */
  handleHeaderMenuItemClick(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const initialActive = {
      showPages: false,
      showToc: false,
      showFine: false,
      showPen: false,
    };

    switch (action) {
      case 'add-files':
        console.log('Add Files coming soon!');  // eslint-disable-line
        break;
      case 'bookmark-all':
        this.toggleBookmarkAllModal();
        break;
      case 'bookmark-all-delete':
        this.props.onBookmarkAllDelete();
        break;
      case 'canvas-file':
        this.props.onAddFileToCanvas(this.state.activeFile);
        break;
      case 'canvas-page':
        this.props.onAddPageToCanvas(this.state.activeFile);
        break;
      case 'create-story':
        this.props.onCreateStory();
        break;
      case 'open-story':
        this.props.onOpenStory(this.state.activeFile);
        break;
      case 'open-file-details':
        this.props.onOpenFileDetails(this.state.activeFile);
        break;
      case 'share':
        this.props.onShareFiles([this.state.activeFile]);
        break;
      case 'share-all':
        this.props.onShareFiles(this.props.files);
        break;
      case 'findtext':
        this.files[this.props.activeFileId].handleToggleFind();
        this.props.onUpdateFile(this.props.activeFileId, { ...initialActive, showFind: !this.state.activeFile.showFind }); //icon state
        break;
      case 'toc':
        this.files[this.props.activeFileId].handleToggleOutline();
        this.props.onUpdateFile(this.props.activeFileId, { ...initialActive, showToc: !this.state.activeFile.showToc }); //icon state
        break;
      case 'pages':
        this.files[this.props.activeFileId].handleTogglePages();
        this.props.onUpdateFile(this.props.activeFileId, { showPages: !this.state.activeFile.showPages }); //icon state
        break;
      case 'pen':
        this.files[this.props.activeFileId].handleTogglePen();
        this.props.onUpdateFile(this.props.activeFileId, { showPen: !this.state.activeFile.showPen }); //icon state
        break;
      case 'broadcast':
        this.setState({
          isBroadcastToolbarVisible: true
        });
        break;
      case 'fullscreen':
        this.requestFileFullscreen(this.state.activeFile);
        break;
      default:
        console.log('Unhandled action: ' + action);  // eslint-disable-line
        break;
    }
  }

  handleBookmarkAllCancel() {
    this.toggleBookmarkAllModal();
  }

  handleBookmarkAllSave(event, data) {
    event.preventDefault();

    // Propagate event
    if (data.textValue && this.props.files.length) {
      this.props.onBookmarkAll(event, data.textValue);
    }

    this.setState({ bookmarkAllModalVisible: false });
  }

  /**
   * csv event handlers
   */
  handleCsvLoad(data) {
    const { id, totalPages } = data;
    this.props.onUpdateFile(id, { currentPage: 1, totalPages: totalPages });
  }

  /**
   * pdf event handlers
   */
  handlePdfComplete(id, pdf) {
    this.viewedFiles = this.viewedFiles.map(file => (+file.id === +id ? {
      ...file,
      isLoading: false,
    } : file));
    this.props.onUpdateFile(id, { currentPage: this.props.initialPage, totalPages: pdf.numPages, findtext: true });
  }

  handlePdfError(id, event) {
    if (event.name && event.name !== 'TypeError') {
      this.props.onUpdateFile(id, { error: event });
    }
  }

  handlePdfOutlineComplete(id, hasToc) {
    this.props.onUpdateFile(id, { hasToc: hasToc });
  }

  /**
   * plain text event handlers
   */
  handlePlaintextLoad(event) {
    const { activeFileId } = this.props;
    this.props.onUpdateFile(activeFileId, { content: event.responseText });
  }

  /**
   * presentation (btc) event handlers
   */
  handlePresentationGetSlideCount(event, data) {
    const { id, slideCount } = data;
    this.props.onUpdateFile(id, { totalPages: slideCount });
  }

  handlePresentationSlideChange(event, data) {
    const { id, currentSlide } = data;
    this.props.onUpdateFile(id, { currentPage: currentSlide });
  }

  handlePresentationThumbPanelChange(event, data) {
    const { id, thumbPanelVisible } = data;
    this.props.onUpdateFile(id, { thumbPanelVisible: thumbPanelVisible });
  }

  handlePageClick(event, pageNumber) {
    event.preventDefault();
    if (!isNaN(pageNumber)) {
      this.props.onUpdateFile(this.props.activeFileId, { currentPage: pageNumber });
    }
  }

  handleError(event) {
    console.log(event);
    //this.props.onUpdateFile(this.props.activeFileId, { error: event });
  }

  handleCloseShortcut(event) {
    if (!this.state.isDocked && !this.props.fullscreen) {
      this.props.onCloseClick(event);
    }
  }

  handleCurrentPageChange(event, pageNumber) {
    const { activeFileId } = this.props;
    const { activeFile } = this.state;
    const { totalPages } = activeFile;
    let newPage = pageNumber || parseInt(event.currentTarget.value, 10) || 0;

    if (newPage < 1) {
      newPage = totalPages;
    } else if (newPage > totalPages) {
      newPage = 1;
    }

    if (newPage) {
      this.props.onUpdateFile(activeFileId, { currentPage: newPage });
    }
  }

  handlePdfSidePanelClose() {
    //update parent when component change state
    this.props.onUpdateFile(this.props.activeFileId, { showFind: false, showPages: false, showToc: false, showPen: false, });
  }

  handleToolbarItemClick(event, action) {
    const { activeFileId } = this.props;
    const { activeFile } = this.state;
    const { currentPage, totalPages, scale } = activeFile;
    const zoomIndex = this.zoomSteps.indexOf(scale || 1);

    let newAttrs = {};
    let newZoomIndex;
    let newZoomValue;

    switch (action) {
      case 'fullscreen':
        this.requestFileFullscreen(activeFile);
        break;
      case 'zoomIn':
        newZoomIndex = zoomIndex + 1;
        newZoomValue = this.zoomSteps[newZoomIndex];
        if (newZoomValue) {
          newAttrs = {
            scale: newZoomValue,
            zoomInDisabled: newZoomIndex === this.zoomSteps.length - 1,
            zoomOutDisabled: false
          };
          this.props.onUpdateFile(activeFileId, newAttrs);
        }
        break;
      case 'zoomOut':
        newZoomIndex = zoomIndex - 1;
        newZoomValue = this.zoomSteps[newZoomIndex];
        if (newZoomValue) {
          newAttrs = {
            scale: newZoomValue,
            zoomInDisabled: false,
            zoomOutDisabled: newZoomIndex <= 0
          };
          this.props.onUpdateFile(activeFileId, newAttrs);
        }
        break;
      case 'prevPage': {
        let newPage = currentPage - 1;
        if (newPage < 1) {
          newPage = totalPages;
        }
        newAttrs = {
          currentPage: newPage
        };
        this.props.onUpdateFile(activeFileId, newAttrs);
        break;
      }
      case 'nextPage': {
        let newPage = currentPage + 1;
        if (newPage > totalPages) {
          newPage = 1;
        }
        newAttrs = {
          currentPage: newPage
        };
        this.props.onUpdateFile(activeFileId, newAttrs);
        break;
      }
      default:
        console.info('Unknown action: ' + action);
        break;
    }
  }

  handleVideoFullscreenClick(event) {
    event.preventDefault();
    const { activeFile } = this.state;
    if (activeFile) {
      this.requestFileFullscreen(activeFile);
    }
  }

  handleContextMenu(event) {
    // Disable context menu when watermark enabled
    const {
      category,
      hasWatermark,
      shareStatus
    } = this.state.activeFile;
    if (hasWatermark || (category === 'video' && shareStatus === 'blocked')) {
      event.preventDefault();
    }
  }

  handleBroadcastClose() {
    this.handlePdfSidePanelClose();
    this.setState({
      isBroadcastToolbarVisible: false,
    });
  }

  handlePdfPageAnchorClick(eventArg) {
    if (this.props.onPdfAnchorClick) {
      this.props.onPdfAnchorClick(eventArg);
    }
  }

  updateViewFiles(viewFiles) {
    const { activeFileId, isDocked, files } = this.props;
    const { activeFile } = this.state;

    let result = viewFiles.filter(file => {
      if (isDocked && file.isLoading) {
        return false;
      }

      // Needs support for String ID for PAFS
      if (!isDocked && file.isLoading && file.id !== activeFileId) {
        return false;
      }

      return true;
    }).map(resultFile => ({ ...resultFile, ...files.find(file => file.id === resultFile.id) }));
    const newSelectedFile = viewFiles.find(file => file.id === activeFileId);

    if (!newSelectedFile && !isDocked && activeFile) {
      result = result.concat({ ...activeFile, isLoading: this.pdfCategory.indexOf(activeFile.category) > -1 });
    }

    return result;
  }

  handleOpenWebLink(url) {
    // If we're missing a protocol, assume http
    let fixedUrl = url;
    if (fixedUrl.indexOf('://') === -1) {
      fixedUrl = 'http://' + url;
    }

    // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
    const newWindow = window.open(fixedUrl);
    newWindow.opener = null;
  }

  renderFile(file) {
    const { formatMessage } = this.context.intl;
    // Translations
    const componentStrings = generateStrings(messages, formatMessage);

    const { activeFileId, shareWatermarkSettings, strings, companyTheme } = this.props;
    const { platform } = this.state;
    const styles = require('./Viewer.less');
    let Comp;

    if ((file.loading && !file.error) || (!Object.prototype.hasOwnProperty.call(file, 'statusCode') && Object.prototype.hasOwnProperty.call(file, 'url'))) {
      return (
        <div className={styles.loading}>
          <Loader type="content" />
        </div>
      );
    } else if (!file.loading && file.error) {
      return (
        <Blankslate
          icon={<SVGIcon type="warning" />}
          middle
          heading={this.props.strings.fileOpenErrorHeader}
          message={this.props.strings.fileOpenErrorMsg}
        />
      );
    }
    switch (file.category) {
      case 'app':
        Comp = (
          <AppViewer
            key={'file-' + file.id}
            ref={(c) => { this.files[file.id] = c; }}
            referrer={document.location.origin}
            onError={this.handleError}
            {...file}
          />
        );
        break;
      case 'audio':
      case 'video':
        Comp = (
          <AudioVideo
            key={'file-' + file.id}
            ref={(c) => { this.files[file.id] = c; }}
            inViewer
            autoPlay={platform.name === 'Safari' && platform.os.family === 'iOS'}  // HWV5-440
            isVideo={file.category === 'video'}
            authString={this.props.authString}
            onFullscreenClick={this.handleVideoFullscreenClick}
            {...file}
            activeFileId={activeFileId}
          >
            {activeFileId === file.id && <Watermark {...shareWatermarkSettings} strings={strings} />}
          </AudioVideo>);
        break;
      case 'csv':
        Comp = (
          <div>
            {activeFileId === file.id && <Watermark {...shareWatermarkSettings} strings={strings} />}
            <Csv
              key={'file-' + file.id}
              ref={(c) => { this.files[file.id] = c; }}
              currentPage={file.currentPage || 1}
              authString={this.props.authString}
              onLoad={this.handleCsvLoad}
              onError={this.handleError}
              {...file}
            />
            {file.totalPages && <ViewerToolbar
              currentPage={file.currentPage || 1}
              totalPages={file.totalPages}
              inViewer
              onCurrentPageChange={this.handleCurrentPageChange}
              onItemClick={this.handleToolbarItemClick}
            />}
          </div>
        );
        break;
      case 'epub':
        Comp = (
          <EpubViewer
            key={'file-' + file.id}
            ref={(c) => { this.files[file.id] = c; }}
            authString={this.props.authString}
            onError={this.handleError}
            {...file}
          />
        );
        break;
      case 'excel':
        Comp = (
          <SpreadsheetViewer
            inViewer
            {...file}
          >
            {activeFileId === file.id && <Watermark {...shareWatermarkSettings} strings={strings} />}
          </SpreadsheetViewer>
        );
        break;
      case 'form':
        Comp = (
          <FormViewer
            key={'file-' + file.id}
            ref={(c) => { this.files[file.id] = c; }}
            apiPathv4={this.props.apiPathv4}
            accessToken={this.props.accessToken}
            onError={this.handleError}
            {...file}
          />
        );
        break;
      case 'image':
      case 'project': {
        const isAgentUnsupported = (/chrome/i.test(navigator.userAgent) && window.chrome) || /Firefox/i.test(navigator.userAgent);

        if (file.mimetype === 'image/tiff' && isAgentUnsupported) {
          // File not supported on Chrome/ Firefox browser
          Comp = (
            <Blankslate
              className={styles.error}
              icon={file.category}
              heading={this.props.strings.fileUnsupportedError}
            />
          );
        } else {
          Comp = (
            <ImageViewer
              authString={this.props.authString}
              ref={(c) => { this.files[file.id] = c; }}
              key={'file-' + file.id}
              inViewer
              {...file}
            >
              {activeFileId === file.id && <Watermark {...shareWatermarkSettings} strings={strings} />}
            </ImageViewer>
          );
        }
        break;
      }
      case 'learning':
        Comp = (
          <LearningViewer
            {...file}
          />
        );
        break;
      case 'cad':
      case 'numbers':
      case 'pages':
      case 'pdf':
      case 'word':
      case 'visio':
        Comp = (
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
            <PdfViewer
              key={'file-' + file.id}
              ref={(c) => { this.files[file.id] = c; }}
              authString={this.props.authString}
              initialQuery={this.props.initialQuery}
              onDocumentComplete={this.handlePdfComplete}
              onDocumentError={this.handlePdfError}
              onOutlineComplete={this.handlePdfOutlineComplete}
              onCurrentPageChange={this.handleCurrentPageChange}
              onSidePanelClose={this.handlePdfSidePanelClose}
              onPageAnchorClick={this.handlePdfPageAnchorClick}
              onHandlePdfResize={this.props.onHandlePdfResize}
              onHandleMouseOver={this.props.onHandleMouseOver}
              onHandleMouseOut={this.props.onHandleMouseOut}
              onPdfResize={() => {}}
              {...file}
            >
              {activeFileId === file.id && <Watermark {...shareWatermarkSettings} style={{ left: '0' }} strings={strings} />}
            </PdfViewer>
          </div>
        );
        break;
      case 'txt':
      case 'vcard':
        Comp = (
          <Plaintext
            key={'file-' + file.id}
            ref={(c) => { this.files[file.id] = c; }}
            authString={this.props.authString}
            onLoad={this.handlePlaintextLoad}
            onError={this.handleError}
            {...file}
          >
            {activeFileId === file.id && <Watermark {...shareWatermarkSettings} strings={strings} />}
          </Plaintext>
        );
        break;
      case 'btc':
      case 'keynote':
      case 'powerpoint':
      case 'presentation':
        Comp = (
          <Fragment>
            {file.baseUrl && <PresentationViewer
              key={'file-' + file.id}
              ref={(c) => { this.files[file.id] = c; }}
              currentSlide={file.currentPage}
              onGetSlideCount={this.handlePresentationGetSlideCount}
              onSlideChange={this.handlePresentationSlideChange}
              onThumbPanelChange={this.handlePresentationThumbPanelChange}
              onBroadcastStart={this.props.onBroadcastStart}
              onBroadcastStop={this.props.onBroadcastStop}
              canCreateNote={this.props.canCreateNote}
              onError={this.handleError}
              broadcast={this.props.broadcast}
              personalNotesElement={this.props.personalNotesElement}
              selectTypes={this.props.selectTypes}
              isToolbarVisible={this.state.isBroadcastToolbarVisible}
              onBroadcastClose={this.handleBroadcastClose}
              onShareClick={this.props.onShareClick}
              onHandleMouseOver={this.props.onHandleMouseOver}
              onHandleMouseOut={this.props.onHandleMouseOut}
              strings={this.props.strings}
              {...file}

              //Toolbar functions
              isBroadcastToolbarVisible={this.state.isBroadcastToolbarVisible}
              currentPage={file.currentPage || 1}
              totalPages={file.totalPages}
              fullscreen={!file.hasWatermark}
              inViewer
              onCurrentPageChange={this.handleCurrentPageChange}
              onViewerToolbarMenuItemClick={this.handleToolbarItemClick}
            >
              {activeFileId === file.id && <Watermark
                {...shareWatermarkSettings} style={{ left: '0' }} strings={strings}
                type="presentation"
              />}
            </PresentationViewer>}
          </Fragment>);
        break;
      case 'web':
        Comp = (
          <Blankslate
            altMessage="Open Web Link."
            icon={<SVGIcon type="webLink" style={{ marginTop: '-0.25rem' }} fill={companyTheme.lightBaseColor} />}
            middle
            heading={`${file.name || file.description} ${componentStrings.webLink}`}
            btnMessage={componentStrings.openWebLink}
            onClickHandler={() => this.handleOpenWebLink(file.sourceUrl)}
          >
            <div style={{ marginTop: '0.25rem', marginBottom: '0.8rem' }}>
              <a
                href={file.sourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {file.sourceUrl}
              </a>
              <span>&nbsp;{componentStrings.webLinkDescription}</span>
            </div>
          </Blankslate>
        );
        break;
      default:
        Comp = (
          <Blankslate
            className={styles.error}
            icon={file.category}
            heading={this.props.strings.fileUnsupportedError}
          />
        );
        break;
    }

    return Comp;
  }

  render() {
    const {
      files,
      activeFileId,
      fullscreen,
      isBookmarkStack,
      isDocked,
      isPublic,
      isShare,
      isShareAll,
      onCloseClick,
      onCopyToClipboard,
      onDockToggleClick,
      onHeaderItemClick,
      shareWatermarkSettings,
      className
    } = this.props;
    const { activeFile } = this.state;
    const styles = require('./Viewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Viewer: true,
      full: fullscreen && !isDocked,
      viewerDocked: isDocked,
      hidden: this.state.isBroadcastToolbarVisible,
    }, className);

    const disabledPagesCategories = ['csv', 'btc', 'keynote', 'presentation'];
    const showFullScreenCategories = ['btc', 'app'];

    const headerTools = {
      bookmark: !isPublic,
      share: isShare,
      shareAll: isShareAll,
      bookmarkAll: this.props.onBookmarkAll && files.length > 1 && !isBookmarkStack && !isPublic,
      bookmarkAllDelete: isBookmarkStack && !isPublic,
      openStory: activeFile.story && activeFile.story.permId && !isPublic,
      createStory: this.props.onCreateStory && !isPublic,
      addFiles: false,  // !isPublic
      pages: activeFile.totalPages > 1 && disabledPagesCategories.indexOf(activeFile.category) < 0,
      toc: activeFile.hasToc,
      findtext: activeFile.findtext,
      // pen: activeFile.totalPages > 0 && activeFile.category === 'powerpoint',
      broadcast: !isPublic && activeFile.totalPages > 0 && activeFile.category === 'powerpoint',
      openFileDetails: this.props.onOpenFileDetails && !isPublic,
      fullscreen: showFullScreenCategories.indexOf(activeFile.category) >= 0,
      download: activeFile.downloadUrl,
      isPresentationSlidesVisible: this.state.activeFile.showPages
    };

    this.viewedFiles = this.updateViewFiles(this.viewedFiles);

    const hasShareWatermark = shareWatermarkSettings.email || shareWatermarkSettings.customText || shareWatermarkSettings.showDate;

    return (
      <div
        ref={(c) => { this.viewer = c; }}
        className={classes}
      >
        <ViewerHeader
          activeFile={activeFile}
          copyInternalFileLink={this.props.copyInternalFileLink}
          files={files}
          hasShare={this.props.hasShare}
          hasBlockSearch={this.props.hasBlockSearch}
          hasPageSearch={this.props.hasPageSearch}
          hasPitchBuilderWeb={this.props.hasPitchBuilderWeb}
          isPublic={isPublic}
          isDocked={isDocked}
          theme={this.props.theme}
          {...{
            onCloseClick,
            onCopyToClipboard,
            onDockToggleClick
          }}
          onItemClick={onHeaderItemClick}
          onMenuItemClick={this.handleHeaderMenuItemClick}
          onDownloadClick={this.handleDownloadClick}
          {...headerTools}
        />
        <div
          className={styles.tabsWrapper}
          style={{ display: isDocked ? 'none' : 'block' }}
          data-name="viewTabs"
        >
          <ViewerTabs
            tabs={files}
            activeId={activeFileId}
            theme={this.props.theme}
            onTabClick={this.props.onTabClick}
            onTabCloseClick={this.props.onTabCloseClick}
          />
        </div>
        <div
          className={styles.viewport}
          style={{ display: isDocked ? 'none' : 'block' }}
          data-type="viewport"
          onContextMenu={this.handleContextMenu}
        >
          <canvas
            ref={(c) => { this.watermark = c; }}
            className={styles.watermark}
            style={{ display: activeFile.hasWatermark || hasShareWatermark ? 'block' : 'none' }}
          />
          <div className={styles.fileContainer}>
            {this.viewedFiles.map((item) => (
              <div className={item.id === activeFileId ? styles.filetab : styles.fileHidden} key={'filetab-' + item.id}>
                {this.renderFile(item)}
              </div>))}
          </div>
        </div>
        {!isPublic && <BookmarkAllModal
          isVisible={this.state.bookmarkAllModalVisible}
          onCancel={this.handleBookmarkAllCancel}
          onSave={this.handleBookmarkAllSave}
        />}
      </div>
    );
  }
}
