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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

/* eslint-disable no-bitwise */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import { createPrompt } from 'redux/modules/prompts';
import {
  load as loadSettings
} from 'redux/modules/settings';
import {
  getStories,
  updateStoriesByName,
} from 'redux/modules/admin/stories';

import Loader from 'components/Loader/Loader';
import MapModal from 'components/Admin/AdminStoryDefaults/MapModal';
import Dialog from 'components/Dialog/Dialog';
import AdminStoryDefaultsEditor from 'components/Admin/AdminStoryDefaults/AdminStoryDefaults';

const DEFAULTS = 'defaults';
//TODO not finished yet
const messages = defineMessages({
  share: {
    id: 'share',
    defaultMessage: 'Share'
  },
  device: {
    id: 'device',
    defaultMessage: 'Device',
  },
  shareWithAudit: {
    id: 'share-with-audit',
    defaultMessage: 'Share with audit'
  },
  setValue: {
    id: 'set-value',
    defaultMessage: 'Set Value'
  },
  minimumValueOne: {
    id: 'minimum-value-one',
    defaultMessage: 'Minimum value: 1'
  },
  defaultFileShareStatus: {
    id: 'default-file-share-status',
    defaultMessage: 'Default file share status'
  },
  optional: {
    id: 'optional',
    defaultMessage: 'Optional'
  },
  mandatory: {
    id: 'mandatory',
    defaultMessage: 'Mandatory'
  },
  blocked: {
    id: 'blocked',
    defaultMessage: 'Blocked'
  },
  general: {
    id: 'general',
    defaultMessage: 'General'
  },
  setExpiryTime: {
    id: 'set-expiry-time',
    defaultMessage: 'Set expiry time'
  },
  passwordProtect: {
    id: 'password-protect',
    defaultMessage: 'Password protect'
  },
  annotations: {
    id: 'annotations',
    defaultMessage: 'Annotations'
  },
  notifications: {
    id: 'notifications',
    defaultMessage: 'Notifications'
  },
  locationConstraints: {
    id: 'location-constraints',
    defaultMessage: 'Location constraints',
  },
  presentationSettings: {
    id: 'presentation-settings',
    defaultMessage: 'Presentation Settings'
  },
  allowBroadcast: {
    id: 'allow-broadcast',
    defaultMessage: 'Allow Broadcast'
  },
  allowSlideReorder: {
    id: 'allow-slide-reorder',
    defaultMessage: 'Allow slide reorder'
  },
  allowSlideHiding: {
    id: 'allow-slide-hiding',
    defaultMessage: 'Allow slide hiding'
  },
  addLocation: {
    id: 'add-location',
    defaultMessage: 'Add Location',
  },
  location: {
    id: 'location',
    defaultMessage: 'Location',
  },
  radius: {
    id: 'radius',
    defaultMessage: 'Radius',
  },
  coOrdinates: {
    id: 'co-ordinates',
    defaultMessage: 'Co-ordinates',
  },
  edit: {
    id: 'edit',
    defaultMessage: 'Edit',
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete',
  },
  allowSharing: {
    id: 'allow-sharing',
    defaultMessage: 'Allow Sharing',
  },
  allowPublicSharingOptions: {
    id: 'allow-public-sharing-options',
    defaultMessage: 'Allow device\'s publicly available sharing options',
  },
  fileAllowHubshareDownloads: {
    id: 'file-allow-hubshare-file-downloads',
    defaultMessage: 'Allow HubShare File Downloads',
  },
  downloads: {
    id: 'downloads',
    defaultMessage: 'Downloads',
  },
  days: {
    id: 'days',
    defaultMessage: 'Days',
  },
  limitDownloadsInfo: {
    id: 'limit-downloads-info',
    defaultMessage: 'Limit number of downloads per file',
  },
  expireLinksToFiles: {
    id: 'expire-links-to-files',
    defaultMessage: 'Expire links to files',
  },
  descriptionSharing: {
    id: 'description-sharing',
    defaultMessage: 'Description sharing',
  },

  radiusKm: {
    id: 'radius-km',
    defaultMessage: 'Radius (km)',
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel',
  },
  add: {
    id: 'add',
    defaultMessage: 'Add',
  },
  locationInfo: {
    id: 'location-info',
    defaultMessage: 'Locations where this {story} can be opened',
  },
  km: {
    id: 'km',
    defaultMessage: 'km',
  },
  warning: {
    id: 'warning',
    defaultMessage: 'Warning',
  },
  confirmMessage: {
    id: 'confirm-message',
    defaultMessage: 'Disabling this will remove all locations listed. Are you sure you want to disable location constraints?',
  }
});

