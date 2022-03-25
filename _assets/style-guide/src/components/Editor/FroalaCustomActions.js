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

export const initFroalaAnchorPlugin = (Froala) => {
  // Define an icon and command for the button that opens the custom popup.
  Froala.DefineIcon('showAnchor', { NAME: 'flag', SVG_KEY: 'flag' });
  Froala.RegisterCommand('showAnchor', {
    title: 'Insert Anchor',
    focus: true,
    undo: true,
    callback: function () {
      this.anchorPlugin.showPopup();
    }
  });

  Froala.RegisterCommand('insertAnchor', {
    callback: function () {
      const name = document.getElementById('fr-link-insert-anchor').value;
      if (name !== '') {
        const el = this.selection.element();
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].indexOf(el.tagName) >= 0) {
          this.selection.ranges(0).setEndBefore(el);
          this.selection.ranges(0).collapse(true);
        } else  {
          this.selection.ranges(0).collapse(true);
        }
        this.html.insert('<a id="' + name + '" name="' + name + '" class="fr-anchor" title="&#x2691; ' + name + '">&#x200a;</a>');
      }
      this.anchorPlugin.hidePopup();
    }
  });

  // Define popup template.
  Object.assign(Froala.POPUP_TEMPLATES, {
    'anchorPlugin.popup': '[_CUSTOM_LAYER_]'
  });

  // The custom popup is defined inside a plugin (new or existing).
  // eslint-disable-next-line no-param-reassign
  Froala.PLUGINS.anchorPlugin = function (context) {
    // Create custom popup.
    function initPopup () {
      // Load popup template.
      const template = {
        buttons: [],
        custom_layer: `
          <div class="custom-layer fr-layer fr-active">
            <div class="fr-input-line">
              <input id="fr-link-insert-anchor" type="text" class="fr-link-attr" placeholder="Anchor name [no space or #]" tabindex="1" dir="auto">
              <label for="fr-link-insert-anchor">Named anchor</label>
            </div>
            <div class="fr-action-buttons">
              <button class="fr-command fr-submit" role="button" data-cmd="insertAnchor" href="#" tabindex="4" type="button">Insert Anchor</button>
            </div>
          </div>`
      };
      // Create popup.
      const $popup = context.popups.create('anchorPlugin.popup', template);
      return $popup;
    }

    // Show the popup
    function showPopup () {
      // Get the popup object defined above.
      let $popup = context.popups.get('anchorPlugin.popup');
      // If popup doesn't exist then create it.
      if (!$popup) $popup = initPopup();
      // Set the editor toolbar as the popup's container.
      context.popups.setContainer('anchorPlugin.popup', context.$tb);
      const $btn = context.$tb.find('.fr-command[data-cmd="showAnchor"]');
      // Compute the popup's position.
      const left = $btn.offset().left + $btn.outerWidth() / 2;
      const top = $btn.offset().top + (context.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);
      // Show the custom popup.
      // The button's outerHeight is required in case the popup needs to be displayed above it.
      //clear the input
      let selectedText = context
        .selection
        .text()
        .trim()
        .split(' ')
        .slice(0, 2)
        .join(' ');
      selectedText = selectedText.replace(/[^a-zA-Z0-9_\-.;]/ig, '_');
      document.getElementById('fr-link-insert-anchor').value = selectedText;
      document.getElementById('fr-link-insert-anchor').focus();

      let curr = '';
      document.getElementById('fr-link-insert-anchor').oninput = (e) => {
        const code = e.keyCode || e.which;
        let value = document.getElementById('fr-link-insert-anchor').value;
        if (value.match(/^([a-zA-Z0-9_\-.;]*)$/) || code === 8) {
          curr = value;
          value = curr;
        } else {
          value = curr;
        }
      };
      context.popups.show('anchorPlugin.popup', left, top, $btn.outerHeight());
    }

    // Hide the custom popup.
    function hidePopup () {
      context.popups.hide('anchorPlugin.popup');
    }
    // Methods visible outside the plugin.
    return {
      showPopup: showPopup,
      hidePopup: hidePopup
    };
  };
};

// Froala link Pop Up editor changes
export const handleFroalaLinkPopup = ({
  editor,
  strings,
  callback
}) => {
  //override placeholder of default link URL to instruct how to use named anchor
  const urlInput = document.querySelector('.fr-link-attr[name="href"]');
  urlInput.placeholder = strings.enterUrlForAnchor;
  const values = [];

  //get all named anchors
  const $dom = editor.$editor || editor.$el;
  const anchors = $dom.find('a.fr-anchor');
  Array.from(anchors).forEach(a => {
    const name = a.id;
    if (name) {
      values.push({ key: name, value: name });
    }
  });

  callback({
    urlInput,
    values
  });
};

export const handleFroalaLinkPopupClose = (tribute) => {
  const urlInput = document.querySelector('.fr-link-attr[name="href"]');
  if (tribute && urlInput) {
    tribute.detach(urlInput);
  }
};

export const handleFroalaLinkMenu = (editor) => {
  const menu = editor.popups && editor.popups.get('link.edit');
  const el = editor.selection && editor.selection.element();
  if (menu && el) {
    if (el.tagName === 'A' && el.id) {
      //named anchr, hide some buttons
      menu.find('button[data-cmd="linkOpen"]').hide();
      menu.find('button[data-cmd="linkEdit"]').hide();
    } else {
      menu.find('button[data-cmd="linkOpen"]').show();
      menu.find('button[data-cmd="linkEdit"]').show();
    }
  }
};

export const handleLanguageLoad = (lang) => {
  switch (lang) {
    case 'da':
      require('froala-editor/js/languages/da');
      break;
    case 'de':
      require('froala-editor/js/languages/de');
      break;
    case 'en-gb':
    case 'en-us':
      require('froala-editor/js/languages/en_gb');
      break;
    case 'es':
      require('froala-editor/js/languages/es');
      break;
    case 'fr':
      require('froala-editor/js/languages/fr');
      break;
    case 'it':
      require('froala-editor/js/languages/it');
      break;
    case 'ja':
      require('froala-editor/js/languages/ja');
      break;
    case 'ko':
      require('froala-editor/js/languages/ko');
      break;
    case 'nb':
    case 'no':
      require('froala-editor/js/languages/nb');
      break;
    case 'pt-br':
      require('froala-editor/js/languages/pt_br');
      break;
    case 'ru':
      require('froala-editor/js/languages/ru');
      break;
    case 'sv':
      require('froala-editor/js/languages/sv');
      break;
    case 'th':
      require('froala-editor/js/languages/th');
      break;
    case 'tr':
      require('froala-editor/js/languages/tr');
      break;
    case 'vi':
      require('froala-editor/js/languages/vi');
      break;
    case 'zh-cn':
      require('froala-editor/js/languages/zh_cn');
      break;
    case 'zh-hk':
    case 'zh-tw':
      require('froala-editor/js/languages/zh_tw');
      break;
    default:
      break;
  }
};
