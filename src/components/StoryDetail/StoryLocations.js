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
 * @package hub-web-app-v5
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class StoryLocations extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    locations: PropTypes.array.isRequired,

    onClick: PropTypes.func.isRequired
  };

  render() {
    const style = require('./StoryLocations.less');

    return (
      <div className={style.StoryLocations}>
        <h4>{this.props.title}</h4>
        <p>{this.props.description}</p>
        <p className={style.viewLocations}><span onClick={this.props.onClick}>View Locations ({this.props.locations.length})</span></p>
      </div>
    );
  }
}
