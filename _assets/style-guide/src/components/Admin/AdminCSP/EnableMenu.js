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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';
import Checkbox from 'components/Checkbox/Checkbox';

/**
 * Displayed in <code>ShareModal</code>
 */
export default class EnableMenu extends Component {
  static propTypes = {
    strings: PropTypes.object,

    checkboxList: PropTypes.array,

    value: PropTypes.object,

    onClick: PropTypes.func.isRequired,

    style: PropTypes.object
  }

  static defaultProps = {
    value: {
      apiCalls: false,
      images: false,
      media: false,
      forms: false,
      scripts: false,
      stylesheets: false,
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleChange(event) {
    event.stopPropagation();
    const { dataset } = event.currentTarget;
    if (typeof this.props.onClick === 'function') {
      this.props.onClick({
        id: dataset.id,
        [event.target.name]: event.target.checked,
      });
    }
  }

  handleMenuClick(event) {
    event.stopPropagation();
  }

  render() {
    const {
      strings,
      checkboxList,
      disabled,
      value
    } = this.props;
    const styles = require('./EnableMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      enableMenu: true
    }, this.props.className);

    const headingElem = (
      <Btn
        borderless alt large
        disabled={disabled} className={styles.button}
      >{strings.allow}</Btn>
    );

    return (
      <DropMenu
        id="share-menu" className={classes} heading={headingElem}
        disabled={disabled}
      >
        <div className={styles.ShareMenu}>
          <Btn borderless large className={styles.button}>{strings.allow}</Btn>
          <ul className={styles.linkList} onClick={this.handleMenuClick}>
            {checkboxList.length > 0 && checkboxList.map(item => (
              <li key={item}>
                <label htmlFor={`${item}-${this.props['data-id']}`}>{strings[item] || item}</label>
                <Checkbox
                  inputId={`${item}-${this.props['data-id']}`}
                  name={item}
                  data-id={this.props['data-id']}
                  value={item}
                  checked={value[item]}
                  onChange={this.handleChange}
                />
              </li>
            ))}
          </ul>
        </div>
      </DropMenu>
    );
  }
}
