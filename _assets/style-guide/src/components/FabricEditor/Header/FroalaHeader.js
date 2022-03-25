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
import DropMenu from 'components/DropMenu/DropMenu';
import Btn from 'components/Btn/Btn';
import autobind from 'class-autobind';
import IconDropMenu from './IconDropMenu';

/**
 * Displays various Viewer File controls and toggles docking mode.
 */
export default class FroalaHeader extends Component {
  static propTypes = {
    /* callback when click the close btn on the left */
    onCloseClick: PropTypes.func,

    /** Handle clicking on a header item (pages/toc etc.) */
    onItemClick: PropTypes.func.isRequired,

    /* children element would be put in the right side of the header */
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),

    isSafari: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object,
    strings: PropTypes.object,
  };

  static defaultProps = {
    isSafari: false,
    strings: {
      close: 'Close',
      font: 'Font',
      size: 'Size'
    }
  };

  constructor(props) {
    super(props);

    const btnType = {
      SELECT: 'select',
      NONE: 'none',
      DROPDOWN: 'dropDown',
    };

    this.state = {
      Font: ''
    };

    this.centerBtns = [
      {
        Font: btnType.SELECT,
      }, {
        Size: btnType.SELECT,
      }, {
        bold: btnType.NONE,
        italic: btnType.NONE,
        underline: btnType.NONE,
      }, {
        fontColor: btnType.DROPDOWN,
        fontBackGround: btnType.DROPDOWN,
      }, {
        'align-left': btnType.NONE,
        'align-center': btnType.NONE,
        'align-right': btnType.NONE,
        'align-justify': btnType.NONE,
      }, {
        'list-ol': btnType.NONE,
        'list-ul': btnType.NONE,
      }, {
        outdent: btnType.NONE,
        indent: btnType.NONE,
      }, {
        link: btnType.NONE,
      }];

    this.fontFamilies = ['Open Sans', 'Arial MT', 'Courier New', 'Georgia', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
    this.fontSizes = [4, 8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96];

    autobind(this);
  }

  handleBtnClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const type = e.currentTarget.dataset.type;

    let method = 'html.cleanEmptyTags';
    let value = href;

    if (href === type && href.indexOf('align-') < 0 && href.indexOf('list-') < 0) {
      method = `commands.${type}`;
      value = '';
    } else if (href === type && href.indexOf('align-') > -1) {
      method = 'align.apply';
      value = type.replace('align-', '');
    } else if (href === type && href.indexOf('list-') > -1) {
      method = 'lists.format';
      value = type.replace('list-', '').toUpperCase();
    } else if (type === 'Font') {
      method = 'fontFamily.apply';
      value = href;
      this.setState({
        Font: href,
      });
    } else if (type === 'Size') {
      method = 'fontSize.apply';
      value = `${href}px`;
      /*
      this.setState({
        Size: href,
      });
      */
    } else if (type === 'fontColor') {
      method = 'colors.text';
      value = href;
    } else if (type === 'fontBackGround') {
      method = 'colors.background';
      value = href;
    }

    return this.props.onItemClick(e, method, value);
  }

  render() {
    const {
      onCloseClick,
      className,
      style,
      isSafari,
      strings,
      children
    } = this.props;
    const {
      Font
    } = this.state;
    const styles = require('./FroalaHeader.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ViewerHeader: true,
    }, className);

    return (
      <header className={classes} style={style}>
        <div className={styles.left}>
          <span className={styles.close} onClick={onCloseClick}>{strings.close}</span>
        </div>
        <div className={styles.center}>
          {this.centerBtns.map((obj, index) => (<div
            className={`${Object.values(obj)[0] === 'select' ? styles.itemBorderLess : styles.itemBorder}`}
            key={index}
          >
            {Object.keys(obj).map((key) => {
              if (obj[key] === 'none') {
                return (<Btn
                  key={key}
                  borderless
                  data-type={key}
                  style={{ marginLeft: 0 }}
                  className={styles[`icon-${key}`]}
                  href={key}
                  onClick={this.handleBtnClick}
                />);
              } else if (obj[key] === 'select' && !isSafari) {
                return (<DropMenu
                  key={key}
                  heading={key === 'Font' ? strings.font || key : strings.size || key}
                  button
                  className={`${styles['center' + key]} ${styles.centerDropdown}`}
                  position={{ left: 0, right: 0, minWidth: 'initial', width: 'initial' }}
                  style={{ fontFamily: (key === 'Font') && Font ? Font : 'initial' }}
                >
                  <ul>
                    {key === 'Font' && this.fontFamilies.map((fontFamily) =>
                      (<a
                        href={fontFamily}
                        key={fontFamily}
                        className={styles.dropdownItem}
                        onClick={this.handleBtnClick}
                        data-type={key}
                      >
                        <li style={{ fontFamily }}>{fontFamily}</li>
                      </a>)
                    )}
                    {key === 'Size' && this.fontSizes.map((fontSize) =>
                      (<a
                        href={fontSize}
                        key={fontSize}
                        className={styles.dropdownItem}
                        onClick={this.handleBtnClick}
                        data-type={key}
                      >
                        <li>{fontSize}</li>
                      </a>)
                    )}
                  </ul>
                </DropMenu>);
              } else if (obj[key] === 'dropDown') {
                return (<IconDropMenu
                  type={key}
                  key={key}
                  onClick={this.handleBtnClick}
                  className={styles.centerIconDropMenu}
                />);
              }
              return null;
            })}
          </div>))}
        </div>
        <div className={styles.right}>
          {children}
        </div>
      </header>
    );
  }
}
