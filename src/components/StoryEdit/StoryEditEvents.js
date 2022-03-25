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

import { defineMessages, FormattedDate } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';

const messages = defineMessages({
  emptyHeading: { id: 'meetings', defaultMessage: 'Meetings' },
  emptyMessage: { id: 'story-meetings-empty-message', defaultMessage: 'There are currently no meetings attached to this {story}' },

  addMeeting: { id: 'add-meeting', defaultMessage: 'Add {meetings}' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  allDay: { id: 'all-day', defaultMessage: 'All Day' },
  confirmDelete: { id: 'confirm-delete-meeting', defaultMessage: 'Are you sure you want to delete this {meeting}?' },
});

class EventEditItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
    tz: PropTypes.string,
    allDay: PropTypes.bool,

    readonly: PropTypes.bool,

    strings: PropTypes.object,

    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false
    };
    autobind(this);
  }

  handleEditClick(event) {
    // Propagate event with meeting id
    if (typeof this.props.onEditClick === 'function') {
      this.props.onEditClick(event, this.props.id);
    }
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
    const { title, start, end, tz, allDay, readonly, strings, styles } = this.props;
    const { confirmDelete } = this.state;

    let dateElem;
    const startTime = start * 1000;
    const endTime = end * 1000;

    // Check if event start/ends on the same day
    let sameDay = false;
    const s = new Date(startTime);
    const e = new Date(endTime);
    if (s.toDateString() === e.toDateString()) {
      sameDay = true;
    }

    // All Day Event
    if (allDay) {
      dateElem = (<div>
        <FormattedDate
          value={startTime}
          timeZone={tz}
          day="2-digit"
          month="short"
          year="numeric"
          timeZoneName="short"
        />
        <span className={styles.divider}>({strings.allDay})</span>
      </div>);

    // Meeting starts and ends on same day
    } else if (sameDay) {
      dateElem = (<div>
        <FormattedDate
          value={startTime}
          timeZone={tz}
          day="2-digit"
          month="short"
          year="numeric"
          hour="numeric"
          minute="numeric"
        />
        <span className={styles.divider}>-</span>
        <FormattedDate
          value={endTime}
          timeZone={tz}
          hour="numeric"
          minute="numeric"
          timeZoneName="short"
        />
      </div>);

    // Meeting spans multiple days
    } else {
      dateElem = (<div>
        <p><FormattedDate
          value={startTime}
          timeZone={tz}
          day="2-digit"
          month="short"
          year="numeric"
          hour="numeric"
          minute="numeric"
        /></p>
        <p><FormattedDate
          value={endTime}
          timeZone={tz}
          day="2-digit"
          month="short"
          year="numeric"
          hour="numeric"
          minute="numeric"
          timeZoneName="short"
        /></p>
      </div>);
    }

    return (
      <div className={styles.EventEditItem}>
        <TransitionGroup>
          {confirmDelete && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div data-id="confirm-delete" className={styles.confirmDelete}>
              <p>{strings.confirmDelete}</p>
              <ul>
                <li>
                  <Btn
                    data-id="cancel"
                    small
                    alt
                    disabled={readonly}
                    onClick={this.handleCancelDelete}
                  >
                    {strings.cancel}
                  </Btn>
                </li>
                <li>
                  <Btn
                    data-id="delete"
                    small
                    inverted
                    disabled={readonly}
                    onClick={this.handleConfirmDelete}
                  >
                    {strings.delete}
                  </Btn>
                </li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
        <span className={styles.thumbnail} />
        <div className={styles.eventWrapper}>
          <span className={styles.title}>{title}</span>
          <div className={styles.datetime}>
            {dateElem}
          </div>
        </div>

        {!readonly && <div data-id="actions" className={styles.actions}>
          <Btn
            data-id="edit"
            inverted
            onClick={this.handleEditClick}
          >
            {strings.edit}
          </Btn>
          <Btn
            data-id="delete"
            warning
            onClick={this.handleDeleteClick}
          >
            {strings.delete}
          </Btn>
        </div>}
      </div>
    );
  }
}

export default class StoryEditEvents extends PureComponent {
  static propTypes = {
    events: PropTypes.array,

    /** Sets disabled state to inputs */
    readonly: PropTypes.bool,

    onAddClick: PropTypes.func.isRequired,
    onItemEditClick: PropTypes.func.isRequired,
    onItemDeleteClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    events: []
  };

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { events, readonly } = this.props;
    const hasEvents = events.length > 0;
    const styles = require('./StoryEditEvents.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, { meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    return (
      <div id="story-edit-events" className={styles.StoryEditEvents}>
        <div className={styles.eventsWrapper}>
          {!hasEvents && <Blankslate
            icon="calendar"
            iconSize={96}
            heading={strings.emptyHeading}
            message={strings.emptyMessage}
            inline
          >
            {!readonly && <Btn
              data-id="add"
              inverted
              onClick={this.props.onAddClick}
            >
              {strings.addMeeting}
            </Btn>}
          </Blankslate>}
          {hasEvents && events.map(e =>
            (<EventEditItem
              key={e.id}
              readonly={readonly}
              strings={strings}
              styles={styles}
              onEditClick={this.props.onItemEditClick}
              onDeleteClick={this.props.onItemDeleteClick}
              {...e}
            />)
          )}
          {!readonly && hasEvents && <Btn
            data-id="add"
            inverted
            onClick={this.props.onAddClick}
          >
            {strings.addMeeting}
          </Btn>}
        </div>
      </div>
    );
  }
}
