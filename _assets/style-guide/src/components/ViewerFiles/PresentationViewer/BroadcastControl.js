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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';
import InviteGuestsModal from './InviteGuestsModal';

/**
 * BroadcastControl description
 */
export default class BroadcastControl extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,

    onClick: PropTypes.func,
    /** Description of customProp1 */
    isBroadcastActive: PropTypes.bool,

    onShareClick: PropTypes.func,

    personalBroadcastElement: PropTypes.element,

    broadcast: PropTypes.object,

    clients: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    isVisible: false,
    isStartBroadcast: true,
    clients: [],
    strings: {
      broadcast: 'Broadcast',
      startBroadcast: 'Start Broadcast',
      stopBroadcast: 'Stop Broadcast',
      passwordProtected: 'Password Protected',
      inviteGuests: 'Invite Guests',
      shareLinkLabel: 'Share link with others',
      guests: 'Guests',
      guest: 'Guest',
      viewGuests: 'View Guests',
      inviteGuestsTitle: 'Share link with others',
      broadcastPasswordDesc: 'Use this generated password or type in your own',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isPasswordProtected: false,
      inviteGuestsModalVisible: false,
      password: '',
    };

    this.defaultPassword = Math.random().toString(36).slice(-16);
    autobind(this);
  }

  handlePassword(event) {
    const type = _get(event, 'currentTarget.dataset.type', '');
    if (type === 'checkbox') {
      this.setState({
        password: '',
        isPasswordProtected: !this.state.isPasswordProtected,
      });
    } else if (type === 'text') {
      this.setState({
        password: event.currentTarget.value,
      });
    }
  }

  handleNothing(event) {
    event.preventDefault();
    return false;
  }

  handleClick(event) {
    event.preventDefault();
    this.props.onClick(event, this.state.password || this.defaultPassword);
  }

  handleInviteGuestsModalClick(event, context, email, message) {
    this.setState({
      inviteGuestsModalVisible: false,
    });

    const type = _get(event, 'currentTarget.dataset.type', '');

    if (type === 'invite-share' && this.props.onShareClick && typeof this.props.onShareClick === 'function') {
      this.props.onShareClick(event, context, email, message);
    }
  }

  handleOnClick(event) {
    const type = _get(event, 'currentTarget.dataset.type', '');
    if (type === 'broadcast-invite') {
      this.setState({
        inviteGuestsModalVisible: true,
      });
    }
    // if (type === 'broadcast') {
    //   this.setState({
    //     isBroadcastControlVisible: !this.state.isBroadcastControlVisible,
    //   });
    // }
    //
    // if (type === 'note' || type.indexOf('broadcast-start') > -1) {
    //   this.props.onClick(event, isPasswordProtected);
    // }
  }

  render() {
    const {
      isVisible,
      isBroadcastActive,
      broadcast,
      personalBroadcastElement,
      strings,
      style,
      className
    } = this.props;
    const { isPasswordProtected, inviteGuestsModalVisible, password } = this.state;

    const styles = require('./BroadcastControl.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BroadcastControl: true,
      hidden: !isVisible,
    }, className);

    const footerClasses = cx({
      startFooter: !isBroadcastActive,
      stopFooter: isBroadcastActive,
    }, className);

    return (
      <div className={classes} style={style}>
        <div className={styles.BroadcastContainer}>
          <div className={styles.title}>
            {strings.broadcast}
          </div>
          <div className={styles.content}>
            <Btn
              inverted
              large
              warning={isBroadcastActive}
              onClick={this.handleClick}
              data-type={`broadcast-start${isPasswordProtected ? '-password' : ''}`}
            >{isBroadcastActive ? strings.stopBroadcast : strings.startBroadcast}</Btn>
          </div>
          <div className={footerClasses}>
            {!isBroadcastActive && <Checkbox
              className={styles.checkboxPasswordProtected}
              label={strings.passwordProtected}
              name="passwordProtected"
              value="passwordProtected"
              checked={isPasswordProtected}
              data-type="checkbox"
              onChange={this.handlePassword}
            />}
            {!isBroadcastActive && <span className={styles.desc}>{strings.broadcastPasswordDesc}</span>}
            {!isBroadcastActive && <Text
              id="example4"
              disabled={!isPasswordProtected}
              placeholder={this.defaultPassword}
              data-type="text"
              value={password}
              onChange={this.handlePassword}
            />}
            {isBroadcastActive && <div>
              <div className={styles.inviteGuestsTitle}>
                {strings.shareLinkLabel}
              </div>
              <Btn
                inverted large onClick={this.handleOnClick}
                data-type="broadcast-invite"
              >{strings.inviteGuests}</Btn>
              <Text value={broadcast.viewerUrl} className={styles.inputBox} onChange={this.handleNothing} />
            </div>
            }
          </div>
          {personalBroadcastElement}
        </div>
        <InviteGuestsModal
          isVisible={inviteGuestsModalVisible}
          strings={strings}
          onModalClose={this.handleInviteGuestsModalClick}
          onShareClick={this.handleInviteGuestsModalClick}
        />
      </div>
    );
  }
}
