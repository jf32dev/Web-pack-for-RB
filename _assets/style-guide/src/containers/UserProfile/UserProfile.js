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

import differenceBy from 'lodash/differenceBy';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';

import UserActivity from 'components/UserActivity/UserActivity';
import UserDetails from 'components/UserDetails/UserDetails';
import UserMetadata from 'components/UserMetadata/UserMetadata';

const UserActivityDocs = require('!!react-docgen-loader!components/UserActivity/UserActivity.js');
const UserDetailsDocs = require('!!react-docgen-loader!components/UserDetails/UserDetails.js');
const UserMetadataDocs = require('!!react-docgen-loader!components/UserMetadata/UserMetadata.js');

const users = require('../../static/users.json');
const stories = require('../../static/stories.json');
const files = require('../../static/files.json');
const userMetadataData = require('../../static/userMetadata.json');

export default class UserProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: userMetadataData.attributes,
      valuesSelected: userMetadataData.valuesSelected,
      valuesList: userMetadataData.valuesList,
      searchFilter: '',
      lastClick: null,
      publicProfile: false,
      emptyLists: false
    };
    autobind(this);
  }

  handleTogglePublicClick() {
    this.setState({ publicProfile: !this.state.publicProfile });
  }

  handleToggleListsClick() {
    this.setState({ emptyLists: !this.state.emptyLists });
  }

  handleClick(event, story) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor StoryItem
    // Quicklink Detail Btn
    if (!href) {
      this.setState({ lastClick: story.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  handleCallClick(event, context) {
    this.setState({ lastClick: 'call: ' + context.props.user.id });
  }

  handleFollowClick(event, context) {
    this.setState({ lastClick: 'follow: ' + context.props.user.id });
  }

  handleOnDelete(event, context) {
    const newValueList = this.state.valuesList;
    const newItem = newValueList.find(obj => obj.id === context.valueSelected.id);
    if (newItem) {
      newItem.checked = false;
    }

    this.setState({
      valuesSelected: this.state.valuesSelected.filter(value => value.id !== context.valueSelected.id),
      valuesList: newValueList
    });
  }

  handleOnChange(newVal, context) {
    console.log(newVal);
    console.log(context);
  }

  handleOnAddMetadata(items) {
    const newValuesList = this.state.valuesList.map(function(item) {
      const newItem = item;
      if (items.find(obj => obj.id === newItem.id)) {
        newItem.checked = true;
      }
      return newItem;
    });

    this.setState({
      valuesSelected: [...this.state.valuesSelected, ...items],
      valuesList: newValuesList
    });
  }

  handleOnChangeValue(changedItem, toggle) {
    const newValuesList = this.state.valuesList;
    const newItem = newValuesList.find(obj => obj.id === changedItem.id);
    newItem.checked = toggle;

    this.setState({
      valuesList: newValuesList
    });
  }

  handleOnResetValues(event, item) {
    console.log(event);
    console.log(item);
  }

  handleOnChangeSearch(newFilter) {
    this.setState({ 'searchFilter': newFilter });
  }

  render() {
    const { emptyLists, publicProfile, lastClick } = this.state;

    const user = {
      id: 200,
      name: 'Rubenson Barrios',
      role: 'HTML5 Developer',
      email: 'rubenson@bigtincan.com',
      lang_code: 'en',
      mobileNumber: '0245065404',
      landlineNumber: '123412',
      thumbnail: 'https://push.bigtincan.org/f/Dm9jEkGXJpW6KRWbN5O0/avatar/f8f81f2d481420510651d0ced2fd296a933e87063364ce007cb9ff3b99cfe5b7.png',
      //isFollowed: true
    };
    const social = {
      'appleId': 'appleId',
      'facebookUrl': 'https://fb.me/bigtincan',
      'skypeId': 'skypeId',
      'twitterUrl': 'https://www.twitter.com/bigtincan',
      'linkedin': 'https://www.linkedin.com/bigtincan',
      'custom1': '#Custom url',
      'custom2': '#local'
    };
    const companyData = {
      'companyName': 'Bigtincan',
      'officeName': 'Clarence st',
      'department': 'Development',
      'costCode': '2077',
      'manager': 'Anthony',
      'webPage': 'bigtincan.com',
      'unitNo': '255',
      'streetName': 'Clarence st',
      'streetType': 'street',
      'town': 'Sydney',
      'state': 'NSW',
      'postCode': '2077',
      'poBox': '2000',
      'country': 'Australia',
      'custom1': 'Blah ',
      'custom2': 'Custom233',
      'custom3': ''
    };
    const badge = {
      'colour': '#ffc000',
      'title': 'Beginner'
    };

    let customValueList = differenceBy(this.state.valuesList, this.state.valuesSelected, 'id');
    if (this.state.searchFilter) {
      customValueList = customValueList.filter(obj => obj.attributeValue.indexOf(this.state.searchFilter) > -1);
    }

    return (
      <section id="UserProfileView">
        <h1>User Profile</h1>
        <p>Components displayed on a User's Profile.</p>

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>UserDetails</h2>
        <Docs {...UserDetailsDocs} />
        <Btn small onClick={this.handleTogglePublicClick}>Toggle Public</Btn>
        <ComponentItem>
          <UserDetails
            type={publicProfile ? 'public' : 'personal'}
            user={user}
            social={social}
            badge={badge}
            companyData={companyData}
            showCall
            showChat
            showFollow
            onAnchorClick={this.handleClick}
            onCallClick={this.handleCallClick}
            onFollowClick={this.handleFollowClick}
          />
        </ComponentItem>

        <h2>UserActivity</h2>
        <Docs {...UserActivityDocs} />
        <Btn small onClick={this.handleToggleListsClick}>Toggle Lists</Btn>
        <ComponentItem>
          <UserActivity
            recentlyFollowed={!emptyLists ? users.slice(0, 8) : []}
            recentlyShared={!emptyLists ? stories.slice(0, 8) : []}
            mostUsedStories={!emptyLists ? stories.slice(2, 10) : []}
            mostUsedFiles={!emptyLists ? files.slice(0, 5) : []}
            onAnchorClick={this.handleClick}
            onFileClick={this.handleClick}
          />
        </ComponentItem>

        <h2>UserEdit</h2>
        <Docs {...UserMetadataDocs} />
        <ComponentItem>
          <UserMetadata
            attributeList={this.state.attributes}
            valuesSelectedList={this.state.valuesSelected}
            valuesList={customValueList}
            onDelete={this.handleOnDelete}
            onChange={this.handleOnChange}
            userMetadataLoaded
            onAdd={this.handleOnAddMetadata}
            //onResetNewItemList={this.handleOnResetValues}
            onChangeNewItem={this.handleOnChangeValue}
            onChangeSearch={this.handleOnChangeSearch}
          />
        </ComponentItem>
      </section>
    );
  }
}
