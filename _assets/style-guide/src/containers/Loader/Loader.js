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
import { Loader } from 'components';

const LoaderDocs = require('!!react-docgen-loader!components/Loader/Loader.js');

export default class LoaderView extends Component {
  render() {
    return (
      <section id="LoaderView">
        <h1>Loader</h1>
        <Docs {...LoaderDocs} />

        <h2>App loader</h2>
        <p>Used during initial load and page refresh.</p>
        <ComponentItem style={{ height: '7rem' }}>
          <Loader type="app" />
        </ComponentItem>

        <h2>Page loader</h2>
        <p>Loading a full page, e.g. Story or Form.</p>
        <ComponentItem style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '120px' }}>
          <Loader type="page" />
        </ComponentItem>

        <h2>Content loader</h2>
        <p>Loading a section of a page, e.g. Story Description.</p>
        <ComponentItem style={{ display: 'flex', justifyContent: 'center' }}>
          <Loader type="content" />
        </ComponentItem>
      </section>
    );
  }
}
