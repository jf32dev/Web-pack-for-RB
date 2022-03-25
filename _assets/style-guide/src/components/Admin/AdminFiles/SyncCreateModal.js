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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Stepper from './Utils/Stepper';
import Card from './Utils/Card';
import FolderConnection from './Utils/FolderConnection';
import UserGroup from './Utils/UserGroup';
import Loader from 'components/Loader/Loader';

/**
 * Modal for creating sync service
 */
export default class SyncCreateModal extends PureComponent {
  static propTypes = {

    /** shows modal */
    isVisible: PropTypes.bool,

    /** service is admin or not */
    isAdmin: PropTypes.bool,

    /** all the cloud services */
    cloudServices: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    scope: PropTypes.string,

    loading: PropTypes.bool,

    userGroups: PropTypes.array,

    //for folder selector
    paths: PropTypes.array,

    contents: PropTypes.array,

    selectedUser: PropTypes.object,

    repoDescription: PropTypes.string,

    adminAccountsWithoutUserImpersonation: PropTypes.array,

    onChange: PropTypes.func,

    onClose: PropTypes.func,

    onUserGroupScroll: PropTypes.func,

    loadingMore: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    isVisible: false,
    loading: false,
    accountSuffix: '',
    baseDn: '',
    domainController: '',
    usernamePrefix: '',
    index: 1,
    strings: {
      accountSuffix: 'Account Suffix',
      baseDn: 'Base DN',
      domainController: 'Domain controller',
      usernamePrefix: 'User prefix',
      cancel: 'Cancel',
      save: 'Save',
      addDomainController: 'Add Domain Controller',
      connectCloudServiceFolder: 'Connect cloud service folder',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      checkbox: '',
      isForward: true,
      isSelectOpen: false,
    };
    this.textFields = ['accountSuffix', 'baseDn', 'domainController', 'usernamePrefix'];
    this.node = null;
    this.modal = null;
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.node) {
      if (this.props.repositoryLoading && nextProps.repositoryLoaded) {
        this.node.scrollTop = 0;
        this.node.parentElement.scrollTop = 0;
      }

      if (this.props.index !== nextProps.index) {
        this.node.scrollTop = 0;
        this.node.parentElement.scrollTop = 0;
      }
    }

