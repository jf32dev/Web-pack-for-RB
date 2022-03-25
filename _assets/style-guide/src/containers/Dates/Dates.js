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
import { FormattedDate, FormattedRelative } from 'react-intl';
import ComponentItem from '../../views/ComponentItem';

export default class Dates extends Component {

  render() {
    return (
      <section id="Dates">
        <h1>Dates</h1>
        <p>Please refer to <a href="https://github.com/yahoo/react-intl" target="_blank">React Intl</a> for full documentation.</p>

        <h2>FormattedDate</h2>
        <h3>PropTypes</h3>
        <ul>
          <li><strong>value</strong> <code>string</code> - date timestamp</li>
          <li><strong>timeZone</strong> <code>string</code> - valid <a href="https://www.iana.org/time-zones" target="_blank">time zone</a> name</li>
          <li><strong>hour12</strong> <code>bool</code> - display am/pm</li>
          <li><strong>weekday</strong> <code>string</code> - narrow, short, long</li>
          <li><strong>era</strong> <code>string</code> - narrow, short, long</li>
          <li><strong>year</strong> <code>string</code> - numeric, 2-digit</li>
          <li><strong>month</strong> <code>string</code> - numeric, 2-digit, narrow, short, long</li>
          <li><strong>day</strong> <code>string</code> - numeric, 2-digit</li>
          <li><strong>hour</strong> <code>string</code> - numeric, 2-digit</li>
          <li><strong>minute</strong> <code>string</code> - numeric, 2-digit</li>
          <li><strong>second</strong> <code>string</code> - numeric, 2-digit</li>
          <li><strong>timeZoneName</strong> <code>string</code> - short, long</li>
        </ul>
        <ComponentItem>
          <div>
            <FormattedDate
              value={new Date()}
              hour="numeric"
              minute="numeric"
              second="numeric"
            />
          </div>
          <div>
            <FormattedDate
              value={new Date()}
              day="2-digit"
              month="numeric"
              year="2-digit"
              hour="numeric"
              minute="numeric"
            />
          </div>
          <div>
            <FormattedDate
              value={new Date()}
              day="2-digit"
              month="short"
              year="numeric"
              hour="numeric"
              minute="numeric"
              second="numeric"
            />
          </div>
          <div>
            <FormattedDate
              value={new Date()}
              timeZone="Asia/Kolkata"
              weekday="short"
              day="2-digit"
              month="short"
              year="numeric"
              hour="numeric"
              minute="numeric"
              second="numeric"
              timeZoneName="short"
            />
          </div>
          <div>
            <FormattedDate
              value={new Date()}
              timeZone="America/New_York"
              weekday="long"
              day="2-digit"
              month="long"
              year="numeric"
              hour="numeric"
              minute="numeric"
              second="numeric"
              timeZoneName="long"
            />
          </div>
        </ComponentItem>

        <h2>FormattedRelative</h2>
        <h3>PropTypes</h3>
        <ul>
          <li><strong>value</strong> <code>string</code> - date timestamp</li>
          <li><strong>style</strong> <code>string</code> - best fit, numeric</li>
          <li><strong>units</strong> <code>string</code> - second, minute, hour, day, month, year</li>
        </ul>
        <ComponentItem>
          <div>
            <FormattedRelative
              value={new Date()}
              style={'best fit'}
            />
          </div>
          <div>
            <FormattedRelative
              value={1465251469 * 1000}
              style={'numeric'}
            />
          </div>
          <div>
            <FormattedRelative
              value={1465251501 * 1000}
              style={'numeric'}
              units={'second'}
            />
          </div>
          <div>
            <FormattedRelative
              value={1453414055011}
              style={'numeric'}
              units={'minute'}
            />
          </div>
          <div>
            <FormattedRelative
              value={1453414055011}
              style={'best fit'}
              units={'hour'}
            />
          </div>
          <div>
            <FormattedRelative
              value={1453414055011}
              style={'best fit'}
              units={'day'}
            />
          </div>
          <div>
            <FormattedRelative
              value={1453414055011}
              style={'best fit'}
              units={'month'}
            />
          </div>
          <div>
            <FormattedRelative
              value={1453414055011}
              style={'best fit'}
              units={'year'}
            />
          </div>
        </ComponentItem>

      </section>
    );
  }
}
