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

import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import union from 'lodash/union';
import unionWith from 'lodash/unionWith';
import uniqueId from 'lodash/uniqueId';
import isEmpty from 'lodash/isEmpty';
import { normalize, Schema, arrayOf } from 'normalizr';
import { getFileCategory } from './helpers';

const globalFetchLimit = 100;

// Define schemes for our entities
const story = new Schema('story');
const channel = new Schema('channels');
const event = new Schema('events');
const file = new Schema('files');
const flag = new Schema('flags', { idAttribute: 'storyFlagId' });
const metadata = new Schema('metadata', { idAttribute: 'metadataId' });  // fix this
const note = new Schema('notes');

story.define({
  channels: arrayOf(channel),
  events: arrayOf(event),
  files: arrayOf(file),
  flags: arrayOf(flag),
  metadata: arrayOf(metadata),
  notes: arrayOf(note)
});

/* Action Types */
export const LOAD_STORY = 'story/LOAD_STORY';
export const LOAD_STORY_SUCCESS = 'story/LOAD_STORY_SUCCESS';
export const LOAD_STORY_FAIL = 'story/LOAD_STORY_FAIL';

export const LOAD_PROTECTED_STORY = 'story/LOAD_PROTECTED_STORY';
export const LOAD_PROTECTED_STORY_SUCCESS = 'story/LOAD_PROTECTED_STORY_SUCCESS';
export const LOAD_PROTECTED_STORY_FAIL = 'story/LOAD_PROTECTED_STORY_FAIL';

export const LOAD_SAML_PROTECTED_STORY = 'story/LOAD_SAML_PROTECTED_STORY';

export const SAVE_STORY = 'story/SAVE_STORY';
export const SAVE_STORY_SUCCESS = 'story/SAVE_STORY_SUCCESS';
export const SAVE_STORY_FAIL = 'story/SAVE_STORY_FAIL';

export const STATUS = 'story/STATUS';
export const STATUS_SUCCESS = 'story/STATUS_SUCCESS';
export const STATUS_ERROR = 'story/STATUS_ERROR';

export const SET_DATA = 'story/SET_DATA';
export const SET_DATA_AND_NORMALIZE = 'story/SET_DATA_AND_NORMALIZE';
export const CLOSE_STORY = 'story/CLOSE_STORY';

export const SET_REFERRER_PATH = 'story/SET_REFERRER_PATH';
export const SET_STORY_DESCRIPTION_HEIGHT = 'story/SET_STORY_DESCRIPTION_HEIGHT';
export const SET_STORY_DESCRIPTION_SCROLL_TO = 'story/SET_STORY_DESCRIPTION_SCROLL_TO';
export const SET_STORY_ATTRIBUTE = 'story/SET_STORY_ATTRIBUTE';

export const TOGGLE_STORY_ATTRIBUTE = 'story/TOGGLE_STORY_ATTRIBUTE';
export const TOGGLE_STORY_ATTRIBUTE_FAIL = 'story/TOGGLE_STORY_ATTRIBUTE_FAIL';

export const LIKE_STORY = 'story/LIKE_STORY';
export const LIKE_STORY_FAIL = 'story/LIKE_STORY_FAIL';

export const SUBSCRIBE_STORY = 'story/SUBSCRIBE_STORY';
export const SUBSCRIBE_STORY_FAIL = 'story/SUBSCRIBE_STORY_FAIL';

export const ARCHIVE_STORY = 'story/ARCHIVE_STORY';
export const ARCHIVE_STORY_SUCCESS = 'story/ARCHIVE_STORY_SUCCESS';
export const ARCHIVE_STORY_FAIL = 'story/ARCHIVE_STORY_FAIL';

export const ADD_STORY_BOOKMARK = 'story/ADD_STORY_BOOKMARK';
export const ADD_STORY_BOOKMARK_SUCCESS = 'story/ADD_STORY_BOOKMARK_SUCCESS';
export const ADD_STORY_BOOKMARK_FAIL = 'story/ADD_STORY_BOOKMARK_FAIL';

export const DELETE_STORY_BOOKMARK = 'story/DELETE_STORY_BOOKMARK';
export const DELETE_STORY_BOOKMARK_SUCCESS = 'story/DELETE_STORY_BOOKMARK_SUCCESS';
export const DELETE_STORY_BOOKMARK_FAIL = 'story/DELETE_STORY_BOOKMARK_FAIL';

export const ADD_FLAG = 'story/ADD_FLAG';
export const ADD_FLAG_SUCCESS = 'story/ADD_FLAG_SUCCESS';
export const ADD_FLAG_FAIL = 'story/ADD_FLAG_FAIL';

export const REMOVE_FLAG = 'story/REMOVE_FLAG';
export const REMOVE_FLAG_SUCCESS = 'story/REMOVE_FLAG_SUCCESS';
export const REMOVE_FLAG_FAIL = 'story/REMOVE_FLAG_FAIL';

export const LOAD_HISTORY = 'story/LOAD_HISTORY';
export const LOAD_HISTORY_SUCCESS = 'story/LOAD_HISTORY_SUCCESS';
export const LOAD_HISTORY_FAIL = 'story/LOAD_HISTORY_FAIL';

export const ADD_CHANNEL = 'story/ADD_CHANNEL';
export const DELETE_CHANNEL = 'story/DELETE_CHANNEL';
export const SET_PRIMARY_CHANNEL = 'story/SET_PRIMARY_CHANNEL';

export const LOAD_CHANNEL = 'story/LOAD_CHANNEL';
export const LOAD_CHANNEL_SUCCESS = 'story/LOAD_CHANNEL_SUCCESS';
export const LOAD_CHANNEL_FAIL = 'story/LOAD_CHANNEL_FAIL';

/** Comments */
export const ADD_COMMENT = 'story/ADD_COMMENT';
export const ADD_COMMENT_SUCCESS = 'story/ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAIL = 'story/ADD_COMMENT_FAIL';

export const DELETE_COMMENT = 'story/DELETE_COMMENT';
export const DELETE_COMMENT_SUCCESS = 'story/DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAIL = 'story/DELETE_COMMENT_FAIL';

/** Thumbnail (Cover Art) */
export const UPLOAD_THUMBNAIL = 'story/UPLOAD_THUMBNAIL';
export const UPLOAD_THUMBNAIL_SUCCESS = 'story/UPLOAD_THUMBNAIL_SUCCESS';
export const UPLOAD_THUMBNAIL_FAIL = 'story/UPLOAD_THUMBNAIL_FAIL';
export const UPLOAD_THUMBNAIL_PROGRESS = 'story/UPLOAD_THUMBNAIL_PROGRESS';

