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

import _flowRight from 'lodash/flowRight';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { GoogleMap, Circle, Marker, withScriptjs, withGoogleMap } from 'react-google-maps';

import Loader from 'components/Loader/Loader';

const AsyncGoogleMap = _flowRight(
  withScriptjs,
  withGoogleMap,
)(props => props.googleMapElement);

/**
 * This is a wrapper for <a href='https://github.com/tomchentw/react-google-maps'>react-google-maps</a>. Please refer to the repository for all available options
 */
export default class Map extends Component {
  static propTypes = {
    apiKey: PropTypes.string,

    defaultZoom: PropTypes.number,

    /** defaults to Sydney, Australia */
    defaultCenter: PropTypes.object,
    height: PropTypes.number.isRequired,

    /** story geolocation objects */
    markers: PropTypes.array,

    /** Props applied to <Marker /> */
    markerOptions: PropTypes.object,

    /** Props applied to <Circle /> */
    circleOptions: PropTypes.object,

    /** Loads google.cn maps */
    isChina: PropTypes.bool,

    onMapClick: PropTypes.func,
    onLocationChange: PropTypes.func,
    onNamedLocationChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    apiKey: 'AIzaSyC5PI8HGU7ertD6cMUxZPN8v1FffRwVBLM',
    defaultZoom: 7,
    defaultCenter: { lat: -33.8675, lng: 151.207 },
    markers: [],
    markerOptions: {},
    circleOptions: {},
    isChina: false
  };

  constructor(props) {
    super(props);
    const self = this;

    this.getNamedLocation = this.getNamedLocation.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);

    // onRadiusChange for Circle applies to event to 'this'
    // workaround to pass 'this' as 'event' to listener
    this.handleInternalRadiusChanged = function() {
      self.handleRadiusChanged(this);
    };
  }

  getNamedLocation(latLng) {
    const { onNamedLocationChange } = this.props;

    // We use geocoder for location names
    if (!this.geocoder) {
      this.geocoder = new window.google.maps.Geocoder();
    }

    this.geocoder.geocode({ 'latLng': latLng }, response => {
      if (response && typeof onNamedLocationChange === 'function') {
        onNamedLocationChange(response);
      }
    });
  }

  getLocationByName(address) {
    const { onLocationChange } = this.props;

    // We use geocoder for location names
    if (!this.geocoder) {
      this.geocoder = new window.google.maps.Geocoder();
    }

    this.geocoder.geocode({ address: address }, response => {
      if (response && typeof onLocationChange === 'function') {
        onLocationChange(response);
      }
    });
  }

  handleMapClick(event) {
    const { onMapClick, onNamedLocationChange } = this.props;

    // Get named location
    if (typeof onNamedLocationChange === 'function') {
      this.getNamedLocation(event.latLng);
    }

    // Propagate click event
    if (typeof onMapClick === 'function') {
      onMapClick(event);
    }
  }

  handleRadiusChanged(event) {
    const { circleOptions } = this.props;

    // Propagate event
    if (typeof circleOptions.onRadiusChanged === 'function') {
      circleOptions.onRadiusChanged(event);
    }
  }

  render() {
    const { apiKey, height, markers, isChina } = this.props;
    const styles = require('./Map.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Map: true
    }, this.props.className);

    // Alternate google maps URL for China
    // https://developers.google.com/maps/faq?hl=en#china_ws_access
    const protocol = isChina ? 'http' : 'https';
    const hostname = isChina ? 'maps.google.cn' : 'maps.googleapis.com';

    const contents = markers.map((marker, index) => ([
      <Marker
        key={'marker-' + index}
        position={{ lat: marker.lat, lng: marker.lng }}
        defaultAnimation={2}
        {...this.props.markerOptions}
      />, marker.rad &&
      <Circle
        key={'circle-' + index}
        center={{ lat: marker.lat, lng: marker.lng }}
        radius={marker.rad}
        options={{
          fillColor: 'red',
          fillOpacity: 0.20,
          strokeColor: 'red',
          strokeOpacity: 1,
          strokeWeight: 1,
        }}
        {...this.props.circleOptions}
        onRadiusChanged={this.handleInternalRadiusChanged}
      />  // eslint-disable-line
    ]));

    return (
      <div className={classes} style={this.props.style}>
        <AsyncGoogleMap
          googleMapURL={`${protocol}://${hostname}/maps/api/js?v=3.exp&libraries=geometry,places&key=${apiKey}`}
          loadingElement={
            <div className={styles.loaderWrapper} style={{ height: height }}>
              <Loader type="content" />
            </div>
          }
          containerElement={
            <div style={{ height: height }} />
          }
          mapElement={
            <div style={{ height: height }} />
          }
          googleMapElement={
            <GoogleMap
              defaultZoom={this.props.defaultZoom}
              defaultCenter={this.props.defaultCenter}
              onClick={this.handleMapClick}
              center={markers.length > 0 && markers[0]}
            >
              {contents}
            </GoogleMap>
          }
        />
      </div>
    );
  }
}
