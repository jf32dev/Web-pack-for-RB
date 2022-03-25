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

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import SocialLinks from 'components/SocialLinks/SocialLinks';
import UserActions from 'components/UserActions/UserActions';
import UserThumb from 'components/UserThumb/UserThumb';

const messages = defineMessages({
  editProfile: { id: 'edit-profile', defaultMessage: 'Edit Profile' }
});

const UserCard = (props) => {
  const {
    user,
    social,
    companyData,
    badge,
    styles,
    onAnchorClick
  } = props;
  const showBadge = badge.colour && badge.title;
  const bgHexValue = badge.colour;
  const r = parseInt(bgHexValue.substr(1, 2), 16);
  const g = parseInt(bgHexValue.substr(3, 2), 16);
  const b = parseInt(bgHexValue.substr(5, 2), 16);
  const colorHex = (((r * 299) + (g * 587) + (b * 114)) / 1000) >= 128 ? '#000' : '#fff';

  return (
    <div className={styles.UserCard}>
      <div className={styles.info}>
        <h3>
          {user.name}
          {showBadge && <span
            className={styles.userScoreBadge}
            style={{ backgroundColor: bgHexValue, color: colorHex }}
          >
            {badge.title}
          </span>}
        </h3>
        <ul>
          {user.jobTitle || user.role && <li>{user.jobTitle || user.role}</li>}
          {companyData.department && <li>{companyData.department}</li>}
          {companyData.officeName && <li>{companyData.officeName}</li>}
          {user.mobileNumber && <li>{user.mobileNumber}</li>}
          {user.landlineNumber && <li>{user.landlineNumber}</li>}
          {user.email && <li><a href={'mailto:' + user.email}>{user.email}</a></li>}
        </ul>
      </div>
      <SocialLinks
        appleId={social.appleId}
        bloggerUrl={social.bloggerUrl}
        facebookUrl={social.facebookUrl}
        skypeId={social.skypeId}
        twitterUrl={social.twitterUrl}
        linkedin={social.linkedin}
        custom1={social.custom1}
        custom2={social.custom2}
        onAnchorClick={onAnchorClick}
      />
    </div>
  );
};

/**
 * UserDetails component
 */
export default class UserDetails extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['personal', 'public']),
    user: PropTypes.object.isRequired,
    social: PropTypes.object,
    badge: PropTypes.object,
    companyData: PropTypes.object,

    /** display call icon for public profile */
    showCall: PropTypes.bool,

    /** display chat icon for public profile */
    showChat: PropTypes.bool,

    /** display follow button for public profile */
    showFollow: PropTypes.bool,

    children: PropTypes.node,

    authString: PropTypes.string,

    onAnchorClick: PropTypes.func.isRequired,

    /** required if showCall enabled */
    onCallClick: function(props) {
      if (props.showCall && typeof props.onFollowClick !== 'function') {
        return new Error('onFollowClick is required when showCall is provided.');
      }
      return null;
    },

    /** required if showFollow enabled */
    onFollowClick: function(props) {
      if (props.showFollow && typeof props.onFollowClick !== 'function') {
        return new Error('onFollowClick is required when showFollow is provided.');
      }
      return null;
    }
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    type: 'public',
    authString: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleCallClick(event) {
    event.preventDefault();

    const { onCallClick } = this.props;
    if (typeof onCallClick === 'function') {
      onCallClick(event, this);
    }
  }

  handleFollowClick(event) {
    event.preventDefault();

    const { onFollowClick } = this.props;
    if (typeof onFollowClick === 'function') {
      onFollowClick(event, this);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      authString,
      type,
      user,
      social,
      badge,
      showCall,
      showChat,
      showFollow,
      companyData,
      onAnchorClick
    } = this.props;
    const styles = require('./UserDetails.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <section className={styles.UserDetails}>
        <div className={styles.userBadge}>
          <UserThumb
            name={user.name}
            thumbnail={user.thumbnail}
            width={126}
            authString={authString}
          />

          {type === 'personal' && <Btn
            href="/profile/edit"
            onClick={onAnchorClick}
          >
            {strings.editProfile}
          </Btn>}
          {type === 'public' && <UserActions
            id={user.id}
            isFollowed={user.isFollowed}
            showCall={showCall}
            showChat={showChat}
            showFollow={showFollow}
            onCallClick={this.handleCallClick}
            onChatClick={onAnchorClick}
            onFollowClick={this.handleFollowClick}
            className={styles.actions}
          />}
        </div>

        <UserCard
          user={user}
          social={social}
          badge={badge}
          companyData={companyData}
          styles={styles}
          onAnchorClick={onAnchorClick}
        />
        {this.props.children}
      </section>
    );
  }
}
