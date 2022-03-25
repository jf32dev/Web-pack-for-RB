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
import { stringify } from 'qs';
import { globalFetchLimit, validateParams, validateIncludedAttributes } from '../helpers/helpers';
import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR
} from '../actions';

/**
 * actionName: getList
 *
 * @param {String}  entityName          name of entity
 * @param {String}  parentEntityName    name of parent entity
 * @param {Number}  peid                parent entity id
 * @param {Number}  offset              offset for pagination purpose
 * @param {Number}  limit               limit of result number
 * @param {String}  sortBy              valid sort attribute
 * @param {Number}  createDateSince     unix timestamp
 * @param {Number}  createDateTo        unix timestamp
*/

const timeFormatRFC3339 = 'YYYY-MM-DDTHH:mm:ssZZ';

const validEntities = [
  'tab',
  'channel',
  'story',
  'file',
  'user',
  'link'
];

const paramTypes = {
  entityName: 'string',
  parentEntityName: 'string',
  peid: 'number',
  limit: 'number',
  offset: 'number',
  sortBy: 'string',
  createDateSince: 'number',
  createDateTo: 'number',
  includeAttributes: '[object Array]',
  showAlias: 'boolean'
};

const validSortBy = [
  'name',
  'date',
  'title',
  'description',
  'firstName',
  'lastName',
  'score',
  'channelCount',
  'storyCount',
  'createDate',
  'likesCount',
  'size',
  'authorFirstName',
  'authorLastName',
  'sequence',
  'type',
  'readCount'
];

const validIncludeAttributes = [
  'author',
  'channel',
  'comments',
  'enableAnnotation',
  'events',
  'files',
  'isSubscribed',
  'message',
  'notify',
  'quickFile',
  'readCount',
  'score',
  'sequence',
  'sharingType',
  'socialURL',
  'subscribers',
  'tags'
];

const getListParams = {
  limit: globalFetchLimit,
  offset: 0,
  sortBy: 'name'
};

// Validate parent entities
function validateParentEntityName(bridgeParams) {
  const validParents = {
    channel: ['tab'],
    story: ['channel', 'tab'],
    file: ['story']
  };

  if (bridgeParams.entityName && bridgeParams.parentEntityName &&
    !validParents[bridgeParams.entityName].includes(bridgeParams.parentEntityName)) {
    return false;
  }
  return true;
}

function validateSortOptions(bridgeParams) {
  const validSortByEntity = {
    tab: ['name', 'channelCount'],
    channel: ['name', 'storyCount'],
    story: ['date', 'createDate', 'title', 'likesCount', 'authorFirstName', 'authorLastName', 'sequence', 'score', 'likes', 'author_first_name', 'author_last_name', 'content_score', 'readCount'],
    file: ['description', 'createDate', 'size'],
    user: ['lastName', 'firstName', 'score'],
    link: ['name', 'type']
  };

  // Set first option as default is not valid option for entity is set
  if (bridgeParams.entityName &&
    !validSortByEntity[bridgeParams.entityName].includes(bridgeParams.sortBy)) {
    return validSortByEntity[bridgeParams.entityName][0];
  }
  return bridgeParams.sortBy;
}

