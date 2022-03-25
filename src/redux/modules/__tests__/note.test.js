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

  close,

  LOAD_NOTE,
  ADD_NOTE,
  DELETE_NOTES,
  CLOSE,
  LOG,

} from '../note';

const testNote = {
  ...initialState,
  id: 123,
  title: '204 Clarence St, Sydney NSW 2000, Australia',
  indexFile: '0b234c56-9037-477b-b2f9-addb4cdc3880',
  storyPermId: 334,
  files: '[{"category":"web","filename":"951f59a3698efcb6f24db4c1b17f1b8eb709c4a57c24c76f141c6089c5942624.html","identifier":"24ee0182-51fc-455e-9836-db5a0f826ad6","url":"https://push.bigtincan.org/f/Dm9jEkGXJpW6KRWbN5O0/upload/951f59a3698efcb6f24db4c1b17f1b8eb709c4a57c24c76f141c6089c5942624.html","size":18}]',
  requestId: 'ab7e9ec0-d2fb-44c7-afcf-1b5c88f05edd'
};

describe('note reducer actions', () => {
  it('should clean note state', () => {
    const expectedAction = {
      type: CLOSE,
    };
    expect(close()).to.eql(expectedAction);
  });
});

describe('note reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should set note data', () => {
    const expectedState = {
      ...testNote,
      adding: true,
      added: false
    };
    expect(
      reducer(testNote, {
        type: ADD_NOTE,
      })
    ).to.eql(expectedState);
  });

  it('should load note data', () => {
    const expectedState = {
      ...initialState,
      loading: true,
      loaded: false
    };
    expect(
      reducer(initialState, {
        type: LOAD_NOTE,
      })
    ).to.eql(expectedState);
  });

  it('should delete note data', () => {
    const expectedState = {
      ...testNote,
      deleting: true,
      deleted: false
    };

    expect(
      reducer(testNote, {
        type: DELETE_NOTES,
      })
    ).to.eql(expectedState);
  });

  it('should log note data', () => {
    const expectedState = {
      ...testNote,
      logging: true,
      logged: false
    };
    expect(
      reducer(testNote, {
        type: LOG,
      })
    ).to.eql(expectedState);
  });
});
