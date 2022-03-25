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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Icon from 'components/Icon/Icon';

const messages = defineMessages({
  comingSoon: { id: 'coming-soon', defaultMessage: 'Coming Soon!' },
  myFiles: { id: 'my-files', defaultMessage: 'My Files' },
  myFilesDescription: { id: 'my-files-description', defaultMessage: 'Connect with many different cloud services to import external content' }
});

export default class MyFiles extends Component {
  static propTypes = {
    onAnchorClick: PropTypes.func,
    onFileClick: PropTypes.func,
    onStoryClick: PropTypes.func
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  render() {
    //const { settings } = this.context;
    const { formatMessage } = this.context.intl;
    //const { item } = this.props;
    const styles = require('./MyFiles.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={styles.MyFiles}>
        <div className={styles.header}>
          <Breadcrumbs
            paths={[{ name: strings.myFiles, path: '/content/personal/files' }]}
          />
        </div>

        <div className={styles.placeholder}>
          <div>
            <div className={styles.iconWrap}>
              <Icon name="dropbox" size={32} />
              <Icon name="box" size={32} />
              <Icon name="gdrive" size={32} />
              <Icon name="onedrive" size={32} />
              <Icon name="egnyte" size={32} />

              <Icon name="cmis" size={32} />
              <Icon name="salesforce" size={32} />
              <Icon name="smb" size={32} />
              <Icon name="evernote" size={32} />
              <Icon name="alfresco" size={32} />

              <Icon name="sharepoint" size={32} />
              <Icon name="sharefile" size={32} />
              <Icon name="documentum" size={32} />
              <Icon name="savo" size={32} />
              <Icon name="hubspot" size={32} />
            </div>

            <h3>{strings.myFiles}</h3>
            <p>{strings.myFilesDescription}</p>
            <p><strong>{strings.comingSoon}</strong></p>
          </div>
        </div>
      </div>
    );
  }
}
