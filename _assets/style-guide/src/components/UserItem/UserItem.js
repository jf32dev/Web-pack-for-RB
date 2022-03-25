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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import UserActions from 'components/UserActions/UserActions';
import UserThumb from 'components/UserThumb/UserThumb';

/**
 * Legacy component. Not to be used for new development
 * Clickable UserItem generally displayed in a List.
 */
export default class UserItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,

    /** optional element to render in place of name */
    nameElement: PropTypes.element,

    /** shows thumbnail if available< */
    thumbnail: PropTypes.string,

    /** number indicating chat presence */
    presence: PropTypes.oneOf([0, 50, 70, 100]),

    /** link is disabled if deleted */
    status: PropTypes.oneOf(['active', 'deleted', 'invited', 'inactive', 'renew_password']),

    /** pass a string or property (i.e. <code>role</code>) */
    note: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** required if showFollow is used */
    isFollowed: PropTypes.bool,

    /** show Call icon - must set onCallClick */
    showCall: PropTypes.bool,

    /** show Chat icon - must set onChatClick */
    showChat: PropTypes.bool,

    /** show Plus icon or Tick icon depending if item is selected */
    showAdd: PropTypes.bool,

    /** show Edit icon - must set onEditClick */
    showEdit: PropTypes.bool,

    /** show Follow button (not for small grid) - must set onFollowClick */
    showFollow: PropTypes.bool,

    /** set false to force hide note */
    showNote: PropTypes.bool,

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** Show Unlink button to remove items from parent - Admin */
    showUnlink: PropTypes.bool,

    /** Show Select button to select items from parent - Admin */
    showSelect: PropTypes.bool,

    /** Automatically added by <code>List</code> component, adds padding to each item */
    inList: PropTypes.bool,

    /** grid style */
    grid: PropTypes.bool,

    /** Valid sizes: <code>tiny, small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),

    /** do not render an enclosing anchor tag on name & thumbnail */
    noLink: PropTypes.bool,

    /** custom anchor href (defaults to /people/id) */
    anchorLink: PropTypes.string,

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

    authString: PropTypes.string,

    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,

    onEditClick: function(props) {
      if (props.showEdit && typeof props.onEditClick !== 'function') {
        return new Error('onEditClick is required when showEdit is provided.');
      }
      return null;
    },

    onCallClick: function(props) {
      if (props.showCall && typeof props.onCallClick !== 'function') {
        return new Error('onCallClick is required when showCall is provided.');
      }
      return null;
    },

    onChatClick: function(props) {
      if (props.showChat && typeof props.onChatClick !== 'function') {
        return new Error('onChatClick is required when showChat is provided.');
      }
      return null;
    },

    onFollowClick: function(props) {
      if (props.showFollow && typeof props.onFollowClick !== 'function') {
        return new Error('onFollowClick is required when showFollow is provided.');
      }
      return null;
    },

    onUnlinkClick: function(props) {
      if (props.showUnlink && typeof props.onUnlinkClick !== 'function') {
        return new Error('onUnlinkClick is required when showUnlink is provided.');
      }
      return null;
    },

    infoClassName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    presence: 0,
    showNote: true,
    showThumb: true,
    thumbSize: 'large'
  };

  constructor(props) {
    super(props);
    this.state = {
      isHovering: false
    };
    autobind(this);
  }

  handleMouseEnter() {
    this.setState({ isHovering: true });
  }

  handleMouseLeave() {
    this.setState({ isHovering: false });
  }

  handleClick(event) {
    event.preventDefault();

    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  handleEditClick(event) {
    event.preventDefault();
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

  handleCallClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const { onCallClick } = this.props;
    if (typeof onCallClick === 'function') {
      onCallClick(event, this);
    }
  }

  handleChatClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const { onChatClick } = this.props;
    if (typeof onChatClick === 'function') {
      onChatClick(event, this);
    }
  }

  handleDeleteClick(event) {
    event.stopPropagation();
    const { onDeleteClick } = this.props;

    if (typeof onDeleteClick === 'function') {
      onDeleteClick(event, this);
    }
  }

  handleFollowClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const { onFollowClick } = this.props;
    if (typeof onFollowClick === 'function') {
      onFollowClick(event, this);
    }
  }

  handleDoubleClick(event) {
    if (typeof this.props.onDoubleClick === 'function') {
      this.props.onDoubleClick(event, this);
    }
  }

  handleSelectClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const { onSelectClick } = this.props;
    if (typeof onSelectClick === 'function') {
      onSelectClick(event, this);
    }
  }

  render() {
    const {
      id,
      name,
      nameElement,
      thumbnail,
      presence,
      status,
      isActive,
      isFollowed,
      showCall,
      showChat,
      showAdd,
      showDelete,
      showEdit,
      showFollow,
      showNote,
      showThumb,
      showUnlink,
      showSelect,
      grid,
      thumbSize,
      inList,
      anchorLink,
      authString,
      className,
      infoClassName,
      style
    } = this.props;
    // Deleted User
    const isDeleted = status === 'deleted';

    // User anchor URL
    const anchorUrl = anchorLink || '/people/' + id;
    const noLink = this.props.noLink || isDeleted;

    // Grid sizes
    let thumbWidth = this.props.thumbWidth;
    if (grid) {
      switch (thumbSize) {
        case 'tiny':
          thumbWidth = 28;
          break;
        case 'small':
          thumbWidth = 46;
          break;
        case 'medium':
          thumbWidth = 66;
          break;
        default:
          thumbWidth = 84;
          break;
      }

      // List sizes
    } else {
      switch (thumbSize) {
        case 'tiny':
          thumbWidth = 36;
          break;
        case 'small':
          thumbWidth = 46;
          break;
        case 'medium':
          thumbWidth = 64;
          break;
        default:
          thumbWidth = 84;
          break;
      }
    }

    const styles = require('./UserItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      UserItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid,
      inList: inList,

      listItemLarge: !grid && thumbSize === 'large',
      listItemMedium: !grid && thumbSize === 'medium',
      listItemSmall: !grid && thumbSize === 'small',
      listItemTiny: !grid && thumbSize === 'tiny',

      gridItemLarge: grid && thumbSize === 'large',
      gridItemMedium: grid && thumbSize === 'medium',
      gridItemSmall: grid && thumbSize === 'small',
      gridItemTiny: grid && thumbSize === 'tiny',

      listWithButton: !grid && showFollow,
      gridWithButton: grid && showFollow,
      isHovering: this.state.isHovering,
      showDelete: showDelete,
      noLink: noLink
    }, className);

    const actionClasses = cx({
      listActions: !grid,
      gridActions: grid
    });

    const thumbStyle = {
      minWidth: !grid && thumbWidth + 'px'
    };

    const infoClasses = cx({
      info: true,
    }, infoClassName);

    const infoStyle = {
      marginLeft: !grid && thumbWidth > 70 ? '0.5rem' : null
    };

    let noteText = this.props.note;
    if (!noteText && this.props.role) {
      noteText = this.props.role;
    }

    const isSmallGrid = grid && (thumbSize === 'small' || thumbSize === 'tiny');
    const hasActions = !isDeleted && !isSmallGrid && (showCall || showChat || showDelete || showFollow || showEdit || showAdd || showUnlink || showSelect);

    const thumbContent = (
      <div className={styles.thumbWrap} data-presence={presence}>
        <UserThumb
          name={name}
          thumbnail={showThumb ? thumbnail : ''}
          maxInitials={thumbSize === 'tiny' ? 1 : 2}
          width={thumbWidth}
          authString={authString}
          onClick={noLink && this.handleClick}
        />
      </div>
    );

    const linkContent = (
      <a
        href={anchorUrl}
        rel="noopener noreferrer"
        style={thumbStyle}
        onClick={this.handleClick}
      >
        {thumbContent}
      </a>
    );

    if (!this.props.children) {
      return (
        <div
          aria-label={name}
          data-id={id}
          className={itemClasses}
          style={style}
          onClick={noLink ? this.handleClick : undefined}
          onDoubleClick={this.handleDoubleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          title={name}
        >
          {noLink && thumbContent}
          {!noLink && linkContent}
          {!isSmallGrid && name && <div className={infoClasses} style={infoStyle}>
            {noLink && (nameElement || <span className={styles.name}>{name}</span>)}
            {!noLink && <a
              href={anchorUrl}
              className={styles.name}
              onClick={this.handleClick}
            >
              {nameElement || name}
            </a>}
            {(showNote && noteText) && <span className={styles.note} title={noteText}>{noteText}</span>}
          </div>}
          {hasActions && <UserActions
            id={id}
            isFollowed={isFollowed}
            showPlus={showAdd && !isActive}
            showTick={showAdd && isActive}
            showCall={showCall}
            showChat={showChat}
            showDelete={showDelete}
            showEdit={showEdit && (grid || this.state.isHovering)}
            showFollow={showFollow}
            showUnlink={showUnlink && !grid && this.state.isHovering}
            showSelect={showSelect}
            onCallClick={this.handleCallClick}
            onChatClick={this.handleChatClick}
            onDeleteClick={this.handleDeleteClick}
            onEditClick={this.handleEditClick}
            onUnlinkClick={this.handleUnlinkClick}
            onFollowClick={this.handleFollowClick}
            onSelectClick={this.handleSelectClick}
            className={actionClasses}
          />}
        </div>
      );
    }

    return (
      <div
        aria-label={name}
        data-id={id}
        className={itemClasses}
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        title={name}
      >
        {noLink && thumbContent}
        {!noLink && linkContent}
        {this.props.children}
      </div>
    );
  }
}
