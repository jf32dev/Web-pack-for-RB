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

/**
 * show the denylist and allowlist
 */
export default class RestrictionsList extends PureComponent {
  static propTypes = {
    /** Add btn description label under the list */
    addBtnLabel: PropTypes.string,

    /** Description of customProp2 */
    list: PropTypes.array,

    /** title of the list */
    title: PropTypes.string,

    type: PropTypes.string,

    /** use the dataset.action to ask parent to show different modal */
    onClick: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: []
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  render() {
    const styles = require('./RestrictionsList.less');
    const { title, list, className, strings, onClick, addBtnLabel, type } = this.props;
    const cx = classNames.bind(styles);
    const classes = cx({
      RestrictionsList: true
    }, className);

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.title}>{title}</div>
        {list.length > 0 && list.map(item => (
          <div key={item.id} className={styles.item}>
            <div>{item.name}</div>
            <div>
              <Btn
                onClick={onClick} inverted data-id={item.id}
                data-name="restrictionsList" data-action="isRestrictionsVisible"
              >
                {strings.edit}
              </Btn>
              <Btn
                onClick={onClick} warning data-id={item.id}
                data-name="restrictionsList" data-action="isDeleteVisible"
              >
                {strings.delete}
              </Btn>
            </div>
          </div>
        ))}
        <div
          className={styles.add}
          data-name="restrictionsList"
          data-action="isRestrictionsVisible"
          data-type={type}
          onClick={onClick}
        >
          {addBtnLabel}
        </div>
      </div>
    );
  }
}
