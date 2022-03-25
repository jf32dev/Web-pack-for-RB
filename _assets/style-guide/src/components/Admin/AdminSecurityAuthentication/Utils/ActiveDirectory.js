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

import Checkbox from 'components/Checkbox/Checkbox';
import DragItemList from './DragItemList';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import ActiveForestItem from './ActiveForestItem';

/**
 * ActiveDirectory description
 */
export default class ActiveDirectory extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    port: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    /** Description of customProp2 */
    list: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: [{ domainController: [{}] }],
    activeForest: 1,
  };

  constructor(props) {
    super(props);

    this.checkboxs = ['manageViaAdGroups', 'recursiveGroups', 'AdSecure'];

    this.handleDebounceChange = _compose(
      _debounce(props.onChange.bind(this), 300),
      _clone
    );

    autobind(this);
  }

  render() {
    const {
      strings,
      port,
      list,
      onChange
    } = this.props;

    const styles = require('./ActiveDirectory.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ActiveDirectory: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.additionalSettingsDiv}>
          <h3>{strings.additionalSettings}</h3>
          {this.checkboxs.map(obj => (
            <Checkbox
              key={obj}
              label={strings[obj]}
              className={styles.additionalSettings}
              name={obj}
              value={obj}
              checked={this.props[obj]}
              onChange={onChange}
            />
          ))}
          <div className={styles.port}>
            <Text
              id="port"
              name="port"
              type="number"
              label={strings.port}
              defaultValue={port || 0}
              onChange={this.handleDebounceChange}
            />
          </div>
        </div>
        <div>{strings.activeForest}: {list.length}</div>
        <div onClick={onChange} data-action="addActiveForest" className={styles.add}>{strings.addActiveForest}</div>
        <DragItemList
          strings={strings}
          onOrderChange={onChange}
          list={list}
          item={<ActiveForestItem name="ActiveForestItem" strings={strings} onChange={onChange} />}
        />
      </div>
    );
  }
}
