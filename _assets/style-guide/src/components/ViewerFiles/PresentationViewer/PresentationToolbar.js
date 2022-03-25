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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';
import moment from 'moment';

import FabricToolbar from './FabricToolbar';

const ToolbarItem = (props) => {
  const {
    styles,
    strings,
    item,
    isBroadcastActive,
    isNoteActive,
    isAnnotateActive,
    isDocPagesActive,
    isEyeActive,
    onClick,
  } = props;
  const isItemActive = (item === 'broadcast' && isBroadcastActive)
    || (item === 'note' && isNoteActive)
    || (item === 'annotate' && isAnnotateActive)
    || (item === 'docPages' && isDocPagesActive)
    || (item === 'eye' && isEyeActive);

  return (
    <div className={styles.toolBarItem}>
      <div
        className={styles[`item-${isItemActive ? item + '-active' : item}`]}
        data-type={item}
        onClick={onClick}
      >
        { item === 'close' ? strings.exit : ''}
      </div>
    </div>
  );
};

export default class PresentationToolbar extends Component {
  static propTypes = {
    onItemClick: PropTypes.func,
    onFabricClick: PropTypes.func,
    time: PropTypes.string,

    isBroadcastActive: PropTypes.bool,
    isAnnotateActive: PropTypes.bool,
    isNoteActive: PropTypes.bool,
    isDocPagesActive: PropTypes.bool,

    allowHideSlide: PropTypes.bool,
    allowLiveBroadcast: PropTypes.bool,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    isBroadcastActive: false,
    isNoteActive: false,
    allowHideSlide: false,
    allowLiveBroadcast: false,
    time: 'time',
    clients: [],
    strings: {
      exit: 'Exit',
      timeResetMessage: 'Click to reset timer',
      done: 'Done',
      undo: 'Undo',
      redo: 'Redo',
      drawingMode: 'Drawing Mode',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      time: 0
    };

    this.counter = null;

    autobind(this);
  }

  componentDidMount() {
    if (!this.counter) {
      this.counter = window.setInterval(() => {
        this.setState({
          time: this.state.time + 1
        });
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.counter);
    this.counter = null;
  }

  handleTimerEvent(event) {
    if (event.type === 'mouseover' || event.type === 'mouseout') {
      const { currentTarget } = event;
      currentTarget.getElementsByTagName('span')[0].style.display = event.type === 'mouseover' ? 'block' : 'none';
    } else if (event.type === 'click') {
      clearInterval(this.counter);
      this.setState({
        time: 0,
      });
      this.counter = window.setInterval(() => {
        this.setState({
          time: this.state.time + 1
        });
      }, 1000);
    }
  }

  render() {
    const {
      onItemClick,
      onFabricClick,
      isBroadcastActive,
      isNoteActive,
      isAnnotateActive,
      isEyeActive,
      isDocPagesActive,
      allowLiveBroadcast,
      allowHideSlide,
      strings,
      className,
      style
    } = this.props;

    const {
      time,
    } = this.state;
    const styles = require('./PresentationToolbar.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PresentationToolbar: true,
    }, className);

    const containerClass = cx({
      background: true,
      blackBackground: !isAnnotateActive,
    }, className);

    const leftClass = cx({
      leftItems: true,
      blackBackground: isAnnotateActive,
    }, className);

    const rightClass = cx({
      rightItems: true,
      blackBackground: isAnnotateActive,
    }, className);

    const centerClass = cx({
      centerItems: true,
      blackBackground: isAnnotateActive,
      centerAnnotate: isAnnotateActive,
      centerNormal: !isAnnotateActive,
    }, className);

    const leftItems = allowHideSlide ? ['close', 'docPages', 'annotate', 'eye'] : ['close', 'docPages', 'annotate'];
    const rightItems = allowLiveBroadcast ? ['broadcast', 'note'] : ['note'];

    return (
      <div className={classes} style={style}>
        <div className={containerClass}>
          <div className={leftClass}>
            {leftItems.map(item =>
              (<ToolbarItem
                styles={styles}
                item={item}
                key={item}
                isDocPagesActive={isDocPagesActive}
                isAnnotateActive={isAnnotateActive}
                isEyeActive={isEyeActive}
                strings={strings}
                onClick={onItemClick}
              />))}
          </div>
          {!isAnnotateActive && <div
            className={centerClass}
            onMouseOver={this.handleTimerEvent}
            onMouseOut={this.handleTimerEvent}
            onClick={this.handleTimerEvent}
          >
            {moment.utc(moment.duration(time * 1000).asMilliseconds()).format('HH:mm:ss')}
            <span>{strings.timeResetMessage}</span>
          </div>}
          {isAnnotateActive &&
          <div className={centerClass}>
            <FabricToolbar onClick={onFabricClick} />
          </div>}
          <div className={rightClass}>
            {rightItems.map(item =>
              (<ToolbarItem
                styles={styles}
                item={item}
                key={item}
                isBroadcastActive={isBroadcastActive}
                isNoteActive={isNoteActive}
                onClick={onItemClick}
                strings={strings}
              />)
            )}
          </div>
        </div>
      </div>
    );
  }
}
