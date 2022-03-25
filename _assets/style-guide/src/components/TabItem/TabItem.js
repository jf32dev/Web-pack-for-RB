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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';
import Highlighter from 'react-highlight-words';
import tinycolor from 'tinycolor2';

import Btn from 'components/Btn/Btn';
import UserActions from 'components/UserActions/UserActions';

/**
 * Clickable TabItem generally displayed in a List.
 */
export default class TabItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    childCount: PropTypes.number,

    /** coloured tile if thumbnail not enabled or available */
    colour: PropTypes.string,

    /** a string to display underneath Tab name */
    note: PropTypes.string,

    /** Overrides default <code>/tab/{id}</code> anchor href */
    anchorUrl: PropTypes.string,

    /** Allows nesting the default <code>/tab/{id}</code> anchor href */
    rootUrl: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** DEPRECATED - use isActive instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive instead.'
        );
      }
      return null;
    },

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    /** Show Additional buttons and different styles */
    showAdmin: PropTypes.bool,

    /** Show Edit button for Personal Tabs */
    showEdit: PropTypes.bool,

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
    thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    onEditClick: function(props) {
      if (props.showEdit && typeof props.onEditClick !== 'function') {
        return new Error('onEditClick is required when showEdit is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    rootUrl: '',
    authString: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isHovering: false
    };
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  handleMouseEnter() {
    this.setState({
      isHovering: true
    });
  }

  handleMouseLeave() {
    this.setState({
      isHovering: false
    });
  }

  handleEditClick(event) {
    event.stopPropagation();
    const { onEditClick } = this.props;

    if (typeof onEditClick === 'function') {
      onEditClick(event, this);
    }
  }

  renderCountNote() {
    const { naming } = this.context.settings;
    const { childCount } = this.props;
    const styles = require('./TabItem.less');
    return (
      <span className={styles.note}>
        <FormattedMessage
          id="n-channels"
          defaultMessage="{itemCount, plural, one {# {channel}} other {# {channels}}}"
          values={{ itemCount: childCount, channel: naming.channel, channels: naming.channels }}
        />
      </span>
    );
  }

  render() {
    const {
      id,
      name,
      thumbnail,
      childCount,
      note,
      grid,
      isActive,
      showAdmin,
      showEdit,
      showThumb,
      noLink,
      authString,
      className,
      style,
      searchTerm,
      baseColour,
    } = this.props;
    const styles = require('./TabItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      TabItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid,
      noLink: noLink,
      showEdit: showEdit
    }, className);

    const anchorUrl = this.props.anchorUrl || this.props.rootUrl + '/tab/' + id;

    let thumbWidth = this.props.thumbWidth;
    if (!thumbWidth) {
      thumbWidth = grid ? 200 : 46;
    }

    // Merge passed style with grid thumbWidth
    const itemStyle = {
      ...style,
      width: (style && !style.width || grid) ? thumbWidth + 'px' : 'auto'
    };

    const thumbClasses = cx({
      listThumbnail: !grid,
      gridThumbnail: grid
    });

    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth,
      backgroundColor: (!showThumb || !thumbnail) ? this.props.colour : false,
      backgroundImage: (showThumb && thumbnail) ? 'url(' + thumbnail + authString + ')' : false
    };

    const highlightedTextStyle = {
      backgroundColor: tinycolor(baseColour).lighten(15).toString()
    };

    const hasActions = showAdmin && !grid && showEdit;

    const itemContent = (
      <div className={styles.wrapper}>
        <div className={thumbClasses} style={thumbStyle} />
        <div className={styles.info} data-type="info">
          <span className={styles.name}>
            <Highlighter
              highlightClassName={styles.highlight}
              highlightStyle={this.state.isHovering && highlightedTextStyle || null}
              searchWords={[searchTerm]}
              autoEscape
              textToHighlight={name}
            />
            {!showAdmin && showEdit && <Btn icon="edit" borderless onClick={this.handleEditClick} />}
          </span>
          {note && <span className={styles.note}>{note}</span>}
          {(!note && childCount >= 0) && this.renderCountNote()}
        </div>
        {hasActions && <UserActions
          id={id}
          showFollow={false}
          showEdit={showEdit && (grid || this.state.isHovering)}
          onEditClick={this.handleEditClick}
          className={styles.actionClasses}
        />}
      </div>
    );

    if (noLink) {
      return (
        <div
          aria-label={name}
          data-id={id}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          className={itemClasses}
          style={itemStyle}
          title={name}
        >
          {itemContent}
        </div>
      );
    }

    return (
      <div
        aria-label={name}
        data-id={id}
        className={itemClasses}
        style={itemStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <a
          href={anchorUrl} title={name} data-id={id}
          onClick={this.handleClick}
        >
          {itemContent}
        </a>
      </div>
    );
  }
}
