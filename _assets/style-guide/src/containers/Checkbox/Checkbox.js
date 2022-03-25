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

import Checkbox from 'components/Checkbox/Checkbox';
import Accordion from 'components/Accordion/Accordion';
import parseLiveSourceEditor from 'helpers/parseLiveSourceEditor';

const CheckboxDocs = require('!!react-docgen-loader!components/Checkbox/Checkbox.js');

export default class CheckboxInputsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked1: true,
      checked2: false
    };

    autobind(this);
  }

  handleCheckbox1Change(event) {
    this.setState({
      checked1: event.currentTarget.checked
    });
  }

  handleCheckbox2Change(event) {
    this.setState({
      checked2: event.currentTarget.checked
    });
  }

  render() {
    const scope = {Checkbox, Component, autobind};
    const backgroundColor = { backgroundColor: '#333' };
    const exampleCode = `<Checkbox
            label="Disabled"
            name="checked3"
            value="anyValue 3"
            checked={this.state.checked}
            onChange={this.handleCheckboxChange}
            disabled
          />`
      const state = `checked: false`
      const handleChecked = `handleCheckboxChange(event) {
        this.setState({
          checked: event.currentTarget.checked
        });
      }`
    return (
      <section id="CheckboxInputsView">
        <h1>Checkbox</h1>
        <Docs {...CheckboxDocs} />

        <ComponentItem>
          <Checkbox
            label="Checked"
            name="checked1"
            value="anyValue 1"
            checked={this.state.checked1}
            onChange={this.handleCheckbox1Change}
          />
          <Checkbox
            label="Unchecked"
            name="checked2"
            value="anyValue 2"
            checked={this.state.checked2}
            required
            onChange={this.handleCheckbox2Change}
          />
        </ComponentItem>
        <h3>Play Ground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(state, [handleChecked], exampleCode, 'CheckboxView')}>
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
