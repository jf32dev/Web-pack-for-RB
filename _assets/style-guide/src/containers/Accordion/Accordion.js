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

import filter from 'lodash/filter';
import React, { Component } from 'react';
import ComponentItem from '../../views/ComponentItem';
import { Accordion, CheckboxList } from 'components';

export default class AccordionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        { id: 11, term: 'One', count: 33 },
        { id: 22, term: 'Ecomonic & Systemic More data to display', count: 18, isSelected: true },
        { id: 33, term: 'Three', count: 7 }
      ],
      searchableList: [
        { term: 'Ecommerce Materials', id: 1, count: '2', type: 'channels', childType: 'stories', color: '#ddd', thumbnail: 'http:\/\/dev.bigtincan.com\/files\/538fc0e2-5ff2-11e4-a627-a7dc99f91d57.png' },
        { term: 'Ecomonic Policies', id: 2, count: '10', type: 'tabs', childType: 'channels', color: '#bfbfbf', thumbnail: 'http:\/\/dev.bigtincan.com\/files\/thumbnails\/ce\/ce250790-043e-11e5-8026-67342e3c3532-thumb-400x400.png?v=1447803911' },
        { term: 'Ecomonic & Systemic Sit...', id: 3, count: '31', type: 'channels', childType: 'stories', color: '#ff0000', thumbnail: '' }
      ]
    };

    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleRadioButton = this.handleRadioButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getCustomOptions = this.getCustomOptions.bind(this);
  }

  getCustomOptions(input, callback) {
    const items = this.state.searchableList;

    callback(null, {
      options: items,
      // CAREFUL! Only set this to true when there are no more options,
      // or more specific queries will not be sent to the server.
      complete: true
    });
  }

  handleChange(val) {
    const clonedVal = val;
    // New Value to insert in the list
    clonedVal.isSelected = true; //Set checkbox as checked
    this.setState({ list: this.state.list.concat([clonedVal]) });

    // Filter list
    // Once item is inserted as checkbox Remove it from drop down list
    this.setState({ searchableList: filter(this.state.searchableList, function(o) { return o.id !== clonedVal.id; }) });
  }

  handleCheckbox(event) {
    const itemList = this.state.list;
    const item = itemList.find(obj => obj.id === parseInt(event.currentTarget.value, 10));
    if (item) item.isSelected = event.currentTarget.checked;

    // New Value to insert in the list
    this.setState({ list: itemList });
  }

  handleRadioButton(val) {
    const itemList = this.state.list.map(function(obj) {
      const tmpObj = obj;
      delete tmpObj.isSelected;
      return tmpObj;
    });
    const item = itemList.find(obj => obj.id === parseInt(val.target.value, 10));
    if (item) item.isSelected = val.target.checked;

    // New Value to insert in the list
    this.setState({ list: this.state.list });
  }

  render() {
    return (
      <section id="AccordionView">
        <h1>Accordion</h1>
        <p>Used to expand and collapse content.</p>
        <h3>PropTypes</h3>
        <ul>
          <li><strong>title</strong> <code>string</code> - list title</li>
          <li><strong>children</strong> <code>node</code> - content to display inside list</li>
          <li><strong>defaultOpen</strong> <code>bool</code> - initial open state</li>
        </ul>

        <h3>With HTML content</h3>
        <ComponentItem>
          <Accordion title="My accordion">
            <h3>Description</h3>
            <p>Some more data for this item</p>
          </Accordion>
        </ComponentItem>

        <h3>Accordion disabled</h3>
        <ComponentItem>
          <Accordion title="My accordion disabled" disabled defaultOpen>
            <h3>Description</h3>
            <p>Some more data for this item</p>
          </Accordion>
        </ComponentItem>

        <h3>Accordion to the left</h3>
        <ComponentItem>
          <Accordion title="My accordion to the left" position="left" defaultOpen>
            <h3>Description</h3>
            <p>Some more data for this item</p>
          </Accordion>
        </ComponentItem>

        <h3>With other components</h3>
        <ComponentItem>
          <Accordion title="My Btn Custom Search" defaultOpen>
            <CheckboxList
              name="myList"
              itemList={this.state.list}
              fetchItemsAsync={this.getCustomOptions}
              onChange={this.handleChange}
              onChangeCheckbox={this.handleCheckbox}
              onChangeRadio={this.handleRadioButton}
              searchPlaceholder="Search"
              searchLabel="Add"
              showCounter
              showAddBtn
              //singleSelection
            />
          </Accordion>
        </ComponentItem>

        <h3>Alternative accordion</h3>
        <ComponentItem>
          <Accordion
            title="Accordion Title"
            description="Accordion description"
            icon="gamification"
            alt
            defaultOpen={this.props.isOpen}
            onToggle={this.handleAccordionToggle}
          >
            <div style={{ padding: '1rem' }}>
              <h3>We can set any content here</h3>
              <p>Some description or data form</p>
            </div>
          </Accordion>
        </ComponentItem>
      </section>
    );
  }
}
