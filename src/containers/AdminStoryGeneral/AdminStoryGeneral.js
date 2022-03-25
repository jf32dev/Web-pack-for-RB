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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  getStories,
  setSetting,
  GENERAL,
} from 'redux/modules/admin/stories';
import { createPrompt } from 'redux/modules/prompts';

import Checkbox from 'components/Checkbox/Checkbox';
import Loader from 'components/Loader/Loader';
import RadioGroup from 'components/RadioGroup/RadioGroup';

const messages = defineMessages({
  ratingType: {
    id: 'rating-type',
    defaultMessage: 'Rating type'
  },
  likes: {
    id: 'likes',
    defaultMessage: 'Likes',
  },
  stars: {
    id: 'stars',
    defaultMessage: 'Stars'
  },
  port: {
    id: 'port',
    defaultMessage: 'Port'
  },
  showOriginalStoryAuthors: {
    id: 'show-original-story-authors',
    defaultMessage: 'Show original {story} authors'
  },
});

@connect(state => state.admin.stories,
  bindActionCreatorsSafe({
    getStories,
    setSetting,
    createPrompt
  })
)
export default class AdminStoryGeneral extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getStories) {
      this.props.getStories(GENERAL);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'story-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleRadioGroupChange(event) {
    this.updateValue({
      ratingType: event.currentTarget.value
    });
  }

  handleCheckboxChange(event) {
    this.updateValue({
      showOriginalAuthor: event.currentTarget.checked ? 1 : 0
    });
  }

  updateValue(update) {
    if (this.props.setSetting) {
      this.props.setSetting(update);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      loading,
      ratingType,
      showOriginalAuthor,
      style,
    } = this.props;
    const strings = generateStrings(messages, formatMessage, naming);
    const styles = require('./AdminStoryGeneral.less');

    return (
      <div className={styles.AdminStoryGeneral} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <div>
          <RadioGroup
            legend={strings.ratingType}
            name="fruit"
            selectedValue={ratingType}
            onChange={this.handleRadioGroupChange}
            className={styles.ratingType}
            options={[{
              label: strings.likes,
              value: 0
            }, {
              label: strings.stars,
              value: 1
            }]}
          />
          <Checkbox
            label={strings.showOriginalStoryAuthors}
            name="showOriginalAuthor"
            value="showOriginalAuthor"
            className={styles.showOriginalStoryAuthors}
            checked={showOriginalAuthor === 1}
            onChange={this.handleCheckboxChange}
          />
        </div>}
      </div>
    );
  }
}
