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
 * @package btca-client
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

/* eslint-disable */

function getBodyHeight() {
  var body = window.document.body;
  var html = window.document.documentElement;

  var height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  return height || 300;
}

function handleGetStoryResponse(result, responseId, error) {
  var message = document.getElementById('message');
  if (error) {
    message.innerText = JSON.stringify(error, null, '  ');
    message.className = 'error';
    return;
  }

  if (result.title) {
    document.title = result.title;
  }
  if (result.message) {
    message.insertAdjacentHTML('beforeend', result.message);
  }

  // Send the page height to parent
  sendBodyHeight();

  // Attach normal event handlers to story message
  BTCA.createEvents();

  // Send body height on each img load
  var images = document.body.getElementsByTagName('img');
  Array.prototype.forEach.call(images, function(img) {
    img.addEventListener('load', function(event) {
      sendBodyHeight();
    });
  });
}

function handleGetSystemConfigResponse(result, responseId, error) {
  if (error) {
    console.log(error);
    return;
  }

  // Set baseColor css
  var baseColor = result.mainThemeHexColor || '#F26724';
  var customStyles = 'a{color:' + baseColor + '}'
  var style = document.createElement('style');
  style.innerText = customStyles;
  document.head.appendChild(style);
}

function getStory(permId) {
  var data = {
    action: 'getStoryDescription',
    params: {
      id: permId
    }
  };
  BTCA.send(data, handleGetStoryResponse);
}

function getSystemConfig() {
  var data = {
    action: 'getSystemConfig'
  };
  BTCA.send(data, handleGetSystemConfigResponse);
}

function sendBodyHeight() {
  var h = getBodyHeight();
  var data = {
    action: 'storyDescriptionHeight',
    params: {
      height: h,
      permId: BTCA.params.permId
    }
  }
  BTCA.send(data, function(result, requestId, error) {
    if (error) {
      console.log(error);
    }
  });
}

function sendScrollTo(offsetTop) {
  var data = {
    action: 'storyDescriptionScrollTo',
    params: {
      offsetTop: offsetTop
    }
  }
  BTCA.send(data, function (result, requestId, error) {
    if (error) {
      console.log(error);
    }
  });
}

// Initialise BTCA
var BTCA = new BTCAClient({
  handle: 'STORY_DESCRIPTION'
});

// Wait for window to load to prevent events firing before ready
window.addEventListener('load', function() {
  getStory();
  getSystemConfig();
});
