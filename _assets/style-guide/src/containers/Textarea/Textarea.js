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

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live';

import MessageInput from 'components/MessageInput/MessageInput';
import Textarea from 'components/Textarea/Textarea';
import Accordion from 'components/Accordion/Accordion';
import parseLiveSourceEditor from 'helpers/parseLiveSourceEditor';

const MessageInputDocs = require('!!react-docgen-loader!components/MessageInput/MessageInput.js');
const TextareaDocs = require('!!react-docgen-loader!components/Textarea/Textarea.js');

export default class TextareaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      example1Value: 'I autosize as you type.\nSet rows for my starting height.\nUse CSS to set a max-height.',
      example2Value: 'Resize me in both directions!',
      example3Value: '',
      example4Value: '',
      example5Value: '',
    };

    autobind(this);
  }

  handleExample1Change(event) {
    this.setState({ example1Value: event.currentTarget.value });
  }

  handleExample2Change(event) {
    this.setState({ example2Value: event.currentTarget.value });
  }

  handleExample3Change(event) {
    this.setState({ example3Value: event.currentTarget.value });
  }

  handleExample4Change(event) {
    this.setState({ example4Value: event.currentTarget.value });
  }

  handleExample5Change(event) {
    this.setState({ example5Value: event.currentTarget.value });
  }

  render() {
    const backgroundColor = { backgroundColor: '#333' };
    const scope = {Component, autobind, MessageInput, Textarea};

    const autosizeTextarea = `<Textarea
        id="demo1"
        label="Demo Autosize"
        value={this.state.exampleValue}
        width="50%"
        autosize
        rows={4}
        onChange={this.handleExampleChange}
        textareaStyle={{maxHeight: '10rem'}}        
      />`;
    const exampleState = `exampleValue: 'I autosize as you type. Set rows for my starting height. Use CSS to set a max-height.'`;
    const messageInput = `<MessageInput
      id="demo2"
      placeholder="Demo Message input"
      rows={3}
      value={this.state.exampleValue}
      onChange={this.handleExampleChange}
    />`;
    const componentName = `TextareaView`;

    return (
      <section id="TextareaView">
        <h1>Textareas</h1>
        <Docs {...TextareaDocs} />
        <p>Textarea is a <a href="https://facebook.github.io/react/docs/forms.html" target="_blank">Controlled Component</a>, an onChange handler must be provided to change the value.</p>

        <h3>Textarea</h3>
        <ComponentItem>
          <Textarea
            id="example1"
            label="Autosize"
            value={this.state.example1Value}
            width="50%"
            autosize
            rows={4}
            textareaStyle={{ maxHeight: '10rem' }}
            onChange={this.handleExample1Change}
          />
          <Textarea
            id="example2"
            label="Resize with 2 rows"
            value={this.state.example2Value}
            width="300px"
            resize="both"
            onChange={this.handleExample2Change}
          />
          <Textarea
            id="example3"
            placeholder="I have no label and a cool placeholder..."
            value={this.state.example3Value}
            onChange={this.handleExample3Change}
          />
        </ComponentItem>

        <h3>Play Ground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(exampleState, [], autosizeTextarea, componentName)}>
          <LivePreview />
          <Accordion title="source" position="left" style={{ borderBottom: '1px solid #ddd', marginBottom: '3rem', paddingBottom: '1rem' }}>
            <div style={backgroundColor}>
              <LiveEditor />
            </div>
          </Accordion>
          <LiveError />
        </LiveProvider>

        <h3>MessageInput</h3>
        <Docs {...MessageInputDocs} />
        <ComponentItem>
          <MessageInput
            id="example4"
            placeholder="Starts with 1 row"
            rows={1}
            value={this.state.example4Value}
            onChange={this.handleExample4Change}
          />
        </ComponentItem>
        <ComponentItem>
          <MessageInput
            id="example5"
            placeholder="Starts at 3 rows"
            rows={3}
            value={this.state.example5Value}
            onChange={this.handleExample5Change}
          />
        </ComponentItem>

        <h3>Play Ground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(`exampleValue:'',`, [], messageInput, componentName)}>
          <LivePreview />
          <Accordion title="source" position="left" style={{ borderBottom: '1px solid #ddd', marginBottom: '3rem', paddingBottom: '1rem' }}>
              <div style={backgroundColor}>
                <LiveEditor />
              </div>
            </Accordion>
          <LiveError />
        </LiveProvider>
      </section>
    );
  }
}
