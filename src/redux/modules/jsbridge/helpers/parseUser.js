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

import parseGroup from './parseGroup';
import parseStory from './parseStory';

export default function parseUser(e, fullRecord) {
  const newUser = {
    id: e.id,
    badgeColour: e.badgeColour || e.badge && e.badge.colour,
    badgeTitle: e.badgeTitle || e.badge && e.badge.title,
    email: e.email,
    firstName: e.firstname,
    lastName: e.lastname,
    score: e.score,
    title: e.title,
    thumbnail: e.thumbnail,
    jobTitle: e.jobTitle,
    type: 'user'
  };

  if (fullRecord) {
    newUser.followers = [];
    newUser.following = [];
    newUser.groups = [];
    newUser.subscribedStories = [];

    // Followers
    if (e.followers && e.followers.length) {
      e.followers.forEach(u => {
        newUser.followers.push(parseUser(u));
      });
    }

    // Following
    if (e.following && e.following.length) {
      e.following.forEach(u => {
        newUser.following.push(parseUser(u));
      });
    }

    // Groups
    if (e.groups && e.groups.length) {
      e.groups.forEach(g => {
        newUser.groups.push(parseGroup(g));
      });
    }

    // Subscribed Stories
    if (e.subscribedStories && e.subscribedStories.length) {
      e.subscribedStories.forEach(s => {
        newUser.subscribedStories.push(parseStory(s));
      });
    }
  }

  return newUser;
}
