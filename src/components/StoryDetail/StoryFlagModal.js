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
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Textarea from 'components/Textarea/Textarea';
import RadioGroup from 'components/RadioGroup/RadioGroup';

const messages = defineMessages({
  flagStory: { id: 'flag-story', defaultMessage: 'Flag {story}' },
  flag: { id: 'flag', defaultMessage: 'Flag' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  issue: { id: 'issue', defaultMessage: 'Issue' },
  flagCommentPlaceholder: { id: 'flag-comment-placeholder', defaultMessage: 'Add a reason why you\'re flagging this {story}' }
});

export default class StoryFlagModal extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFlagClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: '3',
      textareaValue: ''
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Reset state when closing
    if (!nextProps.isVisible) {
      this.setState({
        selectedValue: '3',
        textareaValue: ''
      });
    }
  }

  handleRadioGroupChange(event) {
    this.setState({
      selectedValue: event.currentTarget.value
    });
  }

  handleTextareaChange(event) {
    this.setState({
      textareaValue: event.currentTarget.value
    });
  }

  handleFlagClick(event) {
    // Propagate event with state data
    this.props.onFlagClick(event, this.state);
  }

  renderBody(strings) {
    const styles = require('./StoryFlagModal.less');
    const { naming } = this.context.settings;

    return (
      <div className={styles.StoryFlagModal}>
        <RadioGroup
          legend={strings.issue}
          name="issue"
          selectedValue={this.state.selectedValue}
          onChange={this.handleRadioGroupChange}
          inlineInputs
          inlineLegend
          options={[{
            label: naming.major,
            value: '3'
          }, {
            label: naming.minor,
            value: '2'
          }, {
            label: naming.possible,
            value: '1'
          }]}
          className={styles.issueWrap}
        />
        <Textarea
          name="comment"
          placeholder={strings.flagCommentPlaceholder}
          value={this.state.textareaValue}
          onChange={this.handleTextareaChange}
        />
      </div>
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { onClose } = this.props;

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <Modal
        isVisible={this.props.isVisible}
        width="medium"
        headerTitle={strings.flagStory}
        headerCloseButton
        footerChildren={(
          <div>
            <Btn borderless alt large onClick={onClose}>
              {strings.cancel}
            </Btn>
            <Btn borderless disabled={!this.state.textareaValue} inverted large onClick={this.handleFlagClick}>
              {strings.flag}
            </Btn>
          </div>
        )}
        onClose={onClose}
      >
        {this.renderBody(strings)}
      </Modal>
    );
  }
}
