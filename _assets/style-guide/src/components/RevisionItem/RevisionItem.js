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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { defineMessages, FormattedDate } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

const messages = defineMessages({
  published: { id: 'published', defaultMessage: 'Published' },
});

export default class RevisionItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    permId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    author: PropTypes.object,
    colour: PropTypes.string,
    updated: PropTypes.number,

    thumbWidth: PropTypes.number,
    showThumb: PropTypes.bool,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    thumbWidth: 46,
    authString: ''
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // Randomise background-position
    const y = (Math.random() * 100).toFixed(0);
    this.bgPos = { bgPos: '0 ' + y + '%' };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      id,
      permId,
      name,
      thumbnail,
      updated,
      showThumb,
      thumbWidth,
      authString
    } = this.props;
    const anchorUrl = '/story/' + permId + '?rev=' + id;
    const styles = require('./RevisionItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      RevisionItem: true,
      originalItem: id === permId
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth,
      backgroundColor: (!showThumb || !thumbnail) ? this.props.colour : false,
      backgroundPosition: (!showThumb || !thumbnail) ? this.bgPos : false,
      backgroundImage: (showThumb && thumbnail) ? 'url(' + thumbnail + authString + ')' : false,
      backgroundSize: thumbnail ? 'cover' : '200%'
    };

    let noteText = this.props.note;
    if (!noteText) noteText = this.props.author.role || this.props.author.name;

    let dateElem;
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    // Revision before midnight of current day
    // e.g. 4:20 PM
    if (updated * 1000 > startOfToday) {
      dateElem = (
        <span className={styles.time} style={{ textTransform: 'uppercase' }}>
          <FormattedDate
            value={updated * 1000}
            hour="numeric"
            minute="numeric"
            hour12
          />
        </span>
      );

    // Revision older than today
    // e.g. 12/04/2016
    } else {
      dateElem = (
        <span className={styles.time}>
          <FormattedDate
            value={updated * 1000}
            day="2-digit"
            month="short"
            year="numeric"
          />
        </span>
      );
    }

    return (
      <div className={itemClasses} style={this.props.style} data-published-text={strings.published}>
        <a href={anchorUrl} title={name} onClick={this.handleClick}>
          {dateElem}
          <div className={styles.thumbnail} style={thumbStyle} />
          <div className={styles.info}>
            <span className={styles.name}>{name}</span>
            {noteText && <span className={styles.note}>{noteText}</span>}
          </div>
        </a>
      </div>
    );
  }
}
