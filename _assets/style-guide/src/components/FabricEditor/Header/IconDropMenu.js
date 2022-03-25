
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

import DropMenu from 'components/DropMenu/DropMenu';

/**
 * only accept four type of icon drop menu and only for FabricEditor
 */
export default class IconDropMenu extends Component {
  static propTypes = {
    /*
    * penColor: change the color of the drawing pen
    * penSize: change the line width when using pen to draw something
    * fontColor: change the selected words' color
    * fontBackGround: change the selected words' background color
    * */
    type: PropTypes.oneOf(['none', 'penColor', 'penSize', 'fontColor', 'fontBackGround']),

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    type: 'none',
  };

  constructor(props) {
    super(props);

    let select = '#222222';
    if (props.type === 'fontColor' || props.type === 'fontBackGround') {
      select = '#8fd646';
    } else if (props.type === 'penSize') {
      select = 10;
    }

    this.state = {
      select,
    };
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    if (href) {
      this.setState({ select: href });
    }
    this.props.onClick(event);
  }

  render() {
    const {
      style,
      type,
      ...others
    } = this.props;

    const { select } = this.state;
    /** class */
    const styles = require('./IconDropMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      iconDropMenu: (select === '#ffffff') && type === 'penColor'
    }, this.props.className);

    const fontEditClasses = cx({
      fontEdit: true,
      underline: type === 'fontColor'
    }, this.props.className);
    //different color
    const colors = ['#000000', '#222222', '#777777', '#ffffff',
      '#f13464', '#f1272e', '#fc772f', '#fdd63b',
      '#8fd646', '#31d496', '#33a1d7', '#7443d8'];
    //different line width
    const penSizes = [25, 17, 10, 4];
    const isColor = ['penColor', 'fontColor', 'fontBackGround'].indexOf(type) > -1;
    const isFontEdit = ['fontColor', 'fontBackGround'].indexOf(type) > -1;

    let icon = '';
    if (type === 'penSize') {
      icon = 'paintbrush';
    } else if (type === 'penColor') {
      icon = 'circle-fill';
    }

    const fontEditStyle = {
      backgroundColor: type === 'fontBackGround' && select,
      borderColor: type === 'fontColor' && select
    };

    let whiteColorBorder = {};

    if (type === 'penColor' && select === '#ffffff') {
      whiteColorBorder = {
        border: '0.5px solid #d2d2d2',
        borderRadius: 24,
      };
    }

    delete others.onClick;

    return (
      <DropMenu
        icon={icon}
        position={{
          left: isColor ? '50%' : 0,
          transform: isColor && 'translate(-50%, -50%)',
          right: 0,
          width: isColor ? 165 : 60,
          height: isColor && 124,
          marginTop: isColor && 60,
          minWidth: 'initial'
        }}
        style={{ display: 'inline-block', textAlign: 'center', ...whiteColorBorder, ...style }}
        iconColour={type === 'penColor' ? select : ''}
        heading={isFontEdit ? <div style={fontEditStyle} className={fontEditClasses}>A</div> : ''}
        className={classes}
        {...others}
      >
        {isColor && <div className={styles.iconList}>
          {colors.map((colorCode, index) => {
            let colorClass = colorCode === select ? styles.iconActive : styles.icon;
            if (colorCode === '#ffffff') {
              colorClass = select === '#ffffff' ? styles.iconWhiteActive : styles.iconWhite;
            }
            return (<a
              href={colorCode} key={index} onClick={this.handleClick}
              data-type={type}
            >
              <div className={colorClass} style={{ color: colorCode }} />
            </a>);
          })}
        </div>}
        {type === 'penSize' &&
          penSizes.map((size, index) =>
            (<a
              href={size} key={index} onClick={this.handleClick}
              data-type={type}
            >
              <div className={size.toString() === select.toString() ? styles.fontIconActive : styles.fontIcon}>
                <div className={styles.fontIconInner} style={{ width: size, height: size, borderRadius: size }} />
              </div>
            </a>)
          )}
      </DropMenu>
    );
  }
}
