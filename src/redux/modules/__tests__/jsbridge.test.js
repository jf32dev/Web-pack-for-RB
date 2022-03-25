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

import { expect } from 'chai';
import reducer from '../jsbridge/jsbridge';
import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  POST_MESSAGE
} from '../jsbridge/actions';

import parseComment from '../jsbridge/helpers/parseComment';
import parseStory from '../jsbridge/helpers/parseStory';

function log(str) {  // eslint-disable-line
  console.log(JSON.stringify(str, null, '  '));  // eslint-disable-line
}

describe('jsbridge reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql({});
  });

  it('should add new request', () => {
    const postMessage = {
      'action': 'request',
      'data': {
        'action': 'getList',
        'data': {
          'entityName': 'tab',
          'sortBy': 'name',
          'fullRelationshipRecord': 'true'
        },
        'jsListener': 'setTabList',
        'requestString': 'getList?entityName=tab&sortBy=name&fullRelationshipRecord=true&originalJsListener=setTabList&jsListener=responseFromRequest&requestId=1',
        'requestId': 1
      },
      'handle': 'JS_BRIDGE_TEST',
      'parentHandle': 'hub-web-app-v5',
      'parentUrl': 'https://lochdev.btc:3000',
      'source': 'btc-js-bridge'
    };

    const expectedState = {
      JS_BRIDGE_TEST: {
        requests: [1],
        requestsById: {
          1: postMessage
        },
        responsesById: {}
      }
    };

    const actualState = reducer({}, {
      type: JSBRIDGE_REQUEST,
      data: postMessage,
    });

    expect(actualState).to.eql(expectedState);
  });

  it('should add request response', () => {
    const postMessage = {
      'action': 'request',
      'data': {
        'action': 'getList',
        'data': {
          'entityName': 'tab',
          'sortBy': 'name',
          'fullRelationshipRecord': 'true'
        },
        'jsListener': 'setTabList',
        'requestString': 'getList?entityName=tab&sortBy=name&fullRelationshipRecord=true&originalJsListener=setTabList&jsListener=responseFromRequest&requestId=1',
        'requestId': 1
      },
      'handle': 'JS_BRIDGE_TEST',
      'parentHandle': 'hub-web-app-v5',
      'parentUrl': 'https://lochdev.btc:3000',
      'source': 'btc-js-bridge'
    };

    const postMessageResponse = {
      data: postMessage,
      result: [{ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }],
      error: null
    };

    const initialState = {
      JS_BRIDGE_TEST: {
        requests: [1],
        requestsById: {
          1: postMessage
        }
      }
    };

    const expectedState = {
      JS_BRIDGE_TEST: {
        requests: [1],
        requestsById: {
          1: postMessage
        },
        responsesById: {
          1: {
            result: [
              {
                id: 1,
                name: 'Test 1'
              },
              {
                id: 2,
                name: 'Test 2'
              }
            ],
            error: postMessageResponse.error,
            sent: false
          }
        }
      }
    };

    const actualState = reducer(initialState, {
      type: JSBRIDGE_SUCCESS,
      ...postMessageResponse
    });

    expect(actualState).to.eql(expectedState);
  });

  it('should set request response to sent', () => {
    const postMessage = {
      'action': 'request',
      'data': {
        'action': 'getList',
        'data': {
          'entityName': 'tab',
          'sortBy': 'name',
          'fullRelationshipRecord': 'true'
        },
        'jsListener': 'setTabList',
        'requestString': 'getList?entityName=tab&sortBy=name&fullRelationshipRecord=true&originalJsListener=setTabList&jsListener=responseFromRequest&requestId=1',
        'requestId': 1
      },
      'handle': 'JS_BRIDGE_TEST',
      'parentHandle': 'hub-web-app-v5',
      'parentUrl': 'https://lochdev.btc:3000',
      'source': 'btc-js-bridge'
    };

    const postMessageResponse = {
      data: postMessage,
      result: [{ id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }],
      error: null
    };

    const initialState = {
      JS_BRIDGE_TEST: {
        requests: [1],
        requestsById: {
          1: postMessage,
        },
        responsesById: {
          1: {
            result: postMessageResponse.result,
            error: postMessageResponse.error,
            sent: false
          }
        }
      }
    };

    const expectedState = {
      JS_BRIDGE_TEST: {
        requests: [1],
        requestsById: {
          1: postMessage
        },
        responsesById: {
          1: {
            result: postMessageResponse.result,
            error: postMessageResponse.error,
            sent: true
          }
        }
      }
    };

    const actualState = reducer(initialState, {
      type: POST_MESSAGE,
      data: postMessage
    });

    expect(actualState).to.eql(expectedState);
  });
});

