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
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Btn from 'components/Btn/Btn';

export default class PropList extends PureComponent {
  static propTypes = {
    items: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = { isVisible: false };
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  toggleVisibility() {
    this.setState({ isVisible: !this.state.isVisible });
  }

  render() {
    const { isVisible } = this.state;
    const classes = classNames({
      'propList': true
    });

    const style = {
      display: isVisible ? 'block' : 'none'
    };

    return (
      <div className={classes}>
        <Btn small onClick={this.toggleVisibility}>Toggle Props</Btn>
        <div style={style}>
          <h3>PropTypes</h3>
          <ul>
          {this.props.items.map(item => (
            <li key={item.name}>
              <strong>{item.name}</strong>&nbsp;
              <code>{item.type}</code>
              {item.required && <span>{' - required'}</span>}
              {item.description && <span dangerouslySetInnerHTML={{ __html: item.description }} />}
            </li>
          ))}
          </ul>
        </div>
      </div>
    );
  }
}
