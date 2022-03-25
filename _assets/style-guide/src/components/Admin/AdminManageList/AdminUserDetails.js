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
 * @copyright 2010-2016 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import DropMenu from 'components/DropMenu/DropMenu';
import List from 'components/List/List';
import UserThumb from 'components/UserThumb/UserThumb';

const messages = defineMessages({
  email: { id: 'email', defaultMessage: 'Email' },
  role: { id: 'role', defaultMessage: 'role' },
  groups: { id: 'groups', defaultMessage: 'groups' },
  status: { id: 'status', defaultMessage: 'status' },
  configurationBundle: { id: 'configuration-bundle', defaultMessage: 'Configuration Bundle' },
  timeZone: { id: 'time-zone', defaultMessage: 'Time Zone' },
  metadata: { id: 'metadata', defaultMessage: 'Metadata' },

  unlockAccount: { id: 'unlock-account', defaultMessage: 'Unlock Account' },
  resendInvitation: { id: 'resend-invitation', defaultMessage: 'Resend invitation' },
  resetOnboardingExperience: { id: 'reset-on-boarding-experience', defaultMessage: 'Reset on-boarding experience' },
  noGroupsFound: { id: 'no-groups-found', defaultMessage: 'No Groups Found' },
});

const globalGroupLimit = 5;

/**
 * Manage lists
 */
export default class AdminUserDetails extends Component {
  static propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    thumbnail: PropTypes.string,
    jobTitle: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string,
    configurationBundle: PropTypes.object,
    timezone: PropTypes.string,

    /** items must have a <code>type</code> */
    groups: PropTypes.array,

    /** items must have a <code>type</code> */
    metadata: PropTypes.array,

    /** Explicitly set a numeric width */
    width: PropTypes.number,

    /** Explicitly set a numeric height */
    height: PropTypes.number,

    showResendInvitation: PropTypes.bool,
    showResetBoardingExperience: PropTypes.bool,
    showUnlockPassword: PropTypes.bool,

    onResendInvitationClick: function(props) {
      if (props.showResendInvitation && typeof props.onResendInvitationClick !== 'function') {
        return new Error('onResendInvitationClick is required when showResendInvitation is provided.');
      }
      return null;
    },
    onResetBoardingExperienceClick: function(props) {
      if (props.showResetBoardingExperience && typeof props.onResetBoardingExperienceClick !== 'function') {
        return new Error('onResetBoardingExperienceClick is required when showResetBoardingExperience is provided.');
      }
      return null;
    },

    onUnlockPasswordClick: function(props) {
      if (props.showUnlockPassword && typeof props.onUnlockPasswordClick !== 'function') {
        return new Error('onUnlockPasswordClick is required when showUnlockPassword is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    width: 300,
    groups: [],
    metadata: [],
    showResendInvitation: false,
    showResetBoardingExperience: false,
    showUnlockPassword: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      groups: props.groups.slice(0, globalGroupLimit)
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({
        groups: nextProps.groups.slice(0, globalGroupLimit)
      });
    }
  }

  handleShowMoreGroups() {
    const total = this.state.groups.length + globalGroupLimit;
    this.setState({
      groups: this.props.groups.slice(0, total)
    });
  }

  render() {
    const {
      name,
      firstName,
      lastName,
      email,
      jobTitle,
      thumbnail,
      role,
      status,
      configurationBundle,
      timezone,
      metadata,
      width,
      height,
      showResendInvitation,
      showResetBoardingExperience,
      showUnlockPassword,
      style,
    } = this.props;

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    const styles = require('./AdminUserDetails.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      UserDetails: true,
    });

    const fName = name || (firstName + ' ' + lastName);

    return (
      <aside
        className={classes}
        style={{
          width: width && !isNaN(width) ? width : null,
          height: height || null,
          ...style
        }}
      >
        <header className={styles.header}>
          <UserThumb
            name={fName}
            thumbnail={thumbnail}
            width={60}
            className={styles.headingThumb}
          />
          <div className={styles.name} title={fName}>{fName}</div>
          <div className={styles.jobTitle} title={jobTitle}>{jobTitle}</div>

          {(showResendInvitation || showResetBoardingExperience) && <div className={styles.actions}>
            <DropMenu
              icon="gear"
              position={{ right: 10 }}
              width={220}
            >
              <ul>
                {showUnlockPassword && <li onClick={this.props.onUnlockPasswordClick}>{strings.unlockAccount}</li>}
                {showResendInvitation && <li onClick={this.props.onResendInvitationClick}>{strings.resendInvitation}</li>}
                {showResetBoardingExperience && <li onClick={this.props.onResetBoardingExperienceClick}>{strings.resetOnboardingExperience}</li>}
              </ul>
            </DropMenu>
          </div>}
        </header>

        <div className={styles.contentWrap}>
          <div className={styles.fieldWrapper}>
            <h4>{strings.email}</h4>
            <span title={email}>{email}</span>
          </div>

          <div className={styles.fieldWrapper}>
            <h4>{strings.role}</h4>
            <span>{role}</span>
          </div>

          <div className={styles.fieldWrapper}>
            <h4>{strings.groups}</h4>
            <List
              list={this.state.groups}
              itemProps={{
                thumbSize: 'small',
                showFollow: false,
                showThumb: true,
                noLink: true,
                childCount: -1,
                //className: styles.itemList,
              }}
              onItemClick={() => {}}
              className={styles.List}
              emptyHeading={strings.noGroupsFound}
              emptyMessage=""
              icon="group"
            />
            {this.props.groups.length > this.state.groups.length && <span
              className={styles.showMore}
              onClick={this.handleShowMoreGroups}
            >
              <FormattedMessage
                id="n-more"
                defaultMessage="{itemCount, plural, one {# more} other {# more}}"
                values={{ itemCount: 5 }}
              />
            </span>}
          </div>

          <div className={styles.fieldWrapper}>
            <h4>{strings.status}</h4>
            <span>{status}</span>
          </div>

          <div className={styles.fieldWrapper}>
            <h4>{strings.configurationBundle}</h4>
            <span>{configurationBundle && configurationBundle.name}</span>
          </div>

          <div className={styles.fieldWrapper}>
            <h4>{strings.timeZone}</h4>
            <span>{timezone}</span>
          </div>

          {metadata && metadata.length > 0 && <div>
            <h4>{strings.metadata}</h4>
            <div className={styles.metadataList}>
              {metadata.map((item, i) => (
                <div key={i + item.attributeValue}>
                  <div className={styles.metadataAttributes}>
                    {item.attribute && item.attribute.name && <span className={styles.category}>{item.attribute.name}: </span>}
                    <span className={styles.attribute}>{item.attributeValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>}
        </div>
      </aside>
    );
  }
}
