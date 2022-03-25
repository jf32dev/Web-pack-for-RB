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

import uniqueId from 'lodash/uniqueId';
import React, { Component, Fragment } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import { Btn, Accordion } from 'components';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live';

import parseLiveSourceEditor from 'helpers/parseLiveSourceEditor';

const BtnDocs = require('!!react-docgen-loader!components/Btn/Btn.js');

export default class BtnView extends Component {
  handleClick(event) {
    event.preventDefault();
    console.log(event);
  }

  render() {
    const buttonsArr = [
      {
        heading: 'Default',
        text: <p>The default button uses the <code>--base-color</code> variable.</p>,
        buttons: [
          <Btn small>Small Button</Btn>,
          <Btn href="#" small onClick={this.handleClick}>Small anchor</Btn>,
          <Btn>Default button</Btn>,
          <Btn href="#" onClick={this.handleClick}>Default anchor</Btn>,
          <Btn large>Large button</Btn>,
          <Btn href="#" large onClick={this.handleClick}>Large anchor</Btn>
        ]
      },
      {
        heading: 'With count',
        text: <p>Pass <code>counter</code> to display a number.</p>,
        buttons: [
          <Btn icon="like" counter={1} small>Like</Btn>,
          <Btn href="#" icon="facebook" counter={7} onClick={this.handleClick}>Like</Btn>,
          <Btn icon="like" counter={113} large>Like</Btn>
        ]
      },
      {
        heading: 'Inverted',
        buttons: [
          <Btn icon="plus" inverted small>Optional Text</Btn>,
          <Btn href="#" icon="like" inverted onClick={this.handleClick} />,
          <Btn icon="apple" inverted large>Big Me</Btn>
        ]
      },
      {
        heading: 'Warning/Delete',
        buttons: [
          <Btn icon="plus" warning small>Optional Text</Btn>,
          <Btn href="#" icon="like" warning onClick={this.handleClick} />,
          <Btn icon="apple" warning inverted large>Big Me</Btn>
        ]
      },
      {
        heading: 'Borderless',
        buttons: [
          <Btn icon="plus" borderless small>Optional Text</Btn>,
          <Btn href="#" icon="comment" borderless>Optional Text</Btn>,
          <Btn icon="like" borderless large>Optional Text</Btn>
        ]
      },
      {
        heading: 'Alt Style',
        text: <p>Commonly used as a secondary action on modal windows and confirm dialogs.</p>,
        buttons: [
          <Btn icon="lock" alt small>Optional Text</Btn>,
          <Btn href="#" icon="music" alt onClick={this.handleClick} />,
          <Btn icon="refresh" alt inverted large>Cancel</Btn>
        ]
      },
      {
        heading: 'Disabled state',
        text: <p>Disable <code>&lt;button&gt;</code> with the <code>disabled</code> prop.</p>,
        buttons: [
          <Btn disabled small>Disabled button</Btn>,
          <Btn href="#" onClick={this.handleClick} disabled inverted>Disabled button</Btn>,
          <Btn icon="web" disabled large alt>Disabled button</Btn>
        ]
      },
      {
        heading: 'Loading state',
        text: <p>In some cases you may need to add a loading indicator to a <code>&lt;button&gt;</code>, do this with the <code>loading</code> prop. The <code>loading</code> is paired with <code>disabled</code> to prevent events.</p>,
        buttons: [
          <Btn loading small>Button</Btn>,
          <Btn icon="apple" href="#" onClick={this.handleClick} alt loading>Button</Btn>,
          <Btn icon="android" loading large warning>Button</Btn>
        ]
      }
    ]

    const scope = { Component, autobind, Btn };
    const backgroundColor = { backgroundColor: '#333' };
    const exampleCode = `<Btn icon="android" loading large warning counter={109}>Button</Btn>`;
    const componentName = `BtnView`;

    const buttons = buttonsArr.map((obj) => {
      const btn = obj.buttons;
      const text = obj.hasOwnProperty('text') && obj.text

      return (
        <Fragment key={uniqueId(text)}>
          <h2>{obj.heading}</h2>
          {text}
          <ComponentItem>
            {btn}
          </ComponentItem>
        </Fragment>
      )
    })

    return (
      <section id="BtnView">
        <h1>Btn</h1>
        <Docs {...BtnDocs} />
        {buttons}

        <h3>Play Ground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(`exampleValue:'',`, [], exampleCode, componentName)}>
          <LivePreview />
          <Accordion title="source" position="left" style={{ borderBottom: '1px solid #ddd', marginBottom: '3rem', paddingBottom: '1rem' }}>
            <div style={backgroundColor}>
              <LiveEditor />
            </div>
          </Accordion>
          <LiveError />
        </LiveProvider>
      </section>
    );
  }
}
