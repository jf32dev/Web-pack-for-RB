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
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Plaintext from 'components/ViewerFiles/Plaintext';

const PlaintextDocs = require('!!react-docgen-loader!components/ViewerFiles/Plaintext.js');

export default class PlaintextView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authString: ''
    };
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleLoad() {
    this.setState({ loading: false });
  }

  handleError(event) {
    console.log(event);
  }

  render() {
    return (
      <section id="PlaintextView">
        <h1>Plaintext</h1>
        <Docs {...PlaintextDocs} />

        <ComponentItem style={{ height: '500px', position: 'relative' }}>
          {this.state.loading && <p>Loading...</p>}
          <Plaintext
            url={'https://push.bigtincan.org/get_file/2b8e738994df032593b92255d40819066ad97ccf4b988d99d26df9ffda1d1cce.txt'}
            onLoad={this.handleLoad}
            onError={this.handleError}
          />
        </ComponentItem>
      </section>
    );
  }
}
