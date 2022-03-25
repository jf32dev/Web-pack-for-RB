import PropTypes from 'prop-types';
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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import React, { PureComponent, Fragment } from 'react';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';
import Btn from 'components/Btn/Btn';
import UserItem from 'components/UserItem/UserItem';

export const EDIT = 'edit';
export const KEY = 'key';

export const checkIsSaveDisable = (update, client, user) => {
  //const { client, user } = this.props;
  // let isSaveDisable = true;
  if (_isEmpty(update.name)) {
    return true;
  }
  if (_isEmpty(update.scopes)) {
    return true;
  }
  if (client && Object.prototype.hasOwnProperty.call(client, 'id')) {
    if (update.name !== client.name) {
      return false;
    }
    if (JSON.stringify(_get(client, 'scopes', []).slice().sort()) !== JSON.stringify(_get(update, 'scopes', []).slice().sort())) {
      return false;
    }

    if (_isEmpty(user)) {
      if (update.redirectUri !== client.redirectUri) {
        return false;
      }

      if (!(_get(update, 'redirectUri', '').indexOf('://') > 0)) {
        return true;
      }
    } else if (update.user.id !== user.id) {
      return false;
    }

    return true;
  } else if (_isEmpty(user) && !(_get(update, 'redirectUri', '').indexOf('://') > 0)) {
    return true;
  }

  return false;
};
/**
 * Admin Custom Apps
 */
