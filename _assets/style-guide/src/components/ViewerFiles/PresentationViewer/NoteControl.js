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
 * @author Jason huang <jason.huang@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

/**
 * NoteControl description
 */
export default class NoteControl extends Component {
  static propTypes = {
    /** Description of customProp1 */
    speakerNotes: PropTypes.string,

    /** Description of customProp2 */
    personalNotesElement: PropTypes.element,

    canCreateNote: PropTypes.bool,

    isVisible: PropTypes.bool,

    selectTypes: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    speakerNotes: '',
    strings: {
      speakerNotes: 'Speaker Notes',
      personalNotes: 'Personal Notes',
    },
    isCreateBtnVisible: true,
    isEmptyNotes: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      noteSelect: 'speakerNotes',
    };

    autobind(this);
  }

  handleTitleClick(event) {
    const type = event.currentTarget.dataset.type;
    if (type !== this.state.noteSelect) {
      const { selectTypes } = this.props;
      if (selectTypes && typeof selectTypes === 'function') {
        selectTypes(type);
      }

      this.setState({
        noteSelect: type,
      });
    }
  }

  render() {
    const {
      speakerNotes,
      isVisible,
      strings,
      personalNotesElement,
      canCreateNote,
    } = this.props;

    const {
      noteSelect,
    } = this.state;

    const styles = require('./NoteControl.less');
    const cx = classNames.bind(styles);

    const classes = cx({
      NoteControl: true,
      hidden: !isVisible,
    }, this.props.className);

    let titles = ['speakerNotes'];

    if (canCreateNote) {
      titles = ['speakerNotes', 'personalNotes'];
    }

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.noteContainer}>
          <div className={styles.title}>
            {titles.map(title => (
              <div
                key={title} className={title === noteSelect && styles.active} onClick={this.handleTitleClick}
                data-type={`${title}`}
              >
                {strings[title]}
              </div>
            ))}
          </div>
          {noteSelect === 'speakerNotes' && speakerNotes && <div className={styles.speakerNotes} dangerouslySetInnerHTML={{ __html: speakerNotes }} />}
          {noteSelect === 'speakerNotes' && !speakerNotes && <div className={styles.noNotes}>{strings.noNotes}</div>}
          {noteSelect === 'personalNotes' && personalNotesElement }
        </div>
      </div>
    );
  }
}
