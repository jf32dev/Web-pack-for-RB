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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import moment from 'moment-timezone';
import difference from 'lodash/difference';
import uniqueId from 'lodash/uniqueId';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import he from 'he';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { Prompt } from 'react-router';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import loadImage from 'blueimp-load-image';

import Helmet from 'react-helmet';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt } from 'redux/modules/prompts';
import {
  save,

  setAttribute,
  setData,
  setDataAndNormalize,

  addChannel,
  deleteChannel,
  setPrimaryChannel,

  uploadThumbnail,
  uploadFeaturedImage,
  uploadFiles,
  uploadFileThumbnail,
  deleteUploadedFile,
  addFile,
  toggleFileAttribute,
  updateFile,
  updateFileConvertSettings,
  setFileOrder,
  filterFiles,
  setFileExpiryDefaults,

  addForm,

  addEvent,
  updateEvent,
  addTag,
  deleteTag,
  searchTags,
  clearTagSuggestions,
  addMetadata,
  updateMetadata,
  deleteMetadata,
  addLocation,
  deleteLocation,
  searchCrmCampaigns,

  addTagToCurrentFile,
  toggleFileEditModal,
  setFileEditData,
  saveCurrentFileData
} from 'redux/modules/story/story';
import { getTaggingGuidelines } from 'redux/modules/admin/stories';

import ChannelPickerModal from 'components/ChannelPickerModal/ChannelPickerModal';
import FilePickerModal from 'components/FilePickerModal/FilePickerModal';
import FormPickerModal from 'components/FormPickerModal/FormPickerModal';
import ImagePickerModal from 'components/ImagePickerModal/ImagePickerModal';
import RepoFilePickerModal from 'components/RepoFilePickerModal/RepoFilePickerModal';

import AccessDenied from 'components/AccessDenied/AccessDenied';
import Btn from 'components/Btn/Btn';

import StoryEditDetails from 'components/StoryEdit/StoryEditDetails';
import StoryEditDescription from 'components/StoryEdit/StoryEditDescription';
import StoryEditQuicklink from 'components/StoryEdit/StoryEditQuicklink';
import StoryEditFiles from 'components/StoryEdit/StoryEditFiles';
import StoryEditTags from 'components/StoryEdit/StoryEditTags';
import StoryEditTaggingGuidelines from 'components/StoryEdit/StoryEditTaggingGuidelines';
import StoryEditEvents from 'components/StoryEdit/StoryEditEvents';
import StoryEditOptions from 'components/StoryEdit/StoryEditOptions';
import StoryEditMetadata from 'components/StoryEdit/StoryEditMetadata';
import StoryEditMarketing from 'components/StoryEdit/StoryEditMarketing';

import StoryEditEventModal from 'components/StoryEdit/StoryEditEventModal';
import StoryEditCampaignModal from 'components/StoryEdit/StoryEditCampaignModal';
import StoryEditLocationModal from 'components/StoryEdit/StoryEditLocationModal';

