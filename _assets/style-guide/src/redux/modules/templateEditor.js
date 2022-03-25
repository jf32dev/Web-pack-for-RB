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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import maxBy from 'lodash/maxBy';
import { normalize, Schema, arrayOf } from 'normalizr';
import uuid from 'uuid-random';

/**
 * Action Types
 */
export const OPEN_TEMPLATE = 'templateEditor/OPEN_TEMPLATE';
export const UPDATE_TEMPLATE = 'templateEditor/UPDATE_TEMPLATE';
export const CLEAR_TEMPLATE = 'templateEditor/CLEAR_TEMPLATE';

export const EDIT_NAME = 'templateEditor/EDIT_NAME';

export const ADD_MODULE = 'templateEditor/ADD_MODULE';
export const EDIT_MODULE = 'templateEditor/EDIT_MODULE';
export const DELETE_MODULE = 'templateEditor/DELETE_MODULE';

export const TOGGLE_MODULE_EDIT = 'templateEditor/TOGGLE_MODULE_EDIT';

/**
 * Normalized items with defaults
 */
const item = new Schema('item', { idAttribute: 'i' });

/**
 * Initial State
 */
export const initialState = {
  name: 'Untitled',
  items: [],
  itemsById: {}
};

/**
 * Reducer
 */
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_TEMPLATE:
    case OPEN_TEMPLATE: {
      // Handle empty data
      if (!action.data.items || !action.data.items.length) {
        return {
          ...initialState,
          name: action.data.name || state.name
        };
      }

      const normalized = normalize(action.data.items, arrayOf(item));
      return {
        name: action.data.name || state.name,
        items: normalized.result,
        itemsById: normalized.entities.item
      };
    }
    case CLEAR_TEMPLATE:
      return {
        ...initialState
      };

    case EDIT_NAME:
      return {
        ...state,
        name: action.name
      };
    case ADD_MODULE: {
      const type = action.moduleType;
      const items = state.items || [];
      const mappedItems = items.map(id => state.itemsById[id]);

      // Find last item as it appears on grid by x/y coord
      // ignore deleted items
      const validItems = mappedItems.filter(obj => !obj.deleted);
      const lastItem = maxBy(validItems, function(o) {
        return o.layout.x + (o.layout.y * 10);
      });

      const lastH = lastItem ? lastItem.layout.h : 0;
      const lastW = lastItem ? lastItem.layout.w : 0;
      const lastX = lastItem ? lastItem.layout.x : 0;
      const lastY = lastItem ? lastItem.layout.y : 0;
      const newX = (lastX + lastW >= 12) ? 0 : lastX + lastW;

      const newItem = {
        i: `${type}-${uuid()}`,
        title: '',
        layout: {
          x: newX,
          y: lastY + lastH,
          w: 12,
          h: 4,
          minW: 12,
          maxW: 12,
          minH: 2,
          maxH: 12
        },
        isResizable: false,
        isNew: true,
        edit: true,
        type: type,
        limit: 20,
        grid: type !== 'btca',
        view: 'grid',
        isNewDesign: true,
        source: '',
        list: [],
      };
      switch (type) {
        case 'btca':
          newItem.source = action.data.source;
          newItem.baseUrl = action.data.baseUrl;

          newItem.isResizable = true;
          newItem.layout.minW = 3;
          newItem.isNewDesign = false;
          break;
        case 'featured-list':
          newItem.layout.maxH = 2.975;
          newItem.layout.minH = 2.975;
          newItem.layout.h = 2.975;

          newItem.source = 'featured';
          break;
        case 'story-list':
          newItem.layout.maxH = 2.9;
          newItem.layout.minH = 2.9;
          newItem.layout.h = 2.9;
          break;
        case 'bookmark-list':
          newItem.layout.maxH = 3.1;
          newItem.layout.minH = 3.1;
          newItem.layout.h = 3.1;

          newItem.title = 'My Bookmarks';
          newItem.source = 'bookmark';
          break;
        case 'user-list':
          newItem.layout.maxH = (394 / 120);
          newItem.layout.minH = (394 / 120);
          newItem.layout.h = (394 / 120);
          break;
        case 'file-list':
          newItem.layout.maxH = 3.1;
          newItem.layout.minH = 3.1;
          newItem.layout.h = 3.1;
          break;
        default:
          break;
      }

      // Set all other items to edit: false
      const newItemsById = {};
      Object.keys(state.itemsById).forEach((id) => {
        newItemsById[id] = {
          ...state.itemsById[id],
          edit: id === action.id ? !state.itemsById[id].edit : false
        };
      });

      return {
        ...state,
        itemsById: {
          ...newItemsById,
          [newItem.i]: newItem
        },
        items: [...state.items, newItem.i]
      };
    }
    case EDIT_MODULE: {
      const storyItemHeight = {
        maxH: 2.9,
        minH: 2.9,
        h: 2.9
      };
      const storyCardHeight = {
        maxH: (434 / 120),
        minH: (434 / 120),
        h: (434 / 120)
      };
      const newLayoutHeight = action.data.view === 'card' ? storyCardHeight : storyItemHeight;
      if ((action.data.view === 'card' || action.data.view === 'grid') && action.id.includes('story')) {
        return {
          ...state,
          itemsById: {
            ...state.itemsById,
            [action.id]: {
              ...state.itemsById[action.id],
              ...action.data,
              layout: {
                ...state.itemsById[action.id].layout,
                ...newLayoutHeight
              }
            }
          }
        };
      }
      return {
        ...state,
        itemsById: {
          ...state.itemsById,
          [action.id]: {
            ...state.itemsById[action.id],
            ...action.data
          }
        }
      };
    }
    case DELETE_MODULE:
      return {
        ...state,
        itemsById: {
          ...state.itemsById,
          [action.id]: {
            ...state.itemsById[action.id],
            deleted: true
          }
        }
      };
    case TOGGLE_MODULE_EDIT: {
      // Set all other items to edit: false
      const newItemsById = {};
      Object.keys(state.itemsById).forEach((id) => {
        newItemsById[id] = {
          ...state.itemsById[id],
          edit: id === action.id ? !state.itemsById[id].edit : false
        };
      });
      return {
        ...state,
        itemsById: newItemsById
      };
    }
    default:
      return state;
  }
}

/**
 * Action Creators
 */
export function openTemplate(data) {
  return {
    type: OPEN_TEMPLATE,
    data
  };
}

export function updateTemplate(data) {
  return {
    type: UPDATE_TEMPLATE,
    data
  };
}

export function clearTemplate() {
  return {
    type: CLEAR_TEMPLATE
  };
}

export function editName(name) {
  return {
    type: EDIT_NAME,
    name
  };
}

export function addModule(moduleType, data) {
  return {
    type: ADD_MODULE,
    moduleType,
    data
  };
}

export function editModule(id, data) {
  return {
    type: EDIT_MODULE,
    id,
    data
  };
}

export function deleteModule(id) {
  return {
    type: DELETE_MODULE,
    id
  };
}

export function toggleModuleEdit(id) {
  return {
    type: TOGGLE_MODULE_EDIT,
    id
  };
}
