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
 */

import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';

import {
  Route,
  Switch
} from 'react-router-dom';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt } from 'redux/modules/prompts';
import {
  toggleEntityAttribute,
  updateEntity
} from 'redux/modules/entities/entities';
import {
  toggleUserFollow
} from 'redux/modules/user';
import {
  addTag,
  addTagToFile,
  removeTagToFile,
  searchTags,
} from 'redux/modules/tag';
import {
  setData as setShareData
} from 'redux/modules/share';
import {
  setStoryOption
} from 'redux/modules/settings';
import {
  checkStatus,

  like,
  subscribe,

  addBookmark,
  deleteBookmark,

  archive,
  addFlag,
  removeFlag,
  loadHistory,

  addComment,
  deleteComment,

  setScrollTo
} from 'redux/modules/story/story';
import {
  addFiles as addFilesToViewer
} from 'redux/modules/viewer';
import {
  setData as setPromoteData,
} from 'redux/modules/story/promote';

import { mapComments } from 'redux/modules/entities/helpers';
import { loadStories, loadChannels } from 'redux/modules/content';

import Dialog from 'components/Dialog/Dialog';
import FileList from 'components/FileList/FileList';
import List from 'components/List/List';
import Loader from 'components/Loader/Loader';

import StoryDescription from 'components/StoryDescription/StoryDescription';
import StoryHeader from 'components/StoryHeader/StoryHeader';

import StoryAuthor from 'components/StoryDetail/StoryAuthor';
import StoryComments from 'components/StoryDetail/StoryComments';
import StoryLocations from 'components/StoryDetail/StoryLocations';
import StoryMeetings from 'components/StoryDetail/StoryMeetings';
import StoryNotes from 'components/StoryDetail/StoryNotes';
import StoryTags from 'components/StoryDetail/StoryTags';

import StoryFlagModal from 'components/StoryDetail/StoryFlagModal';
import StoryFlagListModal from 'components/StoryDetail/StoryFlagListModal';
import StoryHistoryModal from 'components/StoryDetail/StoryHistoryModal';
import StoryLocationsModal from 'components/StoryDetail/StoryLocationsModal';
import StoryMeetingModal from 'components/StoryDetail/StoryMeetingModal';
import StoryPromoteModal from 'components/StoryDetail/StoryPromoteModal';
import FileDetailsModal from 'components/FileDetailsModal/FileDetailsModal';

