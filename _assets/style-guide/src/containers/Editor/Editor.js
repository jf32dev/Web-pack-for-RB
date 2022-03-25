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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Editor from 'components/Editor/Editor';

const EditorDocs = require('!!react-docgen-loader!components/Editor/Editor.js');

const typography = require('../../static/typography.txt');

export default class EditorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
      locale: 'en-gb'
    };
    autobind(this);
  }

  handleEditorInit() {
    console.info('initialised!');
  }

  handleEditorFocus() {
    console.info('Editor focus');
  }

  handleEditorBlur() {
    console.info('Editor blur');
  }

  handleEditorChange(value) {
    this.setState({ html: value });
  }

  handleLocaleChange(value) {
    this.setState({ locale: value });
  }

  render() {
    this.toolbar = ['bold', 'italic', 'underline', '|', 'fontFamily', 'fontSize', 'textColor', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'insertLink', 'showAnchor', 'insertImage', 'insertTable', 'insertHR', 'clearFormatting', 'html'];
    const editorOptions = {
      heightMax: 300,
      heightMin: 150,
      // language: this.state.locale,
      language: 'es',
      toolbarButtons: this.toolbar
    };

    return (
      <section id="editor-page">
        <h1>Editor</h1>
        <Docs {...EditorDocs} />

        <h2>Example</h2>
        <p>Editor is an <em>uncontrolled</em> component. Track component state using <code>onChange</code>.</p>
        <ComponentItem>
          <Editor
            defaultValue={typography}
            froalaOptions={editorOptions}
            html={this.state.html}
            onInit={this.handleEditorInit}
            onFocus={this.handleEditorFocus}
            onBlur={this.handleEditorBlur}
            onChange={this.handleEditorChange}
          />
        </ComponentItem>
      </section>
    );
  }
}
