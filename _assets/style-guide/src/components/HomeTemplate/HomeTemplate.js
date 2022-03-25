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
 * @author Jason huang <jason.huang@bigtincan.com>
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { Responsive, WidthProvider } from 'react-grid-layout';

import Blankslate from 'components/Blankslate/Blankslate';

import HomeTemplateItem from './HomeTemplateItem';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const messages = defineMessages({
  noHomeTemplateModulesHeading: { id: 'no-home-template-modules-heading', defaultMessage: 'No Home Screen Modules set' },
  noHomeTemplateModulesMessage: { id: 'no-home-template-modules-message', defaultMessage: 'Please contact your Administrator' },

  emptyFeaturedStoryListHeading: { id: 'no-featured-stories-available', defaultMessage: 'No Featured {stories} available' },
  emptyStoryListHeading: { id: 'no-stories-available', defaultMessage: 'No {stories} available' },
  emptyUserListHeading: { id: 'no-people-available', defaultMessage: 'No People available' },
  emptyFileListHeading: { id: 'no-files-available', defaultMessage: 'No Files available' },
  emptyBookmarkListHeading: { id: 'no-bookmarks-available', defaultMessage: 'No Bookmarks available' },
  showAll: { id: 'show-all', defaultMessage: 'Show All' },
  'popular-stories': { id: 'popular-stories', defaultMessage: 'Popular {stories}' },
  leaderboard: { id: 'leaderboard', defaultMessage: 'Leaderboard' },
  bookmarks: { id: 'my-bookmarks', defaultMessage: 'My Bookmarks' },
  'recommended-stories': { id: 'recommended-stories', defaultMessage: 'Recommended {stories}' },
  'latest-stories': { id: 'latest-stories', defaultMessage: 'Latest {stories}' },
  'top-stories': { id: 'top-stories', defaultMessage: 'Top {stories}' },
  'featured-stories': { id: 'featured-stories', defaultMessage: 'Featured {stories}' },
  files: { id: 'files', defaultMessage: 'Files' }
});

/**
 * HomeTemplate is displayed on the Hub's home page.
 */
export default class HomeTemplate extends PureComponent {
  static propTypes = {
    /** Template modules */
    items: PropTypes.array,

    /** Set named breakpoints in pixels */
    breakpoints: PropTypes.object,

    /** Set number of columns by breakpoint name */
    cols: PropTypes.object,

    /** userCapabilities */
    hasStoryBadges: PropTypes.bool,

    /** showStoryAuthor */
    showStoryAuthor: PropTypes.bool,

    onAnchorClick: PropTypes.func,
    onFileClick: PropTypes.func,
    onFilesClick: PropTypes.func,

    onStoryClick: PropTypes.func,
    onUserClick: PropTypes.func,
    onFollowClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    items: [],
    breakpoints: {
      'mobile-xs': 0,
      'mobile': 575,
      'tablet': 768,
      'desktop': 950,
      'desktop-xl': 1129
    },
    cols: {
      'mobile-xs': 3,
      'mobile': 6,
      'tablet': 6,
      'desktop': 12,
      'desktop-xl': 12
    },
    showStoryAuthor: true,
  };