/** Featured Image */
export const UPLOAD_FEATURED_IMAGE = 'story/UPLOAD_FEATURED_IMAGE';
export const UPLOAD_FEATURED_IMAGE_SUCCESS = 'story/UPLOAD_FEATURED_IMAGE_SUCCESS';
export const UPLOAD_FEATURED_IMAGE_FAIL = 'story/UPLOAD_FEATURED_IMAGE_FAIL';
export const UPLOAD_FEATURED_IMAGE_PROGRESS = 'story/UPLOAD_FEATURED_IMAGE_PROGRESS';

/* Files */
export const UPLOAD_FILES = 'story/UPLOAD_FILES';
export const UPLOAD_FILES_SUCCESS = 'story/UPLOAD_FILES_SUCCESS';
export const UPLOAD_FILES_FAIL = 'story/UPLOAD_FILES_FAIL';
export const UPLOAD_FILES_PROGRESS = 'story/UPLOAD_FILES_PROGRESS';

export const UPLOAD_FILE_THUMBNAIL = 'story/UPLOAD_FILE_THUMBNAIL';
export const UPLOAD_FILE_THUMBNAIL_SUCCESS = 'story/UPLOAD_FILE_THUMBNAIL_SUCCESS';
export const UPLOAD_FILE_THUMBNAIL_FAIL = 'story/UPLOAD_FILE_THUMBNAIL_FAIL';
export const UPLOAD_FILE_THUMBNAIL_PROGRESS = 'story/UPLOAD_FILE_THUMBNAIL_PROGRESS';

export const ADD_FILE = 'story/ADD_FILE';
export const TOGGLE_FILE_ATTRIBUTE = 'story/TOGGLE_FILE_ATTRIBUTE';
export const UPDATE_FILE = 'story/UPDATE_FILE';
export const UPDATE_FILE_CONVERT_SETTINGS = 'story/UPDATE_FILE_CONVERT_SETTINGS';
export const SET_FILE_ORDER = 'story/SET_FILE_ORDER';
export const FILTER_FILES = 'story/FILTER_FILES';

export const ADD_TAG_TO_CURRENT_FILE = 'story/ADD_TAG_TO_CURRENT_FILE';
export const SAVE_CURRENT_FILE_DATA = 'story/SAVE_CURRENT_FILE_DATA';
export const SET_FILE_EDIT_TMP_DATA = 'story/SET_FILE_EDIT_TMP_DATA';
export const TOGGLE_FILE_EDIT_MODAL = 'story/TOGGLE_FILE_EDIT_MODAL';

/** Forms */
export const ADD_FORM = 'story/ADD_FORM';

/** Events */
export const ADD_EVENT = 'story/ADD_EVENT';
export const UPDATE_EVENT = 'story/UPDATE_EVENT';

/** Tags */
export const ADD_TAG = 'story/ADD_TAG';
export const DELETE_TAG = 'story/DELETE_TAG';
export const SEARCH_TAGS_SUCCESS = 'story/SEARCH_TAGS_SUCCESS';
export const CLEAR_TAG_SUGGESTIONS = 'story/CLEAR_TAG_SUGGESTIONS';

/** Locations */
export const ADD_LOCATION = 'story/ADD_LOCATION';
export const DELETE_LOCATION = 'story/DELETE_LOCATION';

/** Metadata */
export const ADD_METADATA = 'story/ADD_METADATA';
export const UPDATE_METADATA = 'story/UPDATE_METADATA';
export const DELETE_METADATA = 'story/DELETE_METADATA';

/** Marketing */
export const SEARCH_CRM_CAMPAIGNS = 'story/SEARCH_CRM_CAMPAIGNS';
export const SEARCH_CRM_CAMPAIGNS_SUCCESS = 'story/SEARCH_CRM_CAMPAIGNS_SUCCESS';
export const SEARCH_CRM_CAMPAIGNS_FAIL = 'story/SEARCH_CRM_CAMPAIGNS_FAIL';

/** File Expiry */
export const SET_FILE_EXPIRY_DEFAULTS = 'story/SET_FILE_EXPIRY_DEFAULTS';

import { ADD_TAGS_TO_FILE_SUCCESS } from '../tag';

/* Reducers */
export const initialState = {
  loaded: false,
  loading: false,
  loadError: {},

  unlockError: {},

  saving: false,
  saved: false,
  saveError: {},

  hasUnsavedChanges: false,
  fileFilter: '',
  newFiles: [],
  pendingComment: null,
  referrerPath: '/',
  storyDescriptionHeight: null,
  storyDescriptionScrollTo: null,

  id: null,
  permId: null,
  type: 'story',
  author: 0,
  tab: 0,

  // Editable Attributes
  badgeTitle: '',
  badgeColour: '',
  colour: '',
  excerpt: '',
  message: '',  // description
  name: '',     // title
  //sequence: 0,
  status: '',  // processing, active, deleted, draft

  // Thumbnail (Cover Art)
  thumbnail: '',
  thumbnailDownloadUrl: '',
  thumbnailProgress: 0,
  thumbnailUploading: false,
  thumbnailSmall: '',  // 10px icon used by StoryHeader

  // Non-editable Attributes
  archivedAt: 0,
  bookmarkId: 0,
  rating: 0,
  updated: 0,
  ratingCount: 0,  // likeCount
  readCount: 0,

  // Featured
  featuredImage: '',
  featuredImageDownloadUrl: '',
  featuredImageUploading: false,
  featuredImageProgress: 0,
  featuredStartsAt: 0,
  featuredExpiresAt: 0,
  featuredAtTz: '',

  // Expiry/Publish
  expiresAt: 0,
  expiresAtTz: '',
  publishAt: 0,
  publishAtTz: '',

  // Sharing
  sharing: false,
  sharingPublic: false,
  sharingLinkedinDescription: '',
  sharingFacebookDescription: '',
  sharingTwitterDescription: '',
  sharingDownloadLimit: 0,
  sharingDownloadExpiry: 5,

  // History
  history: [],
  historyLoading: false,

  // Arrays
  comments: [],
  channels: [],
  crmCampaigns: [],
  events: [],
  files: [],
  flags: [],
  geolocations: [],
  metadata: [],
  notes: [],
  subscribers: [],
  tags: [],
  suggestedTags: [],

  channelsById: {},
  filesById: {},

  showEditModal: false,
  currentFileEditing: {},

  // Booleans
  annotating: false,
  isBookmark: false,
  isChannelWritable: false,
  isFeed: false,
  isLiked: false,
  isProtected: false,
  isGeoProtected: false,
  isRead: false,
  isSubscribed: false,
  notify: false,  // is this used?

  // Quicklink
  isQuicklink: false,  // remove?
  isQuickfile: false,  // remove?
  quicklinkType: 'url',  // url, file, form
  quicklinkUrl: '',
  quicklinkBackupUrl: '',

  // CRM Campaign Search
  campaigns: [],
  campaignsLoading: false,
  campaignsLoaded: false,
  campaignsError: null
};

