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

import _get from 'lodash/get';
import _uniq from 'lodash/uniq';
import { initialState } from './entities';

export function mapFiles(order = [], entities = initialState) {
  return order.map(function(id) {
    // Map bookmark data if it exists
    let bookmarks = [];
    if (entities.files[id] && entities.files[id].bookmarks && entities.files[id].bookmarks.length) {
      bookmarks = entities.files[id].bookmarks.map(bid => entities.bookmarks[bid]);
    }
    return {
      ...entities.files[id],
      bookmarks: bookmarks
    };
  });
}

export function mapStories(order = [], entities = initialState) {
  return order.map(function(id) {
    // Map channel data if it exists
    let channels = [];
    if (entities.stories[id].channels && entities.stories[id].channels.length) {
      channels = entities.stories[id].channels.map(cid => entities.channels[cid]);
    }

    return {
      ...entities.stories[id],
      author: entities.users[entities.stories[id].author],
      channels: channels,
      files: entities.stories[id].files ? entities.stories[id].files.map(fid => entities.files[fid]) : []
    };
  });
}

export function mapUsers(order = [], entities = {}) {
  return order.map(function(id) {
    return entities.users[id];
  });
}

export function mapGroups(order = [], entities = {}) {
  const groups =  order.map(function(id) {
    return entities.groups[id];
  });
  return groups.filter((item) => item);
}

export function mapNotes(order = [], entities = initialState) {
  return order
    .filter(id => entities.notes[id].status !== 'deleted')
    .map(id => {
      const imageFiles = _get(entities.notes, `${id}.files`, []).length > 0 && entities.notes[id].files.filter(file => file.category === 'image');
      const indexFiles = _get(entities.notes, `${id}.files`, []).length > 0 && entities.notes[id].files.filter(file => file.identifier === entities.notes[id].indexFile);

      return {
        ...entities.notes[id],
        type: 'note',
        updated: entities.notes[id].updatedAt,
        story: entities.notes[id].story && entities.notes[id].story.length > 0 ? {
          title: entities.notes[id].story[0].name,
          thumbnail: entities.notes[id].story[0].thumbnail,
        } : {},
        showThumb: imageFiles && imageFiles.length > 0,
        thumbnail: imageFiles && imageFiles.length > 0 ? imageFiles[0].url : '',
        excerpt: _get(indexFiles, '0.content', '').replace(/(<([^>]+)>|&nbsp;)/ig, ''),
      };
    });
}

export function mapBookmarks(order = [], entities = initialState) {
  return order.map(function(id) {
    const setData = entities.bookmarks[id].setData;
    const mappedSetData = setData.map(function(obj) {
      if (obj.schema === 'story') {
        return mapStories([obj.id], entities)[0];
      }
      return mapFiles([obj.id], entities)[0];
    });

    return {
      ...entities.bookmarks[id],
      setData: mappedSetData
    };
  });
}

export function mapChannels(order = [], entities = initialState) {
  return order.map(function(id) {
    return {
      ...entities.channels[id],
      stories: {
        ...entities.users[entities.channels[id].stories]
      }
    };
  });
}

export function mapComments(order = [], entities = initialState, pendingComment) {
  const comments = order.map(function(id) {
    const mappedComment = {
      ...entities.comments[id],
      author: entities.users[entities.comments[id].author],
      replies: _uniq(entities.comments[id].replies).map(function(rid) {
        return {
          ...entities.comments[rid],
          author: entities.users[entities.comments[rid].author]
        };
      })
    };

    // Insert pendingComment reply
    if (pendingComment && pendingComment.parentId === id) {
      mappedComment.replies.push(pendingComment);
    }

    return mappedComment;
  });

  // Insert pendingComment
  if (pendingComment && !pendingComment.parentId) {
    comments.push(pendingComment);
  }

  return comments;
}

export function mapPraises(order = [], entities = {}, pendingPraise) {
  const praises = order.map(function(id) {
    return {
      ...entities.praises[id],
      praisedBy: entities.users[entities.praises[id].praisedBy]
    };
  });

  // Insert pendingPraise
  if (pendingPraise) {
    praises.unshift({
      ...pendingPraise,
      praisedBy: entities.users[pendingPraise.praisedBy]
    });
  }

  return praises;
}

export function mapChatMessages(order = [], entities = {}) {
  return order.map(function(id) {
    const messageById = entities.messages[id] || {};
    const mappedMessage = {
      ...entities.messages[id],
      user: entities.users[messageById.userId || messageById.user]
    };

    // Map attachments if data exists
    if (mappedMessage.type === 'hub-attachment') {
      // File attachment
      if (typeof mappedMessage.file === 'number' && entities.files[mappedMessage.file]) {
        mappedMessage.file = entities.files[mappedMessage.file];

      // Story attachment
      } else if (typeof mappedMessage.story === 'number' && entities.stories[mappedMessage.story]) {
        mappedMessage.story = entities.stories[mappedMessage.story];
      }
    }

    return mappedMessage;
  });
}

export function mapShares(order = [], entities = initialState) {
  return order.map(id => {
    return {
      ...entities.shares[id],
    };
  });
}
