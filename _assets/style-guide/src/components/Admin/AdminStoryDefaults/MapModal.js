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

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Map from 'components/Map/Map';
import Text from 'components/Text/Text';

/**
 * map modal
 */
export default class MapModal extends PureComponent {
  static propTypes = {
    /** Google Map API Key */
    apiKey: PropTypes.string,

    /** title of the component */
    title: PropTypes.string,

    /** list data of the devices */
    list: PropTypes.array,

    /** modal close or cancel event */
    onClose: PropTypes.func,

    /** call back method to return the updated list */
    onConfirm: PropTypes.func,

    /** display modal */
    isVisible: PropTypes.bool,

    /** China */
    isChina: PropTypes.bool,

    /** geo location obj */
    geolocation: PropTypes.object,

    onNamedLocationChange: PropTypes.func,

    onMapClick: PropTypes.func,

    onRadiusChanged: PropTypes.func,

    /** text input change */
    onChange: PropTypes.func,

    /** add event */
    onAdd: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      location: 'Location',
      addLocation: 'Add Location',
      radiusKm: 'Radius(km)',
      cancel: 'Cancel',
      add: 'Add',
      locationInfo: 'Locations where this Story can be opened',
    },
    geolocation: {
      'addr': '343 George St, Sydney NSW 2000, Australia',
      'lat': -33.8675,
      'lng': 151.207,
      'rad': 50000
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const styles = require('./MapModal.less');
    const {
      isVisible,
      onClose,
      strings,
      geolocation,
      onNamedLocationChange,
      onMapClick,
      onRadiusChanged,
      onChange,
      onAdd,
      isChina,
    } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      DeviceModal: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        headerTitle={strings.addLocation}
        onClose={onClose}
        headerChildren={<div className={styles.subTitle}>{strings.locationInfo}</div>}
        footerChildren={(<div>
          <Btn
            alt large onClick={onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={onAdd}
            data-action="confirm" data-name="device" style={{ marginLeft: '0.5rem' }}
          >
            {strings.add}
          </Btn>
        </div>)}
      >
        <div className={classes}>
          <Map
            apiKey={this.props.apiKey}
            height={450}
            circleOptions={{
              editable: true,
              onRadiusChanged: onRadiusChanged
            }}
            defaultCenter={{
              lat: geolocation.lat,
              lng: geolocation.lng
            }}
            markers={[geolocation]}
            onMapClick={onMapClick}
            isChina={isChina}
            onNamedLocationChange={onNamedLocationChange}
          />
          <div className={styles.textBoxs}>
            <Text
              className={styles.locationText} onChange={onChange} label={strings.location}
              id="location" value={geolocation.addr} disabled
            />
            <Text
              label={strings.radiusKm} onChange={onChange} id="radiusKm"
              value={geolocation.rad} disabled
            />
          </div>
        </div>
      </Modal>
    );
  }
}
