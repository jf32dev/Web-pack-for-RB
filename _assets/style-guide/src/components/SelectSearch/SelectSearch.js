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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import TetherComponent from 'react-tether';

import { List } from 'react-virtualized';

import Loader from 'components/Loader/Loader';
import Text from 'components/Text/Text';

import CategoryItem from 'components/CategoryItem/CategoryItem';
import ChannelItem from 'components/ChannelItem/ChannelItem';
import FileItem from 'components/FileItem/FileItem';
import FormItem from 'components/FormItem/FormItem';
import GroupItem from 'components/GroupItem/GroupItem';
import NavMenu from 'components/NavMenu/NavMenu';
import StoryItem from 'components/StoryItem/StoryItem';
import TabItem from 'components/TabItem/TabItem';

// Regular UserItem has a different style to all other list items
import UserThumb from 'components/UserThumb/UserThumb';

const USERS = 'users';
const GROUPS = 'groups';

class UserItem extends PureComponent {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, this);
    }
  }

  render() {
    const {
      id,
      name,
      thumbnail,
      role,
      isActive,
      authString,
      className,
      style
    } = this.props;
    const styles = require('./SelectSearch.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      UserItem: true,
      isActive: isActive
    }, className);

    return (
      <div
        aria-label={name}
        data-id={id}
        onClick={this.handleClick}
        className={classes}
        style={style}
      >
        <div className={styles.wrapper}>
          <div className={styles.thumbWrap}>
            <UserThumb
              name={name}
              thumbnail={thumbnail}
              authString={authString}
            />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{name}</span>
            <span className={styles.note}>{role}</span>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Displays a controlled Text input and a `react-virtualized` List component.
 */
export default class SelectSearch extends PureComponent {
  static propTypes = {
    /** Unique ID for search input */
    id: PropTypes.string.isRequired,

    /** Array of list items */
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired
    })),

    /** Selected items to set on mount */
    selectedItems: PropTypes.array,

    /** Text to display as placeholder */
    placeholder: PropTypes.string,

    /** Value of text input */
    inputValue: PropTypes.string,

    /** tabIndex of text input, increments by 1 for List */
    tabIndex: PropTypes.number,

    /** Max List height in pixels */
    listHeight: PropTypes.number,

    /** Height of List rows */
    rowHeight: PropTypes.number,

    /** Width of container in pixels */
    width: PropTypes.number,

    /** Indicate loading state */
    isLoading: PropTypes.bool,

    /** Search icon */
    leftAlignIcon: PropTypes.bool,

    /** For thumbnails */
    authString: PropTypes.string,

    /** Display a navigation menu to select APIs filter */
    showNavigationMenu: PropTypes.bool,
    menuSelected: PropTypes.string,
    menuOptions: PropTypes.array,
    onNavMenuClick: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** Handle inputValue */
    onInputChange: PropTypes.func.isRequired,

    /** Handle select/unselect item */
    onToggleItem: PropTypes.func,

    /** Returns `selectedItems` */
    onChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    items: [],
    tabIndex: 0,
    isLoading: false,
    rowHeight: 62,
    listHeight: 340,
    width: 300,
    zIndex: 1,
    unSelectedItem: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      isInputFocused: false,
      focusedIndex: undefined,
      selectedItems: props.selectedItems || []
    };
    autobind(this);

    this.container = null;
    this.input = null;
    this.inputDummy = null;
    this.list = null;
    this.tether = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.unSelectedItem && nextProps.unSelectedItem.id && nextProps.unSelectedItem.id !== this.props.unSelectedItem.id) {
      this.setState({
        selectedItems: this.state.selectedItems.filter(item => item.id === nextProps.unSelectedItem.id)
      });
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedItems !== this.state.selectedItems) {
      this.props.onChange(nextState.selectedItems, this.props.id);
    }

    if (nextState.isInputFocused && !this.state.isInputFocused) {
      this.addDocumentClickEvent();
    } else if (!nextState.isInputFocused && this.state.isInputFocused) {
      this.removeDocumentClickEvent();
    }
  }

  componentWillUnmount() {
    this.removeDocumentClickEvent();
  }

  focusInput() {
    if (this.input) this.input.focus();
  }

  handleFocusInput() {
    this.focusInput();
  }

  toggleItem(item) {
    const { selectedItems } = this.state;

    // Does it exist in the selectedItems list?
    const index = selectedItems.findIndex(s => s.id === item.id && s.type === item.type);

    // Add to list
    if (index === -1) {
      this.setState({
        selectedItems: [...selectedItems, item]
      });

      if (typeof this.props.onToggleItem === 'function') {
        this.props.onToggleItem(item);
      }

    // Remove from list
    } else {
      this.setState({
        selectedItems: [
          ...selectedItems.slice(0, index),
          ...selectedItems.slice(index + 1)
        ]
      });

      if (typeof this.props.onToggleItem === 'function') {
        this.props.onToggleItem(null, item);
      }
    }
    this.list.forceUpdateGrid();
  }

  addDocumentClickEvent() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  removeDocumentClickEvent() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick(event) {
    if (this.container && !this.container.contains(event.target) && !this.state.isMouseOver) {
      this.setState({
        isInputFocused: false,
        focusedIndex: undefined
      });
    }
  }

  handleMouseEnter() {
    this.setState({
      isMouseOver: true
    });
  }

  handleMouseLeave() {
    this.setState({
      isMouseOver: false
    });
  }

  handleInputBlur() {
    if (!this.state.isMouseOver) {
      this.setState({
        isInputFocused: false,
        focusedIndex: undefined
      }, this.focusInput);
    }
  }

  handleInputFocus() {
    this.setState({
      isInputFocused: true
    }, this.focusInput);
  }

  handleInputKeyDown(event) {
    // up or down
    if (event.keyCode === 38 || event.keyCode === 40) {
      event.preventDefault();  // prevent cursor movement
      const { items } = this.props;
      const { focusedIndex } = this.state;

      let newIndex = 0;

      // up
      if (event.keyCode === 38) {
        if (typeof focusedIndex === 'undefined' || focusedIndex <= 0) {
          newIndex = items.length - 1;
        } else {
          newIndex = focusedIndex - 1;
        }

      // down
      } else if (event.keyCode === 40) {
        if (typeof focusedIndex === 'undefined' || focusedIndex >= items.length) {
          newIndex = 0;
        } else {
          newIndex = focusedIndex + 1;
        }
      }

      this.setState({
        focusedIndex: newIndex
      });
      this.list.forceUpdateGrid();

    // return
    } else if (event.keyCode === 13 && this.state.focusedIndex >= 0) {
      this.toggleItem(this.props.items[this.state.focusedIndex]);

    // esc
    } else if (event.keyCode === 27) {
      this.setState({
        isInputFocused: false,
        focusedIndex: undefined
      });
      this.input.blur();

    // all other keypresses
    } else {
      this.setState({
        focusedIndex: undefined
      });
    }
  }

  handleListMouseMove() {
    this.setState({
      focusedIndex: undefined
    });
  }

  handleListItemClick(event, context) {
    event.stopPropagation();
    event.preventDefault();
    this.toggleItem({ id: context.props.id, type: context.props.type });
  }

  handleListScroll({ clientHeight, scrollHeight, scrollTop }) {
    // Determine when near end of list
    const scrollBottom = scrollTop + clientHeight;
    const listHeight = scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.15); // 15% of list left

    if (scrollBottom >= loadTrigger) {
      console.log('list trigger');
    }
  }

  renderRow (props) {
    const {
      key,
      index,
      //isScrolling,
      isVisible,
      style
    } = props;
    if (!this.props.items || !this.props.items[index] || !isVisible) {
      return false;
    }
    const option = this.props.items[index];
    const isSelected = this.state.selectedItems.findIndex(
      s => {
        let isItemSelected = s.id === option.id;
        if (this.props.menuSelected) {
          switch (this.props.menuSelected) {
            case USERS:
              isItemSelected = s.id === option.id &&  s.type === 'people';
              break;
            case GROUPS:
              isItemSelected = s.id === option.id && s.type === 'group';
              break;
            default:
              break;
          }
        }
        return isItemSelected;
      }
    ) > -1;
    const styles = require('./SelectSearch.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      listOption: true,
      selectedOption: isSelected
    });

    let Comp = this.props.itemComponent;
    if (!Comp) {
      switch (option.type) {
        case 'category':
          Comp = CategoryItem;
          break;
        case 'channel':
          Comp = ChannelItem;
          break;
        case 'file':
          Comp = FileItem;
          break;
        case 'form':
          Comp = FormItem;
          break;
        case 'group':
          Comp = GroupItem;
          break;
        case 'story':
          Comp = StoryItem;
          break;
        case 'people':
          Comp = UserItem;
          break;
        case 'tab':
          Comp = TabItem;
          break;
        default:
          break;
      }

      if (!Comp) {
        return (
          <div key={key}>
            <code>{JSON.stringify(option)}</code>
          </div>
        );
      }
    }

    return (
      <div
        key={key}
        className={classes}
        style={style}
      >
        <Comp
          isActive={index === this.state.focusedIndex}
          noLink
          inList
          showThumb
          thumbSize="small"
          authString={this.props.authString}
          onClick={this.handleListItemClick}
          {...option}
        />
        {isSelected && <span className={styles.tickOption} />}
        {!isSelected && <span className={styles.addOption} />}
      </div>
    );
  }

  render() {
    const {
      id,
      items,
      inputValue,
      placeholder,
      listHeight,
      rowHeight,
      tabIndex,
      isLoading,
      menuOptions,
      menuSelected,
      width,
      zIndex,
      onInputChange,
      showNavigationMenu,
      className,
      style
    } = this.props;
    const { isInputFocused } = this.state;
    const styles = require('./SelectSearch.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SelectSearch: true,
      isFocused: true,
      isLoading: isLoading
    }, className);

    const searchIconPosition = cx({
      textInput: !this.props.leftAlignIcon,
      textInputAlt: this.props.leftAlignIcon,
    });

    const listMenu = cx({
      listMenu: true,
      listMenuSmall: showNavigationMenu,
    });

    const mergedStyle = {
      width: width,
      ...style
    };

    // Lower height to match rows if less than set height
    const itemsHeight = items.length * rowHeight;
    let fixedListheight = listHeight;
    if (itemsHeight < listHeight) {
      fixedListheight = itemsHeight;
    }

    return (
      <div
        ref={(c) => { this.container = c; }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        //className={styles.SelectSearch}
        style={mergedStyle}
      >
        <TetherComponent
          attachment="top left"
          targetAttachment="top left"
          style={{ zIndex: '20' }}
          className={styles.tetherWrapper}
          ref={tether => {
            this.tether = tether;
          }}
          constraints={[
            {
              to: this.inputDummy,
              attachment: 'together',
            },
          ]}
          /* renderTarget: This is what the item will be tethered to, make sure to attach the ref */
          renderTarget={ref => (
            <div ref={ref}>
              <div
                className={classes}
                style={{ zIndex: zIndex + 1, paddingTop: '0.5rem' }}
              >
                <Text
                  ref={(c) => { this.inputDummy = c; }}
                  id={`${id}-inputDummy`}
                  tabIndex={tabIndex}
                  icon="search"
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={onInputChange}
                  onBlur={this.handleInputBlur}
                  onFocus={this.handleInputFocus}
                  onKeyDown={this.handleInputKeyDown}
                  onClick={this.handleFocusInput}
                  className={searchIconPosition}
                />
              </div>
            </div>
          )}
          /* renderElement: If present, this item will be tethered to the the component returned by renderTarget */
          renderElement={ref =>
            isInputFocused && <div
              ref={ref}
              onMouseMove={this.handleListMouseMove}
              className={listMenu}
              style={{ zIndex: zIndex }}
            >
              <div className={styles.inputWrap} style={{ zIndex: zIndex + 1, position: 'relative' }}>
                <Text
                  autoFocus
                  ref={(c) => { this.input = c; }}
                  id={`${id}-input`}
                  tabIndex={tabIndex}
                  icon="search"
                  placeholder={placeholder}
                  value={inputValue}
                  onChange={onInputChange}
                  onBlur={this.handleInputBlur}
                  onFocus={this.handleInputFocus}
                  onKeyDown={this.handleInputKeyDown}
                  className={searchIconPosition}
                />
                <Loader type="content" className={styles.loader} />
              </div>
              {showNavigationMenu && isInputFocused && <NavMenu
                className={styles.navMenuOptions}
                list={menuOptions}
                selectedUrl={menuSelected}
                horizontal
                secondary
                onItemClick={this.props.onNavMenuClick}
              />}
              <List
                ref={(c) => { this.list = c; }}
                id={`${id}-list`}
                tabIndex={tabIndex + 1}
                rowCount={items.length}
                rowHeight={rowHeight}
                rowRenderer={this.renderRow}
                height={fixedListheight}
                width={width}
                scrollToIndex={this.state.focusedIndex}
                onScroll={this.handleListScroll}
                className={styles.list}
                list={items}
              />
            </div>
          }
        />
      </div>
    );
  }
}
