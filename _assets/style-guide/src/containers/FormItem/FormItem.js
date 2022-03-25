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

import FormItem from 'components/FormItem/FormItem';

const FormItemDocs = require('!!react-docgen-loader!components/FormItem/FormItem.js');

const forms = require('../../static/forms.json');

export default class FormItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      showCheckbox: false,
      width: 'auto',
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, form) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor FormItem
    if (!href) {
      this.setState({ lastClick: form.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleShowCheckbox() {
    this.setState({ showCheckbox: !this.state.showCheckbox });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  handleEditClick(event) {
    event.preventDefault();
    this.setState({ lastClick: 'edit clicked' });
  }

  render() {
    const { grid, showCheckbox, width, lastClick } = this.state;

    return (
      <section id="FormItemView">
        <h1>FormItem</h1>
        <Docs {...FormItemDocs} />
        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={showCheckbox} onClick={this.handleToggleShowCheckbox}>showCheckbox</Btn>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem style={{ width: width }}>
          <FormItem
            {...forms[0]}
            grid={grid}
            showCheckbox={showCheckbox}
            onClick={this.handleClick}
          />
          <FormItem
            {...forms[1]}
            grid={grid}
            isChecked
            showCheckbox={showCheckbox}
            onClick={this.handleClick}
          />
          <FormItem
            {...forms[2]}
            grid={grid}
            showCheckbox={showCheckbox}
            isActive
            noLink
            onClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
