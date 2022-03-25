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
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import SVGIcon from './Utils/SVGIcon';
import Loader from 'components/Loader/Loader';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Text from 'components/Text/Text';
import UserGroup from './Utils/UserGroup';
/**
 * Modal for editing sync service
 */
export default class SyncEditModal extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func,

    strings: PropTypes.object,

    isVisible: PropTypes.bool,

    loading: PropTypes.bool,

    allGroupList: PropTypes.array,

    onUserGroupScroll: PropTypes.func,

    loadingMore: PropTypes.bool,

    onChange: PropTypes.func,

    name: PropTypes.string,

    nickname: PropTypes.string,

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
      editCloudServiceSync: 'Edit cloud service sync',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      localDescription: ''
    };

    this.modal = null;
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      this.setState({
        localDescription: nextProps.description
      });
    }
  }

  handleInputChange(e) {
    this.setState({
      localDescription: e.currentTarget.value
    });
  }

  handleChange() {
    this.updateValues({
      action: 'editSave',
      description: this.state.localDescription,
    });
  }

  updateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  render() {
    const {
      onClose,
      strings,
      isVisible,
      loading,
      allGroupList,
      onUserGroupScroll,
      loadingMore,
      onChange,
      name,
      nickname
    } = this.props;

    const {
      localDescription
    } = this.state;
    const styles = require('./SyncEditModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SyncEditModal: true,
    }, this.props.className);

    const bodyClasses = cx({
      minBodyHeight: true,
      loading,
    });

    const footer = (<div className={styles.footer}>
      <Btn
        alt
        large
        onClick={onClose}
        style={{ marginRight: '0.5rem' }}
      >
        {strings.cancel}
      </Btn>
      <Btn
        inverted
        large
        disabled={_isEmpty(localDescription)}
        onClick={this.handleChange}
        style={{ marginLeft: '0.5rem' }}
      >
        {strings.confirm}
      </Btn>
    </div>);

    return (
      <Modal
        isVisible={isVisible}
        backdropClosesModal
        escClosesModal
        headerChildren={strings.editCloudServiceSync}
        footerChildren={footer}
        onClose={onClose}
        className={classes}
        bodyClassName={bodyClasses}
        headerClassName={styles.header}
        footerClassName={styles.borderFooter}
        ref={c => { this.modal = c; }}
      >
        {loading && <Loader type="content" />}
        <TransitionGroup>
          {!loading && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={styles.body} style={{ height: _get(this.modal, 'state.maxBodyHeight', null) }}>
              <div className={styles.section1}>
                <div className={styles.folderConnectionTitle}>
                  <div className={styles.label}>{strings.folderConnection}</div>
                  <div>
                    {nickname !== undefined && <SVGIcon type={nickname} className={styles.svgIcon} />}
                    <span className={styles.name}>{name}</span>
                  </div>
                </div>
                <Text
                  type="text"
                  id="serviceName"
                  label={strings.serviceName}
                  value={localDescription}
                  placeholder={strings.name}
                  className={styles.nameInput}
                  onChange={this.handleInputChange}
                />
              </div>
              <UserGroup
                strings={strings}
                className={styles.userGroups}
                allGroupList={allGroupList}
                onScroll={onUserGroupScroll}
                loadingMore={loadingMore}
                onChange={onChange}
                isEdit
              />
            </div>
          </CSSTransition>}
        </TransitionGroup>
      </Modal>
    );
  }
}
