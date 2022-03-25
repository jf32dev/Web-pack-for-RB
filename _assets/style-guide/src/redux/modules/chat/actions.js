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
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import { initSocket } from './helpers';

/**
 * Action Types
 */
export const OPEN_SOCKET = 'chat/OPEN_SOCKET';
export const CONNECT_REQUEST = 'chat/CONNECT_REQUEST';
export const CONNECT_ERROR = 'chat/CONNECT_ERROR';

export const BIND_REQUEST = 'chat/BIND_REQUEST';
export const BIND_SUCCESS = 'chat/BIND_SUCCESS';
export const BIND_ERROR = 'chat/BIND_ERROR';

export const RECEIVED_MESSAGE = 'chat/RECEIVED_MESSAGE';
export const RECEIVED_MESSAGE_ACK = 'chat/RECEIVED_MESSAGE_ACK';
export const SEND_MESSAGE = 'chat/SEND_MESSAGE';

export const RECEIVED_PRESENCE = 'chat/RECEIVED_PRESENCE';
export const RECEIVED_PRESENCE_BATCH = 'chat/RECEIVED_PRESENCE_BATCH';
export const SEND_PRESENCE = 'chat/SEND_PRESENCE';

export const CREATE_ROOM_REQUEST = 'chat/CREATE_ROOM_REQUEST';
export const CREATE_ROOM_RESPONSE = 'chat/CREATE_ROOM_RESPONSE';

export const RECEIVED_CALL_INVITATION = 'chat/RECEIVED_CALL_INVITATION';
export const SEND_CALL_INVITATION = 'chat/SEND_CALL_INVITATION';
export const ACKNOWLEDGE_CALL_INVITATION = 'chat/ACKNOWLEDGE_CALL_INVITATION';
export const ACCEPT_CALL_INVITATION = 'chat/ACCEPT_CALL_INVITATION';
export const ACCEPT_CALL_RESPONSE = 'chat/ACCEPT_CALL_RESPONSE';
export const CALL_INVITE_RESPONSE = 'chat/CALL_INVITE_RESPONSE';
export const DECLINE_CALL_INVITATION = 'chat/DECLINE_CALL_INVITATION';
export const DISCONNECT_CALL = 'chat/DISCONNECT_CALL';
export const DISCONNECT_CALL_RESPONSE = 'chat/DISCONNECT_CALL_RESPONSE';

export const RECEIVED_CALL_INVITATION_STATUS = 'chat/RECEIVED_CALL_INVITATION_STATUS';
export const RECEIVED_CALL_PARTICIPANT_STATUS = 'chat/RECEIVED_CALL_PARTICIPANT_STATUS';

export const TYPE_ERROR = 'chat/TYPE_ERROR';
export const DISCONNECT_REQUEST = 'chat/DISCONNECT_REQUEST';

export const ROSTER_REQUEST = 'chat/ROSTER_REQUEST';
export const ROSTER_RESPONSE = 'chat/ROSTER_RESPONSE';

export const SET_ACTIVE_RECIPIENT = 'chat/SET_ACTIVE_RECIPIENT';
export const SET_PREVIOUS_RECIPIENT = 'chat/SET_PREVIOUS_RECIPIENT';
export const MESSAGES_READ = 'chat/MESSAGES_READ';
export const SET_MESSAGE_BODY = 'chat/SET_MESSAGE_BODY';
export const SET_ROOM_SUBSCRIBED = 'chat/SET_ROOM_SUBSCRIBED';
export const TOGGLE_PIN = 'chat/TOGGLE_PIN';
export const NEW_RECIPIENT = 'chat/NEW_RECIPIENT';
export const CLEAR_LAST_MESSAGE = 'chat/CLEAR_LAST_MESSAGE';
export const SET_OPENTOK_SUPPORTED = 'chat/SET_OPENTOK_SUPPORTED';
export const SET_DEVICES = 'chat/SET_DEVICES';

export const LOAD_STORY = 'chat/LOAD_STORY';
export const LOAD_STORY_SUCCESS = 'chat/LOAD_STORY_SUCCESS';
export const LOAD_STORY_FAIL = 'chat/LOAD_STORY_FAIL';

export const LOAD_FILE = 'chat/LOAD_FILE';
export const LOAD_FILE_SUCCESS = 'chat/LOAD_FILE_SUCCESS';
export const LOAD_FILE_FAIL = 'chat/LOAD_FILE_FAIL';

/**
 * Action Creators
 */

