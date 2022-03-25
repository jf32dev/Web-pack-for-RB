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
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';
import Select from 'components/Select/Select';

import SelectSearch from 'components/SelectSearch/SelectSearch';

const SelectSearchDocs = require('!!react-docgen-loader!components/SelectSearch/SelectSearch.js');

const staticLists = {
  categories: require('../../static/categories.json'),
  channels: require('../../static/channels.json'),
  forms: require('../../static/forms.json'),
  groups: require('../../static/groups.json'),
  stories: require('../../static/stories.json'),
  tabs: require('../../static/tabs.json'),
  users: require('../../static/users.json'),
};

export default class SelectSearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeList: ['groups'],
      items: staticLists.groups,
      selectedOptions: [],
      inputValue: '',
      isLoading: false
    };
    autobind(this);

    this.selectSearch = null;
  }

  getStaticLists(values) {
    const newItems = [];
    values.forEach((v) => {
      let key = v;
      if (typeof key === 'object') {
        key = v.value;
      }
      newItems.push(...staticLists[key]);
    });
    return newItems;
  }

  searchList(list, keyword = '') {
    let newList = list;
    if (keyword) {
      newList = list.filter(i => i.name.indexOf(keyword) > -1);
    }
    return newList;
  }

  handleFocusInput() {
    this.selectSearch.focusInput();
  }

  handleToggleLoading() {
    this.setState({
      isLoading: !this.state.isLoading
    });
  }

  handleListSourceChange(values) {
    return this.setState({
      activeList: values,
      items: this.getStaticLists(values)
    });
  }

  handleSelectSearchChange(selectedOptions) {
    this.setState({
      selectedOptions: selectedOptions
    });
  }

  handleSelectSearchInputChange(event) {
    const value = event.currentTarget.value;
    const freshList = this.getStaticLists(this.state.activeList);

    this.setState({
      inputValue: value,
      items: this.searchList(freshList, value)
    });
  }

  render() {
    const {
      activeList,
      items,
      inputValue,
      selectedOptions,
      isLoading
    } = this.state;

    // List source options
    const options = Object.keys(staticLists).map((key) => ({
      label: key,
      value: key,
      selected: key.indexOf(activeList) > -1
    }));

    return (
      <section id="SelectSearchView">
        <h1>SelectSearch</h1>
        <Docs {...SelectSearchDocs} />
        <Debug>
          <pre style={{ maxHeight: '16rem', width: '20rem', textAlign: 'left' }}>
            <code>inputValue: {JSON.stringify(inputValue, null, '  ')}</code>
            <code>selectedOptions: {JSON.stringify(selectedOptions, null, '  ')}</code>
          </pre>
          <Btn small onClick={this.handleFocusInput}>Focus input</Btn>
          <Btn small inverted={isLoading} onClick={this.handleToggleLoading}>isLoading</Btn>
        </Debug>

        <Select
          id="list-sources"
          name="activeList"
          label="List Sources"
          clearable={false}
          options={options}
          value={activeList}
          multi
          style={{ maxWidth: '26rem' }}
          onChange={this.handleListSourceChange}
        />

        <ComponentItem>
          <SelectSearch
            ref={(c) => { this.selectSearch = c; }}
            id="select-search"
            items={items}
            isLoading={isLoading}
            width={320}
            placeholder="Add Groups or People"
            inputValue={inputValue}
            onChange={this.handleSelectSearchChange}
            onInputChange={this.handleSelectSearchInputChange}
          />
        </ComponentItem>
      </section>
    );
  }
}
