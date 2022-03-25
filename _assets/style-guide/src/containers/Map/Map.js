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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import { Map } from 'components';

const MapDocs = require('!!react-docgen-loader!components/Map/Map.js');

const storyWithLocation = {
  'id': 1000853133,
  'permId': 1000329825,
  'name': 'story title',
  'thumbnail': 'https://push.bigtincan.org/files/9c36589e-5d4c-9595-f5a1-4e5fddf959b4.jpg',
  'colour': '#e202ae',
  'type': 'story',
  'badgeColour': '#de000b',
  'badgeTitle': 'Incredible Deal',
  'excerpt': 'This is an excerpt on a blendable Story',
  'isLiked': true,
  'isBookmark': true,
  'isQuicklink': false,
  'isQuickfile': true,
  'updated': 1449198182,
  'commentCount': 3,
  'fileCount': 1,
  'isProtected': true,
  'isGeoProtected': true,
  'rating': 5,
  'ratingCount': 4,
  'author': {
    'id': 124023,
    'type': 'people',
    'name': 'Testy McTestFace',
    'thumbnail': '',
    'role': '',
    'isFollowed': false
  },
  'geolocations': [
    {
      'addr': '343 George St, Sydney NSW 2000, Australia',
      'lat': -33.8675,
      'lng': 151.207,
      'rad': 50000
    },
    {
      'addr': 'Boston',
      'lat': 42.3601,
      'lng': -71.0589,
      'rad': 100000
    }
  ]
};

export default class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: null,
      geolocation: storyWithLocation.geolocations[0]
    };

    autobind(this);
  }

  handleMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.setState({
      geolocation: { ...this.state.geolocation,
        lat: lat,
        lng: lng
      }
    });
  }

  handleNamedLocationChange(event) {
    this.setState({
      geolocation: { ...this.state.geolocation,
        addr: event[1].formatted_address
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

  render() {
    const { geolocation } = this.state;

    return (
      <section id="MapView">
        <h1>Map</h1>
        <Docs {...MapDocs} />

        <Debug>
          <div>
            <p>addr: {geolocation.addr}</p>
            <p>lat: {geolocation.lat}, lng: {geolocation.lng}, rad: {geolocation.rad}</p>
          </div>
        </Debug>

        <ComponentItem>
          <Map
            ref="map"
            height={450}
            markerOptions={{
              onDragend: this.handleMarkerDragEnd
            }}
            circleOptions={{
              editable: true,
              onRadiusChanged: this.handleRadiusChanged
            }}
            defaultCenter={{
              lat: geolocation.lat,
              lng: geolocation.lng
            }}
            markers={[geolocation]}
            onMapClick={this.handleMapClick}
            onNamedLocationChange={this.handleNamedLocationChange}
          />
        </ComponentItem>
      </section>
    );
  }
}
