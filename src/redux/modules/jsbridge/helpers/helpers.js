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

import parseBookmark from './parseBookmark';
import parseChannel from './parseChannel';
import parseComment from './parseComment';
import parseEvent from './parseEvent';
import parseFile from './parseFile';
import parseInterestArea from './parseInterestArea';
import parseNote from './parseNote';
import parseStory from './parseStory';
import parseTab from './parseTab';
import parseUser from './parseUser';
import parseLink from './parseLink';
import parseStoryForJSBridge from './parseStoryForJSBridge';

export const globalFetchLimit = 10;  // TODO: set to 100

const SHARE_STATUS = {
  blocked: 0,
  optional: 1,
  mandatory: 2,
};

export function validateParams(params, types, sortByAttrs) {
  const invalid = [];

  Object.keys(params).forEach(key => {
    // Validate key types in case of array
    if ((key === 'includeAttributes' || types[key] === '[object Array]') && Object.prototype.toString.call(params[key]) !== types[key]) {  // eslint-disable-line
      invalid.push(key);

      // Validate key types
    } else if (key !== 'includeAttributes' && types[key] !== '[object Array]' && typeof params[key] !== types[key]) {  // eslint-disable-line
      invalid.push(key);

      // Validate sortBy attribute
    } else if (key === 'sortBy' && sortByAttrs.length && sortByAttrs.indexOf(params[key]) === -1) {
      invalid.push(key);
    }
  });

  return invalid;
}

export function validateParamsWithOutTypes(params, types) {
  const invalid = [];

  Object.keys(params).forEach(key => {
    // Validate key
    if (types.indexOf(key) === -1) {
      invalid.push(key);
    }
  });

  return invalid;
}

export function parseSearchResult(result) {
  if (!result || typeof result === 'string') {
    return null;
  }

  const bridgeData = {
    comments: [],
    feeds: [],
    files: [],
    events: [],
    users: [],
    stories: [],
    notes: []
  };

  // Comments
  if (result.comments) {
    result.comments.results.forEach(r => {
      bridgeData.comments.push(parseComment(r));
    });
  }

  // Feeds
  if (result.feeds) {
    result.feeds.results.forEach(r => {
      bridgeData.feeds.push(parseStory(r));
    });
  }

  // Files
  if (result.files) {
    result.files.results.forEach(r => {
      bridgeData.files.push(parseFile(r));
    });
  }

  // Events (meetings)
  if (result.meetings) {
    result.meetings.results.forEach(r => {
      bridgeData.events.push(parseEvent(r));
    });
  }

  // Users (people)
  if (result.people) {
    result.people.results.forEach(r => {
      bridgeData.users.push(parseUser(r));
    });
  }

  // Stories
  if (result.stories) {
    result.stories.results.forEach(r => {
      bridgeData.stories.push(parseStory(r));
    });
  }

  // Notes
  if (result.notes) {
    result.notes.results.forEach(r => {
      bridgeData.notes.push(parseNote(r));
    });
  }

  return bridgeData;
}

// getEntity call always returns a fullRecord
export function parseEntity(entity, fullRecord) {
  let obj = null;
  switch (entity.type) {
    case 'tab':
      obj = parseTab(entity, fullRecord);
      break;
    case 'channel':
      obj = parseChannel(entity, fullRecord);
      break;
    case 'story':
      obj = parseStory(entity, fullRecord);
      break;
    case 'file':
      obj = parseFile(entity, fullRecord);
      break;
    case 'people':
    case 'user':
      obj = parseUser(entity, fullRecord);
      break;
    case 'bookmark':
      obj = parseBookmark(entity, fullRecord);
      break;
    case 'interestArea':
      obj = parseInterestArea(entity, fullRecord);
      break;
    case 'web':
      obj = parseLink(entity);
      break;
    default:
      obj = entity;
      break;
  }
  return obj;
}

// getList 'files' uses the /story/get API
// some extra handling is required
export function parseFilesGetListResult(files, story, fullRecord) {
  if (!files) {
    return null;
  }

  const bridgeData = [];
  files.forEach(f => {
    const obj = parseFile({ ...f, story: story }, fullRecord);
    if (obj) {
      bridgeData.push(obj);
    }
  });

  return bridgeData;
}


export function parseGetFeaturedList(params, result) {
  if (!result) {
    return null;
  }
  const bridgeData = [];
  result.forEach(item => {
    let obj = null;
    if (params.entityName === 'story') {
      obj = parseStoryForJSBridge(item);
    } else {
      obj = parseEntity(item);
    }
    if (obj) {
      bridgeData.push(obj);
    }
  });

  return bridgeData;
}

