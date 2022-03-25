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
import parseChannel from './parseChannel';
import parseComment from './parseComment';
import parseEvent from './parseEvent';
import parseFile from './parseFile';
import parseUser from './parseUser';

// TODO: Use parseStoryForJSBridge for any new JSBRIDGE api's
export default function parseStory(e, fullRecord) {
  const newStory = {
    id: e.permId,
    revisionId: e.id,
    author: {},  // isFeed is empty
    commentCount: e.commentCount,
    createDate: e.updated,
    enableAnnotation: e.annotating,
    excerpt: e.excerpt,
    expiryDate: e.expiresAt ? moment(e.expiresAt).unix() : 0, // convert from rfc3339 to unix timestamp
    fileCount: e.fileCount,
    isBookmark: e.isBookmark,
    isFeed: e.isFeed || false,
    isLiked: e.isLiked,
    isProtected: e.isProtected,
    isSubscribed: e.isSubscribed,
    isUnread: !e.isRead,
    likesCount: e.ratingCount,
    notify: e.notify,
    readCount: e.readCount,
    quickFileId: 0,
    quickLink: e.quicklinkUrl,
    sharingType: e.sharingType,
    socialURL: e.sharingPublicURL,
    sequence: e.sequence,
    title: e.name,
    thumbnail: e.thumbnail,
    type: 'story',
    badgeColour: e.badgeColour,
    badgeTitle: e.badgeTitle
  };

  // refers to the original creation date
  if (e.initialCreatedAt) {
    newStory.initialCreateDate = e.initialCreatedAt;
  }

  if (e.initialPublishedAt) {
    newStory.initialPublishDate = e.initialPublishedAt;
  }

  // Story Author
  if (e.author && e.author.id) {
    newStory.author = parseUser(e.author);
  }

  // Add counts to Story data if not available
  if (e.commentCount === undefined && e.comments) {
    newStory.commentCount = e.comments.length;
  }
  if (e.fileCount === undefined && e.files) {
    newStory.fileCount = e.files.length;
  }

  // Quickfile
  if (e.isQuickfile && e.files && e.files.length) {
    newStory.quickFileId = e.files[0].id;
    newStory.quickFile = e.files[0];
  }

  // Map channel, comments, events, files, subscribers, tags
  if (fullRecord) {
    if (e.tags) {
      newStory.tags = e.tags || [];
    }

    // Message
    // GET v5/webapi/story/get?{permId} return message
    // GET v5/webapi/content/storie return description
    newStory.message = e.message || e.description;

    // Channel (primary)
    if (e.channels) {
      newStory.channel = {};
      newStory.channel = parseChannel(e.channels.find(o => !o.alias));
    }

    // Comments
    if (e.comments && e.comments.length) {
      newStory.comments = [];
      e.comments.forEach(o => {
        newStory.comments.push(parseComment(o));
      });
    }

    // Events
    if (e.events && e.events.length) {
      newStory.events = [];
      e.events.forEach(o => {
        newStory.events.push(parseEvent(o));
      });
    }

    // Files
    if (e.files && e.files.length) {
      newStory.files = [];
      e.files.forEach(o => {
        newStory.files.push(parseFile(o));
      });
    }

    // Subscribers
    if (e.subscribers && e.subscribers.length) {
      newStory.subscribers = [];
      e.subscribers.forEach(o => {
        newStory.subscribers.push(parseUser(o));
      });
    }
  }

  return newStory;
}
