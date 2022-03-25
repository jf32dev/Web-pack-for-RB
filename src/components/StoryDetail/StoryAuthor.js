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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SocialLinks from 'components/SocialLinks/SocialLinks';
import UserItem from 'components/UserItem/UserItem';

export default class StoryAuthor extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    descriptionText: PropTypes.string,

    isOwnStory: PropTypes.bool,

    showCall: PropTypes.bool,
    showChat: PropTypes.bool,
    showFollow: PropTypes.bool,

    onAnchorClick: PropTypes.func,
    onCallClick: PropTypes.func,
    onFollowClick: PropTypes.func,
    onSocialItemClick: PropTypes.func,
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired
  };

  render() {
    const { authString, user } = this.context.settings;
    const { author, descriptionText, isOwnStory } = this.props;
    const style = require('./StoryAuthor.less');

    return (
      <div className={style.StoryAuthor}>
        <UserItem
          {...author}
          thumbSize="large"
          anchorLink={isOwnStory ? '/profile' : null}
          showThumb
          authString={authString}
          showCall={this.props.showCall}
          showChat={this.props.showChat}
          showFollow={this.props.showFollow}
          onClick={this.props.onAnchorClick}
          onCallClick={this.props.onCallClick}
          onChatClick={this.props.onAnchorClick}
          onFollowClick={this.props.onFollowClick}
        />
        {author.social && <SocialLinks
          onAnchorClick={this.props.onSocialItemClick}
          className={style.socialLinks}
          {...author.social}
        />}
        {user.id !== author.id && descriptionText && <p>{descriptionText}</p>}
      </div>
    );
  }
}
