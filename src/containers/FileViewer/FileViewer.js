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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import superagent from 'superagent';

import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { withRouter } from 'react-router';
import pathToRegexp from 'path-to-regexp';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import FileDetailsModal from 'components/FileDetailsModal/FileDetailsModal';

import {
  addFile,
  removeFiles,
  removeFile,
  toggleDock,
  setInitialPage,
  setInitialQuery,
  setActiveFile,
  updateFile,
  recordData,

  loadFile,
  loadHtmlData,

  addBookmark,
  deleteBookmark,
  addBookmarkStack,
  deleteBookmarkStack,
  getLatestFileId
} from 'redux/modules/viewer';
import {
  createPrompt
} from 'redux/modules/prompts';
import {
  startBroadcast,
  inviteBroadcast,
  stopBroadcast,
} from 'redux/modules/publicShare';
import {
  addTag,
  addTagToFile,
  removeTagToFile,
  searchTags,
} from 'redux/modules/tag';
import {
  updateEntity
} from 'redux/modules/entities/entities';
import {
  mapFiles
} from 'redux/modules/entities/helpers';
import { setData as setShareData } from 'redux/modules/share';
import {
  load as loadStoryById,
  setReferrerPath
} from 'redux/modules/story/story';
import {
  addSlides,
  generateThumbnails,
  getBlocks,
  getThumbnails,
  setNewIndicator,
} from 'redux/modules/canvas/canvas';

import Viewer from 'components/Viewer/Viewer';
import PresentationNote from 'components/Presentation/PresentationNote';

