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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Tags from 'components/Tags/Tags';

/**
 * Edit Image Modal
 */
export default class EditImageModal extends PureComponent {
  static propTypes = {
    /** make the modal visible */
    isVisible: PropTypes.bool,

    /** onClick event method use dataset to figure out what method need to be processed next */
    onClick: PropTypes.func,

    /** close modal event method */
    onClose: PropTypes.func,

    /** thumbnail link */
    thumbnail: PropTypes.string,

    /** thumbnail update date string */
    updatedFormat: PropTypes.string,

    /** thumbnail id */
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** thumbnail tag list */
    tags: PropTypes.arrayOf(PropTypes.string),

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      editImage: 'Edit Image',
      stories: 'Stories',
      usedTimes: 'Used 11 times',
      viewStories: 'View Stories',
      updateDate: 'Upload Date',
      photoId: 'Photo ID',
      replaceImage: 'Replace Image',
      deleteImage: 'Delete Image',
      tags: 'Tags',
      newTag: 'New Tag...',
      cancel: 'Cancel',
      update: 'Update',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      currentSearch: ''
    };
    autobind(this);
  }

  handleDeleteClick(event) {
    event.preventDefault();
    const tagIndex = event.currentTarget.dataset.index;

    const newTags = [...this.props.tags];
    newTags.splice(tagIndex, 1);
    this.updateValues(newTags);
  }

  handleInputKeyDown(event) {
    const value = event.target.value;
    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) && !event.shiftKey && /\S/.test(value)) {
      event.preventDefault();
      this.updateValues([...this.props.tags, value]);
      this.setState({
        currentSearch: '',
      });
    }
  }

  handleSearchInputChange(event) {
    const value = event.target.value;

    this.setState({
      currentSearch: value
    });
  }

  updateValues(tags) {
    const { onUpdateTags } = this.props;

    if (onUpdateTags && typeof onUpdateTags === 'function') {
      onUpdateTags(tags);
    }
  }

  render() {
    const {
      strings,
      isVisible,
      onClick,
      onClose,
      thumbnail,
      updatedFormat,
      id,
      tags,
    } = this.props;
    const styles = require('./EditImageModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      EditImageModal: true
    }, this.props.className);

    const viewStoriesClasses = cx({
      viewStories: true,
      disabled: id === undefined
    });

    return (
      <Modal
        isVisible={isVisible}
        backdropClosesModal
        escClosesModal
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.editImage}</p>}
        footerChildren={(<div>
          <Btn
            alt large onClick={onClose}
            data-action="close" data-name="EditImageModal" style={{ marginRight: '0.5rem' }}
          >
            {strings.cancel}
          </Btn>
          <Btn
            inverted large onClick={onClick}
            data-action="update" data-name="EditImageModal" style={{ marginLeft: '0.5rem' }}
          >
            {strings.update}
          </Btn>
        </div>)}
        onClose={onClose}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          <div className={styles.info}>
            <div className={styles.imageBackground} style={{ backgroundImage: thumbnail && `url("${thumbnail}")` }} />
            <div>
              <div className={styles.labelValue}>
                <span>{`${strings.stories}: `}</span>
                <span>{strings.usedTimes}</span>
              </div>
              <div
                className={viewStoriesClasses} data-action="switchModal" data-path="StoriesListModal"
                onClick={id && onClick}
              >
                {strings.viewStories}
              </div>
              <div className={styles.labelValue}>
                <span>{`${strings.updateDate}: `}</span><span>{updatedFormat}</span>
              </div>
              <div className={styles.labelValue}>
                <span>{`${strings.photoId}: `}</span><span>{id}</span>
              </div>
              <Btn
                inverted onClick={onClick} data-action="replaceImage"
                data-name="EditImageModal"
              >
                {strings.replaceImage}
              </Btn><br />
              <Btn
                warning onClick={onClick} data-action="deleteImage"
                data-name="EditImageModal"
              >
                {strings.deleteImage}
              </Btn>
            </div>
          </div>
          <div className={styles.tags}>
            <div className={styles.tagsTitle}>{strings.tags}</div>
            <Tags
              enableInput
              currentSearch={this.state.currentSearch}
              onInputKeyDown={this.handleInputKeyDown}
              onInputChange={this.handleSearchInputChange}
              list={tags}
              onItemDeleteClick={this.handleDeleteClick}
            />
          </div>
        </div>
      </Modal>
    );
  }
}
