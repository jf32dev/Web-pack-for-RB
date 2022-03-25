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

export default function parseFile(e) {
  const newFile = {
    category: e.category,
    createDate: e.dateAdded,
    description: e.description,
    downloadURL: e.downloadUrl,
    editedLocally: false,
    filename: e.filename,
    id: e.id,
    isDownloaded: null,
    sharingType: 0,  // blocked
    size: e.size,
    thumbnail: e.thumbnail,
    type: 'file',
    url: e.url
  };

  // SharingType (0/1/2)
  if (e.shareStatus === 'optional') {
    newFile.sharingType = 1;
  } else if (e.shareStatus === 'mandatory') {
    newFile.sharingType = 2;
  }

  // Map story
  if (e.story) {
    newFile.story = parseStory(e.story);
  }

  // Attach tags
  if (e.tags && typeof e.tags === 'object' && typeof e.tags.map === 'function') {
    newFile.tags = e.tags.map(tag => tag.name);
  }

  return newFile;
}
