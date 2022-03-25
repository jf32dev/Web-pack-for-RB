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

import Draggable from 'react-draggable';

import Btn from 'components/Btn/Btn';
import RangeSlider from 'components/RangeSlider/RangeSlider';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Select from 'components/Select/Select';
import Text from 'components/Text/Text';

/**
 * TemplateEditorEditItem description
 */
export default class TemplateEditorEditItem extends PureComponent {
  static propTypes = {
    /** unique identifier */
    i: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /** optional title */
    title: PropTypes.string,

    /** valid module type */
    type: PropTypes.oneOf([
      'btca',
      'featured-list',
      'file-list',
      'story-list',
      'user-list',
    ]),

    /** module is part of a template that has not been saved */
    isNew: PropTypes.bool,

    position: PropTypes.object,

    onOptionChange: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    position: { x: 100, y: 0 },
    list: [],
    strings: {
      editStoriesModule: 'Edit Stories Module',
      editFilesModule: 'Edit Files Module',
      editPeopleModule: 'Edit People Module',
      moduleTitle: 'Module Title',
      close: 'Close',
      storySource: 'Story Source',
      peopleSource: 'People Source',
      fileSource: 'File Source',
      itemsDisplayed: 'Items Displayed',
      grid: 'Grid',
      list: 'List',
      card: 'Card',
      view: 'View',
      top: 'Top',
      latest: 'Latest',
      mostViewed: 'Most Viewed',
      recommended: 'Recommended',
      recentlyViewed: 'Recently Viewed',
      liked: 'Liked',
      leaderboard: 'Leaderboard',
      popular: 'Popular'
    },
    isNewDesign: false
  };

  constructor(props) {
    super(props);
    this.state = {
      showEmptySource: true
    };
    autobind(this);

    // refs
    this.titleInput = null;
    this.sourceInput = null;
  }

  componentDidMount() {
    if (this.props.isNew && this.props.title === '') {
      this.titleInput.focus();
    } else if (this.props.isNew && this.props.source === '') {
      this.sourceInput.elem.focus();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.source !== '' && this.state.showEmptySource) {
      this.setState({ showEmptySource: false });
    } else if (nextProps.source === '' && !this.state.showEmptySource) {
      this.setState({ showEmptySource: true });
    }
  }

  handleClick(event) {
    event.stopPropagation();
  }

  handleTitleChange(event) {
    this.props.onOptionChange(this.props.i, 'title', event.currentTarget.value);
  }

  handleSourceChange(value) {
    if (value) {
      this.props.onOptionChange(this.props.i, 'source', value.value);
    }
  }

  handleLimitChange(value) {
    this.props.onOptionChange(this.props.i, 'limit', value);
  }

  handleGridChange(event) {
    const {
      isNewDesign,
      i,
      type,
      onOptionChange
    } = this.props;
    const isStory = type === 'story-list';
    const value = isNewDesign && isStory ? event.currentTarget.value : event.currentTarget.value === 'grid';
    onOptionChange(i, isNewDesign && isStory ? 'view' : 'grid', value);
  }

  handleCloseClick(event) {
    event.preventDefault();
    this.props.onCloseClick(this.props.i);
  }

  render() {
    const {
      i,
      type,
      title,
      limit,
      grid,
      source,
      position,
      strings,
      view,
      isNewDesign
    } = this.props;
    const styles = require('./TemplateEditorEditItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      TemplateEditorEditItem: true
    }, this.props.className);

    // Sources by type
    const sourceOptions = [
      { value: 'recommended', label: strings.recommended }
    ];
    let heading = '';
    let sourceTitle = '';
    switch (type) {
      case 'file-list':
        sourceOptions.push(
          { value: 'recentlyViewed', label: strings.recentlyViewed }
        );
        heading = strings.editFilesModule;
        sourceTitle = strings.fileSource;
        break;
      case 'story-list':
        sourceOptions.push(
          { value: 'top', label: strings.top },
          { value: 'latest', label: strings.latest },
          { value: 'mostViewed', label: strings.mostViewed },
          { value: 'recentlyViewed', label: strings.recentlyViewed },
          { value: 'liked', label: strings.liked },
          { value: 'popular', label: strings.popular }
        );
        heading = strings.editStoriesModule;
        sourceTitle = strings.storySource;
        break;
      case 'user-list':
        sourceOptions.push(
          { value: 'top', label: strings.top },
          { value: 'leaderboard', label: strings.leaderboard },
        );
        heading = strings.editPeopleModule;
        sourceTitle = strings.peopleSource;
        break;
      default:
        break;
    }

    // Display empty source if none has been selected
    if (this.state.showEmptySource) {
      sourceOptions.unshift({ value: '', label: '' });
    }

    // Selected source
    const sourceValue = {
      value: source || sourceOptions[0].value,
      label: strings[source] || sourceOptions[0].label
    };

    const viewOptions = [{
      label: strings.grid,
      value: 'grid'
    },
    {
      label: isNewDesign && type === 'story-list' ? strings.card : strings.list,
      value: isNewDesign && type === 'story-list' ? 'card' : 'list'
    }];

    let viewSelectedValue = grid ? 'grid' : 'list';
    if (isNewDesign && type === 'story-list') {
      viewSelectedValue = view;
    }

    return (
      <Draggable
        bounds={{ top: 0 }}
        position={position}
        handle=".handle"
        onStop={this.props.onDragStop}
      >
        <div data-id={i} className={classes} onClick={this.handleClick}>
          <header className="handle">
            <span className={styles.handle + ' icon-move'} />
            <h3>{heading}</h3>
            <Btn
              aria-label={strings.close}
              icon="close"
              borderless
              alt
              onClick={this.handleCloseClick}
              className={styles.close}
            />
          </header>
          <div className={styles.settings}>
            <Text
              id={'title-' + i}
              ref={(c) => { this.titleInput = c; }}
              label={strings.moduleTitle}
              value={title}
              maxLength={40}
              className={styles.row}
              onChange={this.handleTitleChange}
            />

            <div className={styles.row}>
              <label htmlFor={'source-' + i}>{sourceTitle}</label>
              <Select
                ref={(c) => { this.sourceInput = c; }}
                name={'source-' + i}
                value={sourceValue}
                clearable={false}
                options={sourceOptions}
                onChange={this.handleSourceChange}
                className={styles.select}
              />
            </div>

            {!isNewDesign && <div className={styles.sliderRow}>
              <label htmlFor={'limit-' + i}>{strings.itemsDisplayed}</label>
              <RangeSlider
                handleIconType="round"
                min={1}
                max={20}
                value={limit}
                withBars
                barColour={['var(--base-color)']}
                showTooltip
                onChange={this.handleLimitChange}
              />
            </div>}

            {(!isNewDesign || type === 'story-list') && <RadioGroup
              legend={strings.view}
              name={'grid-' + i}
              selectedValue={viewSelectedValue}
              onChange={this.handleGridChange}
              inlineInputs
              options={viewOptions}
              className={styles.row}
            />}
          </div>
        </div>
      </Draggable>
    );
  }
}
