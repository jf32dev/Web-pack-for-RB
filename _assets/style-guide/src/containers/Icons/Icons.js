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

export default class IconsView extends Component {
  render() {
    // const script = iconPreview.match(/(?=<script(.*)>)[\s\S]*<\/script>/g);
    // const style = iconPreview.match(/(?=<style(.*)>)[\s\S]*<\/style>/g);
    // const body = iconPreview.match(/(?=<body(.*)>)[\s\S]*<\/body>/g);

    return (
      <section id="IconsView">
        <h1>Icons</h1>
        <p>Icons are located at <code><a href="/assets/btc-font/styleguide/btc-font-preview.html" target="_blank">assets/btc-font/vectors</a></code>.</p>
        <p>Execute <code>grunt icons</code> to generate font.</p>
        <ComponentItem>
          <iframe
            src="./assets/btc-font/styleguide/btc-font-preview.html"
            height="600px"
            sandbox={"allow-same-origin allow-scripts allow-popups allow-forms"}
            seamless
          />
        </ComponentItem>
      </section>
    );
  }
}
