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
 * @author Rubenson Barrios <ruebnson.barrios@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';

import React, { Component } from 'react';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import { Metadata } from 'components';

const MetadataDocs = require('!!react-docgen-loader!components/Metadata/Metadata.js');
const metadata = require('../../static/metadata.json');
const categories = require('../../static/metadataCategories.json');

export default class MetadataView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isThereEmpty: false,
      list: metadata,
      currency: categories.currency,
      entities: categories.entities,
      properties: categories.properties,
    };
  }

  handleAddItem(e, type) {
    if (!this.state.isThereEmpty) {
      const list = this.state.list;
      const tmpId = uniqueId('new');

      list.push({
        metadataId: tmpId,
        categoryId: type,
        propertyId: 0,
        value: '',
        isEmpty: true,
        isNew: true,
      });

      this.setState({ list: list, isThereEmpty: true });
    }
  }
  handleDeleteItem(state) {
    let list = this.state.list;
    list = list.filter(obj => obj.metadataId !== state.metadataId);

    // Check if item deleted was empty and toggle flag
    const emptyItem = this.state.list.find(obj => obj.isNew);
    if (emptyItem && emptyItem.metadataId === state.metadataId) {
      this.setState({ list: list, isThereEmpty: false });
    } else {
      this.setState({ list: list });
    }
  }
  handleChange(state) {
    const list = this.state.list;
    const item = list.find(obj => obj.metadataId === state.metadataId);

    // Set new property id and value
    if (item) {
      item.propertyId = state.propertyId;
      item.value = state.value;
    }

    if (item.isNew) {
      item.isNew = false;
      this.setState({ list: list, isThereEmpty: false });
    } else {
      this.setState({ list: list });
    }
  }

  render() {
    const entityMarketing = this.state.entities.find(obj => obj.id === 1);
    const marketingItems = this.state.list.filter(obj => obj.categoryId === entityMarketing.id);

    const entityCRM = this.state.entities.find(obj => obj.id === 2);
    const crmItems = this.state.list.filter(obj => obj.categoryId === entityCRM.id);

    const containerStyle = {
      display: 'flex',
      'flexWrap': 'wrap',
      'alignItems': 'stretch',
      'alignContent': 'stretch',
    };

    return (
      <section id="ModalView">
        <h1>Metadata</h1>
        <Docs {...MetadataDocs} />

        <ComponentItem>
          <div style={containerStyle}>
            <Metadata
              entity={entityMarketing}
              currency={this.state.currency}
              items={marketingItems}
              addItem
              deleteItem
              disableAddButton={this.state.isThereEmpty}
              onAdd={::this.handleAddItem}
              onDelete={::this.handleDeleteItem}
              onChange={::this.handleChange}
            />

            <Metadata
              entity={entityCRM}
              currency={this.state.currency}
              items={crmItems}
              addItem
              deleteItem
              disableAddButton={this.state.isThereEmpty}
              onAdd={::this.handleAddItem}
              onDelete={::this.handleDeleteItem}
              onChange={::this.handleChange}
            />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
