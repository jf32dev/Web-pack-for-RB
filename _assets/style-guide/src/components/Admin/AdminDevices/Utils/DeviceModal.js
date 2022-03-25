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

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';

/**
 * Detail devices modal
 */
export default class DeviceModal extends PureComponent {
  static propTypes = {
    /** title of the component */
    title: PropTypes.string,

    /** list data of the devices */
    list: PropTypes.array,

    onClose: PropTypes.func,

    /** call back method to return the updated list */
    onConfirm: PropTypes.func,

    isVisible: PropTypes.bool,

    onClick: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      userAgent: 'User agent',
      added: 'Added',
      cancel: 'Cancel',
      done: 'Done'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      updateList: {}
    };

    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      this.setState({
        updateList: {},
      });
    }
  }

  handleClick(e) {
    const { dataset } = e.currentTarget;
    const { onConfirm, list } = this.props;
    const { updateList } = this.state;
    // const dataSetName = _get(dataset, 'name', false);
    // const dataSetUser = _get(dataset, 'user', false);
    const dataSetId = _get(dataset, 'id', false);
    const dataSetAction = _get(dataset, 'action', false);
    const dataSetDeleted = _get(dataset, 'deleted', false);

    if (dataSetId && dataSetAction && dataSetAction === 'deleted') {
      if (Object.prototype.hasOwnProperty.call(updateList, dataSetId)) {
        this.setState({
          updateList: {
            ...updateList,
            [dataSetId]: 1 - updateList[dataSetId],
          }
        });
      } else {
        this.setState({
          updateList: {
            ...updateList,
            [dataSetId]: 1 - dataSetDeleted,
          }
        });
      }
    } else if (dataSetAction && dataSetAction === 'confirm') {
      if (onConfirm && typeof onConfirm === 'function') {
        onConfirm('devices', list.map(this.updateItem));
      }
    }
  }

  updateItem(item) {
    const { updateList } = this.state;
    return {
      ...item,
      deleted: Object.prototype.hasOwnProperty.call(updateList, item.id) ? updateList[item.id] : item.deleted
    };
  }

  render() {
    const styles = require('./DeviceModal.less');
    const { isVisible, onClose, list, strings, title } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      DeviceModal: true
    }, this.props.className);
    const newList = list.map(this.updateItem);

    return (
      <Modal
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        onClose={onClose}
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{title}</p>}
        footerChildren={(<div>
          <Btn
            alt large onClick={onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={this.handleClick}
            data-action="confirm" data-name="device" style={{ marginLeft: '0.5rem' }}
          >
            {strings.done}
          </Btn>
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          {newList.map(item => (
            <div className={styles.listItem} key={item.id}>
              <div>
                <div className={styles.deviceId}>{item.deviceId}</div>
                <div className={styles.itemDetail}><div>{strings.userAgent}</div><div>{': ' + item.userAgent}</div></div>
                <div className={styles.itemDetail}><div>{strings.added}</div><div>{': ' + item.dateAdded}</div></div>
              </div>
              <div
                onClick={this.handleClick}
                data-id={item.id}
                data-action="deleted"
                data-deleted={item.deleted}
                className={`${item.deleted.toString() === '0' ? styles.active : styles.deleted}`}
              />
            </div>
          ))}
        </div>
      </Modal>
    );
  }
}
