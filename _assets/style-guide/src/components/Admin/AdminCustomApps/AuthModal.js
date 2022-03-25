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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';

/**
 * choose auth modal
 */
export default class AuthModal extends PureComponent {
  static propTypes = {
    /** call back method to close modal*/
    onClose: PropTypes.func,

    isVisible: PropTypes.bool,

    onClick: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      chooseAuthMethod: 'Choose Auth Method',
      standardOAuth: 'Standard OAuth 2.0 (User Authentication)',
      apiOAuth: 'OAuth 2.0 with API key (Server Authentication)',
      standardOAuthDesc: 'Require Bigtincan Hub users to log in to authorize your app.',
      apiOAuthDesc: 'Allows your app to authenticate with Bigtincan Hub using an API key instead of user credentials.',
      cancel: 'Cancel',
    }
  };

  constructor(props) {
    super(props);
    this.choose = ['standardOAuth', 'apiOAuth'];
  }

  render() {
    const styles = require('./AuthModal.less');
    const { isVisible, onClose, strings, onClick } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      AuthModal: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        onClose={onClose}
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.chooseAuthMethod}</p>}
        footerChildren={(<div>
          <Btn alt large onClick={onClose}>{strings.cancel}</Btn>
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          {this.choose.map(item => (
            <div
              className={styles.item} key={item} data-type={item === 'apiOAuth' ? 'api_key' : 'authorization'}
              onClick={onClick}
            >
              <div>{strings[item]}</div>
              <p>{strings[`${item}Desc`]}</p>
            </div>
          ))}
        </div>
      </Modal>
    );
  }
}
