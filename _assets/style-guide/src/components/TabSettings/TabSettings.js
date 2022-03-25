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
import TabItem from 'components/TabItem/TabItem';

/**
 * Displays a Tab's settings.
 */
export default class TabSettings extends PureComponent {
  static propTypes = {
    /** Valid TabItem data */
    tab: PropTypes.object.isRequired,

    /** selected sort order */
    sortOrder: PropTypes.string,

    /** Provided to override defaults */
    sortOptions: PropTypes.array,

    hasHiddenChannelToggle: PropTypes.bool,
    showHiddenChannels: PropTypes.bool,

    authString: PropTypes.string,
    strings: PropTypes.object,

    /** Handler for links */
    onAnchorClick: PropTypes.func.isRequired,

    /** Shows Edit button for Personal Tabs */
    onEditClick: PropTypes.func,

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
      { value: 'story_count', label: 'Story count' }
    ],
    hasHiddenChannelToggle: true,
    authString: '',
    strings: {
      tabDetails: 'Tab Details',
      showHiddenChannels: 'Show Hidden Channels'
    }
  };

  handleStopPropagation(event) {
    event.stopPropagation();
  }

  render() {
    const {
      tab,
      showHiddenChannels,
      authString,
      strings,
      hasHiddenChannelToggle,
      onAnchorClick,
      onEditClick,
      onSortOrderChange,
      onOptionChange,
      className,
      style
    } = this.props;
    //const isPersonal = tab.isPersonal;
    const styles = require('./TabSettings.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      TabSettings: true
    }, className);

    const hasAction = hasHiddenChannelToggle;

    return (
      <div
        data-id="tab-settings" className={classes} style={style}
        onClick={this.handleStopPropagation}
      >
        <div className={styles.detailWrap}>
          <h3>{strings.tabDetails}</h3>
          <TabItem
            {...tab}
            grid
            showThumb
            thumbWidth={60}
            noLink
            isActive={false}
            authString={authString}
            //showEdit={isPersonal}
            onEditClick={onEditClick}
            onClick={onAnchorClick}
            className={styles.tabItem}
          />
        </div>
        <div className={styles.sortOrder}>
          <Select
            name={`${tab.id}-sortOrder`}
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
              inputId={`${tab.id}-showHiddenChannels`}
              name={`${tab.id}-showHiddenChannels`}
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