export default function parseResult(action, params, result, fullRecord) {
  if (!result) {
    return null;
  }

  const bridgeData = [];
  result.forEach(r => {
    const obj = parseEntity(r, fullRecord);
    if (obj) {
      bridgeData.push(obj);
    }
  });

  // Apply sortBy to bookmark itens
  // Server API sorts by bookmark time
  if (action === 'getBookmarkList' && params.entityName === 'story' && params.sortBy === 'createDate') {
    bridgeData.sort((a, b) => b.createDate - a.createDate);
  }

  return bridgeData;
}

function getFileCategory(f) {
  // Use file extension as a backup for type
  const ext = f.filename.split('.').pop();

  let category = 'none';

  // Determine file category by mimetype
  // https://bigtincan.atlassian.net/wiki/display/TES/Supported+File+Types
  switch (true) {
    // app
    case (ext === 'btca'):
      category = 'app';
      break;

    // audio
    case (f.mimeType.indexOf('audio') > -1):
      category = 'audio';
      break;

    // btc
    case (ext === 'btc'):
    case (ext === 'btcd'):
    case (ext === 'btcp'):
      category = 'btc';
      break;

    // cad
    case (ext === 'cad'):
    case (ext === 'dwg'):
    case (ext === 'dxf'):
      category = 'cad';
      break;

    // earthviewer
    case (ext === 'kml'):
    case (ext === 'kmz'):
      category = 'earthviewer';
      break;

    // ebook
    case (ext === 'mobi'):
      category = 'ebook';
      break;

    // epub
    case (ext === 'epub'):
      category = 'epub';
      break;

    // excel
    case (ext.indexOf('xls') > -1):
    case (ext.indexOf('xlsx') > -1):
    case (f.mimeType.indexOf('sheet') > -1):
    case (f.mimeType.indexOf('ms-excel') > -1):
      category = 'excel';
      break;

    // form - btcf
    case (ext === 'btcf'):
      category = 'form';
      break;

    // ibook
    case (ext === 'ibook'):
      category = 'ibook';
      break;

    // image
    case (f.mimeType.indexOf('image') > -1):
      category = 'image';
      break;

    // ipa (no longer supported)
    case (ext === 'ipa'):
      category = 'ipa';
      break;

    // keynote
    case (ext === 'key'):
      category = 'keynote';
      break;

    // numbers
    case (ext === 'numbers'):
      category = 'numbers';
      break;

    // oomph
    case (ext === 'oomph'):
      category = 'oomph';
      break;

    // pages
    case (ext === 'pages'):
      category = 'pages';
      break;

    // pdf
    case (f.mimeType.indexOf('pdf') > -1):
      category = 'pdf';
      break;

    // powerpoint
    case (f.mimeType.indexOf('ms-powerpoint') > -1):
    case (f.mimeType.indexOf('presentation') > -1):
      category = 'powerpoint';
      break;

    // project
    case (ext === 'mpp'):
      category = 'project';
      break;

    // prov
    case (ext === 'prov'):
      category = 'prov';
      break;

    // rtf
    case (f.mimeType.indexOf('application/rtf') > -1 || f.mimeType.indexOf('text/rtf') > -1):
      category = 'rtf';
      break;

    // rtfd
    case (ext === 'rtfd'):
      category = 'rtfd';
      break;

    // scrollmotion
    case (ext === 'scrollmotion'):
      category = 'scrollmotion';
      break;

    // twixl
    case (ext === 'twixl'):
      category = 'twixl';
      break;

    // txt
    case (ext === 'txt'):
    case (f.mimeType.indexOf('text/plain') > -1):
      category = 'txt';
      break;

    case (ext === 'usdz'):
      category = '3d-model';
      break;

    // vcard
    case (ext === 'vcf'):
      category = 'vcard';
      break;

    // video
    case (f.mimeType.indexOf('video') > -1):
      category = 'video';
      break;

    // visio
    case (ext === 'vdw'):
    case (ext === 'vdx'):
    case (ext === 'vsd'):
    case (ext === 'vsdx'):
    case (ext === 'vss'):
    case (ext === 'vst'):
    case (ext === 'vsx'):
    case (ext === 'vt'):
      category = 'visio';
      break;

    // web
    case (f.mimeType.indexOf('text/html') > -1):
    case (ext === 'json'):
      category = 'web';
      break;

    // word
    case (ext === 'doc'):
    case (ext === 'docx'):
    case (f.mimeType.indexOf('document') > -1):
    case (f.mimeType.indexOf('msword') > -1):
      category = 'word';
      break;

    // zip
    case (f.mimeType.indexOf('rar') > -1):
    case (f.mimeType.indexOf('7z') > -1):
    case (f.mimeType.indexOf('zip') > -1):
    case (ext.indexOf('tar') > -1):
      category = 'zip';
      break;

    // none
    default:
      console.info('category not determined for: ', f.mimeType, ext);  // eslint-disable-line
      break;
  }

  return category;
}

