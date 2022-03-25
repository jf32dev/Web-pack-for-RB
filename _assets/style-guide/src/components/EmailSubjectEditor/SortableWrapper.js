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

/**
 * Wrapper to overwrite functionality for react-sortable
 */
export default class SortableWrapper extends PureComponent {
  static propTypes = {
    // item can be dragged
    draggable: PropTypes.bool,

    /* current item index position */
    sortId: PropTypes.number,

    /* index of item being dragged */
    draggingIndex: PropTypes.number,

    /* list of items to be dragged */
    items: PropTypes.array,

    /* callback to update state */
    updateState: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    draggable: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      draggingIndex: null  // eslint-disable-line react/no-unused-state
    };
    autobind(this);
  }

  // Util function
  arrayMove(arr, from, to) {
    const array = arr;
    if (to === from) return array;

    const target = array[from];
    const increment = to < from ? -1 : 1;

    for (let k = from; k !== to; k += increment) {
      array[k] = array[k + increment];
    }
    array[to] = target;
    return array;
  }

  /**
   * Dragging functions
   */
  // Overwriting main function
  handleIsMouseBeyond(mousePos, elementPos, elementSize) {
    const breakPoint = elementSize / 2; //break point is set to the middle line of element
    const mouseOverlap = mousePos - elementPos;
    return mouseOverlap > breakPoint;
  }

  handleDragStart(e) {
    const draggingIndex = e.currentTarget.dataset.id;
    this.props.updateState({
      draggingIndex: draggingIndex
    });

    const dt = e.dataTransfer;
    if (dt !== undefined) {
      e.dataTransfer.setData('text', e.target.innerHTML);

      /*const img = document.createElement('img');
       img.src = 'http://kryogenix.org/images/hackergotchi-simpler.png';
       e.dataTransfer.setDragImage(img, 0, 0);*/

      //fix http://stackoverflow.com/questions/27656183/preserve-appearance-of-dragged-a-element-when-using-html5-draggable-attribute
      if (dt.setDragImage && e.currentTarget.tagName.toLowerCase() === 'a') {
        dt.setDragImage(e.target, 0, 0);
      }
    }

    if (typeof this.props.onDragStart === 'function') {
      this.props.onDragStart(this.props);
    }
  }

  // Overwriting main function to change behaviour when swapping items in array
  handleDragOver(e) {
    e.preventDefault();
    let mouseBeyond;
    const items = this.props.items;
    const { outline, moveInMiddle } = this.props;
    const overEl = e.currentTarget; //underlying element
    const indexDragged = Number(overEl.dataset.id); //index of underlying element in the set DOM elements
    const indexFrom = Number(this.props.draggingIndex);

    const height = overEl.getBoundingClientRect().height;

    const positionX = e.clientX;
    const positionY = e.clientY;
    const topOffset = overEl.getBoundingClientRect().top;

    if (outline === 'grid') {
      mouseBeyond = this.handleIsMouseBeyond(positionX, overEl.getBoundingClientRect().left, overEl.getBoundingClientRect().width, moveInMiddle);
    } else if (outline === 'list' || !outline) {
      mouseBeyond = this.handleIsMouseBeyond(positionY, topOffset, height, moveInMiddle);
    }

    if (indexDragged !== indexFrom && mouseBeyond) {
      const nItems = this.arrayMove(items, indexFrom, indexDragged);
      this.props.updateState({
        items: nItems,
        draggingIndex: indexDragged
      });
    }

    if (typeof this.props.onDragOver === 'function') {
      this.props.onDragOver(this.props);
    }
  }

  render() {
    const {
      draggable,
      draggingIndex,
      items,
      sortId,
      updateState,
      variables,
      className,
      ...others
    } = this.props;

    return (
      <div
        {...others}
        className={className}
        draggable={draggable}
        onDragStart={this.handleDragStart}
        onDragOver={this.handleDragOver}
        onTouchStart={this.handleDragStart}
        onTouchMove={this.handleDragOver}
      >
        {this.props.children}
      </div>
    );
  }
}
