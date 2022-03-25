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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Select from 'react-select';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';

/**
 * Displays Admin Channel's settings.
 */
export default class AdminChannelSettings extends PureComponent {
  static propTypes = {
    /** Valid ChannelItem data */
    channel: PropTypes.object.isRequired,

    /** selected sort order */
    defaultSortBy: PropTypes.string,
    sortOptions: PropTypes.array,

    authString: PropTypes.string,
    strings: PropTypes.object,

    showRemove: PropTypes.bool,
    showSave: PropTypes.bool,
    isLoading: PropTypes.bool,

    onSaveClick: function(props) {
      if (props.showSave && typeof props.onSaveClick !== 'function') {
        return new Error('onSaveClick is required when showSave is provided.');
      }
      return null;
    },

    onRemoveClick: function(props) {
      if (props.showRemove && typeof props.onSaveClick !== 'function') {
        return new Error('onRemoveClick is required when showRemove is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    channel: {},
    isFileEncryptionEnabled: false,
    fileEncryption: false,
    sortOptions: [
      { value: 'date', label: 'Date' },
      { value: 'title', label: 'Title' },
      { value: 'sequence', label: 'Priority' },
      { value: 'likes', label: 'Likes' },
      { value: 'mostread', label: 'Most Read' },
      { value: 'leastread', label: 'Least Read' },
      { value: 'author_first_name', label: 'Author First Name' },
      { value: 'author_last_name', label: 'Author Last Name' },
      { value: 'content_score', label: 'Content IQ' }
    ],
    authString: '',
    strings: {
      removeChannel: 'Remove Channel',
      fileEncryption: 'File Encryption',
      save: 'Save',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      defaultSortBy: props.channel.defaultSortBy,
      fileEncryption: props.channel.fileEncryption || false,
      isSaveEnabled: false
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.channel.defaultSortBy && nextProps.channel.defaultSortBy !== this.props.channel.defaultSortBy) {
      this.state = {
        defaultSortBy: nextProps.channel.defaultSortBy
      };
    }
  }

  handleStopPropagation(event) {
    event.stopPropagation();
  }

  handleOnChange(attribute, value) {
    this.setState({
      [attribute]: value,
      isSaveEnabled: true
    });
  }

  handleSortOptionsChange(data) {
    this.handleOnChange('defaultSortBy', data.value);
  }

  handleOnCheckboxChange(e) {
    this.handleOnChange('fileEncryption', e.target.checked);
  }

  handleSaveClick(e) {
    this.setState({ isSaveEnabled: false });
    if (typeof this.props.onSaveClick === 'function') {
      this.props.onSaveClick(e, { ...this.props.channel, ...this.state });
    }
  }

  handleRemoveClick(e) {
    if (typeof this.props.onRemoveClick === 'function') {
      this.props.onRemoveClick(e, this.props);
    }
  }

  render() {
    const {
      channel,
      isFileEncryptionEnabled,
      strings,
      showRemove,
      showSave,
      isLoading,
      className,
      style
    } = this.props;

    const {
      defaultSortBy,
      fileEncryption
    } = this.state;

    const styles = require('./AdminChannelSettings.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChannelSettings: true
    }, className);

    const hasAction = true;

    return (
      <div className={classes} style={style} onClick={this.handleStopPropagation}>
        {showRemove && <div className={styles.removeWrap}>
          <Btn
            warning
            loading={isLoading}
            onClick={this.handleRemoveClick}
          >{strings.removeChannel}</Btn>
        </div>}
        {channel.description && <div className={styles.detailWrap}>
          {channel.description}
        </div>}
        <div className={styles.defaultSortBy}>
          <Select
            name={`${channel.id}-defaultSortBy`}
            value={defaultSortBy}
            options={this.props.sortOptions}
            clearable={false}
            searchable={false}
            onChange={this.handleSortOptionsChange}
          />
        </div>
        {hasAction && <ul className={styles.actions}>
          <li>
            <Checkbox
              inputId={`${channel.id}-isFileEncrypted`}
              name={`${channel.id}-isFileEncrypted`}
              label={strings.fileEncryption}
              data-option="isFileEncrypted"
              checked={fileEncryption}
              value={fileEncryption}
              onChange={this.handleOnCheckboxChange}
              disabled={!isFileEncryptionEnabled}
            />
          </li>
        </ul>}
        {showSave && <div className={styles.saveWrap}>
          <Btn
            inverted
            large
            loading={isLoading}
            disabled={!this.state.isSaveEnabled}
            onClick={this.handleSaveClick}
          >
            {strings.save}
          </Btn>
        </div>}
      </div>
    );
  }
}
