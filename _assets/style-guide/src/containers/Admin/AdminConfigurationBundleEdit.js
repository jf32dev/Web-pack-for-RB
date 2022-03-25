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
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import AdminConfBundleDetails from 'components/Admin/AdminConfBundleDetails/AdminConfBundleDetails';

const ConfigurationBundleDocs = require('!!react-docgen-loader!components/ConfigurationBundleItem/ConfigurationBundleItem.js');

const confBundleList = require('../../static/admin/configurationBundle.json');

export default class AdminConfigurationBundleEdit extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSection: 'current',
      test: false,
      confBundleList: confBundleList
    };
    autobind(this);
  }

  handleAttributeChange(attribute, value) {
    const section = this.state.activeSection;
    const bundles = { ...this.state.confBundleList };

    Object.keys(bundles[section]).map((group) => {
      const tmpGroup = group;
      const bundle = bundles[section][tmpGroup].find(obj => obj.id === attribute);
      if (bundle) bundle.value = value;
      return tmpGroup;
    });

    this.setState({
      confBundleList: bundles
    });
  }

  render() {
    const {
      lastClick
    } = this.state;

    const settings = this.state.confBundleList[this.state.activeSection];
    console.log(settings);

    return (
      <section id="NavMenuView">
        <h1>Configuration Bundle Edit</h1>
        <Docs {...ConfigurationBundleDocs} />

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>Configuration bundle Create/ Edit</h2>
        <p>Configuration bundle components for Edit UI.</p>

        <ComponentItem style={{ position: 'relative', width: '100%', paddingTop: '3rem' }}>
          {Object.keys(settings).map((section) => (
            <AdminConfBundleDetails
              key={section}
              onChange={this.handleAttributeChange}
              header={section}
              description={section + ' Description'}
              list={settings[section]}
            />
          ))}
        </ComponentItem>
      </section>
    );
  }
}
