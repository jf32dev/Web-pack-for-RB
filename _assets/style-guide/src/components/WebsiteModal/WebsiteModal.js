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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

export default class WebsiteModal extends Component {
  static propTypes = {
    headerLabel: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,

    onCancel: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      url: this.props.url,
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
  }

  handleNameChange(event) {
    this.setState({ name: event.currentTarget.value });
  }

  handleUrlChange(event) {
    // Check url
    this.setState({ url: event.currentTarget.value });
  }

  handleSave(event) {
    this.props.onClick(event, this);
  }

  renderBody() {
    const styles = require('./WebsiteModal.less');

    return (
      <div className={styles.ContainerModal}>
        <Text
          id="websiteTitle"
          placeholder="Link Title"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <Text
          id="websiteAddress"
          placeholder="Link Address"
          value={this.state.url}
          onChange={this.handleUrlChange}
        />
      </div>
    );
  }

  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        width="medium"
        headerCloseButton
        headerTitle={this.props.headerLabel}
        footerChildren={(
          <div>
            <Btn
              borderless alt large
              onClick={this.props.onCancel}
            >
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Btn>
            <Btn
              borderless inverted large
              onClick={this.handleSave}
            >
              {!this.props.id && <FormattedMessage id="add" defaultMessage="Add" />}
              {this.props.id > 0 && <FormattedMessage id="save" defaultMessage="Save" />}
            </Btn>
          </div>
        )}
        onClose={this.props.onCancel}
      >
        {this.renderBody()}
      </Modal>
    );
  }
}
