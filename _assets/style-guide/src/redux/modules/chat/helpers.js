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

// https://bigtincan.atlassian.net/wiki/display/HS/Chat+Server+API

import {
  connectRequest,
  connectError,

  bindRequest,
  bindSuccess,
  bindError,

  rosterRequest,
  rosterResponse,

  receivedMessage,
  receivedMessageAck,

  receivedPresence,
  receivedPresenceBatch,
  sendPresence,

  createRoomResponse,

  receivedCallInvitation,
  receivedCallInvitationStatus,
  receivedCallParticipantStatus,

  acceptCallResponse,
  disconnectCallResponse,
  callInviteResponse,

  typeError,
  disconnect
} from './actions';

/**
 * Helpers functions to parse messages before reducer
 * consider using normalize
 */
// TODO

/**
 * Dispatches action to store
 * based on messageType
 */
function handleSocketMessage(store) {
  return function(event) {
    const message = JSON.parse(event.data);

    switch (message.messageType) {
      // ConnectResponse
      case 1: {
        const id = message.data.id;
        // unique string per session
        // e.g. webapp-1-1478085426780
        const resourceId = 'webapp-' + id + '-' + Date.now();

        // retrieve one week of history
        const lastUpdate = new Date();
        lastUpdate.setDate(lastUpdate.getDate() - 7);

        // pass bindId and lastUpdate (in nanoseconds)
        store.dispatch(bindRequest(id, resourceId, lastUpdate * 1000000));

        // set timeout in case of no bind response
        window.bindTimeout = window.setTimeout(function() {
          store.dispatch(bindError('Connection timed out'));
          window.socket.close();
        }, 45000);  // 45 seconds

        break;
      }
      // Message
      case 3:
        store.dispatch(receivedMessage(message));
        break;

      // Presence
      // Note that even though we support presence batch, we still
      // receive all presence updates after the initial set of values
      // as individual presence.
      case 4: {
        store.dispatch(receivedPresence(message));
        break;
      }

      // InfoQueryRequest
      case 5:
        if (message.data.extension === 'query') {
          // message acknowledged
          if (message.data.data.element === 'ack') {
            store.dispatch(receivedMessageAck(message));

          // video chat invitation
          } else if (message.data.data.element === 'videochat#invitation') {
            store.dispatch(receivedCallInvitation(message));

          // video chat invitationStatus change
          } else if (message.data.data.element === 'videochat#call-status' &&
                    message.data.data.data.changeevent.type === 'invitationStatus') {
            store.dispatch(receivedCallInvitationStatus(message));

          // video chat participantStatus change
          } else if (message.data.data.element === 'videochat#call-status' &&
                    message.data.data.data.changeevent.type === 'participantStatus') {
            store.dispatch(receivedCallParticipantStatus(message));

          // everything else
          } else {
            console.log('unhandled InfoQueryRequest: ' + message.data.id);
            console.log(message);
          }
        }
        break;

      // InfoQueryResponse
      case 6:
        // bind response
        if (message.data.extension === 'bind' && message.data.type === 'result') {
          window.clearTimeout(window.bindTimeout);
          store.dispatch(bindSuccess(message));
          store.dispatch(rosterRequest());
          store.dispatch(sendPresence());

        // roster response
        } else if (message.data.extension === 'query' &&
                  message.data.type === 'result' &&
                  message.data.data.element === 'roster') {
          store.dispatch(rosterResponse(message));

        // create room response
        } else if (message.data.extension === 'query' &&
                  message.data.type === 'result' &&
                  message.data.data.element === 'videochat#create') {
          store.dispatch(createRoomResponse(message));

        // accept call response
        } else if (message.data.extension === 'query' &&
                  message.data.type === 'result' &&
                  message.data.data.element === 'videochat#accept') {
          store.dispatch(acceptCallResponse(message));

        // disconnect call response
        } else if (message.data.extension === 'query' &&
                  message.data.type === 'result' &&
                  message.data.data.element === 'videochat#disconnect') {
          store.dispatch(disconnectCallResponse(message));

        // sent invitation response
        } else if (message.data.extension === 'query' &&
                  message.data.type === 'result' &&
                  message.data.data.element === 'videochat#invite') {
          store.dispatch(callInviteResponse(message));

        // everything else
        } else {
          console.log('unhandled InfoQueryResponse: ' + message.data.id);
          console.log(message);
        }

        break;

      // StreamError
      case 7:
        store.dispatch(typeError(message));
        break;

      // PresenceBatch
      // Note that this is only received for the initial set of
      // presence values when a client announces itself as available.
      // All changes after that will be received as individual presence.
      case 8:
        store.dispatch(receivedPresenceBatch(message));
        break;

      case 9:  // message types
        console.error('Unhandled message type: ' + message.messageType);
        console.log(message);
        break;
      default:
        break;
    }

    return null;
  };
}

