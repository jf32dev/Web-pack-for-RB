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
 * @author Jason Huang <jason.huange@bigtincan.com>
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
/**
 * Admin Content Security Policy
 */
export default class AdminTable extends PureComponent {
  static propTypes = {
    /** data */
    list: PropTypes.array,

    disabledItems: PropTypes.array,

    border: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    disabledItems: []
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const { className, border, headers, list, onChange, disabledItems, info } = this.props;
    const styles = require('./AdminTable.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminTable: true,
      border,
    }, className);

    return (
      <div className={classes} style={this.props.style}>
        {headers.length > 0 && list.length > 0 && <div data-name="headers" className={styles.header}>
          {headers.map((header, i) => (<div key={i} data-name={header} data-index={i}>
            {header}
            {info[header] && <i aria-label={info[header]} className={styles.tiptool}><i className="icon-info" /></i>}
          </div>))}
        </div>}
        {list.length > 0 && <div data-name="row" className={styles.rows}>
          {list.map((item, i) => (<div key={i} data-row={i} className={styles.row}>
            {headers.map((header, headerIndex) => (
              <div key={headerIndex} data-row-index={headerIndex} className={styles.col}>
                {Object.keys(this.props[`col${headerIndex}`]).map((key, colIndex) => {
                  const element = this.props[this.props[`col${headerIndex}`][key]];
                  return (<div className={styles.inputField} key={colIndex}>
                    {React.cloneElement(element, {
                      'data-id': item.id,
                      'data-name': key,
                      value: list[i][key],
                      disabled: item.id === -1 && disabledItems.indexOf(key) > -1,
                      onChange: onChange
                    })}
                  </div>);
                })}
              </div>))}
          </div>))}
        </div>}
      </div>
    );
  }
}
