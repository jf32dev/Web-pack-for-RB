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

export const JSBRIDGE_REQUEST = 'jsbridge/JSBRIDGE_REQUEST';
export const JSBRIDGE_SUCCESS = 'jsbridge/JSBRIDGE_SUCCESS';
export const JSBRIDGE_ERROR = 'jsbridge/JSBRIDGE_ERROR';

export const POST_MESSAGE = 'jsbridge/POST_MESSAGE';
export const POST_MESSAGE_ERROR = 'jsbridge/POST_MESSAGE_ERROR';

/**
 * js-bridge actions
 */
export addInterestArea from './actions/addInterestArea';  // removeInterestArea
export closeFileViewer from './actions/closeFileViewer';
export cloudFilesProxy from './actions/cloudFilesProxy';
export createComment from './actions/createComment';
export createCommentReply from './actions/createCommentReply';
export createStory from './actions/createStory';
export createFile from './actions/createFile';
export createShare from './actions/createShare';
export editStory from './actions/editStory';
export editUserProfile from './actions/editUserProfile';
export followUser from './actions/followUser';            // unfollowUser
export getBookmarkList from './actions/getBookmarkList';
export getCluiCourseURL from './actions/getCluiCourseURL';
export getCRMDetail from './actions/getCRMDetail';
export getDraftList from './actions/getDraftList';
export getEntity from './actions/getEntity';
export getEvents from './actions/getEvents';
export getInterestAreas from './actions/getInterestAreas';
export getList from './actions/getList';
export getLocation from './actions/getLocation';
export getNewList from './actions/getNewList';
export getRecommendedList from './actions/getRecommendedList';
export getSystemConfig from './actions/getSystemConfig';
export likeStory from './actions/likeStory';              // unlikeStory
export openEntity from './actions/openEntity';
export openInterestAreas from './actions/openInterestAreas';
export openMenu from './actions/openMenu';
export openURL from './actions/openURL';
export proxyRequest from './actions/proxyRequest';
export search from './actions/search';
export searchResult from './actions/searchResult';
export sendEmail from './actions/sendEmail';
export subscribeStory from './actions/subscribeStory';    // unsubscribeStory
export switchAccount from './actions/switchAccount';
export readFile from './actions/readFile';
export getFeaturedList from './actions/getFeaturedList';

// web app only
export getStoryDescription from './actions/getStoryDescription';
export unsafeGetAccessToken from './actions/unsafeGetAccessToken';

// new search
export searchStories from './actions/searchStories';
export searchFiles from './actions/searchFiles';

/**
 TODO:
 switchAccount       // log out on web?
 */

/**
 * postMessage to iframe
 * sets response to sent
 */
export function postMessage(data, source, origin) {
  const validData = data.originalRequest && source && origin;

  // postMessage to frame
  if (validData) {
    // post message to child frame
    try {
      source.postMessage(data, '*');
    } catch (error) {
      return {
        type: POST_MESSAGE_ERROR,
        data: data,
        error: {
          code: 99,
          message: 'Not in iframe'
        }
      };
    }
  }

  return {
    type: POST_MESSAGE,
    data: {
      handle: data.originalRequest.handle,
      data: {
        requestId: data.originalRequest.data.requestId
      }
    }
  };
}

export function bridgeError(data, error) {
  return {
    type: JSBRIDGE_ERROR,
    data,
    error
  };
}
