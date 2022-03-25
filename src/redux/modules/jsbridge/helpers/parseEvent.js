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
import parseStory from './parseStory';

export default function parseEvent(e, fullRecord = true) {
  const unixStart = moment(e.start).unix();
  const unixEnd = moment(e.end).unix();

  const newEvent = {
    id: e.id,
    name: e.name || e.title,
    startDate: fullRecord ? e.start : unixStart,
    endDate: fullRecord ? e.end : unixEnd,
    timezone: e.timezone || e.tz,
    isAllDay: fullRecord ? e.allDay : e.isAllDay,
    type: 'event'
  };

  if (!fullRecord) {
    newEvent.story = {
      id: e.storyPermId,
      thumbnail: e.storyThumbnail
    };
  }

  // Map Story (searchResult)
  if (e.story) {
    newEvent.story = parseStory(e.story);
  }

  // Search result
  if (e.searchResult) {
    newEvent.searchResult = e.searchResult;
  }

  return newEvent;
}