export default function getList(data) {
  // js-bridge params with defaults
  const bridgeParams = {
    ...getListParams,
    ...data.data.params
  };

  // Validate Params
  const invalidParams = validateParams(bridgeParams, paramTypes, validSortBy, validIncludeAttributes);
  const validParent = validateParentEntityName(bridgeParams);

  // Validate IncludedAttributes
  let invalidIncludedAttributes = [];
  if (invalidParams.length === 0 && bridgeParams.includeAttributes && bridgeParams.includeAttributes.length > 0) {
    invalidIncludedAttributes = validateIncludedAttributes(bridgeParams.includeAttributes, validIncludeAttributes);
  }

  // Set default sortBy option if it is not valid for the entity
  bridgeParams.sortBy = validateSortOptions(bridgeParams);

  // Error if no entityName
  if (!bridgeParams.entityName) {
    console.warn('Missing Parameter: `entityName`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 101,
        message: 'Missing Parameter'
      }
    };

    // Invalid entityName
  } else if (validEntities.indexOf(bridgeParams.entityName) === -1) {
    console.warn('Invalid Parameter: `entityName`: ' + bridgeParams.entityName)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

    // Invalid parentEntityName
  } else if (!validParent) {
    console.warn('Invalid Parameter: `parentEntityName`: ' + bridgeParams.parentEntityName)  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

    // Invalid parameters
  } else if (invalidParams.length) {
    console.warn('Invalid Parameter: `' + invalidParams[0] + '`')  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: 'Invalid Parameter'
      }
    };

    // Invalid include attributes
  } else if (invalidIncludedAttributes.length) {
    console.warn('Invalid attributes');  // eslint-disable-line
    return {
      type: JSBRIDGE_ERROR,
      data: data,
      error: {
        code: 102,
        message: `Invalid attributes: ${invalidIncludedAttributes}`
      }
    };
  }

  // v5 API path
  let apiPath = '';

  // v5 API params
  const apiParams = {
    limit: bridgeParams.limit,
    offset: bridgeParams.offset
  };

  switch (bridgeParams.entityName) {
    case 'tab':
      // TODO: Handle required param error
      apiPath = '/content/tabs';
      apiParams.sort_by = bridgeParams.sortBy === ('channelCount' || 'channels' || 'channel') ? 'channel_count' : bridgeParams.sortBy;
      apiParams.include_channels = 1;
      apiParams.included_channels_limit = bridgeParams.limit;
      apiParams.includePersonal = 1; // Include the personal tab

      break;
    case 'channel':
      // TODO: Handle required param error
      apiPath = '/content/channels';
      apiParams.sort_by = bridgeParams.sortBy === ('storyCount' || 'stories' || 'story') ? 'story_count' : bridgeParams.sortBy;
      apiParams.show_hidden_channels = 1;
      apiParams.include_stories = 1;
      apiParams.included_stories_limit = bridgeParams.limit;

      // Parent data
      if (bridgeParams.peid && bridgeParams.parentEntityName === 'tab') {
        apiParams.tab_id = bridgeParams.peid;
      }
      break;
    case 'story': {
      let sortBy = bridgeParams.sortBy;
      switch (sortBy) {
        case 'score':
          sortBy = 'content_score';
          break;
        case 'likesCount':
          sortBy = 'likes';
          break;
        case 'createDate':
          sortBy = 'date';
          break;
        case 'authorFirstName':
          sortBy = 'author_first_name';
          break;
        case 'authorLastName':
          sortBy = 'author_last_name';
          break;
        case 'readCount':
          sortBy = 'mostread';
          break;
        default:
          break;
      }

      // TODO: Handle required param error
      apiPath = '/content/stories';
      apiParams.sort_by = sortBy;

      // Pass additional params if includeAttributes
      if (bridgeParams.includeAttributes && bridgeParams.includeAttributes.length > 0) {
        // Replace channel and score to channels and content_score
        const mapObj = {
          channel: 'channels',
          score: 'content_score'
        };
        apiParams.include = bridgeParams.includeAttributes.filter(item => item === 'channel' || item === 'files' || item === 'events' || 'score').join().replace(/channel|score/gi, matched => mapObj[matched]);
      }

      // Parent data
      if (bridgeParams.peid && bridgeParams.parentEntityName) {
        switch (bridgeParams.parentEntityName) {
          case 'channel':
            apiParams.channel_id = bridgeParams.peid;
            break;
          case 'tab':
            apiParams.tab_id = bridgeParams.peid;
            break;
          default:
            console.warn('Unsupported Parent Entity: ') + bridgeParams.parentEntityName;  // eslint-disable-line
            break;
        }
      }

      // set alias flag
      if (bridgeParams.showAlias !== undefined) {
        apiParams.exclude_alias_stories = !bridgeParams.showAlias;
      }

      // date filter - converts unix to RFC 3339
      if (bridgeParams.createDateSince || bridgeParams.createDateTo) {
        apiParams.created_at = [];
        if (bridgeParams.createDateSince) {
          apiParams.created_at.gte = moment(bridgeParams.createDateSince).format(timeFormatRFC3339);
        }
        if (bridgeParams.createDateTo) {
          apiParams.created_at.lte = moment(bridgeParams.createDateTo).format(timeFormatRFC3339);
        }
      }

      break;
    }
    case 'file':
      if (!bridgeParams.peid) {
        console.warn('Missing Parameter `peid`')  // eslint-disable-line
        return {
          type: JSBRIDGE_ERROR,
          data: data,
          error: {
            code: 101,
            message: 'Missing Parameter'
          }
        };
      }

      // For files, we retrieve a story and filter/sort the file results
      apiPath = '/story/get';
      apiParams.permId = bridgeParams.peid;
      delete apiParams.limit;
      delete apiParams.offset;
      break;
    case 'user': {
      let sortBy = bridgeParams.sortBy;
      switch (sortBy) {
        case 'score':
          sortBy = 'normalised_uscore';
          break;
        default:
          break;
      }

      apiPath = '/user/all';

      apiParams.sort_by = sortBy;
      apiParams.include_groups = 1;
      apiParams.include_followers = 1;
      apiParams.include_following = 1;
      apiParams.include_subscribed_stories = 1;
      break;
    }
    case 'link':
      apiPath = '/company/web';
      apiParams.sort_by = bridgeParams.sortBy ? bridgeParams.sortBy.toLowerCase() : bridgeParams.sortBy;
      break;
    default:
      console.warn('Unsupported Entity: ') + bridgeParams.entityName;  // eslint-disable-line
      return {
        type: JSBRIDGE_ERROR,
        data: data,
        error: {
          code: 102,
          message: 'Invalid Parameter'
        }
      };
  }

  return {
    types: [JSBRIDGE_REQUEST, JSBRIDGE_SUCCESS, JSBRIDGE_ERROR],
    data,
    promise: (client) => client.get(apiPath, 'webapi', {
      params: stringify(apiParams)
    })
  };
}
