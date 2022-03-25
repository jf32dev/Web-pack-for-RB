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

import React, { Component, Fragment } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live';

import ColourPicker from 'components/ColourPicker/ColourPicker';
import Btn from 'components/Btn/Btn';
import Accordion from 'components/Accordion/Accordion';
import parseLiveSourceEditor from 'helpers/parseLiveSourceEditor';

const ColourPickerDocs = require('!!react-docgen-loader!components/ColourPicker/ColourPicker.js');

export default class ColourPickerView extends Component {
  render() {
    const scope = {Fragment, ComponentItem, ColourPicker, Debug, Btn, Component, autobind};
    const backgroundColor = { backgroundColor: '#333' };
    const state = `hex: '#F26724',
    isVisible: true`;
    const handleColourChange = `handleColourChange(colour) {
      this.setState({ hex: colour.hex });
    }`;
    const togglePicker = `togglePicker() {
      this.setState({ isVisible: !this.state.isVisible })
    }`
    const exampleCode = `<ColourPicker
      hex={this.state.hex}
      isVisible={this.state.isVisible}
      onChange={this.handleColourChange}
    />`

    return (
      <section id="ColourPickerView">
        <h1>ColourPicker</h1>
        <Docs {...ColourPickerDocs} />
        <h3>Play Ground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(state, [handleColourChange, togglePicker], exampleCode, 'ColourPickerView')}>
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
