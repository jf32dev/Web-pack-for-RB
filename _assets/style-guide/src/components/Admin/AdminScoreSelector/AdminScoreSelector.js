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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import ScoreItem from './ScoreItem';

const messages = defineMessages({
  'less': { id: 'less', defaultMessage: 'Less' },
  'more': { id: 'more', defaultMessage: 'More' },
  'content': { id: 'content', defaultMessage: 'Content' },
  'activity': { id: 'activity', defaultMessage: 'Activity' },
  'testScore': { id: 'test-score', defaultMessage: 'Test Score' },
  'rebaseScore': { id: 'rebaseline-score', defaultMessage: 'Re-Baseline Score' },
  'reset': { id: 'reset', defaultMessage: 'Reset' },

  // Variables on server side Social IQ
  'actions_on_others_content': { id: 'actions-on-others-content', defaultMessage: 'Actions taken on content not published by the signed-in user' },
  'important_actions_on_others_content': { id: 'important-actions-on-others-content', defaultMessage: 'Significant actions taken on content not published by the signed-in user' },
  'actions_on_others': { id: 'actions-on-others', defaultMessage: 'Actions taken by the signed-in user on other users of the system' },
  'others_actions_on_user': { id: 'others-actions-on-user', defaultMessage: 'Actions taken by other users of the system on the signed-in user' },
  'content_publishing': { id: 'content-publishing', defaultMessage: 'Publishing activity undertaken by the signed-in user' },
  'content_to_activity_ratio': { id: 'content-to-activity-ratio', defaultMessage: 'Content IQ score of any content published by a signed-in user as a contribution to their Social IQ (30% - 60%)' },
  // Content IQ
  'view_actions_on_stories': { id: 'view-actions-on-stories', defaultMessage: 'View actions on {stories}' },
  'author_actions': { id: 'author-actions', defaultMessage: 'Author actions' },
  'sharing_actions': { id: 'sharing-actions', defaultMessage: 'Sharing actions' },
  'important_actions': { id: 'platform-engagement', defaultMessage: 'Platform engagement' },
  'negative_important_actions': { id: 'platform-disengagement', defaultMessage: 'Platform disengagement' },
});

export default class AdminScoreSelector extends PureComponent {
  static propTypes = {
    header: PropTypes.string,

    /** Array list of score */
    list: PropTypes.array,

    /** The minimum value of the slider */
    minValue: PropTypes.number,

    /** The maximum value of the slider */
    maxValue: PropTypes.number,

    step: PropTypes.number,

    /** Shows Reset Button */
    showReset: PropTypes.bool,
    isResetLoading: PropTypes.bool,

    onResetClick: function(props) {
      if (props.showReset && typeof props.onResetClick !== 'function') {
        return new Error('onResetClick is required when showReset is provided.');
      }
      return null;
    },

    /** Shows test Score Button */
    showTestScore: PropTypes.bool,

    onTestScoreClick: function(props) {
      if (props.showTestScore && typeof props.onTestScoreClick !== 'function') {
        return new Error('onTestScoreClick is required when showTestScore is provided.');
      }
      return null;
    },

    /** Shows Re-base Score Button */
    showRebaseScore: PropTypes.bool,

    onRebaseScoreClick: function(props) {
      if (props.showRebaseScore && typeof props.onRebaseScoreClick !== 'function') {
        return new Error('onRebaseScoreClick is required when showRebaseScore is provided.');
      }
      return null;
    },

    /** Callback called on every value change.*/
    onRangeChange: PropTypes.func,

    /** called every time enabled value change.*/
    onToggle: PropTypes.func,

    /** Trigger onSave after value has been changed. */
    onSave: PropTypes.func,

    className: PropTypes.string,

    style: PropTypes.object
  };

  static defaultProps = {
    showTooltip: false
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleRangeChange(value, context) {
    if (typeof this.props.onRangeChange === 'function') {
      this.props.onRangeChange(value, context);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      header,
      minValue,
      maxValue,
      step,
      list,
      rebaselineLastRun,
      showTestScore,
      showRebaseScore,
      showReset,
      isResetLoading,
      onToggle,
      onSave,
      onTestScoreClick,
      onRebaseScoreClick,
      onResetClick,
    } = this.props;
    const styles = require('./AdminScoreSelector.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      scoreItem: true,
      disabled: isResetLoading
    }, this.props.className);

    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <div className={styles.AdminScoreSelector}>
        <div className={styles.headerContainer}>
          {header && <h3>{header}</h3>}
          {showReset && <Btn inverted onClick={onResetClick} loading={isResetLoading}>{strings.reset}</Btn>}
        </div>
        {list.map((item, index) => (
          <ScoreItem
            key={'score_' + item.name + index}
            min={minValue}
            max={maxValue}
            keyValue={item.name}
            keyLabel={strings[item.name] || item.name}
            step={step}
            value={item.value}
            showTooltip
            onChange={this.handleRangeChange}
            onToggle={onToggle}
            onSave={onSave}
            className={itemClasses}
            strings={strings}
          />
        ))}
        {showTestScore && <Btn inverted onClick={onTestScoreClick}>{strings.testScore}</Btn>}
        {showRebaseScore && <Btn inverted onClick={onRebaseScoreClick}>{strings.rebaseScore}</Btn>}
        {rebaselineLastRun && <span className={styles.rebaselineInfo}>{'Last re-baseline run: ' + rebaselineLastRun}</span>}
      </div>
    );
  }
}
