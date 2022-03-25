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

export default class TooltipsView extends Component {
  render() {
    const styles = require('./Tooltips.less');

    return (
      <section id="TooltipsView">
        <h1>Tooltips</h1>
        <p>Creating a tooltip is a 2-step process, first add an <code>aria-label</code> attribute to the element you wish to attach a tooltip.</p>
        <p>Secondly, use the LESS mixin <code>.tooltip()</code>, this is available via <code>tooltips.less</code>.</p>
        <p>Another mixin is provided if your tooltip is required to span over multiple lines: <code>.longtip()</code> or the attribute <code>data-longtip</code> can be included on your element.</p>

        <ComponentItem>
          <div className={styles.row}>
            <span aria-label="I am below!" className={styles.sTip}>I have a <code>s</code> tip!</span>
            <span aria-label="I am below to the right!" className={styles.seTip}>I have a <code>se</code> tip!</span>
            <span aria-label="I am below to the left!" className={styles.swTip}>I have a <code>sw</code> tip!</span>
          </div>
          <div className={styles.row}>
            <span aria-label="I am above!" className={styles.nTip}>I have a <code>n</code> tip!</span>
            <span aria-label="I am above to the right!" className={styles.neTip}>I have a <code>ne</code> tip!</span>
            <span aria-label="I am above to the left!" className={styles.nwTip}>I have a <code>nw</code> tip!</span>
          </div>
          <div className={styles.row}>
            <span aria-label="I am left!" className={styles.wTip}>I have a <code>w</code> tip!</span>
            <span aria-label="I am right!" className={styles.eTip}>I have a <code>e</code> tip!</span>
          </div>
          <div className={styles.row}>
            <span aria-label="I have a tooltip that is very long it just keeps going and going and you probably shoudn't have such long tooltips as it defeats the purpose of a tip doesn't it." className={styles.longTip}>I have a looooooonnnnnnngggggggg tooltip</span>
          </div>
        </ComponentItem>
      </section>
    );
  }
}
