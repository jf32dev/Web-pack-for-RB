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
 * @author Shibu Bhattarai <shibu.bhattarai@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import TriggerList from 'components/TriggerList/TriggerList';
import generateStrings from 'helpers/generateStrings';
import { mapStories } from 'redux/modules/entities/helpers';
import ImagePickerModal from 'components/ImagePickerModal/ImagePickerModal';
import DateTimePicker from 'components/DateTimePicker/DateTimePicker';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';
import { uniqueId, isNumber } from 'lodash';
import { createPrompt } from 'redux/modules/prompts';
import { defineMessages, FormattedDate } from 'react-intl';
import moment from 'moment-timezone';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import StoryThumb from 'components/StoryThumb/StoryThumb';

import {
  loadScheduledStories
} from 'redux/modules/user';

import {
  save,
  load,
  close
} from 'redux/modules/story/story';

const messages = defineMessages({

  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  create: { id: 'create', defaultMessage: 'Create' },
  save: { id: 'save', defaultMessage: 'Save' },
  saving: { id: 'saving', defaultMessage: 'Saving' },
  title: { id: 'title', defaultMessage: 'Title' },
  descriptionExcerpt: { id: 'description-excerpt', defaultMessage: 'Description Excerpt' },
  image: { id: 'image', defaultMessage: 'Image' },
  defaultOrder: { id: 'default-order', defaultMessage: 'Default Order' },
  quickEdit: { id: 'quick-edit', defaultMessage: 'Quick Edit' },
  changeImage: { id: 'change-image', defaultMessage: 'Change Image' },
  removeImage: { id: 'remove-image', defaultMessage: 'Remove Image' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  addImage: { id: 'add-image', defaultMessage: 'Add Image' },
  scheduledEmptyHeading: { id: 'no-scheduled-stories-empty-heading', defaultMessage: 'No scheduled {stories}' },
  scheduledEmptyMessage: { id: 'no-scheduled-stories-empty-message', defaultMessage: '{stories} you have scheduled with appear here' },
  quickEditDialogTitle: { id: 'quick-edit-dialog-title', defaultMessage: 'title' },
  publishTime: { id: 'schedule-publishing-time', defaultMessage: 'Schedule Publishing Time' },
  publishTimeNote: { id: 'schedule-publishing-time-note', defaultMessage: 'Set a date and time to publish this {story}.' },
  expiryTime: { id: 'schedule-expiry-time', defaultMessage: 'Schedule Expiry Time' },
  expiryTimeNote: { id: 'schedule-expiry-time-note', defaultMessage: 'Set a date and time for this {story} to expire. The {story} and content will be removed from devices after the scheduled time.' },
  storyTitle: { id: 'story-title', defaultMessage: '{story} Title' },
  quicklinkTitle: { id: 'quicklink-title', defaultMessage: 'Quicklink Title' },
  excerptPlaceholder: { id: 'story-excerpt-placeholder', defaultMessage: 'Type your excerpt...' },
  saveError: { id: 'save-error', defaultMessage: 'Save Error' },
  publishNow: { id: 'publish-now', defaultMessage: 'Publish Now' },
  expiryTimeValidationMessage: { id: 'expiry-time-validation-message', defaultMessage: 'The expiry date and time must occur after the publish date' },
});


const PublishTimeOption = (props) => {
  const {
    publishAt,
    publishAtTz,
    strings,
    styles,
    onChange,
    canEdit
  } = props;
  const minStart = new Date();

  return (
    <div data-id="publishTime" className={styles.publishTime}>
      <label>{strings.publishTime}</label>
      <div className={styles.publishTimeSettings}>
        { canEdit &&
        <DateTimePicker
          className={styles.picker}
          datetime={publishAt * 1000}
          tz={publishAtTz}
          min={minStart}
          showTz={false}
            //format={}
          onChange={onChange}
        />
       }
        { !canEdit && <div className={styles.pickerValue}>
          <FormattedDate
            value={publishAt * 1000}
            day="2-digit"
            month="2-digit"
            year="numeric"
            hour="2-digit"
            minute="2-digit"
          /></div>}
      </div>
    </div>
  );
};

const ExpiryTimeOption = (props) => {
  const {
    expiresAt,
    expiresAtTz,
    publishAt,
    strings,
    styles,
    onChange,
    canEdit
  } = props;
  // Add minimum 30 minute expiry time
  const minExpire = publishAt > 0 ? (moment(new Date(publishAt * 1000)).add(30, 'minutes').toDate()) : new Date();
  const isValidExpireDate = publishAt > expiresAt;
  return (
    <div data-id="expiryTime" className={styles.expiryTime}>
      <label>{strings.expiryTime}</label>
      <div className={styles.expiryTimeSettings}>
        {isValidExpireDate && <span className={styles.error} aria-label={strings.expiryTimeValidationMessage}>
          <span className={styles.warning} />
        </span>}
        { canEdit &&
        <DateTimePicker
          disabled={!canEdit}
          className={styles.picker}
          showTz={false}
          datetime={expiresAt * 1000}
          tz={expiresAtTz}
          min={minExpire}
        //format={}
          onChange={onChange}
        />
      }
        { !canEdit && <div className={styles.pickerValue}>
          <FormattedDate
            value={expiresAt * 1000}
            day="2-digit"
            month="2-digit"
            year="numeric"
            hour="2-digit"
            minute="2-digit"
          /></div>}
      </div>
    </div>
  );
};
function mapStateToProps(state) {
  const { entities, story, me, settings } = state;
  const { saveError, saved, saving } = story;
  const userId = settings.user.id;

  // Merge me and user store
  const details = {
    ...entities.users[userId]
  };

  // Map channels to array
  // Note: Story Edit uses it's own channelsById and not entities.channels
  const channels = story.channels.map(id => story.channelsById[id]);

  const scheduledStories = mapStories(details.scheduledStories, entities);
  return {
    ...details,
    entities,
    userId,
    channels: channels.filter(obj => !obj.deleted),
    scheduledStories,
    currentStory: story,
    saveError,
    saved,
    saving,
    error: me.error
  };
}


@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    loadScheduledStories,
    save,
    load,
    close
  })
)
export default class ScheduledStories extends PureComponent {
  static propTypes = {
    onStoryClick: PropTypes.func.isRequired,
    scheduledStories: PropTypes.array,
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    onStoryClick: () => {},
    scheduledStories: []
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      showQuickEditDialog: false,
      storyDetails: {},
      confirmDelete: false,
      imagePickerModalVisible: false,
      isDeleteMode: false,
      currentSelectedItems: [],
      hasStoryChanged: false
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { saveError } = nextProps;
    const strings = generateStrings(messages, formatMessage, naming);
    if (this.props.currentStory.permId !== nextProps.currentStory.permId) {
      this.setState({
        storyDetails: nextProps.currentStory
      });
    }
    // Handle save errors
    if (saveError && saveError.message && saveError.message !== this.props.saveError.message) {
      let title = strings.saveError;  // TODO: replace with string
      let message = saveError.message;

      if (saveError.statusCode) {
        title = `(${saveError.statusCode}) ${title}`;
      }
      if (saveError.original) {
        message += ': ' + saveError.original;
      }

      this.props.createPrompt({
        id: uniqueId('story-'),
        type: 'error',
        title: title,
        message: message,
        dismissible: true,
        autoDismiss: 10
      });
    }
    if (nextProps.saved && (this.props.saved !== nextProps.saved) && this.state.showQuickEditDialog) {
      this.props.close();
      this.handleLoadScheduledStories();
      this.setState({
        showQuickEditDialog: false,
        hasStoryChanged: false
      });
    }
  }

