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
 * @author Jason Huang <jason.huange@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import AdminFormField from 'components/Admin/AdminUtils/FormField/FormField';
import Blankslate from 'components/Blankslate/Blankslate';
import SVGIcon from './Utils/SVGIcon';

/**
 * Admin Sync Engine
 */
export default class AdminSyncEngine extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,
    /** data */
    syncEngine: PropTypes.array,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      syncCloudServiceFolder: 'Sync cloud service folder',
      serviceName: 'Service Name',
      serviceProvider: 'Service Provider',
      enabled: 'Enabled',
      edit: 'Edit',
      delete: 'Delete',
    },
    syncEngine: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleCreateClick() {
    this.updateValue({
      action: 'create',
    });
  }

  handleCheckboxChange(e) {
    this.updateValue({
      action: 'checked',
      id: e.currentTarget.name.split('-')[1],
      value: e.currentTarget.checked
    });
  }

  handleBtnClick(e) {
    const { dataset } = e.currentTarget;
    this.updateValue({
      action: dataset.action.split('-')[0],
      id: dataset.action.split('-')[1],
    });
  }

  updateValue(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  render() {
    const { syncEngine, strings } = this.props;
    const styles = require('./AdminSyncEngine.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SyncEngine: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <AdminFormField
          type="create"
          label={strings.connectCloudServiceFolder}
          onChange={this.handleCreateClick}
        />
        {syncEngine.length !== 0 && <div className={styles.header}>
          <div>{strings.serviceName}</div><div>{strings.serviceProvider}</div><div>{strings.enabled}</div><div />
        </div>}
        {syncEngine.map(item => (
          <div className={styles.row} key={item.id}>
            <div>{item.description}</div>
            <div>
              <SVGIcon type={item.nickname} className={styles.svg} />
            </div>
            <div>
              <Checkbox
                name={`check-${item.id}`}
                value={`check-${item.id}`}
                checked={item.enabled}
                onChange={this.handleCheckboxChange}
              />
            </div>
            <div>
              <Btn
                borderless inverted onClick={this.handleBtnClick}
                data-action={`edit-${item.id}`}
              >{strings.edit}</Btn>
              <Btn
                borderless warning onClick={this.handleBtnClick}
                data-action={`delete-${item.id}`}
              >{strings.delete}</Btn>
            </div>
          </div>
        ))}
        {syncEngine.length === 0 && <Blankslate
          icon="content"
          heading={strings.emptyHeading}
          message={strings.emptyServiceMessage}
          middle
        />}
      </div>
    );
  }
}
