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

import parseFile from './parseFile';
import parseStory from './parseStory';

export default function parseBookmark(e) {
  let newBookmark = {
    id: e.id,
    name: e.name,
    createDate: e.time
  };

  // Parse set dara
  if (e.setData && e.setData.length) {
    // Parse to fileCollection
    if (e.setData[0].type === 'file') {
      newBookmark.files = [];
      newBookmark.type = 'fileCollection';
      e.setData.forEach(o => {
        newBookmark.files.push(parseFile(o));
      });

    // Parse to Story
    } else if (e.setData[0].type === 'story') {
      newBookmark = parseStory(e.setData[0]);
    }
  }

  return newBookmark;
}
