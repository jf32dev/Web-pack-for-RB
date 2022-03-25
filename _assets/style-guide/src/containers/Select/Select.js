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
import $ from 'jquery';
import React, { Component } from 'react';
import ComponentItem from '../../views/ComponentItem';
import autobind from 'class-autobind';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import BtnAddSearch from 'components/BtnAddSearch/BtnAddSearch';
import Select from 'components/Select/Select';
import GroupOptItem from 'components/Select/GroupOptItem';
import SelectSearchList from 'components/SelectSearchList/SelectSearchList';
import AdminMetadataList from 'components/Admin/AdminUtils/AdminMetadataList/AdminMetadataList';

const SelectDocs = require('!!react-docgen-loader!components/Select/Select.js');

const source = 'https://api.github.com/users/octocat/gists';
const emailTypes = require('../../static/emailTypes.json');
const userMetadataData = require('../../static/userMetadata.json');

export default class SelectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupOption: {},
      fixedSelected: null,
      asyncSelected: [],
      manualLoading: true,
      list: [
        { id: 22, term: 'Ecomonic & Systemic More data to display', count: 18 }
      ],
      searchableList: [
        { term: 'Ecommerce Materials', id: 1, count: '2', type: 'channels', childType: 'stories', color: '#ddd', thumbnail: 'https://push.bigtincan.org/files/a230f581-24a0-5f9c-b5dd-cf83fa315483.jpg' },
        { term: 'Ecomonic Policies', id: 2, count: '10', type: 'tabs', childType: 'channels', color: '#bfbfbf', thumbnail: 'https://push.bigtincan.org/files/a230f581-24a0-5f9c-b5dd-cf83fa315483.jpg' },
        { term: 'Ecomonic & Systemic Test', id: 3, count: '31', type: 'channels', childType: 'stories', color: '#ff0000', thumbnail: '' }
      ],

      attributes: userMetadataData.attributes,
      valuesSelected: userMetadataData.valuesSelected,
      valuesList: userMetadataData.valuesList,
    };

    autobind(this);
    this._customOptionHeightsSelect = {};
  }

  getOptions(input, callback) {
    $.get(source, function() {
      callback(null, {
        options: [
          { value: 4, label: 'Four' },
          { value: 5, label: 'Five' },
          { value: 6, label: 'Six' }
        ],
        complete: true
      });
    });
  }

  getCustomOptions(input, callback) {
    $.get(source, () => {
      callback(null, {
        options: this.state.searchableList,
        complete: true
      });
    });
  }

  getNestedData(customList) {
    const nestedData = [];
    const tmpList = customList || emailTypes;
    tmpList.map((item) => {
      nestedData.push({
        id: item.header,
        name: item.header,
        type: 'header',
        disabled: true
      });

      if (item.children && item.children.length) {
        item.children.map((childItem) => {
          // Subheader item
          if (childItem.subheader) {
            nestedData.push({
              id: childItem.subheader,
              name: childItem.subheader,
              type: 'subheader',
              disabled: true,
              header: item.header
            });
          }

          // List of template types
          if (childItem.children && childItem.children.length) {
            childItem.children.map((category) => {
              nestedData.push({
                id: category,
                name: category,
                type: 'category',
                header: item.header,
                subheader: childItem.subheader,
              });
            });
          }
        });
      }
    });
    return nestedData;
  }

  handleFixedChange(val) {
    this.setState({ fixedSelected: val });
  }

  handleNestedChange(val) {
    this.setState({ groupOption: val });
  }

  handleSyncChange(val) {
    this.setState({ asyncSelected: val });
  }

  valueChanged(val, state) {
    // New value
    console.log(val);  // eslint-disable-line
    // previous state
    console.log(state);  // eslint-disable-line
  }

  handleChange(val) {
    const clonedVal = val;
    // New Value to insert in the list
    clonedVal.checked = true; //Set checkbox as checked
    this.setState({
      list: this.state.list.concat([clonedVal])
    });

    // Filter list
    // Once item is inserted as checkbox Remove it from drop down list
    this.setState({
      searchableList: filter(this.state.searchableList, function(o) {
        return o.id !== clonedVal.id;
      })
    });
  }

  handleLogChange(val) {
    if (val.length) {
      for (const o of val) {
        console.log(o.value, o.label);  // eslint-disable-line
      }
    } else {
      console.log(val.value, val.label);  // eslint-disable-line
    }
  }

  handleToggleManuaLoading() {
    this.setState({ manualLoading: !this.state.manualLoading });
  }

  // Group Option render
  renderGroupOptions(elem) {
    const {
      key,
      ...others
    } = elem;
    return <GroupOptItem {...others} key={key} keyValue={key} />;
  }

  // Custom Select Filter to keep header
  handleCustomFilter(options, filter) { //currentValues
    let nOptions = emailTypes;
    if (filter) {
      nOptions = emailTypes.map(header => {
        const nChild = header.children.map(item => {
          const nItems = Object.assign({}, item);
          nItems.children = nItems.children.filter(child => (
            child.toLowerCase().indexOf(filter.toLowerCase()) > -1
          ));
          return nItems;
        });

        let headerHasContent = false;
        nChild.map(o => {
          if (o.children.length) headerHasContent = true;
          return o;
        });

        const nHeader = {
          ...header,
          children: nChild,
          noResults: !(filter && headerHasContent)
        };

        return nHeader;
      });
    }

    // Remove categories without results when a filter is applied
    const onlyHeaderWithContent = nOptions.filter(obj => !obj.noResults);

    return this.getNestedData(onlyHeaderWithContent);
  }

  // Metadata functions
  handleAddMetadata(data) {
    const item = this.state.valuesList.find((obj) => obj.id === data.id);
    this.setState({
      valuesSelected: [
        ...this.state.valuesSelected,
        item
      ]
    });
  }

  handleRemoveMetadata(event, context) {
    const list = this.state.valuesSelected.filter((obj) => obj.id !== context.valueSelected.id);
    this.setState({
      valuesSelected: [...list]
    });
  }

  handleValueChanged(nextValue, prevValue) {
    const list = [...this.state.searchableList];
    const item = list.find((obj) => obj.id === nextValue.id);
    item.id = nextValue.id;
    item.attributeValue = nextValue.attributeValue;

    this.setState({
      searchableList: list
    });
  }

  handleMetadataChanged(nextValue, prevValue) {
    const list = [...this.state.valuesSelected];
    const item = list.find((obj) => obj.id === prevValue.id);
    item.id = nextValue.id;
    item.attributeValue = nextValue.attributeValue;

    this.setState({
      valuesSelected: list
    });
  }

  render() {
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

    return (
      <section id="SelectView">
        <h1>Select</h1>
        <Docs {...SelectDocs} />

        <h3>Fixed options</h3>
        <p>Single select box with label.</p>
        <ComponentItem>
          <Select
            id="fixed"
            name="fixed"
            label="Select an option"
            value={this.state.fixedSelected}
            options={fixedOptions}
            searchable={false}
            placeholder="Choose one value!"
            onChange={this.handleFixedChange}
          />
        </ComponentItem>

        <h3>Group options</h3>
        <p>Single select box without label and custom render.</p>
        <ComponentItem>
          <Select
            value={this.state.groupOption}
            options={this.getNestedData()}
            name="optGroup"
            labelKey="name"
            valueKey="id"
            searchable
            placeholder="Choose one value!"
            onChange={this.handleNestedChange}

            //onInputChange={() => this._customOptionHeightsSelect && this._customOptionHeightsSelect.recomputeOptionHeights()}
            valueComponent={(option) => (<span className="Select-value">
              {option.value.subheader && <span style={{ color: 'var(--secondary-text)' }}>{option.value.subheader}: </span>}
              <span className="Select-value-label">{option.value.name}</span>
            </span>)}
            filterOptions={this.handleCustomFilter}
            optionHeight={({ option }) => option.type === 'header' ? 25 : 35}
            optionRenderer={this.renderGroupOptions}
            ref={(ref) => this._customOptionHeightsSelect = ref}
          />
        </ComponentItem>

        <h3>Async options</h3>
        <p>Populated using <code>loadOptions</code>, allows multiple selections with <code>multi</code></p>
        <ComponentItem>
          <Select
            async
            label="Calls loadOptions"
            name="async"
            value={this.state.asyncSelected}
            loadOptions={this.getOptions}
            onChange={this.handleSyncChange}
            placeholder="Please search me!"
            clearable={false}
            multi
          />
        </ComponentItem>

        <h3>Manual loading</h3>
        <p>Loading can be set manually via <code>isLoading</code>. This is useful if handling your fetch calls manually.</p>
        <p><Btn onClick={this.handleToggleManuaLoading}>Toggle Loading</Btn></p>
        <ComponentItem>
          <Select
            label="Loading forever"
            name="loading"
            onChange={this.handleLogChange}
            placeholder="I will never complete my mission..."
            isLoading={this.state.manualLoading}
            clearable={false}
          />
        </ComponentItem>

        <h3>Custom Search drop down options</h3>
        <ul>
          <li><strong>name</strong> <code>string</code> field name</li>
          <li><strong>placeholder</strong> <code>string</code></li>
          <li><strong>onChange</strong> <code>func</code> - callback function when onChange is triggered</li>
          <li><strong>itemList</strong> <code>function</code> - populate using <code>loadOptions</code> <code>{'Ex: {name: Channel name, id: 3, count: 31, type: channels, childType: stories, color: #ff0000, thumbnail: http://link}'}</code></li>
        </ul>

        <ComponentItem>
          <SelectSearchList
            name="MyCustomInput"
            placeholder="Select Something"
            itemList={this.getCustomOptions}
            onChange={this.handleValueChanged}
          />
        </ComponentItem>

        <h3>Custom Add Search button</h3>
        <ul>
          <li><strong>name</strong> <code>string</code> field name</li>
          <li><strong>btnLabel</strong> <code>string</code></li>
          <li><strong>placeholder</strong> <code>string</code></li>
          <li><strong>onChange</strong> <code>func</code> - callback function when onChange is triggered</li>
          <li><strong>itemList</strong> <code>function</code> - populate using <code>loadOptions</code> <code>{'Ex: {term: Channel name, id: 3, count: 31, type: channels, childType: stories color: #ff0000, thumbnail: http://link}'}</code></li>
        </ul>

        <ComponentItem>
          <ul>
            {this.state.list.map(result => (
              <li key={result.id}>
                <Checkbox
                  name="test-checkbox"
                  label={result.term}
                  key={result.id}
                  value={result.id}
                  defaultChecked={result.checked}
                  onChange={this.handleLogChange}
                />
              </li>
            ))}
          </ul>

          <BtnAddSearch
            name="MyBtnCustomSearch"
            placeholder="Search"
            btnLabel="Add"
            itemList={this.getCustomOptions}
            onChange={this.handleChange}
          />
        </ComponentItem>

        <h3>User Metadata Custom dropdown</h3>
        <ul>
          <li><strong>name</strong> <code>string</code> field name</li>
        </ul>

        <ComponentItem>
          <AdminMetadataList
            attributeList={this.state.attributes}
            valuesSelectedList={this.state.valuesSelected}
            loaded
            onAdd={this.handleAddMetadata}
            onDelete={this.handleRemoveMetadata}
            onChange={this.handleMetadataChanged}
          />
        </ComponentItem>
      </section>
    );
  }
}
