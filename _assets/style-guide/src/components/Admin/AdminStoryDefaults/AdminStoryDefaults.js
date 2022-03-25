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
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Select from 'react-select';

import Checkbox from 'components/Checkbox/Checkbox';

import AddLocation from './AddLocation';
import CheckboxInput from 'components/Admin/AdminUtils/CheckboxInput/CheckboxInput';


/**
 * Admin Story Defaults
 */
export default class AdminStoryDefaults extends PureComponent {
  static propTypes = {
    /** Default File Share Status */
    defaultFileShareStatus: PropTypes.string,

    /** Set Expiry Time */
    setExpiryTime: PropTypes.bool,

    /** Password Protect */
    passwordProtect: PropTypes.bool,

    /** Annotations */
    annotations: PropTypes.bool,

    /** Notifications */
    notifications: PropTypes.bool,

    /** Location Constraints */
    locationConstraints: PropTypes.bool,

    /** Allow Broadcast */
    allowBroadcast: PropTypes.bool,

    /** Allow Slide Reorder */
    allowSlideReorder: PropTypes.bool,

    /** Allow slide hiding */
    allowSlideHiding: PropTypes.bool,

    allowSharing: PropTypes.bool,

    serverShareDownloadsAllowed: PropTypes.number,

    serverShareDownloadsExpired: PropTypes.number,

    allowPublicSharingOptions: PropTypes.bool,

    descriptionSharing: PropTypes.bool,

    fileAllowHubshareDownloads: PropTypes.bool,

    locations: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** onChange method when any data input update */
    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      share: 'Share',
      defaultFileShareStatus: 'Default file share status',
      optional: 'Optional',
      mandatory: 'Mandatory',
      blocked: 'Blocked',
      general: 'General',
      setExpiryTime: 'Set expiry time',
      passwordProtect: 'Password protect',
      annotations: 'Annotations',
      notifications: 'Notifications',
      locationConstraints: 'Location constraints',
      presentationSettings: 'Presentation Settings',
      allowBroadcast: 'Allow Broadcast',
      allowSlideReorder: 'Allow slide reorder',
      allowSlideHiding: 'Allow slide hiding',
      addLocation: 'Add Location',
      location: 'Location',
      radius: 'Radius',
      coOrdinates: 'Co-ordinates',
      edit: 'Edit',
      delete: 'Delete',
      allowSharing: 'Allow Sharing',
      allowPublicSharingOptions: 'Allow device\'s publicly available sharing options',
      fileAllowHubshareDownloads: 'Allow HubShare File Downloads',
      downloads: 'Downloads',
      days: 'Days',
      limitDownloadsInfo: 'Limit number of downloads per file',
      expireLinksToFiles: 'Expire links to files',
      descriptionSharing: 'Description sharing',
      km: 'km',
    },
    defaultFileShareStatus: '',

    setExpiryTime: false,
    passwordProtect: false,
    annotations: false,
    notifications: false,
    locationConstraints: false,

    allowBroadcast: false,
    allowSlideReorder: false,
    allowSlideHiding: false,

    allowSharing: false,
    serverShareDownloadsAllowed: 0,
    serverShareDownloadsExpired: 0,
    descriptionSharing: false,
    allowPublicSharingOptions: false,
    fileAllowHubshareDownloads: true,

