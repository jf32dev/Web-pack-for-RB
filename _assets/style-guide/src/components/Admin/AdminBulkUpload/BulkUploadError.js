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
import _get from 'lodash/get';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import FileItem from 'components/FileItem/FileItem';
import Btn from 'components/Btn/Btn';

const sampleData = require('../../../static/admin/bulkUploadError.json');

const messages = defineMessages({
  oneExistingUsersSkipped: { id: 'one-existing-users-skipped', defaultMessage: '1 existing user will be skipped.' },
  multiExistingUsersSkipped: { id: 'multi-existing-users-skipped', defaultMessage: '{existing_users_skipped} existing users will be skipped.' },

  oneExistingUsersUpdated: { id: 'one-existing-users-updated', defaultMessage: '1 existing user will be updated.' },
  multiExistingUsersUpdated: { id: 'multi-existing-users-updated', defaultMessage: '{existing_users_updated} existing users will be updated.' },

  metadataImported: { id: 'metadata-imported', defaultMessage: '{metadata_imported} Metadata will be imported.' },
  metadataSkipped: { id: 'metadata-skipped', defaultMessage: '{metadata_skipped} Metadata will be skipped.' },

  oneUserImportedMsg: { id: 'one-user-import-msg', defaultMessage: '{users_imported} user will be imported.' },
  multiUserImportedMsg: { id: 'multi-user-import-msg', defaultMessage: '{users_imported} users will be imported.' },

  oneSkippedUserMsg: { id: 'one-skipped-user-msg', defaultMessage: '1 User will be skipped.' },
  multiSkippedUserMsg: { id: 'multi-skipped-user-msg', defaultMessage: '{users_skipped} Users will be skipped.' },

  oneSkippedDelete: { id: 'one-skipped-delete', defaultMessage: '{users_to_be_skipped} User will be skipped.' },
  multiSkippedDelete: { id: 'multi-skipped-delete', defaultMessage: '{users_to_be_skipped} Users will be skipped.' },

  oneDelete: { id: 'one-delete', defaultMessage: '{users_to_be_deleted} User will be deleted.' },
  multiDelete: { id: 'multi-delete', defaultMessage: '{users_to_be_deleted} Users will be deleted.' },

  loadMoreUsers: { id: 'load-more-users', defaultMessage: 'Load more users' },

  deleteUserWarning: { id: 'delete-user-warning', defaultMessage: 'Deleting user cannot be undone..' },
});

export default class BulkUploadError extends PureComponent {
  static propTypes = {
    summary: PropTypes.object,
    errors: PropTypes.array,
    file: PropTypes.object,
    isDelete: PropTypes.bool
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    errors: [],
    summary: sampleData.summary,
    isDelete: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoadMore: false,
    };
    autobind(this);
  }

  handleLoadMoreUsers() {
    this.setState({
      isLoadMore: true
    });
  }

  render() {
    const {
      summary,
      errors,
      file,
      isDelete,
    } = this.props;
    const {
      isLoadMore,
    } = this.state;
    const styles = require('./BulkUploadError.less');

    const { formatMessage } = this.context.intl;
    const naming = summary;
    const strings = generateStrings(messages, formatMessage, {
      users_imported: -1,
      existing_users_skipped: -1,
      existing_users_updated: -1,
      users_to_be_skipped: -1,
      users_to_be_deleted: -1,
      metadata_imported: -1,
      metadata_skipped: -1,
      users_skipped: -1,
      ...summary,
    });
    const list = errors.filter((item, i) => {
      if (!isLoadMore && i < 5) {
        return true;
      }

      if (isLoadMore) {
        return true;
      }

      return false;
    });
    return (
      <div className={styles.contentWrap}>
        <div className={styles.fileContainer}>
          <FileItem
            thumbSize="medium"
            grid
            className={styles.fileItem}
            id={0}
            description={_get(file, 'name', '')}
            dateAdded={1531872639}
            category="csv"
          />
          <div className={styles.msg}>
            {naming.users_imported <= 1 && naming.users_imported > -1 &&  <div>{strings.oneUserImportedMsg}</div>}
            {naming.users_imported > 1 && <div>{strings.multiUserImportedMsg}</div>}

            {naming.existing_users_skipped === 1 && <div>{strings.oneExistingUsersSkipped}</div>}
            {naming.existing_users_skipped > 1 && <div>{strings.multiExistingUsersSkipped}</div>}

            {naming.existing_users_updated === 1 && <div>{strings.oneExistingUsersUpdated}</div>}
            {naming.existing_users_updated > 1 && <div>{strings.multiExistingUsersUpdated}</div>}

            {naming.users_to_be_skipped === 1 && <div>{strings.oneSkippedDelete}</div>}
            {naming.users_to_be_skipped > 1 && <div>{strings.multiSkippedDelete}</div>}

            {naming.users_to_be_deleted <= 1 && naming.users_to_be_deleted > -1 && <div>{strings.oneDelete}</div>}
            {naming.users_to_be_deleted > 1 && <div>{strings.multiDelete}</div>}

            {naming.metadata_imported > 0 && <div>{strings.metadataImported}</div>}
            {naming.metadata_skipped > 0 && <div>{strings.multiUserImportMsg}</div>}
          </div>
        </div>
        <div className={styles.formWrapper}>
          {!isDelete && <h4>
            {naming.users_skipped === 1 && strings.oneSkippedUserMsg}
            {naming.users_skipped > 1 && strings.multiSkippedUserMsg}
          </h4>}
          {isDelete && <h4>{strings.deleteUserWarning}</h4>}
          {list.map((item, i) => (
            <div key={i} className={styles.errorItem}>{i + 1}<span>.</span>{item}</div>
          ))}
          {!isLoadMore && errors.length > 5 && <Btn
            icon="plus"
            inverted
            borderless
            className={styles.loadMoreUsers}
            onClick={this.handleLoadMoreUsers}
          >
            {strings.loadMoreUsers}
          </Btn>}
        </div>
      </div>
    );
  }
}
