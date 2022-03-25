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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import UserItemNew from 'components/UserItemNew/UserItemNew';
/**
 * UserSearchItem displays user email as note and a list of skills.
 */
export default class UserSearchItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,

    /** shows thumbnail if available< */
    thumbnail: PropTypes.string,

    /** number indicating chat presence */
    presence: PropTypes.oneOf([0, 50, 70, 100]),

    jobTitle: PropTypes.string,
    role: PropTypes.string,
    skills: PropTypes.array,

    /** required if showFollow is used */
    isFollowed: PropTypes.bool,

    /** show Call icon - must set onCallClick */
    showCall: PropTypes.bool,

    /** show Chat icon - must set onChatClick */
    showChat: PropTypes.bool,

    /** show Follow button (not for small grid) - must set onFollowClick */
    showFollow: PropTypes.bool,

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** indicates selected state */
    selected: PropTypes.bool,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

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

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    showFollow: false,
    skills: [],
    authString: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();

    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(event, this);
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

  handleFollowClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const { onFollowClick } = this.props;
    if (typeof onFollowClick === 'function') {
      onFollowClick(event, this);
    }
  }

  render() {
    const {
      id,
      name,
      presence,
      email,
      thumbnail,
      jobTitle,
      role,
      showThumb,
      selected,
      showCall,
      showChat,
      className,
      style
    } = this.props;
    const styles = require('./UserSearchItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      UserSearchItem: true,
      selected: selected
    }, className);

    const userData = {
      id: id,
      name: name,
      presence: presence,
      thumbnail: thumbnail,
      email: email,
      jobTitle: jobTitle,
      role: role,
      showThumb: showThumb,
      authString: this.props.authString
    };

    return (
      <div className={itemClasses} style={style} onClick={this.handleClick}>
        <UserItemNew
          grid={false}
          applyPadding
          hasUserActions
          onClick={this.props.onClick}
          className={styles.userItem}
          onCallClick={this.handleCallClick}
          onChatClick={this.handleChatClick}
          {...{ showCall }}
          {...{ showChat }}
          {...userData}
        />
      </div>
    );
  }
}
