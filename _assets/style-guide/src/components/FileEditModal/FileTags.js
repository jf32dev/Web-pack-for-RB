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
 * @package hub-web-app-v5
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincancom>
 */

import React, { useState }  from 'react';
import PropTypes from 'prop-types';

import Tags from 'components/Tags/Tags';

const FileTags = props => {
  const {
    tags,
    strings,

    onAddTag,
    onTagDeleteClick,
  } = props;

  const [currentTag, setCurrentTag] = useState('');

  const handleInputKeyDown = event => {
    // handle return clicked
    const tagName = event.target.value;

    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) && !event.shiftKey && /\S/.test(tagName)) {
      event.preventDefault();
      if (!tags.includes(tagName)) {
        onAddTag(tagName);
      }
      setCurrentTag('');
    }
  };

  const handleTagChange = event => {
    const tagName = event.target.value;
    setCurrentTag(tagName);
  };

  const handleTagDeleteClick = event => {
    if (typeof onTagDeleteClick === 'function') {
      onTagDeleteClick(event, props);
    }
  };

  const styles = require('./FileEditModal.less');

  return (
    <React.Fragment>
      <section className={styles.sectionsForm}>
        <h3>{strings.tags}</h3>
        <h4>{strings.tagDescription}</h4>
        <Tags
          list={tags.map((tag) => tag.name)}
          onItemDeleteClick={handleTagDeleteClick}
          enableInput
          currentSearch={currentTag}
          onInputKeyDown={handleInputKeyDown}
          onInputChange={handleTagChange}
        />

        {/*<div className={styles.suggestedTags}>
          <h5>{strings.suggestions}</h5>
          {filterTags && filterTags.length > 0 && <Tags
            className={styles.fileTags}
            list={take(filterTags, 10).map((tag) => tag.name)}
            onItemClick={this.handleTagClick}
          />}
          {filterTags && filterTags.length === 0 &&
          <div className={styles.noTag}>
            <span className={styles.tagIcon} />
            <span className={styles.noRelatedTags}>{strings.noRelatedTags}</span>
          </div>}
        </div>*/}
      </section>
    </React.Fragment>
  );
};

FileTags.propTypes = {
  tags: PropTypes.array,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  strings: PropTypes.object,
  style: PropTypes.object,

  onAddTag: function(props) {
    if (typeof props.onAddTag !== 'function') {
      return new Error('onAddTag is required');
    }
    return null;
  },
};

FileTags.defaultProps = {
  tags: [],
  strings: {
    tags: 'Tags',
    tagDescription: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.',
    newTag: 'New tag',
  }
};

export default FileTags;
