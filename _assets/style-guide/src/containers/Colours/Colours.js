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

import request from 'superagent';
import tinycolor from 'tinycolor2';
import platform from 'platform';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import Select from 'react-select';
import {
  Btn,
  Breadcrumbs,
  ColourPalette,
  ColourPicker,
  ColourScheme,
  Checkbox,
  Loader,
  Radio,
  StoryItem,
  Tags,
  Text
} from 'components';

const ColourSchemeDocs = require('!!react-docgen-loader!components/ColourScheme/ColourScheme.js');

const paths = [{
  name: 'Two Levels',
  path: '/Breadcrumbs'
}, {
  name: 'Second Path',
  path: '/Breadcrumbs/SecondPath'
}];

const stories = require('../../static/stories.json');

export default class ColoursView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkboxChecked: true,

      darkBaseColor: '#B03100',
      baseColor: '#F26724',
      lightBaseColor: '#FBD4BF',
      baseText: '#ffffff',

      accentColor: '#1e70c9',
      primaryText: '#222222',
      secondaryText: '#777777',
      dividerColor: '#dddddd',

      activeVar: null
    };

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    // Fetch vars
    const self = this;
    let file = './scheme.json';
    if (process.env.NODE_ENV !== 'production') {
      file = './build/scheme.json';
    }

    request.get(file).end(function(err, res) {
      if (err) {
        console.log(err);
      } else {
        self.setPropertySelectors(res.body);
      }
    });
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextState.propertySelectors !== this.state.propertySelectors) {
      console.info('Selectors loaded');
      console.log(nextState.propertySelectors);
    }
  }

  setPropertySelectors(vars) {
    if (vars) {
      this.setState({ propertySelectors: vars });
    }
  }

  generateColorScheme(baseColor = this.state.baseColor) {
    const color = tinycolor(baseColor);
    const contrast = tinycolor.readability(baseColor, '#fff');
    const limit = 1.65;  // contrast before switching from light/dark text

    const newbaseText = contrast < limit ? '#222222' : '#FFFFFF';

    const darkBaseColor = color.clone().darken(15).toString();
    const lightBaseColor = color.clone().lighten(35).toString();
    const accentColor = color.clone().spin(180).toString();

    this.setState({
      baseColor: color.toString(),
      darkBaseColor: darkBaseColor,
      lightBaseColor: lightBaseColor,
      accentColor: accentColor,
      baseText: newbaseText,

      contrast: contrast
    });
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  handlePageClick() {
    this.setState({ activeVar: null });
  }

  handleRandomClick() {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.generateColorScheme(hex);
  }

  handleColourClick(event) {
    event.stopPropagation();
    const varName = event.target.dataset.id;
    this.setState({
      activeVar: varName
    });
  }

  handleCheckboxChange(event) {
    this.setState({
      checkboxChecked: event.currentTarget.checked
    });
  }

  handleDarkBaseColorChange(event) {
    this.setState({
      darkBaseColor: event.currentTarget.value
    });
  }

  handleBaseColorChange(colour) {
    this.generateColorScheme(colour.hex);
  }

  handleLightBaseColorChange(event) {
    this.setState({
      lightBaseColor: event.currentTarget.value
    });
  }

  handleBaseTextChange(event) {
    this.setState({
      baseText: event.currentTarget.value
    });
  }

  handleAccentColorChange(event) {
    this.setState({
      accentColor: event.currentTarget.value
    });
  }

  handlePrimaryTextChange(event) {
    this.setState({
      primaryText: event.currentTarget.value
    });
  }

  handleSecondaryTextChange(event) {
    this.setState({
      secondaryText: event.currentTarget.value
    });
  }

  handleDividerColorChange(event) {
    this.setState({
      dividerColor: event.currentTarget.value
    });
  }

  render() {
    const {
      propertySelectors,

      darkBaseColor,
      baseColor,
      lightBaseColor,
      baseText,
      accentColor,
      primaryText,
      secondaryText,
      dividerColor,

      activeVar,
      contrast
    } = this.state;
    const name = platform.name.toLowerCase();
    const version = parseFloat(platform.version, 10);

    return (
      <section id="colours-page" onClick={this.handlePageClick}>
        <h1>Colours</h1>
        <p>Colours are defined using CSS Custom Properties, also known as <a href="https://developers.google.com/web/updates/2016/02/css-variables-why-should-you-care" target="_blank" rel="noopener noreferrer">CSS variables</a>.</p>
        <p>CSS Variable currently <a href="http://caniuse.com/#search=css%20variables" target="_blank" rel="noopener noreferrer">have support</a> in: Chrome 49, Edge 15.15063, Firefox 31, Safari 9.1, and iOS Safari 9.3.</p>
        <p>Fallbacks are provided automatically using <code>postcss-custom-properties</code>.</p>
        <p>Note our variables use the American spelling of <strong>color</strong> to match CSS naming conventions.</p>
        <p>Detected Browser: {name} {version}</p>

        <Debug>
          <Btn small inverted onClick={this.handleRandomClick}>Random</Btn>
          <p>activeVar: {activeVar}</p>
          <p>Contrast: {contrast}</p>
        </Debug>

        <h2>ColourScheme</h2>
        <Docs {...ColourSchemeDocs} />
        {propertySelectors && <ColourScheme
          varSelectors={propertySelectors}
          //forceFallback
          vars={{
            darkBaseColor: darkBaseColor,
            baseColor: baseColor,
            lightBaseColor: lightBaseColor,
            baseText: baseText,

            accentColor: accentColor,
            primaryText: primaryText,
            secondaryText: secondaryText,
            dividerColor: dividerColor
          }}
        />}

        <div style={{ position: 'relative' }}>
          <ColourPalette
            vars={{
              darkBaseColor: darkBaseColor,
              baseColor: baseColor,
              lightBaseColor: lightBaseColor,
              baseText: baseText,

              accentColor: accentColor,
              primaryText: primaryText,
              secondaryText: secondaryText,
              dividerColor: dividerColor
            }}
            onColourClick={this.handleColourClick}
          />
          <ColourPicker
            hex={baseColor}
            isVisible={!!activeVar}
            onChange={this.handleBaseColorChange}
            style={{ position: 'absolute', top: '-15rem', right: '2rem' }}
          />
        </div>

        <h2>Scheme Examples</h2>
        <p>Examples of components when colours are modified.</p>

        <ComponentItem>
          <StoryItem
            thumbSize="medium"
            showThumb
            showBadges
            onClick={this.handleAnchorClick}
            {...stories[1]}
          />
        </ComponentItem>

        <ComponentItem>
          <Text
            id="example1"
            label="Default"
            defaultValue="Fixed"
          />
        </ComponentItem>

        <ComponentItem>
          <Btn icon="like" inverted large>Like</Btn>
        </ComponentItem>

        <ComponentItem>
          <Breadcrumbs
            paths={paths}
            noLink
            onPathClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <ComponentItem>
          <Checkbox
            label="Checkbox"
            name="checkbox"
            value="any value"
            checked={this.state.checkboxChecked}
            onChange={this.handleCheckboxChange}
          />
          <br />
          <Radio
            label="Radio"
            checked={this.state.checkboxChecked}
            onChange={this.handleCheckboxChange}
          />
        </ComponentItem>

        <ComponentItem style={{ display: 'flex', justifyContent: 'center' }}>
          <Loader type="content" />
        </ComponentItem>

        <ComponentItem>
          <Tags
            list={['test', 'data', 'contest', 'something', 'dummy']}
            alt
          />
        </ComponentItem>

        <ComponentItem>
          <Select
            name="fixed"
            searchable={false}
            placeholder={'Choose one value!'}
          />
        </ComponentItem>
      </section>
    );
  }
}
