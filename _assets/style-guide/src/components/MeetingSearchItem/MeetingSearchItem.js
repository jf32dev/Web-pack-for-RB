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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import moment from 'moment';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import classNames from 'classnames/bind';

import StoryThumb from 'components/StoryThumb/StoryThumb';

export default class MeetingSearchItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    searchResult: PropTypes.object,

    /* unix timestamp */
    start: PropTypes.number,

    /* unix timestamp */
    end: PropTypes.number,
    allDay: PropTypes.bool,

    /* valid timezone */
    timezone: PropTypes.string,

    /** Valid story data */
    story: PropTypes.object,

    showThumb: PropTypes.bool,
    selected: PropTypes.bool,
    rootUrl: PropTypes.string,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    searchResult: {},
    rootUrl: '',
    authString: ''
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, this);
    }
  }

  render() {
    const {
      id,
      name,
      searchResult,
      start,
      end,
      allDay,
      timezone,
      story,
      selected,
      rootUrl,
      authString,
      className,
      style
    } = this.props;
    const anchorUrl = rootUrl + '/story/' + (story.permId || story.id) + '/meeting/' + id;
    const styles = require('./MeetingSearchItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      MeetingSearchItem: true,
      selected: selected
    }, className);

    const isAnotherDay = Math.abs(moment(end * 1000).diff(start * 1000));

    return (
      <div className={itemClasses} style={style}>
        <a href={anchorUrl} title={name || story.name} onClick={this.handleClick}>
          <div className={styles.thumbnailDay}>
            <FormattedDate
              value={start * 1000}
              timeZone={timezone}
              day="2-digit"
            />
          </div>

          <div className={styles.info}>
            {searchResult.name && <span className={styles.name} dangerouslySetInnerHTML={{ __html: searchResult.name }} />}
            {!searchResult.name && <span className={styles.name}>{name || story.name}</span>}
            <div className={styles.timeContainer}>
              {!allDay && isAnotherDay > 0 && <span className={styles.time}>
                <span>
                  <FormattedDate
                    value={start * 1000}
                    timeZone={timezone}
                    day="2-digit"
                    month="short"
                    year="numeric"
                    hour="2-digit"
                    minute="2-digit"
                  />
                </span>
                <span>
                  <FormattedDate
                    value={end * 1000}
                    timeZone={timezone}
                    day="2-digit"
                    month="short"
                    year="numeric"
                    hour="2-digit"
                    minute="2-digit"
                  />
                </span>
              </span>}

              {!allDay && isAnotherDay === 0 && <span className={styles.time}>
                <span>
                  <FormattedDate
                    value={start * 1000}
                    timeZone={timezone}
                    day="2-digit"
                    month="short"
                    year="numeric"
                  />
                </span>
                <span>
                  <FormattedDate
                    value={start * 1000}
                    timeZone={timezone}
                    hour="2-digit"
                    minute="2-digit"
                  /> - <FormattedDate
                    value={end * 1000}
                    timeZone={timezone}
                    hour="2-digit"
                    minute="2-digit"
                  />
                </span>
              </span>}

              {allDay && <span className={styles.time}>
                <span>
                  <FormattedDate
                    value={start * 1000}
                    timeZone={timezone}
                    day="2-digit"
                    month="short"
                    year="numeric"
                  />
                </span>
                <span>
                  <FormattedDate
                    value={start * 1000}
                    timeZone={timezone}
                    hour="2-digit"
                    minute="2-digit"
                  />
                  <span> - </span>
                  <FormattedMessage
                    id="all-day"
                    defaultMessage="All day"
                    tagName="span"
                  />
                </span>
              </span>}
            </div>
            <div className={styles.storyContainer}>
              <StoryThumb
                showThumb
                thumbWidth={15}
                authString={authString}
                {...story}
              />
              <span className={styles.title}>{story.name}</span>
            </div>
          </div>
        </a>
      </div>
    );
  }
}