const messages = defineMessages({
  close: { id: 'close', defaultMessage: 'Close' },
  unsavedChangesMessage: { id: 'unsaved-changes-message', defaultMessage: 'You have unsaved content, are you sure you want to leave?' },

  createStory: { id: 'create-new-story', defaultMessage: 'Create {story}' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  schedule: { id: 'schedule', defaultMessage: 'Schedule' },
  publish: { id: 'publish', defaultMessage: 'Publish' },
  draft: { id: 'draft', defaultMessage: 'Draft' },
  saving: { id: 'saving', defaultMessage: 'Saving' },

  details: { id: 'details', defaultMessage: 'Details' },
  description: { id: 'description', defaultMessage: 'Description' },
  type: { id: 'type', defaultMessage: 'Type' },
  files: { id: 'files', defaultMessage: 'Files' },
  tags: { id: 'tags', defaultMessage: 'Tags' },
  meetings: { id: 'meetings', defaultMessage: '{meetings}' },
  options: { id: 'options', defaultMessage: 'Options' },
  metadata: { id: 'metadata', defaultMessage: 'Metadata' },
  marketing: { id: 'marketing', defaultMessage: 'Marketing' },

  url: { id: 'url', defaultMessage: 'URL' },
  file: { id: 'file', defaultMessage: 'File' },
  form: { id: 'form', defaultMessage: 'Form' },
  backupUrl: { id: 'backup-url-optional', defaultMessage: 'Backup URL (Optional)' },
  urlDescription: { id: 'quicklink-url-description', defaultMessage: 'URL Quicklinks are published into {channels} alongside {stories} and are used to access websites immediately using the built-in web browser. A backup URL can be specified if needed, e.g. local and external addresses.' },
  fileDescription: { id: 'quicklink-file-description', defaultMessage: 'File Quicklinks are published into {channels} alongside {stories} and are used for quick access to documents using the tabbed file viewer.' },
  formDescription: { id: 'quicklink-form-description', defaultMessage: 'Form Quicklinks are published into {channels} alongside {stories} and are used for quick access to Forms using the tabbed file viewer.' },
  addForm: { id: 'add-form', defaultMessage: 'Add Form' },

  thumbnailDropzoneMessage: { id: 'story-thumbnail-dropzone-message', defaultMessage: 'Drop image to set {story} Cover Art' },
  featuredDropzoneMessage: { id: 'story-featured-dropzone-message', defaultMessage: 'Drop image to set {story} Feature Image' },
  fileDropzoneMessage: { id: 'story-file-dropzone-message', defaultMessage: 'Drop files to attach to {story}' },
  saveError: { id: 'save-error', defaultMessage: 'Save Error' },
  customMetadataIsRequiredBeforePublish: { id: 'custom-metadata-is-required-before-publish', defaultMessage: '"{custom_details_label}" is required before {story} can be published' },
  customMetadataInputboxIsRequiredBeforePublish: { id: 'inputbox-custom-metadata-is-required-before-publish', defaultMessage: '"{custom_details_label} text box" is required before {story} can be published' },
  headerTitle: { id: 'file-details', defaultMessage: 'File details' },
  save: { id: 'save', defaultMessage: 'Save' },
  fileName: { id: 'file-name', defaultMessage: 'File Name' },
  thumbnail: { id: 'thumbnail', defaultMessage: 'Thumbnail' },
  replaceThumbnail: { id: 'replace-thumbnail', defaultMessage: 'Replace Thumbnail' },
  fileOptions: { id: 'file-options', defaultMessage: 'File Options' },
  sharing: { id: 'sharing', defaultMessage: 'Sharing' },
  applyWatermark: { id: 'apply-watermark', defaultMessage: 'Apply Watermark' },
  customMetadata: { id: 'custom-metadata', defaultMessage: 'Custom Metadata' },
  customisableLabel: { id: 'customisable-label', defaultMessage: 'Customisable Label' },
  fileExpireDate: { id: 'file-expire-date', defaultMessage: 'File Expire Date' },
  shareStatus: { id: 'share-status', defaultMessage: 'Share Status' },
  allowHubShareDownloads: { id: 'allow-hubshare-downloads', defaultMessage: 'Allow HubShare Downloads' },
  optional: { id: 'optional', defaultMessage: 'Optional' },
  blocked: { id: 'blocked', defaultMessage: 'Blocked' },
  mandatory: { id: 'mandatory', defaultMessage: 'Mandatory' },
  links: { id: 'links', defaultMessage: 'Links' },
  presentationSettings: { id: 'presentation-settings', defaultMessage: 'Presentation Settings' },
  allowBroadcast: { id: 'allow-broadcast', defaultMessage: 'Allow Broadcast' },
  allowSlideReorder: { id: 'allow-slide-reorder', defaultMessage: 'Allow Slide Reorder' },
  allowSlideHiding: { id: 'allow-slide-hiding', defaultMessage: 'Allow Slide Hiding' },
  tagDescription: { id: 'tag-description-applying-tags', defaultMessage: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.', },
  newTag: { id: 'new-tag', defaultMessage: 'New tag' },
  suggestions: { id: 'suggestions', defaultMessage: 'Suggestions' },
  noRelatedTags: { id: 'no-related-tags', defaultMessage: 'No Related Tags' },
  noEditPermission: { id: 'no-edit-permission', defaultMessage: 'You do not have permission to edit' },
  fileExpireTime: { id: 'file-expire-time', defaultMessage: 'Schedule file expiry date & time' },
  fileExpireNote: { id: 'file-expire-note', defaultMessage: 'Set a date and time to expire this file' },
});

/** Strip and unescape HTML */
function stripHTML(str) {
  const text = str.replace(/(<([^>]+)>)/ig, '');
  return he.decode(text);
}

const NavItem = (props) => {
  const { rootUrl, id, name, active, onClick } = props;

  return (
    <li>
      <a href={rootUrl + '#' + id} title={name} onClick={onClick} className={active ? 'active' : null}>{name}</a>
    </li>
  );
};

function mapStateToProps(state) {
  const { entities, story, settings } = state;
  const defaults = settings.storyDefaults;

  // Default location for LocationEditor
  // default to Sydney
  const defaultLocation = {
    addr: settings.geolocation.address || 'Sydney NSW 2000, Australia',
    lat: settings.geolocation.latitude || -33.8715695,
    lng: settings.geolocation.longitude || 151.2057323,
    rad: 50000
  };

  // Use current user if no author
  const author = story.author ? entities.users[story.author] : entities.users[settings.user.id];

  // Default timezones
  const featuredAtTz = story.featuredAtTz ? story.featuredAtTz : settings.user.tz;
  const expiresAtTz = (story.expiresAtTz && story.expiresAtTz !== '0') ? story.expiresAtTz : settings.user.tz;
  const publishAtTz = story.publishAtTz ? story.publishAtTz : settings.user.tz;

  // Custom excerpt being used?
  const strippedMessage = stripHTML(story.message);
  let hasCustomExcerpt = true;
  if (strippedMessage.length && story.excerpt.length && !story.excerptChanged && strippedMessage.indexOf(story.excerpt) === 0) {
    hasCustomExcerpt = false;
  }

  // Default Channel
  const defaultChannel = [];

  const isNewStory = location.pathname.indexOf('/new') > -1;
  const isNewQuicklink = location.pathname.indexOf('quicklink') > -1;

  // Default is set
  if (defaults.channels && defaults.channels.id) {
    defaultChannel.push(defaults.channels);

  // No default set - use channel id from contentSettings.lastRoute if canPublishToChannel
  } else if ((isNewStory || isNewQuicklink || story.canPublishToChannel) && settings.contentSettings.lastRoute.indexOf('/channel/') > -1) {
    const channelId = settings.contentSettings.lastRoute.split('/channel/')[1];
    if (channelId && entities.channels[channelId]) {
      defaultChannel.push({
        ...entities.channels[channelId],
        alias: false
      });
    }
  }

  // Map channels to array
  // Note: Story Edit uses it's own channelsById and not entities.channels
  const channels = story.channels.map(id => story.channelsById[id]);

  // Map events to array
  const events = story.events.map(id => story.eventsById[id]);

  // Map files to array
  // Note: Story Edit uses it's own filesById and not entities.files
  let files = story.files.map(id => story.filesById[id]);

  // Ignore deleted files
  files = files.filter(f => !f.deleted);

  // Merge repo files in to folder
  const repoFiles = files.filter(f => f.repoFolderId);
  repoFiles.forEach(f => {
    // Is there a folder for the file?
    const folder = files.find(obj => obj.category === 'folder' && obj.repoDocumentId === f.repoFolderId);
    if (folder) {
      // Add file to folder contents
      if (folder.contents && folder.contents.length >= 0 && !folder.contents.find(c => c.id === f.id)) {
        folder.contents.push(f);
      } else {
        folder.contents = [f];
      }

      // Set hasFolder property so UI knows not to display
      f.hasFolder = true;  // eslint-disable-line
    }
  });

  // Filter files by search string
  let filteredFiles = files;
  if (story.fileFilter) {
    filteredFiles = files.filter(function(f) {
      return f.category.indexOf(story.fileFilter) > -1 || f.description.toLowerCase().indexOf(story.fileFilter) > -1 || f.filename.toLowerCase().indexOf(story.fileFilter) > -1;
    });
  }

  // Are any file currently uploading?
  const filesUploading = files.find(f => f.uploading);

  // Use topTags as suggestedTags if none set
  const suggestedTags = story.suggestedTags.length ? story.suggestedTags : defaults.topTags;

  // Remove tags from suggestedTags
  const filteredTags = difference(suggestedTags, story.tags);

  // Fix Quicklink type - update API?
  let quicklinkType = story.quicklinkType;
  if (story.isQuickfile && quicklinkType === 'url') {
    quicklinkType = (files.length && files[0].category === 'form') ? 'form' : 'file';
  }

  // Prepare MetadataSettings for Story. Remove USER & any category without properties
  let metadataCategories = state.settings.metadata.categories.filter(obj => obj.id !== 3);
  metadataCategories = metadataCategories.filter(function (obj) {
    const tmpObj = obj;
    tmpObj.propertyTypes = tmpObj.propertyTypes.filter(function(prop) {
      return !prop.isPredefined || (prop.isPredefined && prop.predefined.length > 0);
    });
    return tmpObj.propertyTypes.length;
  });

  return {
    ...story,
    author: author,
    featuredAtTz: featuredAtTz,
    expiresAtTz: expiresAtTz,
    publishAtTz: publishAtTz,

    defaultChannel: defaultChannel,
    channels: channels.filter(obj => !obj.deleted),   // filter deleted
    events: events.filter(obj => !obj.deleted),       // filter deleted
    files: files,
    fileSettings: settings.fileSettings,
    metadata: story.metadata.map(id => story.metadataById[id]),
    metadataSettings: {
      ...state.settings.metadata,
      categories: metadataCategories
    },

    quicklinkType: quicklinkType,
    filteredFiles: filteredFiles.filter(obj => !obj.deleted),  // search filter

    suggestedTags: filteredTags,
    defaultLocation: defaultLocation,
    hasCustomExcerpt: hasCustomExcerpt,
    filesUploading: filesUploading,

    // Is user currently in China (required for Google Maps)
    isChina: state.auth.loginSettings.countryCode === 'CN',
    accessToken: state.auth.BTCTK_A,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getTaggingGuidelines,

    createPrompt,

    save,

    setAttribute,
    setData,
    setDataAndNormalize,

    addChannel,
    deleteChannel,
    setPrimaryChannel,

    uploadThumbnail,
    uploadFeaturedImage,
    uploadFiles,
    uploadFileThumbnail,
    deleteUploadedFile,
    addFile,
    toggleFileAttribute,
    updateFile,
    updateFileConvertSettings,
    setFileOrder,
    filterFiles,
    setFileExpiryDefaults,

    addForm,

    addEvent,
    updateEvent,
    addTag,
    deleteTag,
    searchTags,
    clearTagSuggestions,
    addMetadata,
    updateMetadata,
    deleteMetadata,
    addLocation,
    deleteLocation,
    searchCrmCampaigns,

    addTagToCurrentFile,
    toggleFileEditModal,
    saveCurrentFileData,
    setFileEditData
  }),
  null,
  {
    areStatesEqual: (next, prev) => {
      return (
        prev.story === next.story && prev.files === next.files && prev.settings === next.settings && prev.saveError === next.saveError
      );
    }
  }
)
export default class StoryEdit extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    saving: PropTypes.bool
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    media: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    locationConstraints: []
  };

  constructor(props) {
    super(props);
    this.isNewQuicklink = props.location.pathname.indexOf('quicklink') > -1;

    this.state = {
      activeSection: 'details',
      saveDisabled: true,

      featuredDropDisabled: true,
      fileDropDisabled: props.isQuicklink || this.isNewQuicklink,
      thumbDropDisabled: !!props.thumbnail,

      thumbnailDropped: {},
      featuredDropped: {},

      channelPickerModalVisible: false,
      filePickerModalVisible: false,
      formPickerModalVisible: false,
      imagePickerModalVisible: false,
      repoFilePickerModalVisible: false,

      thumbPickerEnabled: false,
      featuredPickerEnabled: false,

      activeEvent: null,
      editEventModalVisible: false,

      dropzoneContainerId: uniqueId('dropzoneId-'),

      currentFileShareStatus: '',
      currentFilePermId: null,
      currentId: null,
      isUpdateExistingFile: false,
      filesToUpdateByFilePermId: {}
    };

    // Maximum concurrent uploads
    this.maxUploads = 1;

    // refs
    this.fileDropzone = null;
    this.scrollContainer = null;
    this.section = {};
    this.scrollContainer = null;
    this.selectedFileId = 0;

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { storyDefaults, userCapabilities } = this.context.settings;
    const { location, status } = this.props;

    // Creating a new Story or Republishing an old one
    const isNewStory = location.pathname.indexOf('/new') > -1;
    const isNewQuicklink = location.pathname.indexOf('quicklink') > -1;
    const isStoryRepublish = status === 'deleted';


    // Attached Files via router state (FileViewer)
    const attachedFiles = (location.state && location.state.files) ? location.state.files : [];

    // New Story
    if (isNewStory || isNewQuicklink) {
      const {
        storyExpiry,
        sharing,
        sharingPublic,
        serverShareDownloadsAllowed,
        serverShareDownloadsExpired,
        includeSharingDescription,
        locationConstraints,
        annotating,
        notifications // notify
      } = storyDefaults;

      // Default Quicklink type
      let quicklinkType = 'url';
      if (isNewQuicklink) {
        switch (true) {
          case userCapabilities.hasQuicklink:
            quicklinkType = 'url';
            break;
          case userCapabilities.hasQuickfile:
            quicklinkType = 'file';
            break;
          case userCapabilities.hasQuickform:
            quicklinkType = 'form';
            break;
          default:
            break;
        }
      }

      // Set Story Defaults
      this.props.setDataAndNormalize({
        id: 'new',
        channels: this.props.defaultChannel,
        isQuicklink: isNewQuicklink,
        quicklinkType: quicklinkType,

        expiresAt: storyExpiry ? parseInt(+new Date() / 1000, 0) + 86400 : 0,  // expire 1 day
        files: attachedFiles,

        sharing: sharing,
        sharingPublic: sharingPublic,
        sharingDownloadLimit: serverShareDownloadsAllowed,    // naming incorrect
        sharingDownloadExpiry: serverShareDownloadsExpired,   // naming incorrect
        sharingIncludeDescription: includeSharingDescription, // naming incorrect

        geolocations: locationConstraints,
        isGeoProtected: locationConstraints ? locationConstraints.length > 0 : false,

        isProtected: !!storyDefaults.protected,  // naming incorrect
        annotating: !!annotating,
        notify: !!notifications
      });
    }

    if (isStoryRepublish) {
      this.props.setFileExpiryDefaults({
        expiresAt: this.getFileExpiryValues().expiresAt,
        expiresAtTz: this.getFileExpiryValues().expiresAtTz
      });
    }
  }

  componentDidMount() {
    this.props.getTaggingGuidelines()
      .then((response) => {
        this.setState({ taggingGuidelines: response.body.taggingGuidelines });
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { saveError } = nextProps;
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      fileSettings
    } = this.props;
    const {
      fileGeneralSettings
    } = fileSettings;
    const fileDetailsLabel = fileGeneralSettings.detailsFieldLabel || 'Customisable Label';

    // Translations
    const strings = generateStrings(messages, formatMessage, { custom_details_label: fileDetailsLabel, meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    // Handle save errors
    // TODO: move to own function
    if (saveError && saveError.message && saveError.message !== this.props.saveError.message) {
      let title = strings.saveError;
      let message = saveError.message;

      if (saveError.statusCode) {
        title = `(${saveError.statusCode}) ${title}`;
      }
      if (saveError.original) {
        message += ': ' + saveError.original;
      }

      this.props.createPrompt({
        id: uniqueId('story-'),
        type: 'error',
        title: title,
        message: message,
        dismissible: true,
        autoDismiss: 10
      });

      // Required to rerender dropzone style on error
      this.setState({
        dropzoneContainerId: uniqueId('dropzoneId-')
      });

    // Enable file drop if Quickfile has no files
    } else if (nextProps.isQuickfile && !nextProps.files.length && this.props.files.length) {
      this.setState({
        fileDropDisabled: false
      });
    }
  }

  componentDidUpdate() {
    // Check if save should be enabled on props change
    if ((this.props.loaded || this.props.id === 'new') && this.props.hasUnsavedChanges) {
      this.checkSave();
    }
  }

  componentWillUnmount() {
    // Delete any uploaded files if Story is not saved
    if (!this.props.saving) {
      this.props.files.forEach(f => {
        if (f && f.isNew) {
          this.props.deleteUploadedFile(f);
        }
      });
    }
  }

  // Check if Story can be saved
  checkSave() {
    const {
      name,
      channels,
      expiresAt,
      publishAt,
      files,
      featuredImageUploading,
      filesUploading,
      isQuicklink,
      isQuickfile,
      quicklinkUrl
    } = this.props;
    let saveDisabled = false;
    const { showStoryOptionExpiryDate, showStoryOptionPublishDate } = this.context.settings.userCapabilities;
    // Check if minimum attributes are set
    // and no uploads are in progress
    if (!name || !name.trim() || channels.length === 0 || featuredImageUploading || filesUploading ||
      (isQuicklink && !quicklinkUrl) || (isQuickfile && !files.length)) {
      saveDisabled = true;
    }
    if (showStoryOptionExpiryDate && showStoryOptionPublishDate && expiresAt > 0 && publishAt > 0 && expiresAt < publishAt) {
      saveDisabled = true;
    }

    if (saveDisabled !== this.state.saveDisabled) {
      this.setState({ saveDisabled: saveDisabled });
    }
  }

  isCustomFileDetailsEnabled(f) {
    const {
      fileSettings
    } = this.props;
    const {
      fileDefaultSettings,
    } = fileSettings;
    const {
      userCapabilities
    } = this.context.settings;
    const {
      canCreateCustomFileDetails
    } = userCapabilities;

    // Conf. bundled enabled and attribute is undefined, set default values
    const isEnabled = canCreateCustomFileDetails.isEnabled && typeof f.customDetailsIsEnabled === 'undefined' ?
      fileDefaultSettings.customFileDetailsEnabled : f.customDetailsIsEnabled;

    return isEnabled;
  }

  getFileExpiryValues(f = {}) {
    const {
      fileSettings
    } = this.props;
    const {
      fileDefaultSettings,
    } = fileSettings;

    let expiresAt = f.expiresAt || 0;
    let expiresAtTz = f.expiresAtTz || '';

    if (fileDefaultSettings.enableFilesExpireDefaults) {
      expiresAt = f.expiresAt || parseInt(moment().add(fileDefaultSettings.filesExpireDefaultDays, 'days') / 1000, 10);
      expiresAtTz = f.expiresAtTz ||  this.context.settings.user.tz;
    }

    return {
      expiresAt,
      expiresAtTz,
    };
  }

  handleDragEnter(event) {
    // Not Supported in Safari
    if (event.dataTransfer.items) {
      const totalItems = 1;

      // Enable single-file dropzones if dragging 1 item
      if (totalItems === 1) {
        if (this.state.thumbDropDisabled) {
          this.setState({ thumbDropDisabled: false });
        }

        if (this.state.featuredDropDisabled) {
          this.setState({ featuredDropDisabled: false });
        }

      // Disable single-file dropzones if dragging more than 1 item
      } else {
        this.setState({
          thumbDropDisabled: true,
          featuredDropDisabled: true,
        });
      }
    }
  }

  handleScroll() {
    const target = this.scrollContainer;
    const sections = Array.from(target.children).reverse();  // reverse order
    const scrollTop = target.scrollTop;
    const se = 50;

    // first section default
    let activeSection = sections[sections.length - 1].dataset.id;
    for (const section of sections) {
      if (scrollTop >= (section.offsetTop - se)) {
        activeSection = section.dataset.id;
        break;
      }
    }

    this.setState({ activeSection: activeSection });
  }

  handleNavClick(event) {
    event.preventDefault();
    const section = event.currentTarget.getAttribute('href').split('#')[1];
    const scrollTo = this.section[section].offsetTop;

    this.scrollContainer.scrollTop = scrollTo;
    this.setState({ activeSection: section });
  }

  handleSaveClick() {
    const { naming, userCapabilities } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { fileSettings } = this.props;
    const { fileGeneralSettings } = fileSettings;
    const fileDetailsLabel = fileGeneralSettings.detailsFieldLabel || 'Customisable Label';

    // Translations
    const strings = generateStrings(messages, formatMessage, { custom_details_label: fileDetailsLabel, meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    const {
      custom_file_details_is_mandatory,
      custom_text_field_is_mandatory,
      show_custom_text_input_field,
    } = userCapabilities.canCreateCustomFileDetails.children;
    // Extract id/alias from channels
    const channels = [];
    this.props.channels.forEach(function(c) {
      channels.push({
        id: c.id,
        alias: c.alias
      });
    });

    // Events
    const events = [];
    this.props.events.forEach(function(e) {
      // Exclude id if new event
      if (e.isNew) {
        events.push({
          title: e.title,
          start: e.start,
          end: e.end,
          allDay: e.allDay || false,
          tz: e.tz
        });
      } else {
        events.push(e);
      }
    });

    // Files & Forms
    const files = [];
    let hasFileCustomMetadataError = false;
    let isMissingInputBoxCustomMetadataError = false;

    // Exclude Files if Quicklink
    if (!this.props.isQuicklink) {
      this.props.files.forEach(f => {
        // Exclude id if new file
        if (f.isNew && !f.uploading && !f.error) {
          let newFile;
          // Limited attributes for new Form
          if (f.category === 'form') {
            newFile = {
              formId: f.id,
              description: f.description,
              hasWatermark: f.hasWatermark,
              allowHubshareDownloads: f.allowHubshareDownloads,
              shareStatus: f.shareStatus,
            };

          // Limited attributes for new Web Link
          } else if (f.category === 'web') {
            newFile = {
              category: f.category,
              description: f.description,
              shareStatus: f.shareStatus,
              sourceUrl: f.sourceUrl,
              thumbnail: f.source === 'unsplash' ? f.thumbnailDownloadUrl : f.thumbnail,
              filename: f.filename,
            };

          // All other new files
          } else {
            newFile = {
              category: f.category,
              description: f.description,
              filename: f.filename,
              thumbnail: f.source === 'unsplash' ? f.thumbnailDownloadUrl : f.thumbnail,
              url: f.url,

              shareStatus: f.shareStatus,
              hasWatermark: f.hasWatermark,
              allowHubshareDownloads: f.allowHubshareDownloads,
              convertSettings: f.convertSettings,
            };
          }

          //Custom file metadata
          newFile.customDetailsIsEnabled = f.customDetailsIsEnabled;
          newFile.customDetailsText = f.customDetailsText;
          newFile.expiresAt = f.expiresAt;
          newFile.expiresAtTz = f.expiresAtTz;

          // Content hasn't been approved or missing text info
          if (!f.customDetailsIsEnabled && custom_file_details_is_mandatory) {
            hasFileCustomMetadataError = true;
          } else if (f.customDetailsIsEnabled && !f.customDetailsText && custom_text_field_is_mandatory && show_custom_text_input_field) {
            isMissingInputBoxCustomMetadataError = true;
          }

          // Repo file has additional attributes
          if (f.repoId) {
            newFile.repoDocumentId = f.repoDocumentId || f.id;
            newFile.repoId = f.repoId;
            newFile.ext = f.ext;
          }
          files.push(newFile);

        // Existing files
        } else if (!f.isNew && !f.uploading && !f.error) {
          const existingFile = { ...f };

          // Content hasn't been approved or missing text info
          if (f.isUploaded && !f.customDetailsIsEnabled && custom_file_details_is_mandatory) {
            hasFileCustomMetadataError = true;
          } else if (f.isUploaded && f.customDetailsIsEnabled && !f.customDetailsText && custom_text_field_is_mandatory && show_custom_text_input_field) {
            isMissingInputBoxCustomMetadataError = true;
          }

          // Remove 'contents' array from folder (only used by front end)
          if (existingFile.category === 'folder') {
            delete existingFile.contents;
          }

          files.push({
            ...f,
            thumbnail: f.source === 'unsplash' ? f.thumbnailDownloadUrl : f.thumbnail,
          });
        }
      });
    }

    // Prepare Story Data
    const body = {
      id: this.props.id || null,
      name: this.props.name,
      excerpt: this.props.excerpt,
      message: this.props.message,
      thumbnail: this.props.thumbnail,
      thumbnailDownloadUrl: this.props.thumbnailDownloadUrl,

      // Quicklink
      isQuickfile: this.props.isQuickfile,
      isQuicklink: this.props.isQuicklink,
      quicklinkUrl: this.props.quicklinkUrl,
      quicklinkBackupUrl: this.props.quicklinkBackupUrl,

      // Expiry/Publish
      expiresAt: this.props.expiresAt,
      expiresAtTz: this.props.expiresAtTz,
      publishAt: this.props.publishAt,
      publishAtTz: this.props.publishAtTz,

      // Featured
      featuredStartsAt: this.props.featuredStartsAt,
      featuredExpiresAt: this.props.featuredExpiresAt,
      featuredAtTz: this.props.featuredAtTz,
      featuredImage: this.props.featuredImage,
      featuredImageDownloadUrl: this.props.featuredImageDownloadUrl,

      // Arrays
      channels: channels,
      crmCampaigns: this.props.crmCampaigns,
      events: events,
      files: files,
      geolocations: this.props.geolocations,
      metadata: this.props.metadata,
      tags: this.props.tags,

      // Sharing
      sharing: this.props.sharing,
      sharingPublic: this.props.sharingPublic,
      sharingLinkedinDescription: this.props.sharingLinkedinDescription,
      sharingFacebookDescription: this.props.sharingFacebookDescription,
      sharingTwitterDescription: this.props.sharingTwitterDescription,
      sharingDownloadLimit: this.props.sharingDownloadLimit,
      sharingDownloadExpiry: this.props.sharingDownloadExpiry,
      sharingIncludeDescription: this.props.sharingIncludeDescription,

      // Booleans
      annotating: this.props.annotating,
      isProtected: this.props.isProtected,
      notify: this.props.notify,

      // Everything else
      sequence: this.props.sequence
    };

    if (this.props.status === 'deleted') {
      body.republishArchived = true;
    }

    const filesToUpdate = Object.values(this.state.filesToUpdateByFilePermId);

    if (hasFileCustomMetadataError || isMissingInputBoxCustomMetadataError) {
      this.props.createPrompt({
        id: 'file-custom-metadata',
        type: 'warning',
        title: 'Warning',
        message: hasFileCustomMetadataError ? strings.customMetadataIsRequiredBeforePublish : strings.customMetadataInputboxIsRequiredBeforePublish,
        dismissible: true,
        autoDismiss: 5
      });
    } else {
      // Save Story
      this.props.save(body, filesToUpdate);
    }
  }

  /**
   * Details handlers
   */
  handleThumbnailClick() {
    // Clear thumbnail if one is already set
    if (this.props.thumbnail) {
      this.props.setAttribute('thumbnail', '');
      this.props.setAttribute('thumbnailDownloadUrl', '');

    // Show image browser
    } else {
      this.setState({
        imagePickerModalVisible: true,
        thumbPickerEnabled: true
      });
    }
  }

  handleNameChange(event) {
    const value = event.target.value;
    this.props.setAttribute('name', value);
  }

  handlePrimaryChannelChange(event, channelId) {
    this.props.setPrimaryChannel(channelId);
  }

  handleDeleteChannelClick(event, channelId, isPrimary) {
    const { channels } = this.props;

    // Set channel as deleted
    this.props.deleteChannel(channelId);

    // Deleting Primary Channel?
    if (isPrimary && channels.length > 1) {
      // Set first channel to Primary if not deleting it
      if (channels[0].id !== channelId) {
        this.props.setPrimaryChannel(channels[0].id);

      // Set second channel to Primary
      } else if (channels[1].id !== channelId) {
        this.props.setPrimaryChannel(channels[1].id);
      }
    }
  }

  handleAddChannelClick() {
    this.setState({ channelPickerModalVisible: true });
  }

  handleChannelPickerCancel() {
    this.setState({ channelPickerModalVisible: false });
  }

  handleChannelPickerSave(event, selectedChannels) {
    const { hasAliases } = this.context.settings.userCapabilities;

    // Channel is selected
    if (selectedChannels.length) {
      // Aliases disabled - remove existing Channel
      if (!hasAliases && this.props.channels.length) {
        this.props.deleteChannel(this.props.channels[0].id);
      }

      let aliasChannel;

      if (this.props.channels.length > 0) {
        aliasChannel = this.props.channels.find(channel => !channel.alias);
      }

      // Extract required channel data
      selectedChannels.forEach((c, i) => {
        // Set first channel as primary (alias = false) if channel list is empty
        let alias = true;
        if (i === 0 && !this.props.channels.length || !hasAliases || aliasChannel.id === c.id) {
          alias = false;
        }

        // Add channel
        this.props.addChannel({
          id: c.id,
          name: c.name,
          colour: c.colour,
          alias: alias,
          thumbnail: c.thumbnail,
          type: c.type
        });
      });
    }

    this.setState({ channelPickerModalVisible: false });
  }

  /**
   * Featured Story
   */
  handleFeaturedToggle(event) {
    // Enable Featured
    if (event.target.checked) {
      // Create UTC timestamp
      const now = new Date();
      const adjusted = now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const utcNow = new Date(adjusted);
      const utc2weeks = new Date(adjusted);
      utc2weeks.setDate(utc2weeks.getDate() + 14);  // add two weeks

      this.props.setData({
        featuredStartsAt: utcNow.valueOf() / 1000,
        featuredExpiresAt: utc2weeks.valueOf() / 1000
      });
      this.setState({ featuredDropDisabled: false });

    // Disable Featured
    } else {
      this.props.setData({
        featuredStartsAt: 0,
        featuredExpiresAt: 0
      });
      this.setState({ featuredDropDisabled: true });
    }
  }

  handleFeaturedStartTimeChange(timestamp) {
    this.props.setAttribute('featuredStartsAt', timestamp / 1000);
  }

  handleFeaturedExpireTimeChange(timestamp) {
    this.props.setAttribute('featuredExpiresAt', timestamp / 1000);
  }

  handleFeaturedTimezoneChange(timestamp, tz) {
    this.props.setAttribute('featuredAtTz', tz);
  }

  handleFeaturedUploadClick(event) {
    event.preventDefault();

    // just open Featured image picker to select image
    this.setState({
      imagePickerModalVisible: true,
      featuredPickerEnabled: true,
      featuredDropped: {},
      featuredDropDisabled: true
    });
  }

  handlePublishTimeToggle(event) {
    if (event.target.checked) {
      const now = new Date();
      const fixedTime = parseInt(now / 1000, 10);  // ready for server
      this.props.setAttribute('publishAt', fixedTime);
    } else {
      this.props.setAttribute('publishAt', 0);
    }
  }

  handlePublishTimeChange(timestamp, tz) {
    this.props.setData({
      publishAt: parseInt(timestamp / 1000, 10),
      publishAtTz: tz
    });
  }

  handleExpiryTimeToggle(event) {
    if (event.target.checked) {
      //if the publish is set then default Date for Expire date is publishAt + 1 Month
      //if the publish is not set then default Date for Expire date is currentdate + 1 Month
      let currentDate  = new Date();
      if (this.props.publishAt > 0) {
        currentDate = new Date(this.props.publishAt * 1000);
      }
      const oneMonthLater = moment(currentDate).add(1, 'M').toDate();
      const fixedTime = parseInt(oneMonthLater / 1000, 10);  // ready for server
      this.props.setAttribute('expiresAt', fixedTime);
    } else {
      this.props.setAttribute('expiresAt', 0);
    }
  }

  handleExpiryTimeChange(timestamp, tz) {
    this.props.setData({
      expiresAt: parseInt(timestamp / 1000, 10),
      expiresAtTz: tz
    });
  }

  /**
   * Quicklink/Quickfile handlers
   */
  handleQuicklinkTypeChange(event, type) {
    this.props.setData({
      isQuicklink: type === 'url',
      isQuickfile: type === 'file' || type === 'form',
      quicklinkType: type
    });

    // Enable file upload if quickfile
    this.setState({
      fileDropDisabled: type !== 'file' && !this.props.files.length
    });
  }

  handleQuicklinkUrlChange(event) {
    this.props.setAttribute([event.target.name], event.target.value);
  }

  /**
   * Description handlers
   */
  handleExcerptChange(event) {
    const value = event.target.value;
    this.props.setAttribute('excerpt', value);

    if (!this.props.excerptChanged) {
      this.props.setAttribute('excerptChanged', true);
    }
  }

  handleMessageChange(value) {
    // Update excerpt if custom excerpt does not exist
    if (!this.props.excerpt.length || !this.props.hasCustomExcerpt) {
      const stripped = stripHTML(value);
      this.props.setAttribute('excerpt', stripped.slice(0, 90));  // 90 char limit
    }
    this.props.setAttribute('message', value);
  }

  /**
   * Cover Art
   */
  handleImagePickerCancel() {
    this.setState({
      imagePickerModalVisible: false,
      thumbPickerEnabled: false,
      featuredPickerEnabled: false
    });

    if (this.selectedFileId !== 0) {
      this.selectedFileId = 0;
    }
  }

  handleImagePickerSave(event, images, source) {
    if (images && images[0]) {
      // File edit modal tmp changes
      if (this.props.currentFileEditing.id && this.selectedFileId !== 0 && this.state.thumbPickerEnabled) {
        this.props.setFileEditData({
          source: source,
          thumbnail: images[0].url,
          thumbnailDownloadUrl: images[0].download_location,
          thumbnailUploading: false
        });
      } else if (this.selectedFileId !== 0 && this.state.thumbPickerEnabled) {
        const filesById = this.props.filesById;
        filesById[this.selectedFileId] = {
          ...filesById[this.selectedFileId],
          source: source,
          thumbnail: images[0].url,
          thumbnailDownloadUrl: images[0].download_location,
          thumbnailUploading: false
        };

        this.props.setAttribute('filesById', filesById);
        // Cover Art
      } else if (this.state.thumbPickerEnabled) {
        this.props.setAttribute('thumbnail', images[0].url);
        this.props.setAttribute('thumbnailDownloadUrl', images[0].download_location);

        // Set featured image same as thumbnail
        if (!this.props.featuredImage && (source === 'unsplash' || source === 'company')) {
          this.props.setAttribute('featuredImage', images[0].url.replace('&w=120&h=120', '&w=250&h=135'));
          this.props.setAttribute('featuredImageDownloadUrl', images[0].download_location);
        }

      // Featured image
      } else if (this.state.featuredPickerEnabled) {
        this.props.setAttribute('featuredImage', images[0].url);
        this.props.setAttribute('featuredImageDownloadUrl', images[0].download_location);
      }

      this.setState({
        imagePickerModalVisible: false,
        thumbPickerEnabled: false,
        featuredPickerEnabled: false
      });
      if (this.selectedFileId !== 0) {
        this.selectedFileId = 0;
      }
    }
  }

  resetThumbnailDropped() {
    this.setState({
      thumbnailDropped: {},
      featuredDropped: {},
    });
  }

  handleThumbnailDropAccepted(file) {
    if (file.length && file[0]) {
      // Skip crop tool if uploading a gif
      if (file[0].type === 'image/gif') {
        this.props.uploadThumbnail(file[0], this.context.store.dispatch);

      // All others files - pass file to Image picker
      } else {
        this.setState({
          imagePickerModalVisible: true,
          thumbPickerEnabled: true,
          thumbnailDropped: file[0],
          thumbDropDisabled: true
        });
      }
    }
  }

  handleThumbnailDropRejected() {
    const imageSizeErrorMesage = (<FormattedMessage
      id="image-size-must-be-less-n"
      defaultMessage="Images size must be less than {size} MB"
      values={{ size: 1 }}
    />);

    this.props.createPrompt({
      id: uniqueId('thumbnail-'),
      type: 'warning',
      title: 'Warning',
      message: imageSizeErrorMesage,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleFeaturedImageDropAccepted(file) {
    if (file.length && file[0]) {
      // Pass file to Image picker
      this.setState({
        imagePickerModalVisible: true,
        featuredPickerEnabled: true,
        featuredDropped: file[0],
        featuredDropDisabled: true
      });
    }
  }

  handleFeaturedImageDropRejected() {
    const imageSizeErrorMesage = (<FormattedMessage
      id="featured-image-size-must-be-less-n"
      defaultMessage="Featured Image size must be less than {size} MB"
      values={{ size: 2 }}
    />);

    this.props.createPrompt({
      id: uniqueId('featured-'),
      type: 'warning',
      title: 'Warning',
      message: imageSizeErrorMesage,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleImageUploadRejected(type) {
    let imageSizeErrorMesage = (<FormattedMessage
      id="upload-image-size-must-be-less-n"
      defaultMessage="Image size must be less than {size} MB"
      values={{ size: 5 }}
    />);

    if (type === 'format') {
      imageSizeErrorMesage = (<FormattedMessage
        id="upload-image-format-error"
        defaultMessage="Image format must be 'jpeg', 'jpg', 'png' or 'gif'"
        values={{ size: 5 }}
      />);
    }

    this.props.createPrompt({
      id: uniqueId('featured-'),
      type: 'warning',
      title: 'Warning',
      message: imageSizeErrorMesage,
      dismissible: true,
      autoDismiss: 5
    });
  }

  /**
   * Files
   */
  handleFileDropAccepted(files) {
    const { fileDefaults } = this.context.settings;
    // Don't trigger if event occurs from file sort

    if (files.length && !this.state.isFileSorting) {
      // Apply file defaults
      files.forEach((file) => {
        /* eslint-disable no-param-reassign */
        file.id = this.state.currentId || uniqueId('new-');
        file.convertSettings = {
          ...fileDefaults.convertSettings
        };
        file.shareStatus = this.state.currentFileShareStatus || fileDefaults.shareStatus;
        file.hasWatermark = false;
        file.allowHubshareDownloads = !!fileDefaults.allowHubshareDownloads;
        file.filePermId = this.state.currentFilePermId;
        file.expiresAt = this.getFileExpiryValues().expiresAt;
        file.expiresAtTz = this.getFileExpiryValues().expiresAtTz;
        /* eslint-enable no-param-reassign */

        // Upload files individually
        if (file.type === 'image/jpeg') {
          const loadImageOptions = {
            canvas: true
          };
          loadImage.parseMetaData(file, (data) => {
            if (data.exif && data.exif.get('Orientation')) {
              loadImageOptions.orientation = data.exif.get('Orientation');
              loadImage(file, (canvas) => {
                canvas.toBlob((blob) => {
                  /* eslint-disable no-param-reassign */
                  blob.id = file.id;
                  blob.name = file.name;
                  blob.shareStatus = this.state.currentFileShareStatus || file.shareStatus;
                  blob.hasWatermark = false;
                  blob.allowHubshareDownloads = !!file.allowHubshareDownloads;
                  /* eslint-enable no-param-reassign */

                  this.props.uploadFiles([blob], this.context.store.dispatch, {
                    customDetailsIsEnabled: this.isCustomFileDetailsEnabled({}),
                    ...this.getFileExpiryValues(),
                  })
                    .then(() => {
                      this.handleStateChangeForFilesToUpdateByFilePermId(file);
                    });
                }, 'image/jpeg');
              }, loadImageOptions);
            } else {
              this.props.uploadFiles([file], this.context.store.dispatch,  {
                customDetailsIsEnabled: this.isCustomFileDetailsEnabled({}),
                ...this.getFileExpiryValues(),
              })
                .then(() => {
                  this.handleStateChangeForFilesToUpdateByFilePermId(file);
                });
            }
          });
        } else {
          this.props.uploadFiles([file], this.context.store.dispatch,  {
            customDetailsIsEnabled: this.isCustomFileDetailsEnabled({}),
            ...this.getFileExpiryValues(),
          })
            .then((response) => {
              this.handleStateChangeForFilesToUpdateByFilePermId(file);
              const errors = JSON.parse(response.text).errors;
              if (Array.isArray(errors) && errors[0].code === 103) {
                this.props.createPrompt({
                  id: uniqueId('file-'),
                  type: 'warning',
                  title: 'Warning',
                  message: `${errors[0].message}. ${file.name} removed.`,
                  dismissible: true,
                  autoDismiss: 5
                });
                this.props.deleteUploadedFile(file);
              }
            });
        }
      });
    }
  }

  handleStateChangeForFilesToUpdateByFilePermId(file) {
    if (this.state.currentFileShareStatus && this.state.currentFilePermId) {
      this.setState({
        filesToUpdateByFilePermId: {
          ...this.state.filesToUpdateByFilePermId,
          [this.state.currentFilePermId]: {
            file_perm_id: this.state.currentFilePermId,
            description: this.props.filesById[file.id].description,
            share_status: this.state.currentFileShareStatus
          }
        }
      }, () => {
        this.setState({
          currentFilePermId: null,
          currentFileShareStatus: '',
          currentId: null
        });
      });
    } else {
      this.setState({
        currentFilePermId: null,
        currentFileShareStatus: '',
        currentId: null
      });
    }
  }

  handleFileDropRejected() {
    const { uploadMax } = this.context.settings.storyDefaults;
    const fileSizeErrorMessage = (<FormattedMessage
      id="file-size-must-be-less-n"
      defaultMessage="File size must be less than {size} MB"
      values={{ size: uploadMax / 1024 / 1024 }}
    />);

    this.props.createPrompt({
      id: uniqueId('thumbnail-'),
      type: 'warning',
      title: 'Warning',
      message: fileSizeErrorMessage,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleFileAddClick(event, shareStatus = '', filePermId = null, id = null) {
    const { fileDefaults } = this.context.settings;
    const type = event.target.dataset.type;

    switch (type) {
      case 'file':  // hub files
        this.setState({
          filePickerModalVisible: true,
          currentFileShareStatus: shareStatus,
          currentFilePermId: filePermId,
          currentId: id
        });
        if (shareStatus) {
          this.setState({ isUpdateExistingFile: true });
        }
        break;
      case 'form':
        this.setState({ formPickerModalVisible: true });
        break;
      case 'web':
        this.props.addFile({
          id: uniqueId('new-'),
          category: 'web',
          description: 'Web Link',
          thumbnail: '',
          sourceUrl: '',
          shareStatus: fileDefaults.shareStatus,
          showOptions: true,
          customDetailsIsEnabled: this.isCustomFileDetailsEnabled({}),
          ...this.getFileExpiryValues()
        });
        break;
      case 'cloud':
        this.setState({ repoFilePickerModalVisible: true });
        break;
      case 'audio':
        console.log('record audio file');  // eslint-disable-line
        break;
      default:  // desktop
        if (this.fileDropzone) {
          this.setState({
            currentFileShareStatus: shareStatus,
            currentFilePermId: filePermId,
            currentId: id
          }, () => {
            this.fileDropzone.open();
          });
        }
        break;
    }
  }

  handleFormAddClick(event) {
    event.preventDefault();
    this.setState({ formPickerModalVisible: true });
  }

  handleFileSortStart() {
    this.setState({ isFileSorting: true });
  }

  handleFileSortEnd() {
    this.setState({ isFileSorting: false });
  }

  handleFileFilterChange(event) {
    const value = event.target.value;
    this.props.filterFiles(value);
  }

  handleFileOrderChange(event, order) {
    this.props.setFileOrder(order);
  }

  handleFileEditModalToggleClick(event, fileId, activeSection = null) {
    let file = this.props.files.find(fileItem => fileItem.id === fileId);

    if (file) {
      file = {
        ...file,
        customDetailsIsEnabled: this.isCustomFileDetailsEnabled(file)
      };
    }
    this.props.toggleFileEditModal({ ...file, activeSection });
  }

  handleFileDeleteClick(event, fileId) {
    const file = this.props.filesById[fileId];

    // New (uploaded & unsaved) file - tell server to remove file
    if (file && file.isNew && !file.permId && !file.repoId) {
      this.props.deleteUploadedFile(file);

    // Existing file (Hub File, Cloud File)
    // set as deleted to omit from save
    } else if (file && (!file.isNew || file.permId || file.repoId)) {
      // Repo Folder, mark each file in contents as deleted
      if (file.category === 'folder' && file.contents) {
        file.contents.forEach(f => {
          this.props.updateFile(f.id, { deleted: true });
        });
      }
      this.props.updateFile(fileId, { deleted: true });
    }
  }

  handleFileEditChange(event, context) {
    const { key, value, parent } = context;
    this.props.setFileEditData({
      [key]: value,
      parent
    });
  }

  handleAddTagToFile(tag) {
    this.props.addTagToCurrentFile(tag);
  }

  handleFileSaveClick() {
    const { formatMessage } = this.context.intl;
    const { naming, userCapabilities } = this.context.settings;
    const {
      custom_file_details_is_mandatory,
      custom_text_field_is_mandatory,
      show_custom_text_input_field,
    } = userCapabilities.canCreateCustomFileDetails.children;
    const {
      currentFileEditing,
      fileSettings
    } = this.props;
    const {
      fileGeneralSettings
    } = fileSettings;
    const fileDetailsLabel = fileGeneralSettings.detailsFieldLabel || 'Customisable Label';

    // Translations
    const strings = generateStrings(messages, formatMessage, { custom_details_label: fileDetailsLabel, meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    if (!currentFileEditing.customDetailsIsEnabled && custom_file_details_is_mandatory ||
      (currentFileEditing.customDetailsIsEnabled && !currentFileEditing.customDetailsText && custom_text_field_is_mandatory && show_custom_text_input_field)) {
      const msg = !currentFileEditing.customDetailsIsEnabled && custom_file_details_is_mandatory ?
        strings.customMetadataIsRequiredBeforePublish :
        strings.customMetadataInputboxIsRequiredBeforePublish;

      this.props.createPrompt({
        id: 'file-custom-metadata',
        type: 'warning',
        title: 'Warning',
        message: msg,
        dismissible: true,
        autoDismiss: 5
      });
    } else {
      this.props.saveCurrentFileData();
    }
  }

  handleFileDescriptionChange(event, fileId) {
    this.props.updateFile(fileId, {
      description: event.target.value
    });
  }

  handleFileUploadClick(event, fileId) {
    this.setState({
      imagePickerModalVisible: true,
      thumbPickerEnabled: true
    });

    this.selectedFileId = fileId;
  }

  handleFileShareChange(event, fileId) {
    this.props.updateFile(fileId, {
      shareStatus: event.target.value
    });
  }

  handleFilePresentationSettingChange(event, fileId) {
    this.props.updateFileConvertSettings(fileId, {
      [event.target.value]: event.target.checked
    });
  }

  handleFileWatermarkChange(event, fileId) {
    this.props.updateFile(fileId, {
      hasWatermark: event.target.checked
    });
  }

  handleFileHubshareDownloadChange(event, fileId) {
    this.props.updateFile(fileId, {
      allowHubshareDownloads: event.target.checked
    });
  }

  handleSourceUrlChange(event, fileId) {
    this.props.updateFile(fileId, {
      sourceUrl: event.target.value
    });
  }

  handleFilePickerCancel() {
    this.setState({
      filePickerModalVisible: false,
      isUpdateExistingFile: false,
      currentFileShareStatus: '',
      currentFilePermId: null,
      currentId: null
    });
  }

  handleFilePickerSave(event, selectedFiles) {
    const hasFiles = this.props.files.length + selectedFiles.length;
    const {
      currentFileShareStatus,
      currentFilePermId,
      currentId
    } = this.state;

    selectedFiles.forEach(f => {
      if (currentFileShareStatus && currentFilePermId && currentId) {
        const updatedExistingFile = {
          ...f,
          id: currentId,
          filePermId: currentFilePermId,
          shareStatus: currentFileShareStatus,
          customDetailsIsEnabled: this.isCustomFileDetailsEnabled(f),
          ...this.getFileExpiryValues(),
        };
        this.props.addFile(updatedExistingFile, currentFileShareStatus, currentFilePermId);
      } else {
        this.props.addFile({
          ...f,
          customDetailsIsEnabled: this.isCustomFileDetailsEnabled(f),
          ...this.getFileExpiryValues(),
        });
      }
    });

    this.setState({
      fileDropDisabled: this.props.isQuickfile && hasFiles,
      filePickerModalVisible: false,
      isUpdateExistingFile: false
    });
  }

  handleRepoFilePickerCancel() {
    this.setState({ repoFilePickerModalVisible: false });
  }

  handleRepoFilePickerSave(event, selectedFiles) {
    const { fileDefaults } = this.context.settings;

    /* eslint-disable no-param-reassign */
    selectedFiles.forEach(function(f) {
      f.isNew = true;
      f.hasWatermark = fileDefaults.hasWatermark || false;
      f.allowHubshareDownloads = !!fileDefaults.allowHubshareDownloads;
      f.shareStatus = fileDefaults.shareStatus;
      f.convertSettings = fileDefaults.convertSettings;
      f.customDetailsIsEnabled = this.isCustomFileDetailsEnabled(f);
      f.expiresAt = this.getFileExpiryValues().expiresAt;
      f.expiresAtTz = this.getFileExpiryValues().expiresAtTz;
      this.props.addFile(f);
    }, this);
    /* eslint-enable no-param-reassign */

    this.setState({ repoFilePickerModalVisible: false });
  }

  /**
   * Forms
   */
  handleAddFormClick() {
    this.setState({ formPickerModalVisible: true });
  }

  handleFormPickerCancel() {
    this.setState({ formPickerModalVisible: false });
  }

  handleFormPickerSave(event, selectedForms) {
    const {
      fileDefaults
    } = this.context.settings;

    /* eslint-disable no-param-reassign */
    selectedForms.forEach(function(f) {
      f.category = 'form';
      f.description = f.name;
      f.hasWatermark = fileDefaults.hasWatermark || false;
      f.allowHubshareDownloads = !!fileDefaults.allowHubshareDownloads;
      f.shareStatus = fileDefaults.shareStatus || 'optional';
      f.customDetailsIsEnabled = this.isCustomFileDetailsEnabled(f);
      f.expiresAt = this.getFileExpiryValues().expiresAt;
      f.expiresAtTz = this.getFileExpiryValues().expiresAtTz;
      this.props.addForm(f);
    }, this);
    /* eslint-enable no-param-reassign */

    this.setState({ formPickerModalVisible: false });
  }

  /**
   * Events/Meetings
   */
  handleEventAddClick(event) {
    event.preventDefault();

    this.setState({
      activeEvent: null,
      editEventModalVisible: true
    });
  }

  handleEventEditClick(event, eventId) {
    event.preventDefault();

    this.setState({
      activeEvent: this.props.eventsById[eventId],
      editEventModalVisible: true
    });
  }

  handleEventModalCancel() {
    this.setState({
      activeEvent: null,
      editEventModalVisible: false
    });
  }

  handleEventSaveClick(event, eventData) {
    event.preventDefault();

    this.setState({
      activeEvent: null,
      editEventModalVisible: false
    });

    // Edit existing
    if (eventData.id) {
      this.props.updateEvent(eventData.id, eventData);

    // Create new
    } else if (!eventData.id) {
      this.props.addEvent(eventData);
    }
  }

  handleEventDeleteClick(event, eventId) {
    event.preventDefault();
    this.props.updateEvent(eventId, { deleted: true });
  }

  /**
   * Tags
   */
  handleTagAdd(event, tagName) {
    this.props.addTag(tagName);
  }

  handleTagDelete(event, tagIndex) {
    this.props.deleteTag(tagIndex);
  }

  handleTagSearchChange(event, value) {
    if (!value) {
      this.props.clearTagSuggestions();
    } else {
      this.props.searchTags(value);
    }
  }

  /**
   * Option - Sharing
   */
  handleSharingChange(event) {
    const checked = event.target.checked;
    this.props.setAttribute('sharing', checked);
  }

  handlePublicShareChange(event) {
    const checked = event.target.checked;
    this.props.setAttribute('sharingPublic', checked);
  }

  handleShareDescriptionChange(event) {
    const value = event.target.value;
    const type = event.target.dataset.type;
    this.props.setAttribute([type + 'Description'], value);
  }

  handleDownloadLimitChange(event) {
    const type = event.target.type;

    // Toggle checkbox
    if (type === 'checkbox') {
      if (!event.target.checked) {
        this.props.setAttribute('sharingDownloadLimit', 0);
      } else {
        this.props.setAttribute('sharingDownloadLimit', 5);  // default;
      }

    // Text input, set value
    } else if (type === 'text') {
      this.props.setAttribute('sharingDownloadLimit', parseInt(event.target.value, 10));
    }
  }

  handleDownloadExpiryChange(event) {
    const type = event.target.type;

    // Toggle checkbox
    if (type === 'checkbox') {
      if (!event.target.checked) {
        this.props.setAttribute('sharingDownloadExpiry', 0);
      } else {
        this.props.setAttribute('sharingDownloadExpiry', 3);
      }

    // Text input, set value
    } else if (type === 'text') {
      this.props.setAttribute('sharingDownloadExpiry', parseInt(event.target.value, 10));
    }
  }

  handleIncludeSharingDescriptionChange(event) {
    const checked = event.target.checked;
    this.props.setAttribute('sharingIncludeDescription', checked);
  }

  handleIsProtectedChange(event) {
    const checked = event.target.checked;
    this.props.setAttribute('isProtected', checked);
    this.props.setAttribute('unlocked', checked);
  }

  handleAnnotationsChange(event) {
    const checked = event.target.checked;
    this.props.setAttribute('annotating', checked);
  }

  handleNotiftyChange(event) {
    const checked = event.target.checked;
    this.props.setAttribute('notify', checked);
  }

  handleSequenceChange(event) {
    const type = event.target.type;

    if (type === 'checkbox') {
      const checked = event.target.checked;
      this.props.setAttribute('sequence', checked ? 1 : 0);
    } else if (type === 'number') {
      const value = parseInt(event.target.value, 10);
      if (value > 0 && value <= 1000) {
        this.props.setAttribute('sequence', value);
      }
    }
  }

  handleGeoProtectedChange(event) {
    const checked = event.target.checked;
    if (!checked) {
      this.props.setAttribute('geolocations', []);
    }
    this.props.setAttribute('isGeoProtected', checked);
  }

  /**
   * Option - Location restrictions
   */
  handleLocationAddClick(event) {
    event.preventDefault();

    this.setState({
      editLocationModalVisible: true
    });
  }

  handleLocationModalCancel() {
    this.setState({
      editLocationModalVisible: false
    });
  }

  handleLocationSaveClick(event, locationData) {
    event.preventDefault();

    this.setState({
      editLocationModalVisible: false
    });

    this.props.addLocation(locationData);
  }

  handleLocationDeleteClick(event, locationIndex) {
    event.preventDefault();
    this.props.deleteLocation(locationIndex);
  }

  /**
   * Metadata handlers
   */
  handleMetadataAdd(metadata) {
    this.props.addMetadata(metadata);
  }

  handleMetadataDelete(metadata) {
    if (metadata && metadata.metadataId) {
      this.props.deleteMetadata(metadata.metadataId);
    }
  }

  handleMetadataChange(metadata) {
    this.props.updateMetadata(metadata);
  }

  /**
   * Marketing (CRM Campaigns) handlers
   */
  handleCampaignAdd(event) {
    event.preventDefault();

    this.setState({
      editCampaignModalVisible: true
    });
  }

  handleCampaignDelete(event, campaignId) {
    event.preventDefault();
    const data = this.props.crmCampaigns.filter(obj => obj.id !== campaignId);
    this.props.setAttribute('crmCampaigns', data);
  }

  handleCampaignModalCancel(event) {
    event.preventDefault();

    this.setState({
      editCampaignModalVisible: false
    });
  }

  handleCampaignSaveClick(event, campaignData) {
    const data = [];
    if (campaignData) {
      data.push({
        id: campaignData.id,
        name: campaignData.name,
      });
      this.props.setAttribute('crmCampaigns', data);
    }

    this.setState({
      editCampaignModalVisible: false
    });
  }

  handleCampaignLoad() {
    if (!this.props.campaignsLoading) {
      this.props.searchCrmCampaigns('salesforce', 'campaign');
    }
  }

  handleCampaignSearch(value) {
    if (value && !this.props.campaignsLoading) {
      this.props.searchCrmCampaigns('salesforce', 'campaign', value);
    }
  }

  handleCampaignNextPage() {
    if (!this.props.campaignsLoading && this.props.campaignsNextPage) {
      this.props.searchCrmCampaigns('salesforce', 'campaign', '', this.props.campaignsNextPage);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString, naming, userCapabilities } = this.context.settings;
    const {
      canCreateStory,
      hasAliases,
      hasQuicklink,
      hasQuickfile,
      hasQuickform,
      canCreateCustomFileDetails
    } = userCapabilities;
    const hasQuick = hasQuicklink || hasQuickfile || hasQuickform;
    const {
      activeSection,
      taggingGuidelines,
      isUpdateExistingFile
    } = this.state;
    const {
      id,
      thumbnail,
      featuredStartsAt,
      featuredImage,
      fileSettings,

      crmCampaigns,
      currentFileEditing,
      events,
      excerpt,
      message,
      metadata,
      metadataSettings,
      tags,
      showEditModal,
      suggestedTags,

      isQuickfile,
      isQuicklink,

      quicklinkType,
      quicklinkUrl,
      quicklinkBackupUrl,

      canPublishToChannel,

      accessToken
    } = this.props;
    const rootUrl = this.props.location.pathname;
    const styles = require('./StoryEdit.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryEdit: true,
      saving: this.props.saving
    }, this.props.className);

    const dropzoneClasses = cx({
      dropzoneActive: !((!this.state.thumbDropDisabled || !this.state.featuredDropDisabled) && this.state.imagePickerModalVisible),
    });
    const {
      fileGeneralSettings
    } = fileSettings;
    const fileDetailsLabel = fileGeneralSettings.detailsFieldLabel || 'Customisable Label';

    // Translations
    const strings = generateStrings(messages, formatMessage, { custom_details_label: fileDetailsLabel, meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    // Check user permission
    if (id === 'new' && (!canCreateStory || canCreateStory && !hasQuick && (isQuicklink || isQuickfile))) {
      return (
        <AccessDenied
          heading="Access Denied"
          message="User not allowed to create a Story"
          onCloseClick={this.props.onCloseClick}
        />
      );
    }

    // Creating new Story
    const isNew = location.pathname.indexOf('/new') > -1 || location.pathname.indexOf('quicklink') > -1;

    // Page Title
    let pageTitle = strings.edit + ' ' + this.props.name;
    if (!this.props.permId) {
      pageTitle = strings.createStory;
    }

    // Available sections
    const sections = [{
      id: 'details',
      name: strings.details,
      enabled: true,
      readonly: !isNew && !canPublishToChannel,
      component: (<StoryEditDetails
        onThumbnailClick={this.handleThumbnailClick}
        onNameChange={this.handleNameChange}
        onAddChannelClick={this.handleAddChannelClick}
        onPrimaryChannelChange={this.handlePrimaryChannelChange}
        onDeleteChannelClick={this.handleDeleteChannelClick}
        onFeaturedToggle={this.handleFeaturedToggle}
        onFeaturedStartTimeChange={this.handleFeaturedStartTimeChange}
        onFeaturedExpireTimeChange={this.handleFeaturedExpireTimeChange}
        onFeaturedTimezoneChange={this.handleFeaturedTimezoneChange}
        onFeaturedUploadClick={this.handleFeaturedUploadClick}
        onPublishTimeToggle={this.handlePublishTimeToggle}
        onPublishTimeChange={this.handlePublishTimeChange}
        onExpiryTimeToggle={this.handleExpiryTimeToggle}
        onExpiryTimeChange={this.handleExpiryTimeChange}
        {...this.props}
      />)
    }, {
      id: 'quicklink',
      name: strings.type,
      enabled: isQuicklink || isQuickfile,
      component: (<StoryEditQuicklink
        {... {
          authString,
          canCreateCustomFileDetails,
          currentFileEditing,
          fileSettings,
          showEditModal,
          strings
        }}
        type={quicklinkType}
        url={quicklinkUrl}
        backupUrl={quicklinkBackupUrl}
        file={this.props.files[0]}
        fileSettings={this.props.fileSettings}
        canCreateCustomFileDetails={canCreateCustomFileDetails}
        hasQuicklink={userCapabilities.hasQuicklink}
        hasQuickfile={userCapabilities.hasQuickfile}
        hasQuickform={userCapabilities.hasQuickform}
        hasCloudStorage={userCapabilities.hasCloudStorage}
        onTypeChange={this.handleQuicklinkTypeChange}
        onUrlChange={this.handleQuicklinkUrlChange}
        onBackupUrlChange={this.handleQuicklinkBackupUrlChange}
        onAddFileClick={this.handleFileAddClick}
        onAddFormClick={this.handleFormAddClick}
        onFileOptionsToggleClick={this.handleFileEditModalToggleClick}
        onFileDeleteClick={this.handleFileDeleteClick}
        onSaveClick={this.handleFileSaveClick}

        onAddTag={this.handleAddTagToFile}
        onFileEditChange={this.handleFileEditChange}
        onFileUploadClick={this.handleFileUploadClick}
      />)
    }, {
      id: 'description',
      name: strings.description,
      enabled: true,
      component: (<StoryEditDescription
        excerpt={excerpt}
        message={message}
        showDescription={!isQuicklink && !isQuickfile && !this.isNewQuicklink}  // hidden for Quicklinks
        onExcerptChange={this.handleExcerptChange}
        onMessageChange={this.handleMessageChange}
        accessToken={accessToken}
        onImageUploadRejected={this.handleImageUploadRejected}
      />)
    }, {
      id: 'files',
      name: strings.files,
      enabled: !isQuicklink && !isQuickfile,
      component: (<StoryEditFiles
        {... {
          currentFileEditing,
          fileSettings,
          showEditModal
        }}
        files={this.props.filteredFiles}
        fileSettings={this.props.fileSettings}
        filterValue={this.props.fileFilter}
        onAddClick={this.handleFileAddClick}
        onAddTag={this.handleAddTagToFile}
        onDragStart={this.handleFileSortStart}
        onDragEnd={this.handleFileSortEnd}
        onFileEditChange={this.handleFileEditChange}
        onFilterChange={this.handleFileFilterChange}
        onOrderChange={this.handleFileOrderChange}
        onAnchorClick={this.props.onAnchorClick}
        onFileOptionsToggleClick={this.handleFileEditModalToggleClick}
        onFileDeleteClick={this.handleFileDeleteClick}
        onFileUploadClick={this.handleFileUploadClick}
        onSaveClick={this.handleFileSaveClick}
      />)
    }, {
      id: 'tags',
      name: strings.tags,
      enabled: userCapabilities.showStoryOptionTags,
      component: (<Fragment>
        <div className={styles.tagsHeader}>
          <h3>{strings.tags}</h3>
          {!!taggingGuidelines && <StoryEditTaggingGuidelines
            formatMessage={formatMessage}
            taggingGuidelines={taggingGuidelines}
          />}
        </div>
        <StoryEditTags
          tags={tags}
          suggestedTags={suggestedTags}
          onTagAdd={this.handleTagAdd}
          onTagDelete={this.handleTagDelete}
          onTagSearchChange={this.handleTagSearchChange}
        />
      </Fragment>)
    }, {
      id: 'meetings',
      name: strings.meetings,
      enabled: userCapabilities.hasMeetings && userCapabilities.showStoryOptionEvents,
      readonly: !isNew && !canPublishToChannel,
      component: (<StoryEditEvents
        events={events}
        readonly={!isNew && !canPublishToChannel}
        onAddClick={this.handleEventAddClick}
        onItemEditClick={this.handleEventEditClick}
        onItemDeleteClick={this.handleEventDeleteClick}
      />)
    }, {
      id: 'options',
      name: strings.options,
      enabled: true,
      component: (<StoryEditOptions
        // Sharing and related options
        sharing={this.props.sharing}
        sharingPublic={this.props.sharingPublic}
        sharingLinkedinDescription={this.props.sharingLinkedinDescription}
        sharingFacebookDescription={this.props.sharingFacebookDescription}
        sharingTwitterDescription={this.props.sharingTwitterDescription}
        sharingDownloadLimit={this.props.sharingDownloadLimit}
        sharingDownloadExpiry={this.props.sharingDownloadExpiry}
        sharingIncludeDescription={this.props.sharingIncludeDescription}

        onSharingChange={this.handleSharingChange}
        onPublicShareChange={this.handlePublicShareChange}
        onShareDescriptionChange={this.handleShareDescriptionChange}
        onDownloadLimitChange={this.handleDownloadLimitChange}
        onDownloadExpiryChange={this.handleDownloadExpiryChange}
        onIncludeSharingDescriptionChange={this.handleIncludeSharingDescriptionChange}

        // Location restrictions
        // showStoryOptionGeolocation
        geolocations={this.props.geolocations}
        isGeoProtected={this.props.isGeoProtected}
        onGeoProtectedChange={this.handleGeoProtectedChange}
        onLocationAddClick={this.handleLocationAddClick}
        onLocationDeleteClick={this.handleLocationDeleteClick}

        // Password Protection
        // showStoryOptionProtected
        isProtected={this.props.isProtected}
        onIsProtectedChange={this.handleIsProtectedChange}

        // Annoation
        // showStoryOptionAnnotations
        annotating={this.props.annotating}
        onAnnotationsChange={this.handleAnnotationsChange}

        // Notifications
        // showStoryOptionNotifications
        notify={this.props.notify}
        onNotifyChange={this.handleNotiftyChange}

        // Sequence
        // showStoryOptionSequence
        sequence={this.props.sequence}
        onSequenceChange={this.handleSequenceChange}
      />)
    }, {
      id: 'metadata',
      name: strings.metadata,
      enabled: true,
      readonly: !isNew && !canPublishToChannel,
      component: (<StoryEditMetadata
        metadata={metadata}
        metadataSettings={metadataSettings}
        readonly={!isNew && !canPublishToChannel}
        onMetadataAdd={this.handleMetadataAdd}
        onMetadataChange={this.handleMetadataChange}
        onMetadataDelete={this.handleMetadataDelete}
      />)
    }, {
      id: 'marketing',
      name: strings.marketing,
      enabled: userCapabilities.hasCrmIntegration,
      readonly: !isNew && !canPublishToChannel,
      component: (<StoryEditMarketing
        crmCampaigns={crmCampaigns}
        readonly={!isNew && !canPublishToChannel}
        onAddClick={this.handleCampaignAdd}
        onItemDeleteClick={this.handleCampaignDelete}
      />)
    }];

    // Status text
    let statusElem = '';
    if (this.props.saving) {
      statusElem = <span>{strings.saving}</span>;
    }

    // Enable Featured Dropzone?
    let enableFeaturedDrop = false;
    if (featuredStartsAt && !featuredImage && !this.state.featuredDropDisabled && !this.state.imagePickerModalVisible) {
      enableFeaturedDrop = true;
    }

    // Enable Thumbnail (Cover Art) Dropzone?
    let enableThumbDrop = false;
    if (!thumbnail && !enableFeaturedDrop && !this.state.thumbDropDisabled && !this.state.imagePickerModalVisible && canPublishToChannel) {
      enableThumbDrop = true;
    }

    // Enable File Dropzone?
    let enableFileDrop = false;
    if (!this.state.fileDropDisabled && !this.state.imagePickerModalVisible) {
      enableFileDrop = true;
    }

    return (
      <Dropzone
        className={classes}
        activeClassName={dropzoneClasses}
        disableClick
        onDragEnter={this.handleDragEnter}
        key={this.state.dropzoneContainerId}
      >
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <div className={styles.dropZones}>
          {enableThumbDrop && <Dropzone
            onDropAccepted={this.handleThumbnailDropAccepted}
            onDropRejected={this.handleThumbnailDropRejected}
            accept="image/*"
            multiple={false}
            maxSize={1048576}  // 1MB
            className={styles.thumbnailDropzone}
            activeClassName={styles.thumbnailDropzoneActive}
            rejectClassName={styles.thumbnailDropzoneReject}
            disableClick
          >
            <div className={styles.icon} />
            <h2>{strings.thumbnailDropzoneMessage}</h2>
          </Dropzone>}
          {enableFeaturedDrop && <Dropzone
            onDropAccepted={this.handleFeaturedImageDropAccepted}
            onDropRejected={this.handleFeaturedImageDropRejected}
            accept="image/*"
            multiple={false}
            maxSize={2097152}  // 2MB
            className={styles.featuredDropzone}
            activeClassName={styles.featuredDropzoneActive}
            rejectClassName={styles.featuredDropzoneReject}
            disableClick
          >
            <div className={styles.icon} />
            <h2>{strings.featuredDropzoneMessage}</h2>
          </Dropzone>}
          {enableFileDrop && <Dropzone
            ref={(c) => { this.fileDropzone = c; }}
            onDropAccepted={this.handleFileDropAccepted}
            onDropRejected={this.handleFileDropRejected}
            maxSize={this.context.settings.storyDefaults.uploadMax}
            className={styles.fileDropzone}
            activeClassName={styles.fileDropzoneActive}
            rejectClassName={styles.fileDropzoneRejected}
            disableClick
          >
            <div className={styles.icon} />
            <h2>{strings.fileDropzoneMessage}</h2>
          </Dropzone>}
        </div>

        <header id="story-edit-header" className={styles.editHeader}>
          <nav className="horizontal-nav">
            <ul>
              {sections.map(s => (s.enabled &&
                <NavItem
                  key={s.id}
                  rootUrl={rootUrl}
                  active={activeSection === s.id}
                  onClick={this.handleNavClick}
                  {...s}
                />
              ))}
            </ul>
          </nav>
          <div className={styles.status}>
            {statusElem}
          </div>
          <div className={styles.actions}>
            <Btn
              data-id="cancel"
              alt
              large
              onClick={this.props.onCloseClick}
            >
              {strings.cancel}
            </Btn>
            <Btn
              data-id="save"
              inverted
              large
              disabled={this.state.saveDisabled}
              loading={this.props.saving}
              onClick={this.handleSaveClick}
            >
              {this.props.publishAt ? strings.schedule : strings.publish}
            </Btn>
          </div>
        </header>
        <div
          ref={(c) => { this.scrollContainer = c; }}
          id="story-edit-body"
          className="scrollContainer"
          onScroll={this.handleScroll}
        >
          {sections.map(s => (s.enabled &&
            <section
              key={s.id}
              ref={(c) => { this.section[s.id] = c; }}
              data-id={s.id}
              className={styles.editSection}
            >
              {(s.id !== 'files' && s.id !== 'tags') && <h3>
                {s.name}{s.readonly && <span
                  aria-label={`${strings.noEditPermission} ${s.name}`}
                  className={styles.readonly}
                ><span />
                </span>}
              </h3>}
              {s.component}
            </section>
          ))}
        </div>

        {/* Channel Picker Modal */}
        {this.state.channelPickerModalVisible && <ChannelPickerModal
          allowMultiple={hasAliases}
          canPost
          isVisible
          onClose={this.handleChannelPickerCancel}
          onSave={this.handleChannelPickerSave}
        />}

        {/* Form Picker Modal */}
        {this.state.formPickerModalVisible && <FormPickerModal
          allowMultiple={!isQuickfile && !isQuicklink}
          isVisible
          onClose={this.handleFormPickerCancel}
          onSave={this.handleFormPickerSave}
        />}

        {/* File Picker Modal */}
        {this.state.filePickerModalVisible && <FilePickerModal
          allowMultiple={!isQuickfile && !isQuicklink && !isUpdateExistingFile}
          isVisible
          ignoreCategories={['btc', 'folder', 'form']}
          canShare
          onClose={this.handleFilePickerCancel}
          onSave={this.handleFilePickerSave}
        />}

        {/* Repo (Cloud) File Picker Modal */}
        {this.state.repoFilePickerModalVisible && <RepoFilePickerModal
          allowMultiple={!isQuickfile && !isQuicklink}
          allowFolderSelect={!isQuickfile && !isQuicklink}
          ignore={['form']}
          isVisible
          onClose={this.handleRepoFilePickerCancel}
          onSave={this.handleRepoFilePickerSave}
        />}

        {/* Image Picker Modal */}
        {this.state.imagePickerModalVisible && this.state.thumbPickerEnabled && <ImagePickerModal
          isVisible
          category="cover_art"
          imageDropped={this.state.thumbnailDropped}
          resetImageDropped={this.resetThumbnailDropped}
          onClose={this.handleImagePickerCancel}
          onSave={this.handleImagePickerSave}
        />}
        {this.state.imagePickerModalVisible && this.state.featuredPickerEnabled && <ImagePickerModal
          isVisible
          width={370}
          heigth={200}
          resize
          resizeWidth={1000}
          resizeHeight={540}
          category="featured_story_image"
          imageDropped={this.state.featuredDropped}
          resetImageDropped={this.resetThumbnailDropped}
          onClose={this.handleImagePickerCancel}
          onSave={this.handleImagePickerSave}
        />}
        {/* Edit Event Modal */}
        {this.state.editEventModalVisible && <StoryEditEventModal
          event={this.state.activeEvent}
          onClose={this.handleEventModalCancel}
          onSave={this.handleEventSaveClick}
        />}

        {/* Edit Location Modal */}
        {this.state.editLocationModalVisible && <StoryEditLocationModal
          defaultLocation={this.props.defaultLocation}
          isChina={this.props.isChina}
          onClose={this.handleLocationModalCancel}
          onSave={this.handleLocationSaveClick}
        />}


        {/* Edit Campaign Modal */}
        {this.state.editCampaignModalVisible && <StoryEditCampaignModal
          campaigns={this.props.campaigns}
          isLoading={this.props.campaignsLoading}
          error={this.props.campaignsError}
          onLoad={this.handleCampaignLoad}
          onSearch={this.handleCampaignSearch}
          onNextPage={this.handleCampaignNextPage}
          onClose={this.handleCampaignModalCancel}
          onSave={this.handleCampaignSaveClick}
        />}

        <Prompt
          when={this.props.hasUnsavedChanges && !this.props.saved && !this.props.saving}
          message={strings.unsavedChangesMessage}
        />
      </Dropzone>
    );
  }
}
