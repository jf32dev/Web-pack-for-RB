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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import _get from 'lodash/get';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { Prompt } from 'react-router';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  addItem,
  deleteById,
  removeById,
  getList,
  post,
  put,
  reset,
  setData,
  setValue
} from 'redux/modules/admin/userMetadata';
import { createPrompt } from 'redux/modules/prompts';

import AdminBulkUserImport from '../AdminBulkUserImport/AdminBulkUserImport';
import AdminUserMetadata from 'components/Admin/AdminUserMetadata/AdminUserMetadata';
import Loader from 'components/Loader/Loader';

const messages = defineMessages({
  customUserMetadata: {
    id: 'custom-user-metadata',
    defaultMessage: 'Custom User Metadata'
  },
  customUserMetadataDesc: {
    id: 'custom-user-metadata-desc',
    defaultMessage: 'Provide attributes and values that users can apply to their profile. Use custom user metadata to further group users by different data sets for reporting e.g region, country, role etc.',
  },
  attribute: {
    id: 'attribute',
    defaultMessage: 'Attribute'
  },
  error: {
    id: 'error',
    defaultMessage: 'Error'
  },
  addMetadata: {
    id: 'add-metadata',
    defaultMessage: 'Add  Metadata'
  },
  bulkImport: {
    id: 'bulk-import',
    defaultMessage: 'Bulk Import'
  },
  values: {
    id: 'values',
    defaultMessage: 'Values'
  },
  hidden: {
    id: 'hidden',
    defaultMessage: 'Hidden'
  },
  locked: {
    id: 'locked',
    defaultMessage: 'Locked'
  },
  lockAttribute: {
    id: 'lock-attribute',
    defaultMessage: 'Lock Attribute'
  },
  unlockAttribute: {
    id: 'unlock-attribute',
    defaultMessage: 'Unlock Attribute'
  },
  makeAttributeInvisible: {
    id: 'make-attribute-invisible',
    defaultMessage: 'Make Attribute Invisible'
  },
  makeAttributeVisible: {
    id: 'make-attribute-visible',
    defaultMessage: 'Make Attribute Visible'
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete'
  },
  deleteMetadata: {
    id: 'delete-metadata',
    defaultMessage: 'Delete Metadata'
  },
  confirmRemoveHeader: {
    id: 'confirm-remove-header',
    defaultMessage: 'Are you sure you want to delete this Metadata? Deleting Metadata cannot be undone.'
  },
  duplicateAttributeMsg: {
    id: 'duplicate-attribute-msg',
    defaultMessage: 'Sorry, that attribute already exists. Try another attribute name.'
  },
  duplicateValueMsg: {
    id: 'duplicate-value-msg',
    defaultMessage: 'Sorry, that value has already been added. Try a different value name.'
  },
  emptyAttributeMsg: {
    id: 'empty-attribute-msg',
    defaultMessage: 'Empty Attribute Error'
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  },
  noValues: {
    id: 'no-values',
    defaultMessage: 'No values'
  },
  attributeName: {
    id: 'attribute-name',
    defaultMessage: 'Attribute Name'
  },
  unsavedChangesMessage: {
    id: 'unsaved-changes-message',
    defaultMessage: 'You have unsaved content, are you sure you want to leave?'
  },
});

