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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import { normalize, Schema, arrayOf } from 'normalizr';
import merge from 'lodash/merge';
import union from 'lodash/union';

const globalFetchLimit = 100;
const galleryFetchLimit = 28;

// Define schemes for our entities
const tab = new Schema('tabs');
const channel = new Schema('channels');
const story = new Schema('stories', { idAttribute: 'permId' });
const file = new Schema('files');

// Forms
const category = new Schema('categories', {
  defaults: {
    type: 'category',
    formCount: 0,
  }
});
const form = new Schema('forms', { defaults: { type: 'form' } });

// Kloduless Repositories
const repo = new Schema('repos');

// Cover art library
const image = new Schema('images');

// Define nesting rules
tab.define({
  channels: arrayOf(channel)
});

channel.define({
  stories: arrayOf(story)
});

story.define({
  files: arrayOf(file)
});

category.define({
  forms: arrayOf(form)
});

repo.define({
  contents: arrayOf(file)
});

/* Action Types */
export const RESET = 'browser/RESET';

export const LOAD_TABS = 'browser/LOAD_TABS';
export const LOAD_TABS_SUCCESS = 'browser/LOAD_TABS_SUCCESS';
export const LOAD_TABS_FAIL = 'browser/LOAD_TABS_FAIL';

export const LOAD_CHANNELS = 'browser/LOAD_CHANNELS';
export const LOAD_CHANNELS_SUCCESS = 'browser/LOAD_CHANNELS_SUCCESS';
export const LOAD_CHANNELS_FAIL = 'browser/LOAD_CHANNELS_FAIL';

export const LOAD_STORIES = 'browser/LOAD_STORIES';
export const LOAD_STORIES_SUCCESS = 'browser/LOAD_STORIES_SUCCESS';
export const LOAD_STORIES_FAIL = 'browser/LOAD_STORIES_FAIL';

export const LOAD_FILES = 'browser/LOAD_FILES';
export const LOAD_FILES_SUCCESS = 'browser/LOAD_FILES_SUCCESS';
export const LOAD_FILES_FAIL = 'browser/LOAD_FILES_FAIL';

export const LOAD_CATEGORIES = 'browser/LOAD_CATEGORIES';
export const LOAD_CATEGORIES_SUCCESS = 'browser/LOAD_CATEGORIES_SUCCESS';
export const LOAD_CATEGORIES_FAIL = 'browser/LOAD_CATEGORIES_FAIL';

export const LOAD_CATEGORIES_NESTED = 'browser/LOAD_CATEGORIES_NESTED';
export const LOAD_CATEGORIES_SUCCESS_NESTED = 'browser/LOAD_CATEGORIES_SUCCESS_NESTED';
export const LOAD_CATEGORIES_FAIL_NESTED = 'browser/LOAD_CATEGORIES_FAIL_NESTED';

export const LOAD_FORMS = 'browser/LOAD_FORMS';
export const LOAD_FORMS_SUCCESS = 'browser/LOAD_FORMS_SUCCESS';
export const LOAD_FORMS_FAIL = 'browser/LOAD_FORMS_FAIL';

export const LOAD_REPOS = 'browser/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'browser/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_FAIL = 'browser/LOAD_REPOS_FAIL';

export const LOAD_REPO_CONTENT = 'browser/LOAD_REPO_CONTENT';
export const LOAD_REPO_CONTENT_SUCCESS = 'browser/LOAD_REPO_CONTENT_SUCCESS';
export const LOAD_REPO_CONTENT_FAIL = 'browser/LOAD_REPO_CONTENT_FAIL';

export const SEARCH_REPO_CONTENT = 'browser/SEARCH_REPO_CONTENT';
export const SEARCH_REPO_CONTENT_SUCCESS = 'browser/SEARCH_REPO_CONTENT_SUCCESS';

export const LOAD_COMPANY_IMAGES = 'browser/LOAD_COMPANY_IMAGES';
export const LOAD_COMPANY_IMAGES_SUCCESS = 'browser/LOAD_COMPANY_IMAGES_SUCCESS';
export const LOAD_COMPANY_IMAGES_FAIL = 'browser/LOAD_COMPANY_IMAGES_FAIL';

export const LOAD_UNSPLASH_IMAGES = 'browser/LOAD_UNSPLASH_IMAGES';
export const LOAD_UNSPLASH_IMAGES_SUCCESS = 'browser/LOAD_UNSPLASH_IMAGES_SUCCESS';
export const LOAD_UNSPLASH_IMAGES_FAIL = 'browser/LOAD_UNSPLASH_IMAGES_FAIL';

