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
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Btn from 'components/Btn/Btn';

export default class FabricToolbar extends PureComponent {
  static propTypes = {
    onItemClick: PropTypes.func,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      done: 'Done',
      undo: 'Undo',
      redo: 'Redo',
      drawingMode: 'Drawing Mode',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      select: '#d0011b',
    };

    // this.colors = ['#d0011b', '#7ed321', '#4990e2'];
    this.colors = ['red', 'green', 'blue'];
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;
    this.setState({
      select: type.replace('color-', '')
    });

    if (this.props.onClick && typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  }

  render() {
    const {
      onClick,
      strings,
      className,
      style
    } = this.props;

    const {
      select
    } = this.state;

    const styles = require('./FabricToolbar.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FabricToolbar: true,
    }, className);

    return (
      <div className={classes} style={style}>
        <div className={styles.left}>
          <Btn
            borderless className={styles.btn} data-type="done"
            onClick={onClick}
          >Done</Btn>
          {this.colors.map(color =>
            (<div
              key={color}
              data-type={`color-${color}`}
              className={`${styles[color]} ${select === color ? styles.activeColor : ''}`}
              onClick={this.handleClick}
            />))}
        </div>
        <div className={styles.fullHeight}>
          {strings.drawingMode}
        </div>
        <div className={styles.right}>
          <Btn
            icon="trash" borderless data-type="trash"
            className={styles.btnTrash} onClick={onClick}
          />
        </div>
      </div>
    );
  }
}
