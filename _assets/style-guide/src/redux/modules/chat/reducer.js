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

import { Schema, arrayOf } from 'normalizr';
import {
  bearerIdToId,
  processCallInvitation,
} from './helpers';

/* Chat Action Types */
import {
  CONNECT_REQUEST,
  CONNECT_ERROR,
  BIND_REQUEST,
  BIND_SUCCESS,
  BIND_ERROR,
  ROSTER_REQUEST,
  ROSTER_RESPONSE,
  RECEIVED_MESSAGE_ACK,
  SEND_PRESENCE,
  CREATE_ROOM_REQUEST,
  CREATE_ROOM_RESPONSE,
  RECEIVED_CALL_INVITATION,
  SEND_CALL_INVITATION,
  RECEIVED_CALL_INVITATION_STATUS,
  RECEIVED_CALL_PARTICIPANT_STATUS,
  ACCEPT_CALL_INVITATION,
  ACCEPT_CALL_RESPONSE,
  CALL_INVITE_RESPONSE,
  DECLINE_CALL_INVITATION,
  DISCONNECT_CALL_RESPONSE,
  TYPE_ERROR,
  DISCONNECT_REQUEST,
  SET_PREVIOUS_RECIPIENT,
  CLEAR_LAST_MESSAGE,
  SET_ROOM_SUBSCRIBED,
  SET_OPENTOK_SUPPORTED,
  SET_DEVICES,
  LOAD_STORY,
  LOAD_STORY_SUCCESS,
  LOAD_STORY_FAIL,
  LOAD_FILE,
  LOAD_FILE_SUCCESS,
  LOAD_FILE_FAIL
} from './actions';

function generateSlug(entity) {
  return `${entity.user}-${entity.id}-${entity.time}`;
}

const userDefaults = {
  type: 'people',
  unreadCount: 0
};
const user = new Schema('users', { defaults: userDefaults });
const message = new Schema('messages', { idAttribute: generateSlug });

user.define({
  messages: arrayOf(message)
});

/**
 * Chat Reducer
 * Standalone reducer, manages it's own normalised entities
 */
