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

import { defineMessages, FormattedDate } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Icon from 'components/Icon/Icon';
import Checkbox from 'components/Checkbox/Checkbox';
import StoryBadges from 'components/StoryBadges/StoryBadges';
import StoryThumb from 'components/StoryThumb/StoryThumb';

const messages = defineMessages({
  confirmUnsubscribe: { id: 'are-you-sure-unsubscribe', defaultMessage: 'Are you sure you want to unsubscribe?' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  subscribed: { id: 'subscribed', defaultMessage: 'Subscribed' },
  subscribe: { id: 'subscribe', defaultMessage: 'Subscribe' },
  unsubscribe: { id: 'unsubscribe', defaultMessage: 'Unsubscribe' },
});

class StoryPreview extends PureComponent {
  render() {
    const { children, excerpt, updated, styles, ...others } = this.props;
    const trimmedExcerpt = excerpt.length < 90 ? excerpt : (`${excerpt.slice(0, 89)}...`);
    return (
      <div {...others}>
        <div className={styles.excerpt}>{trimmedExcerpt}</div>
        <div className={styles.updated}>
          <FormattedDate
            value={updated}
            day="2-digit"
            month="short"
            year="numeric"
          />
        </div>
        {children}
      </div>
    );
  }
}

/**
 * Clickable StoryItem generally displayed in a List.
 */
export default class StoryItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    permId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,

    /** coloured tile if thumbnail not enabled or available */
    colour: PropTypes.string.isRequired,

    author: PropTypes.object,
    excerpt: PropTypes.string,
    updated: PropTypes.number,
    isProtected: PropTypes.bool,
    isSubscribed: PropTypes.bool,

    /** pass a string or property (i.e. <code>role</code>) */
    note: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    /** Allows nesting the default <code>/story/{id}</code> anchor href */
    rootUrl: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Marks checkbox as checked */
    isSelected: PropTypes.bool,

    /** Show checkbox */
    showCheckbox: PropTypes.bool,

    /** Show Author */
    showAuthor: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
    thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** displays Story badges (if badgeTitle is set) */
    showBadges: PropTypes.bool,

    /** displays indicator icons (like, comments etc.) */
    showIcons: PropTypes.bool,

    /** Allows users to unsubscribe from a Story */
    showSubscribe: PropTypes.bool,

    /** Set to false to suppress Quicklink edit button (Archive) */
    showQuicklinkEdit: PropTypes.bool,

    /** Set to true to show Quick edit button  */
    showQuickEdit: PropTypes.bool,

    /** Grey out the checkbox in list view */
    disabled: PropTypes.bool,

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    authString: PropTypes.string,

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

    onClick: PropTypes.func.isRequired,

    onQuickEditClick: PropTypes.func,

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
  };

  static defaultProps = {
    authString: '',
    disabled: false,
    isSelected: false,
    rootUrl: '',
    showQuicklinkEdit: true,
    thumbSize: 'large',
    showQuickEdit: false,
    showAuthor: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmUnsubscribeOpen: false
    };
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();

    // Propagate props to onClick handler
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  handleQuickClick(event) {
    event.preventDefault();
    event.stopPropagation();  // stop event triggering onClick

    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  handleQuickEditClick(event) {
    event.preventDefault();
    event.stopPropagation();  // stop event triggering onClick

    const { onQuickEditClick } = this.props;
    if (typeof onQuickEditClick === 'function') {
      onQuickEditClick(event, this);
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

  render() {
    const { formatMessage } = this.context.intl;
    const {
      id,
      permId,
      name,
      author,
      excerpt,
      updated,
      badgeColour,
      badgeTitle,
      commentCount,
      ratingCount,
      isProtected,
      isSubscribed,
      files,
      isQuicklink,
      isQuickfile,
      quicklinkUrl,
      showQuickEdit,
      children,
      grid,
      isActive,
      isSelected,
      showCheckbox,
      disabled,
      thumbSize,
      showBadges,
      showIcons,
      showSubscribe,
      noLink,
      rootUrl,
      className,
      style,
      showAuthor,
    } = this.props;

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Story anchor URL
    let anchorUrl = rootUrl + '/story/' + (permId || id);

    // Ignore protected & archived stories
    if (!isProtected && this.props.childType !== 'revision') {
      // Quicklink
      if (isQuicklink && quicklinkUrl) {
        anchorUrl = quicklinkUrl;

        // Quickfile
      } else if (isQuickfile && files && files[0]) {
        anchorUrl = '/file/' + files[0].id;
      }
    }

    let thumbWidth = this.props.thumbWidth;

    // thumbSize default widths
    if (!thumbWidth) {
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

    const styles = require('./StoryItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      StoryItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid,

      listItemLarge: !grid && thumbSize === 'large',
      listItemMedium: !grid && thumbSize === 'medium',
      listItemSmall: !grid && thumbSize === 'small',

      gridItemLarge: grid && thumbSize === 'large',
      gridItemMedium: grid && thumbSize === 'medium',
      gridItemSmall: grid && thumbSize === 'small',

      noLink: noLink
    }, className);

    // Hide info if small grid (tooltip shows intead)
    const hideInfo = grid && thumbSize === 'small';

    // Merge passed style with grid thumbWidth
    const itemStyle = {
      ...style,
      width: (style && !style.width || grid) ? thumbWidth + 'px' : 'auto'
    };

    // Default note falls back to role/name
    let noteText = this.props.note;
    if (noteText === undefined && grid && author && showAuthor) {
      noteText = author.role || author.name;

      // List view display role and name by default
    } else if (noteText === undefined && !grid && author && showAuthor) {
      noteText = author.role ? author.role + ' • ' + author.name : author.name;
    }
    const quickDetailBtn = this.props.showQuicklinkEdit ? (
      <Btn
        icon="edit"
        small
        borderless
        onClick={this.handleQuickClick}
        className={styles.openQuicklinkBtn}
      />
    ) : null;

    const quickEditBtn = showQuickEdit ? (
      <Icon
        name="edit-box"
        onClick={this.handleQuickEditClick}
        className={styles.quickEditBtn}
      />
    ) : null;

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
          name={'story-' + permId}
          value={permId}
          checked={isSelected}
          disabled={disabled}
          onChange={this.handleInputChange}
          className={styles.checkbox}
        />}
        <StoryThumb {...this.props} />
        {!hideInfo && <div className={styles.info}>
          {!children && <div>
            <span className={styles.name}>
              {name}
              {!grid && badgeTitle && <StoryBadges
                badgeColour={badgeColour}
                badgeTitle={showBadges ? badgeTitle : ''}
                showIcons={showIcons}
                className={styles.listBadge}
              />}
            </span>
            {noteText && <span className={styles.note}>{noteText}</span>}
          </div>}
          {children}
        </div>}

        <div className={styles.buttonsAndCounts}>
          {!grid && showSubscribe &&
          <Btn
            small={thumbSize === 'small'}
            inverted={isSubscribed}
            onClick={this.handleSubscribeClick}
          >
            {isSubscribed ? strings.subscribed : strings.subscribe}
          </Btn>}

          {!grid && showBadges && (commentCount > 0 || ratingCount > 0) && <StoryBadges
            commentCount={commentCount}
            ratingCount={ratingCount}
            showIcons={showIcons}
            className={styles.counts}
          />}

          {(!grid && showIcons && (isQuickfile || isQuicklink)) && quickDetailBtn}
          {!grid  && quickEditBtn}
        </div>

        {grid && thumbSize !== 'small' &&
        <StoryPreview
          excerpt={excerpt}
          updated={updated * 1000}
          styles={styles}
          className={styles.preview}
          style={{ height: thumbWidth }}
        >
          {(showIcons && (isQuickfile || isQuicklink)) && quickDetailBtn}
        </StoryPreview>}
        {quickEditBtn}
      </div>
    );

    if (noLink) {
      return (
        <div
          aria-label={name}
          data-id={permId || id}
          className={itemClasses}
          style={itemStyle}
          onClick={this.handleClick}
        >
          {itemContent}
        </div>
      );
    }

    return (
      <div
        aria-label={name}
        data-id={permId || id}
        className={itemClasses}
        style={itemStyle}
      >
        <a href={anchorUrl} rel="noopener noreferrer" onClick={this.handleClick}>
          {itemContent}
        </a>
      </div>
    );
  }
}