const messages = defineMessages({
  broadcast: { id: 'broadcast', defaultMessage: 'Broadcast' },
  startBroadcast: { id: 'start-broadcast', defaultMessage: 'Start Broadcast' },
  stopBroadcast: {
    id: 'stop-broadcast',
    defaultMessage: 'Stop Broadcast'
  },
  passwordProtected: {
    id: 'password-protected',
    defaultMessage: 'Password Protected'
  },
  inviteGuests: {
    id: 'invite-guests',
    defaultMessage: 'Invite Guests'
  },
  shareLinkLabel: {
    id: 'share-link-with-others',
    defaultMessage: 'Share link with others'
  },
  guests: {
    id: 'guests',
    defaultMessage: 'Guests'
  },
  guest: {
    id: 'guest',
    defaultMessage: 'Guest'
  },
  viewGuests: {
    id: 'view-guests',
    defaultMessage: 'View Guests'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  share: {
    id: 'share',
    defaultMessage: 'Share'
  },
  invite: {
    id: 'invite',
    defaultMessage: 'Invite'
  },
  message: {
    id: 'message',
    defaultMessage: 'Message'
  },
  to: {
    id: 'to',
    defaultMessage: 'To'
  },
  emailFormatDesc: {
    id: 'email-format-message',
    defaultMessage: 'Separate email addresses with semi-colon'
  },
  exit: {
    id: 'exit',
    defaultMessage: 'Exit'
  },
  timeResetMessage: {
    id: 'click-to-reset-timer',
    defaultMessage: 'Click to reset timer'
  },
  speakerNotes: {
    id: 'speaker-notes',
    defaultMessage: 'Speaker Notes'
  },
  personalNotes: {
    id: 'personal-notes',
    defaultMessage: 'Personal Notes',
  },
  noNotes: {
    id: 'no-notes',
    defaultMessage: 'No Notes',
  },
  broadcastPasswordDesc: {
    id: 'broadcast-password-desc',
    defaultMessage: 'Use this generated password or type in your own',
  },
  warning: {
    id: 'warning',
    defaultMessage: 'Warning',
  },
  broadcastExitMessage: {
    id: 'broadcast-exit-message',
    defaultMessage: 'Are you sure you want to exit the broadcast?',
  },
  filesBlockedError: {
    id: 'files-blocked-error',
    defaultMessage: 'One or more files are blocked from sharing, only files which are available for sharing will be added to the share sheet',
  },
  fileUnsupportedError: {
    id: 'file-unsupported-error',
    defaultMessage: 'Sorry, the file you\'re trying to view is currently unsupported'
  },
  fileOpenErrorHeader: {
    id: 'files-open-error-header',
    defaultMessage: 'There was a problem opening the file.',
  },
  fileOpenErrorMsg: {
    id: 'file-open-error-msg',
    defaultMessage: 'Please try again later.'
  },
  fileAddedToCanvas: {
    id: 'file-added-to-canvas',
    defaultMessage: 'File added to Canvas'
  },
  fileAddedToPitchBuilder: {
    id: 'file-added-to-pitch-builder',
    defaultMessage: 'File added to Pitch Builder'
  },
  pageAddedToPitchBuilder: {
    id: 'page-added-to-pitch-builder',
    defaultMessage: 'Page added to Pitch Builder'
  },
  pageAddedToCanvas: {
    id: 'page-added-to-canvas',
    defaultMessage: 'Page added to Canvas'
  },

  // File details modal
  fileDetails: {
    id: 'file-details',
    defaultMessage: 'File Details'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  },
  tags: {
    id: 'tags',
    defaultMessage: 'Tags'
  },
  customMetadata: {
    id: 'custom-metadata',
    defaultMessage: 'Custom Metadata'
  },
  customisableLabel: {
    id: 'customisable-label',
    defaultMessage: 'Customisable Label'
  },
  expiry: {
    id: 'expiry',
    defaultMessage: 'Expiry'
  },
  shareStatus: {
    id: 'share-status',
    defaultMessage: 'Share Status'
  },
  optional: {
    id: 'optional',
    defaultMessage: 'Optional'
  },
  blocked: {
    id: 'blocked',
    defaultMessage: 'Blocked'
  },
  mandatory: {
    id: 'mandatory',
    defaultMessage: 'Mandatory'
  },
  fileType: {
    id: 'file-type',
    defaultMessage: 'File Type'
  },
  fileSize: {
    id: 'file-size',
    defaultMessage: 'File Size'
  },
  dateAdded: {
    id: 'date-added',
    defaultMessage: 'Date Added'
  },
  dateModified: {
    id: 'date-modified',
    defaultMessage: 'Date Modified'
  },
  tagDescription: {
    id: 'add-tag-description',
    defaultMessage: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.'
  },
  newTag: {
    id: 'new-tag',
    defaultMessage: 'New tag'
  },
  suggestions: {
    id: 'suggestions',
    defaultMessage: 'Suggestions'
  },
  noRelatedTags: {
    id: 'no-related-tags',
    defaultMessage: 'No Related Tags'
  },
  internalLinkCopied: {
    id: 'internal-link-copied-clipboard',
    defaultMessage: 'Internal File Link Copied to Clipboard'
  }
});

function mapStateToProps(state) {
  const { canvas, entities, settings, viewer, tag } = state;
  const files = mapFiles(viewer.order, entities);

  // Are all files part of the same bookmark stack?
  const validBookmarks = [];
  let isBookmarkStack = false;
  let bookmarkMatches = 0;
  let currentBookmarkStack = {};

  // List of files added to PB/ Canvas
  const allPitchBuilderContent = Object.keys(canvas.slidesById).filter(sid => !canvas.slidesById[sid].deleted).map(sid => canvas.slidesById[sid].blocks).flat();

  // Mark files as a self bookmark if stackSize is 1
  const fixedFiles = [];
  files.forEach(f => {
    const newObj = { ...f };

    if (typeof newObj.isBookmarkSelf === 'undefined') {
      if (newObj.bookmarks && newObj.bookmarks.length && newObj.bookmarks.find(b => b && b.stackSize === 1)) {
        newObj.isBookmarkSelf = true;  // eslint-disable-line
      } else {
        newObj.isBookmarkSelf = false;  // eslint-disable-line
      }
    }

    if (!viewer.loading && !isEmpty(newObj.filename)) {
      newObj.loading = false;
    }

    if (viewer.loading && isEmpty(newObj.filename)) {
      newObj.loading = true;
    }

    if (!get(entities.stories, `${f.permId}.sharing`, false)) {
      newObj.shareStatus = 'blocked';
    }

    // Add 'canAddToCanvas' property to matched blocks
    if (newObj.blocks && newObj.blocks.length) {
      newObj.blocks = newObj.blocks.map(b => {
        return {
          canAddToCanvas: allPitchBuilderContent.indexOf(b.id) === -1,
          ...b,
        };
      });
    }

    fixedFiles.push(newObj);
  });

  // Check if first file is part of a bookmark stack
  // TODO: search results not returning bookmarks data
  if (fixedFiles.length && fixedFiles[0] && fixedFiles[0].bookmarks && fixedFiles[0].bookmarks.length) {
    // Save bookmarks with stackSize matching
    // number of open files for comparison
    fixedFiles[0].bookmarks.forEach(b => {
      if (!b.deleted && b.stackSize > 1 && b.stackSize === fixedFiles.length) {
        validBookmarks.push(b.id);
      }
    });

    // Check if all files contain the valid bookmarks
    if (validBookmarks.length) {
      fixedFiles.forEach(f => {
        const bookmark = f.bookmarks.find(b => validBookmarks.indexOf(b.id) > -1);
        if (bookmark && !bookmark.deleted) {
          currentBookmarkStack = bookmark;
          bookmarkMatches += 1;
        }
      });

      // It's a bookmark stack!
      if (bookmarkMatches === fixedFiles.length) {
        isBookmarkStack = true;
      }
    }
  }

  return {
    accessToken: state.auth.BTCTK_A,  // v4 Forms

    activeFileId: viewer.activeFileId,
    isDocked: viewer.isDocked,
    initialPage: viewer.initialPage,
    initialQuery: viewer.initialQuery,
    files: fixedFiles,
    fileTag: tag,
    order: viewer.order,
    error: viewer.error,
    stories: state.entities.stories,
    loading: viewer.loading,
    loadingLatestFileId: viewer.loadingLatestFileId,
    latestFileId: viewer.latestFileId,

    broadcast: state.publicShare,

    isBookmarkStack: isBookmarkStack,
    currentBookmarkStack: currentBookmarkStack,

    defaultIndex: settings.userCapabilities.landingPageV5,
    userCapabilities: settings.userCapabilities
  };
}

export default withRouter(@connect(mapStateToProps,
  bindActionCreatorsSafe({
    updateEntity,
    addFile,
    removeFiles,
    removeFile,
    toggleDock,
    setInitialQuery,
    setInitialPage,
    setActiveFile,
    updateFile,
    recordData,

    loadFile,
    loadHtmlData,

    addBookmark,
    deleteBookmark,
    addBookmarkStack,
    deleteBookmarkStack,
    getLatestFileId,

    setShareData,

    createPrompt,

    startBroadcast,
    inviteBroadcast,
    stopBroadcast,

    loadStoryById,
    setReferrerPath,

    addSlides,
    generateThumbnails,
    getBlocks,
    getThumbnails,
    setNewIndicator,

    addTag,
    addTagToFile,
    removeTagToFile,
    searchTags,
  })
)
  class FileViewer extends Component {
  static propTypes = {
    files: PropTypes.array.isRequired,
    activeFileId: PropTypes.number,
    isDocked: PropTypes.bool,

    updateEntity: PropTypes.func.isRequired,
    removeFiles: PropTypes.func.isRequired,
    removeFile: PropTypes.func.isRequired,
    toggleDock: PropTypes.func.isRequired,
    setActiveFile: PropTypes.func.isRequired,

    loadHtmlData: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);

    this.filesWithHTML = ['app', 'btc', 'excel', 'form', 'keynote', 'powerpoint', 'web'];

    // Store previousPath to update location when closed or docked
    this.previousPath = props.location.pathname.indexOf('/file') === -1 ? (props.location.pathname + props.location.search) : '/' + props.defaultIndex;

    this.state = {
      showFileDetails: false,
      currentFile: {},
      currentPage: {},
      pageDuration: {},
      showCanvasDialog: false,
    };
  }

  UNSAFE_componentWillMount() {
    const reFilePermId = pathToRegexp('/file/p/:fileId(\\d+)');
    const matchPId = reFilePermId.exec(location.pathname);
    const re = pathToRegexp('/file/:fileId(\\d+)');
    const match = re.exec(location.pathname);
    let routeFileId;
    // Load file PermId if mounted at file route
    if (matchPId && !this.props.loadingLatestFileId && !this.props.loading) {
      routeFileId = parseInt(matchPId[1], 10);
      this.props.getLatestFileId(routeFileId);
    // Load file if mounted at file route
    } else if (match && !this.props.loading) {
      routeFileId = parseInt(match[1], 10);
      this.props.loadFile(routeFileId);
    }
  }

  componentDidMount() {
    this.flushAllRecordData(); //clear remnant from last session
    this.recordDataTimer();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Active File Changing (switching tabs)
    if (nextProps.activeFileId && nextProps.activeFileId !== this.props.activeFileId) {
      const { activeFileId, files } = nextProps;
      const activeFile = files.find(file => activeFileId === file.id);

      // File requires baseUrl
      if (activeFile && this.filesWithHTML.indexOf(activeFile.category) > -1 && !activeFile.baseUrl) {
        this.props.loadHtmlData(activeFileId);
      }

      // Check header
      if (!Object.prototype.hasOwnProperty.call(activeFile, 'statusCode') && Object.prototype.hasOwnProperty.call(activeFile, 'url')) {
        this.props.updateFile(activeFile.id, {
          loading: true,
        });
        const { authString } = this.context.settings;
        // Our superagent request
        const request = superagent.head(activeFile.url + authString);

        // Fix for AAC audio files on chrome pc and chrome device
        const isNotCacheSupportedBrowser = (/chrome/i.test(navigator.userAgent) && window.chrome) || navigator.userAgent.indexOf('CriOS') !== -1;

        if ((activeFile.category === 'audio' || activeFile.category === 'video' && activeFile.mimetype === 'video/mp4') && isNotCacheSupportedBrowser) {
          request.set({ 'Cache-Control': 'no-cache' });
        }

        request.end((err, res) => {
          this.props.updateFile(activeFile.id, {
            loading: false,
            statusCode: res && res.statusCode,
            error: err
          });
        });
      }
    }

    if (this.compareFiles(this.props.files, nextProps.files)) {
      nextProps.files.forEach(file => {
        if (!get(nextProps.stories, file.permId, false) && !get(file, 'story', false)) {
          if (file.permId) {
            this.props.loadStoryById(file.permId);
          } else {
            this.props.loadFile(file.id);
          }
        }

        if (this.context.settings.userCapabilities.hasPitchBuilderWeb && (file.category === 'pdf' || file.category === 'powerpoint') && !get(file, 'blocks', false)) {
          this.props.loadFile(file.id);
        }
      });
    }

    // Viewer error
    if (nextProps.error && !this.props.error) {
      this.props.createPrompt({
        id: uniqueId('viewer-'),
        type: 'error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
      this.closeViewer();
    }

    // Update current file details
    const { activeFileId, files } = nextProps;
    const nextActiveFile = files.find(file => activeFileId === file.id);
    const currentActiveFile = this.props.files.find(file => activeFileId === file.id);

    if (!isEqual(nextActiveFile, currentActiveFile)) {
      this.setState({
        currentFile: nextActiveFile
      });
    }

    // Load File Permid from URL
    if (this.props.latestFileId !== nextProps.latestFileId && !this.props.loading && !nextProps.loading) {
      this.props.loadFile(nextProps.latestFileId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      // State changed
      !isEqual(this.state, nextState)

      // Attributes expected to change
      || nextProps.activeFileId !== this.props.activeFileId
      || nextProps.isBookmarkStack !== this.props.isBookmarkStack
      || nextProps.isDocked !== this.props.isDocked
      || nextProps.location !== this.props.location

      // Arrays/Objects expected to change
      || !isEqual(nextProps.broadcast, this.props.broadcast)
      || !isEqual(nextProps.currentBookmarkStack, this.props.currentBookmarkStack)
      || !isEqual(nextProps.files, this.props.files)
      || !isEqual(nextProps.fileTag, this.props.fileTag)
    ) {
      return true;
    }
    return false;
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { hasBlockSearch } = this.context.settings.userCapabilities;
    const {
      location,
      activeFileId,
      isDocked,
      order
    } = nextProps;
    const re = pathToRegexp('/file/:fileId(\\d+)');
    const match = re.exec(location.pathname);
    const isModal = window.previousLocation && window.previousLocation.state && window.previousLocation.state.modal;

    // File route match
    if (match && nextProps.location.pathname !== this.props.location.pathname) {
      const routeFileId = parseInt(match[1], 10);

      // File not currently in viewer
      if (order.indexOf(routeFileId) === -1) {
        this.props.addFile(routeFileId);

        // File exists in viewer and is currently docked
      } else if (order.indexOf(routeFileId) > -1 && isDocked) {
        this.props.toggleDock();
      }

      // Update location if active file changes
    } else if (activeFileId && activeFileId !== this.props.activeFileId && !isDocked) {
      const newPath = '/file/' + activeFileId;
      if (newPath !== this.props.location.pathname) {
        this.props.history.push(newPath, { modal: isModal });
      }

      // Fetch blocks if activeFile does not have blocks data
      if (hasBlockSearch) {
        const activeFile = nextProps.files.find(f => f.id === nextProps.activeFileId);
        if (activeFile && (!activeFile.blocks || !activeFile.blocks.length)) {
          this.props.getBlocks(activeFileId, activeFile.filename);
        }
      }
    }

    // Set location to previous when docked and on current file route
    if (match && isDocked && !this.props.isDocked) {
      this.props.history.push(this.previousPath, { modal: !!isModal });

      // Set location to file route when un-docked
    } else if (!isDocked && this.props.isDocked && activeFileId) {
      this.props.history.push('/file/' + activeFileId, { modal: !!isModal });
    }

    // Save previousPath if props.location is not modal
    if (nextProps.history.action !== 'POP' && this.props.location.pathname.indexOf('file') === -1) {
      this.previousPath = this.props.location.pathname + this.props.location.search;
    }
  }

  closeViewer() {
    if (!this.props.isDocked) {
      const isModal = window.previousLocation && window.previousLocation.state && window.previousLocation.state.modal;
      this.props.history.push(this.previousPath, { modal: !!isModal });
    }

    this.clearRecordDataState();
    this.props.removeFiles();
  }

  compareFiles(oldFiles, newFiles) {
    for (const newFile of newFiles) {
      if (!oldFiles.find(oldFile => +oldFile.id === +newFile.id)) {
        return true;
      }
    }

    return false;
  }

  addBlockToCanvas(file, block) {
    // Create slide from block
    const slide = {
      title: '',
      fullPage: true,
      template: 'one-col',
      blocks: [{
        ...block,
        thumbnail: block.thumbnailUrl,
        type: 'image',
        file: file
      }]
    };

    this.props.addSlides([slide], 0, null, file.description);
    this.props.setNewIndicator(true);

    if (!block.thumbnailUrl) {
      this.props.generateThumbnails(file.id, [block]);
    }
  }

  handleAddFileToCanvas(file, strings) {
    const { hasPitchBuilderWeb } = this.context.settings.userCapabilities;
    const uniquePageBlocks = uniqBy(file.blocks, 'page');

    uniquePageBlocks.forEach(block => {
      this.addBlockToCanvas(file, block);
    });

    this.props.createPrompt({
      id: uniqueId('viewer-'),
      type: 'success',
      message: hasPitchBuilderWeb ? strings.fileAddedToPitchBuilder : strings.fileAddedToCanvas,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleAddPageToCanvas(file, strings) {
    const { hasPageSearch, hasPitchBuilderWeb } = this.context.settings.userCapabilities;
    const firstPageStartFrom = hasPageSearch && hasPitchBuilderWeb ? 0 : 1; // Pitch builder page index starts counting from 0

    const block = file.blocks.find(b => (b.page + firstPageStartFrom) === file.currentPage);  // block page is index-based
    this.addBlockToCanvas(file, block);

    this.props.createPrompt({
      id: uniqueId('viewer-'),
      type: 'success',
      message: hasPitchBuilderWeb ? strings.pageAddedToPitchBuilder : strings.pageAddedToCanvas,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleBookmarkAll(event, name) {
    const { files } = this.props;
    const data = [];

    files.forEach(f => {
      data.push({
        story_perm_id: f.permId || get(f, 'story.permId', null),
        filename: f.filename,
        file_perm_id: f.filePermId
      });
    });

    this.props.addBookmarkStack(name, data);
  }

  handleBookmarkAllDelete() {
    const { currentBookmarkStack } = this.props;
    if (currentBookmarkStack) {
      this.props.deleteBookmarkStack(currentBookmarkStack.id);
    }
  }

  handleCopyToClipboard(e, strings) {
    this.props.createPrompt({
      id: uniqueId('viewer-'),
      type: 'success',
      message: strings.internalLinkCopied,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleCreateStory() {
    const { files } = this.props;

    this.props.history.push({
      pathname: '/story/new',
      query: null,
      state: { files: files, modal: true }
    });

    this.props.toggleDock();
  }

  handleOpenStory(file) {
    if (file.story && file.story.permId) {
      // Loaded as a modal route
      let isModal = this.props.location.state && this.props.location.state.modal;

      // Sets referrer as home page
      if (window.previousLocation && window.previousLocation.pathname === '/') {
        isModal = true;
        this.props.setReferrerPath(window.previousLocation.pathname);
      }

      this.props.history.push(`/story/${file.story.permId}`, { modal: isModal });
      this.props.toggleDock();
    }
  }

  handleFileOpen(file) {
    if (file) {
      this.setState({
        showFileDetails: true,
        currentFile: file
      }, () => {
        this.recordDataTimer();
      });
    }
  }

  // File TAGS
  handleTagChange(event) {
    const value = event.currentTarget.value;
    if (value) {
      this.props.searchTags({
        keyword: value,
        limit: 10,
        offset: 0
      });
    }
  }

  handleCreateTag(context) {
    this.props.addTag({
      name: context.name,
      fileId: context.fileId
    });
  }

  handleAddTagFile(context) {
    this.props.addTagToFile({
      fileId: context.fileId,
      tagId: context.tagId,
      tagName: context.tagName
    });
  }

  handleTagDelete(context) {
    this.props.removeTagToFile({
      fileId: context.fileId,
      tagId: context.tagId,
      tagName: context.tagName
    });
  }

  handleFileDetailsClose() {
    this.setState({
      showFileDetails: false
    });
  }

  handleCloseClick(event) {
    event.preventDefault();
    //flush last page
    this.flushAllRecordData();
    this.closeViewer();
  }

  handleDockToggleClick(event) {
    event.preventDefault();
    this.props.toggleDock();
  }

  handleHeaderItemClick(event) {
    event.preventDefault();
    const { activeFileId, files } = this.props;
    const activeFile = files.find(file => activeFileId === file.id);
    const action = event.currentTarget.dataset.action;

    if (activeFile) {
      switch (action) {
        case 'bookmark': {
          const ownBookmark = activeFile.bookmarks && (activeFile.bookmarks.find(b => b.stackSize === 1) || activeFile.bookmarks === true);

          if (!activeFile.bookmarkLoading) {
            // Delete Bookmark
            if (ownBookmark) {
              this.props.deleteBookmark(activeFile.id, ownBookmark.id);

              // Add Bookmark
            } else {
              this.props.addBookmark(activeFile.id, activeFile.description, [{
                story_perm_id: activeFile.permId || get(activeFile, 'story.permId', null),
                filename: activeFile.filename,
                file_perm_id: activeFile.filePermId
              }]);
            }
          }
          break;
        }
        case 'pages':
          this.props.updateEntity('files', activeFileId, { showPages: !activeFile.showPages });
          break;
        case 'toc':
          this.props.updateEntity('files', activeFileId, { showToc: !activeFile.showToc });
          break;
        default:
          console.log('Unhandled action: ' + action);  // eslint-disable-line
          break;
      }
    }
  }

  handleTabClick(event, fileId) {
    event.preventDefault();

    if (fileId !== this.props.activeFileId) {
      this.props.setActiveFile(fileId);
    }
  }

  handleTabCloseClick(event, fileId) {
    event.preventDefault();
    event.stopPropagation();  // prevent tabClick from firing

    if (fileId > 0) {
      //flush last page
      this.clearRecordDataState(fileId, () => {
        this.flushRecordData(fileId);
      });
      this.props.removeFile(fileId);
    }
  }

  handleUpdateFile(id, attrs) {
    if (id > 0 && id === this.props.activeFileId) {
      this.props.updateEntity('files', id, attrs);
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

  handleBroadcastClick(type, password) {
    if (type === 'broadcast-start') {
      this.props.startBroadcast(this.props.activeFileId);
    } else if (type === 'broadcast-stop') {
      this.props.stopBroadcast(this.props.broadcast.broadcastRoomId);
    } else {
      this.props.startBroadcast(this.props.activeFileId, password);
    }
  }

  handleBroadcastShare(event, context, email, message) {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;

    const type = get(event, 'currentTarget.dataset.type', '');
    const strings = generateStrings(messages, formatMessage, naming);
    this.props.inviteBroadcast(this.props.broadcast.broadcastRoomId, email, strings.broadcast, message, type === 'broadcast-start' ? 0 : 1);
  }

  handleShareFiles(files) {
    const allFiles = files.filter(file => file.shareStatus !== 'blocked');
    this.props.setShareData({
      id: 0,
      isVisible: true,
      name: '',
      showMoreOptions: true, // go to advance share when enabled
      files: files,
      url: '',
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.context.settings.storyDefaults.sharingPublic,
      sharingFacebookDescription: '',
      sharingLinkedinDescription: '',
      sharingTwitterDescription: '',
    });

    if (allFiles.length < files.length) {
      const { formatMessage } = this.context.intl;
      const { naming } = this.context.settings;
      const strings = generateStrings(messages, formatMessage, naming);
      this.props.createPrompt({
        id: uniqueId('viewer-'),
        type: 'error',
        message: strings.filesBlockedError || 'test',
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  clearRecordDataState(id, cb) {
    let currentPage = { ...this.state.currentPage };
    let pageDuration = { ...this.state.pageDuration };
    if (id) {
      delete pageDuration[id]; //reset
    } else {
      currentPage = {};
      pageDuration = {};
    }
    this.setState({
      currentPage,
      pageDuration
    }, cb);
  }

  flushAllRecordData() {
    const savedRecord = JSON.parse(localStorage.getItem('record_data'));
    if (savedRecord && savedRecord.currentPage) {
      for (const id in savedRecord.currentPage) {
        if (Object.prototype.hasOwnProperty.call(savedRecord.currentPage, id)) {
          this.flushRecordData(id);
        }
      }
      localStorage.removeItem('record_data');
    }
  }

  flushRecordData(id, activePageId) {
    const savedRecord = JSON.parse(localStorage.getItem('record_data'));
    if (savedRecord || activePageId) { //clear local storage
      const recordedTime = new Date().getTime() / 1000;
      const record = {
        action: 'view',
        payload: '',
        ref_slide: savedRecord && savedRecord.currentPage[id] || null,
        ref_slide_time: savedRecord && savedRecord.currentPage[id] && savedRecord.pageDuration[id] ? savedRecord.pageDuration[id] : null,
        slide_index: activePageId || null,
        id: id,
        recorded_time: recordedTime,
        session_id: savedRecord && savedRecord.session || this.context.settings.authString.replace('&access_token=', '')
      };

      if (savedRecord && savedRecord.currentPage[id] || activePageId) {
        this.props.recordData(record);//page change
      }

      if (savedRecord) {
        delete savedRecord.currentPage[id];
        delete savedRecord.pageDuration[id];
        localStorage.setItem('record_data', JSON.stringify(savedRecord));
      }
    }
  }

  saveRecordData() {
    const id = this.props.activeFileId;
    if (id && !this.props.isDocked && document.visibilityState === 'visible' && this.state.currentPage[id]) {
      this.setState(prevState => {
        const pageDuration = { ...prevState.pageDuration };
        if (!pageDuration[id]) pageDuration[id] = 0;
        pageDuration[id] += 1;
        return {
          pageDuration
        };
      }, () => {
        localStorage.setItem('record_data', JSON.stringify({
          currentPage: this.state.currentPage,
          pageDuration: this.state.pageDuration,
          session: this.context.settings.authString.replace('&access_token=', '')
        }));
        this.recordDataTimer();
      });
    } else {
      this.recordDataTimer();
    }
  }

  recordDataTimer() {
    window.setTimeout(this.saveRecordData, 1000);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      authString,
      company,
      fileSettings,
      naming,
      user,
      userCapabilities,
      theme
    } = this.context.settings;
    const {
      activeFileId,
      broadcast,
      fileTag,
      files,
      isBookmarkStack,
      isDocked
    } = this.props;
    const { canCreateCustomFileDetails } = userCapabilities;
    const activeFile = files.find(file => activeFileId === file.id);
    const styles = require('./FileViewer.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Broadcast specific props
    const broadcastProps = get(activeFile, 'category', '') === 'powerpoint' ? {
      personalNotesElement: <PresentationNote />,
      onBroadcastStart: this.handleBroadcastClick,
      onBroadcastStop: this.handleBroadcastClick,
      broadcast: broadcast,
      onShareClick: this.handleBroadcastShare,
      canCreateNote: get(userCapabilities, 'canCreateNote', false)
    } : null;

    return (
      <TransitionGroup>
        {activeFileId && <CSSTransition
          classNames="fade"
          timeout={350}
          appear
        >
          <div className={activeFile.fullScreen && styles.fullScreen}>
            <Viewer
              files={files}
              activeFileId={activeFileId}
              apiPath={window.BTC.BTCAPI}
              apiPathv4={window.BTC.BTCAPI4}
              accessToken={this.props.accessToken}
              initialPage={this.props.initialPage}
              initialQuery={this.props.initialQuery}
              isBookmarkStack={isBookmarkStack}
              isDocked={isDocked}
              isShare={files.find(file => +file.id === +activeFileId).shareStatus !== 'blocked'}
              isShareAll={files.filter(file => file.shareStatus !== 'blocked').length > 0 && files.length > 1}
              fullscreen
              copyInternalFileLink
              authString={authString}
              hasShare={userCapabilities.hasShare}
              hasBlockSearch={userCapabilities.hasBlockSearch}
              hasPageSearch={userCapabilities.hasPageSearch}
              hasPitchBuilderWeb={userCapabilities.hasPitchBuilderWeb}
              watermarkSettings={{
                text: company.fileWatermarkText,
                opacity: company.fileWatermarkOpacity,
                colour: company.fileWatermarkColour,
                userFirstName: user.firstname,
                userLastName: user.lastname,
                userEmail: user.email
              }}
              companyTheme={theme}
              onAddFileToCanvas={(file) => this.handleAddFileToCanvas(file, strings)}
              onAddPageToCanvas={(file) => this.handleAddPageToCanvas(file, strings)}
              onBookmarkAll={this.handleBookmarkAll}
              onBookmarkAllDelete={this.handleBookmarkAllDelete}
              onCopyToClipboard={(evt) => this.handleCopyToClipboard(evt, strings)}
              onCreateStory={userCapabilities.canCreateStory && this.handleCreateStory}
              onOpenStory={this.handleOpenStory}
              onOpenFileDetails={this.handleFileOpen}
              onCloseClick={this.handleCloseClick}
              onDockToggleClick={this.handleDockToggleClick}
              onHeaderItemClick={this.handleHeaderItemClick}
              onTabClick={this.handleTabClick}
              onTabCloseClick={this.handleTabCloseClick}
              onUpdateFile={this.handleUpdateFile}
              onShareFiles={this.handleShareFiles}
              onPdfAnchorClick={this.handlePdfAnchorClick}
              strings={strings}
              className={activeFile.fullScreen && styles.fullScreen}
              {...broadcastProps}
            />

            {this.state.showFileDetails && <FileDetailsModal
              {...this.state.currentFile}
              {... {
                authString,
                canCreateCustomFileDetails,
                fileSettings,
                fileTag,
                strings
              }}
              canEdit
              isVisible
              onAddTag={this.handleCreateTag}
              onAddTagToFile={this.handleAddTagFile}
              onTagChange={this.handleTagChange}
              onTagDeleteClick={this.handleTagDelete}
              onClose={this.handleFileDetailsClose}
            />}
          </div>
        </CSSTransition>}
      </TransitionGroup>
    );
  }
});
