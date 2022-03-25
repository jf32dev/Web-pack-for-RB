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
import _isEmpty from 'lodash/isEmpty';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import SVGIcon from './SVGIcon';
import Text from 'components/Text/Text';
import FolderSelector from './FolderSelector';
import Select from 'react-select';
import UserItem from 'components/UserItem/UserItem';
import Checkbox from 'components/Checkbox/Checkbox';

/**
 * Folder Connection
 */
export default class FolderConnection extends PureComponent {
  static propTypes = {
    // Service Name
    scope: PropTypes.string,

    labels: PropTypes.array,

    activeStep: PropTypes.number,

    users: PropTypes.array,

    selectedUser: PropTypes.object,

    repoDescription: PropTypes.string,

    //for folder selector
    paths: PropTypes.array,

    contents: PropTypes.array,

    onUserSelect: PropTypes.func,

    onSelectClose: PropTypes.func,

    onSelectOpen: PropTypes.func,

    loading: PropTypes.bool,

    syncRootPath: PropTypes.bool,

    isAdmin: PropTypes.bool,

    adminAccountsWithoutUserImpersonation: PropTypes.array,

    //for folder selector
    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      folderConnection: 'Folder Connection',
      folderConnectionDesc: 'Dropbox does not support file/folder syncing after the initial sync (download). Future changes in the repository will not be applied.',
      serviceName: 'Service name',
      name: 'Name',
      connection: 'Connection',
      connectEntireAccount: 'Connect the entire account',
      modified: 'Modified',
    },
    nickname: 'box',
    name: 'Box',
    repoDescription: '',
    users: [],
    selectedUser: null,
    syncRootPath: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      clearable: false
    };
    autobind(this);
  }

  handleInputChange (e) {
    this.updateValues({
      action: 'repoDescription',
      value: e.currentTarget.value
    });
  }

  handleCheckboxChange(e) {
    this.updateValues({
      action: 'syncRootPath',
      value: e.currentTarget.checked
    });
  }

  updateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  handleSelectInputChange(inputValue) {
    const { clearable } = this.state;
    if (inputValue !== '' && !clearable) {
      this.setState({
        clearable: true
      });
    } else if (inputValue === '' && clearable) {
      this.setState({
        clearable: false
      });
    }
  }

  render() {
    const styles = require('./FolderConnection.less');
    const { scope, nickname, name, strings, users, selectedUser,
      onUserSelect, repoDescription, syncRootPath, isAdmin, onSelectOpen, onSelectClose, adminAccountsWithoutUserImpersonation } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      FolderConnection: true
    }, this.props.className);

    return (
      <div className={classes}>
        <div className={styles.folderConnectionTitle}>
          <div className={styles.label}>{isAdmin ? strings.adminFolderConnection : strings.folderConnection}</div>
          <div>
            {nickname !== undefined && <SVGIcon type={nickname} className={styles.svgIcon} />}
            <span className={styles.name}>{name}</span>
          </div>
        </div>
        <div className={styles.desc}>{strings[`${nickname}Desc`]}</div>
        <Text
          type="text"
          id="serviceName"
          label={strings.serviceName}
          value={repoDescription}
          placeholder={strings.name}
          className={styles.nameInput}
          onChange={this.handleInputChange}
        />
        {isAdmin && !adminAccountsWithoutUserImpersonation.includes(scope) && <label htmlFor="optGroup">{strings.userImpersonation}</label>}
        {isAdmin && !adminAccountsWithoutUserImpersonation.includes(scope) && <Select
          value={selectedUser}
          options={users.map((user, index) => ({
            ...user,
            userId: user.id,
            id: index
          }))}
          name="optGroup"
          labelKey="name"
          valueKey="id"
          searchable
          onInputChange={this.handleSelectInputChange}
          clearable={this.state.clearable || !_isEmpty(selectedUser)}
          className={styles.selectedUser}
          placeholder={strings.userName}
          onOpen={onSelectOpen}
          onClose={onSelectClose}
          arrowRenderer={() => (<span className="icon-search" />)}
          optionRenderer={(props, index) => (<UserItem
            {...props}
            key={props.id}
            note={props.email}
            id={index}
            userId={props.id}
            thumbSize="tiny"
            className={styles.folderUserItem}
          />)}
          onChange={onUserSelect}
        />}
        <div className={`${styles.folderConnectionContent} ${(isAdmin && _isEmpty(selectedUser) && !adminAccountsWithoutUserImpersonation.includes(scope)) ? styles.folderConnectionEmpty : ''}`}>
          {(!isAdmin || (isAdmin && !_isEmpty(selectedUser)) || (isAdmin && adminAccountsWithoutUserImpersonation.includes(scope))) && <label>{strings.connection}</label>}
          {(!isAdmin || (isAdmin && !_isEmpty(selectedUser)) || (isAdmin && adminAccountsWithoutUserImpersonation.includes(scope))) && <Checkbox
            label={strings.connectEntireAccount}
            className={styles.syncEntireCloudAccount}
            name="syncRootPath"
            value="syncRootPath"
            checked={syncRootPath}
            onChange={this.handleCheckboxChange}
          />}
          <FolderSelector {...this.props} syncRootPath={!(!isAdmin || (isAdmin && !_isEmpty(selectedUser)) || (isAdmin && adminAccountsWithoutUserImpersonation.includes(scope))) || syncRootPath} />
        </div>
      </div>
    );
  }
}
