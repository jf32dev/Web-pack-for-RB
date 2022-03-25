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
import { Btn, Dialog } from 'components';

const DialogDocs = require('!!react-docgen-loader!components/Dialog/Dialog.js');

export default class DialogView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog1: false,
      showDialog2: false
    };

    this.toggleDialog1 = this.toggleDialog1.bind(this);
    this.toggleDialog2 = this.toggleDialog2.bind(this);
  }

  toggleDialog1() {
    this.setState({ showDialog1: !this.state.showDialog1 });
  }

  toggleDialog2() {
    this.setState({ showDialog2: !this.state.showDialog2 });
  }

  render() {
    return (
      <section id="DialogView">
        <h1>Dialog</h1>
        <Docs {...DialogDocs} />

        <ComponentItem>
          <Btn onClick={this.toggleDialog1}>Show Dialog 1</Btn>
          <Dialog
            title="Dialog 1"
            message="Are you sure you want to close this dialog?"
            isVisible={this.state.showDialog1}
            cancelText="No"
            confirmText="Yes"
            onCancel={this.toggleDialog1}
            onConfirm={this.toggleDialog1}
          />
        </ComponentItem>

        <ComponentItem>
          <Btn onClick={this.toggleDialog2}>Show Dialog 2</Btn>
          <Dialog
            title="Dialog 2"
            isVisible={this.state.showDialog2}
            onCancel={this.toggleDialog2}
            onConfirm={this.toggleDialog2}
          >
            <p>Custom <code>children</code> passed in place of <code>message</code>.</p>
          </Dialog>
        </ComponentItem>
      </section>
    );
  }
}
