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

import Checkbox from 'components/Checkbox/Checkbox';

/**
 * Displays Content (/content) settings.
 */
export default class ContentSettings extends PureComponent {
  static propTypes = {
    /** selected sort order */
    sortOrder: PropTypes.string,

    /** Provided to override defaults */
    sortOptions: PropTypes.array,

    hasHiddenChannelToggle: PropTypes.bool,
    showHiddenChannels: PropTypes.bool,

    authString: PropTypes.string,
    strings: PropTypes.object,

    /** Handle `showHiddenChannels` checkbox change */
    onOptionChange: PropTypes.func,

    /** Handle `sortOrder` select change */
    onSortOrderChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    sortOrder: 'name',
    sortOptions: [
      { value: 'name', label: 'Name' },
      { value: 'channel_count', label: 'Channel count' }
    ],
    hasHiddenChannelToggle: true,
    authString: '',
    strings: {
      contentDetails: 'Content Details',
      showHiddenChannels: 'Show Hidden Channels'
    }
  };

  handleStopPropagation(event) {
    event.stopPropagation();
  }

  render() {
    const {
      showHiddenChannels,
      hasHiddenChannelToggle,
      onSortOrderChange,
      onOptionChange,
      strings,
      className,
      style
    } = this.props;
    const styles = require('./ContentSettings.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ContentSettings: true
    }, className);

    const hasAction = hasHiddenChannelToggle;

    return (
      <div
        data-id="content-settings" className={classes} style={style}
        onClick={this.handleStopPropagation}
      >
        <div className={styles.detailWrap}>
          <h3>{strings.contentDetails}</h3>
        </div>
        <div className={styles.sortOrder}>
          <Select
            name="content-sortOrder"
            value={this.props.sortOrder}
            options={this.props.sortOptions}
            clearable={false}
            searchable={false}
            onChange={onSortOrderChange}
          />
        </div>
        {hasAction && <ul className={styles.actions}>
          {hasHiddenChannelToggle && <li>
            <Checkbox
              inputId="content-showHiddenChannels"
              name="content-showHiddenChannels"
              data-option="showHiddenChannels"
              label={strings.showHiddenChannels}
              checked={showHiddenChannels}
              onChange={onOptionChange}
            />
          </li>}
        </ul>}
      </div>
    );
  }
}
