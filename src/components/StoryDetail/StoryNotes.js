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
import { FormattedDate, FormattedRelative } from 'react-intl';

const NoteItem = (props) => {
  const anchorUrl = '/note/' + props.id + '/edit';

  let dateElem;
  const updatedTime = props.updatedAt * 1000;
  const oneWeekBeforeNow = Date.now() - (86400000 * 7);

  // Note edited within last 7 days
  if (updatedTime > oneWeekBeforeNow) {
    dateElem = (
      <React.Fragment>
        <span style={{ marginRight: '0.25rem' }}>
          <FormattedDate
            value={updatedTime}
            weekday="short"
            day="2-digit"
            month="short"
            year="numeric"
            hour="numeric"
            minute="numeric"
            timeZone={props.tz}
            hour12
          />
        </span>
        (<FormattedRelative
          value={updatedTime}
          timeZone={props.tz}
          style="best fit"
        />)
      </React.Fragment>
    );

    // Meeting in the past or more than 1 week in the future
  } else {
    dateElem = (
      <FormattedDate
        value={updatedTime}
        weekday="short"
        day="2-digit"
        month="short"
        year="numeric"
        hour="numeric"
        minute="numeric"
        timeZone={props.tz}
        hour12
      />
    );
  }

  return (
    <li>
      <a href={anchorUrl} className={props.styles.title} onClick={props.onClick}>
        {props.name}
      </a>
      <span className={props.styles.time}>
        {dateElem}
      </span>
    </li>
  );
};

export default class StoryNotes extends PureComponent {
  static propTypes = {
    notes: PropTypes.array.isRequired,
    strings: PropTypes.object,
    onNoteClick: PropTypes.func.isRequired,
    onAddNoteClick: PropTypes.func
  };

  static defaultProps = {
    strings: {
      personalNotes: 'Personal Notes',
      personalNotesDescription: 'Add a Personal Note to this Story with relevant infomation that only you can see.',
      addNote: 'Add Note'
    }
  };

  render() {
    const { notes, strings, onNoteClick, onAddNoteClick } = this.props;
    const styles = require('./StoryNotes.less');

    return (
      <div className={styles.StoryNotes}>
        <h4>{strings.personalNotes}</h4>
        <p>{strings.personalNotesDescription}</p>
        {onAddNoteClick && <p className={styles.addNote}>
          <a href="/note/new" onClick={onAddNoteClick}>{strings.addNote}</a>
        </p>}
        {notes.length > 0 && <ul>
          {notes.map(note => (
            <NoteItem
              key={'note-' + note.id}
              styles={styles}
              onClick={onNoteClick}
              {...note}
            />
          )
          )
          }
        </ul>}
      </div>
    );
  }
}
