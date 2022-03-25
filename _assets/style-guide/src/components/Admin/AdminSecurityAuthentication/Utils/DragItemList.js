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

import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import {
  SortableHandle as sortableHandle,
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  arrayMove
} from 'react-sortable-hoc';

const DragHandle = sortableHandle((props) => props.children);

const DragIcon = ({ styles, icon, className }) => (
  <DragHandle>
    <div className={`${styles.handle} icon-${icon} ${className}`} />
  </DragHandle>
);


const SortableItem = sortableElement(({ item, id, iconclassname, styles, icon, onMouseUp, ...rest }) => (
  <li data-id={id} className={`${styles.sortableItem}`}>
    {React.cloneElement(item, {
      dragIcon: <DragIcon
        className={iconclassname} styles={styles} icon={icon}
        onMouseUp={onMouseUp}
      />,
      ...rest,
      icon,
      id,
    })}
  </li>
));

const SortableList = sortableContainer((props) => (
  <ol>{props.children}</ol>
));

/**
 * DragItemList description
 */
export default class DragItemList extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    axis: PropTypes.string,

    /** pass a valid <strong>btc-font</strong> icon name */
    icon: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: [],
    icon: 'handle',
    axis: 'y'
  };

  constructor(props) {
    super(props);
    this.state = {
      isSorting: false
    };
    autobind(this);
  }

  handleSortStart(event) {
    this.setState({ isSorting: true });

    if (typeof this.props.onSortStart === 'function') {
      this.props.onSortStart(event);
    }
  }

  handleSortEnd(value) {
    this.setState({ isSorting: false });

    const currentOrder = this.props.list.map((item, index) => index);
    const newOrder = arrayMove([...currentOrder], value.oldIndex, value.newIndex);
    const orderChanged = !_isEqual(currentOrder, newOrder);
    if (typeof this.props.onOrderChange === 'function' && orderChanged) {
      const itemName = _get(this.props.item, 'props.name', '');
      this.props.onOrderChange(event, newOrder, itemName);
    }
  }

  render() {
    const {
      item,
      icon,
      iconClassName,
      isSortingClasses,
      className,
      axis,
      list,
    } = this.props;
    const { isSorting } = this.state;
    const styles = require('./DragItemList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      DragItemList: true
    }, className);

    const isSortingClassName = cx({
      isSorting: isSorting
    }, isSortingClasses);

    return (
      <div className={classes} style={this.props.style}>
        <SortableList
          axis={axis}
          lockAxis={axis}
          helperClass={isSortingClassName}
          lockToContainerEdges
          useDragHandle
          onSortStart={this.handleSortStart}
          onSortEnd={this.handleSortEnd}
        >
          {list.map((obj, i) => (
            <SortableItem
              key={i}
              index={i}
              itemIndex={i}
              icon={icon}
              iconclassname={iconClassName}
              styles={styles}
              item={item}
              {...obj}
            />
          ))}
        </SortableList>
      </div>
    );
  }
}
