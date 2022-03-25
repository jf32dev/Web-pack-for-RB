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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';

const messages = defineMessages({
  locations: { id: 'locations', defaultMessage: 'Locations' },
  noLocationsMessage: { id: 'no-locations-message', defaultMessage: 'There are currently no Location restrictions for this {story}' },
  addLocation: { id: 'add-location', defaultMessage: 'Add Location' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  confirmDeleteLocationMessage: { id: 'confirm-delete-locations-message', defaultMessage: 'Are you sure you want to delete this location?' },
});

class LocationEditItem extends PureComponent {
  static propTypes = {
    addr: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    rad: PropTypes.number,

    readonly: PropTypes.bool,

    strings: PropTypes.object,

    onDeleteClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { confirmDelete: false };

    autobind(this);
  }

  handleDeleteClick() {
    this.setState({ confirmDelete: true });
  }

  handleCancelDelete() {
    this.setState({ confirmDelete: false });
  }

  handleConfirmDelete(event) {
    // Propagate event with location index
    if (typeof this.props.onDeleteClick === 'function') {
      this.props.onDeleteClick(event, this.props.index);
    }
  }

  render() {
    const { addr, rad, readonly, strings, styles } = this.props;
    const { confirmDelete } = this.state;
    const radiusLabel = rad / 1000 + ' km radius';

    return (
      <div className={styles.LocationEditItem}>
        <TransitionGroup>
          {confirmDelete && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={styles.confirmDelete}>
              <p>{strings.confirmDeleteLocationMessage}</p>
              <ul>
                <li><Btn small alt onClick={this.handleCancelDelete}>{strings.cancel}</Btn></li>
                <li><Btn small inverted onClick={this.handleConfirmDelete}>{strings.delete}</Btn></li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
        <span className={styles.thumbnail} />
        <div className={styles.locationWrapper}>
          <span className={styles.addr}>{addr}</span>
          <span className={styles.rad}>{radiusLabel}</span>
        </div>

        {!readonly && <div className={styles.actions}>
          <Btn warning onClick={this.handleDeleteClick}>{strings.delete}</Btn>
        </div>}
      </div>
    );
  }
}

export default class StoryEditLocations extends PureComponent {
  static propTypes = {
    geolocations: PropTypes.array,

    readonly: PropTypes.bool,

    onAddClick: PropTypes.func.isRequired,
    onItemDeleteClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    geolocations: []
  };

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { geolocations, readonly } = this.props;
    const hasLocations = geolocations.length > 0;
    const styles = require('./StoryEditLocations.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <div className={styles.StoryEditLocations}>
        <div className={styles.locationsWrapper}>
          {!hasLocations && <Blankslate
            icon="location"
            iconSize={96}
            heading={strings.locations}
            message={strings.noLocationsMessage}
            inline
          >
            <Btn inverted onClick={this.props.onAddClick}>
              {strings.addLocation}
            </Btn>
          </Blankslate>}
          {hasLocations && geolocations.map((location, index) =>
            (<LocationEditItem
              key={location.lat + location.lng + index}
              index={index}
              readonly={readonly}
              strings={strings}
              styles={styles}
              onDeleteClick={this.props.onItemDeleteClick}
              {...location}
            />)
          )}
          {(hasLocations && !readonly) && <Btn inverted onClick={this.props.onAddClick}>
            {strings.addLocation}
          </Btn>}
        </div>
      </div>
    );
  }
}
