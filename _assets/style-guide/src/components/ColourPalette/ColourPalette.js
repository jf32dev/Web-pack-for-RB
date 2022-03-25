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
import PropTypes from 'prop-types';

/**
 * ColourPalette
 */
export default class ColourPalette extends Component {
  static propTypes = {
    vars: PropTypes.object,
    onColourClick: PropTypes.func
  };

  static defaultProps = {
    customProp2: []
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { vars, onColourClick } = this.props;
    const styles = require('./ColourPalette.less');

    return (
      <div className={styles.ColourPalette}>
        <div className={styles.darkBaseColor} data-id="darkBaseColor" onClick={onColourClick}>
          <code>--dark-base-color</code>
          <p>{vars.darkBaseColor}</p>
        </div>
        <div className={styles.baseColor} data-id="baseColor" onClick={onColourClick}>
          <code>--base-color</code>
          <p>{vars.baseColor}</p>
        </div>
        <div className={styles.lightBaseColor} data-id="lightBaseColor" onClick={onColourClick}>
          <code>--light-base-color</code>
          <p>{vars.lightBaseColor}</p>
        </div>
        <div className={styles.baseText} data-id="baseText" onClick={onColourClick}>
          <code>--base-text</code>
          <p>{vars.baseText}</p>
        </div>

        <div className={styles.accentColor} data-id="accentColor" onClick={onColourClick}>
          <code>--accent-color</code>
          <p>{vars.accentColor}</p>
        </div>
        <div className={styles.primaryText} data-id="primaryText" onClick={onColourClick}>
          <code>--primary-text</code>
          <p>{vars.primaryText}</p>
        </div>
        <div className={styles.secondaryText} data-id="secondaryText" onClick={onColourClick}>
          <code>--secondary-text</code>
          <p>{vars.secondaryText}</p>
        </div>
        <div className={styles.dividerColor} data-id="dividerColor" onClick={onColourClick}>
          <code>--divider-color</code>
          <p>{vars.dividerColor}</p>
        </div>
      </div>
    );
  }
}
