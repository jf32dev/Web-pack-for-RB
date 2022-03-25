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
  DELETE_ENTITY,
  UPDATE_ENTITY,
  TOGGLE_ENTITY_ATTRIBUTE
} from '../entities/entities';

import {
  LOAD_TABS_SUCCESS,
  LOAD_CHANNELS_SUCCESS,
  LOAD_STORIES_SUCCESS
} from '../content';

const tabs = [{
  id: 1,
  name: 'Tab 1'
}, {
  id: 2,
  name: 'Tab 2'
}];

const channels = [{
  id: 1,
  name: 'Channel 1'
}, {
  id: 2,
  name: 'Channel 2',
  stories: []
}];

const stories = [{
  id: 1,
  permId: 1,
  name: 'Story 1'
}, {
  id: 2,
  permId: 2,
  name: 'Story 2'
}];

describe('entities reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should update entity attribute', () => {
    const state = {
      ...initialState,
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: []
        }
      }
    };

    const expectedState = {
      ...initialState,
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1 renamed',
          type: 'tab',
          channels: [],
          thumbnail: 'test.jpg'
        }
      }
    };

    expect(
      reducer(state, {
        type: UPDATE_ENTITY,
        name: 'tabs',
        id: 1,
        attrs: {
          name: 'Tab 1 renamed',
          thumbnail: 'test.jpg'
        }
      })
    ).to.eql(expectedState);
  });


  it('should toggle entity attribute', () => {
    const state = {
      ...initialState,
      users: {
        1: {
          id: 1,
          name: 'User 1',
          type: 'user',
          isFollowed: false
        }
      }
    };

    const expectedState = {
      ...initialState,
      users: {
        1: {
          id: 1,
          name: 'User 1',
          type: 'user',
          isFollowed: true
        }
      }
    };

    expect(
      reducer(state, {
        type: TOGGLE_ENTITY_ATTRIBUTE,
        name: 'users',
        id: 1,
        attrName: 'isFollowed'
      })
    ).to.eql(expectedState);
  });

  it('should set entity as deleted', () => {
    const state = {
      ...initialState,
      bookmarks: {
        1: {
          id: 1,
          name: 'Bookmark 1',
          type: 'bookmark'
        }
      }
    };

    const expectedState = {
      ...initialState,
      bookmarks: {
        1: {
          id: 1,
          name: 'Bookmark 1',
          type: 'bookmark',
          deleted: true
        }
      }
    };

    expect(
      reducer(state, {
        type: DELETE_ENTITY,
        name: 'bookmarks',
        id: 1
      })
    ).to.eql(expectedState);
  });

  it('should normalize tabs array', () => {
    const expectedState = {
      ...initialState,
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: []
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    expect(
      reducer(initialState, {
        type: LOAD_TABS_SUCCESS,
        result: tabs,
      })
    ).to.eql(expectedState);
  });

  it('should normalize tabs result and merge existing data', () => {
    const state = {
      ...initialState,
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab'
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    const testResult = [{
      id: 1,
      name: 'Tab 1 - edited',
      channels: []
    }];

    const expectedState = {
      ...initialState,
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1 - edited',
          type: 'tab',
          channels: [],
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    expect(
      reducer(state, {
        type: LOAD_TABS_SUCCESS,
        result: testResult,
      })
    ).to.eql(expectedState);
  });

  it('should normalize tabs result with nested channels and stories', () => {
    const nestedResult = [{
      id: 1,
      name: 'Tab 1',
      type: 'tab',
      channels: [{
        id: 1,
        name: 'Channel 1',
        type: 'channel',
        stories: []
      }, {
        id: 2,
        name: 'Channel 2',
        type: 'channel',
        stories: [{
          id: 1,
          permId: 1,
          name: 'Story 1'
        }, {
          id: 2,
          permId: 2,
          name: 'Story 2'
        }]
      }]
    }, {
      id: 2,
      name: 'Tab 2',
      channels: []
    }];

    const expectedState = {
      ...initialState,
      channels: {
        1: {
          id: 1,
          name: 'Channel 1',
          type: 'channel',
          stories: []
        },
        2: {
          id: 2,
          name: 'Channel 2',
          type: 'channel',
          stories: [1, 2]
        }
      },
      stories: {
        1: {
          id: 1,
          permId: 1,
          name: 'Story 1',
          type: 'story'
        },
        2: {
          id: 2,
          permId: 2,
          name: 'Story 2',
          type: 'story'
        }
      },
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: [1, 2]
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    expect(
      reducer(initialState, {
        type: LOAD_TABS_SUCCESS,
        result: nestedResult,
      })
    ).to.eql(expectedState);
  });

  it('should add channels to tab by id', () => {
    const state = {
      ...initialState,
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    const expectedState = {
      ...initialState,
      channels: {
        1: {
          id: 1,
          name: 'Channel 1',
          type: 'channel'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          type: 'channel',
          stories: []
        }
      },
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    expect(
      reducer(state, {
        type: LOAD_CHANNELS_SUCCESS,
        tabId: 1,
        result: channels,
      })
    ).to.eql(expectedState);
  });


  it('should set channels to tab if offset equals zero', () => {
    const state = {
      ...initialState,
      channels: {
        1: {
          id: 1,
          name: 'Channel 1',
          type: 'channel'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          type: 'channel',
          stories: []
        }
      },
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    const moreChannels = [{
      id: 3,
      name: 'Channel 3'
    }, {
      id: 4,
      name: 'Channel 4',
      stories: []
    }];

    const expectedState = {
      ...initialState,
      channels: {
        1: {
          id: 1,
          name: 'Channel 1',
          type: 'channel'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          type: 'channel',
          stories: []
        },
        3: {
          id: 3,
          name: 'Channel 3',
          type: 'channel'
        },
        4: {
          id: 4,
          name: 'Channel 4',
          type: 'channel',
          stories: []
        }
      },
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: [3, 4],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        }
      }
    };

    expect(
      reducer(state, {
        type: LOAD_CHANNELS_SUCCESS,
        tabId: 2,
        result: moreChannels,
      })
    ).to.eql(expectedState);
  });


  it('should add more channels to tab when offset greater than zero', () => {
    const state = {
      ...initialState,
      channels: {
        1: {
          id: 1,
          name: 'Channel 1',
          type: 'channel'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          type: 'channel',
          stories: []
        }
      },
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    const moreChannels = [{
      id: 3,
      name: 'Channel 3',
      type: 'channel'
    }, {
      id: 4,
      name: 'Channel 4',
      type: 'channel',
      stories: []
    }];

    const expectedState = {
      ...initialState,
      channels: {
        1: {
          id: 1,
          name: 'Channel 1',
          type: 'channel'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          type: 'channel',
          stories: []
        },
        3: {
          id: 3,
          name: 'Channel 3',
          type: 'channel',
        },
        4: {
          id: 4,
          name: 'Channel 4',
          type: 'channel',
          stories: []
        }
      },
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: [1, 2, 3, 4],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    expect(
      reducer(state, {
        type: LOAD_CHANNELS_SUCCESS,
        tabId: 1,
        offset: 2,  // loading more
        result: moreChannels,
      })
    ).to.eql(expectedState);
  });

  it('should set stories to channel by id', () => {
    const state = {
      ...initialState,
      channels: {
        1: {
          id: 1,
          name: 'Channel 1',
          type: 'channel'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          type: 'channel',
          stories: []
        }
      },
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    const expectedState = {
      ...initialState,
      channels: {
        1: {
          id: 1,
          name: 'Channel 1',
          type: 'channel'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          type: 'channel',
          stories: [1, 2],
          storiesLoading: false,
          storiesComplete: true,
          storiesError: null
        }
      },
      stories: {
        1: {
          id: 1,
          permId: 1,
          name: 'Story 1',
          type: 'story'
        },
        2: {
          id: 2,
          permId: 2,
          name: 'Story 2',
          type: 'story'
        }
      },
      tabs: {
        1: {
          id: 1,
          name: 'Tab 1',
          type: 'tab',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          type: 'tab',
          channels: []
        }
      }
    };

    expect(
      reducer(state, {
        type: LOAD_STORIES_SUCCESS,
        channelId: 2,
        result: stories,
      })
    ).to.eql(expectedState);
  });
});
