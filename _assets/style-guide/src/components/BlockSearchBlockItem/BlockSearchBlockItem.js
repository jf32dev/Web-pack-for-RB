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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lmcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import isFileInternal from 'helpers/isFileInternal';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Icon from 'components/Icon/Icon';
// import DropMenu from 'components/DropMenu/DropMenu';
import SVGIcon from 'components/SVGIcon/SVGIcon';

const messages = defineMessages({
  lastReviewedRecertifiedDate: { id: 'last-reviewed-recertified-date', defaultMessage: 'Last Reviewed/Recertified Date' },
  publicationDate: { id: 'publication-date', defaultMessage: 'Publication Date' },
  created: { id: 'created', defaultMessage: 'Created' },
  excerpt: { id: 'excerpt', defaultMessage: 'Excerpt' },
  blocksInsideOfThisFile: { id: 'blocks-inside-of-this-file', defaultMessage: 'Blocks inside of this file' },
  results: { id: 'results', defaultMessage: 'Results' },
  page: { id: 'page', defaultMessage: 'Page' },
  slide: { id: 'slide', defaultMessage: 'Slide' },
  preview: { id: 'preview', defaultMessage: 'Preview' },
  images: { id: 'images', defaultMessage: 'Images' },
  excerpts: { id: 'excerpts', defaultMessage: 'excerpts' },
  open: { id: 'open', defaultMessage: 'Open' },
  addToCanvas: { id: 'add-to-canvas', defaultMessage: 'Add to Canvas' },
  addedToCanvas: { id: 'added-to-canvas', defaultMessage: 'Added to Canvas' },
  internalOnly: { id: 'internal-only', defaultMessage: 'Internal Only' },
  addPageToCanvas: { id: 'add-page-to-canvas', defaultMessage: 'Add Page to Canvas' },
  addToSelection: { id: 'add-to-selection', defaultMessage: 'Add to selection' },
  addedToSelection: { id: 'added-to-selection', defaultMessage: 'Added to selection' },
});

/**
 * BlockSearchBlockItem are file-based search matches found inside of a file for use in the canvas presentation builder.
 */
export default class BlockSearchBlockItem extends PureComponent {
  static propTypes = {
    /** File Properties */
    id: PropTypes.number.isRequired,
    filename: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    coverArt: PropTypes.object,
    excerpt: PropTypes.string,
    createdAt: PropTypes.string,
    shareStatus: PropTypes.string,
    tags: PropTypes.array,

    /** Defines tags that have a 'source' */
    sourceTags: PropTypes.array,

    /** Enable select mode (shows checkbox) */
    select: PropTypes.bool,

    /** Set 'checked' state, used with select mode */
    checked: PropTypes.bool,

    /** Search matches within file contents */
    matchedBlocks: PropTypes.array,

    /** Handle actions: open, bookmark, share, canvas, stack */
    onActionClick: PropTypes.func,

    /** Handle checkbox change (select mode) */
    onCheckedChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    matchedBlocks: [],
    tags: [],
    sourceTags: []
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};

    const svgIconTypes = ['3d-model', 'cad', 'excel', 'folder', 'potx', 'project', 'scrollmotion', 'word', 'visio'];
    this.hasSvgIcon = svgIconTypes.indexOf(props.category) > -1;

    autobind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    // Open if not in select mode
    if (!this.props.select) {
      const singleMatch = this.props.matchedBlocks.length === 1;

      // Open File at Block in Viewer
      if (singleMatch) {
        this.props.onActionClick('open-block', this.props);

      // Open Stack
      } else {
        this.props.onActionClick('stack', this.props);
      }
    }