    locations: []
  };

  constructor(props) {
    super(props);
    this.state = {};

    autobind(this);
  }

  handleChange(e) {
    const { type, name, id, value, dataset } = e.currentTarget;

    let update = {};

    if (type === 'checkbox') {
      update = {
        [name]: !this.props[name],
      };
    } else if (type === 'radio') {
      update = {
        [id.split('-')[0]]: id.split('-')[1],
      };
    } else if (type === 'number') {
      update = {
        [name]: value,
      };
    } else if (dataset.action === 'addLocation') {
      update = {
        isMapModalVisible: true,
      };
    } else if (dataset.action === 'edit') {
      update = {
        geolocation: {
          ...this.props.locations[dataset.index],
          index: dataset.index
        },
        isMapModalVisible: true,
      };
    } else if (dataset.action === 'delete') {
      update = {
        locations: this.props.locations.filter((item, index) => index !== Number(dataset.index)),
      };
    }

    this.handleUpdateValues(update);
  }

  handleSelect({ value }) {
    this.handleUpdateValues({ defaultFileShareStatus: value });
  }

  handleUpdateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  render() {
    const {
      strings,
      defaultFileShareStatus,
      locationConstraints,
      allowSharing,
      serverShareDownloadsAllowed,
      serverShareDownloadsExpired,
      allowPublicSharingOptions,
      fileAllowHubshareDownloads,
      descriptionSharing,
      locations
    } = this.props;
    const styles = require('./AdminStoryDefaults.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminStoryDefaults: true
    }, this.props.className);

    const statusList = [
      {
        value: 'optional',
        label: strings.optional
      },
      {
        value: 'mandatory',
        label: strings.mandatory
      }, {
        value: 'blocked',
        label: strings.blocked,
      }
    ];

    return (
      <div className={classes} style={this.props.style}>
        <section>
          <h3>{strings.share}</h3>
          <Checkbox
            label={strings.allowSharing}
            name="allowSharing"
            className={`${styles.checkboxDefaults} ${styles.allowSharing}`}
            checked={allowSharing}
            onChange={this.handleChange}
          />
          {allowSharing && <div className={styles.allowSharingSub}>
            <Checkbox
              label={strings.allowPublicSharingOptions}
              name="allowPublicSharingOptions"
              checked={allowPublicSharingOptions}
              onChange={this.handleChange}
            />
            <CheckboxInput
              value={serverShareDownloadsAllowed}
              title={strings.limitDownloadsInfo}
              name="serverShareDownloadsAllowed"
              min={1}
              label={strings.downloads}
              onChange={this.handleUpdateValues}
            />
            <CheckboxInput
              value={serverShareDownloadsExpired}
              title={strings.expireLinksToFiles}
              name="serverShareDownloadsExpired"
              min={1}
              label={strings.days}
              onChange={this.handleUpdateValues}
            />
            <div className={styles.selectWrap}>
              <label htmlFor="defaultFileShareStatus">{strings.defaultFileShareStatus}</label>
              <Select
                id="defaultFileShareStatus"
                name="defaultFileShareStatus"
                value={defaultFileShareStatus}
                options={statusList}
                clearable={false}
                onChange={this.handleSelect}
              />
              <div className={styles.deletingWarning}>{strings.deleteArchivedWarning}</div>
            </div>
            <Checkbox
              label={strings.fileAllowHubshareDownloads}
              name="fileAllowHubshareDownloads"
              checked={fileAllowHubshareDownloads}
              onChange={this.handleChange}
            />
            <Checkbox
              label={strings.descriptionSharing}
              name="descriptionSharing"
              checked={descriptionSharing}
              onChange={this.handleChange}
            />
          </div>}
        </section>

        <section>
          <h3>{strings.general}</h3>
          {['setExpiryTime', 'passwordProtect', 'annotations', 'notifications', 'locationConstraints'].map(name => (
            <Checkbox
              label={strings[name]}
              name={name}
              key={name}
              checked={this.props[name]}
              onChange={this.handleChange}
              className={`${styles.checkboxDefaults} ${styles[name]}`}
            />
          ))}
          <TransitionGroup className={styles.location}>
            {locationConstraints && <CSSTransition
              classNames="fade"
              timeout={250}
              appear
            >
              <AddLocation
                strings={strings}
                list={locations}
                onChange={this.handleChange}
                className={styles.addLocation}
              />
            </CSSTransition>}
          </TransitionGroup>
        </section>

        <section>
          <h3>{strings.presentationSettings}</h3>
          {['allowBroadcast', 'allowSlideReorder', 'allowSlideHiding'].map(name => (
            <Checkbox
              label={strings[name]}
              name={name}
              key={name}
              className={`${styles.checkboxDefaults} ${styles[name]}`}
              checked={this.props[name]}
              onChange={this.handleChange}
            />
          ))}
        </section>
      </div>
    );
  }
}
