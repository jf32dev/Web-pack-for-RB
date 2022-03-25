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
import reducer, { initialState } from '../chat/reducer';

import {
  OPEN_SOCKET,
  CONNECT_REQUEST,
  CONNECT_ERROR,
  BIND_REQUEST,
  BIND_SUCCESS,
  BIND_ERROR,
  ROSTER_REQUEST,
  ROSTER_RESPONSE,
  RECEIVED_MESSAGE,
  RECEIVED_MESSAGE_ACK,
  SEND_MESSAGE,
  RECEIVED_PRESENCE,
  SEND_PRESENCE,
  TYPE_ERROR,
  DISCONNECT_REQUEST,
  SET_ACTIVE_RECIPIENT,
  MESSAGES_READ,
  NEW_RECIPIENT,

  openSocket,
  connectRequest,
  connectError,
  bindRequest,
  bindSuccess,
  bindError,
  rosterRequest,
  rosterResponse,
  receivedMessage,
  receivedMessageAck,
  sendMessage,
  receivedPresence,
  sendPresence,
  typeError,
  disconnect,
  setActiveRecipient,
  messagesRead,
  newRecipient
} from '../chat/actions';

/**
 * Action creator tests
 */
describe('chat actions', () => {
  it('should create an action to open socket', () => {
    const expectedAction = {
      type: OPEN_SOCKET
    };
    expect(openSocket()).to.eql(expectedAction);
  });

  it('should create an action to request connection', () => {
    const data = {
      messageType: 0,
      data: {
        'accessToken': 'fakeToken',
        'from': '1@1',
        'version': ''
      }
    };

    const expectedAction = {
      type: CONNECT_REQUEST,
      data: data
    };
    expect(connectRequest('fakeToken', '1@1')).to.eql(expectedAction);
  });

  it('should create an action to handle connect error', () => {
    const expectedAction = {
      type: CONNECT_ERROR,
      error: 'test'
    };
    expect(connectError('test')).to.eql(expectedAction);
  });

  it('should create an action to request bind', () => {
    const data = {
      messageType: 5,
      data: {
        extension: 'bind',
        id: '1',
        data: {
          resource: 'webapp',
          lastupdate: 0
        },
        type: 'set'
      }
    };

    const expectedAction = {
      type: BIND_REQUEST,
      data: data
    };
    expect(bindRequest('1', 0)).to.eql(expectedAction);
  });

  it('should create an action to bind success', () => {
    const expectedAction = {
      type: BIND_SUCCESS,
      data: 'test'
    };
    expect(bindSuccess('test')).to.eql(expectedAction);
  });

  it('should create an action to bind error', () => {
    const expectedAction = {
      type: BIND_ERROR,
      error: 'test'
    };
    expect(bindError('test')).to.eql(expectedAction);
  });

  it('should create an action to request roster', () => {
    const data = {
      messageType: 5,
      data: {
        extension: 'query',
        id: '2',
        data: {
          data: {
            ver: ''
          },
          element: 'roster'
        },
        type: 'get'
      }
    };

    const expectedAction = {
      type: ROSTER_REQUEST,
      data: data
    };
    expect(rosterRequest()).to.eql(expectedAction);
  });

  it('should create an action to receive roster', () => {
    const expectedAction = {
      type: ROSTER_RESPONSE,
      data: 'test'
    };
    expect(rosterResponse('test')).to.eql(expectedAction);
  });

  it('should create an action to receive message', () => {
    const expectedAction = {
      type: RECEIVED_MESSAGE,
      data: 'test'
    };
    expect(receivedMessage('test')).to.eql(expectedAction);
  });

  it('should create an action to receive message acknowledgement', () => {
    const expectedAction = {
      type: RECEIVED_MESSAGE_ACK,
      data: 'test'
    };
    expect(receivedMessageAck('test')).to.eql(expectedAction);
  });

  it('should create an action to send message', () => {
    const testMessage = {
      id: 1,
      bearerId: '1@1',
      toBearerId: '2@1',
      type: 'chat',
      messageBody: 'testing'
    };

    const data = {
      messageType: 3,
      data: {
        id: JSON.stringify(testMessage.id),
        from: testMessage.bearerId,
        to: testMessage.toBearerId,
        type: testMessage.type,
        body: testMessage.messageBody
      }
    };

    const expectedAction = {
      type: SEND_MESSAGE,
      data: data
    };
    expect(sendMessage(testMessage)).to.eql(expectedAction);
  });

  it('should create an action to receive presence', () => {
    const data = 100;

    const expectedAction = {
      type: RECEIVED_PRESENCE,
      data: data
    };
    expect(receivedPresence(data)).to.eql(expectedAction);
  });

  it('should create an action to send presence', () => {
    const data = {
      messageType: 4,
      data: {
        priority: 100
      }
    };

    const expectedAction = {
      type: SEND_PRESENCE,
      data: data
    };
    expect(sendPresence(100)).to.eql(expectedAction);
  });

  it('should create an action to handle typeError', () => {
    const expectedAction = {
      type: TYPE_ERROR,
      error: 'Test error'
    };
    expect(typeError('Test error')).to.eql(expectedAction);
  });

  it('should create an action to disconnect', () => {
    const data = {
      messageType: 2,
      data: {
        id: null
      }
    };

    const expectedAction = {
      type: DISCONNECT_REQUEST,
      data: data
    };
    expect(disconnect(data)).to.eql(expectedAction);
  });

  it('should create an action to set active recipient', () => {
    const expectedAction = {
      type: SET_ACTIVE_RECIPIENT,
      data: { id: 1 }
    };
    expect(setActiveRecipient(1)).to.eql(expectedAction);
  });

  it('should create an action to reset unreadCount', () => {
    const expectedAction = {
      type: MESSAGES_READ,
      data: { id: 1 }
    };
    expect(messagesRead(1)).to.eql(expectedAction);
  });

  it('should create an action to create a new recipient', () => {
    const expectedAction = {
      type: NEW_RECIPIENT,
      data: { id: 1 }
    };
    expect(newRecipient(1)).to.eql(expectedAction);
  });
});