  handleLoadScheduledStories(offset = 0) {
    this.props.loadScheduledStories(this.props.userId, offset);
  }

  handleQuickClick(event, context) {
    const { props } = context;
    this.setState({
      storyDetails: props,
    });
    this.props.load(props.permId);
    this.handleToggleQuickEditDialog();
  }

  handleToggleQuickEditDialog() {
    this.setState({
      showQuickEditDialog: !this.state.showQuickEditDialog,
      hasStoryChanged: false
    });
  }

  handleRemoveThumbnailClick() {
    const { storyDetails, confirmDelete } = this.state;
    if (storyDetails.thumbnail && !confirmDelete) {
      this.setState({ confirmDelete: true, hasStoryChanged: true });
    } else {
      this.setState({ confirmDelete: false, hasStoryChanged: true });
      this.handleThumbnailClick(event);
    }
  }

  handleCancelRemoveThumbnailClick(event) {
    event.preventDefault();
    this.setState({ confirmDelete: false });
  }

  handleThumbnailClick() {
    const storyDetails = Object.assign({}, this.state.storyDetails);
    if (storyDetails.thumbnail) {
      storyDetails.thumbnail = '';
      this.setState({
        storyDetails,
        hasStoryChanged: this.isOperationValid(storyDetails)
      });
    } else {
      this.setState({
        imagePickerModalVisible: true,
        showQuickEditDialog: false,
        hasStoryChanged: this.isOperationValid(storyDetails)
      });
    }
  }