/**
 * Web Socket event handlers
 */

function handleSocketOpen(store, accessToken, bearerId) {
  return function() {
    store.dispatch(connectRequest(accessToken, bearerId));
  };
}

function handleSocketError(store) {
  return function(err) {
    store.dispatch(connectError(err));
  };
}

function handleSocketClose(store) {
  return function() {
    store.dispatch(disconnect());
  };
}

/**
 * Initialise WebSocket and set up
 * onmessage handlers to dispatch
 * events to redux store
 */
export function initSocket(accessToken, bearerId, server, store) {
  window.socket = new WebSocket(server);

  // Socket event listeners
  window.socket.onopen = handleSocketOpen(store, accessToken, bearerId);
  window.socket.onerror = handleSocketError(store);
  window.socket.onmessage = handleSocketMessage(store);
  window.socket.onclose = handleSocketClose(store);
}


/**
 * Strips companyId from bearerId
 * @param  {[string]} bearerId userId@companyId
 * @return {[int]} userId
 */
export function bearerIdToId(bearerId) {
  return parseInt(bearerId.split('@')[0], 10);
}


/**
 * Helper functions
 */

// TODO: document data/fixedMessage structure
export function processOfflineOrForwardedMessage(data) {
  const key = data.sent ? 'sent' : 'received';
  const userKey = data.sent ? 'to' : 'from';
  const offline = data.body === 'Offline message';

  // Reject unknown type
  const type = data[key].data.type;
  if (!type) {
    console.info('unknown chat message');  // eslint-disable-line
    console.log(data);  // eslint-disable-line
  }

  const fixedMessage = {
    id: parseInt(data[key].data.id, 10),
    body: data[key].data.body,
    delay: parseInt(data[key].delay / 1000000, 10),
    received: key === 'received',
    sent: key === 'sent',
    status: offline ? 'offline' : 'online',
    time: parseInt(data[key].data.timestamp / 1000000, 10),
    type: type,
    user: parseInt(data[key].data[userKey].split('@')[0], 10)
  };

  // Keep reference to file/story id for attachments
  if (fixedMessage.type === 'hub-attachment') {
    const attachment = fixedMessage.body.split('/');
    const attachmentType = attachment[0];
    const attachmentId = attachment[1];

    // Body contents no longer needed
    fixedMessage.body = '';

    // File
    if (attachmentType.indexOf('StoryFile') > -1) {
      fixedMessage.file = parseInt(attachmentId, 10);
    // Story
    } else if (attachmentType.indexOf('StoryPermanent') > -1) {
      fixedMessage.story = parseInt(attachmentId, 10);
    }
  }
  return fixedMessage;
}

export function processOnlineMessage(data) {
  const fixedMessage = {
    id: parseInt(data.id, 10),
    body: data.body,
    received: true,
    status: 'online',
    time: parseInt(data.timestamp / 1000000, 10),
    type: data.type,
    user: parseInt(data.from.split('@')[0], 10)
  };

  // Keep reference to file/story id for attachments
  if (fixedMessage.type === 'hub-attachment') {
    const attachment = fixedMessage.body.split('/');
    const attachmentType = attachment[0];
    const attachmentId = attachment[1];

    // Body contents no longer needed
    fixedMessage.body = '';

    // File
    if (attachmentType.indexOf('StoryFile') > -1) {
      fixedMessage.file = parseInt(attachmentId, 10);
    // Story
    } else if (attachmentType.indexOf('StoryPermanent') > -1) {
      fixedMessage.story = parseInt(attachmentId, 10);
    }
  }

  return fixedMessage;
}

export function processCallInvitation(data) {
  const fixedMessage = {
    id: parseInt(data.id, 10),
    body: data.data.data.calltype,  // 'audio' or 'video and audio'
    received: true,
    roomid: data.data.data.roomid,
    status: 'incoming',
    time: Date.now(),
    token: data.data.data.token,
    type: 'call',
    user: parseInt(data.from.split('@')[0], 10)
  };

  return fixedMessage;
}

export function parseRoster(data) {
  return data.map(function(rosterUser) {
    return {
      id: bearerIdToId(rosterUser.id),
      name: rosterUser.name,
      type: 'people',
      presence: 0
    };
  });
}