export default function reducer(state = initialState, action = {}) {
  let newState;

  switch (action.type) {
    case LOAD_STORY:
      return {
        ...state,
        loading: true,
        loaded: false,
        storyDescriptionHeight: null
      };
    case LOAD_PROTECTED_STORY_SUCCESS:
    case LOAD_STORY_SUCCESS:
    case SAVE_STORY_SUCCESS: {
      // Protected/Locked Story
      if (action.result.isProtected && !action.result.author) {
        return {
          ...state,
          ...action.result,
          loading: false,
          loaded: true,
          loadError: {}
        };
      }

      // Normalize response
      const normalized = normalize(action.result, story);
      const isGeoProtected = action.result.geolocations && action.result.geolocations.length > 0;

      const authorId = action.result.author ? action.result.author.id : null;
      const tabId = action.result.tab.id;
      const channelIds = action.result.channels.map(c => c.id);

      // events of story
      const eventIds = action.result.events.map(e => e.id).filter(eId => (!action.events || action.events.findIndex(actEvt => actEvt.id === eId) !== -1));
      const eventsById = normalized.entities.events;
      if (action.events) {
        action.events.forEach(actionEvt => {
          if (actionEvt.id && eventIds.includes(actionEvt.id)) {
            eventsById[actionEvt.id] = {
              ...eventsById[actionEvt.id],
              ...actionEvt
            };
          } else {
            const tempId = uniqueId('newEvent-');
            eventIds.push(tempId);
            eventsById[tempId] = {
              ...actionEvt,
              id: tempId,
              isNew: true
            };
          }
        });
      }

      // files of story
      let fileIds = action.result.files.map(f => f.id);

      if (action.files) {
        fileIds = fileIds.filter(fId => action.files.findIndex(f => f.id === fId) !== -1);
      }

      let filesById = normalized.entities.files;

      if (action.files) {
        action.files.forEach(actionFile => {
          if (fileIds.includes(actionFile.id)) {
            filesById[actionFile.id] = {
              ...filesById[actionFile.id],
              ...actionFile
            };
          } else {
            fileIds.push(actionFile.id);
            filesById = {
              ...filesById,
              [actionFile.id]: {
                ...actionFile,
                isNew: true
              }
            };
          }
        });
      }

      const commentIds = action.result.comments.map(c => c.id);
      const data = action.type === SAVE_STORY_SUCCESS && typeof action.data === 'string' ? {
        ...JSON.parse(action.data),
        ...normalized.entities.story[action.result.id],
      } : {
        ...normalized.entities.story[action.result.id],
        ...action.data,
      };

      return {
        ...state,
        loading: false,
        loaded: true,
        loadError: {},
        saving: false,
        saved: action.type === SAVE_STORY_SUCCESS,
        unlocked: action.type === LOAD_PROTECTED_STORY_SUCCESS,

        hasUnsavedChanges: false,
        isGeoProtected: isGeoProtected,

        channelsById: normalized.entities.channels,   // required for edit
        eventsById: eventsById,       // required for edit
        filesById: filesById,         // required for edit
        flagsById: normalized.entities.flags,
        metadataById: normalized.entities.metadata,
        notesById: normalized.entities.notes,

        ...data,
        // entities store
        author: authorId,
        tab: tabId,
        channels: channelIds,
        comments: commentIds,
        events: eventIds,
        files: fileIds,
      };
    }
    case LOAD_STORY_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        loadError: action.error
      };

    case LOAD_PROTECTED_STORY:
      return {
        ...state,
        loading: true,
        unlocked: false,
        unlockError: {}
      };
    case LOAD_PROTECTED_STORY_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        unlockError: action.error
      };
    case SAVE_STORY:
      return {
        ...state,
        saving: true,
        saved: false,
        saveError: {},
        storyDescriptionHeight: null
      };
    case SAVE_STORY_FAIL:
      return {
        ...state,
        saving: false,
        saved: false,
        saveError: action.error
      };
    case STATUS_SUCCESS: {
      const normalized = normalize(action.result, story);
      const fileIds = action.result.files.map(f => f.id);

      // Fixes for bokmarks removed when status is fetched
      const fileList = normalized.entities.files;
      const filesTmp = {};

      if (fileList) {
        Object.keys(fileList).forEach(itemKey => {
          const item = fileList[itemKey];
          const isBookmarked = item.bookmarks === true || (item.bookmarks && !!item.bookmarks.length && item.bookmarks.some(b => b.stackSize === 1 && !b.deleted));

          filesTmp[itemKey] = {
            ...item,
            isBookmark: isBookmarked,
            isBookmarkSelf: isBookmarked,
            bookmarks: !!item.bookmarks
          };
        });
      }

      return {
        ...state,
        filesById: {
          ...state.filesById,
          ...filesTmp
        },
        files: union(state.files, fileIds),
      };
    }

    case SET_DATA:
      return { ...state,
        hasUnsavedChanges: true,
        ...action.data
      };

    case TOGGLE_FILE_EDIT_MODAL: {
      const toggle = !state.showEditModal;
      // Check whether openening modal with file data or resetting data
      const data = toggle ? action.data : {};
      return { ...state,
        showEditModal: !state.showEditModal,
        currentFileEditing: data
      };
    }
    case SET_FILE_EDIT_TMP_DATA: {
      let fileData = {
        ...state.currentFileEditing,
        ...action.data
      };
      if (action.data.parent) {
        const { parent, ...others } = action.data;
        fileData = {
          ...state.currentFileEditing,
          [parent]: {
            ...state.currentFileEditing[parent],
            ...others
          }
        };
      }

      return {
        ...state,
        currentFileEditing: fileData
      };
    }
    case SAVE_CURRENT_FILE_DATA: {
      const fileList = state.filesById;
      const { parent, ...newFile } = state.currentFileEditing;

      fileList[state.currentFileEditing.id] = {
        ...newFile
      };

      return {
        ...state,
        hasUnsavedChanges: true,
        showEditModal: false,
        filesById: {
          ...fileList,
        },
        currentFileEditing: {}
      };
    }
    case ADD_TAG_TO_CURRENT_FILE:
      return {
        ...state,
        currentFileEditing: {
          ...state.currentFileEditing,
          tags: [
            ...state.currentFileEditing.tags,
            { name: action.tag }
          ]
        }
      };

    case SET_DATA_AND_NORMALIZE: {
      const normalized = normalize(action.data, story);

      return {
        ...state,
        channelsById: { ...state.channelsById, ...normalized.entities.channels },
        eventsById: !isEmpty(state.eventsById) ? state.eventsById : normalized.entities.events,
        filesById: !isEmpty(state.filesById) ? state.filesById : normalized.entities.files,
        flagsById: normalized.entities.flags,
        metadataById: normalized.entities.metadata,
        notesById: normalized.entities.notes,
        ...normalized.entities.story[action.data.id],
        files: !isEmpty(state.files) ? state.files : normalized.entities.story[action.data.id].files
      };
    }

    case CLOSE_STORY:
      return {
        ...initialState,
        referrerPath: state.referrerPath,

        comments: [],
        channels: [],
        events: [],
        files: [],
        flags: [],
        geolocations: [],
        history: [],
        metadata: [],
        notes: [],
        subscribers: [],
        tags: [],
        suggestedTags: [],
        ...action.data
      };

    case SET_REFERRER_PATH:
      return {
        ...state,
        referrerPath: action.path,
      };
    case SET_STORY_DESCRIPTION_HEIGHT:
      return {
        ...state,
        storyDescriptionHeight: action.height,
      };
    case SET_STORY_DESCRIPTION_SCROLL_TO:
      return {
        ...state,
        storyDescriptionScrollTo: action.offsetTop,
      };

    case SET_STORY_ATTRIBUTE:
      return {
        ...state,
        hasUnsavedChanges: true,
        [action.name]: action.value
      };

    case TOGGLE_STORY_ATTRIBUTE:
      return {
        ...state,
        hasUnsavedChanges: true,
        [action.name]: !state[action.name]
      };
    case TOGGLE_STORY_ATTRIBUTE_FAIL:
      return {
        ...state,
        [action.name]: !state[action.name]
      };
    case ARCHIVE_STORY:
    case ARCHIVE_STORY_SUCCESS:
      return state;
    case ARCHIVE_STORY_FAIL:
      return {
        ...state,
        archiveError: action.error.error
      };

    /**
     * Bookmark
     */
    case ADD_STORY_BOOKMARK_FAIL:
    case DELETE_STORY_BOOKMARK_FAIL:
      return {
        ...state,
        bookmarkError: action.error.error
      };

    /**
     * Flags
     */
    case ADD_FLAG:
    case REMOVE_FLAG:
      return state;
    case ADD_FLAG_FAIL:
    case REMOVE_FLAG_FAIL:
      return {
        ...state,
        flagsError: action.result
      };
    case ADD_FLAG_SUCCESS: {
      const newFlagsById = { ...state.flagsById,
        [action.result.storyFlagId]: action.result
      };

      const newFlags = [...state.flags];
      newFlags.push(action.result.storyFlagId);

      return {
        ...state,
        flagsById: newFlagsById,
        flags: newFlags
      };
    }
    case REMOVE_FLAG_SUCCESS:
      // Remove all flags
      if (!action.flagId) {
        return {
          ...state,
          flagsById: {},
          flags: []
        };
      }

      // Set individual flag as deleted
      return { ...state,
        flagsById: {
          ...state.flagsById,
          [action.flagId]: {
            ...state.flagsById[action.flagId],
            deleted: true
          }
        }
      };

    /**
     * History
     */
    case LOAD_HISTORY:
      return {
        ...state,
        historyLoading: true
      };
    case LOAD_HISTORY_SUCCESS:
      return {
        ...state,
        history: action.result,
        historyLoading: false
      };
    case LOAD_HISTORY_FAIL:
      return {
        ...state,
        historyLoading: false
      };

    /**
     * Channels
     */
    case ADD_CHANNEL:
    case LOAD_CHANNEL_SUCCESS: {
      let channelData = action.data;

      // Parse v4 API data
      if (action.type === LOAD_CHANNEL_SUCCESS) {
        channelData = {
          alias: state.channels.length !== 0, // Set this channel as primary (alias = false) if channel list is empty
          colour: action.result.default_colour,
          description: action.result.description,
          id: action.result.id,
          isFeed: !!action.result.is_feed,
          isHidden: action.result.hidden,
          isReadable: action.result.readable,
          isSubscribed: !!action.result.is_subscribed,
          isWritable: action.result.writable,
          name: action.result.type,
          thumbnail: action.result.featured_img,
          type: 'channel'
        };
      }

      // Merge if already exists
      if (state.channelsById && state.channelsById[channelData.id]) {
        return { ...state,
          channelsById: {
            ...state.channelsById,
            [channelData.id]: {
              ...state.channelsById[channelData.id],
              ...channelData,
              deleted: false
            }
          }
        };
      }

      newState = { ...state,
        hasUnsavedChanges: true,
        channelsById: {
          ...state.channelsById,
          [channelData.id]: channelData
        },
        channels: [...state.channels]
      };
      newState.channels.push(channelData.id);
      return newState;
    }

    case DELETE_CHANNEL:
      return { ...state,
        hasUnsavedChanges: true,
        channelsById: {
          ...state.channelsById,
          [action.id]: {
            ...state.channelsById[action.id],
            deleted: true
          }
        }
      };

    case SET_PRIMARY_CHANNEL:
      newState = { ...state,
        hasUnsavedChanges: true,
        channelsById: { ...state.channelsById },
        channels: [...state.channels]
      };

      newState.channels.forEach(id => {
        if (id === action.id) {
          newState.channelsById[id].alias = false;  // primary channel
        } else {
          newState.channelsById[id].alias = true;
        }
      });

      return newState;


    /**
     * Comments
     */
    case ADD_COMMENT:
      return {
        ...state,
        pendingComment: action.data
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        pendingComment: null
      };
    case ADD_COMMENT_FAIL:
      return {
        ...state,
        pendingComment: {
          ...state.pendingComment,
          error: action.error
        }
      };

    /**
     * Thumbnail (Cover Art)
     */
    case UPLOAD_THUMBNAIL:
      return {
        ...state,
        thumbnail: action.file.preview,
        thumbnailUploading: true
      };
    case UPLOAD_THUMBNAIL_SUCCESS:
      return {
        ...state,
        hasUnsavedChanges: true,
        thumbnail: action.result.url,
        thumbnailUploading: false
      };
    case UPLOAD_THUMBNAIL_FAIL:
      return {
        ...state,
        thumbnailError: action.error,
        thumbnailUploading: false
      };
    case UPLOAD_THUMBNAIL_PROGRESS:
      return {
        ...state,
        thumbnailProgress: action.progress || 100,  // If progress is undefined, assume complete
        thumbnailUploading: true
      };

    /**
     * Featured Image
     */
    case UPLOAD_FEATURED_IMAGE:
      return {
        ...state,
        featuredImage: action.file.preview,
        featuredImageUploading: true
      };
    case UPLOAD_FEATURED_IMAGE_SUCCESS:
      return {
        ...state,
        hasUnsavedChanges: true,
        featuredImageUploading: false
      };
    case UPLOAD_FEATURED_IMAGE_FAIL:
      return {
        ...state,
        featuredImageError: action.error,
        featuredImageUploading: false
      };
    case UPLOAD_FEATURED_IMAGE_PROGRESS:
      return {
        ...state,
        featuredImageProgress: action.progress || 100,  // If progress is undefined, assume complete
        featuredImageUploading: false
      };

    /**
     * Files
     */
    case UPLOAD_FILES: {
      newState = { ...state,
        filesById: { ...state.filesById },
        files: [...state.files]
      };

      // Add each file
      action.files.forEach((f) => {
        if (isNumber(f.filePermId)) {
          const currentFile = newState.filesById[f.id];
          currentFile.isNew = !isNumber(f.filePermId);
          currentFile.uploading = true;
          currentFile.showOptions = false;
          currentFile.description = f.name;
        } else {
          newState.filesById[f.id] = {
            id: f.id,
            category: getFileCategory(f),
            description: f.name,
            filename: f.name,
            size: f.size,
            convertSettings: f.convertSettings || {},
            hasWatermark: f.hasWatermark || false,
            allowHubshareDownloads: !!f.allowHubshareDownloads,
            shareStatus: f.shareStatus || 'optional',
            isNew: true,
            uploading: true
          };
          newState.files.push(f.id);
        }
      });
      return newState;
    }
    case UPLOAD_FILES_SUCCESS: {
      if (!action.result || action.errors || action.result.errors) {
        return state;
      }
      newState = { ...state,
        hasUnsavedChanges: true,
        filesById: { ...state.filesById }
      };
      // Merge returned data in to file object
      // We assume the retuned data is in the same order
      // as the original upload
      action.result.forEach((f, i) => {
        newState.filesById[action.files[i].id] = {
          ...newState.filesById[action.files[i].id],
          uploading: false,
          progress: 100,
          isUploaded: true,
          customDetailsIsEnabled: action.fileDefaults && action.fileDefaults.customDetailsIsEnabled,
          expiresAt: action.fileDefaults && action.fileDefaults.expiresAt,
          expiresAtTz: action.fileDefaults && action.fileDefaults.expiresAtTz,
          // Add url property by Jason Huang 2016-12-16
          url: action.files[i].url,
          // Display options on file complete
          showOptions: true,
          ...f
        };
      });
      return newState;
    }
    case UPLOAD_FILES_FAIL: {
      newState = { ...state,
        filesById: { ...state.filesById }
      };

      // Merge returned data in to file object
      // We assume the retuned data is in the same order
      // as the original upload
      action.files.forEach((f, i) => {
        newState.filesById[action.files[i].id] = {
          ...newState.filesById[action.files[i].id],
          uploading: false,
          progress: 0,
          error: action.error
        };
      });

      return newState;
    }
    case UPLOAD_FILES_PROGRESS: {
      newState = { ...state,
        filesById: { ...state.filesById }
      };

      // Merge returned data in to file object
      // We assume the retuned data is in the same order
      // as the original upload
      action.files.forEach((f, i) => {
        newState.filesById[action.files[i].id] = {
          ...newState.filesById[action.files[i].id],
          // If progress is undefined, assume complete
          progress: action.progress || 100,

          // Use preview as thumbnail if image file
          thumbnail: newState.filesById[action.files[i].id].category === 'image' ? f.preview : ''
        };
      });

      return newState;
    }

    case UPLOAD_FILE_THUMBNAIL:
      newState = { ...state,
        hasUnsavedChanges: true,
        filesById: { ...state.filesById }
      };

      newState.filesById[action.id] = {
        ...state.filesById[action.id],
        thumbnailUploading: true
      };

      return newState;
    case UPLOAD_FILE_THUMBNAIL_SUCCESS:
      newState = { ...state,
        filesById: { ...state.filesById }
      };

      newState.filesById[action.id] = {
        ...state.filesById[action.id],
        thumbnail: action.result.thumbnail,
        thumbnailUploading: false
      };

      return newState;
    case UPLOAD_FILE_THUMBNAIL_FAIL:
      newState = { ...state,
        filesById: { ...state.filesById }
      };

      newState.filesById[action.id] = {
        ...state.filesById[action.id],
        thumbnail: '',
        thumbnailUploading: false,
        error: action.error
      };

      return newState;
    case UPLOAD_FILE_THUMBNAIL_PROGRESS:
      newState = { ...state,
        filesById: { ...state.filesById }
      };

      newState.filesById[action.id] = {
        ...state.filesById[action.id],
        progress: action.progress || 100
      };

      return newState;

    case ADD_FILE: {
      const isNew = !action.params.shareStatus && !action.params.filePermId;
      newState = {
        ...state,
        hasUnsavedChanges: true,
        filesById: {
          ...state.filesById,
          [action.file.id]: {
            ...action.file,
            isNew
          }
        }
      };
      // if we're not updating existing file, push file to files array
      if (isNew) {
        newState.files.push(action.file.id);
      }

      return newState;
    }
    case TOGGLE_FILE_ATTRIBUTE:
      newState = { ...state,
        filesById: { ...state.filesById }
      };

      newState.filesById[action.id] = {
        ...state.filesById[action.id],
        [action.name]: !state.filesById[action.id][action.name]
      };

      return newState;
    case UPDATE_FILE:
      newState = { ...state,
        hasUnsavedChanges: true,
        filesById: { ...state.filesById }
      };

      newState.filesById[action.id] = {
        ...state.filesById[action.id],
        ...action.attrs
      };

      return newState;
    case UPDATE_FILE_CONVERT_SETTINGS:
      newState = { ...state,
        hasUnsavedChanges: true,
        filesById: { ...state.filesById }
      };

      newState.filesById[action.id] = {
        ...state.filesById[action.id],
        convertSettings: {
          ...state.filesById[action.id].convertSettings,
          ...action.attrs
        }
      };

      return newState;
    case SET_FILE_ORDER: {
      return {
        ...state,
        hasUnsavedChanges: true,
        files: action.order
      };
    }
    case FILTER_FILES: {
      return {
        ...state,
        fileFilter: action.value
      };
    }
    case SET_FILE_EXPIRY_DEFAULTS: {
      const filesById = {};
      Object.keys(state.filesById).forEach(itemKey => {
        filesById[itemKey] = {
          ...state.filesById[itemKey],
          expiresAt: action.fileExpiryDefaults.expiresAt,
          expiresAtTz: action.fileExpiryDefaults.expiresAtTz
        };
      });

      return {
        ...state,
        hasUnsavedChanges: true,
        filesById
      };
    }

    /**
     * Forms
     */
    case ADD_FORM: {
      newState = { ...state,
        hasUnsavedChanges: true,
        filesById: { ...state.filesById,
          [action.form.id]: {
            ...action.form,
            isNew: true
          }
        }
      };

      newState.files.push(action.form.id);

      return newState;
    }

    /**
     * Events/Meetings
     */
    case ADD_EVENT:
      newState = { ...state,
        hasUnsavedChanges: true,
        eventsById: { ...state.eventsById,
          [action.id]: {
            ...action.attrs,
            id: action.id,
            isNew: true
          } }
      };

      newState.events.push(action.id);

      return newState;
    case UPDATE_EVENT:
      newState = { ...state,
        hasUnsavedChanges: true,
        eventsById: { ...state.eventsById }
      };

      newState.eventsById[action.id] = {
        ...state.eventsById[action.id],
        ...action.attrs
      };

      return newState;

    /**
     * Tags
     */
    case ADD_TAG: {
      // Ignore duplicate
      if (state.tags.indexOf(action.name) > -1) {
        return state;
      }

      return { ...state,
        hasUnsavedChanges: true,
        tags: [...state.tags, action.name]
      };
    }
    case DELETE_TAG: {
      const newTags = [...state.tags];
      newTags.splice(action.index, 1);

      return { ...state,
        hasUnsavedChanges: true,
        tags: newTags
      };
    }
    case SEARCH_TAGS_SUCCESS:
      return { ...state,
        suggestedTags: action.result
      };
    case CLEAR_TAG_SUGGESTIONS:
      return { ...state,
        suggestedTags: []
      };

    /**
     * Geolocations
     */
    case ADD_LOCATION:
      return { ...state,
        hasUnsavedChanges: true,
        geolocations: [...state.geolocations, action.data]
      };
    case DELETE_LOCATION: {
      const newLocations = [...state.geolocations];
      newLocations.splice(action.index, 1);

      return { ...state,
        hasUnsavedChanges: true,
        geolocations: newLocations
      };
    }

    /**
     * Metadata
     */
    case ADD_METADATA:
      newState = { ...state,
        hasUnsavedChanges: true,
        metadataById: { ...state.metadataById }
      };

      newState.metadataById[action.metadataId] = {
        ...action.attrs,
        metadataId: action.metadataId,
        new: true
      };

      newState.metadata.push(action.metadataId);

      return newState;
    case UPDATE_METADATA:
      newState = { ...state,
        hasUnsavedChanges: true,
        metadataById: { ...state.metadataById }
      };

      newState.metadataById[action.metadataId] = {
        ...state.metadataById[action.metadataId],
        ...action.attrs
      };

      return newState;
    case DELETE_METADATA:
      newState = { ...state,
        hasUnsavedChanges: true,
        metadata: state.metadata.filter(item => item !== action.metadataId)
      };

      return newState;

    /**
     * Marketing
     */
    case SEARCH_CRM_CAMPAIGNS:
      return {
        ...state,
        campaignsLoading: true,
        campaignsError: null
      };
    case SEARCH_CRM_CAMPAIGNS_SUCCESS: {
      // merge results if not searching
      let campaigns = action.result.objects;
      if (!action.search) {
        campaigns = unionWith(state.campaigns, action.result.objects, isEqual);
      }

      return {
        ...state,
        campaignsLoading: false,
        campaignsLoaded: !action.result.nextPage,
        campaignsNextPage: action.result.nextPage,
        campaigns: campaigns
      };
    }
    case SEARCH_CRM_CAMPAIGNS_FAIL: {
      return {
        ...state,
        campaignsLoading: false,
        campaignsLoaded: false,
        campaignsError: action.error
      };
    }
    case ADD_TAGS_TO_FILE_SUCCESS: {
      const stateTags = state.filesById[action.params.fileId] ? state.filesById[action.params.fileId].tags : [];

      return {
        ...state,
        filesById: {
          ...state.filesById,
          [action.params.fileId]: {
            ...state.filesById[action.params.fileId],
            tags: [...stateTags, {
              id: action.params.tagId,
              name: action.params.tagName
            }]
          }
        }
      };
    }

    default:
      return state;
  }
}