@connect(state => ({
  ...state.admin.stories,
  fileAllowHubshareDownloads: state.admin.stories.fileAllowHubshareDownloads,
  // Is user currently in China (required for Google Maps)
  isChina: state.auth.loginSettings.countryCode === 'CN',
  defaultLocation: {
    addr: state.settings.geolocation.address || 'Sydney NSW 2000, Australia',
    lat: state.settings.geolocation.latitude || -33.8715695,
    lng: state.settings.geolocation.longitude || 151.2057323,
    rad: 50000
  },
}), bindActionCreatorsSafe({
  loadSettings,
  getStories,
  updateStoriesByName,
  createPrompt
}))
export default class AdminStoryDefaults extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      locationConstraintsChecked: false,
      isMapModalVisible: false,
      geolocation: {},
      confirmDialog: false,
    };

    this.propertyUpdate = {
      fileAllowHubshareDownloads: 'fileAllowHubshareDownloads',
      defaultFileShareStatus: 'serverShareFileStatus',
      setExpiryTime: 'storyExpiry',
      passwordProtect: 'protected',
      annotations: 'annotating',
      notifications: 'notifications',
      serverShareDownloadsAllowed: 'shareDownloadsAllowed',
      serverShareDownloadsExpired: 'shareDownloadsExpired',
    };

    this.share = {
      allowSharing: 2,
      allowPublicSharingOptions: 1,
      descriptionSharing: 64,
    };

    this.convertSettings = {
      allowBroadcast: 'allowLiveBroadcast',
      allowSlideReorder: 'allowSorter',
      allowSlideHiding: 'allowHideSlide',
    };

    autobind(this);

    this.timer = null;
  }

  componentDidMount() {
    if (this.props.getStories) {
      this.props.getStories(DEFAULTS);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'archiving-error',
        type: 'warning',
        title: 'Warning',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    if (this.props.loading && nextProps.loaded) {
      this.setState({
        locationConstraintsChecked: nextProps.locationConstraints.length > 0,
      });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  loadSettings() {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.props.loadSettings();
    }, 1000);
  }

  handleChange(update) {
    let newUpdate = Object.keys(update).reduce((obj, key) => {
      if (Object.prototype.hasOwnProperty.call(this.propertyUpdate, key)) {
        let value;
        if (update[key] === true || update[key] === false) {
          value = update[key] ? 1 : 0;
        } else {
          value = update[key];
        }

        return {
          [this.propertyUpdate[key]]: value
        };
      } else if (Object.prototype.hasOwnProperty.call(this.share, key)) {
        // console.log(this.props.sharing, this.share[key]);
        const shareResult = parseInt(this.props.sharing.toString(2).split('')
          .reverse().map((code, i) => ([0, 1, 6].indexOf(i) > -1 ? code : 0))
          .reverse()
          .join(''), 2);

        return {
          sharing: update[key] ? shareResult + this.share[key] : shareResult - this.share[key]
        };
      } else if (Object.prototype.hasOwnProperty.call(this.convertSettings, key)) {
        return {
          convertSettings: JSON.stringify({
            ...this.props.convertSettings,
            [this.convertSettings[key]]: update[key]
          })
        };
      }
      return obj;
    }, {});

    if (Object.prototype.hasOwnProperty.call(update, 'locationConstraints')) {
      if (this.props.locationConstraints.length > 0 && !update.locationConstraints) {
        // console.log(this.props.ocationConstraints);
        this.setState({
          confirmDialog: true
        });
      } else {
        this.setState({
          locationConstraintsChecked: update.locationConstraints
        });
      }
    }

    if (Object.prototype.hasOwnProperty.call(update, 'isMapModalVisible')) {
      this.setState({
        geolocation: this.props.defaultLocation,
        isMapModalVisible: true
      });
    }

    if (Object.prototype.hasOwnProperty.call(update, 'geolocation')) {
      this.setState({
        ...update,
        isMapModalVisible: true
      });
    }

    if (Object.prototype.hasOwnProperty.call(update, 'locations')) {
      newUpdate = {
        locationConstraints: JSON.stringify(update.locations)
      };
    }

    if (!_isEmpty(newUpdate)) {
      this.props.updateStoriesByName(newUpdate, DEFAULTS);
    }

    this.loadSettings();
  }

  handleConfirm() {
    this.handleChange({
      locations: []
    });
    this.setState({
      locationConstraintsChecked: false
    });
    this.handleClose();
  }

  handleClose() {
    this.setState({
      isMapModalVisible: false,
      confirmDialog: false
    });
  }

  /** map start */
  handleMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.setState({
      geolocation: {
        ...this.state.geolocation,
        lat: lat,
        lng: lng
      }
    });
  }

  handleNamedLocationChange(event) {
    this.setState({
      geolocation: { ...this.state.geolocation,
        addr: _get(event, '1.formatted_address', '')
      }
    });
  }

  handleRadiusChanged(event) {
    const rad = event.radius;

    this.setState({
      geolocation: { ...this.state.geolocation,
        rad: parseInt(rad.toFixed(0), 10)
      }
    });
  }

  handleAddLocation() {
    let newUpdate = this.props.locationConstraints;
    if (this.state.geolocation.index) {
      const updatedLocation = Object.keys(this.state.geolocation).reduce((obj, key) => {
        if (key !== 'index') {
          return { ...obj, [key]: this.state.geolocation[key] };
        }
        return obj;
      }, {});
      newUpdate = newUpdate.map((item, index) => (index !== Number(this.state.geolocation.index) ? item : updatedLocation));
    } else {
      newUpdate = newUpdate.concat(this.state.geolocation);
    }

    if (!_isEmpty(newUpdate)) {
      this.props.updateStoriesByName({
        locationConstraints: JSON.stringify(newUpdate)
      }, DEFAULTS);
    }

    this.setState({
      geolocation: this.props.defaultLocation,
      isMapModalVisible: false,
    });
  }

  /** map end */

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      locationConstraintsChecked,
      isMapModalVisible,
      geolocation,
    } = this.state;
    const {
      fileAllowHubshareDownloads,
      loading,
      serverShareFileStatus,
      storyExpiry,
      notifications,
      convertSettings,
      shareDownloadsAllowed,
      shareDownloadsExpired,
      locationConstraints,
      annotating,
      sharing,
      isChina,
      defaultLocation,
      className,
      style,
    } = this.props;
    const strings = generateStrings(messages, formatMessage, naming);

    const allowSharing = (sharing & 2) > 0;
    const allowPublicSharingOptions = (sharing & 4) > 0;
    const descriptionSharing = (sharing & 64) > 0;

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <div>
          <AdminStoryDefaultsEditor
            fileAllowHubshareDownloads={fileAllowHubshareDownloads}
            defaultFileShareStatus={serverShareFileStatus}
            setExpiryTime={storyExpiry}
            passwordProtect={this.props.protected}
            annotations={annotating}
            notifications={notifications}
            locationConstraints={locationConstraintsChecked}
            locations={locationConstraints}
            allowBroadcast={_get(convertSettings, 'allowLiveBroadcast', false)}
            allowSlideReorder={_get(convertSettings, 'allowSorter', false)}
            allowSlideHiding={_get(convertSettings, 'allowHideSlide', false)}
            serverShareDownloadsAllowed={shareDownloadsAllowed}
            serverShareDownloadsExpired={shareDownloadsExpired}
            allowSharing={allowSharing}
            allowPublicSharingOptions={allowPublicSharingOptions}
            descriptionSharing={descriptionSharing}
            onChange={this.handleChange}
            strings={strings}
          />
          <MapModal
            apiKey={window.BTC.GOOGLEMAP_KEY}
            isVisible={isMapModalVisible}
            onClose={this.handleClose}
            onChange={() => {}}
            isChina={isChina}
            geolocation={geolocation || defaultLocation}
            onNamedLocationChange={this.handleNamedLocationChange}
            onMapClick={this.handleMapClick}
            onAdd={this.handleAddLocation}
            onRadiusChanged={this.handleRadiusChanged}
            strings={strings}
          />
        </div>}
        <Dialog
          title={strings.warning}
          message={strings.confirmMessage}
          isVisible={this.state.confirmDialog}
          confirmText={strings.delete}
          onCancel={this.handleClose}
          onConfirm={this.handleConfirm}
        />
      </div>
    );
  }
}
