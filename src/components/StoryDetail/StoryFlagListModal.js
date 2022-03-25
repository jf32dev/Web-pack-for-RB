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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { FormattedDate, defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';
import UserItem from 'components/UserItem/UserItem';

const messages = defineMessages({
  clearFlags: { id: 'clear-flags', defaultMessage: 'Clear Flags', },
  flaggedStory: { id: 'flagged-story', defaultMessage: 'Flagged {story}', },
  cancel: { id: 'cancel', defaultMessage: 'Cancel', },
  clear: { id: 'clear', defaultMessage: 'Clear', },
  close: { id: 'close', defaultMessage: 'Close', },
  reasonForRemoval: { id: 'reason-for-removal', defaultMessage: 'Reason for removal', },
  customMajorIssues: { id: 'custom-major-issues', defaultMessage: '{major} Issues' },
  customMinorIssues: { id: 'custom-minor-issues', defaultMessage: '{minor} Issues' },
  customPossibleIssues: { id: 'custom-possible-issues', defaultMessage: '{possible} Issues' },
});

class FlagItem extends PureComponent {
  static propTypes = {
    storyFlagId: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    date: PropTypes.number.isRequired,
    canDelete: PropTypes.bool,

    strings: PropTypes.object.isRequired,

    onFlagClear: PropTypes.func,
    onUserClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    canDelete: false
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
      message: ''
    };
    autobind(this);

    // refs
    this.clear = null;
    this.input = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.confirmDelete && this.state.confirmDelete) {
      this.input.focus();
    }
  }

  handleClearFlagClick() {
    this.setState({
      confirmDelete: true
    });
  }

  handleCancelDelete(event) {
    event.preventDefault();
    this.setState({ confirmDelete: false });
  }

  handleConfirmDelete(event) {
    event.preventDefault();

    const { onFlagClear } = this.props;
    if (typeof onFlagClear === 'function') {
      onFlagClear(event, this.props.storyFlagId, this.state.message);
    }

    this.setState({ confirmDelete: false });
  }

  handleMessageChange(event) {
    this.setState({
      message: event.target.value
    });
  }

  handleMessageKeyDown(event) {
    // handle return clicked
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      this.clear.click();
    }
  }

  render() {
    const { storyFlagId, comment, user, canDelete, strings, styles } = this.props;
    const { confirmDelete, message } = this.state;

    return (
      <div data-story-flag-id={storyFlagId} className={styles.FlagItem}>
        <TransitionGroup>
          {confirmDelete && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={styles.confirmDelete}>
              <Text
                ref={(c) => { this.input = c; }}
                placeholder={strings.reasonForRemoval}
                value={message}
                onChange={this.handleMessageChange}
                onKeyDown={this.handleMessageKeyDown}
                className={styles.messageInput}
              />
              <ul>
                <li>
                  <Btn
                    alt
                    onClick={this.handleCancelDelete}
                  >
                    {strings.cancel}
                  </Btn>
                </li>
                <li>
                  <Btn
                    ref={(c) => { this.clear = c; }}
                    disabled={!message}
                    inverted
                    onClick={this.handleConfirmDelete}
                  >
                    {strings.clear}
                  </Btn>
                </li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
        <div className={styles.flagWrap}>
          <p>{comment}</p>
          <UserItem
            {...user}
            note={<FormattedDate
              value={this.props.date * 1000}
              day="2-digit"
              month="long"
              year="numeric"
            />}
            thumbSize="tiny"
            onClick={this.props.onUserClick}
          />
          {canDelete && <span className={styles.clearFlag} onClick={this.handleClearFlagClick} />}
        </div>
      </div>
    );
  }
}

export default class StoryFlagListModal extends PureComponent {
  static propTypes = {
    flags: PropTypes.array,
    isVisible: PropTypes.bool,
    canDelete: PropTypes.bool,

    onClose: PropTypes.func.isRequired,
    onFlagClear: PropTypes.func.isRequired,
    onUserClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    isVisible: false,
    canDelete: false,
    flags: []
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
      message: ''
    };
    autobind(this);

