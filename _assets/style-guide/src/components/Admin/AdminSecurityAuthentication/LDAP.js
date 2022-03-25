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

import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';
import _debounce from 'lodash/debounce';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Select from 'react-select';

import ActiveDirectory from './Utils/ActiveDirectory';
import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';

import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import EDirectory from './Utils/EDirectory';

import List from 'components/List/List';

/**
 * LDAP description
 */
export default class LDAP extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    ldapType: PropTypes.string,

    /** Description of customProp2 */
    activeForest: PropTypes.array,

    testCredentialsResult: PropTypes.object,

    bridgeAddress: PropTypes.string,

    bridgeToken: PropTypes.string,

    credentialUsername: PropTypes.string,

    credentialPassword: PropTypes.string,

    onServerSelect: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    ldapType: 'ad',
    testCredentialsResult: {
      isError: true,
      message: 'User Authentication Failed ("{status:failed,user:false,messages:[Looking into forest[LDAP ],Authenticate service account[service.account] in forest key[LDAP ] successful,User[simon@bigtincan.com] does not exist,No user found]}")'
    }
  };

  static contextTypes = {
    settings: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      isDetailsDisplay: false
    };

    this.handleChangeDebounce = _compose(
      _debounce(props.onChange.bind(this), 300),
      _clone
    );

    autobind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.moreDetailEl && prevProps.testCredentialsResult !== this.props.testCredentialsResult) {
      this.moreDetailEl.scrollIntoView();
    }
  }

  handleClick(e) {
    const action = _get(e, 'currentTarget.dataset.action', false);
    if (action && action === 'testCredentials') {
      this.setState({
        isDetailsDisplay: false
      });
      this.props.onChange(e);
    } else {
      this.setState({
        isDetailsDisplay: !this.state.isDetailsDisplay
      }, () => {
        this.testDetailMessage.scrollIntoView();
      });
    }
  }

  handleGroupItemClick(e) {
    e.preventDefault();
  }

  render() {
    const {
      strings,
      ldapType,
      bridgeAddress,
      bridgeToken,
      credentialUsername,
      credentialPassword,
      testCredentialsResult,
      activeForest,
      onChange,
      onServerSelect,
    } = this.props;

    const { isDetailsDisplay } = this.state;
    const { theme } = this.context.settings;

    const styles = require('./LDAP.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      LDAP: true
    }, this.props.className);

    const moreDetailClasses = cx({
      moreDetails: true,
      isDetailsDisplay,
    });

    const statusClasses = cx({
      succeed: !testCredentialsResult.isError,
      failed: testCredentialsResult.isError,
    });

    const options = [
      { value: 'ad', label: strings.activeDirectory },
      { value: 'edir', label: strings.eDirectory },
    ];

    const bridgeCheckbox = {
      name: ldapType === 'ad' ? 'onPremiseAdBridge' : 'onPremiseLDAPBridge',
      label: ldapType === 'ad' ? strings.onPremiseAdBridge : strings.onPremiseLDAPBridge
    };

    let testResultMessage = null;

    if (testCredentialsResult && testCredentialsResult.message) {
      testResultMessage = JSON.parse(testCredentialsResult.message);
    }

    return (
      <div className={classes} style={this.props.style}>
        <section className={styles.directoryServer}>
          <label>{strings.directoryServer}</label>
          <Select
            className={styles.directoryServerSelect}
            name="fixed"
            value={ldapType || 'ad'}
            options={options}
            searchable={false}
            clearable={false}
            placeholder="Choose one value!"
            onChange={onServerSelect}
          />
        </section>
        <section className={styles.bridge}>
          <Checkbox
            label={bridgeCheckbox.label}
            className={styles.otherSettings}
            data-name={bridgeCheckbox.name}
            name={bridgeCheckbox.name}
            value={bridgeCheckbox.name}
            checked={this.props[bridgeCheckbox.name]}
            onChange={onChange}
          />
          {this.props[bridgeCheckbox.name] && <div className={styles.bridgeTextFields}>
            <Text
              id="bridgeToken1"
              name="bridgeToken"
              label={strings.bridgeToken}
              defaultValue={bridgeToken}
              type="password"
              className={styles.displayNone}
            />
            <Text
              id="bridgeAddress"
              name="bridgeAddress"
              label={strings.bridgeAddress}
              defaultValue={bridgeAddress}
              onChange={this.handleChangeDebounce}
            />
            <Text
              id="bridgeToken"
              name="bridgeToken"
              label={strings.bridgeToken}
              defaultValue={bridgeToken}
              onChange={this.handleChangeDebounce}
              type="password"
            />
          </div>}
        </section>
        <section>
          {ldapType === 'ad' && <ActiveDirectory
            strings={strings} onChange={onChange} list={activeForest}
            {...this.props}
          />}
          {ldapType === 'edir' && <EDirectory strings={strings} onChange={onChange} {...this.props} />}
        </section>
        <section className={styles.credentials}>
          <h3>{strings.credentials}</h3>
          <div className={styles.texts}>
            <Text
              id="credentialUsername"
              name="credentialUsername"
              label={strings.username}
              defaultValue={credentialUsername}
              onChange={onChange}
            />
            <Text
              id="credentialPassword"
              name="credentialPassword"
              label={strings.password}
              defaultValue={credentialPassword}
              onChange={onChange}
              type="password"
            />
          </div>
          <Btn onClick={this.handleClick} data-action="testCredentials" inverted>{strings.testCredentials}</Btn>
          {!_isEmpty(testCredentialsResult) &&
          <div className={styles.message}>
            <div className={statusClasses}>
              {testCredentialsResult.isError ? strings.userAuthenticationFailed : strings.userAuthenticationSucceed}
            </div>
          </div>
          }
          {!_isEmpty(testCredentialsResult) &&
          <div className={styles.messageDetails}>
            {!testCredentialsResult.isError &&
              <div className={styles.successMessage}>
                <div className={styles.messageLabel}>{strings.email}</div>
                <div className={styles.messageEmail}>{testResultMessage.email}</div>
                <div className={styles.messageLabel}>{strings.groups}</div>
                <List
                  list={testResultMessage.groups.map((g, idx) => ({
                    type: 'group',
                    isActive: false,
                    id: idx,
                    name: g,
                    thumbnail: '',
                    colour: theme.baseColor
                  }))}
                  thumbSize="small"
                  showThumb
                  className={styles.groupList}
                  onItemClick={this.handleGroupItemClick}
                />
              </div>
            }
            <div ref={el => { this.moreDetailEl = el; }} onClick={this.handleClick} className={moreDetailClasses}>{strings.moreDetails}</div>
          </div>
          }
          <TransitionGroup>
            {isDetailsDisplay && <CSSTransition
              classNames="fade"
              timeout={250}
              appear
            >
              <div
                ref={el => { this.testDetailMessage = el; }}
                className={styles.testCredentialsResultMessage}
              >
                {testResultMessage.info}
              </div>
            </CSSTransition>}
          </TransitionGroup>
        </section>
      </div>
    );
  }
}