export const UPLOAD_THUMBNAIL = 'browser/UPLOAD_THUMBNAIL';
export const UPLOAD_THUMBNAIL_SUCCESS = 'browser/UPLOAD_THUMBNAIL_SUCCESS';
export const UPLOAD_THUMBNAIL_FAIL = 'browser/UPLOAD_THUMBNAIL_FAIL';

export const SET_THUMBNAIL_TAGS = 'browser/SET_THUMBNAIL_TAGS';
export const SET_THUMBNAIL_TAGS_SUCCESS = 'browser/SET_THUMBNAIL_TAGS_SUCCESS';
export const SET_THUMBNAIL_TAGS_FAIL = 'browser/SET_THUMBNAIL_TAGS_FAIL';

export const TOGGLE_SELECTED_TAB = 'browser/TOGGLE_SELECTED_TAB';
export const TOGGLE_SELECTED_CHANNEL = 'browser/TOGGLE_SELECTED_CHANNEL';
export const TOGGLE_SELECTED_STORY = 'browser/TOGGLE_SELECTED_STORY';
export const TOGGLE_SELECTED_FILE = 'browser/TOGGLE_SELECTED_FILE';

export const TOGGLE_SELECTED_CATEGORY = 'browser/TOGGLE_SELECTED_CATEGORY';
export const TOGGLE_SELECTED_FORM = 'browser/TOGGLE_SELECTED_FORM';

export const SELECT_SINGLE_TAB = 'browser/SELECT_SINGLE_TAB';
export const SELECT_SINGLE_CHANNEL = 'browser/SELECT_SINGLE_CHANNEL';
export const SELECT_SINGLE_STORY = 'browser/SELECT_SINGLE_STORY';
export const SELECT_SINGLE_FILE = 'browser/SELECT_SINGLE_FILE';

export const SELECT_SINGLE_CATEGORY = 'browser/SELECT_SINGLE_CATEGORY';
export const SELECT_SINGLE_FORM = 'browser/SELECT_SINGLE_FORM';

export const SELECT_SINGLE_REPO = 'browser/SELECT_SINGLE_REPO';
export const SELECT_SINGLE_REPO_FOLDER = 'browser/SELECT_SINGLE_REPO_FOLDER';

export const SELECT_SINGLE_IMAGE = 'browser/SELECT_SINGLE_IMAGE';

export const ADD_TAG = 'browser/ADD_TAG';
export const DELETE_TAG = 'browser/DELETE_TAG';
export const RESET_TAGS = 'browser/RESET_TAGS';

export const initialState = {
  isLoading: false,

  tabsById: {
    personal: {
      id: 'personal',
      name: 'Personal Content',
      type: 'tab',
      colour: '#00bbff',
      anchorUrl: '/content/personal',
      thumbnail: '',
      isPersonal: true
    }
  },
  channelsById: {},
  storiesById: {},
  filesById: {},

  categoriesById: {},
  formsById: {},

  reposById: {},

  imagesById: {},

  tabs: ['personal'],  // personal content
  tabsLoaded: false,
  tabsLoading: false,
  tabsError: null,
  tabsComplete: false,

  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  categoriesComplete: false,

  // Kloudless repositories
  repos: [],
  reposLoaded: false,
  reposLoading: false,
  reposError: null,
  reposComplete: false,

  // Company image library
  images: [],
  imagesLoading: false,
  imagesError: null,
  imagesComplete: false,

  // 'Unsplash' image library
  unsplash: [],
  unsplashLoading: false,
  unsplashError: null,
  unsplashComplete: false,

  tags: [],
  thumbnail: '',
  thumbnailId: 0,
  thumbnailError: '',
  thumbnailUploading: false,
  thumbnailComplete: false,
};

