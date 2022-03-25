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
import reducer, {
  initialState,
  setData,
  setAttribute,
  toggleAttribute,

  addChannel,
  deleteChannel,
  setPrimaryChannel,

  SET_DATA,
  SET_ATTRIBUTE,
  TOGGLE_LIKE,
  TOGGLE_ATTRIBUTE,

  ADD_CHANNEL,
  DELETE_CHANNEL,
  SET_PRIMARY_CHANNEL,

  ADD_COMMENT,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAIL,

  DELETE_COMMENT
} from '../story';

const testStory = {
  id: 1,
  permId: 101,
  type: 'story',

  badgeTitle: 'Cool Badge',
  badgeColour: '#f00',
  colour: '#00cc00',
  excerpt: 'Very interesting read.',
  message: '<p>Example Story....</p>',
  name: 'Test Story',
  sequence: 0,
  sharing: 1,
  status: 'draft',
  thumbnail: '',
  thumbnailId: 0,

  archivedAt: 0,
  rating: 0,
  updated: 0,

  expiresAt: 0,
  expiresAtTz: 'Australia/Sydney',
  publishAt: 0,
  publishAtTz: 'Australia/Sydney',

  featuredImage: '',
  featuredStartsAt: 0,
  featuredExpiresAt: 0,
  featuredAtTz: '',

  commentsById: {},
  comments: [],

  channelsById: {
    109959: {
      id: 109959,
      name: 'JR Test Channel',
      thumbnail: 'http://dev.bigtincan.com/files/24527024-4592-11e4-b950-000c2972a750.png',
      alias: 0
    },
    110048: {
      id: 110048,
      name: 'Android test2as1',
      thumbnail: 'http://dev.bigtincan.com/files/thumbnails/b6/b6e4bf8a-786f-11e5-829b-9f2da2d9b4b3-thumb-400x400.png?v=1447715530',
      alias: 1
    }
  },
  channels: [109959, 110048],

  events: [],
  files: [],
  flags: [],
  geolocations: [],
  history: [],
  metadata: [],
  notes: [],
  subscribers: [],
  tags: [],

  annotating: false,
  isBookmark: true,
  isFeed: false,
  isLiked: false,
  isProtected: false,
  isPubliclyAccessible: false,
  isRead: true,
  isSubscribed: false,
  isQuicklink: false,
  isQuickfile: false,

  ratingCount: 5,
  readCount: 10
};

const testComment = {
  message: 'New Test Comment!',
  time: 1465269336,
  parentId: 0,
  author: {
    id: 204,
    email: 'lochlan@bigtincan.com',
    type: 'people',
    name: 'Lochlan M\'Bride',
    thumbnail: '',
    role: 'Webby',
    isFollowed: false
  }
};

const testParentComment = {
  id: 2,
  message: 'I already exist',
  time: 1465269336,
  parentId: 0,
  author: {
    id: 204,
    email: 'lochlan@bigtincan.com',
    type: 'people',
    name: 'Lochlan M\'Bride',
    thumbnail: '',
    role: 'Webby',
    isFollowed: false
  },
  replies: []
};

describe('story actions', () => {
  it('should create an action to set story data', () => {
    const expectedAction = {
      type: SET_DATA,
      data: testStory
    };
    expect(setData(testStory)).to.eql(expectedAction);
  });

  it('should create an action to set attribute', () => {
    const expectedAction = {
      type: SET_ATTRIBUTE,
      name: 'name',
      value: 'Testing Story'
    };
    expect(setAttribute('name', 'Testing Story')).to.eql(expectedAction);
  });

  it('should create an action to toggle attribute by name (no API)', () => {
    const expectedAction = {
      type: TOGGLE_ATTRIBUTE,
      name: 'isProtected'
    };
    expect(toggleAttribute('isProtected')).to.eql(expectedAction);
  });

  it('should create an action to add channel', () => {
    const channel = {
      id: 99999,
      name: 'Test Data Channel',
      thumbnail: 'no_thumb.jpg',
      alias: 0
    };
    const expectedAction = {
      type: ADD_CHANNEL,
      data: channel
    };
    expect(addChannel(channel)).to.eql(expectedAction);
  });

  it('should create an action to delete channel', () => {
    const id = 999;
    const expectedAction = {
      type: DELETE_CHANNEL,
      id: id
    };
    expect(deleteChannel(id)).to.eql(expectedAction);
  });

  it('should create an action to set primary channel', () => {
    const id = 999;
    const expectedAction = {
      type: SET_PRIMARY_CHANNEL,
      id: id
    };
    expect(setPrimaryChannel(id)).to.eql(expectedAction);
  });
});

