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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */
import uniqueId from 'lodash/uniqueId';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';

const messages = defineMessages({
  testScore: { id: 'testScore', defaultMessage: 'Test Score' },
  done: { id: 'done', defaultMessage: 'Done' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
});

class TestScoreItem extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    rawScore: PropTypes.number,
    fullname: PropTypes.string,
    title: PropTypes.string,
  };

  render() {
    const {
      type,
      fullname,
      title,
      rawScore,
    } = this.props;

    if (type === 'user') {
      return (
        <div>
          <span>{fullname}</span>
          <span>{rawScore}</span>
        </div>
      );
    }

    // Content item
    return (
      <div>
        <span>{title}</span>
        <span>{rawScore}</span>
      </div>
    );
  }
}

export default class TestScoreModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    loading: PropTypes.bool,
    list: PropTypes.array,

    onClose: PropTypes.func,
    onLoad: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    list: []
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.isVisible && nextProps.isVisible) {
      this.props.onLoad();
    }
  }

  renderBody(strings) {
    const { loading, list } = this.props;
    const styles = require('./TestScoreModal.less');

    if (loading) {
      return (
        <div className={styles.loaderContainer}>
          <Loader
            type="content"
            style={{ margin: '0 auto', height: '100%' }}
          />
        </div>
      );
    }

    if (!loading && !list.length) {
      return (
        <Blankslate
          icon="content"
          iconSize={96}
          message={strings.noResults}
          middle
        />
      );
    }

    return (
      <div className={styles.testScoreList}>
        {list.map((item) =>
          (<TestScoreItem
            key={uniqueId('test-item-')}
            styles={styles}
            {...item}
          />)
        )}
      </div>
    );
  }

  render() {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const styles = require('./TestScoreModal.less');
    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <Modal
        headerTitle={strings.testScore}
        isVisible={this.props.isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        footerClassName={styles.modalFooter}
        onClose={this.props.onClose}
        footerChildren={(
          <div>
            <Btn
              large
              inverted
              onClick={this.props.onClose}
            >{strings.done}</Btn>
          </div>
        )}
      >
        {this.renderBody(strings)}
      </Modal>
    );
  }
}