export default function browser(state = initialState, action = {}) {
  switch (action.type) {
    case RESET:
      return initialState;

    /* Tabs */
    case LOAD_TABS:
      return {
        ...state,
        isLoading: true,
        tabsLoading: true
      };
    case LOAD_TABS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(tab));

      // Merge tabs array if loading more (offset > 0)
      // Note we are merging initialState.tabs to include the static 'personal' tab at the top
      const newOrder = action.offset ? union(state.tabs, normalized.result) : union(initialState.tabs, normalized.result);

      const newState = merge({}, state, {
        isLoading: false,

        channelsById: normalized.entities.channels,
        tabsById: normalized.entities.tabs,
        storiesById: normalized.entities.stories,

        tabs: newOrder,
        tabsLoaded: true,
        tabsLoading: false,
        tabsComplete: action.result.length < globalFetchLimit,
        tabsError: null
      });

      return newState;
    }
    case LOAD_TABS_FAIL:
      return {
        ...state,
        isLoading: false,
        tabsLoading: false,
        tabsError: action.error
      };

    /* Channels */
    case LOAD_CHANNELS:
      return {
        ...state,
        isLoading: true,
        tabsById: {
          ...state.tabsById,
          [action.tabId]: {
            ...state.tabsById[action.tabId],
            channelsLoading: true
          }
        }
      };
    case LOAD_CHANNELS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(channel));

      // Merge channels array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.tabsById[action.tabId].channels, normalized.result) : normalized.result;

      return {
        ...state,
        isLoading: false,
        tabsById: {
          ...state.tabsById,
          [action.tabId]: {
            ...state.tabsById[action.tabId],
            channels: newOrder,
            channelsLoaded: true,
            channelsLoading: false,
            channelsComplete: action.result.length < globalFetchLimit,
            channelsError: null
          }
        },
        channelsById: merge({}, state.channelsById, {
          ...normalized.entities.channels
        })
      };
    }
    case LOAD_CHANNELS_FAIL:
      return {
        ...state,
        isLoading: false,
        tabsById: {
          ...state.tabsById,
          [action.tabId]: {
            ...state.tabsById[action.tabId],
            channelsLoading: false,
            channelsError: action.error
          }
        }
      };

    /* Stories */
    case LOAD_STORIES:
      return {
        ...state,
        isLoading: true,
        channelsById: {
          ...state.channelsById,
          [action.channelId]: {
            ...state.channelsById[action.channelId],
            storiesLoading: true
          }
        }
      };
    case LOAD_STORIES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(story));

      // Merge stories array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.channelsById[action.channelId].stories, normalized.result) : normalized.result;

      const newState = merge({}, state, {
        isLoading: false,
        filesById: normalized.entities.files,
        storiesById: normalized.entities.stories,
        channelsById: {
          ...state.channelsById,
          [action.channelId]: {
            ...state.channelsById[action.channelId],
            stories: newOrder,
            storiesLoaded: true,
            storiesLoading: false,
            storiesComplete: action.result.length < globalFetchLimit,
            storiesError: null
          }
        }
      });
      return newState;
    }
    case LOAD_STORIES_FAIL:
      return {
        ...state,
        isLoading: false,
        channelsById: {
          ...state.channelsById,
          [action.channelId]: {
            ...state.channelsById[action.channelId],
            storiesLoading: false,
            storiesError: action.error
          }
        }
      };

    /* Files */
    case LOAD_FILES:
      return {
        ...state,
        isLoading: true,
        storiesById: {
          ...state.storiesById,
          [action.storyId]: {
            ...state.storiesById[action.storyId],
            filesLoading: true
          }
        }
      };
    case LOAD_FILES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(file));
      const newState = merge({}, state, {
        isLoading: false,
        filesById: normalized.entities.files,
        storiesById: {
          ...state.storiesById,
          [action.storyId]: {
            ...state.storiesById[action.storyId],
            files: union(state.storiesById[action.storyId].files, normalized.result),
            filesLoaded: true,
            filesLoading: false,
            filesComplete: action.result.length < globalFetchLimit,
            filesError: null
          }
        }
      });
      return newState;
    }
    case LOAD_FILES_FAIL:
      return {
        ...state,
        isLoading: false,
        storiesById: {
          ...state.storiesById,
          [action.storyId]: {
            ...state.storiesById[action.storyId],
            filesLoading: false,
            filesError: action.error
          }
        }
      };

    /* Categories */
    case LOAD_CATEGORIES:
      return {
        ...state,
        isLoading: true,
        categoriesLoading: true
      };
    case LOAD_CATEGORIES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(category));
      const newState = merge({}, state, {
        isLoading: false,
        categoriesById: normalized.entities.categories,
        formsById: normalized.entities.forms,

        categories: union(state.categories, normalized.result),
        categoriesLoading: false,
        categoriesComplete: action.result.length < globalFetchLimit,
        categoriesError: null
      });
      return newState;
    }
    case LOAD_CATEGORIES_FAIL:
      return {
        ...state,
        isLoading: false,
        categoriesLoading: false,
        categoriesError: action.error
      };

    /* TODO - Categories with nested Forms - Temporal use of V4 API */
    case LOAD_CATEGORIES_NESTED:
      return {
        ...state,
        isLoading: true,
        categoriesLoading: true
      };
    case LOAD_CATEGORIES_SUCCESS_NESTED: {
      const categories = action.result.map(item => {
        const { note, ...others } = item;
        return {
          ...others,
          description: note,
          formCount: others.forms.filter(f => f.status === 'published').length
        };
      });
      const normalized = normalize(categories, arrayOf(category));
      const newState = merge({}, state, {
        isLoading: false,
        categoriesById: normalized.entities.categories,
        formsById: normalized.entities.forms,

        categories: union(state.categories, normalized.result),
        categoriesLoading: false,
        categoriesComplete: action.result.length < globalFetchLimit,
        categoriesError: null
      });
      return newState;
    }
    case LOAD_CATEGORIES_FAIL_NESTED:
      return {
        ...state,
        isLoading: false,
        categoriesLoading: false,
        categoriesError: action.error
      };

    /* Forms */
    case LOAD_FORMS:
      return {
        ...state,
        isLoading: true,
        categoriesById: {
          ...state.categoriesById,
          [action.catId]: {
            ...state.categoriesById[action.catId],
            formsLoading: true
          }
        }
      };
    case LOAD_FORMS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(form));
      const newState = merge({}, state, {
        isLoading: false,
        formsById: normalized.entities.forms,
        categoriesById: {
          ...state.categoriesById,
          [action.catId]: {
            ...state.categoriesById[action.catId],
            forms: action.offset ? [...state.categoriesById[action.catId].forms, ...normalized.result] : union(state.categoriesById[action.catId].forms, normalized.result),
            formsLoading: false,
            formsComplete: action.result.length < globalFetchLimit,
            formsError: null
          }
        }
      });
      return newState;
    }
    case LOAD_FORMS_FAIL:
      return {
        ...state,
        isLoading: false,
        categoriesById: {
          ...state.categoriesById,
          [action.catId]: {
            ...state.categoriesById[action.catId],
            formsLoading: false,
            formsError: action.error
          }
        }
      };

    /* Kloudless Repositories */
    case LOAD_REPOS:
      return {
        ...state,
        isLoading: true,
        reposLoading: true
      };
    case LOAD_REPOS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(repo));
      const newState = merge({}, state, {
        isLoading: false,
        reposById: normalized.entities.repos,
        repos: union(state.repos, normalized.result),
        reposLoading: false,
        reposComplete: action.result.length < globalFetchLimit,
        reposError: null
      });
      return newState;
    }
    case LOAD_REPOS_FAIL:
      return {
        ...state,
        isLoading: false,
        reposLoading: false,
        reposError: action.error
      };
    case LOAD_REPO_CONTENT:
      return {
        ...state,
        isLoading: true,
        reposById: {
          ...state.reposById,
          [action.repoId]: {
            ...state.reposById[action.repoId],
            selectedFolder: action.page ? action.folderId : null,
            folderIdFetchMore: action.folderId || state.reposById[action.repoId].folderId,
            contentLoading: true,
          }
        }
      };
    case LOAD_REPO_CONTENT_SUCCESS: {
      const { repoId, folderId } = action;

      /* eslint-disable no-param-reassign */
      action.result.contents.forEach(f => {
        f.repoId = repoId;
      });
      /* eslint-enable no-param-reassign */

      const normalized = normalize(action.result.contents, arrayOf(file));
      const newState = merge({}, state, {
        isLoading: false,
        filesById: normalized.entities.files,
        reposById: {
          ...state.reposById,
          [repoId]: {
            ...state.reposById[repoId],
            [folderId]: union(state.reposById[repoId][folderId], normalized.result),
            selectedFolder: folderId,
            nextPage: action.result.nextPage,

            contentLoading: false,
            contentComplete: !action.result.nextPage,
            contentError: null
          }
        }
      });
      return newState;
    }
    case LOAD_REPO_CONTENT_FAIL:
      return {
        ...state,
        isLoading: false,
        reposById: {
          ...state.reposById,
          [action.repoId]: {
            ...state.reposById[action.repoId],
            contentLoading: false,
            contentError: action.error
          }
        }
      };

    case SEARCH_REPO_CONTENT:
      return {
        ...state,
        isLoading: true,
        reposById: {
          ...state.reposById,
          [action.repoId]: {
            ...state.reposById[action.repoId],
            searchResults: [],
            selectedFolder: null,
            contentLoading: true
          }
        }
      };
    case SEARCH_REPO_CONTENT_SUCCESS: {
      const { repoId } = action;

      /* eslint-disable no-param-reassign */
      action.result.contents.forEach(f => {
        f.repoId = repoId;
      });
      /* eslint-enable no-param-reassign */

      const normalized = normalize(action.result.contents, arrayOf(file));
      const newState = merge({}, state, {
        isLoading: false,
        filesById: normalized.entities.files,
        reposById: {
          ...state.reposById,
          [repoId]: {
            ...state.reposById[repoId],
            searchResults: normalized.result,
            selectedFolder: 'searchResults',
            contentLoading: false,
            contentComplete: action.result.contents.length < globalFetchLimit,
            contentError: null
          }
        }
      });
      return newState;
    }

    /* Images/Cover Art */
    case LOAD_COMPANY_IMAGES:
      return {
        ...state,
        isLoading: true,
        imagesLoading: true
      };
    case LOAD_COMPANY_IMAGES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(image));
      const newState = merge({}, state, {
        isLoading: false,
        imagesById: normalized.entities.images,

        images: union(state.images, normalized.result),
        imagesLoading: false,
        imagesComplete: action.result.length < galleryFetchLimit,
        imagesError: null
      });
      return newState;
    }
    case LOAD_COMPANY_IMAGES_FAIL:
      return {
        ...state,
        isLoading: false,
        imagesLoading: false,
        imagesError: action.error
      };

    /* Unsplash images */
    case LOAD_UNSPLASH_IMAGES:
      return {
        ...state,
        isLoading: true,
        unsplashLoading: true
      };
    case LOAD_UNSPLASH_IMAGES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(image));
      const newState = merge({}, state, {
        isLoading: false,
        imagesById: normalized.entities.images,

        unsplash: union(state.unsplash, normalized.result),
        unsplashLoading: false,
        unsplashComplete: action.result.length < galleryFetchLimit,
        unsplashError: null
      });
      return newState;
    }
    case LOAD_UNSPLASH_IMAGES_FAIL:
      return {
        ...state,
        isLoading: false,
        unsplashLoading: false,
        unsplashError: action.error
      };

    /* Saving Cover Art */
    case UPLOAD_THUMBNAIL:
      return {
        ...state,
        thumbnailUploading: true,
        thumbnailComplete: false
      };
    case UPLOAD_THUMBNAIL_SUCCESS: {
      const newImages = [action.result.id, ...state.images];
      const newImagesById = { ...state.imagesById };

      // unselect other images
      for (const key in newImagesById) {
        if (newImagesById) {
          newImagesById[key] = { ...newImagesById[key], isSelected: false };
        }
      }

      newImagesById[action.result.id] = {
        ...action.result,
        author: action.result.author || '',
        isSelected: true
      };

      return {
        ...state,
        thumbnailId: action.result.id,
        thumbnail: action.result.url,
        tags: action.result.tags,
        thumbnailUploading: false,
        thumbnailComplete: true,
        images: newImages,
        imagesById: newImagesById
      };
    }
    case UPLOAD_THUMBNAIL_FAIL:
      return {
        ...state,
        thumbnailError: action.error,
        thumbnailUploading: false,
        thumbnailComplete: false
      };

    case SET_THUMBNAIL_TAGS:
      return state;
    case SET_THUMBNAIL_TAGS_SUCCESS:
      return {
        ...state,
      };
    case SET_THUMBNAIL_TAGS_FAIL:
      return state;

    case TOGGLE_SELECTED_TAB:
      return {
        ...state,
        tabsById: {
          ...state.tabsById,
          [action.id]: {
            ...state.tabsById[action.id],
            isSelected: !state.tabsById[action.id].isSelected
          }
        }
      };
    case TOGGLE_SELECTED_CHANNEL: {
      const channelItemProps = {};
      if (action.data) {
        channelItemProps.isSelected = action.data.isSelected;
      }
      return {
        ...state,
        channelsById: {
          ...state.channelsById,
          [action.id]: {
            ...state.channelsById[action.id],
            isSelected: !state.channelsById[action.id].isSelected,
            ...channelItemProps
          }
        }
      };
    }
    case TOGGLE_SELECTED_STORY:
      return {
        ...state,
        storiesById: {
          ...state.storiesById,
          [action.id]: {
            ...state.storiesById[action.id],
            isSelected: !state.storiesById[action.id].isSelected
          }
        }
      };
    case TOGGLE_SELECTED_FILE: {
      const itemProps = {};
      if (action.data) {
        itemProps.disabled = action.data.disabled;
        itemProps.isSelected = action.data.isSelected; // select mandatory item
      }
      return {
        ...state,
        filesById: {
          ...state.filesById,
          [action.id]: {
            ...state.filesById[action.id],
            isSelected: !state.filesById[action.id].isSelected,
            ...itemProps,
          }
        }
      };
    }
    case TOGGLE_SELECTED_CATEGORY:
      return {
        ...state,
        categoriesById: {
          ...state.categoriesById,
          [action.id]: {
            ...state.categoriesById[action.id],
            isSelected: !state.categoriesById[action.id].isSelected
          }
        }
      };
    case TOGGLE_SELECTED_FORM:
      return {
        ...state,
        formsById: {
          ...state.formsById,
          [action.id]: {
            ...state.formsById[action.id],
            isSelected: !state.formsById[action.id].isSelected
          }
        }
      };

    case SELECT_SINGLE_TAB: {
      const newTabsById = { ...state.tabsById };

      for (const key in newTabsById) {
        if (newTabsById[key].id === action.id) {
          newTabsById[key] = { ...newTabsById[key], isSelected: true };
        } else {
          newTabsById[key] = { ...newTabsById[key], isSelected: false };
        }
      }

      return {
        ...state,
        tabsById: newTabsById
      };
    }

    case SELECT_SINGLE_CHANNEL: {
      const newChannelsById = { ...state.channelsById };

      for (const key in newChannelsById) {
        if (newChannelsById[key].id === action.id) {
          newChannelsById[key] = { ...newChannelsById[key], isSelected: true };
        } else {
          newChannelsById[key] = { ...newChannelsById[key], isSelected: false };
        }
      }

      return {
        ...state,
        channelsById: newChannelsById
      };
    }

    case SELECT_SINGLE_STORY: {
      const newStoriesById = { ...state.storiesById };

      for (const key in newStoriesById) {
        if (newStoriesById[key].id === action.id) {
          newStoriesById[key] = { ...newStoriesById[key], isSelected: true };
        } else {
          newStoriesById[key] = { ...newStoriesById[key], isSelected: false };
        }
      }

      return {
        ...state,
        storiesById: newStoriesById
      };
    }

    case SELECT_SINGLE_FILE: {
      const newFilesById = { ...state.filesById };

      for (const key in newFilesById) {
        if (newFilesById[key].id === action.id) {
          newFilesById[key] = { ...newFilesById[key], isSelected: true };
        } else {
          newFilesById[key] = { ...newFilesById[key], isSelected: false };
        }
      }

      return {
        ...state,
        filesById: newFilesById
      };
    }

    case SELECT_SINGLE_CATEGORY: {
      const newCategoriesById = { ...state.categoriesById };

      for (const key in newCategoriesById) {
        if (newCategoriesById[key].id === action.id) {
          newCategoriesById[key] = { ...newCategoriesById[key], isSelected: true };
        } else {
          newCategoriesById[key] = { ...newCategoriesById[key], isSelected: false };
        }
      }

      return {
        ...state,
        categoriesById: newCategoriesById
      };
    }

    case SELECT_SINGLE_FORM: {
      const newFormsById = { ...state.formsById };

      for (const key in newFormsById) {
        if (newFormsById[key].id === action.id) {
          newFormsById[key] = { ...newFormsById[key], isSelected: true };
        } else {
          newFormsById[key] = { ...newFormsById[key], isSelected: false };
        }
      }

      return {
        ...state,
        formsById: newFormsById
      };
    }

    case SELECT_SINGLE_REPO: {
      const newReposById = { ...state.reposById };

      for (const key in newReposById) {
        if (newReposById[key].id === action.id) {
          newReposById[key] = { ...newReposById[key], isSelected: true };
        } else {
          newReposById[key] = { ...newReposById[key], isSelected: false };
        }
      }

      return {
        ...state,
        reposById: newReposById
      };
    }
    case SELECT_SINGLE_REPO_FOLDER: {
      return {
        ...state,
        reposById: {
          ...state.reposById,
          [action.id]: {
            ...state.reposById[action.id],
            selectedFolder: action.folderId
          }
        }
      };
    }

    case SELECT_SINGLE_IMAGE: {
      const newImagesById = { ...state.imagesById };

      for (const key in newImagesById) {
        if (newImagesById[key].id === action.id) {
          newImagesById[key] = { ...newImagesById[key], isSelected: true };
        } else {
          newImagesById[key] = { ...newImagesById[key], isSelected: false };
        }
      }

      return {
        ...state,
        imagesById: newImagesById
      };
    }

    /**
     * Tags
     */
    case ADD_TAG: {
      // Ignore duplicate
      if (state.tags.indexOf(action.name) > -1) {
        return state;
      }

      return {
        ...state,
        tags: [...state.tags, action.name]
      };
    }
    case DELETE_TAG: {
      const newTags = [...state.tags];
      newTags.splice(action.index, 1);

      return {
        ...state,
        tags: newTags
      };
    }
    case RESET_TAGS: {
      return {
        ...state,
        tags: [],
        thumbnail: '',
        thumbnailId: 0,
        thumbnailComplete: false
      };
    }

    default:
      return state;
  }
}

