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

/* eslint-disable import/no-duplicates */

import merge from 'lodash/merge';
import union from 'lodash/union';
import isEmpty from 'lodash/isEmpty';
import { normalize, Schema, arrayOf, unionOf } from 'normalizr';
import {
  bearerIdToId,
  processCallInvitation,
  processOfflineOrForwardedMessage,
  processOnlineMessage,
  parseRoster
} from '../../../../_assets/style-guide/src/redux/modules/chat/helpers';

/** ADMIN Tabs, Channels */
import {
  LOAD_GROUPS_IA_SUCCESS as LOAD_ADMIN_GROUPS_IA_SUCCESS,
  LOAD_INTEREST_AREAS_SUCCESS as LOAD_ADMIN_INTEREST_AREAS_SUCCESS,
  LOAD_WEBSITES_SUCCESS as LOAD_ADMIN_WEBSITES_SUCCESS,
  LOAD_WEBSITE_GROUPS_SUCCESS as LOAD_ADMIN_WEBSITE_GROUPS_SUCCESS,
  LOAD_TABS_SUCCESS as LOAD_ADMIN_TABS_SUCCESS,
  LOAD_CHANNELS_SUCCESS as LOAD_ADMIN_CHANNELS_SUCCESS,
  LOAD_GROUPS_SUCCESS as LOAD_ADMIN_GROUPS_SUCCESS,
  LOAD_ALL_GROUPS_SUCCESS as LOAD_ADMIN_ALL_GROUPS_SUCCESS,
  LOAD_ALL_GROUPS_LIST_SUCCESS as LOAD_ADMIN_ALL_GROUPS_LIST_SUCCESS,
  LOAD_USERS_SUCCESS as LOAD_ADMIN_USERS_SUCCESS,
  LOAD_BUNDLE_USERS_SUCCESS as LOAD_ADMIN_BUNDLE_USERS_SUCCESS,
  SAVE_TAB_SUCCESS as SAVE_ADMIN_TAB_SUCCESS,
  SAVE_CHANNEL_SUCCESS as SAVE_ADMIN_CHANNEL_SUCCESS,
  SAVE_GROUP_SUCCESS as SAVE_ADMIN_GROUP_SUCCESS,
  SAVE_USER_SUCCESS as SAVE_ADMIN_USER_SUCCESS,
  SET_RELATIONSHIP_SUCCESS as SET_ADMIN_RELATIONSHIP_SUCCESS,
  SET_INTEREST_AREA_LINK_SUCCESS as SET_ADMIN_INTEREST_AREA_LINK_SUCCESS,
  REMOVE_INTEREST_AREA_LINK_SUCCESS as REMOVE_ADMIN_INTEREST_AREA_LINK_SUCCESS,
  DELETE_CHANNEL_SUCCESS as DELETE_ADMIN_CHANNEL_SUCCESS,
  DELETE_USER_SUCCESS as DELETE_ADMIN_USER_SUCCESS,
} from '../admin/structure';

import {
  LOAD_ARCHIVED_STORIES_SUCCESS as LOAD_ADMIN_ARCHIVED_STORIES_SUCCESS
} from '../admin/stories';

/** Tabs */
import {
  LOAD_TABS_SUCCESS
} from '../content';
import {
  LOAD_TAB_SUCCESS
} from '../content';

/** Channels */
import {
  LOAD_CHANNELS,
  LOAD_CHANNELS_SUCCESS,
  LOAD_CHANNELS_FAIL,
  SUBSCRIBE_CHANNEL,
  SUBSCRIBE_CHANNEL_FAIL
} from '../content';
import {
  LOAD_SETTINGS_SUCCESS
} from '../settings';
import {
  LOAD_CHANNEL_SUBSCRIPTIONS_SUCCESS,
} from '../userSettings';

/** Stories */
import {
  LOAD_COMPANY_ALL_SUCCESS,
  LOAD_COMPANY_STORIES_SUCCESS
} from '../company';
import {
  LOAD_STORIES,
  LOAD_STORIES_SUCCESS,
  LOAD_STORIES_FAIL
} from '../content';
import {
  LOAD_PROTECTED_STORY_SUCCESS,
  LOAD_STORY_SUCCESS,
  SAVE_STORY_SUCCESS,
  ARCHIVE_STORY_SUCCESS,
  STATUS_SUCCESS,
  ADD_STORY_BOOKMARK,
  ADD_STORY_BOOKMARK_SUCCESS,
  DELETE_STORY_BOOKMARK,
  LIKE_STORY,
  LIKE_STORY_FAIL,
  SUBSCRIBE_STORY,
  SUBSCRIBE_STORY_FAIL
} from '../story/story';
import {
  LOAD_ME_SUCCESS,
  LOAD_LIKED_STORIES_SUCCESS,
  LOAD_RECOMMENDED_STORIES_SUCCESS,
  LOAD_RECENT_STORIES_SUCCESS,
  LOAD_STORIES_WITH_COMMENTS_SUCCESS
} from '../me';
import {
  LOAD_STORY_SUBSCRIPTIONS_SUCCESS
} from '../userSettings';

/** Events */
import {
  LOAD_EVENTS_SUCCESS
} from '../activity';

/** Users */
import {
  LOAD_COMPANY_USERS_SUCCESS
} from '../company';
import {
  LOAD_RECOMMENDED_USERS_SUCCESS
} from '../me';
import {
  LOAD_RECOMMENDATIONS_SUCCESS,
  LOAD_PEOPLE_SUCCESS
} from '../people';
import {
  SEARCH_PEOPLE_SUCCESS
} from '../channelShare';
import {
  LOAD_USER_PROFILE,
  LOAD_USER_PROFILE_SUCCESS,
  SAVE_USER,

  LOAD_USER_PUBLISHED_STORIES,
  LOAD_USER_PUBLISHED_STORIES_SUCCESS,
  LOAD_USER_FOLLOWERS,
  LOAD_USER_FOLLOWERS_SUCCESS,
  LOAD_USER_FOLLOWING,
  LOAD_USER_FOLLOWING_SUCCESS,
  LOAD_USER_GROUPS,
  LOAD_USER_GROUPS_SUCCESS,

  LOAD_USER_SCHEDULED_STORIES,
  LOAD_USER_SCHEDULED_STORIES_SUCCESS,

  TOGGLE_USER_FOLLOW,
  TOGGLE_USER_FOLLOW_FAIL
} from '../user';

/** Files */
import {
  GET_BLOCKS_SUCCESS,
} from '../canvas/canvas';
import {
  LOAD_RECOMMENDED_FILES_SUCCESS,
  LOAD_RECENT_FILES_SUCCESS
} from '../me';
import {
  LOAD_SEARCH_ALL_SUCCESS,
  LOAD_SEARCH_SUCCESS
} from '../search';
import {
  LOAD_FILE_SUCCESS,
  LOAD_FILE_FAIL,
  LOAD_HTML,
  LOAD_HTML_SUCCESS,
  LOAD_HTML_FAIL,
  UPDATE_FILE
} from '../viewer';