/* Action Creators */

/**
 * Load Story by permId
 */
export function load(permId, data, events, files) {
  return {
    types: [LOAD_STORY, LOAD_STORY_SUCCESS, LOAD_STORY_FAIL],
    data,
    events,
    files,
    promise: (client) => client.get('/story/get', 'webapi', {
      params: {
        permId: permId
      }
    })
  };
}

/**
 * Load Story by id (revisionId)
 */
export function loadRevision(revisionId) {
  return {
    types: [LOAD_STORY, LOAD_STORY_SUCCESS, LOAD_STORY_FAIL],
    promise: (client) => client.get('/story/get', 'webapi', {
      params: {
        id: revisionId
      }
    })
  };
}

/**
 * Load Archived Story as admin by id (permId)
 */
export function loadArchived(permId) {
  return {
    types: [LOAD_STORY, LOAD_STORY_SUCCESS, LOAD_STORY_FAIL],
    promise: (client) => client.get(`/admin/stories/archived/${permId}`, 'webapi')
  };
}

/**
 * Load Protected Story by permId
 */
export function loadProtected(permId, password) {
  return {
    types: [LOAD_PROTECTED_STORY, LOAD_PROTECTED_STORY_SUCCESS, LOAD_PROTECTED_STORY_FAIL],
    promise: (client) => client.post('/story/get', 'webapi', {
      data: {
        permId: permId,
        password: password
      }
    })
  };
}

