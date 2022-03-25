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

import AppViewer from 'components/ViewerFiles/AppViewer/AppViewer';
import FeaturedList from 'components/FeaturedList/FeaturedList';
import FeaturedSlider from 'components/FeaturedSlider/FeaturedSlider';
import List from 'components/List/List';
import Carousel from 'components/Carousel/Carousel';
import BookmarkItemNew from 'components/BookmarkItemNew/BookmarkItemNew';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import UserItemNew from 'components/UserItemNew/UserItemNew';
import FileItemNew from 'components/FileItemNew/FileItemNew';
import FeaturedStoryItem from 'components/FeaturedStoryItem/FeaturedStoryItem';
import StoryCardWrapper from 'components/StoryCard/StoryCardWrapper';

/**
 * TemplateEditorItem description
 */
export default class TemplateEditorItem extends PureComponent {
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

    /** edit mode */
    edit: PropTypes.bool,

    /** module data has loaded */
    loaded: PropTypes.bool,

    /** module is part of a template that has not been saved */
    isNew: PropTypes.bool,

    authString: PropTypes.string,
    strings: PropTypes.object,

    /** Calls on mount */
    onGetData: PropTypes.func.isRequired,

    /** Returns DOM node -- used to get position */
    onEditChange: PropTypes.func,

    /** Renders an Edit link */
    onEditClick: PropTypes.func,

    /** Renders a Delete link */
    onDeleteClick: PropTypes.func,

    /** Called on mount, allows parent to scroll to item */
    onScrollTo: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: [],
    authString: '',
    strings: {
      edit: 'Edit',
      remove: 'Remove',
      editNote: 'Edit list on the side panel',
      noFilesToDisplay: 'No files to display',
      noStoriesToDisplay: 'No Stories to display',
      noPeopleToDisplay: 'No people to display',
      noBookmarkToDisplay: 'No bookmarks to display',
      moduleEmptyListMessage: 'Select a source to populate this module',
      bookmarkEmptyListMessage: 'Bookmark some content to populate this module'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.elem = null;
  }

