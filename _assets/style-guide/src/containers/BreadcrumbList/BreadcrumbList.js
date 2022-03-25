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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';

import BreadcrumbList from 'components/BreadcrumbList/BreadcrumbList';

const BreadcrumbListDocs = require('!!react-docgen-loader!components/BreadcrumbList/BreadcrumbList.js');

const tabs = require('../../static/tabs.json');
const channels = require('../../static/channels.json');
const stories = require('../../static/stories.json');

export default class BreadcrumbListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeList: 0,
      disableAnimation: false
    };
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  handlePathClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href === '/content') {
      this.setState({
        activeList: 0
      });
    }
  }

  handleItemClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href.indexOf('/tab') === 0) {
      this.setState({
        activeList: 1
      });
    }
  }

  handleGetTabList(offset) {
    console.log('handleGetTabList');
    console.log(offset);
  }

  handleGetChannelList(offset) {
    console.log('handleGetChannelList');
    console.log(offset);
  }

  handleGetStoryList(offset) {
    console.log('handleGetStoryList');
    console.log(offset);
  }

  handleToggleActiveList() {
    this.setState({
      activeList: this.state.activeList === 0 ? 1 : 0
    });
  }

  handleTogglDisableAnimation() {
    this.setState({
      disableAnimation: !this.state.disableAnimation
    });
  }

  handleOptionChange(event) {
    event.preventDefault();
    const option = event.target.dataset.option;
    console.log(option);
  }

  handleSortOrderChange(val) {
    console.log(val.value);
  }

  render() {
    const { activeList, disableAnimation } = this.state;

    const tabList = {
      list: tabs.slice(0, 10),
      isLoaded: true,
      isLoading: false,
      isLoadingMore: false,
      isComplete: false,
      listProps: {
        grid: false,
        thumbSize: 'small',
        onItemClick: this.handleItemClick
      },
      onGetList: this.handleGetTabList,
      getList: this.handleGetTabList
    };

    const channelList = {
      list: channels.slice(0, 10),
      isLoaded: true,
      isLoading: false,
      isLoadingMore: false,
      isComplete: false,
      listProps: {
        grid: false,
        thumbSize: 'small',
        onItemClick: this.handleItemClick
      },
      onGetList: this.handleGetChannelList,
    };

    const storyList = {
      list: stories.slice(0, 10),
      isLoaded: true,
      isLoading: false,
      isLoadingMore: false,
      isComplete: false,
      listProps: {
        grid: false,
        thumbSize: 'small',
        onItemClick: this.handleItemClick
      },
      onGetList: this.handleGetChannelList,
    };

    const breadcrumbList1 = {
      paths: [{
        name: 'Content',
        path: '/content'
      }, {
        name: 'Selected Tab Name is very very long',
        path: '/content/tab/1'
      }],
      lists: [tabList, channelList]
    };

    const breadcrumbList2 = {
      paths: [{
        name: 'Cool Story',
        path: '/content/tab/1/channel/2/story/3'
      }],
      lists: [storyList]
    };

    return (
      <section id="BreadcrumbListView">
        <h1>BreadcrumbList</h1>
        <Docs {...BreadcrumbListDocs} />

        <Btn onClick={this.handleToggleActiveList}>Toggle activeList ({activeList})</Btn>
        <Btn inverted={disableAnimation} onClick={this.handleTogglDisableAnimation}>Toggle disableAnimation</Btn>

        <ComponentItem style={{ height: '400px' }}>
          <BreadcrumbList
            {...breadcrumbList1}
            activeList={this.state.activeList}
            disableAnimation={disableAnimation}
            menuComponent={(<div style={{ padding: '0.5rem' }}>
              <span>Pass in custom <code>menuComponent</code> prop</span>
            </div>)}
            width={320}
            onPathClick={this.handlePathClick}
            onGetList={()=>{}}
            getList={this.handleGetList1}
          />
        </ComponentItem>
        <ComponentItem style={{ height: '400px' }}>
          <BreadcrumbList
            {...breadcrumbList2}
            disableAnimation
            onGetList={()=>{}}
            onPathClick={this.handlePathClick}
            getList={this.handleGetList2}
          />
        </ComponentItem>
      </section>
    );
  }
}