export function parseFileSearchResult(response) {
  return (response || []).map((item) => {
    const { id, filename, description, tags, coverArt, shareStatus, downloadUrl, story } = item;
    return {
      id,
      filename,
      description,
      tags,
      downloadURL: downloadUrl,
      sharingType: SHARE_STATUS[shareStatus],
      category: getFileCategory(item),
      thumbnail: coverArt ? coverArt.url : null,
      story: {
        id: story.permId,
        revisionId: story.id,
      },
      type: 'file'
    };
  });
}

export function parseStorySearchResult(response) {
  return (response || []).map((item) => {
    const { permId, title, excerpt, author, tags, coverArt, createdAt, quickFile, quickLink, quickLinkFallback, files, channel } = item;
    const createDate = (new Date(createdAt).getTime() / 1000);
    return {
      id: permId,
      title,
      channel,
      excerpt,
      author,
      tags,
      fileCount: files.length,
      thumbnail: coverArt ? coverArt.url : null,
      quickFileId: quickFile ? files[0].id : null,
      quickLink: quickLink || quickLinkFallback,
      createDate,
      type: 'story',
    };
  });
}

export function readFileContent(path) {
  const httpRequest = new XMLHttpRequest();
  return new Promise((resolve) => {
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        resolve(httpRequest.responseText);
      }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
  });
}

export function parseGetListResult(result, fullRecord, includedAttributes) {
  if (!result) {
    return null;
  }

  const bridgeData = [];
  result.forEach(item => {
    switch (item.type) {
      case 'story': {
        const obj = parseStoryForJSBridge(item, fullRecord, includedAttributes);
        if (obj) {
          bridgeData.push(obj);
        }
        break;
      }
      default:
        bridgeData.push(item);
        break;
    }
  });

  return bridgeData;
}

export function parseEventsResult(result, fullRecord) {
  if (!result) return null;

  const eventsArr = result.map(ev => parseEvent(ev, fullRecord));

  return eventsArr;
}

export function validateIncludedAttributes(attributes, validIncludeAttributes) {
  const invalid = [];
  // Check for invalid includeAttributes
  attributes.forEach(item => {
    if (validIncludeAttributes.indexOf(item) === -1) {
      invalid.push(item);
    }
  });

  return invalid;
}

export function validateEvents(params, paramTypes) {
  // eslint-disable-next-line valid-typeof
  const invalid = Object.keys(params).filter(key => typeof params[key] !== paramTypes[key]);
  if (params.fromDate > params.toDate) {
    invalid.push('toDate');
  } else if (params.fromDate < 0 || params.fromDate === params.toDate) {
    invalid.push('fromDate');
  }
  return invalid;
}

export function validateMandatoryParamsNotEmpty(params, mandatoryTypes) {
  const empty = [];

  Object.keys(mandatoryTypes).forEach(key => {
    const paramType = Object.prototype.toString.call(params[key]);

    if (typeof params[key] === 'undefined') {
      empty.push(key);
    } else {
      // validate if param is emptied
      switch (paramType) {
        case '[object Array]':
          if (!params[key].length) empty.push(empty.push(key));
          break;
        case '[object Number]':
          if (params[key] === 0) empty.push(empty.push(key));
          break;
        case '[object String]':
          if (!params[key].trim()) empty.push(empty.push(key));
          break;
        default:
          break;
      }
    }
  });

  return empty;
}

export function validateEmailsInArray(list) {
  const invalid = [];
  // Check for invalid emails
  if (list && list.length) {
    list.forEach(item => {
      if (!/\S+@\S+\.\S+/.test(item)) {
        invalid.push(item);
      }
    });
  }

  return invalid;
}