    // refs
    this.clear = null;
    this.input = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Reset state when closing
    if (!nextProps.isVisible) {
      this.setState({
        confirmDelete: false,
        message: ''
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.confirmDelete && this.state.confirmDelete) {
      this.input.focus();
    }
  }

  handleClearAllClick() {
    this.setState({
      confirmDelete: true
    });
  }

  handleCancelDelete(event) {
    event.preventDefault();
    this.setState({ confirmDelete: false });
  }

  handleConfirmDelete(event) {
    event.preventDefault();

    const { onFlagClear } = this.props;
    if (typeof onFlagClear === 'function') {
      onFlagClear(event, 0, this.state.message);
    }

    this.setState({
      confirmDelete: false,
      message: ''
    });
  }

  handleMessageChange(event) {
    this.setState({
      message: event.target.value
    });
  }


  handleMessageKeyDown(event) {
    // handle return clicked
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      this.clear.click();
    }
  }

  renderBody(strings) {
    const { flags, canDelete, onFlagClear, onUserClick } = this.props;
    const styles = require('./StoryFlagListModal.less');

    const major = flags.filter(f => f.flagId === 3);
    const minor = flags.filter(f => f.flagId === 2);
    const possible = flags.filter(f => f.flagId === 1);

    return (
      <div className={styles.StoryFlagListModal}>
        {major.length > 0 && <section className={styles.majorList}>
          <h5 data-flag-id={3}>{strings.customMajorIssues}</h5>
          {major.map(flag => (
            <FlagItem key={flag.storyFlagId} {...flag} canDelete={canDelete} onFlagClear={onFlagClear} onUserClick={onUserClick} styles={styles} strings={strings} />
          ))}
        </section>}
        {minor.length > 0 && <section className={styles.minorList}>
          <h5 data-flag-id={2}>{strings.customMinorIssues}</h5>
          {minor.map(flag => (
            <FlagItem key={flag.storyFlagId} {...flag} canDelete={canDelete} onFlagClear={onFlagClear} onUserClick={onUserClick} styles={styles} strings={strings} />
          ))}
        </section>}
        {possible.length > 0 && <section className={styles.possibleList}>
          <h5 data-flag-id={1}>{strings.customPossibleIssues}</h5>
          {possible.map(flag => (
            <FlagItem key={flag.storyFlagId} {...flag} canDelete={canDelete} onFlagClear={onFlagClear} onUserClick={onUserClick} styles={styles} strings={strings} />
          ))}
        </section>}
      </div>
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { canDelete, onClose } = this.props;
    const { confirmDelete, message } = this.state;
    const styles = require('./StoryFlagListModal.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <Modal
        isVisible={this.props.isVisible}
        width="medium"
        headerTitle={strings.flaggedStory}
        headerCloseButton
        footerChildren={(
          <div>
            {confirmDelete && <Text
              ref={(c) => { this.input = c; }}
              placeholder={strings.reasonForRemoval}
              value={message}
              onChange={this.handleMessageChange}
              onKeyDown={this.handleMessageKeyDown}
              className={styles.clearAllmessageInput}
            />}
            <Btn
              borderless
              alt
              large
              onClick={confirmDelete ? this.handleCancelDelete : onClose}
            >
              {canDelete ? strings.cancel : strings.close}
            </Btn>
            {canDelete && <Btn
              ref={(c) => { this.clear = c; }}
              disabled={confirmDelete ? !message : false}
              borderless
              inverted
              large
              onClick={confirmDelete ? this.handleConfirmDelete : this.handleClearAllClick}
            >
              {strings.clearFlags}
            </Btn>}
          </div>
        )}
        onClose={onClose}
      >
        {this.renderBody(strings)}
      </Modal>
    );
  }
}
