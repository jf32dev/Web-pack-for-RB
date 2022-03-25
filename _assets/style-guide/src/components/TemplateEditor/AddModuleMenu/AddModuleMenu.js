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
import classNames from 'classnames/bind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import DropMenu from 'components/DropMenu/DropMenu';

const messages = defineMessages({
  addModule: { id: 'add-module', defaultMessage: 'Add Module' },
  selectAModule: { id: 'select-a-module', defaultMessage: 'Select a Module' },
  addOn: { id: 'add-on', defaultMessage: 'Add-On' },
  files: { id: 'files', defaultMessage: 'Files' },
  stories: { id: 'stories', defaultMessage: '{stories}' },
  people: { id: 'people', defaultMessage: 'People' },
  featuredStories: { id: 'featured-stories', defaultMessage: 'Featured {stories}' },
  bookmarks: { id: 'bookmarks', defaultMessage: 'Bookmarks' },
});

/**
 * Displayed in <code>TemplateEditor</code>.
 */
export default class AddModuleMenu extends PureComponent {
  static propTypes = {
    btca: PropTypes.bool,
    files: PropTypes.bool,
    stories: PropTypes.bool,
    users: PropTypes.bool,
    featuredStories: PropTypes.bool,

    onItemClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      btca,
      files,
      stories,
      users,
      featuredStories,
      onItemClick
    } = this.props;
    const styles = require('./AddModuleMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AddModuleMenu: true
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <DropMenu
        data-id="add-module-menu"
        icon="plus"
        heading={<span className={styles.heading}>{strings.addModule}</span>}
        button
        position={{
          right: '-75%'
        }}
        className={classes}
        activeHeadingColour="#fff"
      >
        <h4>{strings.selectAModule}</h4>
        <ul>
          {featuredStories && <li data-type="featured-list" onClick={onItemClick}>{strings.featuredStories}</li>}
          {stories && <li data-type="story-list" onClick={onItemClick}>{strings.stories}</li>}
          {users && <li data-type="user-list" onClick={onItemClick}>{strings.people}</li>}
          {files && <li data-type="file-list" onClick={onItemClick}>{strings.files}</li>}
          {btca && <li data-type="btca" onClick={onItemClick}>{strings.addOn}</li>}
          {<li data-type="bookmark-list" onClick={onItemClick}>{strings.bookmarks}</li>}
        </ul>
      </DropMenu>
    );
  }
}