/* Action Creators */

/* Reset to initial state */
export function reset() {
  return {
    type: RESET
  };
}

/* Load all Tabs */
export function loadTabs(
  offset = 0,
  sortBy = 'name',
  showHiddenChannels = false,
  canPost = false,
  excludeFeedChannels = false,
  canShare = false
) {
  return {
    types: [LOAD_TABS, LOAD_TABS_SUCCESS, LOAD_TABS_FAIL],
    offset: offset,
    sortBy: sortBy,
    promise: (client) => client.get('/content/tabs', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        sort_by: sortBy,
        can_post: +!!canPost,  // 0/1
        can_share: +!!canShare,  // 0/1
        show_hidden_channels: +!!showHiddenChannels,  // 0/1
        exclude_feed_channels: +!!excludeFeedChannels  // 0/1
      }
    })
  };
}

/* Load Channels by Tab ID */
export function loadChannels(
  tabId,
  offset = 0,
  sortBy = 'name',
  showHiddenChannels = true,
  canPost = false,
  excludeFeedChannels = false,
  canShare = false
) {
  let path = '/content/channels';
  if (tabId === 'personal') {
    path = '/content/personalContentChannels';
  }

  return {
    types: [LOAD_CHANNELS, LOAD_CHANNELS_SUCCESS, LOAD_CHANNELS_FAIL],
    tabId: tabId,
    offset: offset,
    sortBy: sortBy,
    promise: (client) => client.get(path, 'webapi', {
      params: {
        tab_id: tabId,
        limit: globalFetchLimit,
        offset: offset,
        sort_by: sortBy,
        can_post: +!!canPost,  // 0/1
        can_share: +!!canShare,  // 0/1
        show_hidden_channels: +!!showHiddenChannels,  // 0/1
        exclude_feed_channels: +!!excludeFeedChannels  // 0/1
      }
    })
  };
}

