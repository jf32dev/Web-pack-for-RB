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

import Dropzone from 'react-dropzone';
import Btn from 'components/Btn/Btn';
import { addAuthPaths } from 'components/FabricEditor/fabricEditorUtil';
import Loader from 'components/Loader/Loader';
import SVGIcon from './SVGIcon';

/**
 * LogoEditItem description
 */
export default class LogoEditItem extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    isLoading: PropTypes.bool,

    onError: PropTypes.func,

    itemId: PropTypes.string,

    url: PropTypes.string,

    authString: PropTypes.string,

    onImageUpload: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    url: '',
    authString: '',
    isLoading: true,
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);

    // refs
    this.fileUpload = null;
  }

  handleChange(e) {
    // e.preventDefault();
    const { type } = _get(e, 'currentTarget', false);
    if (type === 'button') {
      const fileUploadDom = this.fileUpload;
      fileUploadDom.click();
    } else if (type === 'file' && e.target.files[0]) {
      const file = e.target.files;
      this.handleFileDrop(file);
    }
  }

  handleFileDrop(file) {
    const { onImageUpload, onError } = this.props;
    if (file.length && file[0].size <= 1024 * 1024 * 2) {
      // not bigger than 2MB
      // upload the file
      // this.props.onChange(file[0], this.props.itemId);
      if (onImageUpload && typeof onImageUpload === 'function') {
        onImageUpload(file[0], this.props.itemId);
      }
    } else if (onError && typeof onError === 'function') {
      onError({
        id: 'image-size-should-be-less-n',
        message: 'Images size should be less than 2MB',
        type: 'warning'
      });
    }
  }

  render() {
    const {
      strings,
      size,
      positionDesc,
      title,
      url,
      authString,
      isLoading,
      imageType
    } = this.props;
    const styles = require('./LogoEditItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      LogoEditItem: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <h3 className={styles.title}>{title}</h3>
        <div>
          <div>
            <Dropzone
              className={styles.image}
              activeClassName={styles.drapZoneActive}
              disableClick
              style={{ backgroundImage: url && `url(${addAuthPaths(url, authString)})` }}
              onDrop={this.handleFileDrop}
              accept="image/*"
            >
              {(!url || url === 'loading') && <SVGIcon type="defaultBackground" />}
              {isLoading && <Loader className={styles.load} type="content" />}
            </Dropzone>
            <div>
              <h5>{strings.imageRequirements}:</h5>
              <span>{size}</span>
            </div>
            <Btn inverted onClick={this.handleChange}>{strings.uploadImage}</Btn>
            <input
              ref={(c) => { this.fileUpload = c; }}
              type="file"
              accept="image/*"
              className={styles.hidden}
              onChange={this.handleChange}
            />
          </div>
          <div className={styles.rightContainer}>
            <div>
              <SVGIcon type={imageType} />
            </div>
            <div>{positionDesc}</div>
          </div>
        </div>
      </div>
    );
  }
}
