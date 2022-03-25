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

import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';

import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import DragItemList from './DragItemList';
import DomainControllerItem from './DomainControllerItem';

/**
 * ActiveForestItem description
 */
export default class ActiveForestItem extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    dragIcon: PropTypes.object,

    /** Description of customProp2 */
    domains: PropTypes.array,

    itemIndex: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    serviceAccount: PropTypes.string,

    forestName: PropTypes.string,

    serviceAccountPassword: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    customProp2: [],
    serviceAccount: '',
    forestName: '',
    serviceAccountPassword: '',
  };

  constructor(props) {
    super(props);
    this.state = {};

    this.handleChangeDebounce = _compose(
      _debounce(props.onChange.bind(this), 300),
      _clone
    );

    autobind(this);
  }

  render() {
    const {
      strings,
      // dataName,
      dragIcon,
      // id,
      // text,
      domains,
      itemIndex,
      serviceAccount,
      forestName,
      serviceAccountPassword,
      onChange,
    } = this.props;
    const styles = require('./ActiveForestItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ActiveForestItem: true
    }, this.props.className);

    return (
      <div
        className={classes} style={this.props.style} onMouseEnter={onChange}
        data-action="mouseEnter" data-index={itemIndex}
      >
        <div className={styles.menuHeader}>
          {dragIcon}
          <Btn warning data-action="deleteActiveForest" onClick={onChange}>{strings.delete}</Btn>
        </div>
        <div className={styles.body}>
          <div>
            <Text
              className={styles.ActiveForestItemText}
              onChange={this.handleChangeDebounce}
              data-id="forestName"
              data-name="activeForest"
              id={'forestName-' + itemIndex}
              defaultValue={forestName}
              label={strings.forestName}
            />
          </div>
          <div>
            <Text
              className={styles.ActiveForestItemText}
              onChange={this.handleChangeDebounce}
              id={'serviceAccount-' + itemIndex}
              label={strings.serviceAccount}
              data-id="serviceAccount"
              data-name="activeForest"
              defaultValue={serviceAccount}
            />
            <Text
              type="password"
              className={styles.ActiveForestItemText}
              onChange={this.handleChangeDebounce}
              id={'serviceAccountPassword-' + itemIndex}
              data-id="serviceAccountPassword"
              data-name="activeForest"
              defaultValue={serviceAccountPassword}
              label={strings.serviceAccountPassword}
            />
          </div>
          <DragItemList
            strings={strings}
            icon="dot-handle"
            iconClassName={styles.iconClassName}
            isSortingClasses={styles.DomainControllerSorting}
            onOrderChange={onChange}
            list={domains}
            item={<DomainControllerItem name="DomainControllerItem" strings={strings} onChange={onChange} />}
          />
          <div onClick={onChange} data-action="addDomainController" className={styles.add}>{strings.addDomainController}</div>
        </div>
      </div>
    );
  }
}
