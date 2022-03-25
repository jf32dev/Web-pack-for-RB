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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import EditorMenu from './EditorMenu';
import CodeMirror from 'react-codemirror';

require('./EmailTheme');
require('!style-loader!css-loader!codemirror/theme/neo.css');

/**
 * Wrapper to use react codemirror with custom btcEmail theme.
 * For Information https://github.com/JedWatson/react-codemirror
 */
export default class EmailEditor extends PureComponent {
  static propTypes = {
    /** Html template */
    template: PropTypes.string,

    /** Css template */
    css: PropTypes.string,

    /** List of variables availables for the HTML template */
    variables: PropTypes.array,

    autoFocus: PropTypes.bool,

    /** Check codeMirror lib options */
    options: PropTypes.object,

    onTemplateChange: PropTypes.func,
    onCssChange: PropTypes.func,
    onFocusChange: PropTypes.func,

    category: PropTypes.string,
    language: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object,
    strings: PropTypes.object
  };

  static defaultProps = {
    list: []
  };

  constructor(props) {
    super(props);
    this.state = {
      template: props.template,
      css: props.css,
      editorModeSelected: 'inky',
      editorHeaderList: [
        { name: 'Inky', id: 'inky' },
        { name: 'CSS', id: 'css' },
      ],
      cursorPosition: null
    };
    autobind(this);

    this.htmlEditor = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.template !== nextProps.template || this.props.css !== nextProps.css) {
      this.setState({
        template: nextProps.template,
        css: nextProps.css,
      });
    }
  }

  componentDidUpdate(prevProps) {
    // Update templates on language change
    if (this.props.language !== prevProps.language || this.props.category !== prevProps.category) {
      switch (this.state.editorModeSelected) {
        case 'inky':
          this.htmlEditor.getCodeMirror().setValue(this.state.template);
          break;
        case 'css':
          this.cssEditor.getCodeMirror().setValue(this.state.css);
          break;
        default:
          break;
      }
    }
  }

  handleEditorHeaderItemClick(e, context) {
    this.setState({ editorModeSelected: context.id });
  }

  handleVariableClick(e, context) {
    if (this.htmlEditor) {
      let keyword = '[[' + context.name + ']]';
      // Whether inserts a conditional or foreach tag
      if (context.type === 'function' || context.type === 'loop' || context.type === 'condition' || context.type === 'innerloop') {
        keyword = '<' + context.name + '></' + context.name + '>';
      }

      const nPosition = {
        line: this.state.cursorPosition.line,
        ch: this.state.cursorPosition.ch
      };

      /*const lPosition = {
       line: this.state.cursorPosition.line,
       ch: this.state.cursorPosition.ch + (keyword.length)
       };*/

      this.htmlEditor.focus();
      this.htmlEditor.getCodeMirror().setCursor(nPosition);
      this.htmlEditor.getCodeMirror().replaceRange(
        keyword,
        nPosition
      );

      //this.htmlEditor.getCodeMirror().markText(nPosition, lPosition, { readOnly: true, clearOnEnter: true });
    }
  }

  handleUpdateCode (newCode) {
    const { onCssChange, onTemplateChange } = this.props;
    switch (this.state.editorModeSelected) {
      case 'inky':
        if (typeof onTemplateChange === 'function') {
          onTemplateChange(newCode);
        }
        break;
      case 'css':
        if (typeof onCssChange === 'function') {
          onCssChange(newCode);
        }
        break;
      default:
        break;
    }
  }

  handleFocusChange(focused) {
    const { onFocusChange } = this.props;

    if (typeof onFocusChange === 'function') {
      onFocusChange(focused, this.state.editorModeSelected);
    }
  }

  handleCursorPosition(e) {
    this.setState({ cursorPosition: e.getCursor() });
  }

  render() {
    const {
      strings,
      functions,
      variables
    } = this.props;
    const {
      css,
      template,
      editorHeaderList,
      editorModeSelected
    } = this.state;
    const styles = require('./EmailEditor.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      EmailEditor: true
    }, this.props.className);

    const codeEditorOptions = {
      lineWiseCopyCut: true,
      lineNumbers: ['inky', 'css'].includes(editorModeSelected),
      readOnly: this.props.readOnly,
      mode: ['inky'].includes(editorModeSelected) ? 'btcEmail' : 'css', //'text/plain', //text/html
      theme: ['inky', 'css'].includes(editorModeSelected) ? 'neo' : 'default',
    };

    return (
      <div className={classes} style={this.props.style}>
        <EditorMenu
          list={editorHeaderList}
          selected={editorModeSelected}
          variables={editorModeSelected !== 'css' ? variables : []}
          functions={editorModeSelected !== 'css' ? functions : []}
          secondary
          strings={strings}
          onItemClick={this.handleEditorHeaderItemClick}
          onVariableClick={this.handleVariableClick}
          showHelpLink
          onAnchorClick={this.props.onAnchorClick}
        />
        <div className={styles.editorWrap}>
          {editorModeSelected === 'inky' && <CodeMirror
            ref={(elem) => { this.htmlEditor = elem; }}
            value={template}
            onChange={this.handleUpdateCode}
            options={codeEditorOptions}
            autoFocus={this.props.autofocus}
            onCursorActivity={this.handleCursorPosition}
            onFocusChange={this.handleFocusChange}
          />}
          {editorModeSelected === 'css' && <CodeMirror
            ref={(elem) => { this.cssEditor = elem; }}
            value={css}
            onChange={this.handleUpdateCode}
            options={codeEditorOptions}
            onCursorActivity={() => (null)}
            onFocusChange={this.handleFocusChange}
            autoFocus={this.props.autofocus}
          />}
        </div>
      </div>
    );
  }
}
