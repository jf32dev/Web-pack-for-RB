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

import parseStory from './parseStory';
import parseUser from './parseUser';

export default function parseComment(e) {
  const newComment = {
    author: e.author ? parseUser(e.author) : {},
    comments: [],
    createDate: e.time,
    id: e.id,
    isPending: false,
    message: e.message,
    type: 'comment'
  };

  // Commment replies
  if (e.replies && e.replies.length) {
    e.replies.forEach(r => {
      newComment.comments.push(parseComment(r));
    });
  }

  // Map Story (searchResult)
  if (e.story) {
    newComment.story = parseStory(e.story);
  }

  return newComment;
}
