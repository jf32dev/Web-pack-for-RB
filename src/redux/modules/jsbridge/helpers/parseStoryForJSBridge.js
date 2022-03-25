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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import moment from 'moment-timezone';
import parseChannel from './parseChannel';
import parseComment from './parseComment';
import parseEvent from './parseEvent';
import parseFile from './parseFile';
import parseUser from './parseUser';

const optionalAttributes = [
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

function parseOptionalAttributesForStory(storyItem, optionalAttributesParam) {
  const newOptionalAttributes = {};
  optionalAttributesParam.forEach(item => {
    switch (item) {
      // Story Author
      case 'author': {
        if (storyItem.author && storyItem.author.id) {
          newOptionalAttributes.author = parseUser(storyItem.author);
        }
        break;
      }
      // Channel (primary)
      case 'channel': {
        if (storyItem.channels) {
          newOptionalAttributes.channel = {};
          newOptionalAttributes.channel = parseChannel(storyItem.channels.find(o => !o.alias));
        }
        break;
      }
      // Add comments and comments counts to Story data if not available
      case 'comments': {
        if (storyItem.commentCount === undefined && storyItem.comments) {
          newOptionalAttributes.commentCount = storyItem.comments.length;
        }
        if (storyItem.comments) {
          newOptionalAttributes.comments = [];
          storyItem.comments.forEach(o => {
            newOptionalAttributes.comments.push(parseComment(o));
          });
        }
        break;
      }
      case 'enableAnnotation': {
        newOptionalAttributes.enableAnnotation = storyItem.annotating;
        break;
      }
      // Events
      case 'events': {
        if (storyItem.events) {
          newOptionalAttributes.events = [];
          storyItem.events.forEach(o => {
            newOptionalAttributes.events.push(parseEvent(o));
          });
        }
        break;
      }
      case 'files': {
        if (storyItem.fileCount === undefined && storyItem.files) {
          newOptionalAttributes.fileCount = storyItem.files.length;
        }
        if (storyItem.files) {
          newOptionalAttributes.files = [];
          storyItem.files.forEach(o => {
            newOptionalAttributes.files.push(parseFile(o));
          });
        }
        break;
      }
      case 'isSubscribed': {
        newOptionalAttributes.isSubscribed = storyItem.isSubscribed;
        break;
      }
      case 'message': {
        newOptionalAttributes.message = storyItem.message || storyItem.description;
        break;
      }
      case 'notify': {
        newOptionalAttributes.notify = storyItem.notify;
        break;
      }
      // Return Quickfile Object
      case 'quickFile': {
        if (storyItem.isQuickfile && storyItem.files && storyItem.files.length) {
          newOptionalAttributes.quickFile = storyItem.files[0];
        }
        break;
      }
      case 'readCount': {
        newOptionalAttributes.readCount = storyItem.readCount;
        break;
      }
      case 'score': {
        newOptionalAttributes.score = storyItem.contentScore;
        break;
      }
      case 'sequence': {
        newOptionalAttributes.sequence = storyItem.sequence;
        break;
      }
      case 'sharingType': {
        newOptionalAttributes.sharingType = storyItem.sharingType;
        break;
      }
      case 'socialURL': {
        newOptionalAttributes.socialURL = storyItem.sharingPublicURL;
        break;
      }
      case 'subscribers': {
        if (storyItem.subscribers) {
          newOptionalAttributes.subscribers = [];
          storyItem.subscribers.forEach(o => {
            newOptionalAttributes.subscribers.push(parseUser(o));
          });
        }
        break;
      }
      case 'tags': {
        if (storyItem.tags) {
          newOptionalAttributes.tags = storyItem.tags || [];
        }
        break;
      }
      default:
        if (storyItem[item]) {
          newOptionalAttributes[item] = storyItem[item];
        }
        break;
    }
  });

  return newOptionalAttributes;
}

export default function parseStoryForJSBridge(e, fullRecord, includedAttributes) {
  let newStory = {
    badgeColour: e.badgeColour,
    badgeTitle: e.badgeTitle,
    commentCount: e.commentCount,
    createDate: e.updated,
    excerpt: e.excerpt,
    expiryDate: e.expiresAt ? moment(e.expiresAt).unix() : 0, // convert from rfc3339 to unix timestamp
    fileCount: e.fileCount,
    id: e.permId,
    initialCreateDate: e.initialCreatedAt,
    initialPublishDate: e.initialPublishedAt,
    isBookmark: e.isBookmark,
    isFeed: e.isFeed || false,
    isLiked: e.isLiked,
    isProtected: e.isProtected,
    isUnread: !e.isRead,
    likesCount: e.ratingCount,
    quickFileId: 0,
    quickLink: e.quicklinkUrl,
    revisionId: e.id,
    thumbnail: e.thumbnail,
    title: e.name,
    type: 'story'
  };

  // Add FeaturedImage if not empty
  if (e.featuredImage && e.featuredImage !== '') {
    newStory.featuredImage = e.featuredImage;
  }

  // Return QuickfileID
  if (e.isQuickfile && e.files && e.files.length) {
    newStory.quickFileId = e.files[0].id;
  }

  if (fullRecord) {
    newStory = { ...newStory, ...parseOptionalAttributesForStory(e, optionalAttributes) };

    // if params is includeAttributes
  } else if (includedAttributes && includedAttributes.length > 0) {
    newStory = { ...newStory, ...parseOptionalAttributesForStory(e, includedAttributes) };
  }

  return newStory;
}