describe('jsbridge parsing helpers', () => {
  it('should parse comment', () => {
    const input = {
      id: 11783,
      message: 'cool',
      time: 1496104731,
      parentId: 0,
      author: {
        id: 204,
        email: 'lochlan@bigtincan.com',
        type: 'people',
        status: 'active',
        name: 'Lochlan2 M\'Bride',
        thumbnail: 'https://push.bigtincan.org/f/Dm9jEkGXJpW6KRWbN5O0/avatar/5ba4c5e56f2ffe7ae80aee9b6bb332229e575ffe0fc186ed38d19204023963a3.png',
        role: 'Webby',
        isFollowed: false,
        social: {},
        skills: []
      },
      canDelete: true,
      replies: [
        {
          id: 11784,
          message: 'double cool',
          time: 1496104734,
          parentId: 11783,
          author: {
            id: 204,
            email: 'lochlan@bigtincan.com',
            type: 'people',
            status: 'active',
            name: 'Lochlan2 M\'Bride',
            thumbnail: 'https://push.bigtincan.org/f/Dm9jEkGXJpW6KRWbN5O0/avatar/5ba4c5e56f2ffe7ae80aee9b6bb332229e575ffe0fc186ed38d19204023963a3.png',
            role: 'Webby',
            isFollowed: false,
            social: {},
            skills: []
          },
          canDelete: true
        }
      ]
    };

    const expected = {
      id: input.id,
      createDate: input.time,
      message: input.message,
      posterName: input.author.name,
      story: {},  // TODO fullRelationshipRecord
      userId: input.author.id,
      isPending: null,
      comments: [{
        id: input.replies[0].id,
        createDate: input.replies[0].time,
        message: input.replies[0].message,
        posterName: input.replies[0].author.name,
        story: {},
        userId: input.replies[0].author.id,
        isPending: null,
        comments: []
      }]
    };

    expect(parseComment(input)).to.eql(expected);
  });

  it('should parse story', () => {
    const input = {
      id: 6480689,
      permId: 6086875,
      name: '123121312323123asdasdasdasdasdasd',
      thumbnail: 'https://push.bigtincan.org/f/Dm9jEkGXJpW6KRWbN5O0/thumbnail/c9/c9fe1bc1d9f0a665c6b3ff513af327406cc591bd13437339197f069789e16e26-thumb-400x400.png?v=1481604969',
      featuredImage: '',
      colour: '#02e8d1',
      type: 'story',
      excerpt: '',
      files: [],
      isLiked: false,
      isBookmark: false,
      isQuicklink: false,
      quicklinkUrl: '',
      isQuickfile: false,
      updated: 1483678302,
      commentCount: 2,
      fileCount: 0,
      isProtected: false,
      rating: 5,
      ratingCount: 1,
      author: {
        id: 204,
        email: 'lochlan@bigtincan.com',
        type: 'people',
        status: 'active',
        name: 'Lochlan2 M\'Bride',
        firstname: 'Lochlan2',
        lastname: 'M\'Bride',
        thumbnail: 'https://push.bigtincan.org/f/Dm9jEkGXJpW6KRWbN5O0/avatar/5ba4c5e56f2ffe7ae80aee9b6bb332229e575ffe0fc186ed38d19204023963a3.png',
        role: 'Webby',
        isFollowed: false
      },
      badgeTitle: 'Popular',
      badgeColour: '#00e66b',
      sharing: true,
      sharingType: 92,
      isGeoProtected: false
    };

    const expected = {
      id: input.id,
      authorFirstName: input.author && input.author.firstName,
      authorLastName: input.author && input.author.lastName,
      channel: {},
      comments: [],
      createDate: input.updated,
      enableAnnotation: input.annotating,
      events: [],
      expiryDate: input.expiresAt,
      files: [],
      flatMessage: input.excerpt,
      isFavorited: input.isBookmark,
      isLiked: input.isLiked,
      isNotify: input.notify,
      isProtected: input.isProtected,
      isSubscribed: input.isSubscribed,
      isUnread: !input.isRead,
      likesCount: input.updated,
      message: input.message,
      openingsCount: input.readCount,
      permId: input.permId,
      quickLink: input.quicklinkUrl,
      quickLinkFallback: null,
      score: input.rating,
      sharingType: input.sharingType,
      socialURL: input.sharingPublicURL,
      sequence: input.sequence,
      tags: [],
      title: input.name,
      userId: input.author && input.author.id
    };

    expect(parseStory(input)).to.eql(expected);
  });
});
