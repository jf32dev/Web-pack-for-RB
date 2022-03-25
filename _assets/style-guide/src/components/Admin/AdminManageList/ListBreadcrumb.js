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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

/**
 * Manage List Breadcrumbs.
 */
export default class ListBreadcrumb extends PureComponent {
  static propTypes = {
    /** Placeholder label */
    placeholder: PropTypes.string,

    /** Item Id  */
    id: PropTypes.number,

    /** name to be displayed in the breadcrumb */
    name: PropTypes.string,

    /** Position of item in the list */
    position: PropTypes.number,

    /** Shows icon graph */
    showGraph: PropTypes.bool,

    // Dont show the arrow on placeholder (for first column)
    hideArrow: PropTypes.bool,

    initialState: PropTypes.bool,

    onClick: function(props) {
      if (props.name && typeof props.onClick !== 'function') {
        return new Error('onClick is required when name is provided.');
      }
      return null;
    },

    onGraphClick: function(props) {
      if (props.showGraph && typeof props.onGraphClick !== 'function') {
        return new Error('onGraphClick is required when showGraph is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    placeholder: 'Select',
    showGraph: false
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    const { name, onClick } = this.props;

    if (name && typeof onClick === 'function') {
      onClick(event, this.props);
    }
  }

  handleGraphClick(event) {
    event.stopPropagation();
    event.preventDefault();
    const { onGraphClick } = this.props;

    if (typeof onGraphClick === 'function') {
      onGraphClick(event, this.props);
    }
  }

  render() {
    const {
      name,
      placeholder,
      showGraph,
      initialState,
      hideArrow,
      className,
      style
    } = this.props;

    const styles = require('./ListBreadcrumb.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      Breadcrumbs: true,
      hideArrow: !name || !!hideArrow,
      emptyBlock: !name,
    }, className);

    const breadcrumb = cx({
      placeholder: !name,
      itemSelected: !!name,
    }, className);

    return (
      <div className={itemClasses} style={style}>
        <div className={styles.wrapper}>
          {name && !initialState && <span className={breadcrumb} onClick={this.handleClick}>{name || placeholder}</span>}
          {showGraph && name && !initialState && <div className={styles.actions}>
            <span className={styles.iconGraph} onClick={this.handleGraphClick} />
          </div>}
        </div>
      </div>
    );
  }
}
