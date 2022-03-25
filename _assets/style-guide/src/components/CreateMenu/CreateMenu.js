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
import DropMenu from 'components/DropMenu/DropMenu';

/**
 * Displayed in <code>AppHeader</code>
 */
export default class CreateMenu extends PureComponent {
  static propTypes = {
    draft: PropTypes.bool,
    form: PropTypes.bool,
    note: PropTypes.bool,
    pitch: PropTypes.bool,
    quicklink: PropTypes.bool,
    share: PropTypes.bool,
    story: PropTypes.bool,
    web: PropTypes.bool,

    position: PropTypes.object,

    strings: PropTypes.object,

    onAnchorClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    position: { left: 0, right: 0 },
    strings: {
      create: 'Create',
      draft: 'Drafts',
      form: 'Form',
      note: 'Note',
      pitch: 'Pitch',
      quicklink: 'Quicklink',
      share: 'Share',
      story: 'Story',
      website: 'Website',
    }
  };

  render() {
    const {
      draft,
      form,
      note,
      pitch,
      quicklink,
      share,
      story,
      web,
      strings,
      onAnchorClick
    } = this.props;
    const styles = require('./CreateMenu.less');

    return (
      <DropMenu
        id="create-menu" icon="create-header" position={this.props.position}
        width={300}
      >
        <div className={styles.CreateMenu}>
          <h3>{strings.create}</h3>
          {(story || note || quicklink) && <ul>
            {story && <li>
              <a
                href="/story/new" data-id="story" className={styles.story}
                onClick={onAnchorClick}
              >{strings.story}</a>
            </li>}
            {note && <li>
              <a
                href="/note/new" data-id="note" className={styles.note}
                onClick={onAnchorClick}
              >{strings.note}</a>
            </li>}
            {pitch && <li>
              <a
                href="/canvas" data-id="pitch" className={styles.pitch}
                onClick={onAnchorClick}
              >{strings.pitch}</a>
            </li>}
            {quicklink && <li>
              <a
                href="/quicklink" data-id="quicklink" className={styles.quicklink}
                onClick={onAnchorClick}
              >{strings.quicklink}</a>
            </li>}
          </ul>}
          {share && <ul>
            {share && <li>
              <a
                href="/share/new" data-id="share" className={styles.share}
                onClick={onAnchorClick}
              >{strings.share}</a>
            </li>}
          </ul>}
          {(form || web) && <ul>
            {form && <li>
              <a
                href="/form/new" data-id="form" className={styles.form}
                onClick={onAnchorClick}
              >{strings.form}</a>
            </li>}
            {web && <li>
              <a
                href="/web/new" data-id="web" className={styles.web}
                onClick={onAnchorClick}
              >{strings.website}</a>
            </li>}
          </ul>}
          {draft && <ul>
            {draft && <li>
              <a
                href="/drafts" data-id="draft" className={styles.draft}
                onClick={onAnchorClick}
              >{strings.draft}</a>
            </li>}
          </ul>}
        </div>
      </DropMenu>
    );
  }
}
