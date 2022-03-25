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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import Btn from 'components/Btn/Btn';
import getKloudlessConfig from 'helpers/getKloudlessConfig';

const kloudlessDocs = require('!!react-docgen-loader!containers/Kloudless/KloudlessProps.js');

export default class KloudlessView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: {}
    };
    this.authenticatorScript = document.createElement('script');
    autobind(this);
  }

  componentDidMount() {
    if (window.Kloudless === undefined && !document.getElementById('kloudless')) {
      const { source, id, async } = getKloudlessConfig();
      this.authenticatorScript.src = source;
      this.authenticatorScript.id = id;
      this.authenticatorScript.async = async;
      document.body.appendChild(this.authenticatorScript);

      this.authenticatorScript.onload = () => this.initializeKloudless('salesforce', true);
    } else {
      this.initializeKloudless('salesforce', true);
    }
  }

  initializeKloudless = (crmSource, sandbox) => {
    if (window.Kloudless !== undefined && document.getElementById('authenticator-btn') !== null) {
      const options = {
        client_id: 'oGxrGNUetsemdONiO6ch_kJwLiD6S1EFTTqdIU1_55CdSlbo',
        scope: crmSource,
        developer: sandbox
      };
      // Launch the Authenticator when the button is clicked
      window.Kloudless.authenticator(document.getElementById('authenticator-btn'), options, this.kloudlessCallback);
    }
  }

  kloudlessCallback(result) {
    this.setState({
      result
    });
  } 

  render() {
    return (
      <section id="KloudlessView">
        <h1>Kloudless</h1>
        <Docs {...kloudlessDocs} />

        <h2>Authenticator</h2>
        <p>Opens a Pop up to Authenticate in an services.</p>
        <ComponentItem>
          <Btn id="authenticator-btn">Launch Authenticator</Btn>

          {this.state.result &&
            <pre>
              <code>
                {JSON.stringify(this.state.result,null, 4)}
            </code>
            </pre>}
        </ComponentItem>
      </section>
    );
  }
}
