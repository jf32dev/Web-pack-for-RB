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
import { FormattedMessage } from 'react-intl';

import Map from 'components/Map/Map';
import Modal from 'components/Modal/Modal';

export default class StoryLocationsModal extends Component {
  static propTypes = {
    locations: PropTypes.array,
    isChina: PropTypes.bool,
    isVisible: PropTypes.bool,
    onClose: PropTypes.func
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    locations: []
  };

  renderBody() {
    const { locations, isChina } = this.props;
    const style = require('./StoryLocationsModal.less');

    return (
      <div className={style.StoryLocationsModal}>
        <Map
          apiKey={window.BTC.GOOGLEMAP_KEY}
          height={parseInt(window.innerHeight * 0.6, 10)}
          defaultCenter={{
            lat: locations[0].lat,
            lng: locations[0].lng
          }}
          markers={locations}
          isChina={isChina}
        />
      </div>
    );
  }

  render() {
    const { naming } = this.context.settings;

    return (
      <Modal
        backdropClosesModal
        escClosesModal
        isVisible={this.props.isVisible}
        width="large"
        headerCloseButton
        headerChildren={(
          <div>
            <h3>
              <FormattedMessage
                id="view-locations"
                defaultMessage="View Locations"
              />
            </h3>
            <p>
              <FormattedMessage
                id="view-locations-description"
                defaultMessage="Locations where this {story} can be opened"
                values={{ story: naming.story }}
              />
            </p>
          </div>
        )}
        footerCloseButton
        onClose={this.props.onClose}
      >
        {this.renderBody()}
      </Modal>
    );
  }
}
