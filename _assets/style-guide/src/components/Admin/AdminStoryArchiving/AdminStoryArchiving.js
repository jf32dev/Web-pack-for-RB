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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import PropTypes from 'prop-types';

import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Select from 'react-select';
import RangeSlider from 'components/RangeSlider/RangeSlider';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';

import Checkbox from 'components/Checkbox/Checkbox';

/**
 * story archiving Settings for the company
 */
export default class AdminStoryArchiving extends PureComponent {
  static propTypes = {
    /** Mark stories inactive after * months */
    inactivateLimitMonths: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** setting a Content IQ score */
    inactiveContentscoreLimit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** Archive Stories after being marked inactive for * days */
    waitTimeBeforeArchivingDays: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** Delete Stories after being archived for * days or months */
    archiveExpiryDays: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** Content Score Limit Stats Percentage */
    contentScoreLimitStatsPercentage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** onChange method, trigger every time some input changes */
    onChange: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      enableInactiveStoryMarking: 'Enable inactive Story marking',
      markStoriesInactiveAfter: 'Mark stories inactive after:',
      week: 'week',
      contentIQMsg: 'With a Content IQ score lower than',
      updateImpact: 'Update Impact',
      fallBelowInfo: '(1036 from 1793 Stories fall below Content IQ threshold)',
      enableInactiveStoryArchiving: 'Enable inactive Story archiving',
      inactiveAfter: 'Archive Stories after being marked inactive for:',
      storyAuthorsNotifiedInfo: 'Story authors will be notified when stories are archived.',
      enableArchivedStoryDeleting: 'Enable archived Story deleting',
      enableArchivedStoryDeletingDesc: 'Use this section to set up hard delete options for your archived stories.',
      deleteStoriesAfterBeingArchivedFor: 'Delete Stories after being archived for:',
      day: 'day',
      month: 'month',
      oneDay: '1 day',
      oneWeek: '1 week',
      fourWeeks: '4 weeks',
      eightWeeks: '8 weeks',
      twelveWeeks: '12 weeks',
      deleteArchivedWarning: 'Use caution when enabling this feature. Stories will be permenantly deleted and cannot be restored.',
    },
    inactivateLimitMonths: 0,
    inactiveContentscoreLimit: 0,
    waitTimeBeforeArchivingDays: 0,
    archiveExpiryDays: 0,
    contentScoreLimitStatsPercentage: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      isMarkEnable: false,
      isArchivingEnable: false,
      inactiveContentscoreTime: 'day',
      isDeletingEnable: false,
    };

    this.archivingValues = {
      inactivateLimitMonths: props.inactiveContentscoreLimit || 0,
      inactiveContentscoreLimit: props.inactivateLimitMonths || 0,
      waitTimeBeforeArchivingDays: props.waitTimeBeforeArchivingDay || 0,
      archiveExpiryDays: props.archiveExpiryDays || 0,
    };

    autobind(this);

    this.handleDebounceChange = _compose(
      _debounce(this.handleChange.bind(this), 300),
      _clone
    );

    this.handleDebounceSliderChange = _compose(
      _debounce(this.handleSliderChange.bind(this), 300),
      _clone
    );
  }

  UNSAFE_componentWillMount() {
    this.setState({
      isMarkEnable: this.props.inactivateLimitMonths > 0,
      isArchivingEnable: this.props.waitTimeBeforeArchivingDays > 0,
      isDeletingEnable: this.props.archiveExpiryDays > 0
    });
  }

  handleChange(e) {
    const { type, value, name, dataset } = e.currentTarget;

    let update = {};

    if (type === 'checkbox') {
      this.setState({
        [name]: !this.state[name],
      });
      update = {
        [dataset.type]: 0,
      };
    } else if (type === 'number') {
      update = {
        [name]: value,
      };
    }

    this.updateValues(update);
  }

  handleDeletingSelect({ value }) {
    const update = {
      archiveExpiryDays: value
    };

    this.updateValues(update);
  }

  handleSliderChange(value) {
    const update = {
      inactiveContentscoreLimit: value
    };

    this.updateValues(update);
  }

  updateValues(update) {
    const { onChange } = this.props;

    this.archivingValues = {
      ...this.archivingValues,
      ...update,
    };

    if (onChange && typeof onChange === 'function') {
      onChange(this.archivingValues, update);
    }
  }


  render() {
    const { isMarkEnable, isArchivingEnable, isDeletingEnable } = this.state;

    const { strings, inactivateLimitMonths, inactiveContentscoreLimit, archiveExpiryDays, waitTimeBeforeArchivingDays, contentScoreLimitStatsPercentage } = this.props;

    const styles = require('./AdminStoryArchiving.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminStoryArchiving: true
    }, this.props.className);

    const deletingTimeList = [
      {
        value: 1,
        label: strings.oneDay
      },
      {
        value: 7,
        label: strings.oneWeek
      }, {
        value: 28,
        label: strings.fourWeeks,
      }, {
        value: 56,
        label: strings.eightWeeks,
      }, {
        value: 84,
        label: strings.twelveWeeks,
      }
    ];

    return (
      <div className={classes} style={this.props.style}>
        <Checkbox
          label={strings.enableInactiveStoryMarking}
          name="isMarkEnable"
          data-type="inactivateLimitMonths"
          className={styles.checkbox}
          checked={isMarkEnable}
          onChange={this.handleChange}
        />
        {isMarkEnable && <div className={styles.markContainer}>
          <div className={styles.label}>{strings.markStoriesInactiveAfter}</div>
          <div className={styles.inactivateLimitMonthsContainer}>
            <Text
              id="inactivateLimitMonths"
              className={styles.inactivateLimitMonths}
              name="inactivateLimitMonths"
              type="number"
              min="0"
              defaultValue={inactivateLimitMonths}
              onChange={this.handleDebounceChange}
            />
            <div>{strings.month}</div>
          </div>
          <div>
            <div>{strings.contentIQMsg}</div>
            <RangeSlider
              handleIconType="round"
              min={0}
              max={100}
              step={10}
              minDistance={1}
              value={this.state.value}
              withBars
              barColour={['var(--base-color)']}
              pushable
              showTooltip
              numeric
              onChange={this.handleDebounceSliderChange}
              defaultValue={inactiveContentscoreLimit}
              className={styles.numericRangeSlider}
            />
          </div>
          <div className={styles.updateImpact}>{strings.updateImpact}</div>
          <div className={styles.updateImpactValue}>{contentScoreLimitStatsPercentage}%</div>
          <h4>{strings.fallBelowInfo}</h4>
        </div>}
        <Checkbox
          label={strings.enableInactiveStoryArchiving}
          name="isArchivingEnable"
          className={styles.archivingCheckbox}
          checked={isArchivingEnable}
          data-type="waitTimeBeforeArchivingDays"
          onChange={this.handleChange}
        />
        {isArchivingEnable && <div className={styles.archivingContainer}>
          <div>{strings.inactiveAfter}</div>
          <div className={styles.archivingValueContainer}>
            <Text
              id="waitTimeBeforeArchivingDays"
              className={styles.waitTimeBeforeArchivingDays}
              name="waitTimeBeforeArchivingDays"
              type="number"
              min="0"
              defaultValue={waitTimeBeforeArchivingDays}
              onChange={this.handleDebounceChange}
            />
            <div>{strings.day}</div>
          </div>
          <h4>{strings.storyAuthorsNotifiedInfo}</h4>
        </div>}
        <Checkbox
          label={strings.enableArchivedStoryDeleting}
          name="isDeletingEnable"
          className={styles.deletingCheckbox}
          checked={isDeletingEnable}
          data-type="archiveExpiryDays"
          onChange={this.handleChange}
        />
        {isDeletingEnable && <div className={styles.deletingContainer}>
          <h4>{strings.enableArchivedStoryDeletingDesc}</h4>
          <div>
            <div>{strings.deleteStoriesAfterBeingArchivedFor}</div>
            <Select
              id="deletingTime"
              name="deletingTime"
              value={archiveExpiryDays}
              options={deletingTimeList}
              clearable={false}
              onChange={this.handleDeletingSelect}
              className={styles.deletingSelector}
            />
            <div className={styles.deletingWarning}>{strings.deleteArchivedWarning}</div>
          </div>
        </div>}
      </div>
    );
  }
}
