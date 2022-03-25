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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import DropMenu from 'components/DropMenu/DropMenu';

const messages = defineMessages({
  addFile: { id: 'add-file', defaultMessage: 'Add File' },
  desktop: { id: 'desktop', defaultMessage: 'Desktop' },
  hubFiles: { id: 'hub-files', defaultMessage: 'Hub Files' },
  forms: { id: 'forms', defaultMessage: 'Forms' },
  webLink: { id: 'web-link', defaultMessage: 'Web Link' },
  cloudFiles: { id: 'cloud-files', defaultMessage: 'Cloud Files' },
  recordAudio: { id: 'record-audio', defaultMessage: 'Record Audio' },
});

/**
 * Displayed in <code>StoryEditFiles</code> & <code>StoryEditQuicklink</code>.
 */
export default class AddFileMenu extends PureComponent {
  static propTypes = {
    desktop: PropTypes.bool,
    file: PropTypes.bool,
    form: PropTypes.bool,
    web: PropTypes.bool,
    cloud: PropTypes.bool,
    audio: PropTypes.bool,
    onItemClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  render() {
    const { formatMessage } = this.context.intl;
    const {
      desktop,
      file,
      form,
      web,
      cloud,
      audio,
      onItemClick,
      heading,
      position,
      inverted
    } = this.props;
    const styles = require('./AddFileMenu.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <DropMenu
        data-id="add-file-menu"
        heading={heading || strings.addFile}
        button
        isDropDownTether
        className={styles.addMenu}
        position={position}
        width="13rem"
        inverted={inverted}
      >
        <ul>
          {desktop && <li data-type="desktop" className={styles.desktop} onClick={onItemClick}>{strings.desktop}</li>}
          {file && <li data-type="file" className={styles.files} onClick={onItemClick}>{strings.hubFiles}</li>}
          {form && <li data-type="form" className={styles.forms} onClick={onItemClick}>{strings.forms}</li>}
          {web && <li data-type="web" className={styles.web} onClick={onItemClick}>{strings.webLink}</li>}
          {cloud && <li data-type="cloud" className={styles.cloud} onClick={onItemClick}>{strings.cloudFiles}</li>}
          {audio && <li data-type="audio" className={styles.audio} onClick={onItemClick}>{strings.recordAudio}</li>}
        </ul>
      </DropMenu>
    );
  }
}