/**
 * Load SAML Protected Story by permId
 */
export function loadSamlProtected(permId, storyAccessToken) {
  return {
    types: [LOAD_SAML_PROTECTED_STORY, LOAD_PROTECTED_STORY_SUCCESS, LOAD_PROTECTED_STORY_FAIL],
    promise: (client) => client.post('/story/get', 'webapi', {
      data: {
        permId: permId,
        storyAccessToken: storyAccessToken
      }
    })
  };
}

/**
 * Save Story
 */
export function save(body, filesToUpdate) {
  return {
    types: [SAVE_STORY, SAVE_STORY_SUCCESS, SAVE_STORY_FAIL],
    data: JSON.stringify(body),
    promise: (client) => client.post('/story/save', 'webapi', {
      data: {
        body: JSON.stringify({
          ...body,
          // Unsplash new image requirements
          thumbnail: body.thumbnailDownloadUrl ? body.thumbnailDownloadUrl : body.thumbnail,
          featuredImage: body.featuredImageDownloadUrl ? body.featuredImageDownloadUrl : body.featuredImage,
        }),
        new_file_options: filesToUpdate
      },
    })
  };
}

/**
 * Story Status
 */
export function checkStatus(revisionId) {
  return {
    types: [STATUS, STATUS_SUCCESS, STATUS_ERROR],
    promise: (client) => client.get('/story/status', 'webapi', {
      params: {
        id: revisionId
      }
    })
  };
}