    // Ignore if clicking the actual checkbox or if disabled
    const singleMatch = this.props.matchedBlocks.length === 1;
    const disabled = singleMatch && !this.props.matchedBlocks[0].canAddToCanvas;
    if (!disabled && this.props.select && event.target.nodeName !== 'LABEL') {
      this.props.onCheckedChange(!this.props.checked, this.props.matchedBlocks[0].id);
    }
  }

  handleAddToCanvasClick(event) {
    event.stopPropagation();
    this.props.onActionClick('canvas', this.props);
  }

  handleCheckedChange(event) {
    const checked = event.currentTarget.checked;
    this.props.onCheckedChange(checked, this.props.matchedBlocks[0].id);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString } = this.context.settings;
    const {
      description,
      category,
      coverArt,
      createdAt,
      tags,
      select,
      checked,
      matchedBlocks,
    } = this.props;
    const singleMatch = matchedBlocks.length === 1;
    const disabled = singleMatch && !matchedBlocks[0].canAddToCanvas;

    const styles = require('./BlockSearchBlockItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BlockSearchBlockItem: true,
      disabled: disabled,
      select: select,
      isSelected: (select && checked),
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Count matches
    let matchLocation = strings.preview;
    let textMatchCount = 0;
    const imageMatchCount = 0;
    let first3Blocks = [];
    let remainingBlockCount = 0;

    // Single match
    if (singleMatch) {
      switch (category) {
        // Add 'Page' in front of match string
        case 'powerpoint':
        case 'pdf':
          matchLocation = `${strings.page} ${matchedBlocks[0].page + 1}`;
          break;
        // Display match time
        case 'video':
          matchLocation = matchedBlocks[0].time;
          break;
        default:
          break;
      }

    // Summarise multiple matches
    // all results currently text
    // image and video to follow
    } else {
      first3Blocks = matchedBlocks.slice(0, 3);
      remainingBlockCount = matchedBlocks.length - first3Blocks.length;
      textMatchCount = matchedBlocks.length;
      // textMatchCount = matchedBlocks.filter(m => m.type === 'text').length;
      // imageMatchCount = matchedBlocks.filter(m => m.type === 'image').length;
    }

    // Show excerpt?
    const showExcerpt = singleMatch && category !== 'image';

    // Use matchedBlocks thumbUrl
    let thumbnailUrl = '';
    if (matchedBlocks[0] && matchedBlocks[0].thumbnailUrl && singleMatch) {
      thumbnailUrl = matchedBlocks[0].thumbnailUrl;

    // Fallback to coverArt.url
    } else if (coverArt) {
      thumbnailUrl = coverArt.url;
    }

    // Add auth string
    if (thumbnailUrl && authString) {
      thumbnailUrl += `&access_token=${authString}`;
    }

    const thumbnailClasses = cx({
      thumbnail: true,
      hasThumbnail: !!thumbnailUrl,
      [`icon-${category}`]: true,
    }, this.props.className);

    // SVG Icon
    const hasSvgIcon = this.hasSvgIcon;

    // Show Certified icon
    const certified = tags.find(t => t.name === 'certified');

    // Show Internal indicator
    const internal = isFileInternal(this.props);

    // Show Publication date
    const pubDateTag = tags.find(t => t.name.indexOf('pubdate-') === 0);
    let pubDate = '';
    if (pubDateTag) {
      pubDate = pubDateTag.name.split('pubdate-')[1];
    }

    // Show Last Reviewed date
    const lrDateTag = tags.find(t => t.name.indexOf('lrdate-') === 0);
    let lrDate = '';
    if (lrDateTag) {
      lrDate = lrDateTag.name.split('lrdate-')[1];
    }

    // Display Last Reviewed over Publication Date
    const altDate = lrDate || pubDate;
    const altDateString = lrDate ? strings.lastReviewedRecertifiedDate : strings.publicationDate;

    // Display Source tags
    const sourceTags = [];
    tags.forEach(t => {
      const tag = this.props.sourceTags.find(st => st.id === t.name);
      if (tag) {
        sourceTags.push(tag);
      }
    });

    return (
      <div
        onClick={this.handleClick}
        className={classes}
        style={this.props.style}
      >
        <header>
          <div className={styles.meta}>
            <div>
              <span data-category={category} className={styles.category} />

              {altDate && <div className={styles.date}>
                <span>{altDateString}</span>
                <span>&nbsp;{altDate}</span>
              </div>}

              {!altDate && <div className={styles.date}>
                <span>{strings.created}</span>
                <span>&nbsp;<FormattedDate
                  value={createdAt}
                  year="numeric"
                  month="short"
                  day="2-digit"
                /></span>
              </div>}
            </div>

            {certified && <Icon name="star" className={styles.certified} />}
          </div>

          <div
            aria-label={description}
            title={description}
            className={styles.fileDescription}
          >
            <h3>{description}</h3>
          </div>

          <div className={styles.tags}>
            {internal && <div className={styles.internalTag}>
              <span>{strings.internalOnly}</span>
              <Icon name="warning" />
            </div>}

            {sourceTags.length > 0 && <ul className={styles.sourceTags}>
              {sourceTags.map(t => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>}
          </div>
        </header>

        <section>
          {singleMatch && <div
            data-category={category}
            className={thumbnailClasses}
            style={{ backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : '' }}
          >
            {(hasSvgIcon && !thumbnailUrl) && <SVGIcon type={category} />}
            <div className={styles.matchLocation}>
              {matchLocation}
            </div>
          </div>}

          {!singleMatch && <div
            className={styles.stackThumbsWrapper}
          >
            {first3Blocks.map((mb) => (
              <div
                key={mb.id}
                data-category={category}
                className={cx({
                  matchedBlockThumbnail: true,
                  hasThumbnail: !!mb.thumbnailUrl,
                  [`icon-${category}`]: true,
                })}
                style={{ backgroundImage: mb.thumbnailUrl ? `url(${mb.thumbnailUrl})` : '' }}
              >
                {(hasSvgIcon && !mb.thumbnailUrl) && <SVGIcon type={category} />}
              </div>
            ))}
            {first3Blocks.length < 3 && <div className={styles.matchedBlockThumbnail} />}
            <div className={styles.matchedBlockThumbnail}>
              {remainingBlockCount > 0 && <FormattedMessage
                id="plus-n-more"
                defaultMessage="+{itemCount} more"
                values={{ itemCount: remainingBlockCount }}
              />}
            </div>
          </div>}

          {showExcerpt && <div className={styles.excerpt}>
            <header>
              <h5>{strings.excerpt}</h5>
            </header>
            <p dangerouslySetInnerHTML={{ __html: matchedBlocks[0].highlight }} />
          </div>}

          {!singleMatch && <div className={styles.matches}>
            <header>
              <h5>{strings.blocksInsideOfThisFile}</h5>
            </header>
            <ul className={styles.matchCount}>
              {imageMatchCount > 0 && <li>{imageMatchCount} {strings.images}</li>}
              {textMatchCount > 0 && <li>{textMatchCount} {strings.excerpts}</li>}
            </ul>
          </div>}
        </section>

        <footer>
          {!disabled && !select && matchedBlocks[0].canAddToCanvas &&
          <Btn
            borderless
            icon="canvas-add"
            onClick={this.handleAddToCanvasClick}
          >
            {matchedBlocks.length === 1 && <span>{strings.addPageToCanvas}</span>}
            {matchedBlocks.length > 1 && <FormattedMessage
              id="add-n-pages-to-canvas"
              defaultMessage="Add {itemCount} Pages to Canvas"
              values={{ itemCount: matchedBlocks.length }}
            />}
          </Btn>}

          {!matchedBlocks[0].canAddToCanvas && <div className={styles.disabledNote + ' icon-tick-alt'}>
            <span>{strings.addedToCanvas}</span>
          </div>}

          {!disabled && select && <Checkbox
            name={`block-${matchedBlocks[0].id}`}
            label={checked ? strings.addedToSelection : strings.addToSelection}
            checked={checked}
            value={matchedBlocks[0].id}
            onChange={this.handleCheckedChange}
            className={styles.checkbox}
          />}
        </footer>
      </div>
    );
  }
}