/* Load Stories by Channel ID */
export function loadStories(channelId, offset = 0, sortBy = 'name', canShare = false) {
  return {
    types: [LOAD_STORIES, LOAD_STORIES_SUCCESS, LOAD_STORIES_FAIL],
    channelId: channelId,
    offset: offset,
    sortBy: sortBy,
    promise: (client) => client.get('/content/stories', 'webapi', {
      params: {
        channel_id: channelId,
        limit: globalFetchLimit,
        offset: offset,
        sort_by: sortBy,
        can_share: +!!canShare
      }
    })
  };
}

/* Load Files by Story ID */
// TODO: add offset/limit to API
export function loadFiles(storyId, offset = 0, canShare = false) {
  return {
    types: [LOAD_FILES, LOAD_FILES_SUCCESS, LOAD_FILES_FAIL],
    storyId: storyId,
    offset: offset,
    promise: (client) => client.get('/content/files', 'webapi', {
      params: {
        permId: storyId,
        //limit: globalFetchLimit,
        //offset: offset,
        canShare: +!!canShare
      }
    })
  };
}
/* TODO - Temporal use of V4 API */
/* Load a list of form categories with form nested data */
export function loadCategoriesNested(filter, offset = 0) {
  return {
    types: [LOAD_CATEGORIES_NESTED, LOAD_CATEGORIES_SUCCESS_NESTED, LOAD_CATEGORIES_FAIL_NESTED],
    offset: offset,
    promise: (client) => client.get('/form/all', 'webapi4', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        search: filter,
        include_forms: 1 // include form data as an array
      }
    })
  };
}

