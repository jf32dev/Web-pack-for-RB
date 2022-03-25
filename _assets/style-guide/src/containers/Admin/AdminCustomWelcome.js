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

import _get from 'lodash/get';

import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import AdminCustomWelcome from 'components/Admin/AdminCustomWelcome/AdminCustomWelcome';

const AdminCustomWelcomeDocs = require('!!react-docgen-loader!components/Admin/AdminCustomWelcome/AdminCustomWelcome.js');

export default class AdminCustomWelcomeView extends PureComponent {
  constructor(props) {
    super(props);

    this.screens = [{
      name: 'screen1',
      enable: false,
      title: '',
      description: '',
    }, {
      name: 'screen2',
      enable: false,
      title: '',
      description: '',
    }, {
      name: 'screen3',
      enable: false,
      title: '',
      description: '',
    }, {
      name: 'screen4',
      enable: false,
      title: '',
      description: '',
    }, {
      name: 'screen5',
      enable: false,
      title: '',
      description: '',
    }];

    this.state = {
      values: {
        customWelcomeScreens: true,
        selectedScreen: 'screen2',
        enable: false,
        title: '',
        description: '',
      },
      activeScreens: []
    };
    autobind(this);
  }

  handleChange(update) {
    if (_get(update, 'selectedScreen', false)) {
      // console.log(update, this.screens.find(screen => screen.name === update.selectedScreen));
      this.setState({
        values: {
          ...this.state.values,
          ...update,
          ...this.screens.find(screen => screen.name === update.selectedScreen),
        }
      });
    } else {
      this.setState({
        values: {
          ...this.state.values,
          ...update,
        }
      });

      this.screens = this.screens.map(screen => {
        let screenUpdate = {};
        if (this.state.values.selectedScreen === screen.name) {
          for (const k in update) {
            if (screen.hasOwnProperty(k)) {  // eslint-disable-line
              screenUpdate = update;
            }

            if (k === 'enable') {
              if (update.enable) {
                this.setState({
                  activeScreens: this.state.activeScreens.concat(this.state.values.selectedScreen)
                });
              } else {
                this.setState({
                  activeScreens: this.state.activeScreens.filter(s => s !== this.state.values.selectedScreen)
                });
              }
            }
          }
        }
        return {
          ...screen,
          ...screenUpdate,
        };
      });
    }
    this.setState({
      update
    });
  }

  render() {
    return (
      <section id="AdminCustomWelcomeView">
        <h1>AdminCustomWelcome</h1>
        <Docs {...AdminCustomWelcomeDocs} />
        <ComponentItem>
          <AdminCustomWelcome
            onChange={this.handleChange}
            activeScreens={this.state.activeScreens}
            {...this.state.values}
          />
        </ComponentItem>
      </section>
    );
  }
}