function validateStoryEvent (evt, index) {
  const generateErrorResp = (code, name) => ({ code, message: `${code === 101 ? 'Missing' : 'Invalid'} Parameter: events[${index}].${name} ` });

  if (evt.startDate === undefined) return generateErrorResp(101, 'startDate');
  if (/\D/.test(evt.startDate)) return generateErrorResp(102, 'startDate');
  if (!evt.endDate) return generateErrorResp(101, 'endDate');
  if (/\D/.test(evt.startDate)) return generateErrorResp(102, 'endDate');
  if (evt.name === undefined) return generateErrorResp(101, 'title');
  if (evt.timezone === undefined) return generateErrorResp(101, 'timezone');
  if (evt.timezone === '' || !moment.tz.zone(evt.timezone)) return generateErrorResp(102, 'timezone');
  if (evt.startDate > evt.endDate) return { code: 102, message: `Events[${index}] endDate should be greater then events[${index}] startDate` };
  return null;
}

export function validateStoryEventInArray(list) {
  let result = null;

  if (!list) return null;

  for (let index = 0; index < list.length; index += 1) {
    const element = list[index];
    result = validateStoryEvent(element, index);
    if (result) {
      break;
    }
  }

  return result;
}


function validateStoryTagsInArray(list) {
  // list has to be an array && every tag has to be a string
  return list.some && !list.some(ele => typeof ele !== 'string');
}

const storyFileTypes = {
  id: 'number',
  description: 'string',
  sourceFileId: 'number',
  sharingType: 'number',
  tags: 'object',
  tempURL: 'string'
};


function validateStoryFile(file, index) {
  // fileId, sourceId, tempURL MUST have ONLY one
  if ((!file.id + !file.sourceFileId + !file.tempURL) !== 2) return { code: '103', message: `files[${index}]: only one of the three [file Id, sourceId and tempURL] could be provided` };

  // check file type
  const invalidKeys = validateParams(file, storyFileTypes);
  if (invalidKeys.length > 0) {
    return { code: '102', message: `Invalid Parameter: ${invalidKeys[0]}: ${file[invalidKeys[0]]} in files[${index}]` };
  }
  // invalid tempURL
  if (file.tempURL) {
    const invalidTempURL = { code: '102', message: `Invalid Parameter: tempURL ${file.tempURL} in files[${index}]` };
    if (typeof file.tempURL !== 'string') return invalidTempURL;
    if (!file.tempURL.split(',')[0]) return invalidTempURL;
    const fileName = file.tempURL.split(',')[0].split(':')[1];
    const blobURL = file.tempURL.split(',')[1];
    if (!fileName || !blobURL) {
      return invalidTempURL;
    }
  }

  // invalid sourceFileId
  if (file.sourceFileId && /\D/.test(file.sourceFileId)) return { code: '102', message: `Invalid Parameter: sourceFileId ${file.sourceFileId} in files[${index}]` };

  // invalid sharingType
  if (file.sharingType !== undefined) {
    const validSharingTypeCodes = [0, 1, 2];
    if (!validSharingTypeCodes.includes(file.sharingType)) return { code: '102', message: `Invalid Parameter: sharingType ${file.sharingType} in files[${index}]` };
  }

  // invalid file tags
  if (file.tags && !validateStoryTagsInArray(file.tags)) return { code: '102', message: `Invalid Parameter: tags in files[${index}]` };

  // pass validation
  return null;
}

function getDuplicateIds(list) {
  const uniq = list
    .map((id) => {
      return {
        count: 1,
        id: id
      };
    })
    .reduce((a, b) => {
      //eslint-disable-next-line no-param-reassign
      a[b.id] = (a[b.id] || 0) + b.count;
      return a;
    }, {});

  const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);

  return duplicates;
}

export function validateStoryFilesInArray(list) {
  let result = null;

  // validation - duplicate file object
  // duplicate file object - multiple file objects with same file id
  const fileIds = list.map(item => item.id).filter(id => id);
  const duplicateFileIds = getDuplicateIds(fileIds);
  if (duplicateFileIds.length > 0) return { code: 103, message: `Duplicate file id: ${duplicateFileIds.join(',')}` };

  // duplicate file object - multiple file objects with same source file id
  const sourceFileIds = list.map(item => item.sourceFileId).filter(id => id);
  const duplicateSourceFileIds = getDuplicateIds(sourceFileIds);
  if (duplicateSourceFileIds.length > 0) return { code: 103, message: `Duplicate source file id: ${duplicateSourceFileIds.join(',')}` };

  // validation - file
  for (let index = 0; index < list.length; index += 1) {
    const element = list[index];
    result = validateStoryFile(element, index);
    if (result) {
      break;
    }
  }

  return result;
}
