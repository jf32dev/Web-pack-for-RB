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

import Btn from 'components/Btn/Btn';
import IconDropMenu from './IconDropMenu';

/**
 * Header for FabricEditor including drawing and attach
 */
export default class FabricHeader extends Component {
  static propTypes = {
    /**
     * callback when clicking the header menu item
     * each btn would have data-type to indicate what btn.
     */
    onClick: PropTypes.func,

    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    strings: {
      cancel: 'Cancel',
      attach: 'Attach'
    }
  };

  render() {
    const {
      className,
      style,
      strings,
      onClick
    } = this.props;
    const styles = require('./FabricHeader.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FabricHeader: true,
    }, className);

    return (
      <header className={classes} style={style}>
        <div className={styles.left}>
          <div>
            <Btn
              borderless
              onClick={onClick}
              data-type="undo"
              icon="prev"
              className={styles.fabricHistoryBtn}
            />
            <Btn
              borderless
              onClick={onClick}
              data-type="redo"
              icon="next"
              className={`${styles.fabricHistoryBtn} ${styles.fabricNext}`}
            />
            <IconDropMenu onClick={onClick} type="penColor" className={styles.dropMenu} />
            <IconDropMenu onClick={onClick} type="penSize" className={styles.dropMenu} />
          </div>
        </div>
        <div className={styles.right}>
          <Btn
            borderless
            alt
            large
            onClick={onClick}
            data-type="cancel"
          >
            {strings.cancel}
          </Btn>
          <Btn
            inverted
            large
            data-type="attach"
            onClick={onClick}
          >
            {strings.attach}
          </Btn>
        </div>
      </header>
    );
  }
}
