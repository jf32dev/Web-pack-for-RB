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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Highlighter from 'react-highlight-words';
import tinycolor from 'tinycolor2';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import UserActions from 'components/UserActions/UserActions';

const messages = defineMessages({
  confirmUnsubscribe: { id: 'are-you-sure-unsubscribe', defaultMessage: 'Are you sure you want to unsubscribe?' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  unsubscribe: { id: 'unsubscribe', defaultMessage: 'Unsubscribe' },
  subscribe: { id: 'subscribe', defaultMessage: 'Subscribe' },

  feed: { id: 'feed', defaultMessage: 'Feed' },
  hidden: { id: 'hidden', defaultMessage: 'Hidden' },
  personal: { id: 'personal', defaultMessage: 'Personal' },

  date: { id: 'date', defaultMessage: 'Date' },
  title: { id: 'title', defaultMessage: 'Title' },
  priority: { id: 'priority', defaultMessage: 'Priority' },
  likes: { id: 'likes', defaultMessage: 'Likes' },
  mostRead: { id: 'most-read', defaultMessage: 'Most Read' },
  leastRead: { id: 'least-read', defaultMessage: 'Least Read' },
  authorFirstName: { id: 'author-first-name', defaultMessage: 'Author First Name' },
  authorLastName: { id: 'author-last-name', defaultMessage: 'Author Last Name' },
  contentIQ: { id: 'content-iq', defaultMessage: 'Content IQ' },
});

/**
 * Clickable ChannelItem generally displayed in a List.
 */
export default class ChannelItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    childCount: PropTypes.number,
    childType: PropTypes.string,

    /** coloured tile if thumbnail not enabled or available */
    colour: PropTypes.string,

    isFeed: PropTypes.bool,
    isHidden: PropTypes.bool,
    isPersonal: PropTypes.bool,
    isChannelShare: PropTypes.bool,

    /** a string to display underneath Channel name */
    note: PropTypes.string,

    /** Overrides default <code>/channel/{id}</code> anchor href */
    anchorUrl: PropTypes.string,

    /** Allows nesting the default <code>/channel/{id}</code> anchor href */
    rootUrl: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Marks checkbox as checked */
    isSelected: PropTypes.bool,

    /** Grey out the checkbox in list view */
    disabled: PropTypes.bool,

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    /** Show checkbox */
    showCheckbox: PropTypes.bool,

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** displays indicator icons */
    showIcons: PropTypes.bool,

    /** Show Additional buttons and different styles */
    showAdmin: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
    thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** show Plus icon or Tick icon depending if item is selected - Use for Admin */
    showAdd: PropTypes.bool,

    /** Show Edit button for Personal Channels or Admin */
    showEdit: PropTypes.bool,

    /** Show Unlink button to remove items from parent - Admin */
    showUnlink: PropTypes.bool,

    /** Show Remove button to remove items from list*/
    showDelete: PropTypes.bool,

    /** Allows users to unsubscribe from a Channel */
    showSubscribe: PropTypes.bool,

    /** DEPRECATED - use showCheckbox instead */
    select: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use showCheckbox.'
        );
      }
      return null;
    },

    /** DEPRECATED - use isActive or isSelected instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive or isSelected instead.'
        );
      }
      return null;
    },

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func,

    onEditClick: function(props) {
      if (props.showEdit && typeof props.onEditClick !== 'function') {
        return new Error('onEditClick is required when showEdit is provided.');
      }
      return null;
    },

    onUnlinkClick: function(props) {
      if (props.showUnlink && typeof props.onUnlinkClick !== 'function') {
        return new Error('onUnlinkClick is required when showUnlink is provided.');
      }
      return null;
    },

    onSubscribeClick: function(props) {
      if (props.showSubscribe && typeof props.onSubscribeClick !== 'function') {
        return new Error('onSubscribeClick is required when showSubscribe is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    authString: '',
    disabled: false,
    isSelected: false,
    rootUrl: '',
    showIcons: true,
    thumbSize: 'small',
    isChannelShare: false
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmUnsubscribeOpen: false,
      isHovering: false
    };
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  handleDoubleClick(event) {
    if (typeof this.props.onDoubleClick === 'function') {
      this.props.onDoubleClick(event, this);
    }
  }

  handleMouseEnter() {
    this.setState({
      isHovering: true
    });
  }

  handleMouseLeave() {
    this.setState({
      isHovering: false
    });
  }

  handleEditClick(event) {
    event.stopPropagation();
    const { onEditClick } = this.props;

    if (typeof onEditClick === 'function') {
      onEditClick(event, this);
    }
  }

  handleUnlinkClick(event) {
    event.stopPropagation();
    const { onUnlinkClick } = this.props;

    if (typeof onUnlinkClick === 'function') {
      onUnlinkClick(event, this.props);
    }
  }

  handleDeleteClick(event) {
    event.stopPropagation();
    const { onDeleteClick } = this.props;
    if (typeof onDeleteClick === 'function') {
      onDeleteClick(event, this);
    }
  }

  handleSubscribeClick(event) {
    event.preventDefault();

    if (!this.props.isSubscribed) {
      this.props.onSubscribeClick(event, this);
    } else if (this.props.isSubscribed && !this.state.confirmUnsubscribeOpen) {
      this.setState({ confirmUnsubscribeOpen: true });
    }
  }

  handleConfirmUnsubscribe(event) {
    event.preventDefault();
    this.setState({ confirmUnsubscribeOpen: false });
    this.props.onSubscribeClick(event, this);
  }

  handleCancelUnsubscribe(event) {
    event.preventDefault();
    this.setState({ confirmUnsubscribeOpen: false });
  }

  handleInputChange(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  renderCountNote() {
    const { naming } = this.context.settings;
    const { childCount, childType } = this.props;
    const styles = require('./ChannelItem.less');

    let noteType = '';
    switch (childType) {
      case 'story':
        noteType = (
          <FormattedMessage
            id="n-stories"
            defaultMessage="{itemCount, plural, one {# {story}} other {# {stories}}}"
            values={{ itemCount: childCount, story: naming.story, stories: naming.stories }}
          />
        );
        break;
      case 'group':
        noteType = (
          <FormattedMessage
            id="n-groups"
            defaultMessage="{itemCount, plural, one {# group} other {# groups}}"
            values={{ itemCount: childCount }}
          />
        );
        break;
      default:
        break;
    }
    return (
      <span className={styles.note}>
        {noteType}
      </span>
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      id,
      name,
      thumbnail,
      childCount,
      note,
      isFeed,
      isHidden,
      isPersonal,
      grid,
      showCheckbox,
      isActive,
      isSelected,
      disabled,
      thumbSize,
      showIcons,
      showAdmin,
      showAdd,
      showEdit,
      showThumb,
      showSubscribe,
      showUnlink,
      showDelete,
      isChannelShare,
      isSubscribed,
      noLink,
      authString,
      className,
      style,
      searchTerm,
      baseColour,
    } = this.props;
    const anchorUrl = this.props.anchorUrl || this.props.rootUrl + '/channel/' + id;
    let thumbWidth = this.props.thumbWidth;

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Ignore thumbSize if thumbWidth is set
    if (!thumbWidth) {
      // Grid sizes
      if (grid) {
        switch (thumbSize) {
          case 'small':
            thumbWidth = 46;
            break;
          case 'medium':
            thumbWidth = 150;
            break;
          default:
            thumbWidth = 200;
            break;
        }

        // List sizes
      } else {
        switch (thumbSize) {
          case 'small':
            thumbWidth = 46;
            break;
          case 'medium':
            thumbWidth = 66;
            break;
          default:
            thumbWidth = 90;
            break;
        }
      }
    }

    const styles = require('./ChannelItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      ChannelItem: true,
      isActive: isActive,
      showAdmin: showAdmin,
      listItem: !grid,
      gridItem: grid,

      listItemLarge: !grid && thumbSize === 'large',
      listItemMedium: !grid && thumbSize === 'medium',
      listItemSmall: !grid && thumbSize === 'small',

      gridItemLarge: grid && thumbSize === 'large',
      gridItemMedium: grid && thumbSize === 'medium',
      gridItemSmall: grid && thumbSize === 'small',

      noLink: noLink,
      showEdit: showEdit,

      noWrap: showAdmin
    }, className);

    // Merge passed style with grid thumbWidth
    const itemStyle = {
      ...style,
      width: (style && !style.width || grid) ? thumbWidth + 'px' : 'auto'
    };

    const thumbClasses = cx({
      thumbnail: true,
      listThumbnail: !grid,
      gridThumbnail: grid
    });

    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth,
      backgroundColor: (!showThumb || !thumbnail) ? this.props.colour : false,
      backgroundImage: (showThumb && thumbnail) ? 'url(' + thumbnail + authString + ')' : false
    };

    const highlightedTextStyle = {
      backgroundColor: tinycolor(baseColour).lighten(15).toString()
    };

    const hasActions = showAdmin && !grid && (showEdit || showAdd || showUnlink || showDelete || isChannelShare);

    const itemContent = (
      <div className={styles.wrapper}>
        <TransitionGroup>
          {this.state.confirmUnsubscribeOpen && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={styles.confirmUnsubscribe}>
              <p>{strings.confirmUnsubscribe}</p>
              <ul>
                <li onClick={this.handleCancelUnsubscribe}><span>{strings.cancel}</span></li>
                <li onClick={this.handleConfirmUnsubscribe}><span className={styles.confirm}>{strings.unsubscribe}</span></li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
        {showCheckbox && <Checkbox
          name={'channel-' + id}
          value={id}
          checked={isSelected}
          disabled={disabled}
          onChange={this.handleInputChange}
          className={styles.checkbox}
        />}
        <div className={thumbClasses} style={thumbStyle}>
          {showIcons && isFeed && <span aria-label={strings.feed} className={styles.isFeed} />}
          {showIcons && isHidden && <span aria-label={strings.hidden} className={styles.isHidden} />}
          {showIcons && (isPersonal && !isFeed) && <span aria-label={strings.personal} className={styles.isPersonal} />}
        </div>
        <div className={styles.info}>
          <span className={styles.name}>
            <Highlighter
              highlightClassName={styles.highlight}
              highlightStyle={(isActive || this.state.isHovering) && highlightedTextStyle || null}
              searchWords={[searchTerm]}
              autoEscape
              textToHighlight={name}
            />
            {!showAdmin && showEdit && <Btn icon="edit" borderless onClick={this.handleEditClick} />}
          </span>
          {note && <span className={styles.note}>{note}</span>}
          {(!note && childCount >= 0) && this.renderCountNote()}
        </div>
        {this.props.children}
        {!grid && showSubscribe &&
        <Btn
          small={thumbSize === 'small'}
          inverted={isSubscribed}
          onClick={this.handleSubscribeClick}
        >
          {isSubscribed ? strings.unsubscribe : strings.subscribe}
        </Btn>}
        {hasActions && <UserActions
          id={id}
          showFollow={false}
          showPlus={showAdd && !isActive}
          showTick={showAdd && isActive}
          showEdit={showEdit && (grid || this.state.isHovering)}
          showUnlink={showUnlink && !grid && this.state.isHovering}
          showDelete={showDelete && !grid && this.state.isHovering}
          onEditClick={this.handleEditClick}
          onUnlinkClick={this.handleUnlinkClick}
          onDeleteClick={this.handleDeleteClick}
          showShare={isChannelShare}
        />}
      </div>
    );

    if (noLink) {
      return (
        <div
          aria-label={name}
          data-id={id}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          className={itemClasses}
          style={itemStyle}
          title={name}
        >
          {itemContent}
        </div>
      );
    }

    return (
      <div
        aria-label={name}
        data-id={id}
        className={itemClasses}
        style={itemStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <a href={anchorUrl} title={name} onClick={this.handleClick}>
          {itemContent}
        </a>
      </div>
    );
  }
}