    if (!this.props.isVisible && nextProps.isVisible) {
      this.setState({
        isForward: true,
        checkbox: ''
      });
    }
  }

  handleChange() {
    if (this.props.index >= 2) {
      this.updateValues({
        action: 'updateIndex',
        index: this.props.index + 1
      });
    }
  }

  handleCardCheck(type, checked) {
    this.setState({
      checkbox: checked ? type : ''
    });
  }

  handleCardClick(type) {
    this.updateValues({
      action: 'authenticate',
      isAdmin: type === this.state.checkbox,
      scope: type,
    });
  }

  handleUserSelect(user) {
    this.updateValues({
      action: 'userSelected',
      user,
    });
  }

  handleClose(e) {
    const { onClose } = this.props;

    if (this.props.index === 3) {
      this.updateValues({
        action: 'updateIndex',
        index: this.props.index - 1
      });
    } else if (onClose && typeof onClose === 'function') {
      onClose(e);
    }
  }

  handleForwardTrue() {
    if (!this.state.isForward) {
      this.setState({
        isForward: true
      });
    }
  }

  handleForwardFalse() {
    if (this.state.isForward) {
      this.setState({
        isForward: false
      });
    }
  }

  updateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  handleToggleSelectMenu() {
    this.setState({
      isSelectOpen: !this.state.isSelectOpen
    });
  }

  render() {
    const {
      onClose,
      strings,
      isVisible,
      cloudServices,
      allGroupList,
      loading,
      repositoryLoading,
      index,
      scope,
      users,
      paths,
      contents,
      selectedUser,
      onUserGroupScroll,
      loadingMore,
      repoDescription,
      syncRootPath,
      folderId,
      onChange,
      isAdmin,
      onHandleListScroll,
      nextPage,
      adminAccountsWithoutUserImpersonation
    } = this.props;
    const { checkbox, isForward, isSelectOpen } = this.state;
    const styles = require('./SyncCreateModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SyncCreateModal: true,
      isAdmin: isAdmin && isSelectOpen,
    }, this.props.className);

    const currentService = cloudServices.find(item => item.nickname === scope) || {};

    let fullCloudServices = cloudServices;

    if (cloudServices.length % 4 !== 0) {
      const num = cloudServices.length % 4;
      for (let i = 0; i < (4 - num); i += 1) {
        fullCloudServices = fullCloudServices.concat({
          isEmpty: true
        });
      }
    }

    let Comp;
    switch (index) {
      case 1:
        Comp = (
          <TransitionGroup>
            <CSSTransition
              key={loading ? 0 : 1}
              classNames="fade"
              timeout={250}
              appear
            >
              <div className={styles[loading ? 'loading' : 'cardList']}>
                {loading && <Loader type="content" />}
                {!loading && fullCloudServices.map((item, i) => (
                  <Card
                    type={item.nickname}
                    key={item.nickname + i}
                    label={item.name}
                    showCheckbox={item.team === 1}
                    onCheckboxChange={this.handleCardCheck}
                    onItemClick={this.handleCardClick}
                    isEmpty={item.isEmpty}
                    checked={checkbox === item.nickname}
                  />
                ))}
              </div>
            </CSSTransition>
          </TransitionGroup>);
        break;
      case 2:
        Comp = (<FolderConnection
          name={_get(currentService, 'name', '')}
          {...{ scope }}
          nickname={_get(currentService, 'nickname', '')}
          isAdmin={isAdmin}
          users={users}
          onUserSelect={this.handleUserSelect}
          onChange={onChange}
          selectedUser={selectedUser}
          strings={strings}
          paths={paths}
          folderId={folderId}
          onSelectClose={this.handleToggleSelectMenu}
          onSelectOpen={this.handleToggleSelectMenu}
          contents={contents}
          loading={repositoryLoading}
          syncRootPath={syncRootPath}
          repoDescription={repoDescription}
          handleListScroll={onHandleListScroll}
          nextPage={nextPage}
          {...{ adminAccountsWithoutUserImpersonation }}
        />);
        break;
      case 3:
        Comp = (<UserGroup
          {...this.props}
          nickname={_get(currentService, 'nickname', '')}
          name={_get(currentService, 'name', '')}
          allGroupList={allGroupList}
          onScroll={onUserGroupScroll}
          loadingMore={loadingMore}
          onChange={onChange}
        />);
        break;
      case 4:
        Comp = (<div>
          <svg className={styles.checkmark} viewBox="0 0 52 52">
            <circle
              className={styles.checkmark__circle} cx="26" cy="26"
              r="25" fill="none"
            />
            <path className={styles.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <h3>{strings.syncEngineCreatedSuccessfully}</h3>
        </div>);
        break;
      default:
        return false;
    }

    const header = (<div className={styles.header}>
      <div className={styles.title}>{strings.connectCloudServiceFolder}</div>
      <Stepper activeStep={index} />
    </div>);

    let index2Disabled = false;

    if (index === 2) {
      index2Disabled = true;
      if (!isAdmin) {
        if (repoDescription && folderId) {
          index2Disabled = false;
        }
      } else if (isAdmin) {
        if (repoDescription && folderId && (selectedUser || adminAccountsWithoutUserImpersonation.includes(scope))) {
          index2Disabled = false;
        }
      }
    }

    const footer = (index !== 1 && index !== 4) ? (<div className={styles.footer}>
      <Btn
        alt
        large
        onClick={this.handleClose}
        style={{ marginRight: '0.5rem' }}
        onMouseOver={this.handleForwardFalse}
      >
        {index === 3 ? strings.back : strings.cancel}
      </Btn>
      <Btn
        inverted
        large
        disabled={index2Disabled}
        onClick={this.handleChange}
        style={{ marginLeft: '0.5rem' }}
        onMouseOver={this.handleForwardTrue}
      >
        {strings.confirm}
      </Btn>
    </div>) : (<div />);

    return (
      <Modal
        isVisible={isVisible}
        backdropClosesModal
        escClosesModal
        headerChildren={header}
        footerChildren={footer}
        onClose={onClose}
        ref={c => { this.modal = c; }}
        className={index === 4 ? styles.modalTransition : ''}
        bodyClassName={index === 4 ? styles.confirmationBodyModal : styles.minBodyHeight}
        headerClassName={index === 4 ? styles.hideHeader : ''}
        footerClassName={index !== 4 && index !== 1 ? styles.borderFooter : ''}
        onScroll={onHandleListScroll}
      >
        <div
          ref={node => { this.node = node; }}
          style={{ padding: '1rem 1.5rem', height: index !== 3 ? 'auto' : `calc(${_get(this.modal, 'state.maxBodyHeight', '') + 'px'} - 2.188rem)` }}
          className={classes}
        >
          <TransitionGroup>
            <CSSTransition
              key={index === 4 ? 3 : index}
              classNames={{
                enter: isForward ? styles['slide-enter'] : styles['slide-exit'],
                enterActive: isForward ? styles['slide-enter-active'] : styles['slide-exit-active'],
                exit: isForward ? styles['slide-exit'] : styles['slide-enter-leave'],
                exitActive: isForward ? styles['slide-exit-active'] : styles['slide-enter-leave-active']
              }}
              timeout={{
                enter: 500,
                exit: 500
              }}
              appear
            >
              {Comp}
            </CSSTransition>
          </TransitionGroup>
        </div>
      </Modal>
    );
  }
}
