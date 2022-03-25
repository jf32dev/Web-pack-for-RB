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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import Debug from '../../views/Debug';

import ShareForward from 'components/PublicShare/ShareForward';
import StoryDetail from 'components/PublicShare/StoryDetail';
import FileListSearch from 'components/PublicShare/FileListSearch';
import ShareMessage from 'components/PublicShare/ShareMessage';

const stories = require('../../static/stories.json');
const fileList = require('../../static/files.json');
const users = require('../../static/users.json');

// const BlankDocs = require('!!react-docgen-loader!components/Blank/Blank.js');
const ShareForwardDocs = require('!!react-docgen-loader!components/PublicShare/ShareForward.js');
const ShareMessageDocs = require('!!react-docgen-loader!components/PublicShare/ShareMessage.js');
const StoryDetailDocs = require('!!react-docgen-loader!components/PublicShare/StoryDetail.js');
const FileListSearchDocs = require('!!react-docgen-loader!components/PublicShare/FileListSearch.js');

export default class PublicShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: null,
    };
    autobind(this);
  }

  handleClick(e) {
    console.log(e);
  }

  render() {
    const { lastClick } = this.state;

    return (
      <section id="BlankView">
        <h1>Public Share</h1>
        <Debug>
          <div>
            <code>onLogin: {lastClick}</code>
          </div>
        </Debug>
        <Docs {...ShareForwardDocs} />
        <ComponentItem style={{ width: '400px', maxHeight: '218px' }}>
          <ShareForward
            date="Shared Monday, 25 January 2017, 2:37 PM"
            title="The Study Claiming That Blotting Your Pizza"
            user={users[3]}
          />
        </ComponentItem>
        <Docs {...ShareMessageDocs} />
        <ComponentItem style={{ width: '400px', maxHeight: '218px' }}>
          <ShareMessage
            description={'Hi Jessica,<br />It was great to meet you today. Here’s the product sheets for you to consider when you are ready to move forward.<br />Have a great day!'}
            onForwardClick={() => {}}
          />
        </ComponentItem>
        <Docs {...StoryDetailDocs} />
        <ComponentItem style={{ width: '400px' }}>
          <StoryDetail story={stories[1]} onClick={this.handleClick} />
        </ComponentItem>
        <Docs {...FileListSearchDocs} />
        <ComponentItem style={{ width: '400px' }}>
          <div style={{ maxHeight: '400px', flex: 1, flexFlow: 'column', overflow: 'hidden', display: 'flex' }}>
            <FileListSearch list={fileList} />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
