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
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import ColourPicker from 'components/ColourPicker/ColourPicker';
import Text from 'components/Text/Text';

/* eslint-disable react/no-find-dom-node */

export default class BadgeItem extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    title: PropTypes.string,
    titleMaxLength: PropTypes.number,
    colour: PropTypes.string,
    enabled: PropTypes.bool,
    enableDelete: PropTypes.bool,
    index: PropTypes.number,

    onColorChange: PropTypes.func,
    onToggleEnable: PropTypes.func,
    onTitleChange: PropTypes.func,
    onDelete: PropTypes.func,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
      isColorPickerVisible: false,
    };

    autobind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.clickDocument, false);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.enabled && !this.props.title && prevProps.enabled !== this.props.enabled) {
      if (this['title_' + this.props.index]) this['title_' + this.props.index].focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickDocument, false);
    if (this.timer) window.clearInterval(this.timer);
  }

  clickDocument(event) {
    const { index } = this.props;
    const componentContainer = ReactDOM.findDOMNode(this['colorPicker_' + index]);
    const componentInput = ReactDOM.findDOMNode(this['color_' + index]);
    const componentBadgeItem = ReactDOM.findDOMNode(this['badgeItem_' + index]);

    // Hide Color picker
    if (this.state.isColorPickerVisible && !((componentContainer && componentContainer.contains(event.target)) || (componentInput && componentInput.contains(event.target)))) {
      this.setState({ isColorPickerVisible: false });
    }

    // Hide Confirm Delete
    if (this.state.confirmDelete && !(componentBadgeItem && componentBadgeItem.contains(event.target))) {
      this.setState({ confirmDelete: false });
    }
  }

  handleTitleChange(event) {
    if (typeof this.props.onTitleChange === 'function') {
      this.props.onTitleChange(event, this.props);
    }
  }

  handleBlur() {
    this.timer = window.setTimeout(() => {
      if (this.props.enabled) this.props.onTitleBlur(this.props);
      window.clearInterval(this.timer);
    }, 50);
  }

  handleColorChange(event) {
    if (typeof this.props.onColorChange === 'function') {
      this.props.onColorChange(event.currentTarget.value, this.props);
    }
  }

  handleColorPickerChange(color) {
    if (typeof this.props.onColorChange === 'function') {
      this.props.onColorChange(color.hex, this.props);
    }
  }

  handleShowColourPicker() {
    this.setState({ isColorPickerVisible: true });
  }

  handleToggleEnable(event) {
    if (typeof this.props.onToggleEnable === 'function') {
      this.props.onToggleEnable(event, this.props);
    }
  }

  handleDelete() {
    this.setState({ confirmDelete: true });
  }

  handleCancelDelete() {
    this.setState({ confirmDelete: false });
  }

  handleConfirmDelete(event) {
    this.setState({ confirmDelete: false }); // hide
    if (typeof this.props.onDelete === 'function') {
      this.props.onDelete(event, this.props);
    }
  }

  render() {
    const {
      index,
      min,
      max,
      title,
      titleMaxLength,
      colour,
      enabled,
      enableDelete,
      style,
      className,
      strings,
    } = this.props;
    const styles = require('./AdminBadgeSelector.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BadgeItem: true
    }, className);

    return (
      <div className={styles.itemContainer} ref={(c) => { this['badgeItem_' + index] = c; }}>
        <ul className={classes} style={style}>
          <li>
            <div className={styles.badge} title={title} style={{ backgroundColor: colour }}>{title || ' '}</div>
          </li>
          <li>
            <div className={styles.range}>{min} - {max}</div>
          </li>
          <li>
            <Text
              ref={(c) => { this['title_' + index] = c; }}
              placeholder={strings.typeBadgeName}
              value={title}
              maxLength={titleMaxLength || 20}
              onChange={this.handleTitleChange}
              onBlur={this.handleBlur}
              style={{ lineHeight: '1rem', width: '100%' }}
              disabled={!enabled}
            />
          </li>
          <li>
            <Text
              ref={(c) => { this['color_' + index] = c; }}
              value={colour}
              onChange={this.handleColorChange}
              onFocus={this.handleShowColourPicker}
              style={{ lineHeight: '1rem', width: '100%' }}
              disabled={!enabled}
              readOnly
            />
            <ColourPicker
              ref={(c) => { this['colorPicker_' + index] = c; }}
              hex={colour}
              isVisible={this.state.isColorPickerVisible}
              onChange={this.handleColorPickerChange}
              className={styles.colorPicker}
            />
          </li>
          <li>
            <Checkbox
              label={strings.enabled}
              name={'enabled_' + index}
              value={enabled}
              checked={enabled}
              onChange={this.handleToggleEnable}
            />
          </li>
          <li>
            <Btn
              onClick={this.handleDelete}
              borderless
              warning
              disabled={enableDelete}
              style={{ lineHeight: '1rem', padding: '0.5rem 1rem' }}
            >
              {strings.delete}
            </Btn>
          </li>
        </ul>

        <TransitionGroup>
          {this.state.confirmDelete && <CSSTransition
            transitionName="fade"
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={styles.confirmDelete}>
              <p>{strings.confirmDeleteMessage || 'Are you sure you want to delete this badge?'}</p>
              <ul>
                <li><Btn onClick={this.handleCancelDelete} borderless alt>{strings.cancel}</Btn></li>
                <li><Btn onClick={this.handleConfirmDelete} borderless warning>{strings.delete}</Btn></li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}