/**
 * Set Story data without fetching
 */
export function setData(data) {
  return {
    type: SET_DATA,
    data
  };
}

/**
 * Set Story data and normalize arrays
 */
export function setDataAndNormalize(data) {
  return {
    type: SET_DATA_AND_NORMALIZE,
    data
  };
}

/**
 * Clears existing Story data
 */
export function close(data) {
  return {
    type: CLOSE_STORY,
    data
  };
}

/**
 * Set any Attribute by name
 */
export function setAttribute(name, value) {
  return {
    type: SET_STORY_ATTRIBUTE,
    name,
    value
  };
}

/**
 * Set storyDescription iframe height (postMessage
 */
export function setDescriptionHeight(height) {
  return {
    type: SET_STORY_DESCRIPTION_HEIGHT,
    height
  };
}

/**
 * Set storyDescription scrollTo position (postMessage)
 */
export function setScrollTo(offsetTop) {
  return {
    type: SET_STORY_DESCRIPTION_SCROLL_TO,
    offsetTop
  };
}

/**
 * Set referrer to assist in redirect on close
 */
export function setReferrerPath(path) {
  return {
    type: SET_REFERRER_PATH,
    path
  };
}

/**
 * Toggles boolean attributes without API call (Story Edit)
 * Used for:
    isFeed
    isProtected
    isGeoProtected
    isRead
    isQuicklink
    isQuickfile
*/
export function toggleAttribute(name) {
  return {
    type: TOGGLE_STORY_ATTRIBUTE,
    name
  };
}

