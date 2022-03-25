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
 * @package hub-web-app-v5
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Map from 'components/Map/Map';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

const messages = defineMessages({
  addLocationRestriction: { id: 'add-locations-restriction', defaultMessage: 'Add Location Restriction' },
  addLocationRestrictionInfo: { id: 'add-locations-restriction-info', defaultMessage: 'Click the map to create a new restriction' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  save: { id: 'save', defaultMessage: 'Save' },
  location: { id: 'location', defaultMessage: 'Location' },
  radiusKm: { id: 'radius-km', defaultMessage: 'Radius (km)' },
  locate: { id: 'locate', defaultMessage: 'Locate' },
});

class LocationEditor extends Component {
  static propTypes = {
    defaultLocation: PropTypes.object,

    addr: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    rad: PropTypes.number,

    isChina: PropTypes.bool,
    hideRadius: PropTypes.bool,

    strings: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,

    onMapClick: PropTypes.func.isRequired,
    onNamedLocationChange: PropTypes.func.isRequired,
    onRadiusChanged: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // refs
    this.map = null;
  }

  render() {
    const { defaultLocation, addr, lat, lng, rad, strings, styles } = this.props;

    const marker = [];
    if (lat && lng) {
      marker.push({ addr, lat, lng, rad });
    }

    // Convert from metres to kilometres
    const radiusKm = rad ? (rad / 1000) : '';

    return (
      <div className={styles.LocationEditor}>
        <Map
          apiKey={window.BTC.GOOGLEMAP_KEY}
          ref={(c) => { this.map = c; }}
          height={350}
          defaultZoom={7}
          defaultCenter={defaultLocation}
          markers={marker}
          circleOptions={{
            editable: !this.props.hideRadius,
            onRadiusChanged: this.props.onRadiusChanged
          }}
          isChina={this.props.isChina}
          onMapClick={this.props.onMapClick}
          onLocationChange={this.props.onLocationChange}
          onNamedLocationChange={this.props.onNamedLocationChange}
        />
        <div className={styles.locationData}>
          <Text
            id="addr"
            label={strings.location}
            value={addr}
            onKeyUp={this.props.onEnterPress}
            onChange={this.props.onAddrNameChange}
            className={styles.addr}
          />
          <span aria-label={strings.locate} className={styles.locate}>
            <Btn
              icon="location"
              alt
              onClick={this.props.onLocateClick}
            />
          </span>
          {this.props.hideRadius && <Text
            id="radiusKm"
            label={strings.radiusKm}
            value={radiusKm}
            disabled={!lat || !lng}
            onChange={this.props.onRadiusChanged}
            className={styles.rad}
          />}
        </div>
      </div>
    );
  }
}

export default class StoryEditLocationModal extends Component {
  static propTypes = {
    defaultLocation: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number
    }),

    isChina: PropTypes.bool,
    hideRadius: PropTypes.bool,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    hideRadius: false,
    defaultLocation: {
      lat: -33.8675,
      lng: 151.207
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      locationData: {
        addr: props.defaultLocation.addr,
        lat: props.defaultLocation.lat,
        lng: props.defaultLocation.lng,
        rad: props.defaultLocation.rad,
      },
      canSave: false
    };
    autobind(this);

    // refs
    this.editor = null;
  }

  componentDidMount() {
    this.checkSave(this.state);
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const { lat, lng } = this.state.locationData;

    if (nextState.locationData.lat !== lat || nextState.locationData.lng !== lng) {
      this.checkSave(nextState);
    }
  }

  checkSave(state) {
    const { lat, lng, rad } = state.locationData;
    let canSave = false;

    if (lat && lng && rad) {
      canSave = true;
    }

    this.setState({ canSave: canSave });
  }

  handleMapClick(event) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const rad = this.state.locationData.rad || 50000;

      const newLocation = { ...this.state.locationData,
        lat: lat,
        lng: lng,
        rad: rad
      };

      this.setState({ locationData: newLocation });
    }
  }

  handleLocationChange(data) {
    if (data && data[0] && data[0].geometry) {
      const lat = data[0].geometry.location.lat();
      const lng = data[0].geometry.location.lng();
      const rad = this.state.locationData.rad || 50000;

      const newLocation = { ...this.state.locationData,
        lat: lat,
        lng: lng,
        rad: rad
      };

      this.setState({ locationData: newLocation });
    }
  }

  handleNamedLocationChange(data) {
    if (data.length) {
      const newAddr = data[1] ? data[1].formatted_address : data[0].formatted_address;
      const newLocation = { ...this.state.locationData,
        addr: newAddr
      };

      this.setState({ locationData: newLocation });
    }
  }

  handleEnterAddr(event) {
    // On press enter find address
    if (event.which === 13 || event.keyCode === 13) {
      this.handleLocateClick();
    }
  }

  handleAddrNameChange(event) {
    // Set new location
    const newLocation = { ...this.state.locationData,
      addr: event.target.value
    };

    this.setState({ locationData: newLocation });
  }

  handleRadiusChanged(event) {
    // Circle size expanded
    if (event.radius) {
      const newRad = parseInt(event.radius.toFixed(0), 10);
      const newLocation = { ...this.state.locationData,
        rad: newRad
      };

      this.setState({ locationData: newLocation });

      // Radius input value changed
    } else if (event.target.value) {
      const newRad = parseInt(event.target.value, 10);
      if (typeof newRad === 'number') {
        const newLocation = { ...this.state.locationData,
          rad: newRad * 1000  // km => m
        };

        this.setState({ locationData: newLocation });
      }
    }
  }

  handleLocateClick() {
    const addr = this.state.locationData.addr;

    if (this.editor && this.editor.map) {
      this.editor.map.getLocationByName(addr);
    }
  }

  handleSaveClick(event) {
    // Propagate with event data
    if (typeof this.props.onSave === 'function') {
      this.props.onSave(event, this.state.locationData);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { defaultLocation, headerMessage, headerMessageInfo, isChina, onClose } = this.props;
    const styles = require('./StoryEditLocationModal.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <Modal
        escClosesModal
        isVisible
        width="large"
        headerChildren={(
          <div>
            <h3>{headerMessage || strings.addLocationRestriction}</h3>
            <p>{headerMessageInfo || strings.addLocationRestrictionInfo}</p>
          </div>
        )}
        headerCloseButton
        footerChildren={(
          <div>
            <Btn large alt onClick={onClose}>{strings.cancel}</Btn>
            <Btn large inverted disabled={!this.state.canSave} onClick={this.handleSaveClick}>{strings.save}</Btn>
          </div>
        )}
        bodyClassName={styles.StoryEditlocationModal}
        onClose={onClose}
      >
        <LocationEditor
          ref={(c) => { this.editor = c; }}
          hideRadius={this.props.hideRadius}
          styles={styles}
          defaultLocation={defaultLocation}
          isChina={isChina}
          strings={strings}
          onMapClick={this.handleMapClick}
          onLocationChange={this.handleLocationChange}
          onNamedLocationChange={this.handleNamedLocationChange}
          onAddrNameChange={this.handleAddrNameChange}
          onEnterPress={this.handleEnterAddr}
          onRadiusChanged={this.handleRadiusChanged}
          onLocateClick={this.handleLocateClick}
          {...this.state.locationData}
        />
      </Modal>
    );
  }
}