/* TODO - Pending V5 API, falling back to V4 */
/* Load Categories */
export function loadCategories(filter, offset = 0) {
  return {
    types: [LOAD_CATEGORIES, LOAD_CATEGORIES_SUCCESS, LOAD_CATEGORIES_FAIL],
    offset: offset,
    promise: (client) => client.get('/form-categories', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset
      }
    })
  };
}

/* TODO - Pending V5 API */
/* Load Form by Category ID */
export function loadForms(catId, filter, offset = 0) {
  return {
    types: [LOAD_FORMS, LOAD_FORMS_SUCCESS, LOAD_FORMS_FAIL],
    catId: catId,
    offset: offset,
    promise: (client) => client.get(`/form-categories/${catId}/forms`, 'webapi', {
      params: {
        status: filter,
        limit: globalFetchLimit,
        offset: offset
      }
    })
  };
}

/* Load Kloudless Repositories */
export function loadRepos(offset = 0) {
  return {
    types: [LOAD_REPOS, LOAD_REPOS_SUCCESS, LOAD_REPOS_FAIL],
    offset: offset,
    promise: (client) => client.get('/repository/all', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset
      }
    })
  };
}

/* Load Repo content list by Repo ID & Folder ID */
export function loadRepoContent(repoId, folderId = 'root', page = null) {
  return {
    types: [LOAD_REPO_CONTENT, LOAD_REPO_CONTENT_SUCCESS, LOAD_REPO_CONTENT_FAIL],
    repoId: repoId,
    folderId: folderId,
    page: page,
    promise: (client) => client.get('/repository/get', 'webapi', {
      params: {
        id: repoId,
        folderId: folderId,
        limit: globalFetchLimit,
        page: page
      }
    })
  };
}

