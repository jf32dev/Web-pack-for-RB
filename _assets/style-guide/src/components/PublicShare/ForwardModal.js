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

import Modal from 'components/Modal/Modal';
import Btn from 'components/Btn/Btn';
import MultiSelect from 'components/MultiSelect/MultiSelect';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';
import FileItem from 'components/FileItem/FileItem';
import filesize from 'filesize';
import Select from 'components/Select/Select';

/**
 * Story Detail description
 */
export default class ForwardModal extends PureComponent {
  static propTypes = {
    /** emails list */
    emails: PropTypes.array,

    /** Subject of the email */
    subject: PropTypes.string,

    /** Message of the email */
    message: PropTypes.string,

    /** onClose method for closing the modal */
    onClose: PropTypes.func,

    /** onForward methdo for forward email */
    onForward: PropTypes.func,

    /** onForward methdo for forward email */
    onChange: PropTypes.func,

    /** List of languages <code>{"en-us": "English (US)", ...}</code>*/
    languageList: PropTypes.object,

    /** Displays subject and templates in language selected */
    language: PropTypes.string,

    /** array of files, should have name and size on each object */
    files: PropTypes.array,

    defaultSubject: PropTypes.string,

    onLanguageChange: PropTypes.func,

    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      emailAddresses: 'Emails Addresses',
      subject: 'Subject',
      message: 'Message',
      files: 'Files',
      forward: 'Forward',
      cancel: 'Cancel'
    },
    emails: [],
    files: [],
    subject: '',
    message: '',
    defaultSubject: '',
    languageList: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isTitleUpdated: false,
    };
    autobind(this);
  }

  // Custom MultiSelect
  handleAddValue(event, context) {
    let data = {};

    if (Array.isArray(context)) {
      data = context.map(item => ({
        value: item.value,
        label: item.label,
        status: item.status,
      }));
    } else {
      data = [{
        value: context.value,
        label: context.label,
        status: context.status,
      }];
    }
    // Add new item selected
    this.updateValues({
      emails: [...this.props.emails, ...data]
    });
  }

  handlePopValue() {
    const { emails } = this.props;
    if (Array.isArray(emails) && emails.length) {
      this.updateValues({
        emails: emails.slice(0, emails.length - 1)
      });
    }
  }

  handleInputChange(e) {
    const name = _get(e, 'currentTarget.name', false);
    if (name) {
      this.updateValues({
        [name]: e.currentTarget.value
      });
    }

    if (name && name === 'subject' && !this.state.isTitleUpdated) {
      this.setState({
        isTitleUpdated: true
      });
    }
  }

  handleLanguageChange(context) {
    if (typeof this.props.onLanguageChange === 'function') {
      this.props.onLanguageChange(context);
    }
  }

  updateValues(value) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(value);
    }
  }

  render() {
    const { strings, isVisible, onForward, onClose, emails, subject, message, files, defaultSubject, languageList, language } = this.props;
    const styles = require('./ForwardModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ForwardModal: true
    }, this.props.className);

    let isForward = emails.length > 0 && emails.filter(email => email.status === 'error').length === 0;
    if (this.state.isTitleUpdated) {
      isForward = !_isEmpty(subject) && isForward;
    }

    const hasFiles = files.length > 0;

    const languages = Object.keys(languageList).map((k) => ({
      id: k,
      name: languageList[k]
    }));

    return (
      <Modal
        isVisible={isVisible}
        className={classes}
        width="medium"
        backdropClosesModal
        escClosesModal
        headerTitle={strings.forward}
        footerChildren={(<div>
          <Btn
            alt large onClick={onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large data-name="forwardValues"
            onClick={onForward} disabled={!isForward} style={{ marginLeft: '0.5rem' }}
          >{strings.forward}</Btn>
        </div>)}
        onClose={onClose}
      >
        <div className={styles.container}>
          <label htmlFor="emails">{strings.emailAddresses}</label>
          <MultiSelect
            id="emails"
            value={emails}
            keyValue="value"
            keyLabel="label"
            multi
            className={styles.emails}
            crmSource="dynamics"
            backspaceRemoves
            allowsCreateType="email"
            onInputChange={() => {}}
            onAddValue={this.handleAddValue}
            onPopValue={this.handlePopValue}
          />
          <Text
            id="subject"
            value={this.state.isTitleUpdated ? subject : defaultSubject}
            label={strings.subject}
            name="subject"
            onChange={this.handleInputChange}
          />
          <label htmlFor="message">{strings.message}</label>
          <Textarea
            id="message"
            value={message}
            name="message"
            rows={4}
            textareaStyle={{ maxHeight: '10rem' }}
            onChange={this.handleInputChange}
          />
          {!_isEmpty(languages) && <div className={styles.selectWrapper}>
            <label>{strings.language}</label>
            <Select
              name="language"
              value={{ id: language, name: languageList[language] }}
              options={languages}
              valueKey="id"
              labelKey="name"
              searchable
              clearable={false}
              placeholder="Select"
              onChange={this.handleLanguageChange}
              className={styles.select}
            />
          </div>}
          {hasFiles && <h4>{strings.files}</h4>}
          {hasFiles && <div className={styles.files}>
            {hasFiles && files.map((file, i) => (
              <FileItem
                thumbSize="small"
                key={i}
                description=""
                {...file}
              >
                <div>
                  <div className={styles.name} title={file.name}>{file.name}</div>
                  {file.size && <div className={styles.size}>
                    {filesize(file.size)}
                  </div>}
                </div>
              </FileItem>
            ))}
          </div>}
        </div>
      </Modal>
    );
  }
}
