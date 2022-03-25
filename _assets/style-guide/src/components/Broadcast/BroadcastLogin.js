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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import UserThumb from 'components/UserThumb/UserThumb';
import Text from 'components/Text/Text';
import Btn from 'components/Btn/Btn';

function validateEmail(email) {
  const re = /[^@]+@[^@]+\.[^@]+/;
  return re.test(email);
}
/**
 * Broadcast Login Component for the broadcast feature
 */
export default class BroadcastLogin extends Component {
  static propTypes = {

    /** the name of the user */
    name: PropTypes.string,

    /** the user thumbnail of the user */
    thumbnail: PropTypes.string,

    /** is online or off line */
    active: PropTypes.bool,

    /** require password or not */
    passwordRequired: PropTypes.bool,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    active: false,
    passwordRequired: false,
    name: '',
    thumbnail: '',
    strings: {
      broadcastNoPasswordMessage: 'To view the broadcast, enter your email address:',
      broadcastPasswordMessage: 'To view the broadcast, enter your email address and the password you recieved',
      broadcastOffLiveMessage: 'There is currently no live broadcast. This page will automatically update when broadcasting commences.',
      emailErrorMessage: 'The Email Address is in an invalid format.',
      email: 'Email',
      view: 'View',
      password: 'Password',
      live: 'Live',
      offline: 'Offline',
      roomId: 'Room Id'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isEmailFormatError: false,
    };
    autobind(this);
  }

  handleInputChange(event) {
    const type = event.currentTarget.dataset.type;

    this.setState({
      [type]: event.currentTarget.value,
    });

    if (type === 'email' && this.state.isEmailFormatError === true) {
      this.setState({
        isEmailFormatError: false,
      });
    }
  }

  handleSubmit() {
    const { onLogin } = this.props;
    if (validateEmail(this.state.email)) {
      if (onLogin && typeof onLogin === 'function') {
        onLogin(this.state.email, this.state.password);
      }
    } else {
      this.setState({
        isEmailFormatError: true,
      });
    }
  }

  render() {
    const {
      name,
      thumbnail,
      active,
      passwordRequired,
      strings
    } = this.props;

    const { isEmailFormatError, email, password } = this.state;

    const styles = require('./BroadcastLogin.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BroadcastLogin: true,
      PasswordRequired: passwordRequired,
      active: !active,
    }, this.props.className);

    const emailInputClasses = cx({
      emailInputError: isEmailFormatError,
    });

    let desc = strings.broadcastOffLiveMessage;
    if (active && passwordRequired) {
      desc = strings.broadcastPasswordMessage;
    } else if (active && !passwordRequired) {
      desc = strings.broadcastNoPasswordMessage;
    }


    return (
      <div className={classes} style={this.props.style}>
        <UserThumb
          name={name}
          thumbnail={thumbnail}
          width={100}
          className={styles.headingThumb}
        />
        <div className={styles.name}>
          <span className={styles.nameValue}>{name}</span>{active && <div className={styles.live}>{strings.live}</div>}
        </div>
        {!active && <div className={styles.offLive}>{strings.offline}</div>}
        <div className={styles.desc}>
          {desc}
        </div>
        {active && <Text
          width="280px"
          data-type="email"
          placeholder={strings.email}
          value={email}
          className={emailInputClasses}
          onChange={this.handleInputChange}
        />}
        {isEmailFormatError && <span className={styles.error}>{strings.emailErrorMessage}</span>}
        {passwordRequired && active && <Text
          type="password"
          width="280px"
          data-type="password"
          placeholder={strings.password}
          value={password}
          onChange={this.handleInputChange}
        />}
        {active && <Btn
          className={styles.viewBtn} onClick={this.handleSubmit} inverted
          large
        >{strings.view}</Btn>}
      </div>
    );
  }
}
