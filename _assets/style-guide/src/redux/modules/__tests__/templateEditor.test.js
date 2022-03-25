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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import { expect } from 'chai';
import reducer, {
  initialState,
  OPEN_TEMPLATE,
  CLEAR_TEMPLATE,
  EDIT_NAME,
  TOGGLE_MODULE_EDIT
} from '../templateEditor';

const testTemplate = {
  name: 'Test Template',
  items: [
    {
      'i': 'featured-stories',
      'layout': {
        'x': 0,
        'y': 0,
        'h': 4.25,
        'w': 12
      },
      'type': 'featured',
      'title': '',
      'source': '',
      'limit': 10,
      'grid': false
    },
    {
      'i': 'top-stories',
      'layout': {
        'x': 0,
        'y': 4.25,
        'h': 5,
        'w': 4
      },
      'type': 'story',
      'title': 'Top Stories',
      'source': 'top',
      'limit': 6,
      'grid': false
    }
  ]
};

/**
 * Reducer tests
 */
describe('templateEditor reducer', () => {
  it('should handle empty data', () => {
    const emptyTemplate = {
      name: 'empty template',
      items: []
    };

    const expectedState = {
      name: 'empty template',
      items: [],
      itemsById: {}
    };

    expect(
      reducer(initialState, {
        type: OPEN_TEMPLATE,
        data: emptyTemplate
      })
    ).to.eql(expectedState);
  });

  it('should normalize template data', () => {
    const items = testTemplate.items;
    const expectedState = {
      name: 'Test Template',
      items: [items[0].i, items[1].i],
      itemsById: {
        [items[0].i]: items[0],
        [items[1].i]: items[1]
      }
    };

    expect(
      reducer(initialState, {
        type: OPEN_TEMPLATE,
        data: testTemplate,
      })
    ).to.eql(expectedState);
  });

  it('should clear template data', () => {
    const items = testTemplate.items;
    const populatedState = {
      name: 'Test Template',
      items: [items[0].i, items[1].i],
      itemsById: {
        [items[0].i]: items[0],
        [items[1].i]: items[1]
      }
    };

    expect(
      reducer(populatedState, {
        type: CLEAR_TEMPLATE
      })
    ).to.eql(initialState);
  });

  it('should edit name', () => {
    expect(
      reducer(initialState, {
        type: EDIT_NAME,
        name: 'edited name'
      })
    ).to.eql({
      ...initialState,
      name: 'edited name'
    });
  });

  it('should toggle item edit mode and clear other items edit mode', () => {
    const editItemState = {
      name: 'Test Template',
      items: ['featured-stories', 'top-stories'],
      itemsById: {
        'featured-stories': {
          'i': 'featured-stories',
          'layout': {
            'x': 0,
            'y': 0,
            'h': 4.25,
            'w': 12
          },
          'type': 'featured',
          'title': '',
          'source': '',
          'limit': 10,
          'grid': false,
          'edit': true
        },
        'top-stories': {
          'i': 'top-stories',
          'layout': {
            'x': 0,
            'y': 4.25,
            'h': 5,
            'w': 4
          },
          'type': 'story',
          'title': 'Top Stories',
          'source': 'top',
          'limit': 6,
          'grid': false,
          'edit': false
        }
      }
    };

    const expectedState = {
      name: 'Test Template',
      items: ['featured-stories', 'top-stories'],
      itemsById: {
        'featured-stories': {
          'i': 'featured-stories',
          'layout': {
            'x': 0,
            'y': 0,
            'h': 4.25,
            'w': 12
          },
          'type': 'featured',
          'title': '',
          'source': '',
          'limit': 10,
          'grid': false,
          'edit': false
        },
        'top-stories': {
          'i': 'top-stories',
          'layout': {
            'x': 0,
            'y': 4.25,
            'h': 5,
            'w': 4
          },
          'type': 'story',
          'title': 'Top Stories',
          'source': 'top',
          'limit': 6,
          'grid': false,
          'edit': true
        }
      }
    };

    expect(
      reducer(editItemState, {
        type: TOGGLE_MODULE_EDIT,
        id: 'top-stories'
      })
    ).to.eql(expectedState);
  });
});
