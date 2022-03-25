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
 * @author Shibu Bhattarai <shibu.bhattarai@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Icon from 'components/Icon/Icon';
import FileThumb from 'components/FileThumb/FileThumb';
import Radio from 'components/Radio/Radio';

/**
 * Home Screens Item
 */
export default class HomeScreensItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    icon: PropTypes.bool,
    name: PropTypes.string,
    info: PropTypes.string,
    showConfigAssign: PropTypes.bool,
    numberOfConfigBundleAssign: PropTypes.number,
    radio: PropTypes.bool,
    checked: PropTypes.bool,
    downloadLink: PropTypes.string,
    baseUrl: PropTypes.string,
    edit: PropTypes.bool,
    progress: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    disabled: PropTypes.bool,
    remove: PropTypes.bool,
    dataId: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    onAssignClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,

    jsBridgeType: PropTypes.string,
    type: PropTypes.string
  };

  static defaultProps = {
    strings: {
      edit: 'Edit',
      delete: 'Delete'
    },
    showConfigAssign: false,
    numberOfConfigBundleAssign: 0
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleClick(e) {
    const { type, dataset } = e.currentTarget;
    if (type === 'radio') {
      this.updateValues({
        radio: this.props.id
      });
    } else {
      this.updateValues({
        [dataset.id]: this.props.id
      });
    }
  }

  handleAssignClick(e) {
    const { onAssignClick } = this.props;
    if (onAssignClick && typeof onAssignClick === 'function') {
      onAssignClick(e, this.props);
    }
  }

  updateValues(update) {
    const { onChange } = this.props;

    if (onChange) {
      onChange(update);
    }
  }

  render() {
    const {
      name,
      info,
      icon,
      radio,
      checked,
      downloadLink,
      baseUrl,
      progress,
      disabled,
      edit,
      remove,
      strings,
      className,
      style,
      showConfigAssign,
      numberOfConfigBundleAssign,
      jsBridgeType,
      type
    } = this.props;
    const styles = require('./HomeScreensItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      HomeScreensItem: true,
      disabled
    }, className);

    const webSectionStyle = cx({
      webSection: type === 'web',
      addOnSection: type === 'addOns',
    }, className);

    const previewBtnStyle = cx({
      btns: true,
      preview: true,
    }, className);

    const bridgeTypes = {
      '2.0': 'BTC / JS Bridge 2.0',
      '3.0': 'BTC / JS Bridge 3.0'
    };

    return (
      <div className={classes} style={style}>
        <div className={webSectionStyle}>
          <div className={styles.title}>
            {icon && <FileThumb
              category="app"
              thumbSize="small"
              className={styles.screensFileThumb}
            />}
            <span className={styles.name}>{name}</span>
          </div>
          {jsBridgeType && <div className={styles.title}>
            <span className={styles.name}>{bridgeTypes[jsBridgeType]}</span>
          </div>}
          <div>
            {info && <span className={styles.name}>{info}</span>}
            {radio && <Radio
              checked={checked}
              value={this.props.id}
              onChange={this.handleClick}
              className={styles.radio}
            />}
            {showConfigAssign && numberOfConfigBundleAssign === 0 &&
              <span className={styles.assignContainer} onClick={this.handleAssignClick}>
                <Icon name="plus" className={styles.assignIcon} />
                <span className={styles.assignLabel}>{strings.assign}</span>
              </span>}
            {showConfigAssign && numberOfConfigBundleAssign > 0 &&
              <span className={styles.assignContainer} onClick={this.handleAssignClick}>
                <Icon name="package" className={styles.assignIcon} />
                <span className={styles.assignLabel}>{numberOfConfigBundleAssign} {strings.assigned}</span>
              </span>}
          </div>
          <div>
            {downloadLink && <a href={downloadLink} className={styles.download} download />}
          </div>
          {baseUrl && <div className={previewBtnStyle}>
            <Btn
              data-id="view"
              icon="eye-fill"
              disabled={disabled}
              borderless
              inverted
              onClick={this.handleClick}
              className={styles.view}
            />
          </div>}
          <div className={styles.btns}>
            {edit && <Btn
              data-id="edit"
              disabled={disabled}
              borderless
              inverted
              onClick={this.handleClick}
            >
              {type === 'web' ? strings.edit : strings.rename}
            </Btn>}
            {remove && <Btn
              data-id="remove"
              disabled={disabled}
              borderless
              warning
              small
              onClick={this.handleClick}
            >
              {strings.delete}
            </Btn>}
          </div>
        </div>
        <div className={styles.fullProgress}>
          {progress >= 1 && progress <= 100 && <div
            className={styles.progress}
            style={{ width: (progress || 0) + '%' }}
          />}
        </div>
      </div>
    );
  }
}
