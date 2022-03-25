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

import Text from 'components/Text/Text';
import Accordion from 'components/Accordion/Accordion';
import parseLiveSourceEditor from 'helpers/parseLiveSourceEditor';

const TextDocs = require('!!react-docgen-loader!components/Text/Text.js');

export default class TextView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      example1Value: 'I have 100% width by default',
      example2Value: 'I can be nested in line',
      example3Value: 'Cannot edit me!',
      example4Value: '',
      example5Value: 'password',
      example6Value: 'I have a clear button!',
      example7Value: 'I resize automatically'
    };

    this.myTextRef = React.createRef();

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

  handleExample6Change(event) {
    this.setState({ example6Value: event.currentTarget.value });
  }

  handleExample6Clear() {
    this.setState({ example6Value: '' });
  }

  handleExample7Change(event) {
    this.setState({ example7Value: event.currentTarget.value });
  }

  handleExample8Copy() {
    /* Select the text field */
    this.myTextRef.current.select();
    /* Copy the text inside the text field */
    document.execCommand('copy');
    alert("Copied the text: " + this.state.example6Value);
  }

  render() {
    const backgroundColor = { backgroundColor: '#333' };
    const scope = {Component, autobind, Text};

    const exampleCode = `<Text
        id="example1"
        type="text"
        label="Text Demo"
        icon="search"
        placeholder="Type something!"

        value={this.state.exampleValue}                                       
        onChange={this.handleExampleChange}

        showClear
        onClearClick={this.handleExampleClear}
        
        //showCopy
        ref={this.myTextRef}        
        onCopyClick={this.handleExampleCopy}                       
      />`;
    const exampleState = `exampleValue: 'I have a clear button!'`;
    const handleExampleClear = `handleExampleClear() {
      this.setState({ exampleValue: '' });
    }`;
    const handleExampleCopy = `handleExampleCopy() {
      /* Select the text field */
      this.myTextRef.current.select();
      /* Copy the text inside the text field */
      document.execCommand('copy');
      alert("Copied the text: " + this.state.exampleValue);
    }`;
    const componentName = `TextView`;

    return (
      <section id="text-page">
        <h1>Text</h1>
        <Docs {...TextDocs} />

        <h3>Examples</h3>
        <ComponentItem>
          <Text
            id="example1"
            label="Default"
            value={this.state.example1Value}
            onChange={this.handleExample1Change}
          />
          <Text
            id="example2"
            label="Inline"
            inline
            width="300px"
            value={this.state.example2Value}
            onChange={this.handleExample2Change}
          />
          <Text
            id="example3"
            label="Inline & disabled"
            value={this.state.example3Value}
            inline
            width="300px"
            disabled
            onChange={this.handleExample3Change}
          />
          <Text
            id="example4"
            placeholder="I have no label and a cool placeholder..."
            value={this.state.example4Value}
            onChange={this.handleExample4Change}
          />
          <Text
            type="password"
            id="example5"
            label="Password"
            value={this.state.example5Value}
            onChange={this.handleExample5Change}
          />
          <Text
            id="example6"
            label="Search"
            icon="search"
            placeholder="Type something!"
            value={this.state.example6Value}
            showClear
            onChange={this.handleExample6Change}
            onClearClick={this.handleExample6Clear}
            style={{ width: 300 }}
          />
          <Text
            id="example6.5"
            placeholder="Type something!"
            value={this.state.example6Value}
            showCopy
            ref={this.myTextRef}
            onChange={this.handleExample6Change}
            onCopyClick={this.handleExample8Copy}
            style={{ width: 300 }}
          />
          <Text
            id="example7"
            label="Autosize"
            icon="quicklink-fill"
            autosize
            value={this.state.example8Value}
            onChange={this.handleExample7Change}
          />
        </ComponentItem>

        <h3>Play Ground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(exampleState, [handleExampleCopy, handleExampleClear], exampleCode, componentName)}>
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
