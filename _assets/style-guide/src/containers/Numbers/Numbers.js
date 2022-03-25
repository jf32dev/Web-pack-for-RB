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
import { FormattedNumber } from 'react-intl';
import ComponentItem from '../../views/ComponentItem';

export default class NumbersView extends Component {

  render() {
    return (
      <section id="NumbersView">
        <h1>Numbers</h1>
        <p>Please refer to <a href="https://github.com/yahoo/react-intl" target="_blank">React Intl</a> for full documentation.</p>

        <h2>FormattedNumber</h2>
        <h3>PropTypes</h3>
        <ul>
          <li><strong>value</strong> <code>number</code></li>
          <li><strong>style</strong> <code>string</code> - decimal, currency, percent</li>
          <li><strong>currency</strong> <code>string</code> - 3-letter country code</li>
          <li><strong>currencyDisplay</strong> <code>string</code> - symbol, code, name</li>
        </ul>
        <ComponentItem>
          <div>
            <FormattedNumber value={4200} />
          </div>
          <div>
            <FormattedNumber value={0.9} style="percent" />
          </div>
          <div>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="USD"
            />
            <span> or </span>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="USD"
              currencyDisplay="code"
            />
            <span> or </span>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="USD"
              currencyDisplay="name"
            />
          </div>
          <div>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="GBP"
            />
            <span> or </span>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="GBP"
              currencyDisplay="code"
            />
            <span> or </span>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="GBP"
              currencyDisplay="name"
            />
          </div>
          <div>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="JPY"
            />
            <span> or </span>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="JPY"
              currencyDisplay="code"
            />
            <span> or </span>
            <FormattedNumber
              value={99.95}
              style="currency"
              currency="JPY"
              currencyDisplay="name"
            />
          </div>
        </ComponentItem>

      </section>
    );
  }
}