// Initialises WebSocket and requests
// a connection to the chat server
export function openSocket(accessToken, bearerId, server, store) {
  // Initialise WebSocket
  if (accessToken && bearerId && server && store) {
    initSocket(accessToken, bearerId, server, store);
  }

  return {
    type: OPEN_SOCKET
  };
}

export function connectRequest(accessToken, bearerId) {
  // connect request JSON
  const data = {
    messageType: 0,
    data: {
      'accessToken': accessToken,
      'from': bearerId,  // userId@companyId
      'version': '2.1.0' // we now support PresenceBatch
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: CONNECT_REQUEST,
    data: data
  };
}

export function connectError(err) {
  return {
    type: CONNECT_ERROR,
    error: err
  };
}

// Bind request is made automatically
// after a successful connection response
export function bindRequest(bindId, resource, lastUpdate) {
  // bind request JSON
  const data = {
    messageType: 5,
    data: {
      extension: 'bind',
      id: bindId,  // must be string
      data: {
        resource: resource,  // unique string per device
        lastupdate: lastUpdate  // unix timestamp in nanoseconds
      },
      type: 'set'
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: BIND_REQUEST,
    data: data
  };
}

export function bindSuccess(data) {
  return {
    type: BIND_SUCCESS,
    data: data
  };
}

export function bindError(err) {
  return {
    type: BIND_ERROR,
    error: err
  };
}

export function rosterRequest() {
  // roster request JSON
  const data = {
    messageType: 5,
    data: {
      extension: 'query',
      id: '2',  // must be string
      data: {
        data: {
          ver: ''  // stored local version
        },
        element: 'roster'
      },
      type: 'get'
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: ROSTER_REQUEST,
    data: data
  };
}

export function rosterResponse(data) {
  return {
    type: ROSTER_RESPONSE,
    data: data
  };
}

export function receivedMessage(data) {
  return {
    type: RECEIVED_MESSAGE,
    data: data
  };
}

export function receivedMessageAck(data) {
  return {
    type: RECEIVED_MESSAGE_ACK,
    data: data
  };
}

export function sendMessage({ id, bearerId, toBearerId, type, messageBody }) {
  const data = {
    messageType: 3,
    data: {
      id: JSON.stringify(id),  // must be string
      from: bearerId,
      to: toBearerId,
      type: type,  // chat, hub-attachment
      body: messageBody
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: SEND_MESSAGE,
    data: data
  };
}

export function receivedPresence(data) {
  return {
    type: RECEIVED_PRESENCE,
    data: data
  };
}

export function receivedPresenceBatch(data) {
  return {
    type: RECEIVED_PRESENCE_BATCH,
    data: data
  };
}

export function sendPresence(priority = 100) {
  const data = {
    messageType: 4,
    data: {
      priority: priority   // % available (iOS always sends 100)
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: SEND_PRESENCE,
    data: data
  };
}

export function createRoomRequest({ id, bearerId, calltype = 'video and audio' }, inviteUserId) {
  const data = {
    messageType: 5,
    data: {
      type: 'set',
      id: JSON.stringify(id),  // must be string
      from: bearerId,
      extension: 'query',
      data: {
        element: 'videochat#create',
        data: {
          calltype: calltype
        }
      }
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: CREATE_ROOM_REQUEST,
    data: data,
    inviteUserId: inviteUserId
  };
}

export function createRoomResponse(data) {
  return {
    type: CREATE_ROOM_RESPONSE,
    data: data
  };
}

export function receivedCallInvitation(data) {
  return {
    type: RECEIVED_CALL_INVITATION,
    data: data
  };
}

export function sendCallInvitation({ id, bearerId, roomId, invitees = [] }) {
  const data = {
    messageType: 5,
    data: {
      type: 'set',
      id: JSON.stringify(id),  // must be string
      from: bearerId,
      extension: 'query',
      data: {
        element: 'videochat#invite',
        data: {
          roomid: roomId,
          invitees: invitees  // array of bearerIds
        }
      }
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: SEND_CALL_INVITATION,
    data: data
  };
}

export function acknowledgeCallInvitation({ id, roomId }) {
  const data = {
    messageType: 6,
    data: {
      type: 'result',
      id: JSON.stringify(id),  // must be string
      extension: 'query',
      data: {
        element: 'videochat#invitation',
        data: {
          roomid: roomId,
          invitationid: ''
        }
      }
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: ACKNOWLEDGE_CALL_INVITATION,
    data: data
  };
}

export function acceptCallInvitation({ id, bearerId, roomId, token }) {
  const data = {
    messageType: 5,
    data: {
      type: 'set',
      from: bearerId,
      id: JSON.stringify(id),  // must be string
      extension: 'query',
      data: {
        element: 'videochat#accept',
        data: {
          roomid: roomId,
          joinToken: token
        }
      }
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: ACCEPT_CALL_INVITATION,
    data: data
  };
}

export function acceptCallResponse(data) {
  return {
    type: ACCEPT_CALL_RESPONSE,
    data: data
  };
}

export function callInviteResponse(data) {
  return {
    type: CALL_INVITE_RESPONSE,
    data: data
  };
}

export function declineCallInvitation({ id, bearerId, roomId }) {
  const data = {
    messageType: 5,
    data: {
      type: 'set',
      from: bearerId,
      id: JSON.stringify(id),  // must be string
      extension: 'query',
      data: {
        element: 'videochat#decline',
        data: {
          roomid: roomId
        }
      }
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: DECLINE_CALL_INVITATION,
    data: data
  };
}

export function disconnectCall({ id, bearerId, roomId }) {
  const data = {
    messageType: 5,
    data: {
      type: 'set',
      from: bearerId,
      id: JSON.stringify(id),  // must be string
      extension: 'query',
      data: {
        element: 'videochat#disconnect',
        data: {
          roomid: roomId
        }
      }
    }
  };

  if (window.socket) {
    window.socket.send(JSON.stringify(data));
  }

  return {
    type: DISCONNECT_CALL,
    data: data
  };
}

export function disconnectCallResponse(data) {
  return {
    type: DISCONNECT_CALL_RESPONSE,
    data: data
  };
}

export function receivedCallInvitationStatus(data) {
  return {
    type: RECEIVED_CALL_INVITATION_STATUS,
    data: data
  };
}

export function receivedCallParticipantStatus(data) {
  return {
    type: RECEIVED_CALL_PARTICIPANT_STATUS,
    data: data
  };
}

export function typeError(err) {
  return {
    type: TYPE_ERROR,
    error: err
  };
}

export function disconnect() {
  const data = {
    messageType: 2,
    data: {
      id: null
    }
  };

  if (window.socket) {
    if (window.socket.readyState === 1) {
      window.socket.send(JSON.stringify(data));
    }
    window.socket.close();
  }

  return {
    type: DISCONNECT_REQUEST,
    data: data
  };
}

export function setActiveRecipient(id) {
  return {
    type: SET_ACTIVE_RECIPIENT,
    data: { id: id }
  };
}

export function setPreviousRecipient(id) {
  return {
    type: SET_PREVIOUS_RECIPIENT,
    data: { id: id }
  };
}

export function messagesRead(id) {
  return {
    type: MESSAGES_READ,
    data: { id: id }
  };
}

export function newRecipient(id) {
  return {
    type: NEW_RECIPIENT,
    data: { id: id }
  };
}

export function clearLastMessage() {
  return {
    type: CLEAR_LAST_MESSAGE
  };
}

export function setMessageBody(userId, body) {
  return {
    type: SET_MESSAGE_BODY,
    data: {
      userId,
      body
    }
  };
}

export function setRoomSubscribed(roomId, isSubscribed) {
  return {
    type: SET_ROOM_SUBSCRIBED,
    data: {
      roomId,
      isSubscribed
    }
  };
}

export function togglePin(userId) {
  return {
    type: TOGGLE_PIN,
    data: {
      userId
    }
  };
}

export function setOpenTokSupported() {
  return {
    type: SET_OPENTOK_SUPPORTED
  };
}

/**
 * Available devices from OpenTok
 * https://tokbox.com/developer/sdks/js/reference/OT.html#getDevices
 */
export function setDevices(devices) {
  return {
    type: SET_DEVICES,
    devices
  };
}

export function getStory(permId) {
  return {
    types: [LOAD_STORY, LOAD_STORY_SUCCESS, LOAD_STORY_FAIL],
    id: permId,
    promise: (client) => client.get('/story/get', 'webapi', {
      params: {
        permId: permId
      }
    })
  };
}

export function getFile(id) {
  return {
    types: [LOAD_FILE, LOAD_FILE_SUCCESS, LOAD_FILE_FAIL],
    id: id,
    promise: (client) => client.get('/file/get', 'webapi', {
      params: {
        id: id
      }
    })
  };
}
