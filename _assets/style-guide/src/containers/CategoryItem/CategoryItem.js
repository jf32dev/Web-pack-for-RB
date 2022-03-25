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

import CategoryItem from 'components/CategoryItem/CategoryItem';
import CategorySettings from 'components/CategorySettings/CategorySettings';

const CategoryItemDocs = require('!!react-docgen-loader!components/CategoryItem/CategoryItem.js');
const CategorySettingsDocs = require('!!react-docgen-loader!components/CategorySettings/CategorySettings.js');

const categories = require('../../static/categories.json');

export default class CategoryItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: false,
      width: 'auto',
      lastClick: null,

      category: categories[0],
      sortOrder: 'name'
    };
    autobind(this);
  }

  handleClick(event, form) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor CategoryItem
    if (!href) {
      this.setState({ lastClick: form.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  handleEditClick(event) {
    event.preventDefault();
    this.setState({ lastClick: 'edit clicked' });
  }

  handleSortOrderChange(selected) {
    this.setState({
      sortOrder: selected.value,
      lastClick: 'sort order: ' + selected.value
    });
  }

  render() {
    const { grid, width, lastClick } = this.state;

    return (
      <section id="CategoryItem">
        <h1>CategoryItem</h1>
        <Docs {...CategoryItemDocs} />
        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem style={{ width: width }}>
          <CategoryItem
            {...categories[0]}
            grid={grid}
            onClick={this.handleClick}
          />
          <CategoryItem
            {...categories[1]}
            grid={grid}
            isChecked
            onClick={this.handleClick}
          />
          <CategoryItem
            {...categories[2]}
            grid={grid}
            isActive
            noLink
            onClick={this.handleClick}
          />
        </ComponentItem>

        <h2>CategorySettings</h2>
        <Docs {...CategorySettingsDocs} />
        <ComponentItem>
          <CategorySettings
            category={this.state.category}
            sortOrder={this.state.sortOrder}
            showEdit
            onAnchorClick={this.handleClick}
            onEditClick={this.handleEditClick}
            onSortOrderChange={this.handleSortOrderChange}
          />
        </ComponentItem>
      </section>
    );
  }
}
