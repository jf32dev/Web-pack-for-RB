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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Shibu Bhattarai <Shibu.Bhattarai@bigtincan.com>
 */

import get from 'lodash/get';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages, FormattedDate } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import filesize from 'filesize';
import take from 'lodash/take';
import differenceBy from 'lodash/differenceBy';

import SVGIcon from 'components/SVGIcon/SVGIcon';
import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Tags from 'components/Tags/Tags';

import classNames from 'classnames/bind';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  searchTags,
  addTag,
  addTagToFile,
  getStoryFileTags,
  removeTagToFile,
  clear
} from 'redux/modules/tag';
import {
  load
} from 'redux/modules/story/story';
import {
  updateEntity
} from 'redux/modules/entities/entities';

const messages = defineMessages({
  close: { id: 'close', defaultMessage: 'Close' },
  save: { id: 'save', defaultMessage: 'Save' },
  name: { id: 'name', defaultMessage: 'Name' },
  description: { id: 'description', defaultMessage: 'Description' },
  image: { id: 'image', defaultMessage: 'Image' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  addImage: { id: 'add-image', defaultMessage: 'Add Image' },
  confirmRemoveCoverArt: { id: 'are-you-sure', defaultMessage: 'Are you sure?' },
  title: { id: 'title', defaultMessage: 'Title' },
  watermark: { id: 'watermark', defaultMessage: 'watermark' },
  optional: {
    id: 'optional',
    defaultMessage: 'Optional'
  },
  mandatory: {
    id: 'mandatory',
    defaultMessage: 'Mandatory'
  },
  blocked: {
    id: 'blocked',
    defaultMessage: 'Blocked'
  },
  fileDetails: { id: 'file-details', defaultMessage: 'File Details' },
  fileType: { id: 'file-type', defaultMessage: 'File type' },
  fileSize: { id: 'file-size', defaultMessage: 'File size' },
  dateModified: { id: 'date-modified', defaultMessage: 'Date modified' },
  tags: { id: 'tags', defaultMessage: 'Tags' },
  newTag: { id: 'new-tag', defaultMessage: 'New tag' },
  suggestions: { id: 'suggestions', defaultMessage: 'Suggestions' },
  tagDescription: { id: 'tag-description', defaultMessage: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below. ' },
  noRelatedTags: { id: 'no-related-tags', defaultMessage: 'No Related Tags' },
  shareStatus: { id: 'share-status', defaultMessage: 'Share status' },
});

function mapStateToProps(state) {
  const { tag, story } = state;
  return {
    ...tag,
    canEdit: story.canEdit,
    currentActiveStoryPermId: story.permId
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    searchTags,
    addTag,
    addTagToFile,
    getStoryFileTags,
    removeTagToFile,

    updateEntity,
    load,

    clear
  })
)
export default class FileDetailsModel extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    isVisible: PropTypes.bool,

    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    isVisible: false
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      currentSelectedTag: []
    };
    this.svgIconTypes = ['cad', 'excel', 'folder', 'potx', 'project', 'scrollmotion', 'word', 'visio'];
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { id, permId, currentActiveStoryPermId } = this.props;
    this.props.getStoryFileTags(permId, id);
    if (!currentActiveStoryPermId || (currentActiveStoryPermId !== permId)) {
      this.props.load(permId);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.saved && nextProps.saved) {
      const currentTag = nextProps.currentTag;
      this.addTagToFile(currentTag);
    }
    if (!this.props.tags.length !== nextProps.tags.length) {
      //only load very first time.
      if (this.state.currentSelectedTag.length === 0) {
        this.setState({
          currentSelectedTag: nextProps.tags
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.clear();
  }

  getTag(name) {
    return this.props.allTags.find((tag) => tag.name === name);
  }

  getTagBy(name, iteratee = []) {
    return iteratee.find((tag) => tag.name === name);
  }

  addTagToFile(currentTag) {
    const fileId = currentTag.fileId || this.props.id;
    const selectedTags = Object.assign([], this.state.currentSelectedTag);
    selectedTags.push(currentTag);

    this.setState({
      currentSelectedTag: selectedTags,
      tag: ''
    });

    this.props.addTagToFile({
      fileId: fileId,
      tagId: currentTag.id,
      tagName: currentTag.name
    });

    // Add to story/ files tags
    this.props.updateEntity('files', fileId, { tags: selectedTags });
  }

  handleTagChange(event) {
    const value = event.currentTarget.value;
    this.setState({
      tag: value
    });
    this.props.searchTags({
      keyword: value,
      limit: 10,
      offset: 0
    });
  }

  handleTagClick(event) {
    event.preventDefault();
    const tagName = event.currentTarget.dataset.name;
    const tag = this.getTag(tagName);
    if (tag) {
      this.addTagToFile(tag);
    }
  }

  handleDeleteClick(event) {
    event.preventDefault();
    const selectedTags = Object.assign([], this.state.currentSelectedTag);
    const index = event.currentTarget.dataset.index;
    const tag = selectedTags[index];
    const fileId = this.props.id;

    if (tag) {
      this.props.removeTagToFile({
        fileId: fileId,
        tagId: tag.id
      });

      this.setState({
        currentSelectedTag: selectedTags.filter(currentTag => currentTag.id !== tag.id)
      });

      // Remove to tag from Story file
      this.props.updateEntity('files', fileId, { tags: selectedTags.filter(currentTag => currentTag.id !== tag.id) });
    }
  }

  handleInputKeyDown(event) {
    const value = event.target.value;
    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) && !event.shiftKey && /\S/.test(value)) {
      event.preventDefault();
      const selectedTags = Object.assign([], this.state.currentSelectedTag);
      const isAlreadyAdded = this.getTagBy(value, selectedTags);
      const isAlreadyCreated = this.getTagBy(value, this.props.allTags);

      if (isAlreadyCreated) {
        if (!isAlreadyAdded) {
          selectedTags.push(isAlreadyCreated);
          this.addTagToFile({
            fileId: this.props.id,
            id: isAlreadyCreated.id,
            name: value
          });
        } else {
          this.setState({
            tag: ''
          });
        }
      } else {
        this.props.addTag({
          name: value
        });
      }
    }
  }

  renderThumbnail(styles) {
    const { thumbnail, description, category, repoFileCount } = this.props;
    const authString = this.props.authString || get(this.context.settings, 'authString', '');
    const fullUrl = `${thumbnail}?v=${new Date().getTime()}&${authString}`;
    const hasSvgIcon = this.svgIconTypes.indexOf(category) > -1;
    let categoryText = '';
    const cx = classNames.bind(styles);
    const classes = cx({
      noThumb: !thumbnail,
      folderThumb: category === 'folder',
    }, styles.thumbContainer);

    const style = {};
    let iconClass = '';
    if (!thumbnail) {
      iconClass = ' icon-' + category;
      switch (category) {
        case 'folder':
          if (typeof repoFileCount === 'number' && repoFileCount > 0) {
            categoryText = repoFileCount + ' files';
          }
          if (this.props.repo && this.props.repo.service) {
            iconClass = ' icon-' + this.props.repo.service;
          }
          break;
        default:
          categoryText = category;
      }
    }
    return (<div data-category={categoryText} className={classes + iconClass} style={style}>
      {hasSvgIcon && !thumbnail && <SVGIcon type={category} />}
      {thumbnail && <img src={fullUrl} alt={description} />}
    </div>);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { isVisible,
      description,
      shareStatus,
      size,
      dateAdded,
      allTags,
      category,
      canEdit,
      //fileTagAdding
    } = this.props;
    const styles = require('./FileDetailsModel.less');
    const strings = generateStrings(messages, formatMessage, { ...naming, name: name });
    const humanFileSize = size ? filesize(size) : null;
    const filterTags = differenceBy(allTags, this.state.currentSelectedTag, (tag) => tag.id);
    return (
      <Modal
        className={styles.FileDetailsModal}
        isVisible={isVisible}
        escClosesModal
        width="medium"
        headerChildren={
          <span>
            <span className={styles.headerTitle}>{strings.fileDetails}</span>
          </span>
        }
        footerChildren={(<div>
          <Btn
            alt
            large
            onClick={this.props.onClose}
            style={{ marginRight: '0.5rem' }}
          >
            {strings.close}
          </Btn>
        </div>)}
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div className={styles.dialogBody}>
          <div className={styles.top}>
            <div className={styles.imgWrapper}>
              <div className={styles.thumbPreview}>
                <div className={styles.thumbWrap}>
                  {this.renderThumbnail(styles)}
                </div>
              </div>
            </div>
            <div className={styles.detailContainer}>
              <div style={{ width: '100%' }}>
                <div className={styles.title}>
                  <h3>{description}</h3>
                </div>
                <div className={styles.innerHeader}>
                  <h4>{strings.shareStatus}</h4>
                  <div className={styles.value}><span data-status={shareStatus} className={styles.shareActive} /><div className={styles.value}>{shareStatus}</div></div>
                </div>
                <div className={styles.innerHeader}>
                  <h4>{strings.fileType}</h4>
                  <div className={styles.value}>{category}</div>
                </div>
                <div className={styles.innerHeader}>
                  <h4>{strings.fileSize}</h4>
                  <div className={styles.value}>{humanFileSize}</div>
                </div>
                <div className={styles.innerHeader}>
                  <h4>{strings.dateModified}</h4>
                  <div className={styles.value}><FormattedDate value={dateAdded * 1000} year="numeric" month="short" day="2-digit" /></div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <div className={styles.tagContainer}>
              <div className={styles.titleContainer}>
                <h5>{strings.tags}</h5>
                {canEdit && <h4>{strings.tagDescription}</h4>}
              </div>
              <div>
                <Tags
                  list={this.state.currentSelectedTag.map((tag) => tag.name)}
                  onItemDeleteClick={canEdit ? this.handleDeleteClick : null}
                  enableInput={canEdit}
                  currentSearch={this.state.tag}
                  onInputKeyDown={this.handleInputKeyDown}
                  onInputChange={this.handleTagChange}
                />
              </div>
              {canEdit &&
                <div className={styles.suggestedTags}>
                  <div className={styles.titleContainer}>
                    <h5>{strings.suggestions}</h5>
                  </div>
                  {filterTags && filterTags.length > 0 && <Tags
                    className={styles.fileTags}
                    list={take(filterTags, 10).map((tag) => tag.name)}
                    onItemClick={this.handleTagClick}
                  />
                  }
                  {filterTags && filterTags.length === 0 &&
                    <div className={styles.noTag}>
                      <span className={styles.tagIcon} />
                      <span className={styles.noRelatedTags}>{strings.noRelatedTags}</span>
                    </div>
                  }
                </div>}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
