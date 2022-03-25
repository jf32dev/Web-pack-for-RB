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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import moment from 'moment';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { FormattedMessage, FormattedDate } from 'react-intl';

import Btn from 'components/Btn/Btn';

/**
 * Clickable EventItem generally displayed in a List.
 */
export default class EventItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    thumbnail: PropTypes.string,

    /* unix timestamp */
    start: PropTypes.number,

    /* unix timestamp */
    end: PropTypes.number,

    /* valid timezone */
    tz: PropTypes.string,
    allDay: PropTypes.bool,

    storyId: PropTypes.number.isRequired,
    storyTitle: PropTypes.string.isRequired,
    storyColour: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** DEPRECATED - use isActive or isSelected instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive instead.'
        );
      }
      return null;
    },

    showUpdate: PropTypes.bool,
    onUpdateClick: function(props) {
      if (props.showUpdate && typeof props.onUpdateClick !== 'function') {
        return new Error('onUpdateClick is required when showUpdate is provided.');
      }
      return null;
    },

    showPrepare: PropTypes.bool,
    onPrepareClick: function(props) {
      if (props.showPrepare && typeof props.onPrepareClick !== 'function') {
        return new Error('onPrepareClick is required when showPrepare is provided.');
      }
      return null;
    },

    /** Pass all strings as an object */
    strings: PropTypes.object,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    thumbSize: 'large',
    strings: {
      prepare: 'Prepare',
      update: 'Update'
    }
  };

  constructor(props) {
    super(props);

    // Randomise background-position
    const bgPos = (Math.random() * 100).toFixed(0);
    this.state = { bgPos: '0 ' + bgPos + '%' };

    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();

    // Propagate props to onClick handler
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  render() {
    const {
      id,
      start,
      end,
      //tz,
      allDay,
      storyId,
      storyColour,
      thumbnail,
      grid,
      isActive,
      thumbSize,
      showThumb,
      authString,
      className,
      strings,
      style
    } = this.props;
    const title = this.props.title || this.props.storyTitle;
    const anchorUrl = '/story/' + storyId + '/meeting/' + id;

    let thumbWidth = this.props.thumbWidth;

    // Grid sizes
    if (grid) {
      switch (thumbSize) {
        case 'small':
          thumbWidth = 46;
          break;
        case 'medium':
          thumbWidth = 150;
          break;
        default:
          thumbWidth = 200;
          break;
      }

    // List sizes
    } else {
      switch (thumbSize) {
        case 'small':
          thumbWidth = 46;
          break;
        case 'medium':
          thumbWidth = 66;
          break;
        default:
          thumbWidth = 90;
          break;
      }
    }

    const styles = require('./EventItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      EventItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid,

      listItemLarge: !grid && thumbSize === 'large',
      listItemMedium: !grid && thumbSize === 'medium',
      listItemSmall: !grid && thumbSize === 'small',

      gridItemLarge: grid && thumbSize === 'large',
      gridItemMedium: grid && thumbSize === 'medium',
      gridItemSmall: grid && thumbSize === 'small'
    }, className);

    // Hide info if small grid (tooltip shows intead)
    const hideInfo = grid && thumbSize === 'small';

    // Merge passed style with grid thumbWidth
    const itemStyle = {
      ...style,
      width: (style && !style.width || grid) ? thumbWidth + 'px' : 'auto'
    };

    const thumbClasses = cx({
      thumbnail: true,
      listThumbnail: !grid,
      gridThumbnail: grid
    });

    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth,
      backgroundColor: (!showThumb || !thumbnail) ? storyColour : false,
      backgroundPosition: (!showThumb || !thumbnail) ? this.state.bgPos : false,
      backgroundImage: (showThumb && thumbnail) ? 'url(' + thumbnail + authString + ')' : false,
      backgroundSize: thumbnail ? 'cover' : '200%'
    };

    const startDate = (
      <FormattedDate
        value={start * 1000}
        day="2-digit"
        month="short"
        year="numeric"
        hour="numeric"
        minute="numeric"
      />
    );

    const endDate = (
      <FormattedDate
        value={end * 1000}
        day="2-digit"
        month="short"
        year="numeric"
        hour="numeric"
        minute="numeric"
      />
    );

    const endTime = (
      <FormattedDate
        value={end * 1000}
        hour="numeric"
        minute="numeric"
      />
    );

    let noteText = endTime;
    if (allDay) {
      noteText = (
        <FormattedMessage
          id="all-day"
          description="All day event"
          defaultMessage="All day"
        />
      );
    } else {
      const dateDiff = moment(end * 1000).diff(start * 1000);
      if (parseInt(moment.duration(dateDiff).asDays(), 10)) {
        noteText = endDate;
      }
    }

    return (
      <div aria-label={title} className={itemClasses} style={itemStyle}>
        <a href={anchorUrl} onClick={this.handleClick}>
          <div className={thumbClasses} style={thumbStyle} />
          {!hideInfo && <div className={styles.info}>
            <span className={styles.name}>{title}</span>
            {noteText && <span className={styles.note}>{startDate} - {noteText}</span>}
          </div>}
          {this.props.showPrepare && <Btn small onClick={this.props.onPrepareClick}>{strings.prepare}</Btn>}
          {this.props.showUpdate && <Btn small onClick={this.props.onUpdateClick}>{strings.update}</Btn>}
        </a>
      </div>
    );
  }
}
