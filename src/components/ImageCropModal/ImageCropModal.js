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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt } from 'redux/modules/prompts';

import Btn from 'components/Btn/Btn';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import ImageCrop from 'components/ImageCrop/ImageCrop';
import Modal from 'components/Modal/Modal';

const messages = defineMessages({
  done: { id: 'done', defaultMessage: 'Done' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  select: { id: 'select', defaultMessage: 'Select' },
  upload: { id: 'upload', defaultMessage: 'Upload' },
  repositionAndScale: { id: 'reposition-scale', defaultMessage: 'Reposition & Scale' },
  uploadImage: { id: 'upload-image', defaultMessage: 'Upload Image' },
});

function mapStateToProps(state) {
  return {
    ...state.user,
  };
}
@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt
  })
)
export default class ImageCropModal extends PureComponent {
  static propTypes = {
    // Canvas size
    width: PropTypes.number,
    height: PropTypes.number,
    imageUploaded: PropTypes.string,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    images: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      base64Image: ''
    };
    autobind(this);
  }

  // Cropping Image result
  handleOnImageChange(image) {
    this.setState({ base64Image: image });
  }

  handleSaveClick() {
    this.props.onSave(this.state.base64Image || this.props.imageUploaded);
    this.props.onClose();
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      onClose,
      thumbnailUploading
    } = this.props;
    const styles = require('./ImageCropModal.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const header = [{
      name: strings.repositionAndScale,
      path: ''
    }];

    return (
      <Modal
        backdropClosesModal
        escClosesModal
        isVisible={this.props.isVisible}
        headerChildren={(
          <Breadcrumbs paths={header} className={styles.headerCrumbs} />
        )}
        footerChildren={(
          <Fragment>
            <Btn large alt onClick={onClose}>
              {strings.cancel}
            </Btn>
            <Btn
              large
              inverted
              onClick={this.handleSaveClick}
              disabled={thumbnailUploading}
            >
              {thumbnailUploading && strings.loading}
              {!thumbnailUploading && strings.done}
            </Btn>
          </Fragment>
        )}
        className={styles.AvataraPickerModal}
        headerClassName={styles.header}
        bodyClassName={styles.body}
        footerClassName={styles.footer}
        onClose={onClose}
      >
        <div className={styles.imageCrop}>
          <ImageCrop
            image={this.props.imageUploaded}
            width={this.props.width}
            height={this.props.height}
            resize={this.props.resize}
            resizeWidth={this.props.resizeWidth}
            resizeHeight={this.props.resizeHeight}
            showZoom
            onImageChange={this.handleOnImageChange}
          />
        </div>
      </Modal>
    );
  }
}
