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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';

import GroupThumb from 'components/GroupThumb/GroupThumb';
import UserActions from 'components/UserActions/UserActions';

/**
 * Clickable CourseItem generally displayed in a List.
 */
export default class CourseItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    thumbnail: PropTypes.string,

    /** Hex colour code to use in place of thumbnail */
    colour: PropTypes.string,

    childCount: PropTypes.number,
    childType: PropTypes.string,

    notes: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    showUnlink: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Show Edit button for Admin */
    showEdit: PropTypes.bool,

    /** Show Delete button for Admin */
    showDelete: PropTypes.bool,

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    hideThumbnail: PropTypes.bool,

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    onEditClick: function(props) {
      if (props.showEdit && typeof props.onEditClick !== 'function') {
        return new Error('onEditClick is required when showEdit is provided.');
      }
      return null;
    },

    onDeleteClick: function(props) {
      if (props.showDelete && typeof props.onDeleteClick !== 'function') {
        return new Error('onDeleteClick is required when onDeleteClick is provided.');
      }
      return null;
    },

    onUnlinkClick: function(props) {
      if (props.showUnlink && typeof props.onUnlinkClick !== 'function') {
        return new Error('onUnlinkClick is required when showUnlink is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object
  };

  static defaultProps = {
    thumbSize: 'large',
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

    // Propagate props to onClick handler
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  handleDoubleClick(event) {
    if (typeof this.props.onDoubleClick === 'function') {
      this.props.onDoubleClick(event, this);
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

  handleUnlinkClick(event) {
    event.stopPropagation();
    const { onUnlinkClick } = this.props;

    if (typeof onUnlinkClick === 'function') {
      onUnlinkClick(event, this.props);
    }
  }

  handleDeleteClick(event) {
    event.stopPropagation();
    const { onDeleteClick } = this.props;

    if (typeof onDeleteClick === 'function') {
      onDeleteClick(event, this);
    }
  }

  render() {
    const {
      id,
      title,
      childCount,
      childType,
      isActive,
      thumbSize,
      showEdit,
      showDelete,
      showUnlink,
      grid,
      noLink,
      className,
      style
    } = this.props;
    const styles = require('./CourseItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      GroupItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid,

      listItemLarge: !grid && thumbSize === 'large',
      listItemMedium: !grid && thumbSize === 'medium',
      listItemSmall: !grid && thumbSize === 'small',
      listItemTiny: !grid && thumbSize === 'tiny',

      gridItemLarge: grid && thumbSize === 'large',
      gridItemMedium: grid && thumbSize === 'medium',
      gridItemSmall: grid && thumbSize === 'small',
      gridItemTiny: grid && thumbSize === 'tiny',

      noLink: noLink,
      showEdit: showEdit,
      showDelete: showDelete,
    }, className);

    const thumbClasses = cx({
      education: true,
    });

    // Group anchor url
    const anchorUrl = '/group/' + id;

    // Hide info if small grid (tooltip shows intead)
    const hideInfo = grid && thumbSize === 'small';

    const hasActions = !grid && thumbSize === 'small' && (showEdit || showUnlink || showDelete);

    const childCountTmp = childCount;
    const itemContent = (
      <div className={styles.wrapper}>
        {!this.props.hideThumbnail && <a
          href={anchorUrl}
          onClick={!noLink ? this.handleClick : null}
        >
          <GroupThumb
            {...this.props}
            className={thumbClasses}
          />
        </a>}
        {!hideInfo && <div className={styles.info} style={{ width: (this.props.hideThumbnail ? '75%' : null) }}>
          <span title={title} className={styles.name}>{title}</span>
          {childCountTmp >= 0 && <span className={styles.note}>
            {(childType === 'user' || !childType) && <FormattedMessage
              id="n-users"
              defaultMessage="{itemCount, plural, one {# user} other {# users}}"
              values={{ itemCount: childCountTmp }}
            />}
          </span>}
        </div>}
        {hasActions && <UserActions
          id={id}
          showFollow={false}
          showEdit={showEdit && !this.props.email && !this.props.isPersonal && (grid || this.state.isHovering)}
          showDelete={showDelete}
          showUnlink={showUnlink && !grid && this.state.isHovering}
          onUnlinkClick={this.handleUnlinkClick}
          onEditClick={this.handleEditClick}
          onDeleteClick={this.handleDeleteClick}
        />}
      </div>
    );

    if (noLink) {
      return (
        <div
          aria-label={title}
          className={itemClasses}
          style={style}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {itemContent}
        </div>
      );
    }

    return (
      <div
        aria-label={title}
        className={itemClasses}
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {itemContent}
      </div>
    );
  }
}
