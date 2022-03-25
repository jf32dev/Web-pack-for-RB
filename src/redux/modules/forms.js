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

/**
 * Normalize results
 * https://github.com/gaearon/normalizr
 */
import { normalize, Schema, arrayOf } from 'normalizr';
import merge from 'lodash/merge';
import union from 'lodash/union';

// Define schemes for our entities
const category = new Schema('categories');
const form = new Schema('forms');

// Define nesting rules
category.define({
  forms: arrayOf(form)
});

/* Action Types */
export const LOAD_CATEGORIES = 'forms/LOAD_CATEGORIES';
export const LOAD_CATEGORIES_SUCCESS = 'forms/LOAD_CATEGORIES_SUCCESS';
export const LOAD_CATEGORIES_FAIL = 'forms/LOAD_CATEGORIES_FAIL';

export const LOAD_FORMS = 'forms/LOAD_FORMS';
export const LOAD_FORMS_SUCCESS = 'forms/LOAD_FORMS_SUCCESS';
export const LOAD_FORMS_FAIL = 'forms/LOAD_FORMS_FAIL';

const globalFetchLimit = 100;

export const initialState = {
  categoriesById: {},
  formsById: {},

  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  categoriesComplete: false
};

export default function forms(state = initialState, action = {}) {
  switch (action.type) {
    /* Categories */
    case LOAD_CATEGORIES:
      return {
        ...state,
        categoriesLoading: true
      };
    case LOAD_CATEGORIES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(category));
      const newState = merge({}, state, {
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
        categoriesLoading: false,
        categoriesError: action.error
      };

    /* Forms */
    case LOAD_FORMS:
      return {
        ...state,
        categoriesById: { ...state.categoriesById,
          [action.catId]: {
            ...state.categoriesById[action.catId],
            formsLoading: true
          }
        }
      };
    case LOAD_FORMS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(form));
      const newState = merge({}, state, {
        formsById: normalized.entities.forms,
        categoriesById: { ...state.categoriesById,
          [action.catId]: {
            ...state.categoriesById[action.catId],
            forms: union(state.categoriesById[action.catId].forms, normalized.result),
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
        categoriesById: { ...state.categoriesById,
          [action.catId]: {
            ...state.categoriesById[action.catId],
            formsLoading: false,
            formsError: action.error
          }
        }
      };
    default:
      return state;
  }
}

/* Action Creators */
export function loadCategories(offset = 0) {
  return {
    types: [LOAD_CATEGORIES, LOAD_CATEGORIES_SUCCESS, LOAD_CATEGORIES_FAIL],
    promise: (client) => client.get('/forms', 'webapi', {
      params: {
        type: 'categories',
        limit: globalFetchLimit,
        offset: offset
      }
    })
  };
}

export function loadForms(catId, offset = 0) {
  return {
    types: [LOAD_FORMS, LOAD_FORMS_SUCCESS, LOAD_FORMS_FAIL],
    catId: catId,
    promise: (client) => client.get('/forms', 'webapi', {
      params: {
        type: 'forms',
        cat_id: catId,
        limit: globalFetchLimit,
        offset: offset
      }
    })
  };
}
