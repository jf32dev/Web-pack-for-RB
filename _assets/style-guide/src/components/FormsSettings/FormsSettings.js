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
import classNames from 'classnames/bind';
import Select from 'react-select';

/**
 * Displays Forms (/forms) settings.
 */
export default class FormsSettings extends PureComponent {
  static propTypes = {
    /** selected sort order */
    sortOrder: PropTypes.string,

    /** Provided to override defaults */
    sortOptions: PropTypes.array,

    strings: PropTypes.object,

    /** Handle `sortOrder` select change */
    onSortOrderChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    sortOrder: 'name',
    sortOptions: [
      { value: 'name', label: 'Name' },
      { value: 'formCount', label: 'Form count' }
    ],
    strings: {
      formsDetails: 'Forms Details'
    }
  };

  handleStopPropagation(event) {
    event.stopPropagation();
  }

  render() {
    const {
      onSortOrderChange,
      strings,
      className,
      style
    } = this.props;
    const styles = require('./FormsSettings.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FormsSettings: true
    }, className);

    return (
      <div
        data-id="forms-settings" className={classes} style={style}
        onClick={this.handleStopPropagation}
      >
        <div className={styles.detailWrap}>
          <h3>{strings.formsDetails}</h3>
        </div>
        <div className={styles.sortOrder}>
          <Select
            name="forms-sortOrder"
            value={this.props.sortOrder}
            options={this.props.sortOptions}
            clearable={false}
            searchable={false}
            onChange={onSortOrderChange}
          />
        </div>
      </div>
    );
  }
}
