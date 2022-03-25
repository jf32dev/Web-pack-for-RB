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
import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import TriggerList from 'components/TriggerList/TriggerList';
import UserItem from 'components/UserItem/UserItem';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import Loader from 'components/Loader/Loader';

/**
 * choose users modal
 */
export default class UsersModal extends PureComponent {
  static propTypes = {
    /** list data of the devices */
    list: PropTypes.array,

    /** the same as TriggerList*/
    isLoaded: PropTypes.bool,
    /** the same as TriggerList*/
    isLoading: PropTypes.bool,
    /** the same as TriggerList*/
    isLoadingMore: PropTypes.bool,
    /** the same as TriggerList*/
    isComplete: PropTypes.bool,

    onClose: PropTypes.func,

    /** call back method to return the updated list */
    onConfirm: PropTypes.func,

    isVisible: PropTypes.bool,

    onClick: PropTypes.func,

    onInputChange: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      users: 'Users',
      search: 'Search',
      select: 'Select',
      cancel: 'Cancel',
      emptyHeading: 'No results found',
      emptyMessage: 'Your search criteria returned no matched results. Please try again.'
    }
  };

  constructor(props) {
    super(props);

    this.handleChangeDebounce = _compose(
      _debounce(this.handleChange.bind(this), 300),
      _clone
    );

    autobind(this);
  }

  handleChange(e) {
    const { value } = e.currentTarget;

    const { onInputChange } = this.props;
    if (onInputChange && typeof onInputChange === 'function') {
      onInputChange(value);
    }
  }

  render() {
    const styles = require('./UsersModal.less');
    const {
      isVisible,
      onClose,
      strings,
      onClick,
      isLoaded,
      isLoading,
      isLoadingMore,
      isComplete,
      list,
      error,
      onGetList
    } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      UsersModal: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        onClose={onClose}
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.users}</p>}
        footerChildren={(<div>
          <Btn alt large onClick={onClose}>{strings.cancel}</Btn>
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          <Text
            id="search"
            name="search"
            className={styles.linkInput}
            type="text"
            placeholder={strings.search}
            onChange={this.handleChangeDebounce}
          />
          {!isLoaded && list.length === 0 && <Loader type="content" className={styles.loading} />}
          {(isLoaded || list.length !== 0) && <div className={styles.userList}>
            <TriggerList
              list={list}
              isLoaded={isLoaded}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              isComplete={isComplete}
              error={error}
              onGetList={onGetList}
              listProps={{
                itemComponent: UserItem,
                onItemClick: () => {},
                thumbSize: 'small',
                itemProps: {
                  onSelectClick: onClick,
                  showSelect: true,
                  showFollow: false,
                },
              }}
              emptyHeading={strings.emptyHeading}
              emptyMessage={strings.emptyMessage}
            />
          </div>}
        </div>
      </Modal>
    );
  }
}
