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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';
import Checkbox from 'components/Checkbox/Checkbox';

const messages = defineMessages({
  configure: { id: 'configure', defaultMessage: 'Configure' },
  configurationOptions: { id: 'configuration-options', defaultMessage: 'Configuration Options' },
  configurationDescription: { id: 'share-configuration-description', defaultMessage: 'Select the options below to show or hide features important to you' },
  to: { id: 'to', defaultMessage: 'To' },
  cc: { id: 'cc', defaultMessage: 'Cc' },
  subject: { id: 'subject', defaultMessage: 'Subject' },
  message: { id: 'message', defaultMessage: 'Message' },
});

/**
 * Displayed in <code>ShareModal</code>
 */
export default class ShareMenu extends Component {
  static propTypes = {
    strings: PropTypes.object,

    /** CRM service description. */
    service: PropTypes.string,

    /** Hide cc option if it is disabled from admin. */
    hideShareCcField: PropTypes.bool,

    /** Toggle input visibility. */
    //isToVisible: PropTypes.bool,
    isServiceVisible: PropTypes.bool,
    isCcVisible: PropTypes.bool,
    isSubjectVisible: PropTypes.bool,
    isMessageVisible: PropTypes.bool,

    onClick: PropTypes.func.isRequired,

    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    position: { left: -150, right: 0 }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleMenuClick(event) {
    event.stopPropagation();
  }

  handleChange(event) {
    event.stopPropagation();

    if (typeof this.props.onClick === 'function') {
      this.props.onClick({
        attribute: event.target.name,
        isChecked: event.target.checked,
      });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      service,
      //isToVisible,
      isServiceVisible,
      isCcVisible,
      isSubjectVisible,
      isMessageVisible,
    } = this.props;
    const styles = require('./ShareMenu.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const headingElem = (
      <Btn icon="gear" small className={styles.button}>{strings.configure}</Btn>
    );

    return (
      <DropMenu
        id="share-menu" heading={headingElem} position={this.props.position}
        width={250} style={this.props.style}
      >
        <div className={styles.ShareMenu}>
          <div className={styles.heading}>
            <h3>{strings.configurationOptions}</h3>
            <span>{strings.configurationDescription}</span>
          </div>
          <ul className={styles.linkList} onClick={this.handleMenuClick}>
            {service && <li>
              <label htmlFor="isServiceVisible">{service}</label>
              <Checkbox
                inputId="isServiceVisible"
                name="isServiceVisible"
                value={1}
                checked={isServiceVisible}
                onChange={this.handleChange}
              />
            </li>}
            {/*<li>
             <label htmlFor="isToVisible">{strings.to}</label>
             <Checkbox
             inputId="isToVisible"
             name="isToVisible"
             value={1}
             checked={isToVisible}
             onChange={this.handleChange}
             />
             </li>*/}
            {!this.props.hideShareCcField && <li>
              <label htmlFor="isCcVisible">{strings.cc}</label>
              <Checkbox
                inputId="isCcVisible"
                name="isCcVisible"
                value={1}
                checked={isCcVisible}
                onChange={this.handleChange}
              />
            </li>}
            <li>
              <label htmlFor="isSubjectVisible">{strings.subject}</label>
              <Checkbox
                inputId="isSubjectVisible"
                name="isSubjectVisible"
                value={1}
                checked={isSubjectVisible}
                onChange={this.handleChange}
              />
            </li>
            <li>
              <label htmlFor="isMessageVisible">{strings.message}</label>
              <Checkbox
                inputId="isMessageVisible"
                name="isMessageVisible"
                value={1}
                checked={isMessageVisible}
                onChange={this.handleChange}
              />
            </li>
          </ul>
        </div>
      </DropMenu>
    );
  }
}
