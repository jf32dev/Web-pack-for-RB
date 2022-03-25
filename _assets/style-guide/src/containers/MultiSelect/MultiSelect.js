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

import filter from 'lodash/filter';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import Accordion from 'components/Accordion/Accordion';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live';

import MultiSelect from 'components/MultiSelect/MultiSelect';
import parseLiveSourceEditor from 'helpers/parseLiveSourceEditor';

const MultiSelectDocs = require('!!react-docgen-loader!components/MultiSelect/MultiSelect.js');

export default class MultiSelectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customSelected: [
        { value: 4, label: 'Four' },
        { value: 7, label: 'Seven' },
        { value: 9, label: 'Nine' }
      ],
      list: [
        { id: 22, term: 'Ecomonic & Systemic More data to display', count: 18 }
      ],
      searchableList: [
        { term: 'Ecommerce Materials', id: 1, count: '2', type: 'channels', childType: 'stories', color: '#ddd', thumbnail: 'https://push.bigtincan.org/files/a230f581-24a0-5f9c-b5dd-cf83fa315483.jpg' },
        { term: 'Ecomonic Policies', id: 2, count: '10', type: 'tabs', childType: 'channels', color: '#bfbfbf', thumbnail: 'https://push.bigtincan.org/files/a230f581-24a0-5f9c-b5dd-cf83fa315483.jpg' },
        { term: 'Ecomonic & Systemic Test', id: 3, count: '31', type: 'channels', childType: 'stories', color: '#ff0000', thumbnail: '' }
      ]
    };
    autobind(this);
  }

  // Custom MultiSelect
  handleAddValue(event, context) {
    // Add new item selected
    this.setState({ customSelected: [
      ...this.state.customSelected,
      { value: context.value, label: context.label, status: context.status },
    ] });
  }

  handleMultiRemove(event, context) {
    this.setState({
      customSelected: filter(this.state.customSelected, function(o) {
        return o.value !== context.value;
      })
    });
  }

  handleInputChange(newValue) {
    console.log('Serch new value');
    console.log(newValue);
  }

  handlePopValue() {
    if (Array.isArray(this.state.customSelected) && this.state.customSelected.length) {
      this.setState({
        customSelected: this.state.customSelected.slice(0, this.state.customSelected.length - 1)
      });
    }
  }

  render() {
    const backgroundColor = { backgroundColor: '#333' };
    const fixedOptions = [
      { value: 1, label: 'One test', email: 'rutfin69@gmail.com', type: 'user', thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Stourhead_garden.jpg' },
      { value: 1, label: 'some more', email: 'rutfin69@gmail.com', type: 'user', thumbnail: '', defaultColour: '#7e00b9' },
      { value: 1, label: 'my name', email: 'rutfin69@gmail.com', type: 'group', thumbnail: '', defaultColour: '#7e00b9', usersCount: 90 },
      { value: 2, label: 'Two', usersCount: 90, type: 'crm_account' },
      { value: 3, label: 'Three', email: 'rutfin69@gmail.com', type: 'crm_contact' },
      { value: 4, label: 'Four', type: 'crm_lead' },
      { value: 5, label: 'Five' },
      { value: 6, label: 'Six' },
      { value: 7, label: 'Seven' },
      { value: 8, label: 'Eight' },
      { value: 9, label: 'Nine' }
    ];

    const self = this;

    // map only available options
    const unselectedOptions = fixedOptions.filter(function(option) {
      return (!self.state.customSelected.find(item => item.value === option.value));
    });

    const scope = {MultiSelect, Component, filter, autobind, unselectedOptions};
    const state = `customSelected: [
        { value: 4, label: "Four" },
        { value: 7, label: "Seven" },
        { value: 9, label: "Nine" }
      ]`;

    const removeIcon = `<MultiSelect
      value={this.state.customSelected}
      options={unselectedOptions}
      placeholder="Please search me!"
      keyValue="value"
      keyLabel="label"
      multi
      crmSource="salesforce"
      allowsCreateType={'email'}
      onInputChange={this.handleInputChange}
      onAddValue={this.handleAddValue}
      canRemove
      onRemoveClick={this.handleMultiRemove}
      backspaceRemoves
      onPopValue={this.handlePopValue}
    />`;

    const handleAddValue = `// Custom MultiSelect
    handleAddValue(event, context) {
      // Add new item selected
      this.setState({
        customSelected: [
          ...this.state.customSelected,
          { value: context.value, label: context.label, status: context.status },
        ]
      });
    }`;

    const handleMultiRemove = `handleMultiRemove(event, context) {
      this.setState({
        customSelected: filter(this.state.customSelected, function (o) {
          return o.value !== context.value;
        })
      });
    }`;

    const handleInputChange = `handleInputChange(newValue) {
      console.log('Serch new value');
      console.log(newValue);
    }`;

    const handlePopValue = `handlePopValue() {
      if (Array.isArray(this.state.customSelected) && this.state.customSelected.length) {
        this.setState({
          customSelected: this.state.customSelected.slice(0, this.state.customSelected.length - 1)
        });
      }
    }`;

    return (
      <section id="MultiSelectView">
        <h1>MultiSelect</h1>
        <Docs {...MultiSelectDocs} />

        <h2>Backspace remove option</h2>
        <ComponentItem>
          <MultiSelect
            value={this.state.customSelected}
            options={unselectedOptions}
            placeholder={'Please search me!'}
            keyValue="value"
            keyLabel="label"
            multi
            crmSource="dynamics"
            backspaceRemoves
            allowsCreateType={'email'}
            onInputChange={this.handleInputChange}
            onAddValue={this.handleAddValue}
            onPopValue={this.handlePopValue}
          />
        </ComponentItem>

        <h2>Loading indicator</h2>
        <ComponentItem>
          <MultiSelect
            value={[{ value: 'data', label: 'Data' }]}
            options={unselectedOptions}
            placeholder={'Please search me!'}
            loading
            onInputChange={this.handleInputChange}
            onAddValue={this.handleAddValue}
          />
        </ComponentItem>

        <h2>Disabled</h2>
        <ComponentItem>
          <MultiSelect
            value={[{ value: 'data', label: 'Data' }]}
            options={unselectedOptions}
            placeholder={'Please search me!'}
            disabled
            onInputChange={this.handleInputChange}
            onAddValue={this.handleAddValue}
          />
        </ComponentItem>

        <h2>Remove icon</h2>
        <h3>Playground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(state, [handleAddValue, handleMultiRemove, handleInputChange, handlePopValue], removeIcon, 'multiSelectView')}>
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
