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

import parseChannel from './parseChannel';

export default function parseTab(e, fullRecord) {
  const newTab = {
    id: e.id,
    name: e.name,
    channelCount: e.childCount,
    thumbnail: e.thumbnail,
    isPersonal: e.isPersonal,
    isShared: e.isShared || false,
    type: 'tab'
  };

  // Map channels
  if (fullRecord && e.channels) {
    newTab.channels = [];
    e.channels.forEach(c => {
      newTab.channels.push(parseChannel(c));
    });
  }

  return newTab;
}
