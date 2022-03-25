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

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

const messages = defineMessages({
  createNewWebsite: { id: 'create-new-website', defaultMessage: 'Create New Website' },
  editNameWebsite: { id: 'edit-name-website', defaultMessage: 'Edit "{name}" Website' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  create: { id: 'create', defaultMessage: 'Create' },
  save: { id: 'save', defaultMessage: 'Save' },

  title: { id: 'title', defaultMessage: 'Title' },
  url: { id: 'url', defaultMessage: 'URL' },
  image: { id: 'image', defaultMessage: 'Image' },
  changeImage: { id: 'change-image', defaultMessage: 'Change Image' },
  removeImage: { id: 'remove-image', defaultMessage: 'Remove Image' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  addImage: { id: 'add-image', defaultMessage: 'Add Image' },
  confirmRemoveCoverArt: { id: 'are-you-sure', defaultMessage: 'Are you sure?' }
});

const randomColour = () => {
  const colours = ['#f26724', '#c2214e', '#37c86a', '#f9c616', '#53539b', '#60b4e0'];
  return colours[Math.floor(Math.random() * colours.length)];
};

/**
 * Create/Edit user Admin modal
 */
export default class AdminWebsiteModal extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    authString: PropTypes.string,
    colour: PropTypes.string,

    loading: PropTypes.bool,
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

    onLaunchLinkClick: PropTypes.func,
    onThumbnailClick: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    name: '',
    url: '',
    colour: randomColour(),
    thumbnail: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
    };

    // Randomise background-position
    const y = (Math.random() * 100).toFixed(0);
    this.bgPos = { bgPos: '0 ' + y + '%' };

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
  }

  handleTextAreaChange(event) {
    this.props.onChange({
      key: event.currentTarget.name,
      value: event.currentTarget.value
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
    const {
      id,
      name,
      url,
      thumbnail,
      isVisible,
      authString,
      showDelete,
      colour,
      onThumbnailClick,
      style
    } = this.props;
    const { confirmDelete } = this.state;
    const styles = require('./AdminWebsiteModal.less');

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { name: name });

    const headerTitle = id ? strings.editNameWebsite : strings.createNewWebsite;
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

    // Only append authString is thumbnail is hosted on push
    const thumbUrl = thumbnail && thumbnail.indexOf('push.bigtincan') > -1 ? (thumbnail + authString) : thumbnail;

    const thumbStyle = {
      height: '286px',
      width: '100%',
      backgroundColor: !thumbnail ? colour : false,
      backgroundPosition: !thumbnail ? this.bgPos : false,
      backgroundSize: thumbnail ? 'cover' : '200%',
      backgroundImage: thumbnail ? 'url(' + thumbUrl + ')' : false,
      ...style
    };

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
            alt large onClick={this.props.onClose}
            style={{ marginRight: '0.5rem' }} loading={this.props.loading}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={this.handleSave}
            style={{ marginLeft: '0.5rem' }} loading={this.props.loading}
          >{saveButton}</Btn>
        </div>)}
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div>
          <div className={styles.imgWrapper}>
            <div className={styles.thumbPreview}>
              <div className={styles.thumbWrap}>
                <div
                  className={styles.WebsiteThumb}
                  style={thumbStyle}
                />
                {thumbActionElem}
              </div>
            </div>
          </div>

          <Text
            id="name"
            name="name"
            inline
            width="24.4rem"
            label={strings.title}
            value={name}
            className={styles.inputClass}
            onChange={this.handleInputChange}
          />

          <div className={styles.launchWrapper}>
            <Text
              id="url"
              name="url"
              inline
              width="24.4rem"
              label={strings.url}
              value={url}
              className={styles.inputClass}
              onChange={this.handleInputChange}
            />
            {url && <span className={styles.redirectLink} onClick={this.props.onLaunchLinkClick} />}
          </div>
        </div>
      </Modal>
    );
  }
}
