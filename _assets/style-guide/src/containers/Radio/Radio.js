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

import Radio from 'components/Radio/Radio';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Accordion from 'components/Accordion/Accordion';
import parseLiveSourceEditor from 'helpers/parseLiveSourceEditor';

const RadioDocs = require('!!react-docgen-loader!components/Radio/Radio.js');
const RadioGroupDocs = require('!!react-docgen-loader!components/RadioGroup/RadioGroup.js');

export default class RadioView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleRadioChecked: false
    };
    autobind(this);
  }

  handlePreventToggle(event) {
    event.preventDefault();
  }

  handleToggleRadio() {
    this.setState({ toggleRadioChecked: !this.state.toggleRadioChecked });
  }

  render() {
    const backgroundColor = { backgroundColor: '#333' };
    const scope = {Component, autobind, Radio, RadioGroup};
    const radioGroup = `<>
      <p>selectedValue: {this.state.selectedValue}</p>
      <RadioGroup
        legend="Select your favourite fruit"
        name="fruit"
        selectedValue={this.state.selectedValue}
        onChange={this.handleRadioGroupChange}
        inlineInputs
        inlineLegend
        required
        options={[{
          label: 'Apple',
          value: 'apple'
        }, {
          label: 'Orange',
          value: 'orange'
        }, {
          label: 'Watermelon',
          value: 'watermelon',
          disabled: true
        }]}
      />
    </>`

    const handleRadioGroupChange = `handleRadioGroupChange(event) {
        this.setState({
          selectedValue: event.currentTarget.value
        });
      }`

    const state = `selectedValue: 'apple'`;
    
    return (
      <section id="RadioView">
        <h1>Radio Inputs</h1>
        <p>Refer to the React <a href="https://facebook.github.io/react/docs/forms.html" target="_blank">Forms documentation</a> for further information on Controlled and Uncontrolled components.</p>

        <h2>Radio</h2>
        <Docs {...RadioDocs} />
        <ComponentItem>
          <Radio label="Checked" checked onChange={this.handlePreventToggle} />
          <Radio label="Unchecked" onChange={this.handlePreventToggle} />
          <Radio label="Disabled" disabled onChange={this.handlePreventToggle} />
          <Radio label="Toggle Me" value="toggle" checked={this.state.toggleRadioChecked} onChange={this.handleToggleRadio} />
        </ComponentItem>

        <h2>RadioGroup</h2>
        <Docs {...RadioGroupDocs} />
        <h3>Playground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(state, [handleRadioGroupChange], radioGroup, 'RadioView')}>
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
