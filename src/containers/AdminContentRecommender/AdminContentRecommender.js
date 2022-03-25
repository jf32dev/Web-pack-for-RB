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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import {
  getRecommenderSettings,
  setRecommenderSettings,
  setData
} from 'redux/modules/admin/contentRecommender';
import { createPrompt } from 'redux/modules/prompts';

import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';
import ContentRecommender from 'components/Admin/AdminContentRecommender/AdminContentRecommender';
import Loader from 'components/Loader/Loader';
import uniqueId from 'lodash/uniqueId';

const messages = defineMessages({
  contentRecommender: {
    id: 'content-recommender',
    defaultMessage: 'Content Recommender'
  },
  frequency: {
    id: 'frequency',
    defaultMessage: 'Frequency',
  },
  none: {
    id: 'none',
    defaultMessage: 'None'
  },
  daily: {
    id: 'daily',
    defaultMessage: 'Daily'
  },
  weekly: {
    id: 'weekly',
    defaultMessage: 'Weekly'
  },
  monthly: {
    id: 'monthly',
    defaultMessage: 'Monthly'
  },
  enableGenieRecommender: {
    id: 'enable-content-recommender',
    defaultMessage: 'Enable Content Recommender'
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  },
  savedSuccessfully: {
    id: 'saved-successfully',
    defaultMessage: 'Saved successfully'
  },
});

@connect(state => ({
  ...state.admin.contentRecommender,
}),
bindActionCreatorsSafe({
  getRecommenderSettings,
  setRecommenderSettings,
  setData,

  createPrompt
})
)
export default class AdminContentRecommender extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isDifferent: false
    };
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getRecommenderSettings) {
      this.props.getRecommenderSettings();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'Content-recommender-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    } else if (nextProps.updated) {
      this.props.createPrompt({
        id: uniqueId('updated-'),
        type: 'success',
        message: strings.savedSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Set flag for modified attributes
    const isModified = !_isEqual(nextProps.data, nextProps.dataOrig);
    this.setState({
      isDifferent: isModified
    });

    if (!this.props.updated && nextProps.updated) {
      this.setState({
        isDifferent: false
      });
    }
  }

  handleChange(values) {
    if (typeof this.props.setData === 'function') {
      this.props.setData(values);
    }
  }

  handleSave() {
    if (typeof this.props.setData === 'function') {
      const { data } = this.props;
      const values = {
        ...data,
        frequency: data.turnedOn ? data.frequency : 'none'
      };
      this.props.setRecommenderSettings(values);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      data,
      loading,
      updating,

      className,
      style,
    } = this.props;
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <ContentRecommender
          {...data}
          saveLoading={loading || updating}
          saveDisabled={!this.state.isDifferent}
          strings={strings}
          onChange={this.handleChange}
          onSave={this.handleSave}
        />}
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={this.state.isDifferent} />}
      </div>
    );
  }
}
