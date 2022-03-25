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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import UserActions from 'components/UserActions/UserActions';
import UserThumb from 'components/UserThumb/UserThumb';

const UserItemNew = ({
  id,
  name,
  hideEmail,
  thumbnail,
  presence,
  email,
  role,
  isFollowed,
  showCall,
  showChat,
  grid,
  thumbSize,
  userIcon,
  applyPadding,
  authString,
  onClick,
  onCallClick,
  onChatClick,
  onFollowClick,
  hasUserActions,
  className,
  style
}) => {
  const styles = require('./UserItemNew.less');
  const cx = classNames.bind(styles);

  const itemClasses = cx({
    UserItem: true,
    listItem: !grid,
    itemPadding: applyPadding,
    gridItem: grid,
  }, className);

  const infoClasses = cx({
    info: true,
    hideEmail
  });

  const actionClasses = cx({
    listActions: !grid,
    gridActions: grid
  });

  const handleClick = (event) => {
    event.preventDefault();

    if (typeof onClick === 'function') {
      onClick(event, { props: { id } });
    }
  };

  const handleCallClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (typeof onCallClick === 'function') {
      onCallClick(event);
    }
  };

  const handleEmailClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newWindow = window.open(`mailto:${email}`, '_blank');
    newWindow.opener = null;
  };

  const handleChatClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (typeof onChatClick === 'function') {
      onChatClick(event);
    }
  };

  const handleFollowClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (typeof onFollowClick === 'function') {
      onFollowClick(event, { props: { id, isFollowed } });
    }
  };

  let thumbWidth = 56;

  if (grid) {
    thumbWidth = 180;
  } else if (thumbSize === 'tiny') {
    thumbWidth = 46;
  } else if (thumbSize === 'x-tiny') {
    thumbWidth = 36;
  }

  const thumbContent = (
    <div className={styles.thumbWrap} data-presence={presence}>
      <UserThumb
        name={name}
        {...{ thumbnail }}
        maxInitials={2}
        width={thumbWidth}
        authString={authString}
        onClick={handleClick}
      />
    </div>
  );

  const roleEmail = (!grid ? <span className={styles.emailRole} title={email}>{email}</span> : <span className={styles.emailRole} title={role}>{role}</span>);

  const iconClass = cx({
    [userIcon]: true,
    icon: true,
  });

  const UserNameWithIcon = ({ hasIcon }) => {
    if (hasIcon) {
      return <div className={styles.userNameWithIcon}><span className={styles.username}>{name}</span><i className={iconClass} /></div>;
    }
    return <span className={styles.name}>{name}</span>;
  };

  return (
    <div
      aria-label={name}
      data-id={id}
      className={itemClasses}
      style={style}
      onClick={handleClick}
      title={name}
    >
      {thumbContent}
      <div className={infoClasses}>
        <UserNameWithIcon hasIcon={!!userIcon} />
        {!hideEmail && roleEmail}
      </div>
      {hasUserActions && <UserActions
        id={id}
        isFollowed={isFollowed}
        showCall={!grid && showCall}
        showChat={!grid && showChat}
        showEmail={!grid}
        showFollow={grid}
        onCallClick={handleCallClick}
        onEmailClick={handleEmailClick}
        onChatClick={handleChatClick}
        onFollowClick={handleFollowClick}
        className={actionClasses}
        style={{ marginRight: '0' }}
      />}
    </div>
  );
};

UserItemNew.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  role: PropTypes.string,
  thumbnail: PropTypes.string,

  /** toggle displaying email */
  hideEmail: PropTypes.bool,

  /** number indicating chat presence */
  presence: PropTypes.oneOf([0, 50, 70, 100]),

  /** required if showFollow is used */
  isFollowed: PropTypes.bool,

  /** grid style */
  grid: PropTypes.bool,

  /** Valid sizes: <code>tiny, small</code> */
  thumbSize: PropTypes.oneOf([
    'tiny',
    'x-tiny'
  ]),

  authString: PropTypes.string,

  onClick: PropTypes.func,

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

  hasUserActions: PropTypes.bool,

  className: PropTypes.string,
  style: PropTypes.object
};

UserItemNew.defaultProps = {
  authString: '',
  hideEmail: false,
  presence: 0,
};

export default UserItemNew;
