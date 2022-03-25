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

import Text from 'components/Text/Text';

import FormViewer from 'components/ViewerFiles/FormViewer/FormViewer';

const FormViewerDocs = require('!!react-docgen-loader!components/ViewerFiles/FormViewer/FormViewer.js');

export default class FormViewerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiUrl: 'https://push.bigtincan.org/webapi',
      accessToken: '0f7692a422ae1fb1e95c6c667b5f157fed99f5b3'
    };
    autobind(this);
  }

  handleLoad() {
    console.info('Form loaded!');
  }

  handleError() {
    console.info('Form error!');
  }

  handleApiUrlChange(event) {
    this.setState({
      apiUrl: event.target.value
    });
  }

  handleAccessTokenChange(event) {
    this.setState({
      apiUrl: event.target.value
    });
  }

  render() {
    return (
      <section id="FormView">
        <h1>FormViewer</h1>
        <p>Displays a <code>btcf</code> file.</p>

        <Docs {...FormViewerDocs} />

        <Text
          id="apiUrl"
          label="apiUrl"
          inline
          width="16rem"
          value={this.state.apiUrl}
          onChange={this.handleApiUrlChange}
        />
        <Text
          id="accessToken"
          label="accessToken"
          inline
          width="21rem"
          value={this.state.accessToken}
          onChange={this.handleAccessTokenChange}
        />

        <ComponentItem style={{ height: '500px' }}>
          <FormViewer
            //baseUrl="https://push.bigtincan.org/cache/Dm9jEkGXJpW6KRWbN5O0/btc/5e1bd5079767f4cf6ea95b7ea3866056156a825aa4df259e19e918c70a75de74/"
            baseUrl="http://localdev.btc:8080/"
            accessToken="0f7692a422ae1fb1e95c6c667b5f157fed99f5b3"
            apiUrl="https://push.bigtincan.org/webapi"
            onLoad={this.handleLoad}
            onError={this.handleError}
          />
        </ComponentItem>
      </section>
    );
  }
}
