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
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';

/**
 * Admin File Uploads
 */
export default class AdminFileUploads extends PureComponent {
  static propTypes = {
    /** Videos transcode*/
    transcodeVideos: PropTypes.bool,

    /** allowed Extensions list*/
    allowedExtensions: PropTypes.array,

    forbiddenExtensions: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      transcodeVideos: 'Transcode videos',
      allowedFileUploads: 'Allowed File Uploads',
      serverDefinedBlockedFiles: 'Server Defined Blocked Files [php, exe, dmg]',
      addFileFormat: 'Add file format',
      add: 'Add',
      resetDefaults: 'Reset Defaults',
    },
    allowedExtensions: [],
    forbiddenExtensions: []
  };

  constructor(props) {
    super(props);
    this.state = {
      fileFormatValue: '',
      videoTranscode: undefined,
    };
    autobind(this);
  }

  handleCheckboxChange(event) {
    this.setState({
      videoTranscode: event.currentTarget.checked
    });
    this.updateValues({
      videoTranscode: event.currentTarget.checked
    });
  }

  handleInputChange(event) {
    this.setState({
      fileFormatValue: event.currentTarget.value
    });

    this.updateValues({
      currentValue: event.currentTarget.value
    });
  }

  handleBtnClick(event) {
    const action = event.currentTarget.dataset.action;
    const id = event.currentTarget.dataset.id;
    let update = {};
    if (action === 'add') {
      update = {
        input: this.state.fileFormatValue
      };
      this.setState({
        fileFormatValue: ''
      });
    } else if (action === 'resetDefaults') {
      update = {
        dialog: 'resetDefaults'
      };
    } else if (action === 'delete') {
      update = {
        dialog: 'delete',
        id,
      };
    }
    this.updateValues(update);
  }

  updateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function' && !_isEmpty(update)) {
      onChange(update);
    }
  }

  checkStrInArray(list = [], str = this.state.fileFormatValue) {
    return list.some((item) => item.toLowerCase() === str.toLowerCase());
  }

  render() {
    const {
      strings,
      videoTranscode,
      allowedExtensions,
      forbiddenExtensions,
    } = this.props;
    const styles = require('./AdminFileUploads.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FileUploads: true
    }, this.props.className);

    const warning = this.checkStrInArray(forbiddenExtensions) ? strings.fileFormatBlockedMsg : '';

    return (
      <div className={classes} style={this.props.style}>
        <Checkbox
          label={strings.transcodeVideos}
          name="videoTranscode"
          value="videoTranscode"
          checked={this.state.videoTranscode === undefined ? videoTranscode : this.state.videoTranscode}
          onChange={this.handleCheckboxChange}
        />
        <div className={styles.allowedFileUploads}>
          <h3>{strings.allowedFileUploads}</h3>
          <h5>{strings.serverDefinedBlockedFiles}</h5>
          <div className={styles.inputBox}>
            <h4>{strings.addFileFormat}</h4>
            <div className={styles.inputContainer}>
              <Text
                id="addFileFormat"
                value={this.state.fileFormatValue}
                onChange={this.handleInputChange}
                className={styles.input}
              />
              <Btn
                borderless
                inverted
                onClick={this.handleBtnClick}
                data-action="add"
                disabled={this.checkStrInArray([...forbiddenExtensions, ...allowedExtensions]) || this.state.fileFormatValue === ''}
              >{strings.add}</Btn>
            </div>
            <div className={styles.warning}>{this.checkStrInArray(allowedExtensions) ? strings.fileFormatAlreadyAddedMsg : warning}</div>
          </div>
          <div className={styles.resetDefaults}>
            <Btn
              borderless inverted onClick={this.handleBtnClick}
              data-action="resetDefaults"
            >{strings.resetDefaults}</Btn>
          </div>
          <div className={styles.allowedExtension}>
            {allowedExtensions.map(item => (<div key={item} className={styles.allowedExtensionItem}>
              <h5>{item}</h5>
              <div
                onClick={this.handleBtnClick}
                data-id={item}
                data-action="delete"
                className={styles.deleted}
              />
            </div>))}
          </div>
        </div>
      </div>
    );
  }
}
