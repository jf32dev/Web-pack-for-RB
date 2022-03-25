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
import WelcomeScreens from 'components/WelcomeScreens/WelcomeScreens';

const WelcomeScreensDocs = require('!!react-docgen-loader!components/WelcomeScreens/WelcomeScreens.js');

const slides = [
  {
    title: 'Page One',
    description: '<p>Hello</p>'
  },
  {
    title: 'Page Two',
    description: '<p>There</p>'
  },
  {
    title: 'Page Three',
    description: '<p>How</p>'
  },
  {
    title: 'Page Four',
    description: '<p>are</p>'
  },
  {
    title: 'Page Five',
    description: '<p>you?</p>'
  }
];

export default class WelcomeScreensView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      lastClick: '',
      buttonType: 'accept'
    };
    autobind(this);
  }

  handleToggleIsVible() {
    this.setState({
      isVisible: !this.state.isVisible
    });
  }

  handleToggleButtonType() {
    this.setState({
      buttonType: this.state.buttonType === 'accept' ? 'done' : 'accept'
    });
  }

  handleAcceptClick(event) {
    event.preventDefault();
    this.setState({
      isVisible: false,
      lastClick: 'accept'
    });
  }

  handleDenyClick(event) {
    event.preventDefault();
    this.setState({
      isVisible: false,
      lastClick: 'deny'
    });
  }

  render() {
    const { buttonType, isVisible, lastClick } = this.state;

    return (
      <section id="WelcomeScreensView">
        <h1>WelcomeScreens</h1>
        <Docs {...WelcomeScreensDocs} />
        <Debug>
          <div>
            <Btn small inverted={isVisible} onClick={this.handleToggleIsVible}>isVisible</Btn>
            <Btn small inverted={buttonType === 'done'} onClick={this.handleToggleButtonType}>buttonType: {buttonType}</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem>
          <WelcomeScreens
            buttonType={buttonType}
            slides={slides}
            isVisible={isVisible}
            onAcceptClick={this.handleAcceptClick}
            onDenyClick={this.handleDenyClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