export const initialState = {
  previousRecipientId: 0,
  bearerId: null,
  bindId: null,
  connected: false,
  connecting: false,
  error: null,
  presence: 'offline',
  rosterLoading: false,
  rosterLoaded: true,
  server: 'wss://chat.bigtincan.com:443/',

  openTokSupported: false,
  devices: [],
  audioSupported: false,
  videoSupported: false,

  // id of last sent/recieved message
  lastMessage: null,

  // Only one pendingRoom is allowed
  pendingRoom: null,

  // normalised data
  roomsById: {},
  filesById: {},
  storiesById: {}
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CONNECT_REQUEST:
      return {
        ...state,
        bearerId: action.data.data.from,
        connected: false,
        connecting: true,
        error: null
      };
    case CONNECT_ERROR:
      return {
        ...state,
        connected: false,
        connecting: false,
        error: action.error
      };
    case BIND_REQUEST:
      return {
        ...state,
        bindId: action.data.data.id,
        lastUpdate: action.data.data.data.lastupdate
      };
    case BIND_SUCCESS:
      return {
        ...state,
        connected: true,
        connecting: false
      };
    case BIND_ERROR:
      return {
        ...state,
        bindId: null,
        connected: false,
        connecting: false,
        error: action.error
      };
    case ROSTER_REQUEST:
      return {
        ...state,
        rosterLoading: true,
        rosterLoaded: false
      };
    case ROSTER_RESPONSE: {
      // User details are handled from entities.js
      //const rawRooms = action.data.data.data.data.rooms;

      return {
        ...state,
        rosterLoading: false,
        rosterLoaded: true
      };
    }

    /* Ignored: response only contains message ID which isn't neccessarily unique */
    case RECEIVED_MESSAGE_ACK: {
      return state;
    }

    case SEND_PRESENCE:
      return {
        ...state,
        presence: action.data.data.priority
      };

    case CREATE_ROOM_REQUEST: {
      const messageId = action.data.data.id;
      const type = action.data.data.data.data.calltype;
      const inviteUser = action.inviteUserId;

      // Save pending room so we know what was requested
      return {
        ...state,
        pendingRoom: {
          messageId: messageId,
          inviteUser: inviteUser,
          users: {
            [inviteUser]: {
              id: inviteUser,
              status: 'invited'
            }
          },
          status: 'empty',
          type: type  // 'audio' or 'video and audio'
        }
      };
    }
    case CREATE_ROOM_RESPONSE: {
      const { roomid, sessionid, token, rejoinToken } = action.data.data.data.data;

      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [roomid]: {
            ...state.roomsById[roomid],
            token: token,
            sessionId: sessionid,
            rejoinToken: rejoinToken
          }
        }
      };
    }

    case RECEIVED_CALL_INVITATION: {
      // Users and messages are updated on entities redux
      const rawData = action.data.data;
      const parsedMessage = processCallInvitation(rawData);

      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [parsedMessage.roomid]: {
            ...state.roomsById[parsedMessage.roomid],
            id: parsedMessage.roomid,
            token: parsedMessage.token,
            type: parsedMessage.body,
            inviteUser: parsedMessage.user,
            inviteMessage: parsedMessage.id,
            status: parsedMessage.status
          }
        }
      };
    }

    case SEND_CALL_INVITATION: {
      return state;
    }

    case RECEIVED_CALL_INVITATION_STATUS: {
      const changeevent = action.data.data.data.data.changeevent;
      const status = changeevent.data.status;
      const roomid = changeevent.data.roomid;

      // Current room and user who sent original invite
      //const room = state.roomsById[roomid];

      // Update invite message
      /*
      if (newMessages[room.inviteUser]) {
        const inviteMessageIndex = newMessages[room.inviteUser].findIndex(m => m.roomid === roomid);
        if (inviteMessageIndex > -1) {
          newMessages[room.inviteUser][inviteMessageIndex] = {
            ...newMessages[room.inviteUser][inviteMessageIndex],
            status: status,
            duration: Date.now() - newMessages[room.inviteUser][inviteMessageIndex].time
          };
        }
      }
      */

      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [roomid]: {
            ...state.roomsById[roomid],
            status: status
          }
        }
      };
    }

    case RECEIVED_CALL_PARTICIPANT_STATUS: {
      const changeevent = action.data.data.data.data.changeevent;
      const roomid = changeevent.data.roomid;
      const userid = bearerIdToId(changeevent.data.userid);
      const newstatus = changeevent.data.newstatus;

      // iOS sends disconnected status when putting call in background
      // ignore this status if currently subscribed to a stream
      if (newstatus === 'disconnected' && state.roomsById[roomid].isSubscribed) {
        return state;
      }

      // current user 'connected' response
      // received before CREATE_ROOM_RESPONSE
      // and after CREATE_ROOM_REQUEST
      if (state.pendingRoom) {
        return {
          ...state,
          pendingRoom: null,  // clear pending
          roomsById: {
            ...state.roomsById,
            [roomid]: {
              ...state.pendingRoom,  // merge pending
              id: roomid,
              users: {
                ...state.pendingRoom.users,
                [userid]: {
                  id: userid,
                  newstatus: newstatus
                }
              }
            }
          }
        };
      }

      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [roomid]: {
            ...state.roomsById[roomid],
            status: newstatus,  // for now, room status matches the only user status
            users: {
              ...state.roomsById[roomid].users,
              [userid]: {
                ...state.roomsById[roomid].users[userid],
                id: userid,
                status: newstatus
              }
            }
          }
        }
      };
    }

    case ACCEPT_CALL_INVITATION: {
      const fromId = bearerIdToId(action.data.data.from);
      const { roomid, joinToken } = action.data.data.data.data;

      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [roomid]: {
            ...state.roomsById[roomid],
            joinToken: joinToken,
            users: {
              [fromId]: { id: fromId }
            }
          }
        }
      };
    }
    case ACCEPT_CALL_RESPONSE: {
      const { roomid, sessionid, token, rejoinToken } = action.data.data.data.data;

      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [roomid]: {
            ...state.roomsById[roomid],
            sessionId: sessionid,
            token: token,
            rejoinToken: rejoinToken
          }
        }
      };
    }

    case CALL_INVITE_RESPONSE: {
      const { roomid, participantstatus } = action.data.data.data.data;
      const status = participantstatus[0].status;
      //const userid = bearerIdToId(participantstatus[0].userID);

      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [roomid]: {
            ...state.roomsById[roomid],
            status: status
          }
        }
      };
    }

    case DECLINE_CALL_INVITATION: {
      const { roomid } = action.data.data.data.data;
      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [roomid]: {
            ...state.roomsById[roomid],
            status: 'declined'
          }
        }
      };
    }

    case DISCONNECT_CALL_RESPONSE: {
      const { roomid } = action.data.data.data.data;

      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [roomid]: {
            ...state.roomsById[roomid],
            status: 'disconnected'
          }
        }
      };
    }

    case TYPE_ERROR:
      return {
        ...state,
        error: action.error.data.condition
      };
    case DISCONNECT_REQUEST:
      return {
        ...initialState
      };
    case SET_PREVIOUS_RECIPIENT:
      return {
        ...state,
        previousRecipientId: action.data.id
      };
    case CLEAR_LAST_MESSAGE:
      return {
        ...state,
        lastMessage: null
      };
    case SET_ROOM_SUBSCRIBED:
      return {
        ...state,
        roomsById: {
          ...state.roomsById,
          [action.data.roomId]: {
            ...state.roomsById[action.data.roomId],
            isSubscribed: action.data.isSubscribed
          }
        }
      };
    case SET_OPENTOK_SUPPORTED:
      return {
        ...state,
        openTokSupported: true
      };
    case SET_DEVICES: {
      const devices = action.devices;
      const audioSupported = devices.findIndex(d => d.kind === 'audioInput') > -1;
      const videoSupported = devices.findIndex(d => d.kind === 'videoInput') > -1;

      return {
        ...state,
        devices,
        audioSupported,
        videoSupported
      };
    }
    case LOAD_STORY:
      return {
        ...state,
        storiesById: { ...state.storiesById,
          [action.id]: {
            permId: action.id
          }
        }
      };
    case LOAD_STORY_SUCCESS:
      return {
        ...state,
        storiesById: { ...state.storiesById,
          [action.id]: {
            ...action.result
          }
        }
      };
    case LOAD_STORY_FAIL:
      return {
        ...state,
        storiesById: { ...state.storiesById,
          [action.id]: {
            ...state.storiesById[action.id],
            error: action.error
          }
        }
      };
    case LOAD_FILE:
      return {
        ...state,
        filesById: { ...state.filesById,
          [action.id]: {
            id: action.id
          }
        }
      };
    case LOAD_FILE_SUCCESS:
      return {
        ...state,
        filesById: { ...state.filesById,
          [action.id]: {
            ...action.result
          }
        }
      };

    case LOAD_FILE_FAIL:
      return {
        ...state,
        filesById: { ...state.filesById,
          [action.id]: {
            ...state.filesById[action.id],
            error: action.error
          }
        }
      };

    default:
      return state;
  }
}
