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
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Btn from 'components/Btn/Btn';
import Radio from 'components/Radio/Radio';

class ChannelEditItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    alias: PropTypes.bool,

    allowMultiple: PropTypes.bool,
    readonly: PropTypes.bool,
    authString: PropTypes.string,

    onPrimaryChange: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    authString: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handlePrimaryChange(event) {
    // Propagate with channelId
    if (typeof this.props.onPrimaryChange === 'function') {
      this.props.onPrimaryChange(event, this.props.id);
    }
  }

  handleDeleteClick(event) {
    // Removing primary Channel?
    const isPrimary = this.props.alias === false;

    // Propagate with channelId
    if (typeof this.props.onDeleteClick === 'function') {
      this.props.onDeleteClick(event, this.props.id, isPrimary);
    }
  }

  render() {
    const { id, name, thumbnail, alias, allowMultiple, readonly, authString, strings, styles } = this.props;

    const thumbStyle = {
      backgroundColor: !thumbnail ? this.props.colour : false,
      backgroundImage: thumbnail ? 'url(' + thumbnail + authString + ')' : false
    };

    return (
      <div className={styles.ChannelEditItem}>
        <div className={styles.thumbnail} style={thumbStyle} />
        <span className={styles.name}>{name}</span>
        {allowMultiple && <Radio
          name="channels"
          checked={alias === false}
          value={id}
          disabled={readonly}
          className={styles.primary}
          onChange={this.handlePrimaryChange}
        />}
        {!readonly && <div className={styles.actions}>
          <Btn warning onClick={this.handleDeleteClick}>{strings.delete}</Btn>
        </div>}
      </div>
    );
  }
}

/**
 * Used by StoryEditDetails
 */
export default class StoryEditChannels extends Component {
  static propTypes = {
    channels: PropTypes.array,
    allowMultiple: PropTypes.bool,

    strings: PropTypes.object,
    authString: PropTypes.string,

    onAddChannelClick: PropTypes.func,
    onPrimaryChannelChange: PropTypes.func,
    onDeleteChannelClick: PropTypes.func
  };

  static defaultProps = {
    channels: [],
    strings: {
      channel: 'Channel',
      primary: 'Primary',
      addChannel: 'Add Channel',
      selectChannel: 'Select Channel',
      delete: 'Delete'
    }
  };

  render() {
    const {
      channels,
      allowMultiple,
      readonly,
      strings,
      onAddChannelClick,
      onPrimaryChannelChange,
      onDeleteChannelClick
    } = this.props;
    const styles = require('./StoryEditChannels.less');

    return (
      <div id="story-edit-channels" className={styles.StoryEditChannels}>
        <header>
          <h4 className={!channels.length ? styles.noChannels : null}>{strings.channel}</h4>
          {channels.length > 0 && allowMultiple && <h5>{strings.primary}</h5>}
          {!channels.length && <Btn data-id="select-channel" inverted onClick={onAddChannelClick}>
            {strings.selectChannel}
          </Btn>}
        </header>
        <TransitionGroup className={styles.channelWrapper}>
          {channels.map(c => (<CSSTransition
            key={c.id}
            classNames="fade"
            timeout={250}
            leave={false}
          >
            <ChannelEditItem
              {...c}
              allowMultiple={allowMultiple}
              readonly={readonly}
              authString={this.props.authString}
              onPrimaryChange={onPrimaryChannelChange}
              onDeleteClick={onDeleteChannelClick}
              strings={strings}
              styles={styles}
            />
          </CSSTransition>))}
        </TransitionGroup>
        {(channels.length > 0 && !readonly) && <Btn data-id="add-channel" inverted onClick={onAddChannelClick}>
          {allowMultiple ? strings.addChannel : strings.selectChannel}
        </Btn>}
      </div>
    );
  }
}
