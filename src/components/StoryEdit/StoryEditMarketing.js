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
import classNames from 'classnames/bind';
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';

const messages = defineMessages({
  emptyHeading: { id: 'campaigns', defaultMessage: 'Campaigns' },
  emptyMessage: { id: 'story-marketing-empty-message', defaultMessage: 'There are currently no campaigns linked to this {story}' },

  linkCampaign: { id: 'link-campaign', defaultMessage: 'Link Campaign' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  unlink: { id: 'unlink', defaultMessage: 'Unlink' },

  confirmDelete: { id: 'confirm-unlink-campaign', defaultMessage: 'Are you sure you want to unlink this campaign?' },
});

class CampaignEditItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,

    readonly: PropTypes.bool,

    strings: PropTypes.object,

    onDeleteClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false
    };
    autobind(this);
  }

  handleDeleteClick() {
    this.setState({ confirmDelete: true });
  }

  handleCancelDelete() {
    this.setState({ confirmDelete: false });
  }

  handleConfirmDelete(event) {
    // Propagate event with meeting id
    if (typeof this.props.onDeleteClick === 'function') {
      this.props.onDeleteClick(event, this.props.id);
    }
  }

  render() {
    const { name, readonly, strings, styles } = this.props;
    const { confirmDelete } = this.state;

    return (
      <div className={styles.CampaignEditItem}>
        <TransitionGroup>
          {confirmDelete && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={styles.confirmDelete}>
              <p>{strings.confirmDelete}</p>
              <ul>
                <li><Btn small alt onClick={this.handleCancelDelete}>{strings.cancel}</Btn></li>
                <li><Btn small inverted onClick={this.handleConfirmDelete}>{strings.unlink}</Btn></li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
        <span className={styles.thumbnail} />
        <div className={styles.wrapper}>
          <span className={styles.name}>{name}</span>
        </div>

        {!readonly && <div className={styles.actions}>
          <Btn warning onClick={this.handleDeleteClick}>{strings.unlink}</Btn>
        </div>}
      </div>
    );
  }
}

export default class StoryEditMarketing extends PureComponent {
  static propTypes = {
    crmCampaigns: PropTypes.array,

    /** Sets disabled state to inputs */
    readonly: PropTypes.bool,

    onAddClick: PropTypes.func.isRequired,
    onItemDeleteClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    crmCampaigns: []
  };

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { crmCampaigns, readonly } = this.props;
    const hasEvents = crmCampaigns.length > 0;
    const styles = require('./StoryEditMarketing.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryEditMarketing: true,
      readonly: readonly,
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <div id="story-edit-marketing" className={classes}>
        <div className={styles.eventsWrapper}>
          {!hasEvents && <Blankslate
            icon="crm-integration"
            iconSize={96}
            heading={strings.emptyHeading}
            message={strings.emptyMessage}
            inline
          >
            <Btn
              disabled={readonly}
              inverted
              onClick={this.props.onAddClick}
            >
              {strings.linkCampaign}
            </Btn>
          </Blankslate>}
          {hasEvents && crmCampaigns.map(e =>
            (<CampaignEditItem
              key={e.id}
              readonly={readonly}
              strings={strings}
              styles={styles}
              onDeleteClick={this.props.onItemDeleteClick}
              {...e}
            />)
          )}
          {hasEvents && <Btn
            data-id="add"
            disabled={readonly}
            inverted
            onClick={this.props.onAddClick}
          >
            {strings.linkCampaign}
          </Btn>}
        </div>
      </div>
    );
  }
}