  handleChannelImagePickerCancel() {
    this.setState({
      imagePickerModalVisible: false,
      showQuickEditDialog: true
    });
  }

  handleChannelImagePickerSave(event, images) {
    if (images && images[0]) {
      // Cover Art
      this.setState({
        storyDetails: { ...this.state.storyDetails, thumbnailId: images[0].id, thumbnail: images[0].url, thumbnailDownloadUrl: images[0].download_location },
        imagePickerModalVisible: false,
        showQuickEditDialog: true,
      });
    }
  }

  handlePublishTimeChange(timestamp, tz) {
    const storyDetails = Object.assign({}, this.state.storyDetails);
    storyDetails.publishAt = parseInt(timestamp / 1000, 10);
    storyDetails.publishAtTz = tz;
    this.setState({
      storyDetails,
      hasStoryChanged: this.isOperationValid(storyDetails)
    });
  }

  handlePublishTimeToggle(event) {
    const storyDetails = Object.assign({}, this.state.storyDetails);
    if (event.target.checked) {
      const now = new Date();
      const fixedTime = parseInt(now / 1000, 10);  // ready for server
      storyDetails.publishAt = fixedTime;
    } else {
      storyDetails.publishAt = 0;
    }
    this.setState({
      storyDetails,
      hasStoryChanged: this.isOperationValid(storyDetails)
    });
  }

  handleExpiryTimeToggle(event) {
    const storyDetails = Object.assign({}, this.state.storyDetails);
    if (event.target.checked) {
      const now = new Date();
      now.setDate(now.getDate() + 14);  // add two weeks
      const fixedTime = parseInt(now / 1000, 10);  // ready for server
      storyDetails.expiresAt = fixedTime;
    } else {
      storyDetails.expiresAt = 0;
    }
    this.setState({
      storyDetails
    });
  }

  handleExpiryTimeChange(timestamp, tz) {
    const storyDetails = Object.assign({}, this.state.storyDetails);
    storyDetails.expiresAt = parseInt(timestamp / 1000, 10);
    storyDetails.expiresAtTz = tz;
    this.setState({
      storyDetails,
      hasStoryChanged: this.isOperationValid(storyDetails)
    });
  }

  /**
   * Description handlers
   */
  handleExcerptChange(event) {
    const storyDetails = Object.assign({}, this.state.storyDetails);
    const value = event.target.value;
    storyDetails.excerpt = value;
    this.setState({
      storyDetails,
      hasStoryChanged: this.isOperationValid(storyDetails)
    });
  }