/**
 * Toggles boolean attribute with API call (Story Detail)
 */
export function like(permId, isLiked = true) {
  return {
    types: [LIKE_STORY, null, LIKE_STORY_FAIL],
    permId,
    isLiked,
    promise: (client) => client.post('/story/like', 'webapi', {
      params: {
        permId: permId,
        like: +!!isLiked  // 0/1
      }
    })
  };
}

export function subscribe(permId, isSubscribed = true) {
  return {
    types: [SUBSCRIBE_STORY, null, SUBSCRIBE_STORY_FAIL],
    permId,
    isSubscribed,
    promise: (client) => client.post('/story/subscribe', 'webapi', {
      params: {
        permId: permId,
        subscribe: +!!isSubscribed  // 0/1
      }
    })
  };
}

/**
 * Archive Story
 */
export function archive(id, permId) {
  return {
    types: [ARCHIVE_STORY, ARCHIVE_STORY_SUCCESS, ARCHIVE_STORY_FAIL],
    permId,
    promise: (client) => client.post('/story/archive', 'webapi', {
      params: {
        id: id
      }
    })
  };
}

/**
 * Bookmark Story
 */
export function addBookmark(name, permId) {
  return {
    types: [ADD_STORY_BOOKMARK, ADD_STORY_BOOKMARK_SUCCESS, ADD_STORY_BOOKMARK_FAIL],
    permId,
    promise: (client) => client.post('/me/addBookmark', 'webapi', {
      params: {
        name: name,
        type: 'story',
        data: JSON.stringify([{ story_perm_id: permId }])
      }
    })
  };
}

export function deleteBookmark(bookmarkId, permId) {
  return {
    types: [DELETE_STORY_BOOKMARK, DELETE_STORY_BOOKMARK_SUCCESS, DELETE_STORY_BOOKMARK_FAIL],
    permId,
    bookmarkId,
    promise: (client) => client.post('/me/deleteBookmark', 'webapi', {
      params: {
        id: bookmarkId
      }
    })
  };
}

/**
 * Flag Story
 */
export function addFlag(permId, flagId, message) {
  return {
    types: [ADD_FLAG, ADD_FLAG_SUCCESS, ADD_FLAG_FAIL],
    promise: (client) => client.post('/story/flag', 'webapi', {
      params: {
        id: permId,
        flag_id: flagId,
        comment: message
      }
    })
  };
}

export function removeFlag(permId, flagId = 0, message = '') {
  return {
    types: [REMOVE_FLAG, REMOVE_FLAG_SUCCESS, REMOVE_FLAG_FAIL],
    flagId: flagId,
    promise: (client) => client.post('/story/unflag', 'webapi', {
      params: {
        id: permId,
        story_flag_id: flagId,
        comment: message
      }
    })
  };
}

/**
 * Story History
 */
export function loadHistory(permId, offset = 0) {
  return {
    types: [LOAD_HISTORY, LOAD_HISTORY_SUCCESS, LOAD_HISTORY_FAIL],
    promise: (client) => client.get('/story/history', 'webapi', {
      params: {
        perm_id: permId,
        limit: globalFetchLimit,
        offset: offset
      }
    })
  };
}

/**
 * Channels
 */
export function addChannel(data) {
  // Name not known - load Channel
  if (!data.name) {
    return {
      types: [LOAD_CHANNEL, LOAD_CHANNEL_SUCCESS, LOAD_CHANNEL_FAIL],
      promise: (client) => client.post('/channel/get', 'webapi4', {
        params: {
          id: data.id
        }
      })
    };
  }

  return {
    type: ADD_CHANNEL,
    data
  };
}

export function deleteChannel(id) {
  return {
    type: DELETE_CHANNEL,
    id
  };
}

export function setPrimaryChannel(id) {
  return {
    type: SET_PRIMARY_CHANNEL,
    id
  };
}

/**
 * Comments
 */
export function addComment(data) {
  return {
    types: [ADD_COMMENT, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAIL],
    data,
    promise: (client) => client.post('/story/comment', 'webapi', {
      params: {
        id: data.storyId,
        comment: data.message,
        reply_to: data.parentId
      }
    })
  };
}

export function deleteComment(id, storyPermId, totalCommentsDeleted) {
  return {
    types: [DELETE_COMMENT, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAIL],
    id,
    storyPermId,
    totalCommentsDeleted: totalCommentsDeleted,
    promise: (client) => client.post('/story/deleteComment', 'webapi', {
      params: {
        id
      }
    })
  };
}

/**
 * Thumbnail (Cover Art)
 */
export function uploadThumbnailProgress(fileObj, progress) {
  return {
    type: UPLOAD_THUMBNAIL_PROGRESS,
    file: fileObj,
    progress
  };
}

export function uploadThumbnail(fileObj, dispatch) {
  return {
    types: [UPLOAD_THUMBNAIL, UPLOAD_THUMBNAIL_SUCCESS, UPLOAD_THUMBNAIL_FAIL],
    file: fileObj,
    promise: (client) => client.post('/imagelibrary/upload', 'webapi', {
      params: {
        type: 'cover_art',
        uploadData: {
          image: [fileObj]
        }
      },
      progress: (e) => {
        dispatch(uploadThumbnailProgress(fileObj, e.percent));
      }
    })
  };
}

/**
 * Featured Story
 */