const messages = defineMessages({
  description: { id: 'description', defaultMessage: 'Description' },
  files: { id: 'files', defaultMessage: 'Files' },
  comments: { id: 'comments', defaultMessage: 'Comments' },
  tags: { id: 'tags', defaultMessage: 'Tags' },

  confirmArchive: { id: 'confirm-archive', defaultMessage: 'Confirm Archive' },
  confirmArchiveMessage: { id: 'confirm-archive-message', defaultMessage: 'Are you sure you want to archive this {story}?' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  archive: { id: 'archive', defaultMessage: 'Archive' },

  personalNotes: { id: 'personal-notes', defaultMessage: 'Personal Notes' },
  personalNotesDescription: { id: 'personal-notes-description', defaultMessage: 'Add a Personal Note to this {story} with relevant infomation that only you can see.' },
  addNote: { id: 'add-note', defaultMessage: 'Add Note' },
  locationTitle: { id: 'location-protected-story', defaultMessage: 'Location Protected {story}' },
  locationDescription: { id: 'location-protected-story-description', defaultMessage: 'This {story} has a restricted viewing area, you are currently located inside a geo-fence that protects this content. You may not be able to access this {story} from another location.' },
  meetings: { id: 'meetings', defaultMessage: '{meetings}' },
  meetingsDescription: { id: 'story-meetings-description', defaultMessage: 'This {story} has a related {meeting}, click the {meeting} to view more details or view all upcoming {meetings}.' },
  meetingInfo: { id: 'meeting-info', defaultMessage: '{meeting} Info' },
  allDay: { id: 'all-day', defaultMessage: 'All day' },
  relatedStoriesTitle: { id: 'related-stories', defaultMessage: 'Related {stories}' },
  userFollowDescription: { id: 'user-follow-description', defaultMessage: 'To get notified when this user uploads new content or makes changes to existing content you can follow them.' },

  // StoryComments
  commentsEmptyHeading: { id: 'comments-empty-heading', defaultMessage: 'No comments' },
  commentsEmptyMessage: { id: 'comments-empty-message', defaultMessage: 'Be the first to comment on this {story}' },
  writeAComment: { id: 'write-a-comment', defaultMessage: 'Write a comment' },
  commentInputNote: { id: 'shift-enter-for-line-break', defaultMessage: 'Shift + Enter for line break' },
  replyText: { id: 'reply', defaultMessage: 'Reply' },
  replyPlaceholderText: { id: 'reply-placeholder', defaultMessage: 'Write a reply...' },
  deleteCommentConfirm: { id: 'delete-comment-confirm', defaultMessage: 'Are you sure you want to delete this comment?' },
  deleteCommentRepliesConfirm: { id: 'delete-comment-replies-confirm', defaultMessage: 'Are you sure you want to delete this comment and all replies?' },
  cannotArchiveFlaggedStory: { id: 'cannot-archive-flagged-story', defaultMessage: 'Cannot archive flagged {stories}' },

  // File details modal
  fileDetails: { id: 'file-details', defaultMessage: 'File Details' },
  close: { id: 'close', defaultMessage: 'Close' },
  customMetadata: { id: 'custom-metadata', defaultMessage: 'Custom Metadata' },
  customisableLabel: { id: 'customisable-label', defaultMessage: 'Customisable Label' },
  expiry: { id: 'expiry', defaultMessage: 'Expiry' },
  shareStatus: { id: 'share-status', defaultMessage: 'Share Status' },
  optional: { id: 'optional', defaultMessage: 'Optional' },
  blocked: { id: 'blocked', defaultMessage: 'Blocked' },
  mandatory: { id: 'mandatory', defaultMessage: 'Mandatory' },
  fileType: { id: 'file-type', defaultMessage: 'File Type' },
  fileSize: { id: 'file-size', defaultMessage: 'File Size' },
  dateAdded: { id: 'date-added', defaultMessage: 'Date Added' },
  dateModified: { id: 'date-modified', defaultMessage: 'Date Modified' },
  tagDescription: { id: 'add-tag-description', defaultMessage: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.' },
  newTag: { id: 'new-tag', defaultMessage: 'New tag' },
  suggestions: { id: 'suggestions', defaultMessage: 'Suggestions' },
  noRelatedTags: { id: 'no-related-tags', defaultMessage: 'No Related Tags' },
});

function mapStateToProps(state) {
  const { entities, chat, settings, tag, content } = state;
  const { pendingComment } = state.story;
  const { lastChannel, lastRoute } = content;

  // merge story store with entities
  const story = {
    ...state.story,
    ...entities.stories[state.story.permId]
  };

  // Author
  const author = entities.users[story.author];
  const tab = entities.tabs[story.tab];

  // Reference to Primary Channel
  const channels = story.channels.map(id => story.channelsById[id]);  // using story channels for 'alias'
  const primaryChannel = channels.filter(c => !c.alias)[0];

  // Map normalized comments to array
  const comments = mapComments(uniq(story.comments), entities, pendingComment);

  // Map events to array
  const events = state.story.events.map(id => {
    const userTz = settings.user.tz;
    return { ...entities.events[id], userTz: userTz };
  });

  // Map flags to array
  const flags = state.story.flags.map(id => story.flagsById[id]);

  // Files
  const files = story.files.map(id => {
    const file = { ...entities.files[id] };

    // Force disable showCheckbox for some file types
    if (file.category === 'web') {
      file.showCheckbox = false;  // eslint-disable-line
    }

    // Do not show folders that are not syncing
    if (file.category === 'folder' && file.status !== 'syncing') {
      file.deleted = true;  // eslint-disable-line
    }

    return file;
  });

  // Story not currently returning a 'processing' status
  // if files have a 'syncing' status
  const filesProcessing = files.findIndex(f => f.status === 'processing' || f.status === 'syncing') > -1;
  let status = story.status;
  if (filesProcessing && status !== 'deleted' && status !== 'processing') {
    status = 'processing';
  }

  // Story Description baseUrl testing
  // points to a custom btca file
  const storyDescriptionBaseUrl = settings.company.templatePath + 'story-description';

  // Exclude history prop due to react-router passing in history
  const {
    history,
    ...storyWithExcludedHistory
  } = story;

  return {
    ...storyWithExcludedHistory,
    author,
    status,
    channels,
    comments,
    tab,
    events,
    storyHistory: story.history,
    tabs: entities.tabs,

    fileTag: tag,
    // Map normalized entities to arrays
    files: files.filter(obj => !obj.deleted),
    flags: flags.filter(obj => !obj.deleted),
    metadata: state.story.metadata.map(id => story.metadataById[id]),
    notes: state.story.notes.map(id => story.notesById[id]),

    primaryChannel,
    storySettings: settings.storySettings,
    userSettings: settings.user,
    lastChannel: lastChannel,
    lastRoute: lastRoute,
    storiesLimit: entities.channels[lastChannel] && entities.channels[lastChannel].stories && entities.channels[lastChannel].stories.length,

    audioSupported: chat.audioSupported,
    videoSupported: chat.videoSupported,
    isPromoteModalVisible: state.promote.isVisible,

    storyDescriptionBaseUrl: storyDescriptionBaseUrl,

    // Is user currently in China (required for Google Maps)
    isChina: state.auth.loginSettings.countryCode === 'CN'
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    setStoryOption,

    setShareData,

    setPromoteData,

    checkStatus,

    like,
    subscribe,
    toggleUserFollow,

    addBookmark,
    deleteBookmark,

    archive,
    addFlag,
    removeFlag,
    loadHistory,
    loadStories,
    loadChannels,

    addComment,
    deleteComment,

    setScrollTo,

    toggleEntityAttribute,
    updateEntity,

    addFilesToViewer,
    createPrompt,

    addTag,
    addTagToFile,
    removeTagToFile,
    searchTags,
  })
)
export default class StoryDetail extends Component {
  static propTypes = {
    name: PropTypes.string,
    thumbnail: PropTypes.string,
    thumbnailSmall: PropTypes.string,
    colour: PropTypes.string,
    excerpt: PropTypes.string,
    message: PropTypes.string,
    status: PropTypes.string,
    updated: PropTypes.number,

    author: PropTypes.object,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
    readCount: PropTypes.number,
    sharing: PropTypes.bool,

    expiresAt: PropTypes.number,
    expiresAtTz: PropTypes.string,
    publishAt: PropTypes.number,
    publishAtTz: PropTypes.string,

    badgeTitle: PropTypes.string,
    badgeColour: PropTypes.string,

    featuredImage: PropTypes.string,
    featuredStartsAt: PropTypes.number,
    featuredExpiresAt: PropTypes.number,
    featuredAtTz: PropTypes.string,

    comments: PropTypes.array,
    channels: PropTypes.array,
    events: PropTypes.array,  // meetings
    files: PropTypes.array,
    flags: PropTypes.array,
    geolocations: PropTypes.array,
    metadata: PropTypes.array,
    subscribers: PropTypes.array,
    tags: PropTypes.array,

    isBookmark: PropTypes.bool,
    isFeed: PropTypes.bool,
    isLiked: PropTypes.bool,
    isProtected: PropTypes.bool,
    isPubliclyAccessible: PropTypes.bool,
    isRead: PropTypes.bool,
    isSubscribed: PropTypes.bool,

    relatedStories: PropTypes.array,

    onAnchorClick: PropTypes.func.isRequired,
    onCallClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onFilesClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    relatedStories: []
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      headerHeight: 250,

      selectFileList: false,

      archiveConfirmVisible: false,

      flagModalVisible: false,
      flagListModalVisible: false,
      historyModalVisible: false,
      locationModalVisible: false,

      // StoryMeetingModal
      showFileDetailsModel: false,
      selectedFile: null,

      bodyLoading: true,
    };

    // Used to calculate if Story is currently Featured
    this.timeNow = parseInt(Date.now() / 1000, 10);

    autobind(this);
    this.handleDelayedScroll = debounce(this.handleDelayedScroll.bind(this), 6);

    // refs
    this.container = null;
  }

  componentDidMount() {
    // Story/Files processing
    if (this.props.status === 'processing' && this.props.status !== 'deleted') {
      this.startStatusTimer();
    }

    // Open Share modal if passed in route
    if (this.props.location.pathname.indexOf('/share') > -1) {
      this.openStoryShare();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const isModal = this.props.location.state && this.props.location.state.modal;

    // Story has been archived, update URL & reload content
    if (nextProps.status === 'deleted' && this.props.status !== 'deleted') {
      this.props.history.replace(this.props.location.pathname + '?rev=' + this.props.id, { modal: isModal });
      if (this.props.lastChannel) {
        this.props.loadStories(this.props.lastChannel, 0, undefined, this.props.storiesLimit);
      }

      const tabId = this.props.tab.id;
      if (tabId) {
        this.props.loadChannels(tabId);
      }
    }

    // Story description has recieved a new offsetTop
    if (nextProps.storyDescriptionScrollTo !== null) {
      this.scrollTo(nextProps.storyDescriptionScrollTo);
    }

    if ((nextProps.storyDescriptionHeight !== null && nextProps.message.length) || nextProps.message.length === 0) {
      this.setState({ bodyLoading: false });
    }

    // Update current file options from modal
    if (!isEqual(nextProps.files, this.props.files) && this.state.selectedFile) {
      const newFile = nextProps.files.find(item => item.id === this.state.selectedFile.id);
      this.setState({
        // showFileDetailsModel: true,
        selectedFile: { ...this.state.selectedFile, ...newFile }
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
    // State changed
      !isEqual(this.state, nextState) ||
        !isEqual(this.props.storySettings, nextProps.storySettings) ||
        !isEqual(this.props.location, nextProps.location) ||
        !isEqual(this.props.author, nextProps.author) ||
        !isEqual(this.props.fileTag, nextProps.fileTag) ||

        // Attributes expected to change
        nextProps.isBookmark !== this.props.isBookmark ||
        nextProps.isLiked !== this.props.isLiked ||
        nextProps.isSubscribed !== this.props.isSubscribed ||
        nextProps.loading !== this.props.loading ||
        nextProps.status !== this.props.status ||
        nextProps.storyDescriptionHeight !== this.props.storyDescriptionHeight ||

        // Arrays expected to change
        !isEqual(nextProps.comments, this.props.comments) ||
        !isEqual(nextProps.files, this.props.files) ||
        !isEqual(nextProps.files.tags, this.props.files.tags) ||
        !isEqual(nextProps.flags, this.props.flags)
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    // Story is processing
    if (this.props.status === 'processing' && prevProps.status !== 'processing') {
      this.startStatusTimer();

    // Story stopped processing
    } else if (this.props.status !== 'processing' && prevProps.status === 'processing') {
      this.stopStatusTimer();
    }

    if (this.props.storyDescriptionHeight > 0 || !this.props.message.length) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ bodyLoading: false });
    }
  }

  componentWillUnmount() {
    // Clear selected on files
    this.selectAllFiles(false);

    // Clear status timer
    this.stopStatusTimer();
  }

  selectAllFiles(isSelected) {
    this.props.files.forEach(f => {
      if (isSelected && f.isSelected === false || !isSelected && f.isSelected === true) {
        this.props.updateEntity('files', f.id, { isSelected: isSelected });
      }
    });
  }

  startStatusTimer() {
    if (this.props.id && !this.statusTimer) {
      this.statusTimer = window.setInterval(this.props.checkStatus, 5000, this.props.id);
    }
  }

  stopStatusTimer() {
    if (this.statusTimer) {
      window.clearTimeout(this.statusTimer);
      this.statusTimer = undefined;
    }
  }

  scrollTo(offsetTop) {
    if (offsetTop >= 0) {
      this.container.scrollTop = offsetTop;
      this.props.setScrollTo(null);
    }
  }

  openStoryShare() {
    this.props.setShareData({
      id: this.props.id,
      permId: this.props.permId,
      isVisible: true,
      name: this.props.name,
      showMoreOptions: true, // go to advance share when enabled
      files: this.props.files,
      url: this.props.sharingPublicURL,
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.props.sharingPublic,
      sharingFacebookDescription: this.props.sharingFacebookDescription,
      sharingLinkedinDescription: this.props.sharingLinkedinDescription,
      sharingTwitterDescription: this.props.sharingTwitterDescription,
    });
  }

  toggleArchiveDialog() {
    this.setState({ archiveConfirmVisible: !this.state.archiveConfirmVisible });
  }

  toggleFlagModel() {
    this.setState({ flagModalVisible: !this.state.flagModalVisible });
  }

  toggleFlagListModel() {
    this.setState({ flagListModalVisible: !this.state.flagListModalVisible });
  }

  toggleHistoryModel() {
    this.setState({ historyModalVisible: !this.state.historyModalVisible });
  }

  toggleLocationsModel() {
    this.setState({ locationModalVisible: !this.state.locationModalVisible });
  }

  handleHistoryClick() {
    this.toggleHistoryModel();
  }

  handleFlagClick() {
    this.toggleFlagModel();
  }

  handleFlagListClick() {
    this.toggleFlagListModel();
  }

  handleArchiveClick() {
    this.toggleArchiveDialog();
  }

  handleLocationClick() {
    this.toggleLocationsModel();
  }

  handleFlagClear(event, storyFlagId, message) {
    this.props.removeFlag(this.props.id, storyFlagId, message);

    // Hide modal if clearing only flag
    if (this.props.flags.length === 1 || !storyFlagId) {
      this.setState({ flagListModalVisible: false });
    }
  }

  handleMeetingClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const isModal = this.props.location.state && this.props.location.state.modal;
    this.props.history.push(href, { modal: isModal });
  }

  handleCloseMeetingModal() {
    event.preventDefault();
    const { location } = this.props;
    const path = (location.pathname + location.search).replace(/(&|\/)meeting\/\d*/, '');
    const isModal = this.props.location.state && this.props.location.state.modal;
    this.props.history.push(path, { modal: isModal });
  }

  handlePromoteClick() {
    this.props.setPromoteData({
      id: this.props.id,
      isVisible: true,
      title: this.props.name,
    });
  }

  handleEditClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const isModal = this.props.location.state && this.props.location.state.modal;
    this.props.history.push(href, { modal: isModal });
  }

  handleShareClick(event) {
    event.preventDefault();
    const isModal = this.props.location.state && this.props.location.state.modal;
    this.props.history.push(this.props.match.url + '/share', { modal: isModal });
    this.openStoryShare();
  }

  handleLinkedinShareClick(event) {
    event.preventDefault();
    this.handleSocialClick('linkedin');
  }

  handleTwitterShareClick(event) {
    event.preventDefault();
    this.handleSocialClick('twitter');
  }

  handleFacebookShareClick(event) {
    event.preventDefault();
    this.handleSocialClick('facebook');
  }

  handleSocialClick(type) {
    // Create modal popup
    let height = 230;
    let width = 520;
    let url = '';
    const tmpURL = this.props.sharingPublicURL;

    switch (type) {
      case 'facebook':
        url = 'https://www.facebook.com/sharer.php?m2w&u=' + tmpURL + '&description=' + this.props.sharingFacebookDescription;
        break;
      case 'linkedin':
        url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + tmpURL + '&summary=' + this.props.sharingLinkedinDescription;
        width = 550;
        height = 477;
        break;
      case 'twitter':
        url = 'https://twitter.com/share?text=' + this.props.sharingTwitterDescription + '&url=' + tmpURL;
        height = 620;
        break;
      default:
        break;
    }

    const winName = 'Share';
    const top = ((screen.height - height) / 2) - 50;
    const left = (screen.width - width) / 2;
    const popupParams = 'resizable,scrollbars,status,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left;

    window.share._popup = window.open(url, winName, popupParams);  // eslint-disable-line
    window.share._popup.focus();  // eslint-disable-line
  }

  handleExternalAnchorClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href) {
      const newWindow = window.open(href);
      newWindow.opener = null;
    }
  }

  handleScroll(event) {
    // Only trigger if main container scrolled
    if (event.target === this.container) {
      event.persist();
      this.handleDelayedScroll(event);
    }
  }

  handleDelayedScroll(event) {
    const scrollTop = event.target.scrollTop;
    const maxScroll = 190;

    const minHeaderHeight = 60;
    //const minTitleSize = 1.25;

    let headerHeight = 250;
    let infoOpacity = 1;
    let titleOpacity = 1;

    // Adjust header height
    if (scrollTop > 0 && scrollTop < maxScroll) {
      headerHeight = headerHeight - scrollTop;  // eslint-disable-line

      // Adjust info opacity
      if (scrollTop > 10) {
        infoOpacity = (1 - (scrollTop / 100)).toFixed(1);

        if (infoOpacity <= 0) {
          titleOpacity = -infoOpacity;
        } else {
          titleOpacity = infoOpacity;
        }
      }

    // Max header height reached
    } else if (scrollTop >= maxScroll) {
      headerHeight = minHeaderHeight;
      infoOpacity = 0;
      titleOpacity = 1;
    }

    // Don't allow a negative opacity
    if (infoOpacity < 0) {
      infoOpacity = 0;
    }

    this.setState({
      headerHeight: headerHeight,
      infoOpacity: infoOpacity,
      titleOpacity: titleOpacity,
    });
  }

  handleSectionHeadingClick(event) {
    const id = event.currentTarget.dataset.id;
    const storyOption = id + 'Collapsed';
    this.props.setStoryOption(storyOption, !this.props.storySettings[storyOption]);
  }

  handleBookmarkClick(event) {
    event.preventDefault();
    event.stopPropagation();

    // Delete Bookmark
    if (this.props.isBookmark && this.props.bookmarkId) {
      this.props.deleteBookmark(this.props.bookmarkId, this.props.permId);

    // Add Bookmark
    } else if (!this.props.isBookmark) {
      this.props.addBookmark(this.props.name, this.props.permId);
    }
  }

  handleLikeClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.like(this.props.permId, !this.props.isLiked);
  }

  handleSubscribeClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.subscribe(this.props.permId, !this.props.isSubscribed);
  }

  handleArchiveConfirm(event) {
    event.preventDefault();

    this.setState({ archiveConfirmVisible: false });
    this.props.archive(this.props.id, this.props.permId);
  }

  handleFlagConfirm(event, data) {
    event.preventDefault();
    this.setState({ flagModalVisible: false });
    this.props.addFlag(this.props.id, data.selectedValue, data.textareaValue);
  }

  handleHistoryLoad(offset) {
    this.props.loadHistory(this.props.permId, offset);
  }

  handleFilesSelectToggle() {
    this.setState({ selectFileList: !this.state.selectFileList });
  }

  handleFilesGridToggle() {
    this.props.setStoryOption('fileGrid', !this.props.storySettings.fileGrid);
  }

  handleDownloadAllFilesClick() {
    const url = window.BTC.BTCAPI + '/story/downloadFiles?permId=' + this.props.permId + '&access_token=' + localStorage.getItem('BTCTK_A');
    const newWindow = window.open(url, '_self');
    newWindow.opener = null;
  }

  handleViewAllFilesClick() {
    const fileIds = this.props.files.map(f => f.id);
    this.props.addFilesToViewer(fileIds);
    this.selectAllFiles(false);
    this.setState({ selectFileList: false });
  }

  handleDownloadSelectedClick() {
    const selectedIds = [];
    for (const file of this.props.files) {
      if (file.isSelected && file.downloadUrl && file.shareStatus !== 'blocked') {
        selectedIds.push(file.id);
      }
    }

    // Initiate download if at least 1 valid file is selected
    if (selectedIds.length) {
      const url = window.BTC.BTCAPI + '/story/downloadFiles?permId=' + this.props.permId + '&fileIds=' + JSON.stringify(selectedIds) + '&access_token=' + localStorage.getItem('BTCTK_A');
      const newWindow = window.open(url, '_self');
      newWindow.opener = null;
    }
  }

  handleViewSelectedClick() {
    const selectedFiles = [];
    for (const file of this.props.files) {
      if (file.isSelected) {
        selectedFiles.push(file.id);
      }
    }

    // Open files in Viewer
    if (selectedFiles.length) {
      this.props.addFilesToViewer(selectedFiles);
      this.selectAllFiles(false);
      this.setState({ selectFileList: false });
    }
  }

  handleDownloadFileClick(event, downloadUrl) {
    const authString = this.context.settings.authString;
    if (downloadUrl) {
      const newWindow = window.open(downloadUrl + authString);
      newWindow.opener = null;
    }
  }

  handleFileClick(event, context) {
    event.preventDefault();
    const id = context.props.id;
    const file = this.props.files.find(f => f.id === id);

    // Deny event on folders and processing/syncing items
    if (file.category === 'folder' ||
        file.status === 'syncing' ||
        file.status === 'processing') {
      return;
    }

    // Toggle isSelected attribute on file
    if (this.state.selectFileList) {
      this.props.toggleEntityAttribute('files', id, 'isSelected');

    // Open file
    } else {
      this.props.onFileClick(event, context);
    }
  }

  handleFileInfoClick(event, context) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      showFileDetailsModel: true,
      selectedFile: context.props
    });
  }

  handleAddComment(parentId, message) {
    /**
     * This should match the comment data returned from:
     * /story/get
     * /story/add_comment
     */
    const data = {
      message: message,
      time: parseInt((new Date().getTime() / 1000).toFixed(0), 10),
      canDelete: false,
      parentId: parentId,
      status: 'pending',
      author: this.context.settings.user,
      storyId: this.props.id,
      storyPermId: this.props.permId
    };

    // Create action to add comment
    this.props.addComment(data);
  }

  handleDeleteComment(id, context) {
    let totalComments = 1;
    if (!context.parentId) {
      totalComments += context.replies.filter(item => item.status !== 'deleted').length;
    }
    this.props.deleteComment(context.id, this.props.permId, totalComments);
  }

  handleAuthorFollowClick(event) {
    event.preventDefault();
    this.props.toggleUserFollow(this.props.author.id, !this.props.author.isFollowed);
  }

  handleAddNoteClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const isModal = this.props.location.state && this.props.location.state.modal;

    // minimum story data to link note
    const story = {
      id: this.props.id,
      permId: this.props.permId,
      name: this.props.name,
      thumbnail: this.props.thumbnail,
      author: this.props.author,
      colour: this.props.colour,
      type: 'story',
    };

    this.props.history.push({
      pathname: href,
      query: null,
      state: { story: story, modal: isModal }
    });
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
    this.setState({ showFileDetailsModel: false });
  }

  renderRoute(RouteComponent, props) {
    return (
      <RouteComponent
        {...props}
        onClose={this.handleCloseMeetingModal}
      />
    );
  }

  handleArchiveError() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, { ...naming });
    this.props.createPrompt({
      id: 'cannot-archive-flagged-story',
      type: 'error',
      title: 'Error',
      message: strings.cannotArchiveFlaggedStory,
      dismissible: true,
      autoDismiss: 5
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      fileSettings,
      naming,
      userCapabilities,
      user
    } = this.context.settings;
    const {
      canComment,
      canFlagStory,
      canLikeStory,
      canPromote,
      isAdmin,
      hasDeviceShare,
      hasShare,
      canStorySubscribe,
      hasMeetings,
      hasNotes,
      hasVideoChat,
      hasTextChat,
      showStoryAuthor,
      canCreateCustomFileDetails
    } = userCapabilities;
    const {
      author,
      canEdit,
      comments,
      events,
      files,
      fileTag,
      featuredExpiresAt,
      featuredStartsAt,
      geolocations,
      storyHistory,
      message,
      notes,
      primaryChannel,
      tags,
      isFeed,
      isProtected,
      relatedStories,
      storyDescriptionHeight
    } = this.props;
    const isGrid = this.props.storySettings.fileGrid;
    const isRevision = this.props.status === 'deleted';
    const styles = require('./StoryDetail.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryDetail: true
    });

    // Translations
    // Set meetings as fallback
    const strings = generateStrings(messages, formatMessage, { meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    // User is viewing Story?
    const isOwnStory = author ? (author.id === user.id) : null;

    // Show Comments?
    let showComments = true;

    // Feed does not have comments
    // Revision without commments
    // User unable comment and there are no comments
    if (isFeed || (isRevision || !canComment) && !comments.length) {
      showComments = false;
    }

    // Featured Story?
    const isFeatured = this.timeNow > featuredStartsAt && this.timeNow < featuredExpiresAt;

    // Edit URL (remove trailing slash if it exists)
    const editUrl = this.props.location.pathname.replace(/\/$/, '') + '/edit' + this.props.location.search;

    // Call supported?
    const canVideoChat = hasVideoChat && (this.props.audioSupported || this.props.videoSupported);

    // Show Notes section?
    let showNotes = false;
    if (hasNotes && (!isRevision || isRevision && notes.length > 0)) {
      showNotes = true;
    }

    // Available sections
    const sections = [{
      id: 'description',
      name: strings.description,
      enabled: message.length > 0,
      collapsed: this.props.storySettings.descriptionCollapsed,
      component: (
        <StoryDescription
          baseUrl={this.props.storyDescriptionBaseUrl}
          height={storyDescriptionHeight}
          minHeight={10}  // height when loading
          className={styles.storyDescription}
        />)
    }, {
      id: 'files',
      name: strings.files,
      enabled: files.length > 0,
      collapsed: this.props.storySettings.filesCollapsed,
      component: (
        <div className={styles.storyFiles}>
          <FileList
            list={files}
            grid={isGrid}
            showCheckbox={this.state.selectFileList}
            thumbSize={!isGrid ? 'small' : 'large'}
            showHeader
            showThumb
            showInfo
            showDownload={this.props.sharing}
            onSelectToggle={this.handleFilesSelectToggle}
            onGridToggleClick={this.handleFilesGridToggle}
            onDownloadAllClick={!isProtected ? this.handleDownloadAllFilesClick : null}
            onViewAllClick={this.handleViewAllFilesClick}
            onDownloadSelectedClick={!isProtected ? this.handleDownloadSelectedClick : null}
            onViewSelectedClick={this.handleViewSelectedClick}
            onDownloadFileClick={this.handleDownloadFileClick}
            onFileClick={this.handleFileClick}
            authString={this.context.settings.authString}
            onInfoIconClick={this.handleFileInfoClick}
            onTagMoreClick={this.handleFileInfoClick}
            fileSettings={fileSettings}
          />
        </div>)
    }, {
      id: 'comments',
      name: strings.comments,
      enabled: showComments,
      collapsed: this.props.storySettings.commentsCollapsed,
      component: (
        <StoryComments
          user={this.context.settings.user}
          comments={comments}
          loading={!!this.props.pendingComment}
          readOnly={isRevision || !canComment}
          hasPeople={userCapabilities.hasPeople}
          strings={{
            emptyHeading: strings.commentsEmptyHeading,
            emptyMessage: strings.commentsEmptyMessage,
            writeAComment: strings.writeAComment,
            commentInputNote: strings.commentInputNote,
            reply: strings.replyText,
            replyPlaceholder: strings.replyPlaceholderText,
            deleteConfirm: strings.deleteCommentConfirm,
            deleteRepliesConfirm: strings.deleteCommentRepliesConfirm,
            cancel: strings.cancel,
            delete: strings.delete
          }}
          onUserClick={this.props.onAnchorClick}
          onAddComment={this.handleAddComment}
          onDeleteComment={this.handleDeleteComment}
        />)
    }, {
      id: 'tags',
      name: strings.tags,
      enabled: tags.length > 0,
      collapsed: this.props.storySettings.tagsCollapsed,
      component: (
        <StoryTags
          tags={tags}
          onItemClick={this.props.onAnchorClick}
        />)
    }];

    const filteredSections = sections.filter(s => ((s.id === 'description' && message.length) || s.id !== 'description'));

    return (
      <article
        ref={(c) => { this.container = c; }}
        className={classes}
        onScroll={this.handleScroll}
      >
        <Helmet>
          <title>{this.props.name}</title>
        </Helmet>
        <StoryHeader
          // Attributes
          name={this.props.name}
          author={author}
          tab={this.props.tab}
          channel={primaryChannel}
          updated={this.props.updated}
          isBookmark={this.props.isBookmark}
          isFeatured={isFeatured}
          isFeed={isFeed}
          isLiked={this.props.isLiked}
          isRevision={isRevision}
          isSubscribed={this.props.isSubscribed}
          rating={this.props.rating}
          ratingCount={this.props.ratingCount}
          sharing={this.props.sharing}
          sharingPublic={this.props.sharingPublic}
          history={storyHistory}
          flags={this.props.flags}

          thumbnailSmall={this.props.thumbnailSmall}
          colour={this.props.colour}

          canDelete={this.props.canDelete}
          canEdit={this.props.canEdit}
          canFlag={canFlagStory && !isOwnStory}
          canLike={canLikeStory}
          canShare={hasShare}
          canSocialShare={hasDeviceShare}
          canSubscribe={primaryChannel && !primaryChannel.isSubscribed && canStorySubscribe}
          canPromote={canPromote}

          editUrl={editUrl}
          authString={this.context.settings.authString}

          // Events
          onAnchorClick={this.props.onAnchorClick}
          onCloseClick={this.props.onCloseClick}
          onLikeClick={this.handleLikeClick}
          onShareClick={this.handleShareClick}
          onLinkedinShareClick={this.handleLinkedinShareClick}
          onTwitterShareClick={this.handleTwitterShareClick}
          onFacebookShareClick={this.handleFacebookShareClick}
          onEditClick={this.handleEditClick}
          onBookmarkClick={this.handleBookmarkClick}
          onSubscribeClick={this.handleSubscribeClick}
          onHistoryClick={this.handleHistoryClick}
          onFlagClick={this.handleFlagClick}
          onFlagListClick={this.handleFlagListClick}
          onArchiveClick={this.handleArchiveClick}
          onPromoteClick={this.handlePromoteClick}
          onArchiveError={this.handleArchiveError}

          // Scroll animation
          height={this.state.headerHeight}
          infoOpacity={this.state.infoOpacity}
          titleOpacity={this.state.titleOpacity}

          theme={this.context.settings.theme}
          className={styles.storyHeader}
          showStoryAuthor={showStoryAuthor}
        />
        <div data-id="story-body" className={styles.storyBody} style={this.state.bodyLoading ? { opacity: '0' } : { opacity: '1' }}>
          {filteredSections.map(s => (s.enabled &&
            <section
              key={s.id}
              className={s.collapsed ? styles.detailCollapsed : styles.detailExpanded}
            >
              <h3 data-id={s.id} onClick={this.handleSectionHeadingClick}>{s.name}</h3>
              {s.component}
            </section>
          ))}

          {!isFeed && <div className={styles.grid}>
            <div className={styles.col}>
              {showStoryAuthor &&
              <StoryAuthor
                author={author}
                descriptionText={strings.userFollowDescription}
                isOwnStory={isOwnStory}
                showCall={author.id !== this.context.settings.user.id && canVideoChat}
                showChat={author.id !== this.context.settings.user.id && hasTextChat}
                showFollow={author.id !== this.context.settings.user.id}
                onAnchorClick={this.props.onAnchorClick}
                onCallClick={this.props.onCallClick}
                onFollowClick={this.handleAuthorFollowClick}
                onSocialItemClick={this.handleExternalAnchorClick}
              />}
              {geolocations.length > 0 && <StoryLocations
                title={strings.locationTitle}
                description={strings.locationDescription}
                locations={geolocations}
                isChina={this.props.isChina}
                onClick={this.handleLocationClick}
              />}
            </div>
            <div className={styles.col}>
              {showNotes && <StoryNotes
                notes={notes}
                strings={strings}
                onNoteClick={this.props.onAnchorClick}
                onAddNoteClick={!isRevision ? this.handleAddNoteClick : null}
              />}
              {(hasMeetings && events.length) > 0 &&
              <StoryMeetings
                title={strings.meetings}
                description={strings.meetingDescription}
                rootUrl={this.props.location.pathname + this.props.location.search}
                strings={strings}
                meetings={events}
                onMeetingClick={this.handleMeetingClick}
              />}
            </div>
          </div>}

          {relatedStories.length > 0 && <div className={styles.relatedStories}>
            <h4>{strings.relatedStoriesTitle}</h4>
            <List
              list={relatedStories}
              grid
              showThumb
              thumbSize="medium"
              onItemClick={this.props.onStoryClick}
            />
          </div>}
        </div>

        {this.state.bodyLoading && <Loader type="page" />}

        <Dialog
          title={strings.confirmArchive}
          message={strings.confirmArchiveMessage}
          isVisible={this.state.archiveConfirmVisible}
          cancelText={strings.cancel}
          confirmText={strings.archive}
          onCancel={this.handleArchiveClick}
          onConfirm={this.handleArchiveConfirm}
        />

        <StoryHistoryModal
          isVisible={this.state.historyModalVisible}
          loading={this.props.historyLoading}
          list={storyHistory}
          onClose={this.handleHistoryClick}
          onLoad={this.handleHistoryLoad}
          onUserClick={this.props.onAnchorClick}
        />

        <StoryFlagModal
          isVisible={this.state.flagModalVisible}
          onClose={this.handleFlagClick}
          onFlagClick={this.handleFlagConfirm}
        />

        <StoryFlagListModal
          isVisible={this.state.flagListModalVisible}
          flags={this.props.flags}
          canDelete={isAdmin || isOwnStory}
          onClose={this.handleFlagListClick}
          onFlagClear={this.handleFlagClear}
          onUserClick={this.props.onAnchorClick}
        />

        {geolocations.length > 0 && <StoryLocationsModal
          isVisible={this.state.locationModalVisible}
          onClose={this.handleLocationClick}
          locations={geolocations}
        />}

        <StoryPromoteModal />
        { this.state.showFileDetailsModel &&
          <FileDetailsModal
            {... {
              canCreateCustomFileDetails,
              canEdit,
              fileSettings,
              fileTag,
              strings,
              ...this.state.selectedFile
            }}
            isVisible
            onAddTag={this.handleCreateTag}
            onAddTagToFile={this.handleAddTagFile}
            onTagChange={this.handleTagChange}
            onTagDeleteClick={this.handleTagDelete}
            onClose={this.handleFileDetailsClose}
          />
        }

        <Switch>
          <Route
            exact
            path="/story/:storyId/meeting/:meetingId"
            render={(props) => this.renderRoute(StoryMeetingModal, { ...props, meetings: events, strings: strings })}
          />
        </Switch>
      </article>
    );
  }
}
