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

import React, { PureComponent } from 'react';

export default class ScaffoldingView extends PureComponent {
  render() {
    return (
      <section id="scaffolding-page">
        <h1>Scaffolding</h1>
        <p>Scaffolding refers to the global resets and dependencies that Web App is built upon.</p>

        <h2>HTML5 doctype</h2>
        <p>Web App makes use of certain HTML elements and CSS properties that require the use of the HTML5 doctype. It is automatically included in our index template.</p>

        <h2>Box-sizing</h2>
        <p>We reset <code>box-sizing</code> to <code>border-box</code> for every element. This allows us to more easily assign widths to elements that also have <code>padding</code> and <code>border</code>s.</p>

        <h2>CSS Reset</h2>
        <p>For improved cross-browser rendering, we start with <a href="https://github.com/filipelinhares/sanilize.css" rel="noopener noreferrer" target="_blank">sanilize.css</a>, a cross between sanitize.css and normalize.css, to correct small inconsistencies across browsers and devices.</p>
      </section>
    );
  }
}