describe('story reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should set story data', () => {
    const expectedState = { ...initialState, ...testStory };
    expect(
      reducer(initialState, {
        type: SET_DATA,
        data: testStory
      })
    ).to.eql(expectedState);
  });

  it('should set attribute by name', () => {
    const name = 'New Story Name';
    const expectedState = { ...initialState, name: name };
    expect(
      reducer(initialState, {
        type: SET_ATTRIBUTE,
        name: 'name',
        value: name
      })
    ).to.eql(expectedState);
  });

  it('should toggle attribute by name', () => {
    const expectedState = { ...testStory, isBookmark: false };
    expect(
      reducer(testStory, {
        type: TOGGLE_ATTRIBUTE,
        name: 'isBookmark'
      })
    ).to.eql(expectedState);
  });

  it('should toggle isLiked and increment ratingCount', () => {
    const expectedState = {
      ...testStory,
      isLiked: !testStory.isLiked,
      ratingCount: testStory.ratingCount + 1
    };
    expect(
      reducer(testStory, {
        type: TOGGLE_LIKE
      })
    ).to.eql(expectedState);
  });

  it('should add primary channel to empty story', () => {
    const channel = {
      id: 999,
      name: 'Primary Channel',
      thumbnail: 'no_thumb.jpg',
      alias: 0
    };

    const expectedState = { ...initialState,
      channels: [channel.id],
      channelsById: {
        999: channel
      }
    };

    expect(
      reducer(initialState, {
        type: ADD_CHANNEL,
        data: channel
      })
    ).to.eql(expectedState);
  });

  it('should add channel alias to populated story', () => {
    const channel = {
      id: 888,
      name: 'Alias Channel',
      thumbnail: 'no_thumb.jpg',
      alias: 1
    };

    const expectedState = { ...testStory,
      channels: [109959, 110048, channel.id],
      channelsById: {
        ...testStory.channelsById,
        888: channel
      }
    };

    expect(
      reducer(testStory, {
        type: ADD_CHANNEL,
        data: channel
      })
    ).to.eql(expectedState);
  });

  it('should merge channel data if already exists', () => {
    const channel = {
      id: 109959,
      alias: 1
    };

    const expectedState = { ...testStory,
      channels: [109959, 110048],
      channelsById: {
        ...testStory.channelsById,
        109959: {
          id: 109959,
          name: 'JR Test Channel',
          thumbnail: 'http://dev.bigtincan.com/files/24527024-4592-11e4-b950-000c2972a750.png',
          alias: 1
        }
      }
    };

    expect(
      reducer(testStory, {
        type: ADD_CHANNEL,
        data: channel
      })
    ).to.eql(expectedState);
  });

  it('should remove channel', () => {
    const id = 110048;
    const expectedState = { ...testStory,
      channels: [109959, 110048],
      channelsById: {
        ...testStory.channelsById,
        [id]: {
          ...testStory.channelsById[id],
          deleted: true
        }
      }
    };

    expect(
      reducer(testStory, {
        type: DELETE_CHANNEL,
        id
      })
    ).to.eql(expectedState);
  });

  it('should set primary channel and all others to alias', () => {
    const id = 110048;
    const expectedState = { ...testStory,
      channels: [109959, 110048],
      channelsById: {
        109959: {
          id: 109959,
          name: 'JR Test Channel',
          thumbnail: 'http://dev.bigtincan.com/files/24527024-4592-11e4-b950-000c2972a750.png',
          alias: 1
        },
        110048: {
          id: 110048,
          name: 'Android test2as1',
          thumbnail: 'http://dev.bigtincan.com/files/thumbnails/b6/b6e4bf8a-786f-11e5-829b-9f2da2d9b4b3-thumb-400x400.png?v=1447715530',
          alias: 0
        }
      }
    };

    expect(
      reducer(testStory, {
        type: SET_PRIMARY_CHANNEL,
        id
      })
    ).to.eql(expectedState);
  });

  it('should add comment to pendingComment', () => {
    const expectedState = { ...initialState,
      pendingComment: testComment
    };

    expect(
      reducer(initialState, {
        type: ADD_COMMENT,
        data: testComment
      })
    ).to.eql(expectedState);
  });

  it('should clear pendingComment and merge API result to comments', () => {
    const pendingState = { ...initialState,
      pendingComment: testComment
    };

    const newCommentId = 1337;

    const expectedState = { ...initialState,
      pendingComment: null,
      commentsById: {
        [newCommentId]: testComment
      },
      comments: [newCommentId]
    };

    expect(
      reducer(pendingState, {
        type: ADD_COMMENT_SUCCESS,
        result: {
          id: newCommentId
        }
      })
    ).to.eql(expectedState);
  });

  it('should clear pendingComment and merge API result to comment reply', () => {
    const testReplyComment = {
      message: 'I am a new comment reply',
      time: 1465569336,
      parentId: testParentComment.id,
      author: {
        id: 204,
        email: 'lochlan@bigtincan.com',
        type: 'people',
        name: 'Lochlan M\'Bride',
        thumbnail: '',
        role: 'Webby',
        isFollowed: false
      }
    };

    const pendingState = { ...initialState,
      pendingComment: testReplyComment,
      commentsById: {
        [testParentComment.id]: testParentComment
      },
      comments: [testParentComment.id]
    };

    const newCommentId = 1338;

    const expectedState = { ...initialState,
      pendingComment: null,
      commentsById: {
        [testParentComment.id]: { ...testParentComment,
          replies: [newCommentId]
        },
        [newCommentId]: testReplyComment
      },
      comments: [testParentComment.id]
    };

    expect(
      reducer(pendingState, {
        type: ADD_COMMENT_SUCCESS,
        result: {
          id: newCommentId,
          parentId: testParentComment.id
        }
      })
    ).to.eql(expectedState);
  });

  it('should add error to pendingComment', () => {
    const testError = {
      message: 'Comment must have a message.'
    };
    const expectedState = { ...initialState,
      pendingComment: { ...initialState.pendingComment,
        error: testError
      }
    };

    expect(
      reducer(initialState, {
        type: ADD_COMMENT_FAIL,
        error: testError
      })
    ).to.eql(expectedState);
  });

  it('should set comment status', () => {
    const stateWithComment = { ...initialState,
      commentsById: {
        [testParentComment.id]: testParentComment
      },
      comments: [testParentComment.id]
    };

    const expectedState = { ...stateWithComment,
      commentsById: {
        [testParentComment.id]: { ...testParentComment,
          status: 'deleted'
        }
      }
    };

    expect(
      reducer(stateWithComment, {
        type: DELETE_COMMENT,
        id: testParentComment.id
      })
    ).to.eql(expectedState);
  });
});
