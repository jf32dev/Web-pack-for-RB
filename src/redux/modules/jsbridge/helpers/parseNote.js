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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import parseStory from './parseStory';
import parseChannel from './parseChannel';

export default function parseNote(e) {
  const newNote = {
    author: e.author,
    colour: e.colour,
    excerpt: e.excerpt,
    id: e.id,
    name: e.name || e.title,
    thumbnail: e.thumbnail,
    type: 'note'
  };


  // Map Story (searchResult)
  if (e.story) {
    newNote.story = parseStory(e.story);
  }

  // Map Channel (searchResult)
  if (e.channel) {
    newNote.channel = parseChannel(e.channel);
  }

  // Search result
  if (e.searchResult) {
    newNote.searchResult = e.searchResult;
  }

  return newNote;
}
