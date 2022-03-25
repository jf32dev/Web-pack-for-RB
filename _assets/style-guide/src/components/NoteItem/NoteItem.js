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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';
import { FormattedDate } from 'react-intl';

import Checkbox from 'components/Checkbox/Checkbox';
import Loader from '../Loader/Loader';

/**
 * NoteItem description
 */
export default class NoteItem extends PureComponent {
  static propTypes = {
    /** when false, using default icon as background in the list layout or hide the image when grid layout */
    showThumb: PropTypes.bool,

    /** when false, use list layout; when true, use grid layout */
    grid: PropTypes.bool,

    /** when true and grid is false, use list layout; when true, use small list layout */
    small: PropTypes.bool,

    /** text and icon would be white color */
    white: PropTypes.bool,

    /** Show checkbox */
    showCheckbox: PropTypes.bool,

    excerpt: PropTypes.string,
    thumbnail: PropTypes.string,

    /** timestamp */
    updated: PropTypes.number,

    /** background colour of the default background */
    colour: PropTypes.string,

    /** Note Item in the note list loading */
    loading: PropTypes.bool,

    story: PropTypes.object,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Marks checkbox as checked */
    isSelected: PropTypes.bool,

    /** Valid size: <code>large</code> */
    thumbSize: PropTypes.oneOf(['large', 'medium']),

    /** maximum total line number of the excerpt in grid layout */
    contentLine: PropTypes.number,

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

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    contentLine: 6,
    isSelected: false,
    loading: false,
    small: false,
    story: {},
    thumbSize: 'large',
    white: false
  };

  static contextTypes = {
    settings: PropTypes.object
  };

  constructor(props) {
    super(props);
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

  handleInputChange(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    const {
      id,
      isActive,
      showCheckbox,
      showThumb,
      isSelected,
      grid,
      small,
      name,
      excerpt,
      thumbnail,
      story,
      colour,
      className,
      updated,
      white,
      style,
      loading
    } = this.props;
    const styles = require('./NoteItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      NoteListItem: true,
      listItem: !grid,
      gridItem: grid,
      small: !grid && small,
      selectedGrid: isActive && grid,
      selectedList: isActive && !grid,
      loader: loading,
    }, className);

    const listItemTitleClass = cx({
      listItemTitle: !grid,
    });

    /** show the note thumbnail or not*/
    let showNoteThumbnail = false;

    /** show the story thumbnail or not*/
    const showStoryThumbnail = !_isEmpty(_get(story, 'title', ''));

    /** use default story thumbnail or not*/
    const isStoryThumbnailEmpty = _isEmpty(_get(story, 'thumbnail', ''));

    if (showThumb) {
      showNoteThumbnail = !_isEmpty(thumbnail);
    }

    const titleClass = cx({
      title: true,
      visibility: grid && !name,
      white: white,
    });

    const listNoteThumbnailClass = cx({
      listNoteThumbnail: true,
      iconTxtAlignLeft: !showNoteThumbnail,
      defaultBG: !showNoteThumbnail,
      white: white,
      smallIcon: !grid && small,
    });

    const noteThumbnailClass = cx({
      noteThumbnail: true,
      iconTxtAlignLeft: !showNoteThumbnail,
      defaultBG: !showNoteThumbnail,
    });

    const listStoryThumbnailClass = cx({
      listStoryThumbnail: true,
      defaultBG: !showStoryThumbnail,
      defaultStoryBG: isStoryThumbnailEmpty
    });

    const storyThumbnailClass = cx({
      storyThumbnail: true,
      defaultBG: !showStoryThumbnail,
      defaultStoryBG: isStoryThumbnailEmpty
    });

    const secondGridClass = cx({
      secondGrid: true,
      paddingLeft: !grid,
      flexboxColumn: !grid,
    });

    let contentLine = this.props.contentLine;

    if (name.length > 19) {
      contentLine -= 1;
    }

    if (showStoryThumbnail) {
      contentLine -= 2;
    } else if (showNoteThumbnail) {
      contentLine -= 3;
    }

    const authString = _get(this.context.settings, 'authString', '');

    return (
      <a
        href={`/note/${id}/edit`} className={itemClasses} style={style}
        onClick={this.handleClick}
      >
        {showCheckbox && <Checkbox
          name={'note-' + id}
          value={id + ''}
          checked={isSelected}
          onChange={this.handleInputChange}
          className={styles.checkbox}
        />}
        {loading && <Loader type="content" className={styles.loaderItem} />}
        {!grid && !loading && <div
          className={listNoteThumbnailClass}
          style={{ backgroundImage: small ? '' : showNoteThumbnail && `url("${thumbnail + authString}")` }}
        />}
        {!loading && <div className={secondGridClass}>
          {(grid || (!grid && name)) &&
          <div className={listItemTitleClass}>
            <div className={titleClass} style={{ WebkitLineClamp: grid ? 2 : 1 }}>
              {grid ? name || '.' : name}
            </div>
          </div>}
          {!grid && excerpt && <div>
            <span className={`${styles.content} ${!grid && small ? styles.hidden : ''}`} style={{ WebkitLineClamp: 1 }}>{excerpt}</span>
          </div>}
          {(grid || (!grid && showStoryThumbnail)) &&
            <div className={`${grid ? styles.content : ''} ${!grid && small ? styles.hidden : ''}`} style={{ WebkitLineClamp: grid ? contentLine : 1 }}>
              {grid ? excerpt : showStoryThumbnail && <div className={styles.storyLink}>
                <div
                  className={listStoryThumbnailClass}
                  style={{
                    backgroundImage: !isStoryThumbnailEmpty && `url("${_get(story, 'thumbnail', '') + authString}")`,
                    backgroundColor: isStoryThumbnailEmpty && colour
                  }}
                />
                <span>{_get(story, 'title', '')}</span>
              </div>}
            </div>
          }
          {
            showNoteThumbnail && grid &&
            <div
              className={noteThumbnailClass}
              style={{ backgroundImage: showNoteThumbnail && `url("${thumbnail + authString}")` }}
            />
          }
          {!showNoteThumbnail && showStoryThumbnail && grid && <div className={styles.storyLink}>
            <div
              className={storyThumbnailClass}
              style={{
                backgroundImage: !isStoryThumbnailEmpty && `url("${_get(story, 'thumbnail', '') + authString}")`,
                backgroundColor: isStoryThumbnailEmpty && colour
              }}
            />
            <span>{_get(story, 'title', '')}</span>
          </div>}
          {grid && <div className={styles.footer}>{updated && <FormattedDate
            value={updated * 1000}
            day="2-digit"
            month="short"
            year="numeric"
            hour="numeric"
            minute="numeric"
          />}</div>}
        </div>}
      </a>
    );
  }
}