  static contextTypes = {
    media: PropTypes.array.isRequired,
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      layouts: props.items ? this.parseLayouts(props.items, props.cols) : null,
      breakpoint: 'desktop-xl'
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { cols } = this.props;
    const b = this.context.media[0];
    if (b && cols[b]) {
      this.setState({
        breakpoint: b
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.setState({
        layouts: this.parseLayouts(nextProps.items, nextProps.cols)
      });
    }
  }

  // Create responsive layouts for modules
  // compatible with react-grid-layout
  parseLayouts(items, cols) {
    const layoutMobileXs = [];
    const layoutMobile = [];
    const layoutTablet = [];
    const layoutDesktop = [];
    const layoutDesktopXl = [];

    items.forEach((item) => {
      // desktop-xl is default
      layoutDesktopXl.push({
        i: item.i,
        x: item.layout.x,
        y: item.layout.y,
        h: item.layout.h,
        w: item.layout.w,
      });

      // desktop matches desktop-xl
      layoutDesktop.push({
        i: item.i,
        x: item.layout.x,
        y: item.layout.y,
        h: item.layout.h,
        w: item.layout.w,
      });

      // tablet
      layoutTablet.push({
        i: item.i,
        x: item.layout.x / 2,
        y: item.layout.y,
        h: item.layout.h,
        w: item.layout.w / 2,
      });

      // mobile
      layoutMobile.push({
        i: item.i,
        x: item.layout.x / 2,
        y: item.layout.y,
        h: item.layout.h,
        w: item.layout.w / 2,
      });

      // mobile-xs (single column)

      // grid items take up little space
      let mobileXsHeight = item.layout.h;
      if (item.grid && item.list && item.list.length) {
        mobileXsHeight = Math.ceil(item.list.length / 6);  // new row every 6 items
      }
      layoutMobileXs.push({
        i: item.i,
        x: 0,
        y: Infinity,  // place last
        h: mobileXsHeight,
        w: cols['mobile-xs']
      });
    });

    return {
      'mobile-xs': layoutMobileXs,
      'mobile': layoutMobile,
      'tablet': layoutTablet,
      'desktop': layoutDesktop,
      'desktop-xl': layoutDesktopXl
    };
  }

  handleBreakpointChange(newBreakpoint) {
    this.setState({
      breakpoint: newBreakpoint
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString, naming, fileSettings } = this.context.settings;
    const { breakpoint, layouts } = this.state;
    const { breakpoints, cols, items, hasStoryBadges, showStoryAuthor } = this.props;
    const styles = require('./HomeTemplate.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      HomeTemplate: true,
      isEmpty: !items.length
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Row height by breakpoint
    let margin = [20, 20];
    let rowHeight = 120;  // desktop-xl (match TemplateEditor)
    switch (breakpoint) {
      case 'mobile-xs':
        margin = [10, 10];
        rowHeight = 82;
        break;
      case 'mobile':
        margin = [16, 16];
        rowHeight = 90;
        break;
      case 'tablet':
        rowHeight = 100;
        break;
      default:
        break;
    }

    // Apply full height to single BTCA
    const isSingleBtca = items.length === 1 && items[0].type === 'btca';

    return (
      <div className={classes} style={this.props.style}>
        {!items.length && <Blankslate
          icon="browser"
          middle
          heading={strings.noHomeTemplateModulesHeading}
          message={strings.noHomeTemplateModulesMessage}
        />}
        {isSingleBtca && <div className={styles.singleBtca}>
          <HomeTemplateItem
            {...items[0]}
            showThumb
            showBadges={hasStoryBadges}
            authString={authString}
            fileSettings={fileSettings}
            strings={strings}
            breakpoint={this.state.breakpoint}
            onAnchorClick={this.props.onAnchorClick}
            onStoryClick={this.props.onStoryClick}
            onGetData={this.props.onGetItemData}
            showStoryAuthor={showStoryAuthor}
          />
        </div>}
        {!isSingleBtca && <ResponsiveReactGridLayout
          breakpoints={breakpoints}
          cols={cols}
          layouts={layouts}
          rowHeight={rowHeight}
          margin={items[0].isNewDesign ? [0, 0] : margin}
          containerPadding={items[0].isNewDesign ? [0, 0] : [45, 0]}
          measureBeforeMount
          isDraggable={false}
          isResizable={false}
          onBreakpointChange={this.handleBreakpointChange}
        >
          {items.map(item => (
            <div key={item.i} className={styles.gridItem}>
              <HomeTemplateItem
                {...item}
                showThumb
                showBadges={hasStoryBadges}
                showStoryAuthor={showStoryAuthor}
                fileSettings={fileSettings}
                authString={authString}
                strings={strings}
                breakpoint={this.state.breakpoint}
                onAnchorClick={this.props.onAnchorClick}
                onFileClick={this.props.onFileClick}
                onFilesClick={this.props.onFilesClick}
                onStoryClick={this.props.onStoryClick}
                onUserClick={this.props.onUserClick}
                onFollowClick={this.props.onFollowClick}
                onGetData={this.props.onGetItemData}
              />
            </div>
          ))}
        </ResponsiveReactGridLayout>}
      </div>
    );
  }
}
