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

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react';

import PropTypes from 'prop-types';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

import Froala from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

import Tribute from 'tributejs';
import FroalaOptions from './FroalaOptions';

import {
  handleFroalaLinkMenu,
  handleFroalaLinkPopup,
  handleFroalaLinkPopupClose,
  handleLanguageLoad,
  initFroalaAnchorPlugin
} from './FroalaCustomActions';

// Code Mirror plugins
require('expose-loader?CodeMirror!codemirror');
require('codemirror/lib/codemirror');
require('codemirror/mode/htmlmixed/htmlmixed');

// Froala Plugins
require('froala-editor/js/plugins/align.min');
require('froala-editor/js/plugins/code_beautifier.min');
require('froala-editor/js/plugins/code_view.min');
require('froala-editor/js/plugins/colors.min');
require('froala-editor/js/plugins/draggable.min');
require('froala-editor/js/plugins/emoticons.min');
require('froala-editor/js/plugins/entities.min');
require('froala-editor/js/plugins/font_family.min');
require('froala-editor/js/plugins/font_size.min');
require('froala-editor/js/plugins/image.min');
require('froala-editor/js/plugins/image_manager.min');
require('froala-editor/js/plugins/inline_style.min');
require('froala-editor/js/plugins/line_breaker.min');
require('froala-editor/js/plugins/link.min');
require('froala-editor/js/plugins/lists.min');
require('froala-editor/js/plugins/paragraph_format.min');
require('froala-editor/js/plugins/paragraph_style.min');
require('froala-editor/js/plugins/quote.min');
require('froala-editor/js/plugins/table.min');
require('froala-editor/js/plugins/url.min');
require('froala-editor/js/plugins/video.min');
require('!style-loader!css-loader!./tribute.css');

const Editor = forwardRef((props, ref) => {
  const {
    defaultValue,
    froalaOptions,
    onChange,
    strings
  } = props;
  const [editor, setEditor] = useState();
  const [initControls, setInitControls] = useState();
  const [model, setModel] = useState(defaultValue);
  let timer = '';
  let tribute = null;

  // Editor initialization
  useEffect(() => {
    if (initControls) {
      setEditor(initControls.getEditor());
      window.editor = initControls.getEditor();
    }
  }, [initControls]);

  useEffect(() => {
    if (defaultValue) {
      setModel(defaultValue);
    }
  }, [defaultValue]);

  useImperativeHandle(ref, () => ({
    getEditor() {
      return editor;
    },
    setMethod({ name, value }) {
      setEditor({
        ...editor,
        [name]: value
      });
    }
  }));

  initFroalaAnchorPlugin(Froala);

  // Load selected Froala language
  if (froalaOptions && froalaOptions.language) {
    handleLanguageLoad(froalaOptions.language);
  }

  const handleModelChange = (context) => {
    setModel(context);
    if (typeof onChange === 'function') {
      onChange(context);
    }
  };

  const handleOnShowLinkPopup = () => {
    if (timer) clearTimeout(timer);

    const callback = ({ urlInput, values }) => {
      if (tribute) tribute.detach(urlInput);
      tribute = new Tribute({
        trigger: '#',
        values: values
      });
      tribute.attach(urlInput);
    };

    const urlInput = document.querySelector('.fr-link-attr[name="href"]');
    if (!urlInput || !editor) {
      timer = setTimeout(() => {
        handleOnShowLinkPopup();
      }, 2500);
    } else {
      handleFroalaLinkPopup({
        editor,
        tribute,
        strings,
        callback,
      });
    }
  };

  const handleFroalaEditLinkPopup = () => {
    if (editor) {
      handleFroalaLinkMenu(editor);
    }
  };

  const handleInitializedFroala = (e) => {
    if (typeof props.onInit === 'function') props.onInit(e, editor);
  };

  const handleManualController = iControls => {
    setInitControls(iControls);
    iControls.initialize();
  };

  const dOptions = FroalaOptions(props);
  // Custom events
  dOptions.events = {
    ...dOptions.events,
    'initialized': handleInitializedFroala,
    'popups.show.link.insert': handleOnShowLinkPopup(),
    'popups.hide.link.insert': handleFroalaLinkPopupClose,
    'popups.show.link.edit': handleFroalaEditLinkPopup(),
  };

  return (
    <FroalaEditor
      model={model}
      tag="textarea"
      onManualControllerReady={handleManualController}
      onModelChange={handleModelChange}
      config={{
        ...dOptions,
        ...froalaOptions,
        events: froalaOptions.events ? { ...dOptions.events, ...froalaOptions.events } : dOptions.events
      }}
    />
  );
});

Editor.propTypes = {
  defaultValue: PropTypes.string,

  /** CSS string to insert in to head */
  editorStyle: PropTypes.string,

  /** Froala Editor <a href="https://froala.com/wysiwyg-editor/docs/options/" target="_blank">options</a>, anything passed with override default set by <code>Editor</code>. */
  froalaOptions: PropTypes.object,

  /** placeholder text when editor is empty */
  placeholder: PropTypes.string,

  /** <code>froalaEditor.initialized</code> event */
  onInit: PropTypes.func,

  /** <code>froalaEditor.focus</code> event */
  onFocus: PropTypes.func,

  /** <code>froalaEditor.blur</code> event */
  onBlur: PropTypes.func,

  /** <code>froalaEditor.contentChanged</code> event, returns event and a froalaEditor reference. */
  onChange: PropTypes.func
};

Editor.defaultProps = {
  editorStyle: require('./editorReset-web.min.css.raw'),
  froalaOptions: {},
  strings: {
    enterUrlForAnchor: 'Enter URL, or enter # for anchor'
  }
};

export default Editor;