export function uploadFeaturedImageProgress(fileObj, progress) {
  return {
    type: UPLOAD_FEATURED_IMAGE_PROGRESS,
    file: fileObj,
    progress
  };
}

/**
 * Currently expects an image file
 * need to set up a base64 action creator
 */
export function uploadFeaturedImage(fileObj, dispatch) {
  return {
    types: [UPLOAD_FEATURED_IMAGE, UPLOAD_FEATURED_IMAGE_SUCCESS, UPLOAD_FEATURED_IMAGE_FAIL],
    file: fileObj,
    promise: (client) => client.post('/story/uploadFile', 'webapi', {
      params: {
        upload_type: 'featured_story_image',
        uploadData: {
          file: [fileObj]
        }
      },
      progress: (e) => {
        dispatch(uploadFeaturedImageProgress(fileObj, e.percent));
      }
    })
  };
}

/**
 * Files
 */
export function toggleFileEditModal(data) {
  return {
    type: TOGGLE_FILE_EDIT_MODAL,
    data
  };
}
export function setFileEditData(data) {
  return {
    type: SET_FILE_EDIT_TMP_DATA,
    data
  };
}
export function addTagToCurrentFile(tag) {
  return {
    type: ADD_TAG_TO_CURRENT_FILE,
    tag: tag
  };
}
export function saveCurrentFileData() {
  return {
    type: SAVE_CURRENT_FILE_DATA
  };
}

export function downloadFiles(permId, fileIds) {
  return {
    types: [null, null, null],
    promise: (client) => client.get('/story/downloadFiles', 'webapi', {
      params: {
        permId,
        fileIds
      }
    })
  };
}

export function uploadFilesProgress(files = [], progress) {
  return {
    type: UPLOAD_FILES_PROGRESS,
    files,
    progress
  };
}

export function uploadFiles(files = [], dispatch, fileDefaults) {
  return {
    types: [UPLOAD_FILES, UPLOAD_FILES_SUCCESS, UPLOAD_FILES_FAIL],
    files,
    fileDefaults,
    promise: (client) => client.post('/story/uploadFile', 'webapi', {
      params: {
        upload_type: 'file',
        uploadData: {
          file: files
        }
      },
      progress: (e) => {
        dispatch(uploadFilesProgress([...files], e.percent));
      }
    })
  };
}

export function uploadFileThumbnailProgress(files = [], progress) {
  return {
    type: UPLOAD_FILE_THUMBNAIL_PROGRESS,
    files,
    progress
  };
}

export function uploadFileThumbnail(fileObj = {}, fileId, filename, dispatch) {
  return {
    types: [UPLOAD_FILE_THUMBNAIL, UPLOAD_FILE_THUMBNAIL_SUCCESS, UPLOAD_FILE_THUMBNAIL_FAIL],
    id: fileId,
    promise: (client) => client.post('/story/uploadFile', 'webapi', {
      params: {
        upload_type: 'file_thumbnail',
        filename: filename,  // filename to attach the thumbnail to
        uploadData: {
          file: [fileObj]
        }
      },
      progress: (e) => {
        dispatch(uploadFileThumbnailProgress(fileObj, e.percent));
      }
    })
  };
}

export function deleteUploadedFile(fileObj) {
  return {
    types: [UPDATE_FILE, null, null],
    id: fileObj.id,
    attrs: { deleted: true },
    promise: (client) => client.post('/story/delete_uploaded_file', 'webapi4', {
      params: {
        filename: fileObj.filename,
        file_type: 'file'
      }
    })
  };
}

export function addFile(fileObj, shareStatus = '', filePermId = null) {
  return {
    type: ADD_FILE,
    file: fileObj,
    params: {
      shareStatus: shareStatus,
      filePermId: filePermId
    }
  };
}

export function toggleFileAttribute(id, name) {
  return {
    type: TOGGLE_FILE_ATTRIBUTE,
    id,
    name
  };
}

export function updateFile(id, attrs) {
  return {
    type: UPDATE_FILE,
    id,
    attrs
  };
}

export function updateFileConvertSettings(id, attrs) {
  return {
    type: UPDATE_FILE_CONVERT_SETTINGS,
    id,
    attrs
  };
}

export function setFileOrder(order) {
  return {
    type: SET_FILE_ORDER,
    order
  };
}

export function filterFiles(value) {
  return {
    type: FILTER_FILES,
    value
  };
}

/**
 * Forms
 */
export function addForm(form) {
  return {
    type: ADD_FORM,
    form
  };
}

/**
 * Events/Meetings
 */
export function addEvent(attrs) {
  const tempId = uniqueId('newEvent-');
  return {
    type: ADD_EVENT,
    id: tempId,
    attrs
  };
}

export function updateEvent(id, attrs) {
  return {
    type: UPDATE_EVENT,
    id,
    attrs
  };
}

/**
 * Tags
 */
export function addTag(name) {
  return {
    type: ADD_TAG,
    name
  };
}

export function deleteTag(index) {
  return {
    type: DELETE_TAG,
    index
  };
}

export function searchTags(string = '') {
  return {
    types: [null, SEARCH_TAGS_SUCCESS, null],
    promise: (client) => client.get('/story/tags', 'webapi', {
      params: {
        search: string
      }
    })
  };
}

export function clearTagSuggestions() {
  return {
    type: CLEAR_TAG_SUGGESTIONS
  };
}

/**
 * Locations
 */
export function addLocation(data) {
  return {
    type: ADD_LOCATION,
    data
  };
}

export function deleteLocation(index) {
  return {
    type: DELETE_LOCATION,
    index
  };
}

/**
 * Metadata
 */
export function addMetadata(attrs) {
  const tempId = uniqueId('newMetadata-');

  return {
    type: ADD_METADATA,
    metadataId: tempId,
    attrs
  };
}

export function updateMetadata(attrs) {
  return {
    type: UPDATE_METADATA,
    metadataId: attrs.metadataId,
    attrs
  };
}

export function deleteMetadata(id) {
  return {
    type: DELETE_METADATA,
    metadataId: id
  };
}

/**
 * Marketing (CRM Campaigns)
 */
export function searchCrmCampaigns(source, type, search, page, limit) {
  return {
    types: [SEARCH_CRM_CAMPAIGNS, SEARCH_CRM_CAMPAIGNS_SUCCESS, SEARCH_CRM_CAMPAIGNS_FAIL],
    search,
    promise: (client) => client.get('/crm/search', 'webapi', {
      params: {
        source: source,
        type: type,
        search: search,
        page: page,
        limit: limit || globalFetchLimit
      }
    })
  };
}

export function setFileExpiryDefaults(fileExpiryDefaults) {
  return {
    type: SET_FILE_EXPIRY_DEFAULTS,
    fileExpiryDefaults
  };
}
