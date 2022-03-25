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

/* eslint-disable react/no-find-dom-node */
/* eslint-disable no-plusplus */

import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Text from 'components/Text/Text';

import ItemOption from './ItemOption';
import ItemSelected from './ItemSelected';

/**
 * MultiSelect description
 * TODO: use react-virtualzed-select with custom renderer
 */
export default class MultiSelect extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ]),

    /** Placeholder to display when value is empty */
    placeholder: PropTypes.string,

    /** value for input */
    value: PropTypes.array,

    /** CRM source */
    crmSource: PropTypes.string,

    /** list of options in dropdown list. <code>[{value: 1, label: 'test', type: 'user, crm, ...', status: 'error'}]</code> */
    /** types available: user, crm, crm_account, crm_contact, crm_opportunity, crm_lead, crm_campaign **/
    //crm_contact = icon dynamics or salesforce
    //crm_account = total users

    options: PropTypes.array,
    /** Attribute name that contains the value of the options. default value */
    keyValue: PropTypes.string,
    /** Attribute name that contains the label of the options. default label */
    keyLabel: PropTypes.string,

    /** disabled property for input */
    disabled: PropTypes.bool,

    /** prevent Space Break */
    preventSpaceBreak: PropTypes.bool,

    /** Use enter key to add value */
    insertWhenEnterIsPress: PropTypes.bool,

    /** Reset input value when input lost focus and no item is selected */
    clearInputOnFocusOut: PropTypes.bool,

    /** loading options */
    loading: PropTypes.bool,
    fetchingMore: PropTypes.bool,

    /** displays a 'x', onClearClick must be provided for controlled component */
    canRemove: PropTypes.bool,

    /** Allows to select multiple options */
    multi: PropTypes.bool,

    /** Pass type of validation. It'll display an underline error on new item */
    allowsCreateType: PropTypes.oneOf(['any', 'email']),


    /** Callback to update value for controlled component */
    onInputChange: function (props) {
      if (props.value && typeof props.onInputChange !== 'function') {
        return new Error('onInputChange is required when value is provided.');
      }
      return null;
    },

    /** Callback to add new seleted value */
    onAddValue: function (props) {
      if (props.value && typeof props.onAddValue !== 'function') {
        return new Error('onAddValue is required when value is provided.');
      }
      return null;
    },

    /** Callback to update value for controlled component */
    onRemoveClick: function (props) {
      if (props.canRemove && typeof props.onRemoveClick !== 'function') {
        return new Error('onRemoveClick is required when canRemove is enabled.');
      }
      return null;
    },

    // whether backspace removes an item if there is no text input
    backspaceRemoves: PropTypes.bool,

    onPopValue: function (props) {
      if (props.backspaceRemoves && typeof props.onPopValue !== 'function') {
        return new Error('onPopValue is required when backspaceRemoves is provided.');
      }
      return null;
    },
    selectItemOnPaste: PropTypes.bool,

    onScroll: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    width: '100%',
    keyValue: 'value',
    keyLabel: 'label',
    allowsCreateType: 'any',
    preventSpaceBreak: false,
    insertWhenEnterIsPress: false,
    clearInputOnFocusOut: false,
    strings: {
      noResult: 'No Results',
    },
    selectItemOnPaste: true
  };

  constructor(props) {
    super(props);
    this.state = {
      inputFocused: false,
      isOpened: false,
      inputValue: '',
      focusedOptionIndex: -1,
    };
    autobind(this);
    this.handleOnPaste = debounce(this.handleOnPaste.bind(this), 50);

    // refs
    this.text = null;
    this.focused = null;
    this.menu = null;
    this.menuContainer = null;
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // Add window event listener
    if (!this.state.isOpened && nextState.isOpened) {
      this.addWindowClickEvent();
      this.addOnMouseMoveEvent();
    } else if (this.state.isOpened && !nextState.isOpened) {
      this.removeWindowClickEvent();
      this.removeOnMouseMoveEvent();
    }

    // Open when search is finished and the input is focused
    if (!this.state.isOpened && !nextProps.loading && this.props.loading && document.activeElement === this.text.text) {
      this.setState({ isOpened: true }); //eslint-disable-line
    }
  }

  componentDidUpdate() {
    const focusedOptionNode = ReactDOM.findDOMNode(this.focused);
    const menuNode = ReactDOM.findDOMNode(this.menu);

    // focus to the selected option
    if (focusedOptionNode && !this.hasScrolledToOption) {
      menuNode.scrollTop = focusedOptionNode.offsetTop;
      this.hasScrolledToOption = true;
    }

    // scroll window to display full dropdown options
    if (this.state.isOpened && this.menuContainer) {
      const buffer = 10;
      const menuContainerRect = this.menuContainer.getBoundingClientRect();
      if (window.innerHeight < menuContainerRect.bottom + buffer) {
        window.scrollBy(0, menuContainerRect.bottom + buffer - window.innerHeight);
      }
    }
  }

  componentWillUnmount() {
    this.removeWindowClickEvent();
    this.removeOnMouseMoveEvent();
  }

  addOnMouseMoveEvent() {
    document.addEventListener('mousemove', this.handleEnableMouse, false);
  }

  removeOnMouseMoveEvent() {
    document.body.style.pointerEvents = 'auto';
    document.removeEventListener('mousemove', this.handleEnableMouse, false);
  }

  addWindowClickEvent() {
    document.addEventListener('click', this.handleWindowClick, false);
  }

  removeWindowClickEvent() {
    document.removeEventListener('click', this.handleWindowClick, false);
  }

  handleEnableMouse() {
    document.body.style.pointerEvents = 'auto';
  }

  handleWindowClick(event) {
    // Enable mouse pointing
    document.body.style.pointerEvents = 'auto';

    // Check if we are not clicking on the options
    const dropdown = ReactDOM.findDOMNode(this.text);
    const isDropdown = dropdown === event.target || dropdown === event.target.offsetParent;

    if (!isDropdown) {
      this.setState({ isOpened: false, focusedOptionIndex: -1 });
      this.hasScrolledToOption = false;
      event.stopPropagation();
    }
  }

  handleInputChange(event) {
    const newInputValue = event.currentTarget.value;

    if (this.state.inputValue !== newInputValue) {
      if (this.props.onInputChange) this.props.onInputChange(newInputValue);
      this.setState({ inputValue: newInputValue });
    }
  }

  handleAddValue(event, context) {
    this.props.onAddValue(event, context);
    this.setState({
      isOpened: false,
      focusedOptionIndex: -1,
      inputValue: '',
    });
    this.hasScrolledToOption = false;
  }

  handleRemoveClick(event, context) {
    this.props.onRemoveClick(event, context);
  }

  selectFocusedOption() {
    const item = this.props.options[this.state.focusedOptionIndex];
    if (this.state.focusedOptionIndex >= 0 && item) {
      this.handleAddValue(null, { value: item[this.props.keyValue], label: item[this.props.keyLabel], ...item });
    }
  }

  focusAdjacentOption(dir) {
    const maxLength = this.props.options.length - 1;
    let focusOption = this.state.focusedOptionIndex >= 0 ? this.state.focusedOptionIndex : 0;
    this.hasScrolledToOption = false;

    switch (dir) {
      case 'next':
        if (focusOption < maxLength) {
          focusOption += 1;
        }
        break;
      case 'previous':
        if (focusOption) {
          focusOption -= 1;
        }
        break;
      default:
        break;
    }
    this.setState({
      isOpened: true,
      focusedOptionIndex: focusOption
    });
  }

  handleOnPaste() {
    // Split by empty spaces
    if (this.props.selectItemOnPaste) {
      let i;
      const input = this.text.text.value.split(/[\s]+/);
      const list = [];

      if (input && input.length) {
        for (i = 0; i < input.length; i++) {
          let isEmailValid = true;
          if (this.props.allowsCreateType === 'email') {
            isEmailValid = /\S+@\S+\.\S+/.test(input[i]);
          }
          if (input[i].trim()) {
            list.push({
              value: input[i],
              label: input[i],
              status: isEmailValid ? 'valid' : 'error',
            });
          }
        }
        this.handleAddValue(null, list);
      }

      this.handleEnableMouse();
    }
  }

  // Hover over result item
  handleHoverResult(context) {
    this.setState({
      isOpened: true,
      focusedOptionIndex: context.index
    });
  }

  handleSearchKeyUp() { //event
    // Do something on keyUp
  }

  handleValidateToAddValue(addValue = true) {
    let isEmailValid = true;
    if (this.props.allowsCreateType === 'email') {
      isEmailValid = /\S+@\S+\.\S+/.test(this.state.inputValue);
    }
    if (addValue) {
      this.handleAddValue(null, {
        value: this.state.inputValue,
        label: this.state.inputValue,
        status: isEmailValid ? 'valid' : 'error',
      });
    }
  }

  handleSearchKeyDown(event) {
    const stateOptions = {};
    document.body.style.pointerEvents = 'none';

    if (this.props.disabled) return;
    // Only allows backspace
    if (!this.props.multi && this.props.value.length > 0 && event.keyCode !== 8) {
      event.preventDefault();
      return;
    }

    switch (event.keyCode) {
      case 8: // backspace
        if (!this.state.inputValue && this.props.backspaceRemoves) {
          event.preventDefault();
          this.props.onPopValue();
        }
        return;
      case 13: // enter
        if (this.state.inputValue && this.state.focusedOptionIndex === -1 && this.props.insertWhenEnterIsPress && !this.props.clearInputOnFocusOut) {
          this.handleValidateToAddValue();
        }

        if (!this.state.isOpened) return;
        event.stopPropagation();
        this.selectFocusedOption();
        break;
      case 27: // escape
        if (this.props.clearInputOnFocusOut) stateOptions.inputValue = '';
        if (this.state.isOpened) {
          this.setState({
            isOpened: false,
            ...stateOptions
          });
          this.hasScrolledToOption = false;
          event.stopPropagation();
        }
        break;
      case 38: // up
        this.focusAdjacentOption('previous');
        break;
      case 40: // down
        this.focusAdjacentOption('next');
        break;
      case 9: // tab
        if (this.state.inputValue && !this.props.clearInputOnFocusOut) {
          this.handleValidateToAddValue();
        } else if (this.props.clearInputOnFocusOut) {
          stateOptions.inputValue = '';
        }

        if (!this.state.isOpened) {
          this.setState({ ...stateOptions });
          return;
        }

        // Trigger Tab focus out
        this.setState({ isOpened: false, ...stateOptions });
        this.hasScrolledToOption = false;
        return;
      case 32: // (space)
        if (!this.props.preventSpaceBreak) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (this.state.inputValue) {
          this.handleValidateToAddValue(!this.props.preventSpaceBreak);
        }

        if (!this.props.preventSpaceBreak) {
          break;
        } else {
          return;
        }
      default: return;
    }
    event.preventDefault();
  }

  handleFocus() {
    // Do no open if single option is already selected
    if (this.text.text.value && (this.props.multi || (!this.props.multi && this.props.value.length === 0))) {
      this.text.focus();
      this.setState({ isOpened: true });
    } else {
      this.setState({ inputFocused: true });
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleBlur() {
    if (this.state.inputValue && !this.props.clearInputOnFocusOut) {
      let isEmailValid = true;
      if (this.props.allowsCreateType === 'email') {
        isEmailValid = /\S+@\S+\.\S+/.test(this.state.inputValue);
      }
      this.handleAddValue(null, {
        value: this.state.inputValue,
        label: this.state.inputValue,
        status: isEmailValid ? 'valid' : 'error',
      });
    }

    this.setState({ inputFocused: false });
    this.handleEnableMouse();
  }

  handleScroll(event) {
    if (typeof this.props.onScroll === 'function') {
      this.props.onScroll(event, this.props);
    }
  }

  render() {
    const {
      disabled,
      canRemove,
      loading,
      options,
      keyValue,
      keyLabel,
      value,
      placeholder,
      className,
      strings,
    } = this.props;
    const {
      focusedOptionIndex
    } = this.state;
    const styles = require('./MultiSelect.less');
    const cx = classNames.bind(styles);
    const containerClasses = cx({
      Container: true,
      focused: this.state.inputFocused
    }, className);
    const classes = cx({
      BoxList: true,
      disabled: disabled,
    });

    return (
      <div className={containerClasses} onScroll={this.handleScroll}>
        <ul className={classes}>
          {value && value.map((item, index) => (
            <ItemSelected
              key={item[keyValue] + '-' + index}
              value={item[keyValue]}
              status={item.status}
              index={index}
              label={item[keyLabel]}
              canRemove={!disabled && canRemove}
              onRemoveClick={this.handleRemoveClick}
            />
          ))}
          <li key="select-input" className={styles.textInput}>
            <Text
              ref={(c) => { this.text = c; }}
              id={this.props.id}
              value={this.state.inputValue}
              placeholder={value.length === 0 ? placeholder : ''}
              onChange={this.handleInputChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onKeyDown={this.handleSearchKeyDown}
              onKeyUp={this.handleSearchKeyUp}
              onPaste={this.handleOnPaste}
              disabled={disabled}
            />
            {loading && <span className={styles.loading} />}
          </li>
        </ul>

        {this.state.isOpened && (!loading || this.props.fetchingMore) && <div ref={(c) => { this.menuContainer = c; }} className={styles.optionList}>
          {options.length > 0 && <ul ref={(c) => { this.menu = c; }}>
            {options.map((item, index) => (
              <ItemOption
                {...item}
                ref={(c) => {
                  const refKey = focusedOptionIndex === index ? this.focused = c : null;
                  return refKey;
                }}
                key={item[keyValue] + '-' + index}
                value={item[keyValue]}
                label={item[keyLabel]}
                index={index}
                focus={focusedOptionIndex === index}
                onMouseDown={this.handleMouseDown}
                onValueClick={this.handleAddValue}
                onMouseOver={this.handleHoverResult}
                source={this.props.crmSource}
              />
            ))}
          </ul>}
          {options.length === 0 &&
            <div className={styles.noResults}>{strings.noResult}</div>
          }
        </div>}
      </div>
    );
  }
}