/* Search Repo files (folder supported) */
export function searchRepoContent(repoId, keyword = '', folderId) {
  return {
    types: [SEARCH_REPO_CONTENT, SEARCH_REPO_CONTENT_SUCCESS, LOAD_REPO_CONTENT_FAIL],
    repoId,
    folderId,
    promise: (client) => client.get('/repository/search', 'webapi', {
      params: {
        id: repoId,
        keyword: keyword,
        folderId,
      }
    })
  };
}

/* Load Company Images/Cover Art */
export function loadCompanyImages(imgCategory, search, offset = 0) {
  return {
    types: [LOAD_COMPANY_IMAGES, LOAD_COMPANY_IMAGES_SUCCESS, LOAD_COMPANY_IMAGES_FAIL],
    promise: (client) => client.get('/imagelibrary/list', 'webapi', {
      params: {
        type: imgCategory,
        source: 'company',
        search: search,
        limit: galleryFetchLimit,
        offset: offset
      }
    })
  };
}

/* Load Unsplash Images/Cover Art */
export function loadUnsplashImages(imgCategory, search, offset = 0) {
  return {
    types: [LOAD_UNSPLASH_IMAGES, LOAD_UNSPLASH_IMAGES_SUCCESS, LOAD_UNSPLASH_IMAGES_FAIL],
    promise: (client) => client.get('/imagelibrary/list', 'webapi', {
      params: {
        type: imgCategory,
        source: 'unsplash',
        search: search,
        limit: galleryFetchLimit,
        offset: offset
      }
    })
  };
}

