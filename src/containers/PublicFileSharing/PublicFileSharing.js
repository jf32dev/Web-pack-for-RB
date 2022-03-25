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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getPafsShare,
  loadPafsHtmlData,
  updateFiles,
  updateFile,
  interactionPafs,
  resetHistoryId
} from 'redux/modules/publicShare';
import { createPrompt } from 'redux/modules/prompts';

import Prompts from 'containers/Prompts/Prompts';

import Blankslate from 'components/Blankslate/Blankslate';
import ColourScheme from 'components/ColourScheme/ColourScheme';
import Loader from 'components/Loader/Loader';
import Viewer from 'components/Viewer/Viewer';

import SVGIcon from 'components/SVGIcon/SVGIcon';
import ShareHeader from 'components/PublicShare/ShareHeader';

const messages = defineMessages({
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
  noFilesHeading: {
    id: 'no-files-heading',
    defaultMessage: 'No Files Available'
  },
  noFilesMessage: {
    id: 'no-files-message',
    defaultMessage: 'There are no available files to view.'
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
    defaultMessage: 'Please try again later.'
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
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    getPafsShare,
    loadPafsHtmlData,
    updateFiles,
    updateFile,
    interactionPafs,
    resetHistoryId
  })
)
export default class PublicFileSharing extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { files, match } = nextProps;
    const { params } = match;

    if (nextProps.files && nextProps.files.length > 0 && prevState.loading && nextProps.loaded) {
      // Load File from URL
      if (params && params.fileId) {
        const activeFileId = params.fileId;
        return {
          activeFileId,
          isMenuDisplay: false,
          loading: nextProps.loading
        };
        // Open first file by default
      } else if (!prevState.activeFileId && files && files.length > 0) {
        return {
          activeFileId: files[0].id,
          isMenuDisplay: false,
          loading: nextProps.loading
        };
      }
    } else if (nextProps.loading !== prevState.loading) {
      return {
        loading: nextProps.loading
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      activeFileId: '',
      isMenuDisplay: true,
      offsetTop: 0,
      showCustomText: true,
      loading: props.loading
    };

    this.filesWithHTML = ['app', 'btc', 'excel', 'form', 'keynote', 'powerpoint', 'web'];
    this.searchList = [];
    this.isSubjectUpdated = false;

    //ref
    this.sideBar = null;
    this.timer = null;
    this.defaultState = {
      isMenuDisplay: false,
      activeFileId: '',
    };
    autobind(this);
  }

  componentDidMount() {
    const { params } = this.props.match;

    if (this.props.getPafsShare && _get(params, 'publicFilesId', false)) {
      Promise.resolve(this.props.getPafsShare(params.publicFilesId))
        .then(() => {
          if (this.props.files.length) this.props.interactionPafs(params.publicFilesId, this.state.activeFileId, null);
        });
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevState.offsetTop < this.state.offsetTop && this.sideBar) {
      return this.state.offsetTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { files, loaded, match } = this.props;
    const { params } = match;

    if (snapshot !== null) {
      this.sideBar.scrollTop = snapshot;
    }

    if (files && files.length > 0 && prevProps.loading && loaded) {
      this.searchList = files;
      files.forEach(file => {
        const activeFile = file;
        const shareId = _get(params, 'publicFilesId', false);
        const fileId = _get(activeFile, 'id', false);
        const url = _get(activeFile, 'url', '');
        // File requires HTML data
        if (this.filesWithHTML.indexOf(activeFile.category) > -1 && !activeFile.data &&
          this.checkVariable(fileId) && this.checkVariable(shareId)) {
          this.props.loadPafsHtmlData(shareId, fileId, url);
        }
      });
    }

    if (this.state.activeFileId !== prevState.activeFileId) {
      this.props.resetHistoryId();
    }

    if (this.props.interactioned && prevProps.interactioning &&  _get(prevProps.match.params, 'publicFilesId', false)) {
      this.timer = window.setTimeout(() => {
        let hubshare;
        Promise.resolve(hubshare = prevState.activeFileId === this.state.activeFileId ? this.props.historyId : null)
          .then(() => {
            this.props.interactionPafs(prevProps.match.params.publicFilesId, this.state.activeFileId, hubshare);
          });
      }, 5000);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  checkVariable(variable) {
    if (typeof variable === 'boolean' && variable === false) {
      return false;
    }
    return true;
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
    const activeFileId = _get(context, 'props.id', '');

    const dataset = _get(e, 'currentTarget.dataset', {});
    if (activeFileId !== '') {
      const activeFile = this.props.files.find(file => String(file.id) === String(activeFileId));
      if (activeFile.category === 'web') {
        if (!activeFile.sourceUrl) {
          if (activeFile.url) {
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
          this.handleOpenInNewWindow(activeFile.sourceUrl);
        }
      } else if (activeFile.error) {
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
    } else if (dataset.name === 'viewerClose') {
      this.setState({
        isMenuDisplay: true
      });
    } else if (dataset.name === 'viewInHub') {
      const newWindow = window.open(this.props.storyViewUrl, '_blank');
      newWindow.opener = null;
    }
  }

  /** Share header functions **/
  handleDownloadFileClick(event, context) {
    const { params } = this.props.match;
    const url = `${window.BTC.BTCAPI}/shares/${params.publicFilesId}/files/${context.activeFileId}/download`;
    const activeFile = this.props.files.find(file => file.id === context.activeFileId);

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
      this.handleOpenInNewWindow(url);
    }
  }

  handleFileClick(e) {
    const activeFileId = e.value; //_get(context, 'props.id', -1);
    const activeFile = this.props.files.find(file => file.id === activeFileId);

    if (activeFileId) {
      if (activeFile.category === 'web') {
        if (!activeFile.sourceUrl) {
          if (activeFile.url) {
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
          this.handleOpenInNewWindow(activeFile.sourceUrl);
        }
      } else if (activeFile.statusCode === 403) {
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
      this.handlePdfResize();
    }
  }

  //error
  handleUpdateFile(id, attrs) {
    if (id > 0 || (isNaN(id) && id !== 'undefined')) {
      const files = this.props.files.map(file => {
        const update = file.id === id ? attrs : {};
        return {
          ...file,
          ...update,
        };
      });
      this.props.updateFiles(files);
    }
  }

  /** Handle Pdf Anchor CLick**/
  handlePdfAnchorClick(anchor) {
    const { href } = anchor;
    if (href) {
      window.open(href);
    }
  }

  /** Viewer's content function **/
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
    if (header) header.style.opacity = 0;
  }

  handlePdfResize(pdfViewer) {
    setTimeout(() => {
      this.updateViewerToolbar(pdfViewer);
    }, 10);
  }

  handleMouseMove() {
    const header = document.querySelector('header[data-name="viewHeader"]');
    if (header && parseInt(header.style.opacity, 10) === 0) {
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

  handleCloseCustomTextClick() {
    this.setState({
      showCustomText: false,
      toggle: !this.state.toggle
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      allowDownloads,
      companyLogoUrl,
      customText,
      files,
      loaded,
      naming,
      theme,
      title,
    } = this.props;
    const {
      activeFileId,
      isMenuDisplay,
      showCustomText
    } = this.state;
    const styles = require('./PublicFileSharing.less');
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

    // Render blankslate with different messages
    const message = files.length ? strings.emptySelectedMessage : strings.noFilesMessage;
    let heading = files.length ? strings.emptySelectedHeading : strings.noFilesHeading;
    if (Object.hasOwnProperty.call(this.props, 'error')) {
      heading = this.props.error.message;
    }

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
        <Prompts />
        {loaded &&
        <div className={styles.contentWrapper}>
          <ShareHeader
            id="pShareHeader"
            activeFileId={activeFileId}
            companyLogoUrl={companyLogoUrl}
            files={files}
            storyViewUrl={this.props.storyViewUrl}
            showShare={false}
            showDownload={allowDownloads}
            onDownloadFileClick={this.handleDownloadFileClick}
            onHandleFileClick={this.handleFileClick}
          />
          <div className={styles.body} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseOut} onScroll={this.handleScroll}>
            <div className={rightClasses}>
              {activeFileId === '' && <div className={styles.empty}>
                <Blankslate
                  icon={<SVGIcon type="sharedFile" style={{ marginTop: '-0.25rem' }} />}
                  heading={heading}
                  message={message}
                />
              </div>}
              {files.length > 0 && activeFileId !== '' && <Viewer
                className={styles.viewer}
                files={files.map(file => ({
                  loading: false,
                  statusCode: 200,
                  error: null,
                  ...file,
                }))}
                shareWatermarkSettings={this.props.watermark}
                activeFileId={activeFileId}
                apiPath={window.BTC.BTCAPI}
                isPublic
                isDocked={false}
                strings={strings}
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
            <span className={styles.close} onClick={this.handleCloseCustomTextClick} data-action="close" />
          </div>
          }
        </div>}
      </div>
    );
  }
}
