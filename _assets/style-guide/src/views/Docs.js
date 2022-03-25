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

function mapObject(object, callback) {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  });
}

export default class Docs extends PureComponent {
  static propTypes = {
    description: PropTypes.string,
    methods: PropTypes.array,
    props: PropTypes.object
  };

  static defaultProps = {
    description: 'No description set.'
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
    const { props } = this.props;
    const { isVisible } = this.state;
    const classes = classNames({
      'propList': true
    });

    const style = {
      display: isVisible ? 'block' : 'none'
    };

    //TODO small fix for PropTypes.shape, not sure it would break something
    // Split required props
    //const requiredProps = Object.keys(props).filter(p => props[p].required);
    //const otherProps = Object.keys(props).filter(p => props[p].required);
    return (
      <div className={classes}>
        <p dangerouslySetInnerHTML={{ __html: this.props.description }} style={{ whiteSpace: 'pre-line' }} />
        {props && <Btn
          icon="gear"
          small
          alt
          onClick={this.toggleVisibility}
          style={{ marginBottom: '0.5rem' }}
        >
          Toggle Props
        </Btn>}
        {props && <div style={style}>
          <h3>PropTypes</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Default value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {mapObject(props, (key, item) => (
                <tr key={key}>
                  <td className="propName">{key} {item.required && <span>*</span>}</td>
                  <td className="propType">
                    {item.type && <code>{item.type.name}</code>}
                    {(item.type && typeof item.type.value === 'object') && <code>{JSON.stringify(item.type.value, null, '  ')}</code>}
                    {(item.type && typeof item.type.value === 'string') && <code>{item.type.value}</code>}
                  </td>
                  <td className="propDefault">
                    {item.defaultValue &&
                    <code>{item.defaultValue.value}</code>
                    }
                  </td>
                  <td className="propDescription">
                    {item.description &&
                    <span dangerouslySetInnerHTML={{ __html: item.description }} />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>
    );
  }
}
