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
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
// import Debug from '../../views/Debug';
import MapModal from 'components/Admin/AdminStoryDefaults/MapModal';
import AdminStoryDefaults from 'components/Admin/AdminStoryDefaults/AdminStoryDefaults';

const StoryDefaultsDocs = require('!!react-docgen-loader!components/Admin/AdminStoryDefaults/AdminStoryDefaults.js');

export default class StoryDefaultsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        device: false,
        shareWithAudit: false,
        downloadsPerAttachment: 0,
        expiresInDays: 0,
        defaultFileShareStatus: '',
        setExpiryTime: false,
        passwordProtect: false,
        annotations: false,
        notifications: false,
        locationConstraints: true,
        presentationSettings: false,
        allowBroadcast: false,
        allowSlideReorder: false,
        allowSlideHiding: false,
        locations: [{
          'addr': '111 George St, Sydney NSW 2000, Australia',
          'lat': -33.8675,
          'lng': 151.207,
          'rad': 50000
        }, {
          'addr': '22 George St, Sydney NSW 2000, Australia',
          'lat': -33.8675,
          'lng': 151.207,
          'rad': 50000
        }, {
          'addr': '333 George St, Sydney NSW 2000, Australia',
          'lat': -33.8675,
          'lng': 151.207,
          'rad': 50000
        }, {
          'addr': '444 George St, Sydney NSW 2000, Australia',
          'lat': -33.8675,
          'lng': 151.207,
          'rad': 50000
        }],
        geolocation: {
          'addr': '343 George St, Sydney NSW 2000, Australia',
          'lat': -33.8675,
          'lng': 151.207,
          'rad': 50000
        }
      }
    };

    autobind(this);
  }

  handleChange(update) {
    this.setState({
      values: {
        ...this.state.values,
        ...update,
      },
    });
  }

  handleClose() {
    this.setState({
      values: {
        ...this.state.values,
        isMapModalVisible: false,
      }
    });
  }

  handleMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.setState({
      values: {
        ...this.state.values,
        geolocation: { ...this.state.values.geolocation,
          lat: lat,
          lng: lng
        }
      }
    });
  }

  handleNamedLocationChange(event) {
    this.setState({
      values: {
        ...this.state.values,
        geolocation: { ...this.state.values.geolocation,
          addr: _get(event, '1.formatted_address', '')
        }
      }
    });
  }

  handleRadiusChanged(event) {
    const rad = event.radius;

    this.setState({
      values: {
        ...this.state.values,
        geolocation: { ...this.state.values.geolocation,
          rad: parseInt(rad.toFixed(0), 10)
        }
      }
    });
  }

  handleAddLocation() {
    if (Object.prototype.hasOwnProperty.call(this.state.values.geolocation, 'index')) {
      this.setState({
        values: {
          ...this.state.values,
          locations: this.state.values.locations.map((item, index) => (index !== Number(this.state.values.geolocation.index) ? item : this.state.values.geolocation)),
          isMapModalVisible: false,
        }
      });
    } else {
      this.setState({
        values: {
          ...this.state.values,
          locations: this.state.values.locations.concat(this.state.values.geolocation),
          isMapModalVisible: false,
        }
      });
    }
  }

  render() {
    return (
      <section id="BlankView">
        <h1>Admin Story Defaults</h1>
        <Docs {...StoryDefaultsDocs} />
        <ComponentItem>
          <AdminStoryDefaults
            onChange={this.handleChange}
            {...this.state.values}
          />
          <MapModal
            isVisible={this.state.values.isMapModalVisible}
            onClose={this.handleClose}
            onChange={() => {}}
            geolocation={this.state.values.geolocation}
            onNamedLocationChange={this.handleNamedLocationChange}
            onMapClick={this.handleMapClick}
            onAdd={this.handleAddLocation}
            onRadiusChanged={this.handleRadiusChanged}
          />
        </ComponentItem>
      </section>
    );
  }
}
