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

import uniqueId from 'lodash/uniqueId';
import { normalize, Schema, arrayOf } from 'normalizr';
import { REHYDRATE } from 'redux-persist/constants';

const block = new Schema('blocks');
const slide = new Schema('slides');
slide.define({
  blocks: arrayOf(block)
});

const section = new Schema('sections');
section.define({
  slides: arrayOf(slide)
});

/**
 * Action Types
 */
export const ADD_SECTION = 'canvas/ADD_SECTION';
export const EDIT_SECTION = 'canvas/EDIT_SECTION';
export const EDIT_SECTION_ORDER = 'canvas/EDIT_SECTION_ORDER';

export const ADD_SLIDES = 'canvas/ADD_SLIDES';
export const EDIT_SLIDE = 'canvas/EDIT_SLIDE';
export const DELETE_SLIDE = 'canvas/DELETE_SLIDE';

export const CLEAR = 'canvas/CLEAR';
export const SET_NEW_INDICATOR = 'canvas/SET_NEW_INDICATOR';

export const GET_TEMPLATES = 'canvas/GET_TEMPLATES';
export const GET_TEMPLATES_SUCCESS = 'canvas/GET_TEMPLATES_SUCCESS';
export const GET_TEMPLATES_FAIL = 'canvas/GET_TEMPLATES_FAIL';

export const SAVE_ACTIVITY = 'canvas/SAVE_ACTIVITY';
export const SAVE_ACTIVITY_SUCCESS = 'canvas/SAVE_ACTIVITY_SUCCESS';
export const SAVE_ACTIVITY_FAIL = 'canvas/SAVE_ACTIVITY_FAIL';

export const GENERATE_THUMBNAILS = 'canvas/GENERATE_THUMBNAILS';
export const GENERATE_THUMBNAILS_SUCCESS = 'canvas/GENERATE_THUMBNAILS_SUCCESS';
export const GENERATE_THUMBNAILS_FAIL = 'canvas/GENERATE_THUMBNAILS_FAIL';

export const GET_BLOCKS = 'canvas/GET_BLOCKS';
export const GET_BLOCKS_SUCCESS = 'canvas/GET_BLOCKS_SUCCESS';
export const GET_BLOCKS_FAIL = 'canvas/GET_BLOCKS_FAIL';

export const GET_THUMBNAILS = 'canvas/GET_THUMBNAILS';
export const GET_THUMBNAILS_SUCCESS = 'canvas/GET_THUMBNAILS_SUCCESS';
export const GET_THUMBNAILS_FAIL = 'canvas/GET_THUMBNAILS_FAIL';

/**
 * Initial State
 */
export const initialState = {
  order: [],
  templates: [],
  sectionsById: {},
  slidesById: {},
  blocksById: {},
  queuedThumbnails: {},
  newIndicator: false,
};

