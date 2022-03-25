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

  RESET,

  LOAD_TABS_SUCCESS,
  LOAD_CHANNELS_SUCCESS,
  LOAD_STORIES_SUCCESS,

  TOGGLE_SELECTED_TAB,
  TOGGLE_SELECTED_CHANNEL,
  TOGGLE_SELECTED_STORY,

  SELECT_SINGLE_TAB
} from '../browser';

const tabs = [{
  id: 1,
  name: 'Tab 1'
}, {
  id: 2,
  name: 'Tab 2',
  channels: []
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

describe('browser reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should reset to initial state', () => {
    const state = {
      ...initialState,
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1'
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: RESET
      })
    ).to.eql(initialState);
  });

  it('should normalize tabs result', () => {
    const expectedState = {
      ...initialState,
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1'
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
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
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1'
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    const testResult = [{
      id: 1,
      name: 'Tab 1 - edited',
      channels: []
    }];

    const expectedState = {
      ...initialState,
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1 - edited',
          channels: []
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
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
      channels: [{
        id: 1,
        name: 'Channel 1',
        stories: []
      }, {
        id: 2,
        name: 'Channel 2',
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
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1',
          stories: []
        },
        2: {
          id: 2,
          name: 'Channel 2',
          stories: [1, 2]
        }
      },
      storiesById: {
        1: {
          id: 1,
          permId: 1,
          name: 'Story 1'
        },
        2: {
          id: 2,
          permId: 2,
          name: 'Story 2'
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2]
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
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
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1'
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    const expectedState = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          stories: []
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_CHANNELS_SUCCESS,
        tabId: 1,
        result: channels,
      })
    ).to.eql(expectedState);
  });

  it('should add more channels to populated tab', () => {
    const state = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          stories: []
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
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
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          stories: []
        },
        3: {
          id: 3,
          name: 'Channel 3'
        },
        4: {
          id: 4,
          name: 'Channel 4',
          stories: []
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2, 3, 4],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_CHANNELS_SUCCESS,
        tabId: 1,
        result: moreChannels,
      })
    ).to.eql(expectedState);
  });

  it('should add more channels to empty tab', () => {
    const state = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          stories: []
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
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
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          stories: []
        },
        3: {
          id: 3,
          name: 'Channel 3'
        },
        4: {
          id: 4,
          name: 'Channel 4',
          stories: []
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: [3, 4],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_CHANNELS_SUCCESS,
        tabId: 2,
        result: moreChannels,
      })
    ).to.eql(expectedState);
  });

  it('should add stories to channel by id', () => {
    const state = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          stories: []
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    const expectedState = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2',
          stories: [1, 2],
          storiesLoading: false,
          storiesComplete: true,
          storiesError: null
        }
      },
      storiesById: {
        1: {
          id: 1,
          permId: 1,
          name: 'Story 1'
        },
        2: {
          id: 2,
          permId: 2,
          name: 'Story 2'
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2',
          channels: []
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_STORIES_SUCCESS,
        channelId: 2,
        result: stories,
      })
    ).to.eql(expectedState);
  });

  it('should toggle selected attribute on tab', () => {
    const state = {
      ...initialState,
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1'
        },
        2: {
          id: 2,
          name: 'Tab 2'
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    const expectedState = {
      ...initialState,
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          selected: true
        },
        2: {
          id: 2,
          name: 'Tab 2'
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: TOGGLE_SELECTED_TAB,
        id: 1
      })
    ).to.eql(expectedState);
  });

  it('should toggle selected attribute on channel', () => {
    const state = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2'
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2'
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    const expectedState = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1',
          selected: true
        },
        2: {
          id: 2,
          name: 'Channel 2'
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2'
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: TOGGLE_SELECTED_CHANNEL,
        id: 1
      })
    ).to.eql(expectedState);
  });

  it('should toggle selected attribute on story', () => {
    const state = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2'
        }
      },
      storiesById: {
        1: {
          id: 1,
          permId: 1,
          name: 'Story 1'
        },
        2: {
          id: 2,
          permId: 2,
          name: 'Story 2'
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2'
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    const expectedState = {
      ...initialState,
      channelsById: {
        1: {
          id: 1,
          name: 'Channel 1'
        },
        2: {
          id: 2,
          name: 'Channel 2'
        }
      },
      storiesById: {
        1: {
          id: 1,
          permId: 1,
          name: 'Story 1',
          selected: true
        },
        2: {
          id: 2,
          permId: 2,
          name: 'Story 2'
        }
      },
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          channels: [1, 2],
          channelsLoading: false,
          channelsComplete: true,
          channelsError: null
        },
        2: {
          id: 2,
          name: 'Tab 2'
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: TOGGLE_SELECTED_STORY,
        id: 1
      })
    ).to.eql(expectedState);
  });

  it('should toggle selected on tab and remove selected from all other tabs', () => {
    const state = {
      ...initialState,
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1'
        },
        2: {
          id: 2,
          name: 'Tab 2',
          selected: true
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    const expectedState = {
      ...initialState,
      tabsById: {
        1: {
          id: 1,
          name: 'Tab 1',
          selected: true
        },
        2: {
          id: 2,
          name: 'Tab 2',
          selected: false
        }
      },
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: SELECT_SINGLE_TAB,
        id: 1
      })
    ).to.eql(expectedState);
  });
});
