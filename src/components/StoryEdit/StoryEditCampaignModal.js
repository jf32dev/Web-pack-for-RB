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
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Select from 'components/Select/Select';

const messages = defineMessages({
  linkCampaign: { id: 'link-campaign', defaultMessage: 'Link Campaign' },

  add: { id: 'add', defaultMessage: 'Add' },
  save: { id: 'save', defaultMessage: 'Save' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' }
});

export default class StoryEditCampaignModal extends PureComponent {
  static propTypes = {
    campaigns: PropTypes.array,
    isLoading: PropTypes.bool,
    error: PropTypes.object,

    /** Called on mount and clear */
    onLoad: PropTypes.func.isRequired,
    onNextPage: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      campaignData: null,
      canSave: false
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.onLoad();
  }

  handleChange(data) {
    if (!data) {
      this.props.onLoad();
    }

    this.setState({
      campaignData: data,
      canSave: true
    });
  }

  handleSaveClick(event) {
    // Propagate with event data
    if (typeof this.props.onSave === 'function') {
      this.props.onSave(event, this.state.campaignData);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { campaignData } = this.state;
    const {
      campaigns,
      isLoading,
      error,
      onClose
    } = this.props;
    const styles = require('./StoryEditCampaignModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      modalWrap: true,
      isLoading: isLoading
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <Modal
        autosize={false}
        escClosesModal
        isVisible
        headerTitle={strings.linkCampaign}
        headerCloseButton
        footerChildren={(
          <div>
            <Btn large alt onClick={onClose}>
              {strings.cancel}
            </Btn>
            <Btn large inverted disabled={!this.state.canSave} onClick={this.handleSaveClick}>
              {strings.save}
            </Btn>
          </div>
        )}
        onClose={onClose}
        className={classes}
        bodyClassName={styles.modalBody}
      >
        <div className={styles.StoryEditCampaignModal}>
          <Select
            name="crmCampaign-select"
            isLoading={isLoading}
            disabled={error}
            labelKey="name"
            valueKey="id"
            value={campaignData}
            searchable
            options={campaigns}
            onChange={this.handleChange}
            onInputChange={this.props.onSearch}
            onMenuScrollToBottom={this.props.onNextPage}
          />
          {error && <p className={styles.error}>{error.message}</p>}
        </div>
      </Modal>
    );
  }
}
