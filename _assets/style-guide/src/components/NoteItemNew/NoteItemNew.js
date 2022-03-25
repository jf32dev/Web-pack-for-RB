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
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { Fragment, useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedDate } from 'react-intl';

import Loader from 'components/Loader/Loader';

const NoteItemNew = (props) => {
  const {
    authString,
    colour,
    id,
    excerpt,
    loading,
    name,
    onClick,
    showThumb,
    story,
    thumbnail,
    updated
  } = props;

  const handleClick = (event) => {
    event.preventDefault();

    // Propagate props to onClick handler
    if (typeof onClick === 'function') {
      onClick(event, props);
    }
  };

  const styles = require('./NoteItemNew.less');
  const cx = classNames.bind(styles);

  const noteItemContentClasses = cx({
    noteItemContentContainer: true,
    loadingContainer: loading
  });

  const reducer = (state, action) => ({
    ...state,
    [action.type]: action.result
  });

  const [state, dispatch] = useReducer(reducer, {
    showStoryThumbnail: false,
    isStoryThumbnailEmpty: false,
    showNoteThumbnail: false,
    isLongTitle: true,
    contentLineClamp: 2
  });

  useEffect(() => {
    // show the note thumbnail or not
    if (showThumb) {
      dispatch({
        type: 'showNoteThumbnail',
        result: !_isEmpty(thumbnail)
      });
    }
  }, [thumbnail]);

  useEffect(() => {
    // show the story thumbnail or not
    dispatch({
      type: 'showStoryThumbnail',
      result: !_isEmpty(_get(story, 'title', ''))
    });
    // use default story thumbnail or not
    dispatch({
      type: 'isStoryThumbnailEmpty',
      result: _isEmpty(_get(story, 'thumbnail', ''))
    });
  }, [story]);

  const titleRef = useRef(null);

  useEffect(() => {
    dispatch({
      type: 'isLongTitle',
      result: titleRef.current.clientWidth > 168
    });
  }, [name]);

  useEffect(() => {
    const {
      isLongTitle,
      showNoteThumbnail,
      showStoryThumbnail
    } = state;
    let lineCount = 2;
    if ((name && isLongTitle && !showNoteThumbnail && showStoryThumbnail) ||
      (name && isLongTitle && showNoteThumbnail && !showStoryThumbnail)) {
      lineCount = 4;
    } else if ((name && !isLongTitle && !showNoteThumbnail && showStoryThumbnail) ||
      (name && !isLongTitle && showNoteThumbnail && !showStoryThumbnail)) {
      lineCount = 5;
    } else if ((!name && !isLongTitle && showNoteThumbnail && showStoryThumbnail)) {
      lineCount = 6;
    } else if (name && isLongTitle && !showNoteThumbnail && !showStoryThumbnail) {
      lineCount = 7;
    } else if (name && !isLongTitle && !showNoteThumbnail && !showStoryThumbnail) {
      lineCount = 8;
    }
    dispatch({
      type: 'contentLineClamp',
      result: lineCount
    });
  }, [name, state.isLongTitle, state.showNoteThumbnail, state.showStoryThumbnail]);

  return (
    <Fragment>
      <div ref={titleRef} style={{ visibility: 'hidden', position: 'absolute', height: 'auto', width: 'auto', whiteSpace: 'nowrap', fontSize: '14px' }}>{name}</div>
      <a
        href={`/note/${id}/edit`}
        className={styles.noteItemWrapper}
        onClick={handleClick}
      >
        <div className={noteItemContentClasses}>
          {loading && <Loader type="content" className={styles.loaderItem} />}
          {!loading && <Fragment>
            <div>
              <p className={styles.noteItemTitle}>{name}</p>
              <span className={styles.noteItemContent} style={{ WebkitLineClamp: state.contentLineClamp }}>{excerpt}</span>
            </div>
            <div>
              {state.showNoteThumbnail && <div
                className={styles.noteThumbnail}
                style={{ backgroundImage: thumbnail ? `url("${thumbnail + authString}")` : null }}
              />}
              {!state.showNoteThumbnail && state.showStoryThumbnail && <div className={styles.storyLink}>
                <div
                  className={styles.storyThumbnail}
                  style={{
                    backgroundImage: !state.isStoryThumbnailEmpty && `url("${_get(story, 'thumbnail', '') + authString}")`,
                    backgroundColor: state.isStoryThumbnailEmpty && colour
                  }}
                />
                <span>{_get(story, 'title', '')}</span>
              </div>}
              <FormattedDate
                value={updated * 1000}
                day="2-digit"
                month="short"
                year="numeric"
                hour="numeric"
                minute="numeric"
              />
            </div>
          </Fragment>}
        </div>
      </a>
    </Fragment>
  );
};

NoteItemNew.defaultProps = {
  authString: '',
  colour: '#4c4c4c',
  loading: false,
  showThumb: false,
  story: {},
  thumbnail: '',
  updated: null
};

NoteItemNew.propTypes = {
  authString: PropTypes.string,
  colour: PropTypes.string,
  loading: PropTypes.bool,
  showThumb: PropTypes.bool,
  story: PropTypes.object,
  thumbnail: PropTypes.string,
  updated: PropTypes.number
};

export default NoteItemNew;