export default class CustomAppsEdit extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    onCancel: PropTypes.func,

    onSave: PropTypes.func,

    scopes: PropTypes.object,

    client: PropTypes.object,

    user: PropTypes.object,

    error: PropTypes.object,

    onSaveDisableUpdate: PropTypes.func,

    onCopyError: PropTypes.func,

    onCopySuccess: PropTypes.func,

    views: PropTypes.array,

    /** Custom SMTP Server true or false */

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      cancel: 'Cancel',
      save: 'Save',
      applicationName: 'Application Name',
      OAuth2Credentials: 'OAuth 2.0 credentials',
      clientID: 'Client ID',
      clientSecret: 'Client Secret',
      OAuth2RedirectURI: 'OAuth 2.0 redirect URI',
      OAuth2RedirectURIDesc: 'The redirect URI is the URL in your application that will receive OAuth 2.0 callbacks.',
      applicationScopes: 'Application Scopes',
      applicationScopesDesc: 'Select the scopes shown on the OAuth consent screen when users authorize your app.',
      connectAs: 'Connect As',
      connectAsDesc: 'OAuth 2.0 with API key authentication restricts access to groups and content based on the selected user.',
      changeUser: 'Change User',
      performActionsDesc: 'Selecting this option will allow the Application to perform actions as any user, including Administrators.',
      scopesErrorMsg: 'scopes cannot be empty',
      performActionsOnUsers: 'Perform actions on behalf of users.',
      'admin_group_r': 'Read user group data',
      'admin_group_w': 'Create/edit user groups',
      'admin_user_r': 'Read user data',
      'admin_user_w': 'Create/edit users',
      'channel_r': 'Read channel data',
      'channel_w': 'Modify channels',
      'form_r': 'Read form data',
      'history_w': 'Track story and file interactions',
      'story_r': 'Read story data',
      'story_w': 'Modify stories',
      'settings_r': 'Read user settings',
      'structure_w': 'Modify content structure',
      'as_user': 'Perform actions on behalf of other users'
    },
    user: {},
    views: [],
    scopes: {
      'admin_group_r': 'Read user group data',
      'admin_group_w': 'Create/edit user groups',
      'admin_user_r': 'Read user data',
      'admin_user_w': 'Create/edit users',
      'channel_r': 'Read channel data',
      'channel_w': 'Modify channels',
      'form_r': 'Read form data',
      'history_w': 'Track story and file interactions',
      'story_r': 'Read story data',
      'story_w': 'Modify stories',
      'settings_r': 'Read user settings',
      'structure_w': 'Modify content structure',
      'as_user': 'Perform actions on behalf of other users'
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_isEmpty(nextProps.client) && _isEmpty(prevState.update)) {
      return {
        update: nextProps.client,
      };
    }
    if (nextProps.user && prevState.update.user && nextProps.user.id !== prevState.update.user.id) {
      return {
        update: {
          ...prevState.update,
          user: nextProps.user,
        },
        isSaveDisable: checkIsSaveDisable(prevState.update, nextProps.client, nextProps.user)
      };
    }

    if (_get(nextProps, 'error', false) && prevState.isSaveDisable) {
      return {
        isSaveDisable: checkIsSaveDisable(prevState.update, nextProps.client, nextProps.user)
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      update: {},
      isSaveDisable: true,
    };
    this.myClientIdRef = React.createRef();
    this.mySecretRef = React.createRef();
    this.myApiKeyRef = React.createRef();
    autobind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isSaveDisable !== prevState.isSaveDisable && this.props.onSaveDisableUpdate) {
      this.props.onSaveDisableUpdate(this.state.isSaveDisable);
    }
  }

  handleClick() {
    if (this.props.onSave) {
      this.props.onSave(this.state.update);
      this.setState({
        isSaveDisable: true
      });
    }
  }

  handleInputChange(e) {
    const { value, type, id } = e.currentTarget;
    if (type === 'text') {
      const update = {
        ...this.state.update,
        [id]: value
      };

      this.setState({
        update,
        isSaveDisable: checkIsSaveDisable(update, this.props.client, this.props.user)
      });
    }
  }

  handleCheckboxChange(e) {
    const { value } = e.currentTarget;
    let scopes = this.state.update.scopes || [];
    if (scopes.indexOf(value) > -1) {
      scopes = scopes.filter(item => item !== value);
    } else {
      scopes = scopes.concat(value);
    }
    const update = {
      ...this.state.update,
      scopes,
    };
    this.setState({
      update,
      isSaveDisable: checkIsSaveDisable(update, this.props.client, this.props.user)
    });
  }

  //Copy to clipboard
  handleClientIdCopy() {
    this.handleCopy(this.myClientIdRef);
  }

  handleSecretCopy() {
    this.handleCopy(this.mySecretRef);
  }

  handleApiKeyIdCopy() {
    this.handleCopy(this.myApiKeyRef);
  }

  handleCopy(myRef) {
    const input = document.createElement('input');
    try {
      document.body.appendChild(input);
      input.value = myRef.current.props.value;
      input.focus();
      input.select();
      document.execCommand('copy');
      if (document.execCommand('copy', false, null)) {
        if (this.props.onCopySuccess) {
          this.props.onCopySuccess(this.props.strings[myRef.current.props.name]);
        }
      } else if (this.props.onCopyError) {
        this.props.onCopyError();
      }
    } catch (e) {
      if (this.props.onCopyError) {
        this.props.onCopyError();
      }
    }
    document.body.removeChild(input);
  }

  render() {
    const { strings, onCancel, user, onChangeUser, scopes, client, views } = this.props;
    const { update, isSaveDisable } = this.state;
    const styles = require('./CustomAppsEdit.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      CustomAppsEdit: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        {views.includes(EDIT) && views.includes(KEY) && <header>
          <Btn
            alt large onClick={onCancel}
            style={{ marginRight: '0.5rem' }}
          >
            {client ? strings.close : strings.cancel}
          </Btn>
          <Btn
            inverted
            large
            onClick={this.handleClick}
            data-action="confirm"
            style={{ marginLeft: '0.5rem' }}
            disabled={isSaveDisable}
          >
            {strings.save}
          </Btn>
        </header>}
        <div className={views.includes(EDIT) && views.includes(KEY) ? styles.editContent : ''}>
          {views.includes(EDIT) && <Fragment>
            <h3>{strings.applicationName}</h3>
            <Text
              id="name"
              className={styles.text}
              value={_get(update, 'name', '')}
              onChange={this.handleInputChange}
            />
            <label className={!_isEmpty(update.name) ? '' : styles.error}>{`(${strings.nameErrorMsg})`}</label>
            {_isEmpty(user) && views.includes(EDIT) && <Fragment>
              <h3>{strings.OAuth2RedirectURI}</h3>
              <Text
                id="redirectUri"
                label={strings.OAuth2RedirectURIDesc}
                className={styles.text}
                value={update.redirectUri || ''}
                onChange={this.handleInputChange}
              />
              <label className={_get(update, 'redirectUri', '').indexOf('://') > 0 ? '' : styles.error}>(https://www.sample.com)</label>
            </Fragment>}
            <h3>{strings.applicationScopes}</h3>
            <label>{strings.applicationScopesDesc}</label>
            <br />
            <label className={!_isEmpty(update.scopes) ? '' : styles.error}>{`(${strings.scopesErrorMsg})`}</label>
            <div className={styles.displayFlex}>
              <div>
                {Object.keys(scopes).filter((key, i) => key !== 'as_user' && i < Object.keys(scopes).length / 2).map((key) => (<Checkbox
                  label={strings[key] || scopes[key]}
                  name={key}
                  key={key}
                  className={styles.checkbox}
                  value={key}
                  checked={!_isEmpty(update.scopes) && update.scopes.indexOf(key) > -1}
                  onChange={this.handleCheckboxChange}
                />))}
              </div>
              <div>
                {Object.keys(scopes).filter((key, i) => key !== 'as_user' && i >= Object.keys(scopes).length / 2).map((key) => (<Checkbox
                  label={strings[key] || scopes[key]}
                  name={key}
                  key={key}
                  className={styles.checkbox}
                  value={key}
                  checked={!_isEmpty(update.scopes) && update.scopes.indexOf(key) > -1}
                  onChange={this.handleCheckboxChange}
                />))}
              </div>
            </div>
          </Fragment>}
          {!_isEmpty(user) && views.includes(EDIT) && <Fragment>
            <h3>{strings.connectAs}</h3>
            <label>{strings.connectAsDesc}</label>
            <div className={styles.user}>
              <UserItem
                className={styles.userItem}
                thumbSize="tiny"
                inList
                name={user.firstName + ' ' + user.lastName}
                {...user}
              />
              <Btn onClick={onChangeUser} data-id="user">{strings.changeUser}</Btn>
            </div>
            <label>{strings.performActionsDesc}</label>
            <Checkbox
              label={strings.performActionsOnUsers}
              name="as_user"
              key="as_user"
              value="as_user"
              checked={!_isEmpty(update.scopes) && update.scopes.indexOf('as_user') > -1}
              onChange={this.handleCheckboxChange}
            />
          </Fragment>}
          <div className={views.includes(EDIT) ? styles.authEdit : ''}>
            {views.includes(KEY) && <Fragment>
              <h3>{strings.OAuth2Credentials}</h3>
              <Text
                id="oauthClientId"
                name="clientID"
                label={strings.clientID}
                className={styles.text}
                value={_get(client, 'clientId', '')}
                showCopy
                disabled
                ref={this.myClientIdRef}
                onCopyClick={this.handleClientIdCopy}
                placeholder={strings.generateClientId}
                onChange={() => {}}
              />
              <Text
                id="oauthSecret"
                name="clientSecret"
                label={strings.clientSecret}
                className={styles.text}
                placeholder={strings.generateClientSecret}
                value={_get(client, 'clientSecret', '')}
                showCopy
                disabled
                ref={this.mySecretRef}
                onCopyClick={this.handleSecretCopy}
                type="password"
                onChange={() => {}}
              />
            </Fragment>}
            {!_isEmpty(user) && views.includes(KEY) && <Fragment>
              <h3>{strings.apiKey}</h3>
              <Text
                id="apiKey"
                name="apiKey"
                label={strings.apiKeyDesc}
                className={styles.text}
                placeholder={strings.generateAPIkey}
                value={_get(client, 'apiKey', '')}
                showCopy
                disabled
                ref={this.myApiKeyRef}
                onCopyClick={this.handleApiKeyIdCopy}
                type="password"
                onChange={() => {}}
              />
            </Fragment>}
          </div>
        </div>
      </div>
    );
  }
}