function mapStateToProps(state) {
  const { admin } = state;
  const { userMetadata } = admin;

  const list = userMetadata.userMetadata.map(id => {
    const valueList = userMetadata.userMetadataById[id].values
      .map(idValue => userMetadata.valueById[idValue])
      .sort((a, b) => a.attributeValue.localeCompare(b.attributeValue));

    return {
      ...userMetadata.userMetadataById[id],
      values: valueList
    };
  }).filter(item => !item.deleted);

  return {
    ...userMetadata,
    loading: userMetadata.loading || userMetadata.postLoading || userMetadata.putLoading,
    userMetadata: [].concat(list).sort((a, b) => +a.id - +b.id)
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    addItem,
    createPrompt,
    deleteUserMetadata: deleteById,
    getList,
    postUserMetadata: item => post({
      ...item,
      id: 'new',
      values: item.values.map(obj => (obj.id > -1 ? obj : {
        ...obj,
        id: 'new',
      }))
    }),
    putUserMetadata: item => put({
      ...item,
      values: item.values.map(obj => (obj.id > -1 ? obj : {
        ...obj,
        id: 'new',
      }))
    }),
    removeById,
    reset,
    setData,
    setValue
  })
)
export default class AdminUserMetadataMain extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    userMetadata: [],
    isSaveDisabled: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      isBulkUploadModalVisible: false,
    };
    autobind(this);

    // Admin Routes with sub-routes
    this.subRoutes = [
      '/admin/general',
      '/admin/security',
      '/admin/learning',
      '/admin/gamification',
      '/admin/stories',
      '/admin/email',
      '/admin/files',
    ];
  }

  componentDidMount() {
    if (typeof this.props.getList === 'function') {
      this.props.getList();
    }
  }

  componentDidUpdate(prevProps) {
    // Learning error
    const nextError = _get(this.props, 'error.message', '');
    if (nextError && nextError !== _get(prevProps, 'error.message', '')) {
      this.props.createPrompt({
        id: 'user-metadata-error',
        type: 'error',
        message: nextError,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  componentWillUnmount() {
    const hasUnsavedChanges = this.props.userMetadata.filter(item => item.isModified).length > 0;
    // Reset changes
    if (hasUnsavedChanges) {
      this.props.reset();
    }
  }

  handleOnChange(data) {
    if (typeof this.props.setData === 'function') {
      this.props.setData(data);
    }
  }

  handleOnChangeValues(data) {
    if (typeof this.props.setValue === 'function') {
      this.props.setValue(data);
    }
  }

  handleAddItem() {
    if (typeof this.props.addItem === 'function') {
      this.props.addItem();
    }
  }

  handleRemove(id) {
    if (typeof this.props.deleteUserMetadata === 'function' && id > 0) {
      this.props.deleteUserMetadata(id);
    } else if (typeof this.props.removeById === 'function') {
      this.props.removeById(id);
    }
  }

  handleOnBlurText(event, context) {
    const {
      formatMessage
    } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    this.props.userMetadata.map(item => {
      if (context.id &&
        item.id !== context.id &&
        item.attribute.toLowerCase() === context.attribute.toLowerCase()
      ) {
        this.props.createPrompt({
          id: 'duplicate-metadata-error',
          type: 'error',
          message: strings.duplicateAttributeMsg,
          dismissible: true,
          autoDismiss: 5
        });
      }
      return null;
    });
  }

  handleSave() {
    const {
      userMetadata
    } = this.props;

    for (const attribute of userMetadata) {
      if (attribute.tmpId < 0) {
        // Create new item
        this.props.postUserMetadata(attribute);
      } else if (attribute.isModified) {
        // Updates
        this.props.putUserMetadata(attribute);
      }
    }
  }

  // Toggle bulk upload modal
  handleToggleBulkUploadModal(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // check status before open
    if (!this.state.isBulkUploadModalVisible && this.props.getBulkImportStatus) {
      this.props.getBulkImportStatus();
    }

    this.setState({
      isBulkUploadModalVisible: !this.state.isBulkUploadModalVisible,
    });
  }

  render() {
    const {
      loading,
      userMetadata,
    } = this.props;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);
    const hasUnsavedChanges = userMetadata.filter(item => item.isModified).length > 0;
    const hasRouterChanged = (window.location.pathname !== '/admin' || window.location.pathname !== '/admin/custom-user-metadata');

    return (
      <div>
        {loading && <Loader type="page" />}
        <AdminUserMetadata
          strings={strings}
          loading={loading}
          list={userMetadata}
          onAdd={this.handleAddItem}
          onChange={this.handleOnChange}
          onChangeValues={this.handleOnChangeValues}
          onRemove={this.handleRemove}
          onSave={this.handleSave}
          onBlurText={this.handleOnBlurText}
          showBulkUpload={false}
          onBulkUploadClick={this.handleToggleBulkUploadModal}
        />

        {hasRouterChanged && <Prompt
          when={hasUnsavedChanges}
          message={location => ((!this.subRoutes.includes(location.pathname) || location.pathname.indexOf('/admin') === -1) && location.pathname !== '/admin' ?
            strings.unsavedChangesMessage :
            true
          )}
        />}

        {this.state.isBulkUploadModalVisible && <AdminBulkUserImport
          type="user_metadata_import"
          onModalUploadClose={this.handleToggleBulkUploadModal}
          showSampleFiles
          getList={this.props.getList}
        />}
      </div>
    );
  }
}
