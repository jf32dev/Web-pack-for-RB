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
import { defineMessages, FormattedDate } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import isFileInternal from 'helpers/isFileInternal';

import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';
import Icon from 'components/Icon/Icon';
import SVGIcon from 'components/SVGIcon/SVGIcon';

const messages = defineMessages({
  lastReviewedRecertifiedDate: { id: 'last-reviewed-recertified-date', defaultMessage: 'Last Reviewed/Recertified Date' },
  publicationDate: { id: 'publication-date', defaultMessage: 'Publication Date' },
  created: { id: 'created', defaultMessage: 'Created' },
  excerpt: { id: 'excerpt', defaultMessage: 'Excerpt' },
  resultsInclude: { id: 'results-include', defaultMessage: 'Results include' },
  openStack: { id: 'open-stack', defaultMessage: 'Open Stack' },
  results: { id: 'results', defaultMessage: 'Results' },
  page: { id: 'page', defaultMessage: 'Page' },
  slide: { id: 'slide', defaultMessage: 'Slide' },
  images: { id: 'images', defaultMessage: 'Images' },
  texts: { id: 'texts', defaultMessage: 'Texts' },
  open: { id: 'open', defaultMessage: 'Open' },
  bookmark: { id: 'bookmark', defaultMessage: 'Bookmark' },
  removeBookmark: { id: 'remove-bookmark', defaultMessage: 'Remove Bookmark' },
  share: { id: 'share', defaultMessage: 'Share' },
  internalOnly: { id: 'internal-only', defaultMessage: 'Internal Only' },
});

/**
 * BlockSearchFileItem are similar to a FileSearchItem. For use in the block-level search and canvas presentation builder.
 */
export default class BlockSearchFileItem extends PureComponent {
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
    blocks: PropTypes.array,

    /** Defines tags that have a 'source' */
    sourceTags: PropTypes.array,

    /** Handle actions: open, bookmark, share, canvas, stack */
    onActionClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    file: {},
    matches: [],
    tags: [],
    sourceTags: [],
    blocks: [],
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};

    const svgIconTypes = ['3d-model', 'cad', 'excel', 'folder', 'potx', 'project', 'scrollmotion', 'word', 'visio'];
    this.hasSvgIcon = svgIconTypes.indexOf(this.props.category) > -1;

    autobind(this);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString } = this.context.settings;
    const {
      category,
      bookmarks,
      description,
      createdAt,
      coverArt,
      excerpt,
      tags,
      shareStatus,
      onActionClick
    } = this.props;
    const styles = require('./BlockSearchFileItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BlockSearchFileItem: true
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    let thumbnailUrl = '';
    if (coverArt) {
      thumbnailUrl = coverArt.url;

      if (authString) {
        thumbnailUrl += `&access_token=${authString}`;
      }
    }

    const thumbnailClasses = cx({
      thumbnail: true,
      hasThumbnail: thumbnailUrl !== '',
      [`icon-${category}`]: true,
    });

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

    const isBookmarked = bookmarks && bookmarks.find(b => b.stackSize === 1);

    const canAddAllToCanvas = category !== 'video';

    return (
      <div className={classes} style={this.props.style}>
        <div
          data-category={category}
          onClick={() => onActionClick('open', this.props)}
          className={thumbnailClasses}
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        >
          {(this.hasSvgIcon && !thumbnailUrl) && <SVGIcon type={category} />}
        </div>

        <section>
          <div className={styles.meta}>
            <span data-category={category} className={styles.category} />
            {altDate && <div className={styles.date}>
              <span>{altDateString}</span>
              <span>&nbsp;{altDate}</span>
            </div>}

            {!altDate && <div className={styles.date}>
              <span>{strings.created}</span>
              <span>&nbsp;<FormattedDate
                value={createdAt} year="numeric" month="short"
                day="2-digit"
              /></span>
            </div>}

            {certified && <div className={styles.certifiedWrapper}>
              <Icon name="star" className={styles.certified} />
            </div>}
          </div>

          <div
            aria-label={description}
            title={description}
            className={styles.fileDescription}
          >
            <h3 onClick={() => onActionClick('open', this.props)}>{description}</h3>
            <p dangerouslySetInnerHTML={{ __html: excerpt }} />
          </div>

          <div className={styles.tags}>
            {internal && <div className={styles.internalTag}>
              <Icon name="warning" />
              <span>{strings.internalOnly}</span>
            </div>}

            {sourceTags.length > 0 && <ul className={styles.sourceTags}>
              {sourceTags.map(t => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>}
          </div>
        </section>

        <div className={styles.fileActions}>
          {canAddAllToCanvas && <Btn
            borderless
            icon="canvas-add"
            onClick={() => onActionClick(canAddAllToCanvas ? 'canvas-all' : 'canvas', this.props)}
          />}
          <DropMenu
            icon="more-fill"
            className={styles.menu}
          >
            <ul>
              <li onClick={() => onActionClick('open', this.props)}>{strings.open}</li>
              <li onClick={() => onActionClick('bookmark', this.props)}>{isBookmarked ? strings.removeBookmark : strings.bookmark}</li>
              {shareStatus !== 'blocked' && <li onClick={() => onActionClick('share', this.props)}>{strings.share}</li>}
            </ul>
          </DropMenu>
        </div>
      </div>
    );
  }
}
