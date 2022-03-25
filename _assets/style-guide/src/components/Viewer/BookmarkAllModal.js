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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

const messages = defineMessages({
  bookmarkAll: { id: 'bookmark-all', defaultMessage: 'Bookmark All' },
  add: { id: 'add', defaultMessage: 'Add' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  name: { id: 'name', defaultMessage: 'Name' },
  bookmarkName: { id: 'bookmark-name', defaultMessage: 'Bookmark Name' },
});

export default class BookmarkAllModal extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      textValue: ''
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Reset state when closing
    if (!nextProps.isVisible) {
      this.setState({
        textValue: ''
      });
    }
  }

  handleTextChange(event) {
    this.setState({
      textValue: event.currentTarget.value
    });
  }

  handleAddClick(event) {
    // Propagate event with state data
    this.props.onSave(event, this.state);
  }

  renderBody(strings) {
    const styles = require('./BookmarkAllModal.less');

    return (
      <div className={styles.BookmarkAllModal}>
        <Text
          name="bookmark-all"
          placeholder={strings.bookmarkName}
          value={this.state.textValue}
          onChange={this.handleTextChange}
        />
      </div>
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { onCancel } = this.props;

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <Modal
        isVisible={this.props.isVisible}
        width="medium"
        headerCloseButton
        headerTitle={strings.bookmarkAll}
        footerChildren={(
          <div>
            <Btn
              borderless alt large
              onClick={onCancel}
            >
              {strings.cancel}
            </Btn>
            <Btn
              borderless disabled={!this.state.textValue} inverted
              large onClick={this.handleAddClick}
            >
              {strings.add}
            </Btn>
          </div>
        )}
        onClose={onCancel}
      >
        {this.renderBody(strings)}
      </Modal>
    );
  }
}
