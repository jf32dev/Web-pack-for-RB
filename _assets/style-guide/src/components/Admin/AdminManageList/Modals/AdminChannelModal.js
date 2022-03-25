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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import Select from 'components/Select/Select';
import StoryThumb from 'components/StoryThumb/StoryThumb';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';

const messages = defineMessages({
  createNewChannel: { id: 'create-new-channel', defaultMessage: 'Create New {channel}' },
  editNameChannel: { id: 'edit-name-channel', defaultMessage: 'Edit "{name}" {channel}' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  create: { id: 'create', defaultMessage: 'Create' },
  save: { id: 'save', defaultMessage: 'Save' },

  contentChannel: { id: 'content-channel', defaultMessage: 'Content {channel}' },
  feedChannel: { id: 'feed-channel', defaultMessage: 'Feed {channel}' },
  channelType: { id: 'channel-type', defaultMessage: '{channel} Type' },
  name: { id: 'name', defaultMessage: 'Name' },
  description: { id: 'description', defaultMessage: 'Description' },
  url: { id: 'url', defaultMessage: 'URL' },
  image: { id: 'image', defaultMessage: 'Image' },
  defaultOrder: { id: 'default-order', defaultMessage: 'Default Order' },
  hideThisChannel: { id: 'hide-this-channel', defaultMessage: 'Hide this {channel}' },
  fileEncryption: { id: 'file-encryption', defaultMessage: 'File Encryption' },
  showFeedThumbnails: { id: 'show-feed-thumbnails', defaultMessage: 'Show Feed Thumbnails' },
  changeImage: { id: 'change-image', defaultMessage: 'Change Image' },
  removeImage: { id: 'remove-image', defaultMessage: 'Remove Image' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  addImage: { id: 'add-image', defaultMessage: 'Add Image' },
  confirmRemoveCoverArt: { id: 'are-you-sure', defaultMessage: 'Are you sure?' },
  selectChannelType: { id: 'select-channel-type', defaultMessage: 'Select {channel} type' },

  date: { id: 'date', defaultMessage: 'Date' },
  title: { id: 'title', defaultMessage: 'Title' },
  priority: { id: 'priority', defaultMessage: 'Priority' },
  likes: { id: 'likes', defaultMessage: 'Likes' },
  mostRead: { id: 'most-read', defaultMessage: 'Most Read' },
  leastRead: { id: 'least-read', defaultMessage: 'Least Read' },
  authorFirstName: { id: 'author-first-name', defaultMessage: 'Author First Name' },
  authorLastName: { id: 'author-last-name', defaultMessage: 'Author Last Name' },
  contentIQ: { id: 'content-iq', defaultMessage: 'Content IQ' },
});

const randomColour = () => {
  const colours = ['#f26724', '#c2214e', '#37c86a', '#f9c616', '#53539b', '#60b4e0'];
  return colours[Math.floor(Math.random() * colours.length)];
};

/**
 * Create/Edit user Admin modal
 */
export default class AdminChannelModal extends PureComponent {
  static propTypes = {
    //channelType: PropTypes.oneOf(['content_channel', 'feed_channel']),
    isFeed: PropTypes.bool,
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    authString: PropTypes.string,
    colour: PropTypes.string,
    feedLocation: PropTypes.string,

    isVisible: PropTypes.bool,
    showDelete: PropTypes.bool,

    onChange: function(props) {
      if (typeof props.onChange !== 'function') {
        return new Error('onChange is required');
      }
      return null;
    },
    onDelete: function(props) {
      if (props.showDelete && typeof props.onDelete !== 'function') {
        return new Error('onDelete is required when showDelete is true');
      }
      return null;
    },

    onThumbnailClick: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };

  static defaultProps = {
    isFeed: false,
    showThumbnails: false,
    defaultSortBy: 'date',
    colour: randomColour(),
    name: '',
    description: '',
    feedLocation: '',
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
      feedUrlError: false
    };
    autobind(this);
  }

  handlePreventClick(event) {
    event.preventDefault();
  }

  handleCancelRemoveThumbnailClick(event) {
    event.preventDefault();
    this.setState({ confirmDelete: false });
  }

  handleRemoveThumbnailClick(event) {
    // Confirm remove thumbnail
    if (this.props.thumbnail && !this.state.confirmDelete) {
      this.setState({ confirmDelete: true });

      // Propagate event
    } else {
      this.setState({ confirmDelete: false });
      this.props.onThumbnailClick(event);
    }
  }

  handleInputChange(event) {
    this.props.onChange({
      key: event.currentTarget.name,
      value: event.currentTarget.value
    });

    // reset error
    if (event.currentTarget.name === 'feedLocation' && this.state.feedUrlError) {
      this.setState({ feedUrlError: false });
    }
  }

  handleCheckUrl(event) {
    const urlRegexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    const feedUrl = event.currentTarget.value;

    if (feedUrl && !urlRegexp.test(feedUrl)) {
      this.setState({ feedUrlError: true });
    }
  }

  handleTextAreaChange(event) {
    this.props.onChange({
      key: event.currentTarget.name,
      value: event.currentTarget.value
    });
  }

  handleChannelTypeChange(context) {
    this.props.onChange({
      key: 'isFeed',
      value: context.id
    });
  }

  handleDefaultOrderChange(context) {
    this.props.onChange({
      key: 'defaultSortBy',
      value: context.value
    });
  }

  handleCheckboxChange(event) {
    this.props.onChange({
      key: event.currentTarget.value,
      value: event.currentTarget.checked
    });
  }

  handleSave(e) {
    if (typeof this.props.onSave === 'function') {
      this.props.onSave(e, this.props);
    }
  }

  handleDelete(e) {
    if (typeof this.props.onDelete === 'function') {
      this.props.onDelete(e, this.props);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      id,
      name,
      description,
      defaultSortBy,
      colour,
      thumbnail,
      isVisible,
      authString,
      showDelete,
      isFeed,
      feedLocation,
      onThumbnailClick
    } = this.props;
    const { confirmDelete } = this.state;
    const styles = require('./AdminChannelModal.less');
    const cx = classNames.bind(styles);
    const inputFeedClasses = cx({
      inputClass: true,
      inputError: !!this.state.feedUrlError
    });

    const strings = generateStrings(messages, formatMessage, { ...naming, name: name });
    const headerTitle = id ? strings.editNameChannel : strings.createNewChannel;
    const saveButton = id ? strings.save : strings.create;

    let thumbActionElem = (
      <div data-id="story-thumbnail" className={styles.thumbActionText} onClick={onThumbnailClick}>
        {strings.addImage}
      </div>
    );
    if (thumbnail && confirmDelete) {
      thumbActionElem = (
        <div data-id="story-thumbnail" className={styles.thumbActionConfirm}>
          <p>{strings.confirmRemoveCoverArt}</p>
          <div>
            <Btn alt onClick={this.handleCancelRemoveThumbnailClick}>{strings.cancel}</Btn>
            <Btn inverted onClick={this.handleRemoveThumbnailClick}>{strings.remove}</Btn>
          </div>
        </div>
      );
    } else if (thumbnail && !confirmDelete) {
      thumbActionElem = (
        <div data-id="story-thumbnail" className={styles.thumbActionText} onClick={this.handleRemoveThumbnailClick}>
          {strings.removeImage}
        </div>
      );
    }

    const channelTypeOptions = [
      { id: false, name: strings.contentChannel },
      { id: true, name: strings.feedChannel }
    ];

    const sortOptions = [
      { value: 'date', label: strings.date },
      { value: 'title', label: strings.title },
      { value: 'sequence', label: strings.priority, disabled: isFeed },
      { value: 'likes', label: strings.likes, disabled: isFeed },
      { value: 'mostread', label: strings.mostRead },
      { value: 'leastread', label: strings.leastRead },
      { value: 'author_first_name', label: strings.authorFirstName, disabled: isFeed },
      { value: 'author_last_name', label: strings.authorLastName, disabled: isFeed },
      { value: 'content_score', label: strings.contentIQ, disabled: isFeed }
    ];

    return (
      <Modal
        isVisible={isVisible}
        escClosesModal
        width="medium"
        headerChildren={
          <span>
            <span className={styles.headerTitle}>{headerTitle}</span>
            {showDelete && <Btn
              warning
              className={styles.deleteBtn}
              onClick={this.handleDelete}
              loading={this.props.loading}
            >
              {strings.delete}
            </Btn>}
          </span>
        }
        footerChildren={(<div>
          <Btn
            alt
            large
            onClick={this.props.onClose}
            style={{ marginRight: '0.5rem' }}
          >
            {strings.cancel}
          </Btn>
          <Btn
            inverted
            large
            loading={this.props.loading}
            style={{ marginLeft: '0.5rem' }}
            onClick={this.handleSave}
          >
            {saveButton}
          </Btn>
        </div>)}
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div>
          <div className={styles.selectWrapper}>
            <label htmlFor="channelType">{strings.channelType}</label>
            <Select
              name="channelType"
              value={{
                id: isFeed,
                name: channelTypeOptions.find((obj) => obj.id === isFeed).name
              }}
              clearable={false}
              options={channelTypeOptions}
              onChange={this.handleChannelTypeChange}
              className={styles.select}
              placeholder={strings.selectChannelType}
              valueKey="id"
              labelKey="name"
              disabled={!!id}
            />
          </div>
          <Text
            id="name"
            name="name"
            inline
            width="19rem"
            label={strings.name}
            value={name}
            className={styles.inputClass}
            onChange={this.handleInputChange}
          />
          <Textarea
            id="description"
            name="description"
            label={strings.description}
            value={description}
            className={styles.inputClass}
            onChange={this.handleTextAreaChange}
          />
          {isFeed && <Text
            id="feedLocation"
            name="feedLocation"
            inline
            width="19rem"
            label={strings.url}
            value={feedLocation}
            className={inputFeedClasses}
            onChange={this.handleInputChange}
            onBlur={this.handleCheckUrl}
          />}

          <div className={styles.imgWrapper}>
            <label>{strings.image}</label>
            <div className={styles.thumbPreview}>
              <div className={styles.thumbWrap}>
                <StoryThumb
                  {...this.props}
                  colour={colour}
                  thumbSize="large"
                  authString={authString}
                  onClick={this.handlePreventClick}
                  showThumb
                  grid
                />
                {thumbActionElem}
              </div>
            </div>
          </div>

          {!isFeed && <div className={styles.selectWrapper}>
            <label htmlFor="defaultSortBy">{strings.defaultOrder}</label>
            <Select
              id="defaultSortBy"
              name="defaultSortBy"
              value={{
                value: defaultSortBy,
                label: sortOptions.find((obj) => obj.value === defaultSortBy).label
              }}
              clearable={false}
              options={sortOptions}
              onChange={this.handleDefaultOrderChange}
              className={styles.select}
              valueKey="value"
              labelKey="label"
            />
          </div>}

          <div className={styles.optionsWrapper}>
            {!isFeed && <Checkbox
              label={strings.hideThisChannel}
              name="hideThisChannel"
              value="hideThisChannel"
              disabled={!!id}
              checked={this.props.isHidden}
              onChange={this.handleCheckboxChange}
            />}
            {!isFeed && <Checkbox
              label={strings.fileEncryption}
              name="fileEncryption"
              value="fileEncryption"
              disabled={!!id}
              checked={this.props.hasFileEncryption}
              onChange={this.handleCheckboxChange}
            />}
            {isFeed && <Checkbox
              label={strings.showFeedThumbnails}
              name="showThumbnails"
              value="showThumbnails"
              checked={this.props.showThumbnails}
              onChange={this.handleCheckboxChange}
            />}
          </div>
        </div>
      </Modal>
    );
  }
}