/* Toggle selected attribute on Tab */
export function toggleSelectedTab(id) {
  return {
    type: TOGGLE_SELECTED_TAB,
    id
  };
}

/* Toggle selected attribute on Channel */
export function toggleSelectedChannel(id, data) {
  return {
    type: TOGGLE_SELECTED_CHANNEL,
    id,
    data
  };
}

/* Toggle selected attribute on Channel */
export function toggleSelectedStory(id) {
  return {
    type: TOGGLE_SELECTED_STORY,
    id
  };
}

/* Toggle selected attribute on File */
export function toggleSelectedFile(id, data) {
  return {
    type: TOGGLE_SELECTED_FILE,
    id,
    data
  };
}

/* Toggle selected attribute on Category */
export function toggleSelectedCategory(id) {
  return {
    type: TOGGLE_SELECTED_CATEGORY,
    id
  };
}

/* Toggle selected attribute on Form */
export function toggleSelectedForm(id) {
  return {
    type: TOGGLE_SELECTED_FORM,
    id
  };
}

/* Set selected attribute on Tab and remove other Tabs selected attribute */
export function selectSingleTab(id) {
  return {
    type: SELECT_SINGLE_TAB,
    id
  };
}

/* Set selected attribute on Channel and remove other Channels selected attribute */
export function selectSingleChannel(id) {
  return {
    type: SELECT_SINGLE_CHANNEL,
    id
  };
}

/* Set selected attribute on Story and remove other Stories selected attribute */
export function selectSingleStory(id) {
  return {
    type: SELECT_SINGLE_STORY,
    id
  };
}

/* Set selected attribute on File and remove other Files selected attribute */
export function selectSingleFile(id) {
  return {
    type: SELECT_SINGLE_FILE,
    id
  };
}

/* Set selected attribute on Category and remove other Categories selected attribute */
export function selectSingleCategory(id) {
  return {
    type: SELECT_SINGLE_CATEGORY,
    id
  };
}

/* Set selected attribute on Form and remove other Forms selected attribute */
export function selectSingleForm(id) {
  return {
    type: SELECT_SINGLE_FORM,
    id
  };
}

/* Set selected attribute on Repo and remove other Repos selected attribute */
export function selectSingleRepo(id) {
  return {
    type: SELECT_SINGLE_REPO,
    id
  };
}

/* Set the selectedFolder attribute on a Repository */
export function selectSingleRepoFolder(id, folderId) {
  return {
    type: SELECT_SINGLE_REPO_FOLDER,
    id,
    folderId
  };
}

/* Set selected attribute on Image and remove other Images selected attribute */
export function selectSingleImage(id) {
  return {
    type: SELECT_SINGLE_IMAGE,
    id
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

export function resetTags(index) {
  return {
    type: RESET_TAGS,
    index
  };
}

export function uploadThumbnail(imgCategory, imageBase64) {
  return {
    types: [UPLOAD_THUMBNAIL, UPLOAD_THUMBNAIL_SUCCESS, UPLOAD_THUMBNAIL_FAIL],
    promise: (client) => client.post('/imagelibrary/upload', 'webapi', {
      data: {
        type: imgCategory,
        imageBase64: imageBase64
      }
    })
  };
}

export function setThumbnailTags(imgCategory, id, tags = []) {
  return {
    types: [SET_THUMBNAIL_TAGS, SET_THUMBNAIL_TAGS_SUCCESS, SET_THUMBNAIL_TAGS_FAIL],
    promise: (client) => client.post('/imagelibrary/setTags', 'webapi', {
      data: {
        type: imgCategory,
        id: id,
        tags: JSON.stringify(tags)
      }
    })
  };
}