/**
 * Reducer
 */
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.canvas;
      if (incoming) {
        return {
          ...state,
          ...incoming
        };
      }
      return state;
    }

    case ADD_SECTION: {
      // Generate section ID if not set
      const newSection = action.props;
      if (!newSection.id) {
        newSection.id = uniqueId('section-');
      }

      // Normalize slides if section has them
      let slidesById = state.slidesById;
      let blocksById = state.blocksById;
      if (newSection.slides) {
        const normalizedSlides = normalize(newSection.slides, arrayOf(slide));
        newSection.slides = normalizedSlides.result;
        slidesById = {
          ...slidesById,
          ...normalizedSlides.entities.slides
        };
        blocksById = {
          ...blocksById,
          ...normalizedSlides.entities.blocks
        };
      }

      return {
        ...state,
        order: state.order.concat(action.props.id),
        sectionsById: {
          ...state.sectionsById,
          [action.props.id]: newSection
        },
        slidesById: slidesById,
        blocksById: blocksById,
      };
    }
    case EDIT_SECTION:
      return {
        ...state,
        sectionsById: {
          ...state.sectionsById,
          [action.id]: {
            ...state.sectionsById[action.id],
            ...action.props
          }
        }
      };
    case EDIT_SECTION_ORDER: {
      const listSectionsById = { ...state.sectionsById };
      const orderList = action.sectionOrder ? [...action.sectionOrder] : state.order;

      // Re-order sections by id
      orderList.reduce((obj, currentValue) => {
        return ((obj[currentValue] = listSectionsById[currentValue]), obj);// eslint-disable-line
      }, {});

      return {
        ...state,
        order: orderList,
        sectionsById: listSectionsById
      };
    }
    case ADD_SLIDES: {
      // Add IDs to slides in case none are set
      // In normalizr 3 we can use processStrategy
      const fixedSlides = action.slides.map(s => {
        // Using slide id so we can remove duplicated slide on same section
        const newId = s.fullPage ? `slide-${s.blocks[0].id}` : uniqueId('slide-');
        return {
          ...s,
          deleted: false,
          id: s.id || newId
        };
      });

      // normalize slides
      const normalizedSlides = normalize(fixedSlides, arrayOf(slide));
      const order = [...state.order];

      // Check if section exists by id or name
      let modifiedSection;
      if (action.sectionId) {
        modifiedSection = state.sectionsById[action.sectionId];
      } else if (action.sectionName) {
        const sectionId = Object.keys(state.sectionsById).find(id => state.sectionsById[id].name === action.sectionName);
        if (sectionId) {
          modifiedSection = state.sectionsById[sectionId];
        }
      }

      if (modifiedSection) {
        modifiedSection.deleted = false;
      }

      // create new section if it doesn't exist
      if (!modifiedSection) {
        const newSectionId = action.sectionId || uniqueId('section-');
        const newSectionName = action.sectionName || '';

        order.push(newSectionId);
        modifiedSection = {
          id: newSectionId,
          name: newSectionName,
          slides: []
        };
      }

      // Merge in new slides at specified index
      // default to end in not specified
      const slideIndex = action.slideIndex || modifiedSection.slides.length;
      const mergedSlides = modifiedSection.slides.slice();
      mergedSlides.splice(slideIndex, 0, ...normalizedSlides.result);

      return {
        ...state,
        order: order,
        sectionsById: {
          ...state.sectionsById,
          [modifiedSection.id]: {
            ...modifiedSection,
            slides: [
              ...new Set([...mergedSlides])
            ]
          }
        },
        slidesById: {
          ...state.slidesById,
          ...normalizedSlides.entities.slides
        },
        blocksById: {
          ...state.blocksById,
          ...normalizedSlides.entities.blocks
        },
      };
    }
    case EDIT_SLIDE:
      return {
        ...state,
        slidesById: {
          ...state.slidesById,
          [action.id]: {
            ...state.slidesById[action.id],
            ...action.props
          }
        }
      };
    case DELETE_SLIDE: {
      // Delete all blocks associated with slide
      const blocks = state.slidesById[action.id].blocks;
      const newBlocksById = {
        ...state.blocksById
      };
      blocks.forEach(blockId => {
        newBlocksById[blockId] = {
          ...newBlocksById[blockId],
          deleted: true
        };
      });

      return {
        ...state,
        slidesById: {
          ...state.slidesById,
          [action.id]: {
            ...state.slidesById[action.id],
            deleted: true
          }
        },
        blocksById: newBlocksById
      };
    }
    case GET_TEMPLATES_SUCCESS:
      return {
        ...state,
        templates: action.result
      };
    case GENERATE_THUMBNAILS_SUCCESS: {
      let locations = action.locations;
      if (state.queuedThumbnails[action.fileId] && state.queuedThumbnails[action.fileId].length) {
        locations = state.queuedThumbnails[action.fileId].concat(',' + locations);
      }

      return {
        ...state,
        queuedThumbnails: {
          ...state.queuedThumbnails,
          [action.fileId]: locations
        }
      };
    }
    case GET_THUMBNAILS_SUCCESS: {
      if (!action.result || !action.result.length) {
        return state;
      }

      let newBlocks = {
        ...state.blocksById
      };
      let newQeueue = {
        ...state.queuedThumbnails
      };
      action.result.forEach(item => {
        newBlocks = {
          ...newBlocks,
          [item.id]: {
            ...newBlocks[item.id],
            thumbnail: item.thumbnailUrl
          }
        };

        // Remove extra commas and location from queue
        if (newQeueue[action.fileId]) {
          const fileQueue = newQeueue[action.fileId].split(',').filter(e => e).join(',').split(',')
            .filter(e => e !== item.location)
            .join(',');

          newQeueue = {
            ...newQeueue,
            [action.fileId]: fileQueue
          };
        }
      });

      return {
        ...state,
        blocksById: newBlocks,
        queuedThumbnails: newQeueue,
      };
    }
    case SET_NEW_INDICATOR:
      return {
        ...state,
        newIndicator: action.value
      };
    case CLEAR:
      return {
        ...initialState
      };
    default:
      return state;
  }
}

