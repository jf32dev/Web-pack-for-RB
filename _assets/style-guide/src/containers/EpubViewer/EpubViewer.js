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

import EpubView from 'components/ViewerFiles/EpubViewer/EpubViewer';

const EpubDocs = require('!!react-docgen-loader!components/ViewerFiles/EpubViewer/EpubViewer.js');

const epub = require('../../static/files.json')[11];

export default class EpubViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  render() {
    return (
      <section id="EpubViewer">
        <h1>EpubViewer</h1>
        <Docs {...EpubDocs} />

        <ComponentItem style={{ height: 800 }}>
          <EpubView
            {...epub}
            url={'/test1.epub'}
          />
        </ComponentItem>
      </section>
    )
  }
}