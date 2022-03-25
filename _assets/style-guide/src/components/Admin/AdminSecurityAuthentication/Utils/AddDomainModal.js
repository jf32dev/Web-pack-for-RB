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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

/**
 * Modal
 */
export default class AddDomainModal extends PureComponent {
  static propTypes = {

    isVisible: PropTypes.bool,

    accountSuffix: PropTypes.string,

    baseDn: PropTypes.string,

    domainController: PropTypes.string,

    usernamePrefix: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    onClose: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    isVisible: false,
    accountSuffix: '',
    baseDn: '',
    domainController: '',
    usernamePrefix: '',
    strings: {
      accountSuffix: 'Account Suffix',
      baseDn: 'Base DN',
      domainController: 'Domain controller',
      usernamePrefix: 'User prefix',
      cancel: 'Cancel',
      save: 'Save',
      addDomainController: 'Add Domain Controller',
    }
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.textFields = ['accountSuffix', 'baseDn', 'domainController', 'usernamePrefix'];
    autobind(this);
  }

  render() {
    const { onClose, onChange, strings, isVisible } = this.props;
    const styles = require('./AddDomainModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AddDomainModal: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        backdropClosesModal
        escClosesModal
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.addDomainController}</p>}
        footerChildren={(<div>
          <Btn
            alt large onClick={onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={onChange}
            style={{ marginLeft: '0.5rem' }}
          >{strings.save}</Btn>
        </div>)}
        onClose={onClose}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          <table cellSpacing="0" cellPadding="0" className={styles.table}>
            <tbody>
              {this.textFields.map(item => (
                <tr key={item}>
                  <td>{strings[item]}</td>
                  <td>
                    <Text
                      onChange={onChange} value={this.props[item] || ''} data-name="AddDomainModal"
                      data-id={item}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    );
  }
}