/**
 * Action Creators
 */
export function addSection(props) {
  return {
    type: ADD_SECTION,
    props
  };
}

export function editSection(id, props) {
  return {
    type: EDIT_SECTION,
    id,
    props
  };
}

export function editSectionOrder(sectionOrder = false) {
  return {
    type: EDIT_SECTION_ORDER,
    sectionOrder
  };
}

export function addSlides(slides, slideIndex = 0, sectionId, sectionName) {
  return {
    type: ADD_SLIDES,
    slides,
    slideIndex,
    sectionId,
    sectionName,
  };
}

export function editSlide(id, props) {
  return {
    type: EDIT_SLIDE,
    id,
    props
  };
}

export function deleteSlide(id) {
  return {
    type: DELETE_SLIDE,
    id
  };
}

/**
 * generateThumbnails
 * @param {number} fileId File ID
 * @param {string} locations Comma separated matched locations/blockIds
 */
export function generateThumbnails(fileId, blocks) {
  const locations = blocks.map(b => b.location).toString();

  return {
    types: [GENERATE_THUMBNAILS, GENERATE_THUMBNAILS_SUCCESS, GENERATE_THUMBNAILS_FAIL],
    fileId,
    blocks,
    locations,
    promise: (client) => client.post('/blocks/generateThumbnails', 'webapi', {
      params: {
        file_id: fileId,
        locations
      }
    })
  };
}

/**
 * getBlocks
 * @param {number} fileId File ID
 * @param {string} filename File name
 */
export function getBlocks(fileId, filename) {
  return {
    types: [GET_BLOCKS, GET_BLOCKS_SUCCESS, GET_BLOCKS_FAIL],
    fileId,
    filename,
    promise: (client) => client.get('/blocks/get', 'webapi', {
      params: {
        filename: filename,
      }
    })
  };
}

/**
 * getThumbnails
 * @param {number} fileId File ID
 * @param {string} locations Comma separated matched locations/blockIds
 */
export function getThumbnails(fileId, locations) {
  return {
    types: [GET_THUMBNAILS, GET_THUMBNAILS_SUCCESS, GET_THUMBNAILS_FAIL],
    fileId,
    locations,
    promise: (client) => client.get('/blocks/getThumbnails', 'webapi', {
      params: {
        file_id: fileId,
        locations
      }
    })
  };
}

export function getTemplates() {
  return {
    types: [GET_TEMPLATES, GET_TEMPLATES_SUCCESS, GET_TEMPLATES_FAIL],
    promise: (client) => client.get('/blocks/getMasterTemplates', 'webapi')
  };
}

export function saveActivity(data) {
  return {
    types: [SAVE_ACTIVITY, SAVE_ACTIVITY_SUCCESS, SAVE_ACTIVITY_FAIL],
    promise: (client) => client.post('/blocks/activity/save', 'webapi', {
      body: data
    })
  };
}

export function setNewIndicator(value) {
  return {
    type: SET_NEW_INDICATOR,
    value: value
  };
}

export function clear() {
  return {
    type: CLEAR,
  };
}
