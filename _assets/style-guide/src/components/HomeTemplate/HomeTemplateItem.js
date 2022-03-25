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
import _chunk from 'lodash/chunk';
import { Link } from 'react-router-dom';

import AppViewer from 'components/ViewerFiles/AppViewer/AppViewer';
import Blankslate from 'components/Blankslate/Blankslate';
import FeaturedList from 'components/FeaturedList/FeaturedList';
import FeaturedSlider from 'components/FeaturedSlider/FeaturedSlider';
import ResponsiveList from 'components/ResponsiveList/ResponsiveList';
import Carousel from 'components/Carousel/Carousel';
import BookmarkItemNew from 'components/BookmarkItemNew/BookmarkItemNew';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import UserItemNew from 'components/UserItemNew/UserItemNew';
import FileItemNew from 'components/FileItemNew/FileItemNew';
import FeaturedStoryItem from 'components/FeaturedStoryItem/FeaturedStoryItem';
import StoryCardWrapper from 'components/StoryCard/StoryCardWrapper';

/* eslint-disable dot-notation */

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * HomeTemplateItem are modules for custom Home Screens.
 */
export default class HomeTemplateItem extends PureComponent {
  static propTypes = {
    /** unique identifier */
    i: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

    /** optional title */
    title: PropTypes.string,

    /** valid module type */
    type: PropTypes.oneOf([
      'btca',
      'featured-list',
      'file-list',
      'story-list',
      'user-list',
      'bookmark-list'
    ]),

    /** string for lists, number (fileId) for btca */
    source: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** only for btca module */
    baseUrl: PropTypes.string,

    /** only for list modules */
    list: PropTypes.array,
    limit: PropTypes.number,
    grid: PropTypes.bool,
    showBadges: PropTypes.bool,
    showThumb: PropTypes.bool,

    /** module data has loaded */
    loaded: PropTypes.bool,

    breakpoint: PropTypes.string,

    authString: PropTypes.string,
    strings: PropTypes.object,

    /** Calls on mount if list empty */
    onGetData: PropTypes.func.isRequired,

    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func,
    onFilesClick: PropTypes.func,
    onStoryClick: PropTypes.func.isRequired,
    onUserClick: PropTypes.func,
    onFollowClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,


    /** showStoryAuthor */
    showStoryAuthor: PropTypes.bool,
  };

  static defaultProps = {
    list: [],
    authString: '',
    strings: {
      emptyFeaturedStoryListHeading: 'No Featured Stories available',
      emptyStoryListHeading: 'No Stories available',
      emptyUserListHeading: 'No People available',
      emptyFileListHeading: 'No Files available',
      emptyBookmarkListHeading: 'No Bookmarks available',
      showAll: 'Show All'
    },
    showStoryAuthor: true,
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    switch (this.props.type) {
      case 'featured-list':
      case 'file-list':
      case 'story-list':
      case 'user-list':
      case 'bookmark-list':
        if (!this.props.list || !this.props.list.length) {
          this.props.onGetData(this.props.i);
        }
        break;
      default:
        break;
    }
  }

  render() {
    const {
      i,
      type,
      title,
      list,
      loaded,
      limit,
      grid,
      showBadges,
      showThumb,
      authString,
      fileSettings,
      strings,
      onAnchorClick,
      onFileClick,
      onFilesClick,
      onStoryClick,
      onUserClick,
      showStoryAuthor,
      isNewDesign,
      ...others
    } = this.props;
    const styles = require('./HomeTemplateItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      HomeTemplateItem: true,
      borderLine: isNewDesign,
      gridList: grid,
      newHeaderStyle: isNewDesign,
      leaderboardHeaderStyle: isNewDesign && type === 'user-list',
      [type]: true,
      newFeaturedList: type === 'featured-list' && isNewDesign,
    }, this.props.className);

    // Responsive Rules
    const rules = {
      'mobile-xs': grid ? 'medium' : 'small',
      'mobile': grid ? 'medium' : 'small',
      'tablet': type === 'user' ? 'small' : 'medium',
      'desktop': 'large',
      'desktop-xl': 'large'
    };

