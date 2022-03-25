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
import uniqueId from 'lodash/uniqueId';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import AddMoreItem from './AddMoreItem';
import DropMenu from 'components/DropMenu/DropMenu';
import SortableWrapper from './SortableWrapper';
import Text from 'components/Text/Text';

class VariableItem extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.string
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(e) {
    if (typeof this.props.onClick === 'function' && !this.props.selected) {
      this.props.onClick(e, this.props);
    }
  }

  render() {
    const {
      selected,
      type,
      name,
      strings,
    } = this.props;
    const styles = require('./EmailSubjectItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      VariableItem: true,
      Selected: type !== 'custom' && selected,
      CustomItem: type === 'custom'
    });

    return (
      <div
        aria-label={strings[name] || name} title={strings[name] || name} className={classes}
        onClick={this.handleClick}
      >
        {strings[name] || name}
      </div>
    );
  }
}

class VariableMenu extends PureComponent {
  static propTypes = {
    selected: PropTypes.object,
    variables: PropTypes.array,
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleVariableClick(e, context) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e, context);
    }
  }

  render() {
    const {
      selected,
      variables,
      strings,
    } = this.props;
    const styles = require('./EmailSubjectItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      dropMenu: true,
      hidden: !strings.customText && variables.length === 0
    });
    const headingElem = <span className={styles.arrowZone} />;

    return (
      <DropMenu
        heading={headingElem}
        className={classes}
        position={{ left: 0, right: 'initial' }}
      >
        <ul className={styles.VariableList}>
          {variables.map(opt => (
            <li key={uniqueId()}>
              <VariableItem
                type="variable"
                name={opt}
                strings={strings}
                selected={selected.type === 'variable' && opt === selected.name}
                onClick={this.handleVariableClick}
              />
            </li>
          ))}

          <li key={uniqueId()}>
            <VariableItem
              type="custom"
              name={strings.customText || ''}
              selected={selected.type === 'custom'}
              onClick={this.handleVariableClick}
              strings={strings}
            />
          </li>
        </ul>
      </DropMenu>
    );
  }
}

/**
 * Email Subject Item.
 */
export default class EmailSubjectItem extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    variables: PropTypes.array,
    sortId: PropTypes.number,
    updateState: PropTypes.func,
    onAdd: PropTypes.func,
    onAddBtnDisplay: PropTypes.func,
    onRemove: PropTypes.func,
    onReplaceVariable: PropTypes.func,
    onCustomTextChange: PropTypes.func,
    onCustomTextBlur: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    strings: {},
    variables: [],
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.customInput = null;
  }

  componentDidMount() {
    // Focus only when empty
    if (this.customInput && (this.customInput.props.value.length === 0 || !this.customInput.props.value.trim())) {
      this.customInput.focus();
    }
  }

  handleRemove(e) {
    e.preventDefault();
    const { onRemove } = this.props;
    if (typeof onRemove === 'function') {
      onRemove(e, this.props);
    }
  }

  handleReplaceVariable(e, newProps) {
    if (typeof this.props.onReplaceVariable === 'function') {
      this.props.onReplaceVariable(this.props, newProps);
    }
  }

  handleInputChange(event) {
    if (typeof this.props.onCustomTextChange === 'function') {
      this.props.onCustomTextChange(this.props, event.currentTarget.value);
    }
  }

  handleOnBlur(e) {
    const data = e.currentTarget.value;
    if (typeof this.props.onCustomTextBlur === 'function' && !(data.length === 0 || !data.trim())) {
      this.props.onCustomTextBlur(e);
    } else {
      // DO NOT Do anything if focus is lost on empty input
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const {
      className,
      sortId,
      type,
      name,
      variable,
      variables,
      draggable,
      draggingIndex,
      onAdd,
      showAdd,
      onAddBtnDisplay,
      onRemove,
      onReplaceVariable,
      onCustomTextChange,
      onCustomTextBlur,
      strings,
      ...others
    } = this.props;

    const styles = require('./EmailSubjectItem.less');

    const cx = classNames.bind(styles);
    const classes = cx({
      Item: true,
      ItemInput: type === 'custom',
      isDragging: draggingIndex === sortId
    }, className);

    const boxType = cx({
      subjectBoxLabel: type !== 'custom',
      subjectBoxInput: type === 'custom',
      isDragging: draggingIndex === sortId
    });

    return (
      <SortableWrapper
        {...others}
        draggingIndex={parseInt(draggingIndex, 10)}
        sortId={sortId}
        className={classes}
      >
        <span
          className={styles.handler}
          draggable={draggable}
        />
        <span
          className={boxType}
          title={strings[name] || name}
        >
          {type === 'variable' && (strings[name] || name)}
          {type === 'custom' &&
          <Text
            ref={(elem) => { this.customInput = elem; }}
            inline
            autosize
            value={name}
            className={styles.subjectInput}
            onChange={this.handleInputChange}
            onBlur={this.handleOnBlur}
          />
          }
        </span>
        <VariableMenu
          selected={{ type: type, name: name }}
          variables={variables}
          strings={strings}
          onClick={this.handleReplaceVariable}
        />
        <span
          className={styles.removeBtn}
          onClick={this.handleRemove}
        />
        <AddMoreItem
          sortId={sortId}
          onAdd={onAdd}
          showAdd={showAdd}
          onAddBtnDisplay={onAddBtnDisplay}
        />
      </SortableWrapper>
    );
  }
}
