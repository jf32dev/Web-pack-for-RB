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

import _get from 'lodash/get';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Checkbox from 'components/Checkbox/Checkbox';
import GroupThumb from 'components/GroupThumb/GroupThumb';
import UserActions from 'components/UserActions/UserActions';

const messages = defineMessages({
  administrator: { id: 'administrator', defaultMessage: 'Administrator' },
});

/**
 * Clickable GroupItem generally displayed in a List.
 */
export default class GroupItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
    thumbnail: PropTypes.string,

    /** Hex colour code to use in place of thumbnail */
    colour: PropTypes.string,

    /* Personal group has email */
    email: PropTypes.string,

    /* search key word */
    search: PropTypes.string,

    /** DEPRECATED - use colour instead */
    defaultColour: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use colour.'
        );
      }
      return null;
    },

    childCount: PropTypes.number,
    childType: PropTypes.string,

    /** DEPRECATED - use showCheckbox instead */
    usersCount: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use childCount.'
        );
      }
      return null;
    },

    notes: PropTypes.string,
    permissions: PropTypes.number,

    /** grid style */
    grid: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Show Additional buttons and different styles */
    showAdmin: PropTypes.bool,

    /* All users actions only for admin */
    showBulkUpload: PropTypes.bool,
    showUserDefault: PropTypes.bool,
    showUserDefaultNotifications: PropTypes.bool,
    showDefaulMetadata: PropTypes.bool,
    showGlobalAvatar: PropTypes.bool,

    showUnlink: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Marks checkbox as checked (not currently used) */
    isSelected: PropTypes.bool,

    /** show Plus icon or Tick icon depending if item isActive - Use for Admin */
    showAdd: PropTypes.bool,

    /** Show Edit button for Admin */
    showEdit: PropTypes.bool,

    /** Show Delete button for Admin */
    showDelete: PropTypes.bool,

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** display arrow indicator in list style */
    showArrow: PropTypes.bool,

    /** display checkbox in list style before the thumb */
    showCheckbox: PropTypes.bool,

    hideThumbnail: PropTypes.bool,

    /** DEPRECATED - use isActive or isSelected instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive or isSelected instead.'
        );
      }
      return null;
    },

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    authString: PropTypes.string,

    /** Marks user as administrator of the group */
    isGroupAdmin: PropTypes.bool,

    /** display Administrator checkbox under group name */
    showAdministratorCheckbox: PropTypes.bool,

    onAdministratorCheckboxClick: function(props) {
      if (props.showAdministratorCheckbox && typeof props.onAdministratorCheckboxClick !== 'function') {
        return new Error('onAdministratorCheckboxClick is required when showAdministratorCheckbox is provided.');
      }
      return null;
    },

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

    onBulkUploadClick: function(props) {
      if (props.showBulkUpload && typeof props.onBulkUploadClick !== 'function') {
        return new Error('onBulkUploadClick is required when showBulkUpload is provided.');
      }
      return null;
    },

    onUserDefaultsClick: function(props) {
      if (props.showUserDefault && typeof props.onUserDefaultsClick !== 'function') {
        return new Error('onUserDefaultsClick is required when showUserDefault is provided.');
      }
      return null;
    },

    onCheckboxClick: function(props) {
      if (props.showCheckbox && typeof props.onCheckboxClick !== 'function') {
        return new Error('onCheckboxClick is required when showCheckbox is provided.');
      }
      return null;
    },

    onUnlinkClick: function(props) {
      if (props.showUnlink && typeof props.onUnlinkClick !== 'function') {
        return new Error('onUnlinkClick is required when showUnlink is provided.');
      }
      return null;
    },

    onAddClick: PropTypes.func,

    onTickClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object
  };

  static defaultProps = {
    thumbSize: 'large',
    isSelected: false,
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

  handleAddClick(event) {
    event.stopPropagation();
    const { onAddClick } = this.props;

    if (typeof onAddClick === 'function') {
      onAddClick(event, this);
    }
  }

  handleTickClick(event) {
    event.stopPropagation();
    const { onTickClick } = this.props;

    if (typeof onTickClick === 'function') {
      onTickClick(event, this);
    }
  }

  handleSearch(str = '', search = '') {
    const splitArray = str.toLowerCase().split(search.toLowerCase());
    const all = splitArray.reduce((accumulator, current) => {
      if (accumulator.length > 0) {
        const end = _get(accumulator[accumulator.length - 1], 'end', 0);
        return accumulator.concat([{
          start: end,
          end: end + search.length,
          strong: true
        }, {
          start: end + search.length,
          end: end + search.length + current.length
        }]);
      }
      return [{
        start: 0,
        end: current.length,
      }];
    }, []);

    return (all.reduce((accumulator, currentValue) =>
      [accumulator,
        currentValue.strong ?
          <b key={currentValue.end}>{str.substring(currentValue.start, currentValue.end)}</b> :
          str.substring(currentValue.start, currentValue.end)
      ], ''));
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      id,
      name,
      email,
      search,
      childCount,
      childType,
      //notes,
      //permissions,
      isActive,
      isGroupAdmin,
      isSelected,
      thumbSize,
      showCheckbox,
      showAdmin,
      showAdd,
      showBulkUpload,
      showEdit,
      showDelete,
      showUnlink,
      showUserDefault,
      showUserDefaultNotifications,
      showDefaultMetadata,
      grid,
      noLink,
      className,
      style
    } = this.props;
    const styles = require('./GroupItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      GroupItem: true,
      isActive: isActive,
      showAdmin: showAdmin && !grid,
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
      listItemArrow: this.props.showArrow && !grid
    }, className);

    const thumbClasses = cx({
      canSubscribe: this.props.canSubscribe && !this.props.showGlobalAvatar,
      showGlobalAvatar: showAdmin && this.props.showGlobalAvatar
    });

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Group anchor url
    const anchorUrl = '/group/' + id;

    // Hide info if small grid (tooltip shows intead)
    const hideInfo = grid && thumbSize === 'small';

    const hasActions = showAdmin && !grid && thumbSize === 'small' && (showEdit || showUnlink || showAdd || showDelete || showBulkUpload || showUserDefault || showUserDefaultNotifications || showDefaultMetadata);

    const childCountTmp = this.props.usersCount || childCount;
    const itemContent = (
      <div className={styles.wrapper}>
        {showCheckbox && <Checkbox
          name={id + ''}
          checked={isSelected}
          onChange={this.props.onCheckboxClick}
          className={styles.checkbox}
        />}
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
          {!noLink && <a
            href={anchorUrl} title={name} className={styles.name}
            onClick={this.handleClick}
          >
            {this.handleSearch(name, search)}
          </a>}
          {noLink && <span title={name} className={styles.name}>{name}</span>}
          {!email && childCountTmp >= 0 && <span className={styles.note}>
            {(childType === 'user' || !childType) && <FormattedMessage
              id="n-users"
              defaultMessage="{itemCount, plural, one {# user} other {# users}}"
              values={{ itemCount: childCountTmp }}
            />}
            {childType === 'interest-group' && <FormattedMessage
              id="n-interest-area"
              defaultMessage="{itemCount, plural, one {# interest area} other {# interest areas}}"
              values={{ itemCount: childCountTmp }}
            />}
          </span>}
          {email && <span className={styles.note} title={email}>{email}</span>}
          {this.props.showAdministratorCheckbox && <Checkbox
            name={id + '_isAdministrator'}
            value={id}
            checked={!!isGroupAdmin}
            label={strings.administrator}
            onChange={this.props.onAdministratorCheckboxClick}
            className={styles.checkbox}
          />}
        </div>}
        {hasActions && <UserActions
          id={id}
          showFollow={false}
          showPlus={showAdd && !isActive}
          showTick={showAdd && isActive}
          showEdit={showEdit && (grid || this.state.isHovering)}
          showDelete={showDelete}
          showUnlink={showUnlink && !grid && this.state.isHovering}
          onUnlinkClick={this.handleUnlinkClick}
          showUserDefault={showUserDefault}
          showUserDefaultNotifications={showUserDefaultNotifications}
          showDefaultMetadata={showDefaultMetadata}
          showBulkUpload={showBulkUpload}
          onEditClick={this.handleEditClick}
          onAddClick={this.handleAddClick}
          onDeleteClick={this.handleDeleteClick}
          onBulkUploadClick={this.props.onBulkUploadClick}
          onUserDefaultsClick={this.props.onUserDefaultsClick}
          onUserDefaultNotificationsClick={this.props.onUserDefaultNotificationsClick}
          onTickClick={this.handleTickClick}
        />}
      </div>
    );

    if (noLink) {
      return (
        <div
          aria-label={name}
          className={itemClasses}
          style={style}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          title={name}
        >
          {itemContent}
        </div>
      );
    }

    return (
      <div
        aria-label={name}
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
