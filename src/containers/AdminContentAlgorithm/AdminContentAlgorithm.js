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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */
import uniqueId from 'lodash/uniqueId';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadScores,
  rebaseScore,
  resetScore,
  saveScore,
  setData,
  setScore,
  testScore,
} from 'redux/modules/admin/gamification';
import { createPrompt } from 'redux/modules/prompts';

import AdminScoreSelector from 'components/Admin/AdminScoreSelector/AdminScoreSelector';
import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import TestScoreModal from 'components/Admin/TestScoreModal';

const listType = 'content';
const messages = defineMessages({
  userScore: { id: 'user-score', defaultMessage: 'User Score' },
  contentScore: { id: 'content-score', defaultMessage: 'Content Score' },
  error: { id: 'error', defaultMessage: 'Error' },
  reload: { id: 'reload', defaultMessage: 'Reload' },
  processing: { id: 'processing', defaultMessage: 'Processing' },
  testScore: { id: 'testScore', defaultMessage: 'Test Score' },
  done: { id: 'done', defaultMessage: 'Done' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
});

function mapStateToProps(state) {
  const { gamification } = state.admin;

  return {
    scoreLoaded: gamification.scoreLoaded,
    scoreLoading: gamification.scoreLoading,
    scoreError: gamification.scoreError,
    rebaseScoreStatus: gamification.rebaseScoreStatus,
    rebaselineLastRun: gamification.rebaselineLastRunContent,
    testScoreLoading: gamification.testScoreLoading,
    testScoreLoaded: gamification.testScoreLoaded,
    testScores: gamification.testScores, //gamification.testScores.filter(item => item.type === 'user'),
    isResetLoading: gamification.isContentResetScoreLoading,

    contentScore: gamification.contentScore,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    loadScores,
    rebaseScore,
    resetScore,
    saveScore,
    setScore,
    setData,
    testScore,
  })
)
export default class AdminContentAlgorithm extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      scoreLoading,
      //contentScore,
      scoreError,
    } = this.props;

    if (!scoreLoading && !scoreError) {
      this.props.loadScores(listType);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { rebaseScoreStatus, scoreError } = nextProps;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    // Rebase score
    if (rebaseScoreStatus) {
      this.props.createPrompt({
        id: uniqueId('processing-'),
        type: 'info',
        message: rebaseScoreStatus === 'processing' ? strings.processing : rebaseScoreStatus,
        dismissible: true,
        autoDismiss: 5
      });
      this.props.setData({ rebaseScoreStatus: '' });
    }

    const prevError = this.props.scoreError ? this.props.scoreError.message : '';
    if (scoreError && scoreError.message && (scoreError.message !== prevError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: scoreError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleRangeChange(value, context) {
    this.props.setScore(listType, context.keyValue, value);
  }

  handleToggle(event, context) {
    const value = event.currentTarget.checked ? context.value : context.min;
    this.props.setScore(listType, context.keyValue, value);
    this.props.saveScore(listType, context.keyValue, value);
  }

  handleSave(value, context) {
    this.props.saveScore(listType, context.keyValue, value);
  }

  handleRebaseScore() {
    this.props.rebaseScore(listType);
  }

  handleTestScoreClick() {
    this.setState({ isModalVisible: true });
  }

  handleTestScoreLoad() {
    this.props.testScore(listType);
  }

  handleTestScoreClose() {
    this.setState({ isModalVisible: false });
  }

  handleReset() {
    this.props.resetScore(listType);
  }

  render() {
    const {
      scoreLoaded,
      scoreError,
      testScoreLoading,
      testScores,
      className,
      style,
    } = this.props;
    const { formatMessage } = this.context.intl;
    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Loading
    if (!scoreLoaded && !scoreError) {
      return <Loader type="page" />;

      // Error
    } else if (scoreError && !scoreLoaded) {
      return (
        <Blankslate
          icon="error"
          heading={strings.error}
          message={scoreError.message}
          middle
        >
          <Btn onClick={() => this.props.loadScores(listType)}>{strings.reload}</Btn>
        </Blankslate>
      );
    }

    if (!this.props.contentScore || !this.props.contentScore.length) {
      return (
        <Blankslate
          icon="content"
          heading={strings.noResults}
          middle
        />
      );
    }

    return (
      <div className={className} style={style}>
        <AdminScoreSelector
          header={strings.contentScore}
          minValue={0}
          maxValue={1}
          step={0.1}
          list={this.props.contentScore}
          rebaselineLastRun={this.props.rebaselineLastRun}
          onToggle={this.handleToggle}
          onRangeChange={this.handleRangeChange}
          onSave={this.handleSave}
          showTestScore
          showRebaseScore
          showReset
          idResetLoading={this.props.isResetLoading}
          onResetClick={this.handleReset}
          onTestScoreClick={this.handleTestScoreClick}
          onRebaseScoreClick={this.handleRebaseScore}
        />
        <TestScoreModal
          list={testScores}
          loading={testScoreLoading}
          isVisible={this.state.isModalVisible}
          onClose={this.handleTestScoreClose}
          onLoad={this.handleTestScoreLoad}
        />
      </div>
    );
  }
}
