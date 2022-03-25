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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */

/** copy and modified from bigtincan-hub-ios/ThirdParty/froalaEditor/js/editor.js */
import { fabric } from 'fabric';

function getCanvasSize(c) {
  let maxWidth = 0;
  let maxHeight = 0;

  const objects = c.getObjects();
  if (objects !== null) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].oCoords.tl.y > maxHeight) maxHeight = objects[i].oCoords.tl.y;
      if (objects[i].oCoords.tr.y > maxHeight) maxHeight = objects[i].oCoords.tr.y;
      if (objects[i].oCoords.bl.y > maxHeight) maxHeight = objects[i].oCoords.bl.y;
      if (objects[i].oCoords.br.y > maxHeight) maxHeight = objects[i].oCoords.br.y;

      if (objects[i].oCoords.tl.x > maxWidth) maxWidth = objects[i].oCoords.tl.x;
      if (objects[i].oCoords.tr.x > maxWidth) maxWidth = objects[i].oCoords.tr.x;
      if (objects[i].oCoords.bl.x > maxWidth) maxWidth = objects[i].oCoords.bl.x;
      if (objects[i].oCoords.br.x > maxWidth) maxWidth = objects[i].oCoords.br.x;
    }
  }

  return { width: maxWidth, height: maxHeight };
}

function resizeDrawing(c) {
  const canvasSize = getCanvasSize(c);
  c.setWidth(canvasSize.width);
  c.setHeight(canvasSize.height);
  c.renderAll();
}

export function insertAfterSpace(referenceNode) {
  const parentHTML = referenceNode.parentNode.innerHTML;
  const newNodeHtml = referenceNode.outerHTML + '&nbsp;';
  if (parentHTML.indexOf(newNodeHtml) < 0) {
    const str = '&nbsp;';
    referenceNode.insertAdjacentHTML('afterend', str);
  }
}

export function insertDrawing(editor, id, json, isInsert) {
  // set to top if nothing selected
  if (isInsert) {
    let ele = editor.selection.get();
    if (ele.type === 'None') {
      ele = editor.$el.get(0);
      editor.selection.setAtStart(ele);
      editor.selection.restore();
      window.scrollTo(0, 0);
    }
    editor.html.insert(`<canvas id='${id}'></canvas> `);
  }
  const canvas = new fabric.StaticCanvas(id, { stateful: false });
  insertAfterSpace(document.getElementById(id));
  canvas.loadFromJSON(json);
  resizeDrawing(canvas);
}

/*change to ios format froala text*/
export function replaceHtmlPaths(html, source) {
  let result = html;
  const div = document.createElement('div');
  div.innerHTML = html;
  const list = Array.from(div.getElementsByTagName('IMG'));
  if (list.length > 0) {
    list.forEach((el) => {
      source.forEach((data) => {
        if (data.webHtml && data.mobileHtml && el.id === data.id) {
          result = result.replace(el.src, data.mobileHtml);
        }
      });
    });
  }
  div.innerHTML = null;
  return result;
}

/*change to ios format froala text*/
export function addAuthPaths(url, authString) {
  if (url.indexOf('?') > -1) {
    return url + authString;
  }
  return url + authString.replace('&', '?');
}

export function uniqueId() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
