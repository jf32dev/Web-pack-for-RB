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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import files from 'static/fileTypes';

import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import CrmOpportunity from 'components/CrmOpportunity/CrmOpportunity';
import FileItemNew from 'components/FileItemNew/FileItemNew';
import ListItem from 'components/ListItem/ListItem';
import UserItemNew from 'components/UserItemNew/UserItemNew';

const stories = require('../../static/stories.json');
const users = require('../../static/users.json');

const CrmOpportunityDocs = require('!!react-docgen-loader!components/CrmOpportunity/CrmOpportunity.js');
const FileItemNewDocs = require('!!react-docgen-loader!components/FileItemNew/FileItemNew.js');
const ListItemDocs = require('!!react-docgen-loader!components/ListItem/ListItem.js');
const StoryItemNewDocs = require('!!react-docgen-loader!components/StoryItemNew/StoryItemNew.js');

export default class HubShareConsoleView extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick() {
    console.log('click!');
  }

  render() {
    const styles = require('./HubShareConsole.less');
    const userComponent = (<UserItemNew
      presence={70}
      grid={false}
      thumbSize="tiny"
      userIcon="icon-cloud-sf-fill"
      {...users[3]}
    />);

    const columns = {
      time: {
        noOfRow: 1,
        rowValue: 5,
        suffix: 's',
        firstCol: true
      },
      views: {
        noOfRow: 2,
        firstRowValue: 5,
        secondRowValue: 6,
        labelSingular: 'File',
        labelPlural: 'Files'
      },
      downloads: {
        noOfRow: 2,
        firstRowValue: 5,
        secondRowValue: 6,
        labelSingular: 'File',
        labelPlural: 'Files'
      },
    };

    return (
      <section id="HubShareConsoleView">
        <h1>CrmOpportunity</h1>
        <Docs {...CrmOpportunityDocs} />

        <ComponentItem style={{ width: '468px' }}>
          <CrmOpportunity
            opportunity="Sephora Zunos Y3- Committed under 2020 plan - September 2022"
            stage="Qualification"
            variant="long"
            crmIcon="cloud-sf-fill"
          />
        </ComponentItem>

        <h1>Shared Files</h1>
        <Docs {...FileItemNewDocs} />
        <ComponentItem>
          {files.map((f, index) => (
            <div key={index} className={styles.fileItemWrapper}>
              <FileItemNew
                id={f.id}
                grid={false}
                hover={false}
                thumbSize="small"
                onClick={this.handleClick}
                {...f}
                {...this.props}
              />
            </div>
          ))}
        </ComponentItem>

        <h1>ListItem</h1>
        <Docs {...ListItemDocs} />

        <ComponentItem>
          <ListItem
            component={userComponent}
            {...{ columns }}
          />
        </ComponentItem>

        <h1>StoryItemNew</h1>
        <Docs {...StoryItemNewDocs} />
        <ComponentItem>
          {stories.map((story, index) => (
            <div key={index} style={{ margin: '0.5rem 0' }}>
              <StoryItemNew
                thumbSize="small"
                grid={false}
                isShare
                noLink
                onClick={this.handleClick}
                {...story}
              />
            </div>
          ))}
        </ComponentItem>
      </section>
    );
  }
}
