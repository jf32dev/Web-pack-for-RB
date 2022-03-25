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
 * @author Jason Huang <jason.huang@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';
import getBrowserFingerPrint from 'helpers/getBrowserFingerPrint';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getShare,
  loadHtmlData,
  forward,
  updateFiles,
  updateFile,
  interaction,
  recordHubShareData
} from 'redux/modules/publicShare';
import { createPrompt } from 'redux/modules/prompts';

import { parseMessage } from 'redux/modules/story/helpers';

import PublicJSBridgeListener from 'containers/PublicJSBridgeListener/PublicJSBridgeListener';
import Prompts from 'containers/Prompts/Prompts';

import Blankslate from 'components/Blankslate/Blankslate';
import ColourScheme from 'components/ColourScheme/ColourScheme';
import Loader from 'components/Loader/Loader';
import LocaleHandler from 'containers/LocaleHandler/LocaleHandler';
import StoryDescription from 'components/StoryDescription/StoryDescription';
import Viewer from 'components/Viewer/Viewer';

import SVGIcon from 'components/SVGIcon/SVGIcon';
import ForwardModal from 'components/PublicShare/ForwardModal';
import ShareHeader from 'components/PublicShare/ShareHeader';

const appVersion = require('../../../package.json').version;

const messages = defineMessages({
  forward: {
    id: 'forward',
    defaultMessage: 'Forward'
  },
  reply: {
    id: 'reply',
    defaultMessage: 'Reply'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  subject: {
    id: 'subject',
    defaultMessage: 'Subject'
  },
  emailAddresses: {
    id: 'email-addresses',
    defaultMessage: 'Email Addresses'
  },
  files: {
    id: 'files',
    defaultMessage: 'Files'
  },
  searchFiles: {
    id: 'search-files',
    defaultMessage: 'Search files'
  },
  shared: {
    id: 'shared',
    defaultMessage: 'Shared'
  },
  name: {
    id: 'name',
    defaultMessage: 'Name'
  },
  message: {
    id: 'message',
    defaultMessage: 'Message'
  },
  expand: {
    id: 'expand',
    defaultMessage: 'Expand'
  },
  storyDetails: {
    id: 'story-details',
    defaultMessage: '{story} Details'
  },
  signIn: {
    id: 'sign-in',
    defaultMessage: 'Sign In'
  },
  emptySelectedHeading: {
    id: 'empty-selected-heading',
    defaultMessage: 'No Files Selected'
  },
  emptySelectedMessage: {
    id: 'empty-selected-message',
    defaultMessage: 'Please select the desired file from the left-hand navigation.'
  },
  empty: {
    id: 'empty',
    defaultMessage: 'Empty'
  },
  emptyFileMessage: {
    id: 'empty-file-message',
    defaultMessage: 'No files are available'
  },
  done: {
    id: 'done',
    defaultMessage: 'Done'
  },
  forwardSuccessMsg: {
    id: 'forward-success-msg',
    defaultMessage: 'Emails forwarded successfully'
  },
  noMessageProvided: {
    id: 'no-message-provided',
    defaultMessage: 'No message provided'
  },
  downloadAll: {
    id: 'download-all',
    defaultMessage: 'Download All'
  },
  language: {
    id: 'language',
    defaultMessage: 'Language'
  },
  privacyPolicy: {
    id: 'privacyPolicy',
    defaultMessage: 'Privacy Policy'
  },
  fileOpenErrorHeader: {
    id: 'files-open-error-header',
    defaultMessage: 'There was a problem opening the file.',
  },
  fileOpenErrorMsg: {
    id: 'file-open-error-msg',
    defaultMessage: 'Please try again later.',
  },
  sentBy: {
    id: 'sent-by',
    defaultMessage: 'Sent by',
  }
});

function mapStateToProps(state) {
  const { publicShare } = state;
  const files = (publicShare.files || []).map((file) => {
    return {
      ...file,
      url: file.url || file.downloadUrl,
    };
  });
  return {
    ...publicShare,
    files,
    bridgeVersion: state.jsbridge.bridgeVersion,
    storyDescriptionBaseUrl: '/static/templates/story-description-share',
    languages: _get(state, 'publicShare.languages', {}),
    langCode: _get(state, 'publicShare.langCode', 'en-us'),
    story: {
      ...publicShare.story,
      description: (publicShare.story && publicShare.story.description) ? parseMessage(publicShare.story.description) : ''
    }
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    getShare,
    loadHtmlData,
    forward,
    updateFiles,
    updateFile,
    interaction,
    recordHubShareData,
  })
)
export default class PublicFiles extends PureComponent {
  static propTypes = {

    customText: PropTypes.string,

    disableForward: PropTypes.bool,

    disableDownload: PropTypes.bool,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeFileId: -1,
      isMenuDisplay: true,
      isForwardModalVisible: false,
      forwardValues: {},
      isStoryDescriptionLoaded: false,
      offsetTop: 0,
      showCustomText: true,
      newFiles: [],
      currentPage: {},
      pageDuration: {}
    };