  UNSAFE_componentWillMount() {
    switch (this.props.type) {
      case 'featured-list':
      case 'file-list':
      case 'story-list':
      case 'user-list':
      case 'bookmark-list':
        if (this.props.source !== '' && (!this.props.list || !this.props.list.length)) {
          this.props.onGetData(this.props.i);
        }
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    if (this.props.isNew) {
      this.props.onScrollTo(this.elem);
    }

    if (this.props.edit) {
      this.props.onEditChange(this.elem);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.source !== this.props.source) {
      this.props.onGetData(this.props.i);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.edit && !prevProps.edit) {
      this.props.onEditChange(this.elem);
    }

    // Allow react-grid animations to end
    if (this.props.edit && this.props.layout !== prevProps.layout) {
      setTimeout(() => {
        this.props.onEditChange(this.elem);
      }, 200);
    }
  }

  handleClick(event) {
    if (this.props.edit) {
      event.stopPropagation();
    }
  }

  handlePreventClick(event) {
    event.preventDefault();
  }

  handleEditClick(event) {
    event.preventDefault();
    this.props.onEditClick(this.props.i, event);
  }

  handleDeleteClick(event) {
    event.preventDefault();
    this.props.onDeleteClick(this.props.i);
  }

  render() {
    const {
      i,
      type,
      title,
      source,
      list,
      limit,
      grid,
      edit,
      loaded,
      strings,
      authString,
      onEditClick,
      onDeleteClick,
      isNewDesign,
      ...others
    } = this.props;
    const styles = require('./TemplateEditorItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      TemplateEditorItem: true,
      gridList: grid,
      editMode: edit,
      [type]: true,
      hideResizeHandle: isNewDesign,
      featuredListNew: type === 'featured-list' && isNewDesign
    }, this.props.className);

    // Types with no options
    const noOptionTypes = ['btca', 'featured-list', 'bookmark-list'];

    let Comp;
    let showEdit = typeof onEditClick === 'function' && noOptionTypes.indexOf(type) === -1;
    let showTitle = true;
    switch (type) {
      case 'btca':
        Comp = (<AppViewer
          baseUrl={this.props.baseUrl}
          referrer={document.location.origin}
          handle={`home-module-${i}`}
          className={styles.btca}
        />);
        showTitle = false;
        break;
      case 'featured-list': {
        // Are minimum Featured Stories available?
        const minFeaturedCount = 3;
        const minFeatured = list.filter(s => s.isFeatured).length >= minFeaturedCount;
        const featuredStories = list.filter(s => s.isFeatured);
        const normalStories = _chunk(list.filter(s => !s.isFeatured), 2);
        const featuredItems = [...featuredStories, ...normalStories];

        if (loaded && isNewDesign) {
          Comp = (<Carousel
            itemSize={420}
            itemMargin={20}
            loading={source !== '' && !loaded}
            className={styles.newFeaturedStoryModule}
          >
            {featuredItems.map((item, ix) => (
              item.isFeatured &&
              <FeaturedStoryItem
                key={ix}
                {...item}
                {...{ authString }}
                onAnchorClick={this.handlePreventClick}
              /> ||
              <StoryCardWrapper
                key={ix}
                list={item}
                onClickHandler={this.handlePreventClick}
                {...{ strings }}
                thumbSize="small"
                {...{ authString }}
              />
            ))}
          </Carousel>);
        } else if (loaded && minFeatured) {
          Comp = (<FeaturedSlider
            list={list}
            loading={!loaded}
            showBadges
            initialSlide={3}
            authString={authString}
            onAnchorClick={this.handlePreventClick}
            onStoryClick={this.handlePreventClick}
            className={styles.featuredList}
          />);
        } else if (loaded && !minFeatured) {
          Comp = (<FeaturedList
            list={list}
            loading={!loaded}
            showBadges
            authString={authString}
            onAnchorClick={this.handlePreventClick}
            onStoryClick={this.handlePreventClick}
            className={styles.featuredList}
          />);
        }
        showEdit = false;
        showTitle = false;
        break;
      }
      case 'bookmark-list': {
        Comp = (<Carousel
          dots
          itemSize={200}
          itemMargin={20}
          icon="bookmark"
          emptyHeading={strings.noBookmarkToDisplay}
          emptyMessage={strings.bookmarkEmptyListMessage}
          loading={source !== '' && !loaded}
        >
          {list.slice(0, limit).map((item, ix) => (
            <BookmarkItemNew
              key={ix}
              {...item}
              grid
              {...{ authString }}
              showBadges
              showThumb
              thumbSize="medium"
              onFilesClick={this.handlePreventClick}
              onStoryClick={this.handlePreventClick}
            />
          ))}
        </Carousel>);
        showEdit = false;
        break;
      }
      case 'user-list': {
        if (isNewDesign) {
          Comp = (
            <Carousel
              dots
              itemSize={200}
              itemMargin={20}
              icon="group"
              emptyHeading={strings.noPeopleToDisplay}
              emptyMessage={strings.moduleEmptyListMessage}
              loading={source !== '' && !loaded}
            >
              {list.slice(0, limit).map((item, ix) => (
                <UserItemNew
                  key={ix}
                  {...item}
                  hasUserActions
                  grid
                  {...{ authString }}
                />
              ))}
            </Carousel>
          );
        } else {
          Comp = (<List
            {...others}
            list={list.slice(0, limit)}
            loading={source !== '' && !list.length}
            icon="group"
            grid={grid}
            emptyHeading={strings.noPeopleToDisplay}
            emptyMessage={strings.moduleEmptyListMessage}
            itemProps={{
              hideMeta: true,
              showThumb: true,
              thumbSize: 'medium',
              noLink: true
            }}
            onItemClick={this.handlePreventClick}
            className={styles.list}
          />);
        }
        break;
      }
      case 'story-list': {
        const limitList = list.slice(0, limit);
        if (this.props.isNewDesign) {
          const isStoryCard = this.props.view === 'card';

          Comp = (
            <Carousel
              itemSize={isStoryCard ? 420 : 200}
              itemMargin={20}
              dots
              thumbSize="small"
              icon="story"
              emptyHeading={strings.noStoriesToDisplay}
              emptyMessage={strings.moduleEmptyListMessage}
              {...{ loaded }}
            >
              {isStoryCard ? _chunk(limitList, 2).map((item, ix) => (
                <StoryCardWrapper
                  key={ix}
                  list={item}
                  onStoryClick={this.handlePreventClick}
                  thumbSize="small"
                  {...{ authString }}
                  {...others}
                />
              )) : limitList.map((item, ix) => (
                <StoryItemNew
                  key={ix}
                  grid={this.props.view === 'grid'}
                  onClick={this.handlePreventClick}
                  thumbSize="medium"
                  {...{ authString }}
                  {...item}
                  {...others}
                />
              ))}
            </Carousel>
          );
        } else {
          Comp = (<List
            {...others}
            list={limitList}
            loading={source !== '' && !list.length}
            icon="story"
            grid={grid}
            emptyHeading={strings.noStoriesToDisplay}
            emptyMessage={strings.moduleEmptyListMessage}
            itemProps={{
              hideMeta: true,
              showThumb: true,
              thumbSize: 'medium',
              noLink: true
            }}
            onItemClick={this.handlePreventClick}
            className={styles.list}
          />);
        }
        break;
      }
      case 'file-list': {
        if (isNewDesign) {
          Comp = (
            <Carousel
              dots
              itemSize={200}
              itemMargin={20}
              icon="files"
              emptyHeading={strings.noFilesToDisplay}
              emptyMessage={strings.moduleEmptyListMessage}
              loading={source !== '' && !loaded}
            >
              {list.slice(0, limit).map((item, ix) => (
                <FileItemNew
                  key={ix}
                  {...item}
                  grid
                  {...{ authString }}
                  onClick={this.handlePreventClick}
                />
              ))}
            </Carousel>
          );
        } else {
          Comp = (<List
            {...others}
            list={list.slice(0, limit)}
            loading={source !== '' && !list.length}
            icon="files"
            grid={grid}
            emptyHeading={strings.noFilesToDisplay}
            emptyMessage={strings.moduleEmptyListMessage}
            itemProps={{
              hideMeta: true,
              showThumb: true,
              thumbSize: 'medium',
              noLink: true
            }}
            onItemClick={this.handlePreventClick}
            className={styles.list}
          />);
        }
        break;
      }
      default:
        console.info('Unsupported type: ' + type);  // eslint-disable-line
        return null;
    }

    return (
      <div ref={(c) => { this.elem = c; }} className={classes} onClick={this.handleClick}>
        <header className={isNewDesign ? styles.newHeaderStyle : null}>
          <div className={styles.actions}>
            {showEdit && <span
              aria-label={strings.edit}
              data-id="edit"
              onClick={this.handleEditClick}
            >
              {strings.edit}
            </span>}
            <span
              aria-label={strings.delete}
              data-id="delete"
              className={styles.delete}
              onClick={this.handleDeleteClick}
            />
          </div>
          {showTitle && <h4 className={styles.title}>{title}</h4>}
        </header>
        {Comp}
      </div>
    );
  }
}
