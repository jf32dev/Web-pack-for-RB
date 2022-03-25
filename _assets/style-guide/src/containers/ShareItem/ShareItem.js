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
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';

import ShareItem from 'components/ShareItem/ShareItem';
import ShareItemNew from 'components/ShareItemNew/ShareItemNew';

const ShareItemDocs = require('!!react-docgen-loader!components/ShareItem/ShareItem.js');
const ShareItemNewDocs = require('!!react-docgen-loader!components/ShareItemNew/ShareItemNew.js');

const shares = require('../../static/shares.json');

const messages = defineMessages({
  noSubject: { id: 'no-subject', defaultMessage: 'No Subject' }
});

export default class ShareItemView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      grid: false,
      width: 'auto',
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, context) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor ShareItem
    if (!href) {
      this.setState({ lastClick: context.props ? context.props.id : context.id });
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

  render() {
    const { grid, width, lastClick } = this.state;

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    return (
      <section id="ShareItemView">
        <h1>ShareItemNew</h1>
        <Docs {...ShareItemNewDocs} />
        <ComponentItem>
          <ShareItemNew
            {...shares[10]}
            isActive
            strings={strings}
            thumbSize="small"
            onClick={this.handleClick}
          />
          <ShareItemNew
            {...shares[11]}
            strings={strings}
            thumbSize="small"
            onClick={this.handleClick}
          />
          <ShareItemNew
            {...shares[12]}
            strings={strings}
            thumbSize="small"
            onClick={this.handleClick}
          />
        </ComponentItem>
        <h1>ShareItem - Legacy</h1>
        <Docs {...ShareItemDocs} />
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
          <ShareItem
            {...shares[0]}
            grid={grid}
            thumbSize={grid ? 'large' : 'small'}
            onClick={this.handleClick}
          />
          <ShareItem
            {...shares[1]}
            grid={grid}
            isActive
            thumbSize={grid ? 'large' : 'small'}
            onClick={this.handleClick}
          />
          <ShareItem
            {...shares[2]}
            grid={grid}
            thumbSize={grid ? 'large' : 'small'}
            noLink
            onClick={this.handleClick}
          />
          <ShareItem
            {...shares[3]}
            grid={grid}
            thumbSize={grid ? 'large' : 'small'}
            noLink
            onClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