/** Bookmarks */
import {
  LOAD_BOOKMARKS_SUCCESS
} from '../me';
import {
  ADD_FILE_BOOKMARK,
  ADD_FILE_BOOKMARK_SUCCESS,
  ADD_FILE_BOOKMARK_FAIL,
  DELETE_FILE_BOOKMARK,
  DELETE_FILE_BOOKMARK_SUCCESS,
  DELETE_FILE_BOOKMARK_FAIL,
  ADD_BOOKMARK_STACK_SUCCESS,
  DELETE_BOOKMARK_STACK
} from '../viewer';

import {
  ADD_FILE_BOOKMARK as ADD_FILE_SEARCH_BOOKMARK,
  ADD_FILE_BOOKMARK_SUCCESS as ADD_FILE_SEARCH_BOOKMARK_SUCCESS,
  DELETE_FILE_BOOKMARK_SUCCESS as DELETE_FILE_SEARCH_BOOKMARK_SUCCESS,
  DELETE_FILE_BOOKMARK as DELETE_FILE_SEARCH_BOOKMARK,
  SEARCH_FILE_SUCCESS
} from '../supersearch';

/** Comments */
import {
  ADD_COMMENT_SUCCESS,
  DELETE_COMMENT
} from '../story/story';

/** Praises */
import {
  ADD_PRAISE_SUCCESS,
  DELETE_PRAISE
} from '../user';

/** Notifications */
import {
  LOAD_NOTIFICATIONS_SUCCESS
} from '../activity';

/** Websites */
import {
  LOAD_WEBSITES_SUCCESS,
  DELETE_WEBSITE
} from '../company';

/** Chat */
import {
  MESSAGES_READ,
  NEW_RECIPIENT,
  RECEIVED_CALL_INVITATION,
  RECEIVED_MESSAGE,
  RECEIVED_PRESENCE,
  RECEIVED_PRESENCE_BATCH,
  ROSTER_RESPONSE,
  SEND_MESSAGE,
  SET_ACTIVE_RECIPIENT,
  SET_MESSAGE_BODY,
  TOGGLE_PIN,

  LOAD_STORY_SUCCESS as LOAD_CHAT_STORY_SUCCESS,
  LOAD_STORY_FAIL as LOAD_CHAT_STORY_FAIL,
  LOAD_FILE_SUCCESS as LOAD_CHAT_FILE_SUCCESS,
  LOAD_FILE_FAIL as LOAD_CHAT_FILE_FAIL,
} from '../../../../_assets/style-guide/src/redux/modules/chat/actions';

/** Notes */
import {
  LOAD_NOTES_SUCCESS
} from '../me';

import {
  LOAD_NOTE_SUCCESS,
  ADD_NOTE_SUCCESS,
  DELETE_NOTES
} from '../note';

import {
  GET_SHARE_CHANNEL_USERS_SUCCESS,
} from '../channelShare';
/** Files */
import {
  ADD_TAGS_TO_FILE,
  GET_FILE_TAGS_SUCCESS,
  REMOVE_TAGS_FROM_FILE,
} from '../tag';

/** Entity reducer action types */
export const DELETE_ENTITY = 'entities/DELETE_ENTITY';
export const TOGGLE_ENTITY_ATTRIBUTE = 'entities/TOGGLE_ENTITY_ATTRIBUTE';
export const UPDATE_ENTITY = 'entities/UPDATE_ENTITY';

function generateSlug(entity) {
  return `${entity.user}-${entity.id}-${entity.time}`;
}

// Set API results limit
const globalFetchLimit = 100;

// Valid entity names for entity reducer actions
const validEntityNames = [
  'tabs',
  'channels',
  'stories',
  'users',
  'files',
  'bookmarks',
  'comments',
  'notes',
  'groups',
  'websites',
  'shares'
];

// Define schemes for our entities
const tab = new Schema('tabs', { defaults: { type: 'tab', channels: [] } });
const channel = new Schema('channels', { defaults: { type: 'channel' } });
const story = new Schema('stories', { idAttribute: 'permId', defaults: { type: 'story' } });
const event = new Schema('events', { defaults: { type: 'meeting' } });
const user = new Schema('users', { defaults: { type: 'people', unreadCount: 0 } });
const file = new Schema('files', { defaults: { type: 'file', bookmarks: [] } });
const bookmark = new Schema('bookmarks', { defaults: { type: 'bookmark' } });
const comment = new Schema('comments', { defaults: { type: 'comment', replies: [] } });
const praise = new Schema('praises', { defaults: { type: 'praise' } });
const note = new Schema('notes', { defaults: { type: 'note' } });
const notification = new Schema('notifications', { defaults: { type: 'notification' } });
const notificationStory = new Schema('stories', { idAttribute: 'permId', defaults: { type: 'story' } });
const website = new Schema('websites', { defaults: { type: 'web' } });
const group = new Schema('groups', { defaults: { type: 'group' } });
const message = new Schema('messages', { idAttribute: generateSlug });
const share = new Schema('shares', { idAttribute: 'shareSessionId', defaults: { type: 'share' } });

// Define nesting rules
tab.define({
  channels: arrayOf(channel)
});

channel.define({
  stories: arrayOf(story),
  groups: arrayOf(group)
});

story.define({
  tab: tab,
  author: user,
  channels: arrayOf(channel),
  comments: arrayOf(comment),
  events: arrayOf(event),
  files: arrayOf(file),
  notes: arrayOf(note)
});

user.define({
  mostVisitedFiles: arrayOf(file),
  mostVisitedStories: arrayOf(story),
  publishedStories: arrayOf(story),
  //recentShares
  recentlyFollowed: arrayOf(user),
  praises: arrayOf(praise),
  //Chat
  messages: arrayOf(message),
});

file.define({
  bookmarks: arrayOf(bookmark)
});

group.define({
  users: arrayOf(user),
});

/** Bookmark setData can be made up of files or a stories */
const setData = unionOf({
  file: file,
  story: story
}, { schemaAttribute: 'type' });

bookmark.define({
  setData: arrayOf(setData)
});

comment.define({
  author: user,
  replies: arrayOf(comment)
});

praise.define({
  praisedBy: user
});

notificationStory.define({
  tab: tab,
  author: user,
  channels: arrayOf(channel),
  comments: arrayOf(comment),
  events: arrayOf(event),
  notes: arrayOf(note)
});

notification.define({
  story: notificationStory,
  user: user
});

/**
 * Reducer
 */
