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
 * Header for FabricEditor including drawing and attach
 */
export default class NoteDeleteHeader extends PureComponent {
  static propTypes = {
    /**
     * callback when clicking the header menu item
     * each btn would have data-type to indicate what btn.
     */
    onClick: PropTypes.func,
    /*
     * disable the delete button
     *  */
    disableDeleteBtn: PropTypes.bool,

    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    strings: {
      cancel: 'Cancel',
      delete: 'Delete',
      deleteHeaderTitle: 'Delete Notes',
      deleteModalTitle: 'Delete Notes?',
      deleteModalContent: 'Are you sure you want to delete selected notes?',
    },
    disableDeleteBtn: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };

    autobind(this);
  }

  handleToggleModal(event) {
    this.setState({ modalVisible: !this.state.modalVisible });
    const type = _get(event, 'currentTarget.dataset.type', '');
    if (type === 'delete' && this.props.onClick && typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  }

  render() {
    const {
      className,
      style,
      strings,
      onClick,
      disableDeleteBtn
    } = this.props;
    const styles = require('./FabricHeader.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ViewerHeader: true,
    }, className);

    return (
      <header className={classes} style={style}>
        <div className={styles.leftDeleteTitle}>
          {strings.deleteHeaderTitle}
        </div>
        <div className={styles.right}>
          <Btn
            borderless alt large
            onClick={onClick} data-type="cancel"
          >{strings.cancel}</Btn>
          <Btn
            inverted
            large
            data-type="openDeleteModel"
            onClick={this.handleToggleModal}
            disabled={disableDeleteBtn}
          >{strings.delete}</Btn>
        </div>
        <Modal
          isVisible={this.state.modalVisible}
          width="medium"
          backdropClosesModal
          escClosesModal
          onClose={this.handleToggleModal}
          headerTitle={strings.deleteModalTitle}
          footerChildren={(<div>
            <Btn
              alt large onClick={this.handleToggleModal}
              style={{ marginRight: '0.5rem' }}
            >{strings.cancel}</Btn>
            <Btn
              inverted large onClick={this.handleToggleModal}
              data-type="delete" style={{ marginLeft: '0.5rem' }}
            >{strings.delete}</Btn>
          </div>)}
        >
          <div className={styles.deleteModalContent} style={{ padding: '1rem 1.5rem' }}>
            <p>{strings.deleteModalContent}</p>
          </div>
        </Modal>
      </header>
    );
  }
}