    switch (type) {
      case 'file-list':
        rules['mobile-xs'] = 'small';
        rules['mobile'] = grid ? 'medium' : 'small';
        rules['tablet'] = 'medium';
        rules['desktop'] = 'medium';
        rules['desktop-xl'] = 'medium';
        break;
      case 'user-list':
        rules['mobile-xs'] = 'small';
        rules['mobile'] = grid ? 'medium' : 'small';
        rules['tablet'] = 'medium';
        rules['desktop'] = 'medium';
        rules['desktop-xl'] = 'medium';
        break;
      case 'story-list':
        rules['mobile-xs'] = 'small';
        rules['mobile'] = grid ? 'medium' : 'small';
        rules['tablet'] = 'medium';
        rules['desktop'] = 'medium';
        rules['desktop-xl'] = 'medium';
        break;
      default:
        break;
    }

    let Comp;
    let showHeader = true;
    switch (type) {
      case 'btca':
        Comp = (<AppViewer
          baseUrl={this.props.baseUrl}
          referrer={document.location.origin}
          handle={`home-module-${i}`}
        />);
        showHeader = false;
        break;
      case 'featured-list': {
        // Are minimum Featured Stories available?
        const minFeaturedCount = 3;
        const minFeatured = list.filter(s => s.isFeatured).length >= minFeaturedCount;
        const featuredStories = list.filter(s => s.isFeatured);
        const normalStories = _chunk(list.filter(s => !s.isFeatured), 2);
        const featuredItems = [...featuredStories, ...normalStories];

        if (loaded && !list.length) {
          Comp = (<Blankslate
            icon="content"
            heading={strings.emptyFeaturedStoryListHeading}
            middle
          />);
        } else if (loaded && isNewDesign) {
          Comp = (<Carousel
            itemSize={420}
            itemMargin={20}
            loading={!loaded}
            className={styles.newFeaturedStoryModule}
            isCircularCarousel
          >
            {featuredItems.map((item, ix) => (
              item.isFeatured &&
              <FeaturedStoryItem
                key={ix}
                {...item}
                {...{ authString }}
                {...{ onAnchorClick }}
              /> ||
              <StoryCardWrapper
                key={ix}
                list={item}
                onClickHandler={onAnchorClick}
                strings={strings}
                thumbSize="small"
              />
            ))}
          </Carousel>);
        } else if (loaded && minFeatured) {
          Comp = (<FeaturedSlider
            showStoryAuthor={showStoryAuthor}
            list={list}
            loading={!loaded}
            autoSlide
            showBadges={showBadges}
            initialSlide={3}
            authString={authString}
            onAnchorClick={onAnchorClick}
            onStoryClick={onStoryClick}
            className={styles.featuredSlider}
          />);
        } else if (loaded && !minFeatured) {
          Comp = (<FeaturedList
            showStoryAuthor={showStoryAuthor}
            list={list}
            loading={!loaded}
            showBadges={showBadges}
            authString={authString}
            onAnchorClick={onAnchorClick}
            onStoryClick={onStoryClick}
          />);
        }
        showHeader = false;
        break;
      }
      case 'bookmark-list':
        Comp = (<Carousel
          dots
          itemSize={200}
          itemMargin={20}
          icon="bookmark"
          emptyHeading={strings.emptyBookmarkListHeading}
          loading={!loaded}
        >
          {list.slice(0, limit).map((item, ix) => (
            <BookmarkItemNew
              key={ix}
              {...item}
              grid
              {...{ authString }}
              fileSettings={fileSettings}
              showBadges
              showThumb
              thumbSize="medium"
              {...{ onFilesClick }}
              {...{ onStoryClick }}
            />
          ))}
        </Carousel>);
        break;
      case 'story-list': {
        const limitList = list.slice(0, limit);
        if (isNewDesign) {
          const isStoryCard = this.props.view === 'card';
          Comp = (
            <Carousel
              itemSize={isStoryCard ? 420 : 200}
              itemMargin={20}
              dots
              thumbSize="small"
              icon="story"
              emptyHeading={strings.emptyStoryListHeading}
              loading={!loaded}
            >
              {isStoryCard ? _chunk(limitList, 2).map((item, ix) => (
                <StoryCardWrapper
                  key={ix}
                  list={item}
                  thumbSize="small"
                  onClickHandler={onStoryClick}
                  {...{ authString }}
                />
              )) : limitList.map((item, ix) => (
                <StoryItemNew
                  key={ix}
                  {...item}
                  {...{ authString }}
                  thumbSize="medium"
                  grid={this.props.view === 'grid'}
                  onClick={onStoryClick}
                />
              ))}
            </Carousel>
          );
        } else {
          Comp = (<ResponsiveList
            {...others}
            breakpoint={this.props.breakpoint}
            rules={rules}
            list={limitList}
            loading={!loaded}
            grid={grid}
            icon={type}
            emptyHeading={strings[`empty${capitalizeFirstLetter(type)}ListHeading`]}
            emptyMessage=""
            itemProps={{
              authString: authString,
              showBadges: grid && showBadges,
              showThumb: type === 'file-list' && !grid ? false : showThumb,
              hideMeta: true,
              showAuthor: showStoryAuthor
            }}
            onItemClick={onStoryClick}
            className={styles.list}
          />);
        }
        break;
      }
      case 'user-list': {
        if (isNewDesign) {
          Comp = (<Carousel
            dots
            itemSize={200}
            itemMargin={20}
            icon="group"
            emptyHeading={strings.emptyUserListHeading}
            loading={!loaded}
          >
            {list.slice(0, limit).map((item, ix) => (
              <UserItemNew
                key={ix}
                {...item}
                grid
                hasUserActions
                {...{ authString }}
                onClick={onUserClick}
                onFollowClick={this.props.onFollowClick}
              />
            ))}
          </Carousel>);
        } else {
          Comp = (<ResponsiveList
            {...others}
            breakpoint={this.props.breakpoint}
            rules={rules}
            list={list.slice(0, limit)}
            loading={!loaded}
            grid={grid}
            icon={type}
            emptyHeading={strings[`empty${capitalizeFirstLetter(type)}ListHeading`]}
            emptyMessage=""
            itemProps={{
              authString: authString,
              showBadges: grid && showBadges,
              showThumb: type === 'file-list' && !grid ? false : showThumb,
              hideMeta: true,
              showAuthor: showStoryAuthor
            }}
            onItemClick={onAnchorClick}
            className={styles.list}
          />);
        }
        break;
      }
      case 'file-list': {
        if (isNewDesign) {
          Comp = (<Carousel
            dots
            itemSize={200}
            itemMargin={20}
            icon="files"
            emptyHeading={strings.emptyFileListHeading}
            loading={!loaded}
          >
            {list.slice(0, limit).map((item, ix) => (
              <FileItemNew
                key={ix}
                fileSettings={fileSettings}
                {...item}
                grid
                {...{ authString }}
                onClick={onFilesClick}
              />
            ))}
          </Carousel>);
        } else {
          Comp = (<ResponsiveList
            {...others}
            breakpoint={this.props.breakpoint}
            rules={rules}
            list={list.slice(0, limit)}
            loading={!loaded}
            grid={grid}
            icon={type}
            emptyHeading={strings[`empty${capitalizeFirstLetter(type)}ListHeading`]}
            emptyMessage=""
            itemProps={{
              authString: authString,
              showBadges: grid && showBadges,
              showThumb: type === 'file-list' && !grid ? false : showThumb,
              hideMeta: true,
              showAuthor: showStoryAuthor
            }}
            onItemClick={onFileClick}
            className={styles.list}
          />);
        }
        break;
      }
      default:
        console.info('Unsupported type: ' + type);  // eslint-disable-line
        break;
    }

    return (
      <div className={classes}>
        {showHeader && <header>
          <h4 className={styles.title}>
            {this.props.i !== 'featured-stories' && strings[this.props.i] || title}
          </h4>
          {type === 'user-list' && <Link to="/people/all">{strings.showAll}</Link>}
          {type === 'bookmark-list' && <Link to="/bookmarks">{strings.showAll}</Link>}
        </header>}
        {Comp}
      </div>
    );
  }
}
