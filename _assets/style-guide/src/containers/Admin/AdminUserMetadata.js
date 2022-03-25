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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _camelCase from 'lodash/camelCase';

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import AdminUserMetadata from 'components/Admin/AdminUserMetadata/AdminUserMetadata';

const AdminUserMetadataDocs = require('!!react-docgen-loader!components/Admin/AdminUserMetadata/AdminUserMetadata.js');
const userMetadata = require('../../static/admin/userMetadata.json');

const camelcaseTransfer = item => (Object.keys(item).reduce((obj, key) => {
  if (Array.isArray(item[key])) {
    return {
      ...obj,
      [_camelCase(key)]: item[key].map(arrayItem => Object.keys(arrayItem).reduce((arrayObj, arrayKey) => ({
        ...arrayObj,
        [_camelCase(arrayKey)]: arrayItem[arrayKey]
      }), {}))
    }
  } else {
    return {
      ...obj,
      [_camelCase(key)]: item[key]
    }
  }
}, {}))

export default class AdminUserMetadataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      list: userMetadata.map(item => ({
        ...item,
        values: item.values ? item.values.map((obj, i) => ({
          ...obj,
          sortId: i,
          name: obj.attribute_value,
        })) : []
      }))
    };
    autobind(this);
  }

  componentDidMount() {
    this.setState({
      loaded: true
    })
  }

  handleUpdate(update) {
    const { list } = this.state;
    this.setState({
      list: list.map(item => (+item.id === +update.id ? update : item)),
    });
  }

  handleRemove(id) {
    const { list } = this.state;
    console.log(id);
    this.setState({
      list: list.filter(item => +item.id !== +id)
    });
  }

  render() {
    const { list, loaded } = this.state;
    return (
      <section id="BlankView">
        <h1>Admin Custom User Metadata View</h1>
        <Docs {...AdminUserMetadataDocs} />
        <ComponentItem>
          <AdminUserMetadata
            isListUpdated={loaded}
            list={list}
            onUpdate={this.handleUpdate}
            onRemove={this.handleRemove}
          />
        </ComponentItem>
      </section>
    );
  }
}
