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
import Checkbox from 'components/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import Select from 'components/Select/Select';
import StoryThumb from 'components/StoryThumb/StoryThumb';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';

const messages = defineMessages({
  createNewGroup: { id: 'create-new-group', defaultMessage: 'Create New Group' },
  editNameGroup: { id: 'edit-name-group', defaultMessage: 'Edit "{name}" Group' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  create: { id: 'create', defaultMessage: 'Create' },
  save: { id: 'save', defaultMessage: 'Save' },

  name: { id: 'name', defaultMessage: 'Name' },
  notes: { id: 'notes', defaultMessage: 'Notes' },
  permissions: { id: 'permissions', defaultMessage: 'Permissions' },
  image: { id: 'image', defaultMessage: 'Image' },
  interestArea: { id: 'interest-area', defaultMessage: 'Interest Area' },
  view: { id: 'view', defaultMessage: 'View' },
  publish: { id: 'publish', defaultMessage: 'Publish' },
  viewAndPublish: { id: 'view-and-publish', defaultMessage: 'View & Publish' },
  viewAndEdit: { id: 'view-and-edit', defaultMessage: 'View & Edit' },
  changeImage: { id: 'change-image', defaultMessage: 'Change Image' },
  removeImage: { id: 'remove-image', defaultMessage: 'Remove Image' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  addImage: { id: 'add-image', defaultMessage: 'Add Image' },
  confirmRemoveCoverArt: { id: 'are-you-sure', defaultMessage: 'Are you sure?' },
});

const randomColour = () => {
  const colours = ['#e2023a', '#e202ae', '#7e00b9', '#0092ec', '#02e8d1', '#04e44a', '#ffd400', '#f26724', '#7e622a', '#4c4c4c'];
  return colours[Math.floor(Math.random() * colours.length)];
};

/**
 * Create/Edit user Admin modal
 */
export default class AdminGroupModal extends PureComponent {
  static propTypes = {
    canSubscribe: PropTypes.bool,
    id: PropTypes.number,
    name: PropTypes.string,
    notes: PropTypes.string,
    thumbnail: PropTypes.string,
    authString: PropTypes.string,
    type: PropTypes.string,
    colour: PropTypes.string,
    usersCount: PropTypes.number,
    permissions: PropTypes.number,

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
    showPermissions: true,
    notes: '',
    name: '',
    permissions: 0,
    canSubscribe: false,
    colour: randomColour()
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
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

  handlePermissionsChange(context) {
    this.props.onChange({
      key: 'permissions',
      value: context.id
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
    const {
      id,
      name,
      notes,
      permissions,
      thumbnail,
      canSubscribe,
      colour,
      isVisible,
      authString,
      showDelete,

      onThumbnailClick,
    } = this.props;
    const { confirmDelete } = this.state;
    const styles = require('./AdminGroupModal.less');

    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, { ...naming, name: name });

    const headerTitle = id ? strings.editNameGroup : strings.createNewGroup;
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

    const permissionOptions = [
      { id: 1, name: strings.view },
      { id: 2, name: strings.publish },
      { id: 3, name: strings.viewAndPublish },
      { id: 9, name: strings.viewAndEdit }
    ];

    const isPersonalGroup = this.props.email || this.props.isPersonal;

    const permissionSelected = permissionOptions.find((obj) => obj.id === permissions) || permissionOptions[0];
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
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={this.handleSave}
            loading={this.props.loading} style={{ marginLeft: '0.5rem' }}
          >{saveButton}</Btn>
        </div>)}
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div>
          {!isPersonalGroup && <Text
            id="name"
            name="name"
            inline
            width="19rem"
            label={strings.name}
            value={name}
            className={styles.inputClass}
            onChange={this.handleInputChange}
          />}

          {!isPersonalGroup && <Textarea
            id="notes"
            name="notes"
            label={strings.notes}
            value={notes}
            className={styles.inputClass}
            onChange={this.handleTextAreaChange}
          />}

          {this.props.showPermissions && <div className={styles.selectWrapper}>
            <label htmlFor="permissions">{strings.permissions}</label>
            <Select
              id="permissions"
              name="permisssions"
              value={{ id: permissions, name: permissionSelected.name }}
              clearable={false}
              options={permissionOptions}
              onChange={this.handlePermissionsChange}
              className={styles.select}
              valueKey="id"
              labelKey="name"
            />
          </div>}

          {!isPersonalGroup && <div className={styles.selectWrapper}>
            <label />
            <div className={styles.checkboxGroupWrap}>
              <Checkbox
                label={strings.interestArea}
                name="canSubscribe"
                value="canSubscribe"
                checked={canSubscribe}
                onChange={this.handleCheckboxChange}
              />
            </div>
          </div>}

          {!isPersonalGroup && <div className={styles.imgWrapper}>
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
          </div>}

        </div>
      </Modal>
    );
  }
}