/**
 * Reducer tests
 */
describe('chat reducer', () => {
  it('should set connecting and bearerId', () => {
    const bearerId = '201@22';

    const data = {
      messageType: 0,
      data: {
        'accessToken': 'faketoken',
        'from': bearerId,
        'version': ''
      }
    };

    const expectedState = {
      ...initialState,
      bearerId: bearerId,
      connected: false,
      connecting: true
    };

    expect(
      reducer(initialState, {
        type: CONNECT_REQUEST,
        data: data,
      })
    ).to.eql(expectedState);
  });

  it('should set connecting error', () => {
    const expectedState = {
      ...initialState,
      connecting: false,
      error: { message: 'Test error' }
    };

    expect(
      reducer(initialState, {
        type: CONNECT_ERROR,
        error: { message: 'Test error' }
      })
    ).to.eql(expectedState);
  });

  it('should set bindId and lastUpdate', () => {
    const data = {
      messageType: 5,
      data: {
        extension: 'bind',
        id: 'bindId',
        data: {
          resource: 'webapp',
          lastupdate: 0
        },
        type: 'set'
      }
    };

    const expectedState = {
      ...initialState,
      bindId: 'bindId',
      lastUpdate: 0
    };

    expect(
      reducer(initialState, {
        type: BIND_REQUEST,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set connected', () => {
    const expectedState = {
      ...initialState,
      connected: true
    };

    expect(
      reducer(initialState, {
        type: BIND_SUCCESS
      })
    ).to.eql(expectedState);
  });

  it('should set bind error', () => {
    const expectedState = {
      ...initialState,
      connected: false,
      error: { message: 'Test error' }
    };

    expect(
      reducer(initialState, {
        type: BIND_ERROR,
        error: { message: 'Test error' }
      })
    ).to.eql(expectedState);
  });

  it('should set rosterLoading', () => {
    const data = {
      messageType: 5,
      data: {
        extension: 'query',
        id: '2',
        data: {
          data: {
            ver: ''
          },
          element: 'roster'
        },
        type: 'get'
      }
    };

    const expectedState = {
      ...initialState,
      rosterLoading: true,
      rosterLoaded: false
    };

    expect(
      reducer(initialState, {
        type: ROSTER_REQUEST,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set usersById on roster response', () => {
    // roster response
    const data = {
      'messageType': 6,
      'data': {
        'id': '2',
        'type': 'result',
        'extension': 'query',
        'data': {
          'element': 'roster',
          'data': {
            'ver': '42',
            'items': [
              {
                'id': '1@1',
                'name': 'Test User'
              }
            ],
            'rooms': []
          }
        }
      }
    };

    const expectedState = {
      ...initialState,
      rosterLoading: false,
      rosterLoaded: true,
      usersById: {
        1: {
          id: 1,
          name: 'Test User',
          type: 'people',
          presence: 0
        }
      }
    };

    expect(
      reducer(initialState, {
        type: ROSTER_RESPONSE,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set lastMessage, unreadCount messagesByRecipientId & usersById on offline message received', () => {
    // Sample offline message data
    // from chat server
    const data = {
      'messageType': 3,
      'data': {
        'id': '',
        'from': '2@1',
        'to': '',
        'type': 'chat',
        'body': 'Offline message',
        'sent': {
          'delay': 1459376786,
          'type': 3,
          'data': {
            'id': '6',
            'from': '2@1/webapp',
            'to': '1@1',
            'type': 'chat',
            'body': 'offline test message',
            'timestamp': 1459376786579332053
          }
        }
      }
    };

    // parsed offline message
    const newMsg = {
      id: 6,
      body: 'offline test message',
      delay: parseInt(1459376786 / 1000000, 10),
      received: false,
      sent: true,
      status: 'offline',
      time: parseInt(1459376786579332053 / 1000000, 10),
      type: 'chat',
      user: 1
    };

    const expectedState = {
      ...initialState,
      lastMessage: newMsg,
      unreadCount: 0,
      messagesByRecipientId: {
        1: [newMsg]
      },
      usersById: {}
    };

    expect(
      reducer(initialState, {
        type: RECEIVED_MESSAGE,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set lastMessage, unreadCount messagesByRecipientId & usersById on online message received', () => {
    // Sample online message data
    // from chat server
    const data = {
      'messageType': 3,
      'data': {
        'id': '6',
        'from': '2@1/webapp',
        'type': 'chat',
        'body': 'online test message',
        'timestamp': 1459376786579332053
      }
    };

    // parsed online message
    const newMsg = {
      id: 6,
      body: 'online test message',
      received: true,
      status: 'online',
      time: parseInt(1459376786579332053 / 1000000, 10),
      type: 'chat',
      user: 2
    };

    const expectedState = {
      ...initialState,
      lastMessage: newMsg,
      unreadCount: 1,
      messagesByRecipientId: {
        2: [newMsg]
      },
      usersById: {
        2: {
          unreadCount: 1
        }
      }
    };

    expect(
      reducer(initialState, {
        type: RECEIVED_MESSAGE,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set messagesByRecipientId on message send', () => {
    const data = {
      messageType: 3,
      data: {
        id: 1,
        from: '1@1',
        to: '2@1',
        type: 'chat',
        body: 'test message'
      }
    };

    const expectedState = {
      ...initialState,
      messagesByRecipientId: {
        2: [{
          id: 1,
          body: 'test message',
          sent: true,
          time: Date.now(),
          type: 'chat',
          user: 2
        }]
      }
    };

    expect(
      reducer(initialState, {
        type: SEND_MESSAGE,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set usersById on presence received', () => {
    // example presense
    const data = {
      data: {
        from: '1@1',
        priority: '100'
      }
    };

    const testInitialState = {
      ...initialState,
      usersById: {
        1: {
          name: 'Tester 1'
        }
      }
    };

    const expectedState = {
      ...initialState,
      usersById: {
        1: {
          name: 'Tester 1',
          presence: '100'
        }
      }
    };

    expect(
      reducer(testInitialState, {
        type: RECEIVED_PRESENCE,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set presence', () => {
    const data = {
      data: {
        priority: 100
      }
    };

    const expectedState = {
      ...initialState,
      presence: 100
    };

    expect(
      reducer(initialState, {
        type: SEND_PRESENCE,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set error', () => {
    const data = {
      data: {
        condition: 'Test error'
      }
    };

    const expectedState = {
      ...initialState,
      error: 'Test error'
    };

    expect(
      reducer(initialState, {
        type: TYPE_ERROR,
        error: data
      })
    ).to.eql(expectedState);
  });

  it('should set initialState', () => {
    const testInitialState = {
      ...initialState,
      connected: true
    };

    const expectedState = {
      ...initialState
    };

    expect(
      reducer(testInitialState, {
        type: DISCONNECT_REQUEST
      })
    ).to.eql(expectedState);
  });

  it('should set active recipient', () => {
    const data = {
      id: 1
    };

    const expectedState = {
      ...initialState,
      activeRecipientId: 1
    };

    expect(
      reducer(initialState, {
        type: SET_ACTIVE_RECIPIENT,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should set unreadCount to zero by userId', () => {
    const data = {
      id: 1
    };

    const testInitialState = {
      ...initialState,
      usersById: {
        1: {
          id: 1,
          name: 'Test User',
          type: 'people',
          presence: 0,
          unreadCount: 2
        }
      }
    };

    const expectedState = {
      ...initialState,
      usersById: {
        1: {
          id: 1,
          name: 'Test User',
          type: 'people',
          presence: 0,
          unreadCount: 0
        }
      }
    };

    expect(
      reducer(testInitialState, {
        type: MESSAGES_READ,
        data: data
      })
    ).to.eql(expectedState);
  });


  it('should create an empty messages array for a new recipient', () => {
    const data = {
      id: 1
    };

    const expectedState = {
      ...initialState,
      messagesByRecipientId: {
        1: []
      }
    };

    expect(
      reducer(initialState, {
        type: NEW_RECIPIENT,
        data: data
      })
    ).to.eql(expectedState);
  });
});