  isOperationValid(modifyStoryDetails) {
    let isDataValid = false;
    if (this.props.currentStory.expiresAt > 0) {
      isDataValid = modifyStoryDetails.expiresAt > modifyStoryDetails.publishAt;
    } else {
      isDataValid = this.props.currentStory.publishAt !== modifyStoryDetails.publishAt;
    }
    if (!isDataValid) {
      return false;
    }
    return isDataValid || this.props.currentStory.name !== modifyStoryDetails.name || this.props.currentStory.excerpt !== modifyStoryDetails.excerpt;
  }

  handleNameChange(event) {
    const storyDetails = Object.assign({}, this.state.storyDetails);
    const value = event.target.value;
    storyDetails.name = value;
    this.setState({
      storyDetails,
      hasStoryChanged: this.isOperationValid(storyDetails)
    });
  }

  handleClose() {
    this.props.close();
    this.handleToggleQuickEditDialog();
  }

  handleSave() {
    this.saveStory(false);
  }

  handlePublishNow() {
    this.saveStory(true);
  }

  saveStory(publoshNow = false) {
    const { storyDetails } = this.state;
    // Prepare Story Data
    // Extract id/alias from channels
    const channels = [];
    this.props.channels.forEach(function(c) {
      channels.push({
        id: c.id,
        alias: c.alias
      });
    });
    const body = {
      id: storyDetails.id || null,
      permId: storyDetails.permId || null,
      name: storyDetails.name,
      excerpt: storyDetails.excerpt,
      thumbnail: storyDetails.thumbnail,
      thumbnailDownloadUrl: storyDetails.thumbnailDownloadUrl,

      // Expiry/Publish
      expiresAt: publoshNow ? 0 : storyDetails.expiresAt,
      expiresAtTz: storyDetails.expiresAtTz,
      publishAt: publoshNow ? 0 : storyDetails.publishAt,
      publishAtTz: storyDetails.publishAtTz,
      // Arrays
      channels: channels
    };

    // Save Story
    this.props.save(body);
  }

  handleStoryClick(event, context) {
    if (this.state.isDeleteMode) {
      const currentStory = this.props.scheduledStories.find(item => item.permId === context.props.permId);
      currentStory.isSelected = !currentStory.isSelected;
      this.setState({
        currentSelectedItems: this.props.scheduledStories.filter((item) => item.isSelected)
      });
    } else {
      this.props.onStoryClick(event, context);
    }
  }

