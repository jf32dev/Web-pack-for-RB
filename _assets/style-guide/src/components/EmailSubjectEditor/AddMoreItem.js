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

export default class AddMoreItem extends PureComponent {
  static propTypes = {
    sortId: PropTypes.number,
    onAdd: PropTypes.func,
    onAddBtnDisplay: PropTypes.func,
    showAdd: PropTypes.bool,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showAdd: false,
    };
    autobind(this);
    this.addBtn = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.showAdd && !nextProps.showAdd && this.state.showAdd) {
      this.setState({ showAdd: false });
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // Add window event listener
    if (!this.state.showAdd && nextState.showAdd) {
      this.addWindowClickEvent();
    } else if (this.state.showAdd && !nextState.showAdd) {
      this.removeWindowClickEvent();
    }
  }

  componentWillUnmount() {
    this.removeWindowClickEvent();
  }

  addWindowClickEvent() {
    window.addEventListener('click', this.handleWindowClick);
  }

  removeWindowClickEvent() {
    window.removeEventListener('click', this.handleWindowClick);
  }

  handleWindowClick(event) {
    // Check if we are not clicking on the list
    const btn = this.addBtn;
    const isBtnClicked = btn === event.target || btn === event.target.offsetParent;
    if (!isBtnClicked && (!event.target.type || !btn.contains(event.target))) {
      this.setState({ showAdd: false });
      event.stopPropagation();
    }
  }

  handleAdd(e) {
    e.preventDefault();
    const { onAdd } = this.props;
    if (typeof onAdd === 'function') {
      onAdd(e, this.props);
    }
  }

  handleClick(e) {
    this.setState({
      showAdd: !this.state.showAdd
    });
    const { onAddBtnDisplay } = this.props;
    if (typeof onAddBtnDisplay === 'function') {
      onAddBtnDisplay(e, this);
    }
  }

  render() {
    const styles = require('./EmailSubjectItem.less');

    return (
      <span
        ref={(elem) => { this.addBtn = elem; }}
        onClick={this.handleClick}
        className={styles.hiddenAddMore}
        style={this.props.style}
      >
        {this.state.showAdd &&
        <span
          className={styles.addMore}
          onClick={this.handleAdd}
        />
        }
      </span>
    );
  }
}
