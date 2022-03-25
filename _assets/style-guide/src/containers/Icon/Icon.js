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
import Docs from '../../views/Docs';

import Icon from 'components/Icon/Icon';

const IconDocs = require('!!react-docgen-loader!components/Icon/Icon.js');

export default class IconView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  render() {
    const style = {
      marginRight: '0.5rem'
    };

    return (
      <section id="IconView">
        <h1>Icon</h1>
        <Docs {...IconDocs} />

        <ComponentItem>
          <Icon name="calendar" colour="#9A00FF" style={style} />
          <Icon name="cloud" size={32} colour="#0700FF" style={style} />
          <Icon name="comment" size={48} colour="#0099FF" style={style} />
          <Icon name="edit" size={64} colour="#00FF7E" style={style} />
          <Icon name="facebook" size={96} colour="#5CFF00" style={style} />
          <Icon name="like" size={112} colour="#FFF400" style={style} />
          <Icon name="quicklink" size={128} colour="#FF8F00" style={style} />
          <Icon name="subscribe-fill" size={144} colour="#FF2300" style={style} />
          <Icon name="twitter" size={160} colour="#FF004F" style={style} />
          <Icon name="user" size={176} colour="#FF009C" style={style} />
          <Icon name="wheelbarrow" size={192} colour="#FF00DE" style={style} />
        </ComponentItem>
      </section>
    );
  }
}