    this.filesWithHTML = ['app', 'btc', 'excel', 'form', 'keynote', 'powerpoint', 'web'];
    this.searchList = [];
    this.isSubjectUpdated = false;

    //ref
    this.sideBar = null;

    this.defaultState = {
      isStoryDescVisible: false,
      isMenuDisplay: false,
      activeFileId: -1,
      language: null
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { params } = this.props.match;

    if (this.props.getShare && _get(params, 'publicFilesId', false)) {
      this.props.getShare(params.publicFilesId);
      this.props.interaction(params.publicFilesId, JSON.stringify({
        hubshare: {
          historyId: 0,
        }
      }));
    }
  }

  componentDidMount() {
    this.flushAllRecordData(); //clear remnant from last session
    this.recordDataTimer();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { files, loaded, story, user } = nextProps;
    const { params } = nextProps.match;
    const { pathname } = nextProps.location;

    // Update file states when loaded or when a file has been changed
    if (files && files.length > 0 && this.props.loading && loaded || !_isEqual(files, this.props.files)) {
      const newFiles = files.map(item => {
        const newItem = item;
        if (item.category === 'video' && (item.downloadUrl === item.url) && (item.url.indexOf('download') > 0)) {
          newItem.url = '';
        }
        return newItem;
      });
      this.setState({ newFiles });
    }

    if (files && files.length > 0 && this.props.loading && loaded) {
      const newFiles = files.map(item => {
        const newItem = item;
        if (item.category === 'video' && (item.downloadUrl === item.url) && (item.url.indexOf('download') > 0)) {
          newItem.url = '';
        }
        return newItem;
      });
      this.setState({ newFiles });
      // Load File from URL
      if (params.fileId) {
        const activeFileId = parseInt(params.fileId, 10);
        this.setState({
          activeFileId,
          isMenuDisplay: false
        });
        // Open story description on landing
      } else if (pathname.substr(pathname.lastIndexOf('/') + 1) === 'story') {
        this.setState({
          isStoryDescVisible: !!_get(story, 'id', false),
          isMenuDisplay: false
        });
        // Open first file by default
      } else if (files && files.length > 0) {
        this.setState({
          activeFileId: parseInt(files[0].id, 10),
          isMenuDisplay: false
        });
        // Open story description on landing
      } else if (_get(story, 'description', false)) {
        this.setState({
          isStoryDescVisible: !!_get(story, 'id', false),
          isMenuDisplay: false
        });
      }

      this.searchList = files;
      files.forEach(file => {
        const activeFile = file;
        const shareId = _get(params, 'publicFilesId', false);
        const storyId = _get(story, 'id', false) || activeFile.storyId;
        const fileId = _get(activeFile, 'id', false);
        const userId = _get(user, 'id', false);
        // File requires HTML data
        if (this.filesWithHTML.indexOf(activeFile.category) > -1 && !activeFile.data &&
          this.checkVariable(fileId) && this.checkVariable(shareId) && this.checkVariable(storyId)) {
          this.props.loadHtmlData(userId, shareId, storyId, fileId);
        }
        // this.handleLoadHeader(activeFile);
      });
    } else if (!this.props.forwarded && nextProps.forwarded) {
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, nextProps.naming);
      this.props.createPrompt({
        id: 'forward',
        type: 'info',
        title: strings.done,
        message: strings.forwardSuccessMsg,
        dismissible: true,
        autoDismiss: 10
      });
    }
    if (this.props.interactioning && nextProps.interactioned && _get(this.props.match.params, 'publicFilesId', false)) {
      window.setTimeout(() => {
        const hubshare = {
          hubshare: {
            historyId: nextProps.hubshare.historyId,
          }
        };
        const file = this.state.activeFileId > 0 ? {
          file: {
            id: this.state.activeFileId,
            historyId: nextProps.file && this.state.activeFileId !== nextProps.file.id ? 0 : _get(nextProps, 'file.historyId', 0)
          }
        } : {};
        this.props.interaction(this.props.match.params.publicFilesId, JSON.stringify({
          ...hubshare,
          ...file,
        }));
      }, 5000);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.offsetTop < this.state.offsetTop && this.sideBar) {
      this.sideBar.scrollTop = this.state.offsetTop;
    }
  }

  checkVariable(variable) {
    if (typeof variable === 'boolean' && variable === false) {
      return false;
    }
    return true;
  }

  /**
   * JS Bridge handlers
   */

  // openUrl
  handleOpenURL(request, cb) {
    const { url, target, rel } = request.data.params;

    if (url && (!rel || rel !== 'app') || target) {
      this.handleOpenInNewWindow(url);
      cb({ result: true, error: null }, request);

    // invalid request
    } else {
      cb({ result: false, error: null }, request);
    }
  }

  // sendEmail
  handleSendEmail(request, cb) {
    const { to, cc, bcc, subject, body } = request.data.params;

    // Valid request
    if (to || body || subject) {
      let tmp = subject ? `?subject=${subject}` : '';
      if (body) tmp = tmp ? `${tmp}&body=${body}` : `?body=${body}`;
      if (cc) tmp = tmp ? `${tmp}&cc=${cc}` : `?cc=${cc}`;
      if (bcc) tmp = tmp ? `${tmp}&bcc=${bcc}` : `?bcc=${bcc}`;

      const url = `mailto:${to}${tmp}`;
      const newWindow = window.open(url, '_self');
      newWindow.opener = null;
      cb({ result: true, error: null }, request);

    // Invalid request
    } else {
      cb({ result: false, error: null }, request);
    }
  }

  // getSystemConfig
  handleGetSystemConfig(request, cb) {
    const result = {
      bridgeVersion: this.props.bridgeVersion,
      serverURL: window.BTC.BTCAPI,
      appName: 'Hub Web App',
      appVersion: appVersion,
      terminology: {
        nounSingular: {
          tab: this.props.naming.tab,
          channel: this.props.naming.channel,
          story: this.props.naming.story
        },
        nounPlural: {
          tab: this.props.naming.tabs,
          channel: this.props.naming.channels,
          story: this.props.naming.stories
        }
      },
      mainThemeHexColor: this.props.theme.baseColor
    };
    cb({ result: result, error: null }, request);
  }

  // getStoryDescription
  handleGetStoryDescription(request, cb) {
    const result = {
      title: this.props.story.title,
      message: this.props.story.description
    };
    cb({ result: result, error: null }, request);
  }

  // storyDescriptionHeight
  handleStoryDescriptionHeight(request, cb) {
    this.setState({
      isStoryDescriptionLoaded: true
    });
    cb({ result: true, error: null }, request);
  }

  handleOpenInNewWindow(url) {
    // If we're missing a protocol, assume http
    let fixedUrl = url;
    if (fixedUrl.indexOf('://') === -1) {
      fixedUrl = 'http://' + url;
    }

    // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
    const newWindow = window.open(fixedUrl);
    newWindow.opener = null;
  }

  handleClick(e, context) {
    e.stopPropagation();
    const activeFileId = _get(context, 'props.id', -1);

    const dataset = _get(e, 'currentTarget.dataset', {});
    if (activeFileId > 0) {
      const currentFile = this.props.files.find(item => item.id === activeFileId);
      if (currentFile.category === 'web') {
        if (!currentFile.sourceUrl) {
          if (currentFile.url) {
            this.setState({
              ...this.defaultState,
              activeFileId,
            });
          } else {
            this.props.createPrompt({
              id: 'no-sourceurl-defined',
              type: 'error',
              title: 'Error',
              message: 'No sourceUrl defined',
              dismissible: true,
              autoDismiss: 5
            });
          }
        } else {
          this.handleOpenInNewWindow(currentFile.sourceUrl);
        }
      } else {
        const activeFile = this.props.files.find(file => +file.id === +activeFileId);
        if (activeFile.error) {
          this.props.createPrompt({
            id: 'file-not-found',
            type: 'error',
            title: 'Error',
            message: activeFile.error,
            dismissible: true,
            autoDismiss: 5
          });
        } else if (['video', 'audio'].indexOf(activeFile.category) > -1 && _isEmpty(activeFile.url)) {
          this.props.createPrompt({
            id: 'file-address-not-found',
            type: 'error',
            title: 'Error',
            message: 'File-Address not found',
            dismissible: true,
            autoDismiss: 5
          });
        } else {
          this.setState({
            ...this.defaultState,
            activeFileId,
          });
        }
      }
    } else if (dataset.type === 'download') {
      const activeFile = this.props.files.find(file => file.downloadUrl === dataset.url);
      if (activeFile.statusCode === 403) {
        this.props.createPrompt({
          id: '403',
          type: 'error',
          title: '403 Error',
          message: activeFile.error.message,
          dismissible: true,
          autoDismiss: 5
        });
      } else {
        const newWindow = window.open(dataset.url, '_self');
        newWindow.opener = null;
      }
    } else if (dataset.name === 'forward') {
      this.setState({
        isForwardModalVisible: true
      });
    } else if (dataset.name === 'viewerClose') {
      this.setState({
        isMenuDisplay: true
      });
    } else if (dataset.name === 'viewInHub') {
      const newWindow = window.open(this.props.storyViewUrl, '_blank');
      newWindow.opener = null;
    } else if (dataset.name === 'forwardValues') {
      const { params } = this.props.match;
      const { forwardValues } = this.state;
      const shareId = _get(params, 'publicFilesId', false);
      const to = JSON.stringify(_get(forwardValues, 'emails', []).map(email => email.value));
      let subject = _get(forwardValues, 'subject', '');
      if (!this.isSubjectUpdated) {
        subject = `Fwd: ${this.props.title}`;
      }
      const note = _get(forwardValues, 'message', '');
      this.props.forward(shareId, to, subject, note, this.state.language || this.props.langCode);
      this.setState({
        isForwardModalVisible: false,
      });
    }
  }

  handleDownloadAllFilesClick() {
    const { params } = this.props.match;
    const url = `${window.BTC.BTCAPI}/public/share/${params.publicFilesId}/download`;
    const newWindow = window.open(url, '_self');
    newWindow.opener = null;
  }

  handleFileClick(e) {
    const activeFileId = e.value; //_get(context, 'props.id', -1);
    if (activeFileId > 0) {
      const currentFile = this.props.files.find(item => item.id === activeFileId);
      if (currentFile.category === 'web') {
        if (!currentFile.sourceUrl) {
          if (currentFile.url) {
            this.setState({
              ...this.defaultState,
              activeFileId,
            });
          } else {
            this.props.createPrompt({
              id: 'no-sourceurl-defined',
              type: 'error',
              title: 'Error',
              message: 'No sourceUrl defined',
              dismissible: true,
              autoDismiss: 5
            });
          }
        } else {
          this.setState({
            ...this.defaultState,
            activeFileId,
          });
        }
      } else {
        const activeFile = this.props.files.find(file => +file.id === +activeFileId);
        if (activeFile.statusCode === 403) {
          this.setState({
            ...this.defaultState,
            activeFileId,
          });
        } else if (activeFile.error) {
          const message = _get(activeFile, 'error', 'File not Found');
          this.props.createPrompt({
            id: 'file-not-found',
            type: 'error',
            title: 'Error',
            message: typeof message === 'string' ? message : 'File not Found',
            dismissible: true,
            autoDismiss: 5
          });
        } else if (['video', 'audio'].indexOf(activeFile.category) > -1 && _isEmpty(activeFile.url)) {
          this.props.createPrompt({
            id: 'file-address-not-found',
            type: 'error',
            title: 'Error',
            message: 'File-Address not found',
            dismissible: true,
            autoDismiss: 5
          });
        } else {
          this.setState({
            ...this.defaultState,
            activeFileId,
          });
        }
      }
      this.handlePdfResize();
    }
  }

  handleShareClick() {
    this.setState({
      isForwardModalVisible: true
    });
  }

  handleStoryDetailClick(event) {
    event.preventDefault();

    if (this.props.story.description !== '') {
      this.setState({
        ...this.defaultState,
        isStoryDescVisible: true
      });
    }
  }

  //error
  handleUpdateFile(id, attrs) {
    if (id > 0) {
      const files = this.props.files.map(file => {
        const update = file.id === id ? attrs : {};
        return {
          ...file,
          ...update,
        };
      });
      this.props.updateFiles(files);

      if (!this.state.currentPage[id] || attrs.currentPage && attrs.currentPage !== this.state.currentPage[id]) {
        if (attrs.currentPage) {
          const currentPage = { ...this.state.currentPage };
          currentPage[id] = attrs.currentPage;
          const pageDuration = { ...this.state.pageDuration };
          delete pageDuration[id]; //reset
          this.setState({
            currentPage,
            pageDuration
          });
        }
        this.flushRecordData(id, attrs.currentPage);
      }
    }
  }

  /** Handle Pdf Anchor CLick**/
  handlePdfAnchorClick(anchor) {
    const { href } = anchor;
    if (href) {
      window.open(href);
    }
  }

  updateViewerToolbar(pdfViewer) {
    let pdfViewerEl = pdfViewer && pdfViewer.elem;//powerpoit presentation
    if (!pdfViewerEl) {
      pdfViewerEl = pdfViewer && pdfViewer.frame; //pdf
    }
    const header = document.querySelector('header[data-name="viewHeader"]'); //pdf
    if (pdfViewerEl && header) {
      header.style.opacity = 0.8;
    } else if (header) {
      header.style.opacity = 0;
    }
  }

  hideViewerToolbar() {
    const header = document.querySelector('header[data-name="viewHeader"]'); //pdf
    header.style.opacity = 0;
  }

  handlePdfResize(pdfViewer) {
    setTimeout(() => {
      this.updateViewerToolbar(pdfViewer);
    }, 10);
  }

  handleMouseMove() {
    const header = document.querySelector('header[data-name="viewHeader"]');
    if (parseInt(header.style.opacity, 10) === 0) {
      header.style.opacity = 0.8;
    }
  }

  handleMouseOver(pdfViewer) {
    this.updateViewerToolbar(pdfViewer);
  }

  handleMouseOut(pdfViewer) {
    this.updateViewerToolbar(pdfViewer);
  }

  handleScroll() {
    this.hideViewerToolbar();
  }

  handleListChange(newList) {
    this.searchList = newList;
  }

  handleLanguageChange(context) {
    this.setState({
      language: context.id
    });
  }

  handleModalClose() {
    this.setState({
      isForwardModalVisible: false
    });
  }

  handleCloseClick() {
    this.setState({
      showCustomText: false
    });
  }

  handleUpdateForward(update) {
    if (update.subject && !this.isSubjectUpdated) {
      this.isSubjectUpdated = true;
    }

    this.setState({
      forwardValues: {
        ...this.state.forwardValues,
        ...update
      },
    });
  }

  handleActiveFilePosition(offsetTop) {
    this.setState({
      offsetTop
    });
  }

  flushAllRecordData() {
    const savedRecord = JSON.parse(localStorage.getItem('record_hubshare_data'));
    if (savedRecord && savedRecord.currentPage) {
      for (const id in savedRecord.currentPage) {
        if (Object.prototype.hasOwnProperty.call(savedRecord.currentPage, id)) {
          this.flushRecordData(id);
        }
      }
      localStorage.removeItem('record_hubshare_data');
    }
  }

  flushRecordData(id, activePageId) {
    const savedRecord = JSON.parse(localStorage.getItem('record_hubshare_data'));
    if (savedRecord || activePageId) { //clear local storage
      const { params } = this.props.match;
      const recordedTime = new Date().getTime() / 1000;

      const record = {
        action: 'view',
        payload: '',
        ref_slide: savedRecord && savedRecord.currentPage[id] || null,
        ref_slide_time: savedRecord && savedRecord.currentPage[id] && savedRecord.pageDuration[id] ? savedRecord.pageDuration[id] : null,
        slide_index: activePageId || null,
        hubshare_id: params.publicFilesId,
        id: id,
        recorded_time: recordedTime,
        session_id: savedRecord && savedRecord.session || localStorage.BTCTK_A || getBrowserFingerPrint(),
      };

      if (savedRecord && savedRecord.currentPage[id] || activePageId) {
        this.props.recordHubShareData(record);//page change
      }

      if (savedRecord) {
        delete savedRecord.currentPage[id];
        delete savedRecord.pageDuration[id];
        localStorage.setItem('record_hubshare_data', JSON.stringify(savedRecord));
      }
    }
  }

  saveRecordDataToLocalStorage() {
    const id = this.state.activeFileId;
    if (id && this.state.currentPage[id]) {
      this.setState(prevState => {
        const pageDuration = { ...prevState.pageDuration };
        if (!pageDuration[id]) pageDuration[id] = 0;
        pageDuration[id] += 1;
        return {
          pageDuration
        };
      }, () => {
        localStorage.setItem('record_hubshare_data', JSON.stringify({
          currentPage: this.state.currentPage,
          pageDuration: this.state.pageDuration,
          session: localStorage.BTCTK_A
        }));
        this.recordDataTimer();
      });
    } else {
      this.recordDataTimer();
    }
  }


  recordDataTimer() {
    window.setTimeout(this.saveRecordDataToLocalStorage, 1000);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      companyLogoUrl,
      files,
      langCode,
      languages,
      loaded,
      naming,
      theme,
      title,
      user,
      customText,
      disableForward,
      disableDownload
    } = this.props;
    const {
      activeFileId,
      forwardValues,
      isForwardModalVisible,
      isMenuDisplay,
      isStoryDescriptionLoaded,
      isStoryDescVisible,
      language,
      showCustomText,
      newFiles
    } = this.state;
    const styles = require('./PublicFiles.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryPublic: true,
    });

    if (!loaded) {
      return (
        <div className={styles.loader} style={{ opacity: 0 }}>
          <Loader type="app" />
        </div>
      );
    }

    const rightClasses = cx({
      right: true,
      mobileHidden: isMenuDisplay
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Page title
    let titleTemplate = '%s - Bigtincan Hub';
    if (process.env.NODE_ENV !== 'production') {
      titleTemplate = '[dev] %s - Bigtincan Hub';
    }

    const isDownloadDisabled = disableDownload || (files.find(item => item.id === activeFileId && item.category !== 'web') ? !files.find(item => item.id === activeFileId).downloadUrl : true);

    return (
      <div className={classes}>
        <Helmet
          titleTemplate={titleTemplate}
          defaultTitle={window.document.title}
        >
          <title>{title}</title>
        </Helmet>
        <ColourScheme
          varSelectors={window.BTC.scheme}
          vars={{
            baseColor: _get(theme, 'baseColor', ''),
            ...theme
          }}
        />
        <PublicJSBridgeListener
          onOpenURL={this.handleOpenURL}
          onSendEmail={this.handleSendEmail}
          onGetSystemConfig={this.handleGetSystemConfig}
          onGetStoryDescription={this.handleGetStoryDescription}
          onStoryDescriptionHeight={this.handleStoryDescriptionHeight}
        />
        <Prompts />
        {loaded &&
        <div className={styles.contentWrapper}>
          <ShareHeader
            id="pShareHeader"
            files={files}
            isDownloadDisabled={isDownloadDisabled}
            activeFileId={activeFileId}
            onHandleStoryDetailClick={this.handleStoryDetailClick}
            onHandleDownloadAllFilesClick={this.handleDownloadAllFilesClick}
            onDownloadFileClick={this.handleClick}
            onHandleShareClick={this.handleShareClick}
            onHandleFileClick={this.handleFileClick}
            user={{ id: 0, ...user }}
            companyLogoUrl={companyLogoUrl}
            storyViewUrl={this.props.storyViewUrl}
            showShare={!disableForward}
          />
          <div className={styles.body} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseOut} onScroll={this.handleScroll}>
            <div className={rightClasses}>
              {isStoryDescVisible && <div
                className={styles.storyDescription}
              >
                <StoryDescription
                  baseUrl={this.props.storyDescriptionBaseUrl}
                  height={isStoryDescriptionLoaded ? '100%' : null}
                  permId={this.props.story.permId}
                />
              </div>}
              {!isStoryDescVisible && activeFileId < 0 && <div className={styles.empty}>
                <Blankslate
                  icon={<SVGIcon type="sharedFile" style={{ marginTop: '-0.25rem' }} />}
                  heading={strings.emptySelectedHeading}
                  message={strings.emptySelectedMessage}
                />
              </div>}
              {files.length > 0 && activeFileId > 0 && <Viewer
                className={styles.viewer}
                files={newFiles.map(file => ({
                  loading: false,
                  statusCode: 200,
                  error: null,
                  ...file,
                }))}
                shareWatermarkSettings={{
                  ...this.props.watermark,
                  email: this.props.watermark.email ? user.email || this.props.watermark.email : '' // set sender's email
                }}
                activeFileId={activeFileId}
                apiPath={window.BTC.BTCAPI}
                isPublic
                isDocked={false}
                strings={strings}
                companyTheme={theme}
                onBookmarkAll={this.handleClick}
                onBookmarkAllDelete={this.handleClick}
                onCloseClick={this.handleClick}
                onDockToggleClick={this.handleClick}
                onTabClick={this.handleClick}
                onTabCloseClick={this.handleClick}
                onHeaderItemClick={this.handleClick}
                onUpdateFile={this.handleUpdateFile}
                onPdfAnchorClick={this.handlePdfAnchorClick}
                onHandlePdfResize={this.handlePdfResize}
                onHandleMouseOver={this.handleMouseOver}
                onHandleMouseOut={this.handleMouseOut}
              />}
            </div>
          </div>
          {showCustomText && customText &&
          <div className={styles.privacyPolicy}>
            {/*eslint-disable-next-line react/no-danger*/}
            <span dangerouslySetInnerHTML={{ __html: customText }} />
            <span className={styles.close} onClick={this.handleCloseClick} data-action="close" />
          </div>
          }
        </div>}
        <ForwardModal
          isVisible={isForwardModalVisible}
          onChange={this.handleUpdateForward}
          onForward={this.handleClick}
          onClose={this.handleModalClose}
          languageList={languages}
          language={language || langCode}
          onLanguageChange={this.handleLanguageChange}
          strings={strings}
          files={this.props.files}
          defaultSubject={`Fwd: ${title}`}
          {...forwardValues}
        />
        <LocaleHandler />
      </div>
    );
  }
}
