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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import { InterestAreaItem } from 'components';

const InterestAreaItemDocs = require('!!react-docgen-loader!components/InterestAreaItem/InterestAreaItem.js');
const interestAreaList = require('../../static/interestArea.json');

export default class InterestAreaItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      list: interestAreaList
    };

    autobind(this);
  }

  handleClick(event, item) {
    const list = this.state.list;
    const obj = list.find(ia => ia.id === item.props.id);
    obj.selected = !obj.selected;
    this.setState({ list: list });
  }

  handleToggleGrid() {
    this.setState({ grid: !this.state.grid });
  }

  render() {
    const { grid } = this.state;

    return (
      <section id="WebItemView">
        <h1>InterestAreaItem</h1>
        <Docs {...InterestAreaItemDocs} />
        {/*<p><Btn onClick={this.handleToggleGrid}>Toggle Grid/List</Btn></p>*/}

        <h2>{grid ? 'Grid' : 'List'}</h2>
        <ComponentItem>
          <InterestAreaItem
            onClick={this.handleClick}
            grid={grid}
            showThumb
            {...this.state.list[0]}
          />
          <InterestAreaItem
            onClick={this.handleClick}
            grid={grid}
            showThumb
            {...this.state.list[1]}
          />
          <InterestAreaItem
            onClick={this.handleClick}
            grid={grid}
            showThumb
            {...this.state.list[2]}
          />
          <InterestAreaItem
            onClick={this.handleClick}
            grid={grid}
            showThumb
            {...this.state.list[3]}
          />
        </ComponentItem>
      </section>
    );
  }
}
