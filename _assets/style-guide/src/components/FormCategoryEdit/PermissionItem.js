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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';

import Btn from 'components/Btn/Btn';
import GroupThumb from 'components/GroupThumb/GroupThumb';
import Select from 'components/Select/Select';
import UserThumb from 'components/UserThumb/UserThumb';

/**
 * PermissionItem description
 */
export default class PermissionItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    type: PropTypes.oneOf(['group', 'people']),

    /** Bitmask representing permissions */
    permissions: PropTypes.number,

    /** Show permission Select inputs */
    showPermissions: PropTypes.bool,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** Handler when react-select is opened */
    onSelectOpen: PropTypes.func,

    /** Handler when react-select is closed */
    onSelectClose: PropTypes.func,

    /** Handle Delete Permission */
    onDeleteClick: PropTypes.func.isRequired,

    onPermissionChange: function(props) {
      if (props.showPermissions && typeof props.onPermissionChange !== 'function') {
        return new Error('onPermissionChange is required when showPermissions is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      none: 'None',
      delete: 'Delete',
      view: 'View',
      viewAndEdit: 'View & Edit',
      viewEditAndDelete: 'View, Edit & Export',
      viewAndExport: 'View & Export',
      viewExportAndDelete: 'View, Export & Delete',
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleDeleteClick(event) {
    event.preventDefault();

    this.props.onDeleteClick({
      id: this.props.id,
      type: this.props.type,
      permissionType: this.props.permissionType,
    });
  }

  render() {
    const {
      id,
      type,
      showPermissions,
      strings,
      onPermissionChange,
      onSelectOpen,
      onSelectClose,
      ...others
    } = this.props;
    const styles = require('./PermissionItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PermissionItem: true
    }, this.props.className);

    let ThumbComp = UserThumb;
    let note = this.props.role;
    if (type === 'group') {
      ThumbComp = GroupThumb;
      note = (<FormattedMessage
        id="n-users"
        defaultMessage="{itemCount, plural, one {# user} other {# users}}"
        values={{ itemCount: this.props.childCount }}
      />);
    }

    const formOptions = [
      { value: 1, label: strings.view },
      { value: 2, label: strings.viewAndEdit },
      { value: 32, label: strings.viewEditAndDelete },
    ];

    const dataOptions = [
      { value: 0, label: strings.none },
      { value: 4, label: strings.view },
      { value: 8, label: strings.viewAndExport },
      { value: 256, label: strings.viewExportAndDelete },
    ];

    return (
      <div className={classes}>
        <div className={styles.wrapper}>
          <ThumbComp {...others} />
          <div className={styles.info}>
            <span className={styles.name}>{this.props.name}</span>
            <span className={styles.note}>{note}</span>
          </div>
        </div>
        {showPermissions && <Select
          name={`${type}-${id}-form-permission`}
          value={1}
          options={formOptions}
          clearable={false}
          searchable={false}
          onChange={onPermissionChange}
          onOpen={onSelectOpen}
          onClose={onSelectClose}
          className={styles.select}
        />}
        {showPermissions && <Select
          name={`${type}-${id}-data-permission`}
          value={4}
          options={dataOptions}
          clearable={false}
          searchable={false}
          onChange={onPermissionChange}
          onOpen={onSelectOpen}
          onClose={onSelectClose}
          className={styles.select}
        />}
        <div>
          <Btn
            icon="trash"
            aria-label={strings.delete}
            borderless
            onClick={this.handleDeleteClick}
            className={styles.delete}
          />
        </div>
      </div>
    );
  }
}