export const initialState = {
  tabs: {
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
  channels: {},
  stories: {},
  events: {},
  users: {},
  files: {},
  bookmarks: {},
  comments: {},
  notes: {},
  notifications: {},
  shares: {},
  shareRecipients: {},
  websites: {},
  groups: {},

  // Chat states
  activeRecipientId: 0,
  unreadCount: 0,
  // id of last sent/recieved message
  lastMessage: null,
  // Chat - normalised data
  messagesById: {},
};

export default function entities(state = initialState, action = {}) {
  switch (action.type) {
    /** Generic Entity actions */
    case UPDATE_ENTITY:
      if (validEntityNames.indexOf(action.name) === -1) {
        console.warn('Invalid entity name: ' + action.name);  // eslint-disable-line
        return state;
      }
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          [action.id]: {
            ...state[action.name][action.id],
            ...action.attrs
          }
        }
      };
    case TOGGLE_ENTITY_ATTRIBUTE:
      if (validEntityNames.indexOf(action.name) === -1) {
        console.warn('Invalid entity name: ' + action.name);  // eslint-disable-line
        return state;
      }
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          [action.id]: {
            ...state[action.name][action.id],
            [action.attrName]: !state[action.name][action.id][action.attrName]
          }
        }
      };
    case DELETE_ENTITY:
      if (validEntityNames.indexOf(action.name) === -1) {
        console.warn('Invalid entity name: ' + action.name);  // eslint-disable-line
        return state;
      }
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          [action.id]: {
            ...state[action.name][action.id],
            deleted: true
          }
        }
      };

    /** ADMIN Archived Stories */
    case LOAD_ADMIN_ARCHIVED_STORIES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(story));

      return {
        ...state,
        files: merge({}, state.files, {
          ...normalized.entities.files
        }),
        stories: merge({}, state.stories, {
          ...normalized.entities.stories
        }),
        users: merge({}, state.users, {
          ...normalized.entities.users
        })
      };
    }

    /** ADMIN Relationship */
    case REMOVE_ADMIN_INTEREST_AREA_LINK_SUCCESS: {
      let data = {};

      // add from search list
      const total = state.groups[action.params.id].childCount - 1;
      data = {
        ...state,
        groups: {
          ...state.groups,
          [action.params.id]: {
            ...state.groups[action.params.id],
            childCount: total
          }
        }
      };

      return {
        ...state,
        ...data
      };
    }
    case SET_ADMIN_INTEREST_AREA_LINK_SUCCESS: {
      let data = {};

      // add from search list
      const counter = action.params.interestAreas.length;
      const total = state.groups[action.params.id].childType === 'interest-group' ? state.groups[action.params.id].childCount + counter : state.groups[action.params.id].childCount;
      data = {
        ...state,
        groups: {
          ...state.groups,
          [action.params.id]: {
            ...state.groups[action.params.id],
            childCount: total
          }
        }
      };

      return {
        ...state,
        ...data
      };
    }
    case SET_ADMIN_RELATIONSHIP_SUCCESS: {
      let data = {};

      switch (action.params.type) {
        case 'group': {
          // Quick edit group
          data = {
            groups: {
              ...state.groups,
              [action.params.group]: {
                ...state.groups[action.params.group],
                permissions: Number(action.params.permissions)
              }
            }
          };
          break;
        }
        case 'groupList': {
          // add from search list
          const total = action.params.group.length;
          const counter = action.params.action === 'add' ? (+1 * total) : (-1 * total);
          data = {
            ...state,
            channels: {
              ...state.channels,
              [action.params.channel]: {
                ...state.channels[action.params.channel],
                childCount: state.channels[action.params.channel].childCount + counter
              }
            }
          };
          break;
        }
        case 'channelList': {
          // add from search list
          const total = action.params.channel.length;
          const counter = action.params.action === 'add' ? (+1 * total) : (-1 * total);
          data = {
            ...state,
            tabs: {
              ...state.tabs,
              [action.params.tab]: {
                ...state.tabs[action.params.tab],
                childCount: state.tabs[action.params.tab].childCount + counter
              }
            }
          };
          break;
        }
        case 'userList': {
          // add from search list
          const total = action.params.user.length;
          const counter = action.params.action === 'add' ? (+1 * total) : (-1 * total);
          data = {
            ...state,
            groups: {
              ...state.groups,
              [action.params.group]: {
                ...state.groups[action.params.group],
                childCount: state.groups[action.params.group].childCount + counter
              }
            }
          };
          break;
        }
        default:
          break;
      }

      return {
        ...state,
        ...data
      };
    }

    /** ADMIN Tabs */
    case LOAD_ADMIN_TABS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(tab));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case SAVE_ADMIN_TAB_SUCCESS: {
      const type = action.params.type === 'web' ? website : tab;
      const normalized = normalize([action.result], arrayOf(type));
      return merge({}, state, {
        ...normalized.entities
      });
    }

    /** ADMIN Channels */
    case LOAD_ADMIN_CHANNELS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(channel));
      return {
        ...state,
        channels: merge({}, state.channels, {
          ...normalized.entities.channels
        })
      };
    }

    case SAVE_ADMIN_CHANNEL_SUCCESS: {
      const normalized = normalize([action.result], arrayOf(channel));
      const total = !action.params.id ? 1 : 0;

      // Increase Tab childCounter
      const tmpState = {
        ...state,
        tabs: {
          ...state.tabs,
          [action.params.tabId]: {
            ...state.tabs[action.params.tabId],
            childCount: state.tabs[action.params.tabId].childCount + total
          }
        }
      };

      return merge({}, tmpState, {
        ...normalized.entities
      });
    }

    case DELETE_ADMIN_CHANNEL_SUCCESS: {
      // decrease Tab childCounter
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.params.tabId]: {
            ...state.tabs[action.params.tabId],
            childCount: state.tabs[action.params.tabId].childCount - 1
          }
        }
      };
    }

    /** ADMIN Groups */
    case LOAD_ADMIN_ALL_GROUPS_LIST_SUCCESS:
    case LOAD_ADMIN_ALL_GROUPS_SUCCESS:
    case LOAD_ADMIN_GROUPS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(group));
      return {
        ...state,
        groups: merge({}, state.groups, {
          ...normalized.entities.groups
        })
      };
    }

    case SAVE_ADMIN_GROUP_SUCCESS: {
      const normalized = normalize([action.result], arrayOf(group));
      const normalizedGroup = normalize([{ ...action.result, permissions: action.params.permissions }], arrayOf(group));
      const total = !action.params.id ? 1 : 0;
      let tmpState = {};

      if (action.params.optionType !== 'onlyGroup') {
        // Increase Group childCounter
        tmpState = {
          ...state,
          channels: {
            ...state.channels,
            [action.params.channelId]: {
              ...state.channels[action.params.channelId],
              childCount: state.channels[action.params.channelId].childCount + total
            }
          },
          groups: merge({}, state.groups, {
            ...normalizedGroup.entities.groups
          })
        };

        return merge({}, tmpState, {
          ...normalized.entities
        });
      }

      // Saving only group
      return {
        ...state,
        groups: merge({}, state.groups, {
          ...normalizedGroup.entities.groups
        })
      };
    }

    /** ADMIN Users */
    case LOAD_ADMIN_BUNDLE_USERS_SUCCESS:
    case LOAD_ADMIN_USERS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(user));
      return {
        ...state,
        users: merge({}, state.users, {
          ...normalized.entities.users
        })
      };
    }

    case SAVE_ADMIN_USER_SUCCESS: {
      const total = !action.params.id ? 1 : 0;
      let groupParent = {};

      // whether user parent is group increase counter
      if (state.groups[action.params.groupId]) {
        groupParent = {
          groups: {
            ...state.groups,
            [action.params.groupId]: {
              ...state.groups[action.params.groupId],
              childCount: state.groups[action.params.groupId].childCount + total
            }
          }
        };
      }

      return {
        ...state,
        users: {
          ...state.users,
          [action.result.id]: {
            ...state.users[action.result.id],
            ...action.result,
            role: action.result.roleId
          }
        },
        ...groupParent
      };
    }

    case DELETE_ADMIN_USER_SUCCESS: {
      // decrease Group childCounter for Structure
      let data = {};
      if (!action.params.parentType && action.params.groupId) { // delete user from structure
        data = {
          groups: {
            ...state.groups,
            [action.params.groupId]: {
              ...state.groups[action.params.groupId],
              childCount: state.groups[action.params.groupId].childCount - 1
            }
          }
        };
      }

      return {
        ...state,
        ...data
      };
    }

    /** Tabs */
    case LOAD_TABS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(tab));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case LOAD_TAB_SUCCESS: {
      const normalized = normalize(action.result, tab);
      return merge({}, state, {
        ...normalized.entities
      });
    }

    /** Channels */
    case LOAD_CHANNELS: {
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.tabId]: {
            ...state.tabs[action.tabId],
            channelsLoading: true
          }
        }
      };
    }
    case LOAD_CHANNELS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(channel));

      // Merge channels array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.tabs[action.tabId].channels, normalized.result) : normalized.result;

      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.tabId]: {
            ...state.tabs[action.tabId],
            channels: newOrder,
            channelsLoading: false,
            channelsComplete: action.result.length < globalFetchLimit,
            channelsError: null
          }
        },
        channels: merge({}, state.channels, {
          ...normalized.entities.channels
        })
      };
    }
    case LOAD_CHANNELS_FAIL:
      return {
        ...state,
        tabs: {
          ...state.tabs,
          [action.tabId]: {
            ...state.tabs[action.tabId],
            channelsLoading: false,
            channelsError: action.error
          }
        }
      };
    case GET_SHARE_CHANNEL_USERS_SUCCESS: {
      const channelId = +action.params.channelId;
      const count = action.result.length;
      return {
        ...state,
        channels: {
          ...state.channels,
          [channelId]: {
            ...state.channels[channelId],
            shareCount: count,
            shareUsers: action.result
          }
        }
      };
    }

    case LOAD_SETTINGS_SUCCESS: {
      const defaultChannel = action.result.storyDefaults.channels;
      const thisUser = action.result.user;

      const channelData = defaultChannel ? { [defaultChannel.id]: { ...defaultChannel } } : {};
      const userData = thisUser ? { [thisUser.id]: { ...thisUser } } : {};

      return {
        ...state,
        channels: merge({}, state.channels, {
          ...channelData
        }),
        users: {
          ...state.users,
          ...userData
        }
      };
    }
    case SUBSCRIBE_CHANNEL: {
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.id]: {
            ...state.channels[action.id],
            isSubscribed: action.isSubscribed
          }
        }
      };
    }
    case SUBSCRIBE_CHANNEL_FAIL:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.id]: {
            ...state.channels[action.id],
            isSubscribed: !action.isSubscribed
          }
        }
      };
    // Manage subscription - User settings
    case LOAD_CHANNEL_SUBSCRIPTIONS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(channel));

      return {
        ...state,
        channels: merge({}, state.channels, {
          ...normalized.entities.channels
        })
      };
    }

    /** Stories */
    case LOAD_COMPANY_ALL_SUCCESS: {
      const normalized = normalize(action.result, {
        featured_stories: arrayOf(story),
        latest_stories: arrayOf(story),
        my_most_viewed_stories: arrayOf(story),
        my_recommended_stories: arrayOf(story),
        my_top_users: arrayOf(user),
        top_stories: arrayOf(story)
      });
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case LOAD_COMPANY_STORIES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(story));
      return merge({}, state, {
        ...normalized.entities
      });
    }

    case LOAD_STORIES: {
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            storiesLoading: true
          }
        }
      };
    }
    case LOAD_STORIES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(story));

      // Merge stories array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.channels[action.channelId].stories, normalized.result) : normalized.result;

      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            stories: newOrder,
            storiesLoading: false,
            storiesComplete: action.result.length < globalFetchLimit,
            storiesError: null
          }
        },
        files: merge({}, state.files, {
          ...normalized.entities.files
        }),
        bookmarks: merge({}, state.bookmarks, {
          ...normalized.entities.bookmarks
        }),
        stories: merge({}, state.stories, {
          ...normalized.entities.stories
        }),
        users: merge({}, state.users, {
          ...normalized.entities.users
        })
      };
    }
    case LOAD_STORIES_FAIL:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.channelId]: {
            ...state.channels[action.channelId],
            storiesLoading: false,
            storiesError: action.error
          }
        }
      };
    case LOAD_ME_SUCCESS: {
      const normalized = normalize(action.result, {
        bookmarks: arrayOf(bookmark),
        notes: arrayOf(note),
        publishedStories: arrayOf(story),
        recentStories: arrayOf(story),
        recentFiles: arrayOf(file),
        recentShares: arrayOf(share)
      });

      return merge({}, state, {
        ...normalized.entities
      });
    }
    case LOAD_LIKED_STORIES_SUCCESS:
    case LOAD_RECOMMENDED_STORIES_SUCCESS:
    case LOAD_RECENT_STORIES_SUCCESS:
    case LOAD_STORIES_WITH_COMMENTS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(story));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case LOAD_STORY_SUBSCRIPTIONS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(story));
      return {
        ...state,
        stories: merge({}, state.stories, {
          ...normalized.entities.stories
        })
      };
    }

    case LOAD_PROTECTED_STORY_SUCCESS:
    case LOAD_STORY_SUCCESS: {
      // Protected & Locked Story
      if (action.result.isProtected && !action.result.author) {
        return state;
      }
      const permId = action.result.permId;

      const normalized = normalize(action.result, story);

      const newState = merge({}, state, {
        ...normalized.entities
      });

      return {
        ...newState,
        stories: {
          ...newState.stories,
          [permId]: {
            ...normalized.entities.stories[permId]
          }
        }
      };
    }
    case SAVE_STORY_SUCCESS: {
      const permId = action.result.permId;
      const normalized = normalize(action.result, story);

      // comments, files etc., all change IDs when a Story is edited
      return {
        ...state,
        comments: merge({}, state.comments, {
          ...normalized.entities.comments
        }),
        events: merge({}, state.events, {
          ...normalized.entities.events
        }),
        files: merge({}, state.files, {
          ...normalized.entities.files
        }),
        flags: merge({}, state.flags, {
          ...normalized.entities.flags
        }),
        stories: {
          ...state.stories,
          [permId]: {
            ...normalized.entities.stories[permId]  // Overrides Story (no merge)
          }
        },
      };
    }
    case ARCHIVE_STORY_SUCCESS: {
      return {
        ...state,
        stories: {
          ...state.stories,
          [action.permId]: {
            ...state.stories[action.permId],
            archivedAt: action.result.archivedAt,
            status: action.result.status
          }
        }
      };
    }
    case STATUS_SUCCESS: {
      const normalized = normalize(action.result, story);
      const permId = action.result.permId;
      const fileIds = action.result.files.map(f => f.id);

      // Fixes for bokmarks removed when status is fetched
      const fileList = normalized.entities.files;
      const filesTmp = {};
      if (fileList) {
        Object.keys(fileList).forEach(itemKey => {
          const item = fileList[itemKey];
          const isBookmarked = item.bookmarks === true || (item.bookmarks && !!item.bookmarks.length && item.bookmarks.some(bid => state.bookmarks[bid] && state.bookmarks[bid].stackSize === 1 && !state.bookmarks[bid].deleted));

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
        stories: {
          ...state.stories,
          [permId]: {
            ...state.stories[permId],
            ...normalized.entities.stories[permId],
            files: union(normalized.entities.stories[permId].files, fileIds)
          }
        },
        files: merge({}, state.files, {
          ...filesTmp
        })
      };
    }
    case ADD_STORY_BOOKMARK:
      return {
        ...state,
        stories: {
          ...state.stories,
          [action.permId]: {
            ...state.stories[action.permId],
            isBookmark: true
          }
        }
      };
    case ADD_STORY_BOOKMARK_SUCCESS:
      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          [action.result.id]: {
            ...state.bookmarks[action.result.id],
            id: action.result.id,
            name: state.stories[action.permId].name,
            stackSize: 1,
            setData: {
              id: state.stories[action.permId].id,
              schema: 'story'
            }
          }
        },
        stories: {
          ...state.stories,
          [action.permId]: {
            ...state.stories[action.permId],
            bookmarkId: action.result.id
          }
        }
      };
    case DELETE_STORY_BOOKMARK: {
      const bookmarkId = action.bookmarkId;
      let newBookmarks = state.bookmarks;

      if (state.bookmarks[bookmarkId]) {
        newBookmarks = {
          ...state.bookmarks,
          [bookmarkId]: {
            ...state.bookmarks[bookmarkId],
            deleted: true
          }
        };
      }

      return {
        ...state,
        bookmarks: newBookmarks,
        stories: {
          ...state.stories,
          [action.permId]: {
            ...state.stories[action.permId],
            isBookmark: false,
            bookmarkId: 0
          }
        }
      };
    }
    case LIKE_STORY: {
      const thisStory = state.stories[action.permId];

      // Reset count to zero if unliking the only like
      let newRatingCount = thisStory.ratingCount + 1;
      if (!action.isLiked && thisStory.ratingCount === 1) {
        newRatingCount = 0;

      // Subtract if un-liking
      } else if (!action.isLiked && thisStory.ratingCount > 1) {
        newRatingCount = thisStory.ratingCount - 1;
      }

      return {
        ...state,
        stories: {
          ...state.stories,
          [action.permId]: {
            ...state.stories[action.permId],
            isLiked: action.isLiked,
            ratingCount: newRatingCount
          }
        }
      };
    }
    case LIKE_STORY_FAIL: {
      const thisStory = state.stories[action.permId];

      return {
        ...state,
        stories: {
          ...state.stories,
          [action.permId]: {
            ...state.stories[action.permId],
            isLiked: !action.isLiked,
            ratingCount: thisStory.ratingCount - 1
          }
        }
      };
    }
    case SUBSCRIBE_STORY: {
      return {
        ...state,
        stories: {
          ...state.stories,
          [action.permId]: {
            ...state.stories[action.permId],
            isSubscribed: action.isSubscribed
          }
        }
      };
    }
    case SUBSCRIBE_STORY_FAIL:
      return {
        ...state,
        stories: {
          ...state.stories,
          [action.permId]: {
            ...state.stories[action.permId],
            isSubscribed: !action.isSubscribed
          }
        }
      };

    /** Events */
    case LOAD_EVENTS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(event));
      return merge({}, state, {
        ...normalized.entities
      });
    }

    /** Files */
    case GET_BLOCKS_SUCCESS: {
      return {
        ...state,
        files: {
          ...state.files,
          [action.fileId]: {
            ...state.files[action.fileId],
            blocks: action.result
          }
        }
      };
    }
    case SEARCH_FILE_SUCCESS:
    case LOAD_RECOMMENDED_FILES_SUCCESS:
    case LOAD_RECENT_FILES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(file));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case LOAD_SEARCH_SUCCESS:
    case LOAD_SEARCH_ALL_SUCCESS: {
      // Only handle files for now
      if (action.params.type === 'files') {
        const normalized = normalize(action.result.results, arrayOf(file));
        return merge({}, state, {
          ...normalized.entities
        });
      }
      return state;
    }

    /** Users */
    case LOAD_COMPANY_USERS_SUCCESS:
    case LOAD_RECOMMENDED_USERS_SUCCESS:
    case SEARCH_PEOPLE_SUCCESS:
    case LOAD_PEOPLE_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(user));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case LOAD_RECOMMENDATIONS_SUCCESS: {
      const normalized = normalize(action.result, {
        featured_users: arrayOf(user),
        similar_users: arrayOf(user),
      });
      return merge({}, state, {
        ...normalized.entities
      });
    }

    /** Single User */
    case LOAD_USER_PROFILE:
      return {
        ...state,
        users: {
          ...state.users,
          [action.userId]: {
            ...state.users[action.userId],
            profileLoading: true
          }
        }
      };

    case LOAD_USER_PROFILE_SUCCESS: {
      //remap group object to groupid array
      const userProfile = Object.assign({}, action.result);
      userProfile.groups = (userProfile.groups || []).map((groupItem) => groupItem.id);
      //sometime user groups being reset during the person profile view so just for the backdrop
      userProfile.groupCount = userProfile.groups.length;
      const normalized = normalize(userProfile, user);
      const mergedEntities = merge({}, state, {
        ...normalized.entities
      });

      return {
        ...mergedEntities,
        users: {
          ...mergedEntities.users,
          [action.userId]: {
            ...mergedEntities.users[action.userId],
            metadata: normalized.entities.users[action.userId].metadata,
            profileLoaded: true,
            profileLoading: false
          }
        }
      };
    }
    case SAVE_USER: {
      return {
        ...state,
        users: {
          ...state.users,
          [action.userId]: {
            ...state.users[action.userId],
            ...action.data
          }
        }
      };
    }

    case LOAD_USER_FOLLOWERS:
      return {
        ...state,
        users: {
          ...state.users,
          [action.userId]: {
            ...state.users[action.userId],
            followersLoading: true
          }
        }
      };
    case LOAD_USER_FOLLOWERS_SUCCESS: {
      const userIds = action.result.map(u => u.id);
      const normalized = normalize(action.result, arrayOf(user));

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.users[action.userId].followers, userIds) : userIds;

      return {
        ...state,
        users: merge({}, state.users, {
          ...normalized.entities.users,
          [action.userId]: {
            ...state.users[action.userId],
            followers: newOrder,
            followersLoaded: true,
            followersLoading: false,
            followersComplete: action.result.length < globalFetchLimit
          }
        })
      };
    }
    case LOAD_USER_FOLLOWING:
      return {
        ...state,
        users: {
          ...state.users,
          [action.userId]: {
            ...state.users[action.userId],
            followingLoading: true
          }
        }
      };
    case LOAD_USER_FOLLOWING_SUCCESS: {
      const userIds = action.result.map(u => u.id);
      const normalized = normalize(action.result, arrayOf(user));

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.users[action.userId].following, userIds) : userIds;

      return {
        ...state,
        users: merge({}, state.users, {
          ...normalized.entities.users,
          [action.userId]: {
            ...state.users[action.userId],
            following: newOrder,
            followingLoaded: true,
            followingLoading: false,
            followingComplete: action.result.length < globalFetchLimit
          }
        })
      };
    }

    case LOAD_USER_GROUPS:
      return {
        ...state,
        groups: merge({}, state.groups),
      };
    case LOAD_USER_GROUPS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(group));
      const dd = {
        ...state,
        groups: merge({}, state.groups, {
          ...normalized.entities.groups,
          groupLoaded: true,
          groupLoading: false,
          groupComplete: action.result.length < globalFetchLimit
        })
      };
      return dd;
    }

    case LOAD_USER_PUBLISHED_STORIES:
      return {
        ...state,
        users: {
          ...state.users,
          [action.userId]: {
            ...state.users[action.userId],
            publishedStoriesLoading: true
          }
        }
      };
    case LOAD_USER_PUBLISHED_STORIES_SUCCESS: {
      const storyIds = action.result.map(s => s.permId);
      const normalized = normalize(action.result, arrayOf(story));

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.users[action.userId].published, storyIds) : storyIds;

      return merge({}, state, {
        ...normalized.entities,
        users: merge({}, state.users, {
          ...normalized.entities.users,
          [action.userId]: {
            ...state.users[action.userId],
            publishedStories: newOrder,
            publishedStoriesLoaded: true,
            publishedStoriesLoading: false,
            publishedStoriesComplete: action.result.length < globalFetchLimit
          }
        })
      });
    }

    case LOAD_USER_SCHEDULED_STORIES:
      return {
        ...state,
        users: {
          ...state.users,
          [action.userId]: {
            ...state.users[action.userId],
            scheduledStoriesLoading: true
          }
        }
      };
    case LOAD_USER_SCHEDULED_STORIES_SUCCESS: {
      const storyIds = action.result.map(s => s.permId);
      const normalized = normalize(action.result, arrayOf(story));
      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.users[action.userId].scheduledStories, storyIds) : storyIds;
      return {
        ...merge({}, state, {
          ...normalized.entities
        }),
        users: {
          ...state.users,
          [action.userId]: {
            ...state.users[action.userId],
            scheduledStories: newOrder,
            scheduledStoriesLoaded: true,
            scheduledStoriesLoading: false,
            scheduledStoriesComplete: action.result.length < globalFetchLimit
          }
        }
      };
    }

    case TOGGLE_USER_FOLLOW:
    case TOGGLE_USER_FOLLOW_FAIL:
      return {
        ...state,
        users: {
          ...state.users,
          [action.userId]: {
            ...state.users[action.userId],
            isFollowed: !state.users[action.userId].isFollowed
          }
        }
      };

    /** Bookmarks **/
    case LOAD_BOOKMARKS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(bookmark));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case ADD_FILE_SEARCH_BOOKMARK:
    case ADD_FILE_BOOKMARK:
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            isBookmark: true,
            isBookmarkSelf: true,
            bookmarkLoading: true,
          }
        }
      };
    case ADD_FILE_SEARCH_BOOKMARK_SUCCESS:
    case ADD_FILE_BOOKMARK_SUCCESS: {
      const newBookmark = {
        ...action.result,
        stackSize: 1
      };

      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          [action.result.id]: {
            ...newBookmark
          }
        },
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            bookmarks: union(state.files[action.id].bookmarks, [action.result.id]),
            bookmarkLoading: false,
          }
        }
      };
    }
    case ADD_FILE_BOOKMARK_FAIL:
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            isBookmarkSelf: false,
            bookmarkLoading: false,
          }
        }
      };
    case DELETE_FILE_SEARCH_BOOKMARK: {
      const bookmarksArr = !isEmpty(state.files[action.id]) && state.files[action.id].bookmarks;
      const newBookmarks = bookmarksArr.length && bookmarksArr.filter(b => b !== action.bookmarkId);
      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          [action.id]: {
            ...state.bookmarks[action.bookmarkId],
            deleted: true
          }
        },
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            bookmarks: newBookmarks || [],
            isBookmark: newBookmarks && newBookmarks.length > 0,
            isBookmarkSelf: false,
            bookmarkLoading: true,
          }
        }
      };
    }
    case DELETE_FILE_BOOKMARK: {
      const newBookmarks = [...state.files[action.id].bookmarks];
      const bookmarkIndex = newBookmarks.findIndex(bid => bid === action.bookmarkId);
      if (bookmarkIndex > -1) {
        newBookmarks.splice(bookmarkIndex, 1);
      }

      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          [action.bookmarkId]: {
            ...state.bookmarks[action.bookmarkId],
            deleted: true
          }
        },
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            bookmarks: newBookmarks,
            isBookmark: newBookmarks.length > 0,
            isBookmarkSelf: false,
            bookmarkLoading: true,
          }
        }
      };
    }
    case DELETE_FILE_SEARCH_BOOKMARK_SUCCESS:
    case DELETE_FILE_BOOKMARK_SUCCESS:
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            bookmarkLoading: false,
          }
        }
      };
    case DELETE_FILE_BOOKMARK_FAIL:
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            isBookmark: true,
            isBookmarkSelf: true,
            bookmarkLoading: false,
          }
        }
      };

    case ADD_BOOKMARK_STACK_SUCCESS: {
      const normalized = normalize(action.result, bookmark);
      const newBookmark = {
        ...action.result,
        stackSize: action.result.setData.length
      };

      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          [action.result.id]: {
            ...newBookmark
          }
        },
        files: {
          ...state.files,
          ...normalized.entities.files
        }
      };
    }
    case DELETE_BOOKMARK_STACK: {
      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          [action.bookmarkId]: {
            ...state.bookmarks[action.bookmarkId],
            deleted: true,
            stackSize: 0
          }
        }
      };
    }

    /** Comments  */
    case ADD_COMMENT_SUCCESS: {
      const normalized = normalize(action.result, comment);
      const storyId = action.data.storyPermId;

      // Update Story with new comment ID
      const newStory = {
        ...state.stories[storyId],
        comments: [...state.stories[storyId].comments],
        commentCount: state.stories[storyId].commentCount ? state.stories[storyId].commentCount + 1 : 1
      };

      const newComments = {
        ...state.comments,
        ...normalized.entities.comments
      };

      // Comment reply
      if (action.result.parentId) {
        newComments[action.result.parentId].replies = [...newComments[action.result.parentId].replies, action.result.id];

      // Top-level comment
      } else {
        newStory.comments.push(action.result.id);
      }

      return {
        ...state,
        comments: {
          ...newComments
        },
        stories: {
          ...state.stories,
          [storyId]: {
            ...newStory
          }
        }
      };
    }
    case DELETE_COMMENT: {
      const storyId = action.storyPermId;
      const totalDeleted = state.stories[storyId].commentCount - action.totalCommentsDeleted || 0;

      return {
        ...state,
        comments: {
          ...state.comments,
          [action.id]: {
            ...state.comments[action.id],
            status: 'deleted'
          }
        },
        stories: {
          ...state.stories,
          [storyId]: {
            ...state.stories[storyId],
            commentCount: totalDeleted
          }
        }
      };
    }

    /** Praises */
    case ADD_PRAISE_SUCCESS: {
      const normalized = normalize(action.result, praise);
      const userId = action.data.userPraisedId;

      return {
        ...state,
        users: {
          ...state.users,
          [userId]: {
            ...state.users[userId],
            praises: union([normalized.result], state.users[userId].praises)
          }
        },
        praises: merge({}, state.praises, {
          ...normalized.entities.praises
        })
      };
    }
    case DELETE_PRAISE: {
      return {
        ...state,
        praises: {
          ...state.praises,
          [action.id]: {
            ...state.praises[action.id],
            status: 'deleted'
          }
        }
      };
    }

    /** Notifications */
    case LOAD_NOTIFICATIONS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(notification));
      return merge({}, state, {
        ...normalized.entities
      });
    }

    /** Websites */
    case LOAD_ADMIN_WEBSITES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(website));
      return merge({}, state, {
        ...normalized.entities
      });
    }

    case LOAD_WEBSITES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(website));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case DELETE_WEBSITE: {
      return {
        ...state,
        websites: {
          ...state.websites,
          [action.bookmarkId]: {
            ...state.websites[action.id],
            deleted: true
          }
        }
      };
    }

    case LOAD_ADMIN_INTEREST_AREAS_SUCCESS:
    case LOAD_ADMIN_GROUPS_IA_SUCCESS:
    case LOAD_ADMIN_WEBSITE_GROUPS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(group));
      return {
        ...state,
        groups: merge({}, state.groups, {
          ...normalized.entities.groups
        })
      };
    }

    /** Chat */
    case SET_ACTIVE_RECIPIENT:
      return {
        ...state,
        activeRecipientId: action.data.id
      };
    case SET_MESSAGE_BODY:
      return {
        ...state,
        users: {
          ...state.users,
          [action.data.userId]: {
            ...state.users[action.data.userId],
            messageBody: action.data.body
          }
        }
      };
    case TOGGLE_PIN:
      return {
        ...state,
        users: {
          ...state.users,
          [action.data.userId]: {
            ...state.users[action.data.userId],
            isPinned: !state.users[action.data.userId].isPinned
          }
        }
      };
    case MESSAGES_READ: {
      const newUsers = { ...state.users };
      let newUnreadCount = state.unreadCount;
      if (newUsers[action.data.id] && newUsers[action.data.id].unreadCount) {
        newUnreadCount -= newUsers[action.data.id].unreadCount;
        newUsers[action.data.id].unreadCount = 0;
      }

      if (newUnreadCount < 0) {
        newUnreadCount = 0;
      }

      return {
        ...state,
        unreadCount: newUnreadCount,
        users: newUsers
      };
    }
    case NEW_RECIPIENT:
      return {
        ...state,
        users: {
          ...state.users,
          [action.data.id]: {
            ...state.users[action.data.id],
            messages: []
          }
        }
      };
    case ROSTER_RESPONSE: {
      const parsedUsers = parseRoster(action.data.data.data.data.items);
      const normalized = normalize(parsedUsers, arrayOf(user));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case RECEIVED_PRESENCE: {
      const fromId = bearerIdToId(action.data.data.from);
      const priority = action.data.data.priority || 0;

      return {
        ...state,
        users: {
          ...state.users,
          [fromId]: {
            ...state.users[fromId],
            presence: priority
          }
        }
      };
    }
    case RECEIVED_PRESENCE_BATCH: {
      // We aren't allowed to modify the state, and we can't use
      // a collection or iteration to set up the literal object returned
      // at the end of the case. We have to deep-clone the users,
      // modify these, and then override the entire users array from
      // the original state.
      const users = JSON.parse(JSON.stringify(state.users));

      action.data.data.entries.forEach((presenceBatchEntry) => {
        const priority = presenceBatchEntry.priority || 0;

        presenceBatchEntry.names.forEach((name) => {
          const fromId = bearerIdToId(name);

          if (!users[fromId]) {
            // We don't have an entry for this user.
            return;
          }

          // set the presence for the name.
          users[fromId].presence = priority;
        });
      });

      return {
        ...state,
        users: {
          ...users
        }
      };
    }
    case RECEIVED_MESSAGE: {
      const rawData = action.data.data;
      let newUnreadCount = 0;
      let parsedMessage;

      // Offline or forwarded sent/received messages
      if (rawData.body === 'Offline message' || rawData.body === 'Forwarded carbon') {
        parsedMessage = processOfflineOrForwardedMessage(rawData);

        // Online received messages
      } else {
        parsedMessage = processOnlineMessage(rawData);

        // Increment global unreadCount if not active user
        if (state.activeRecipientId !== parsedMessage.user) {
          newUnreadCount = state.unreadCount + 1;
        }
      }

      // Create user object with messages to normalize
      const userData = {
        id: parsedMessage.user,
        messages: [parsedMessage],
        unreadCount: (state.users[parsedMessage.user] && state.activeRecipientId !== parsedMessage.user) ? state.users[parsedMessage.user].unreadCount + 1 : 0
      };

      const normalized = normalize(userData, user);
      const messageInternalId = generateSlug(parsedMessage);
      let mergedMessages = [];
      if (state.users[parsedMessage.user] && state.users[parsedMessage.user].messages && state.users[parsedMessage.user].messages.length) {
        mergedMessages = union(state.users[parsedMessage.user].messages, normalized.entities.users[parsedMessage.user].messages);
      } else {
        mergedMessages = normalized.entities.users[parsedMessage.user].messages;
      }

      return {
        ...state,
        unreadCount: newUnreadCount,
        lastMessage: messageInternalId,
        messagesById: {
          ...state.messagesById,
          ...normalized.entities.messages
        },
        users: {
          ...state.users,
          [parsedMessage.user]: {
            ...state.users[parsedMessage.user],
            ...normalized.entities.users[parsedMessage.user],
            messages: mergedMessages
          }
        }
      };
    }
    case RECEIVED_CALL_INVITATION: {
      const rawData = action.data.data;
      const parsedMessage = processCallInvitation(rawData);

      // Create user object with messages to normalize
      const userData = {
        id: parsedMessage.user,
        messages: [parsedMessage]
      };

      const normalized = normalize(userData, user);
      const messageInternalId = generateSlug(parsedMessage);

      let mergedMessages = [];
      if (state.users[parsedMessage.user] && state.users[parsedMessage.user].messages && state.users[parsedMessage.user].messages.length) {
        mergedMessages = union(state.users[parsedMessage.user].messages, normalized.entities.users[parsedMessage.user].messages);
      } else {
        mergedMessages = normalized.entities.users[parsedMessage.user].messages;
      }

      return {
        ...state,
        lastMessage: messageInternalId,
        messagesById: {
          ...state.messagesById,
          ...normalized.entities.messages
        },
        users: {
          ...state.users,
          [parsedMessage.user]: {
            ...state.users[parsedMessage.user],
            ...normalized.entities.users[parsedMessage.user],
            messages: mergedMessages
          }
        }
      };
    }
    case SEND_MESSAGE: {
      const parsedMessage = {
        id: parseInt(action.data.data.id, 10),
        body: action.data.data.body,
        ack: false,
        sent: true,
        time: Date.now(),
        type: action.data.data.type,
        user: bearerIdToId(action.data.data.to)
      };

      // Keep reference to file/story id for attachments
      if (parsedMessage.type === 'hub-attachment') {
        const attachment = parsedMessage.body.split('/');
        const attachmentType = attachment[0];
        const attachmentId = attachment[1];

        // Body contents no longer needed
        parsedMessage.body = '';

        // File
        if (attachmentType.indexOf('StoryFile') > -1) {
          parsedMessage.file = parseInt(attachmentId, 10);

          // Story
        } else if (attachmentType.indexOf('StoryPermanent') > -1) {
          parsedMessage.story = parseInt(attachmentId, 10);
        }
      }

      // Create user object with messages to normalize
      const userData = {
        id: parsedMessage.user,
        messages: [parsedMessage]
      };

      const messageInternalId = generateSlug(parsedMessage);

      const normalized = normalize(userData, user);
      let mergedMessages = [];
      if (state.users[parsedMessage.user] && state.users[parsedMessage.user].messages && state.users[parsedMessage.user].messages.length) {
        mergedMessages = union(state.users[parsedMessage.user].messages, normalized.entities.users[parsedMessage.user].messages);
      } else {
        mergedMessages = normalized.entities.users[parsedMessage.user].messages;
      }

      return {
        ...state,
        lastMessage: messageInternalId,
        messagesById: {
          ...state.messagesById,
          ...normalized.entities.messages
        },
        users: {
          ...state.users,
          [parsedMessage.user]: {
            ...state.users[parsedMessage.user],
            ...normalized.entities.users[parsedMessage.user],
            messages: mergedMessages
          }
        }
      };
    }
    // End Chat

    case LOAD_CHAT_STORY_SUCCESS:
      return {
        ...state,
        stories: {
          ...state.stories,
          [action.id]: {
            ...action.result
          }
        }
      };
    case LOAD_CHAT_STORY_FAIL:
      return {
        ...state,
        stories: {
          ...state.stories,
          [action.id]: {
            ...state.stories[action.id],
            error: action.error
          }
        }
      };
    case LOAD_CHAT_FILE_SUCCESS:
    case LOAD_FILE_SUCCESS: {
      const normalized = normalize(action.result, {
        bookmarks: arrayOf(bookmark),
      });

      let newStories = state.stories;
      if (action.result.story) {
        newStories = {
          ...state.stories,
          [action.result.story.permId]: {
            ...action.result.story
          }
        };
      }

      const newState = merge({}, state, {
        ...normalized.entities,
        files: {
          ...state.files,
          [action.id]: {
            ...normalized.result,
          }
        },
        stories: newStories
      });

      return newState;
    }

    case UPDATE_FILE:
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            ...action.update
          }
        }
      };

    case LOAD_CHAT_FILE_FAIL:
    case LOAD_FILE_FAIL:
      return {
        ...state,
        files: {
          ...state.files,
          [action.id]: {
            ...state.files[action.id],
            error: action.error
          }
        }
      };

    case LOAD_HTML:
      return {
        ...state,
        files: { ...state.files,
          [action.id]: {
            ...state.files[action.id],
            loading: true,
            error: null
          }
        }
      };
    case LOAD_HTML_SUCCESS:
      return {
        ...state,
        files: { ...state.files,
          [action.id]: {
            ...state.files[action.id],
            ...action.result,
            loading: false
          }
        }
      };
    case LOAD_HTML_FAIL:
      if (!action || !action.id) {
        return state;
      }

      return {
        ...state,
        files: { ...state.files,
          [action.id]: {
            ...state.files[action.id],
            error: action.error,
            loading: false
          }
        }
      };
    /** Notes */
    case LOAD_NOTES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(note));
      return merge({}, state, {
        ...normalized.entities
      });
    }
    case LOAD_NOTE_SUCCESS:
    case ADD_NOTE_SUCCESS: {
      const normalized = normalize(action.result, note);
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.id || action.result.id]: {
            ...normalized.entities.notes[action.id || action.result.id],
          }
        }
      };
    }
    case DELETE_NOTES: {
      const ids = action.ids;
      const newNotes = { ...state.notes };

      Array.from(ids).forEach(id => {
        newNotes[id] = {
          ...newNotes[id],
          status: 'deleted'
        };
      });

      return {
        ...state,
        notes: newNotes
      };
    }

    /*Story File Tag Update */
    case ADD_TAGS_TO_FILE: {
      const fileId = action.params.fileId;
      return {
        ...state,
        files: { ...state.files,
          [fileId]: {
            ...state.files[fileId],
            tags: [
              ...state.files[fileId].tags,
              { id: action.params.tagId, name: action.params.tagName }
            ]
          }
        }
      };
    }
    case REMOVE_TAGS_FROM_FILE: {
      const fileId = action.params.fileId;
      return {
        ...state,
        files: { ...state.files,
          [fileId]: {
            ...state.files[fileId],
            tags: [
              ...state.files[fileId].tags.filter(item => item.id !== action.params.tagId)
            ]
          }
        }
      };
    }
    case GET_FILE_TAGS_SUCCESS: {
      const fileId = action.params.fileId;
      return {
        ...state,
        files: { ...state.files,
          [fileId]: {
            ...state.files[fileId],
            tags: action.result
          }
        }
      };
    }
    default:
      return state;
  }
}

/**
 * Updates a number of attributes on an entity
 * @param  {string} name  valid entity name: bookmarks, stories, files etc.,
 * @param  {number} id    entity id
 * @param  {object} attrs key/value pairs to update
 */
export function updateEntity(name, id, attrs = {}) {
  return {
    type: UPDATE_ENTITY,
    name,
    id,
    attrs
  };
}

/**
 * Toggles true/false on entity attribute
 * @param  {string} name     valid entity name: bookmarks, stories, files etc.,
 * @param  {number} id       entity id
 * @param  {string} attrName name of attribute to toggle
 */
export function toggleEntityAttribute(name, id, attrName) {
  return {
    type: TOGGLE_ENTITY_ATTRIBUTE,
    name,
    id,
    attrName
  };
}

/**
 * Sets 'deleted' to true, shortcut for updateEntity
 * @param  {string} name valid entity name: bookmarks, stories, files etc.,
 * @param  {number} id   entity id
 *
 * Apply filter in mapStateToProps
 * e.g. arr.filter(e => !e.deleted);
 */
export function deleteEntity(name, id) {
  return {
    type: DELETE_ENTITY,
    name,
    id
  };
}
