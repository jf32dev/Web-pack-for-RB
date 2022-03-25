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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import audioPlay from './audioPlay.svg';

/* when audio end, update the image */
export const handleAudioEnd = (playingAudioId) => {
  const element = document.getElementById(playingAudioId);
  element.src = audioPlay;
};

/* when click the canvas, the editor would go back to fabric drawing editor */
export const handleAddCanvasClickListener = (id, callback) => {
  document.getElementById(id).addEventListener('click', callback);
};

export const getFroalaOptions = (other, eventHandlers) => {
  const buttonList = [['fontFamily', '|', 'fontSize', '|', 'bold', 'italic', 'underline', '|', 'textColor', 'backgroundColor', '|', 'align', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertLink']];

  //events
  const events = {
    'image.removed': eventHandlers.handleImageRemove(),
    'image.inserted': eventHandlers.handleInsertedImage(),
    'keydown': eventHandlers.handleEnterKeyPress(),
    'image.beforeUpload': () => {
      document.getElementsByClassName('fr-image-progress-bar-layer fr-layer fr-active')[0].style.display = 'none';
      document.getElementsByClassName('fr-arrow')[0].style.display = 'none';
      return false;
    },
    'mouseup': () => {
      eventHandlers.mouseupCallback();
    },
    'commands.after': eventHandlers.handleEditorChange(),
    'click': eventHandlers.handleReloadResource(),
    'initialized': (e, editor) => {
      eventHandlers.initializedCallback(e, editor);
    }
  };

  return {
    toolbarButtonsSM: [['fontFamily', '|', 'fontSize', '|', 'textColor', 'backgroundColor', '|', 'align', '|', 'insertLink']],
    toolbarButtonsXS: [['fontFamily', '|', 'fontSize', '|', 'textColor', 'backgroundColor', '|', 'align', '|', 'insertLink']],
    toolbarButtonsMD: buttonList,
    toolbarButtons: buttonList,
    fontFamilySelection: true,
    fontSizeSelection: true,
    iframe: false, //otherwise the fabric could not draw the canvas
    htmlAllowedEmptyTags: ['canvas'],
    pasteDeniedTags: ['canvas', 'img'],
    linkAutoPrefix: '',
    imageEditButtons: ['imageAlign', '|', 'imageSize'],
    linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
    linkInsertButtons: [],
    shortcutsEnabled: [],
    events: events,
    pluginsEnabled: ['align', 'charCounter', 'codeBeautifier', 'codeView', 'colors', 'draggable',
      'emoticons', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'image', 'imageManager',
      'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle',
      'quote', 'save', 'table', 'url', 'video', 'wordPaste'],
    ...other
  };
};