  render() {
    const {
      scheduledStories,
      scheduledStoriesLoaded,
      scheduledStoriesLoading,
      scheduledStoriesComplete,
      scheduledStoriesError,
      saving
    } = this.props;
    const { naming, userCapabilities } = this.context.settings;
    const {
      showStoryOptionExpiryDate,
      showStoryOptionPublishDate,
      showStoryAuthor,
    } = userCapabilities;
    const { storyDetails, isDeleteMode } = this.state;
    const { formatMessage } = this.context.intl;
    const styles = require('./ScheduledStories.less');
    const {
      thumbnail,
      colour,
      isQuicklink,
    } = storyDetails;

    const {
      confirmDelete,
      currentSelectedItems,
      hasStoryChanged
    } = this.state;
    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    let thumbActionElem = (
      <div data-id="story-thumbnail" className={styles.thumbActionText} onClick={this.handleThumbnailClick}>
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
    const placeholderTitle = isQuicklink ? strings.quicklinkTitle : strings.storyTitle;
    let author = storyDetails.author;
    if (author && isNumber(storyDetails.author)) {
      author = this.props.entities.users[storyDetails.author];
    }
    const { authString } = this.context.settings;
    return (
      <div className={styles.container}>
        { isDeleteMode &&
        <div>{currentSelectedItems.length}</div>
        }
        <TriggerList
          list={scheduledStories}
          isLoaded={scheduledStoriesLoaded}
          isLoading={scheduledStoriesLoading}
          isLoadingMore={scheduledStoriesLoading && scheduledStories.length > 0}
          isComplete={scheduledStoriesComplete}
          error={scheduledStoriesError}
          onGetList={this.handleLoadScheduledStories}
          listProps={{
            grid: true,
            itemProps: {
              showBadges: false,
              showIcons: false,
              showThumb: true,
              showQuickEdit: true,
              showCheckbox: isDeleteMode,
              onQuickEditClick: this.handleQuickClick,
              showAuthor: showStoryAuthor,
            },
            emptyHeading: strings.scheduledEmptyHeading,
            emptyMessage: strings.scheduledEmptyMessage,
            onItemClick: this.handleStoryClick
          }}
        />
        {this.state.showQuickEditDialog && <Modal
          isVisible={this.state.showQuickEditDialog}
          escClosesModal
          headerChildren={
            <span>
              <span className={styles.headerTitle}>{strings.quickEdit}</span>
            </span>
        }
          footerChildren={(<div className={styles.actionContainer}>
            <div className={styles.actionBtn}>
              <Btn
                alt
                large
                onClick={this.handleClose}
                style={{ marginRight: '0.5rem' }}
              >
                {strings.cancel}
              </Btn>
              <Btn
                inverted
                large
                disabled={saving || !hasStoryChanged}
                loading={saving}
                style={{ marginLeft: '0.5rem' }}
                onClick={this.handleSave}
              >
                {this.props.saving ? strings.saving : strings.save}
              </Btn>
            </div>
            <div className={styles.publishNow} onClick={this.handlePublishNow}>{strings.publishNow}</div>
          </div>)}
          onClose={this.handleClose}
          bodyClassName={styles.modalBody}
          footerClassName={styles.footer}
        >
          <div className={styles.dialogBody}>
            <div className={styles.imgWrapper}>
              <div className={styles.thumbPreview}>
                <div className={styles.thumbWrap}>
                  <StoryThumb
                    {...this.state.storyDetails}
                    colour={colour}
                    thumbSize="large"
                    authString={authString}
                    onClick={this.handlePreventClick}
                    showThumb
                    grid
                  />
                  {thumbActionElem}
                </div>
                <div className={styles.previewTitle}>{storyDetails.name}</div>
                {showStoryAuthor && <div className={styles.previewAuthor}>{author.name}</div>}
              </div>
            </div>
            <div className={styles.contentWrapper}>
              <div style={{ width: '100%' }}>
                <div className={styles.title}>
                  <label>{strings.title}</label>
                  <Text
                    id="story-edit-name"
                    placeholder={placeholderTitle}
                    value={storyDetails.name}
                    onChange={this.handleNameChange}
                  />
                </div>
                <label>{strings.descriptionExcerpt}</label>
                <Textarea
                  id="story-edit-excerpt"
                  placeholder={strings.excerptPlaceholder}
                  value={storyDetails.excerpt}
                  rows={2}
                  maxLength={90}
                  onChange={this.handleExcerptChange}
                />
              </div>
              <PublishTimeOption
                canEdit={showStoryOptionPublishDate}
                publishAt={storyDetails.publishAt}
                publishAtTz={storyDetails.publishAtTz}
                strings={strings}
                styles={styles}
                onChange={this.handlePublishTimeChange}
              />

              {storyDetails.expiresAt > 0 && <ExpiryTimeOption
                canEdit={showStoryOptionExpiryDate}
                expiresAt={storyDetails.expiresAt}
                expiresAtTz={storyDetails.expiresAtTz}
                publishAt={storyDetails.publishAt}
                strings={strings}
                styles={styles}
                onChange={this.handleExpiryTimeChange}
              />
              }
            </div>
          </div>
        </Modal>}
        {/* Channel Image Picker Modal */}
        {this.state.imagePickerModalVisible && <ImagePickerModal
          isVisible
          category="cover_art"
          onClose={this.handleChannelImagePickerCancel}
          onSave={this.handleChannelImagePickerSave}
        />}
      </div>
    );
  }
}
