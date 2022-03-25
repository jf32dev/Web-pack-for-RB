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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';

import { connect } from 'react-redux';
import {
  openTemplate,
  updateTemplate,
  clearTemplate,
  editName,
  addModule,
  editModule,
  deleteModule,
  toggleModuleEdit
} from 'redux/modules/templateEditor';
import {
  mapStories,
  mapFiles,
  mapUsers,
  mapBookmarks,
} from 'redux/modules/entities/helpers';
import {
  loadCompanyStories,
  loadCompanyUsers,
} from 'redux/modules/company';
import {
  loadRecentFiles,
  loadRecommendedFiles,
  loadRecommendedUsers,
  loadRecentStories,
  loadLikedStories,
  loadBookmarks,
} from 'redux/modules/me';

import TemplateEditor from 'components/TemplateEditor/TemplateEditor';

function mapStateToProps(state) {
  const { admin, entities, company, me, settings } = state;
  const { name, items, itemsById } = admin.templateEditor;
  const mappedItems = items.length ? items.map(id => itemsById[id]) : [];
  const filteredItems = mappedItems.filter(item => !item.deleted);

  return {
    name,
    items: filteredItems,

    // Available BTCAs
    addOns: admin.homeScreens.addOns || [],

    authString: settings.authString,

    // Featured Stories
    featuredStories: mapStories(company.featuredStories, entities),

    // Files
    recentlyViewedFiles: mapFiles(me.recentFiles, entities),
    recommendedFiles: mapFiles(me.recommendedFiles, entities),

    // Stories
    recommendedStories: mapStories(company.myRecommendedStories, entities),
    topStories: mapStories(company.topStories, entities),
    latestStories: mapStories(company.latestStories, entities),
    mostViewedStories: mapStories(company.myMostViewedStories, entities),
    recentlyViewedStories: mapStories(me.recentStories, entities),
    likedStories: mapStories(me.likedStories, entities),
    popularStories: mapStories(company.popularStories, entities),

    // Users
    leaderboardUsers: mapUsers(company.leaderboard, entities),
    topUsers: mapUsers(company.myTopUsers, entities),
    recommendedUsers: mapUsers(me.recommendedUsers, entities),

    // Returning new Bookmark type to use new design
    bookmarks: mapBookmarks(me.bookmarks, entities),

    // Stories loaded
    latestStoriesLoaded: company.latestStoriesLoaded,
    myRecommendedStoriesLoaded: company.myRecommendedStoriesLoaded,
    myMostViewedStoriesLoaded: company.myMostViewedStoriesLoaded,
    likedStoriesLoaded: me.likedStoriesLoaded,
    topStoriesLoaded: company.topStoriesLoaded,
    recentStoriesLoaded: me.recentStoriesLoaded,
    popularStoriesLoaded: company.popularStoriesLoaded,

    // User loaded
    leaderboardLoaded: company.leaderboardLoaded,
    myTopUsersLoaded: company.myTopUsersLoaded,
    recommendedUsersLoaded: me.recommendedUsersLoaded,

    // Bookmarks loaded
    bookmarksLoaded: me.bookmarksLoaded,

    // Settings
    showHiddenChannels: settings.contentSettings.showHiddenChannels,
    featuredStoriesLoaded: company.featuredStoriesLoaded,
    recommendedFilesLoaded: me.recommendedFilesLoaded,
    recentFilesLoaded: me.recentFilesLoaded,
  };
}

@connect(mapStateToProps,
  {
    openTemplate,
    updateTemplate,
    clearTemplate,
    editName,
    addModule,
    editModule,
    deleteModule,
    toggleModuleEdit,
    loadCompanyStories,
    loadRecentFiles,
    loadRecommendedFiles,
    loadRecentStories,
    loadLikedStories,
    loadRecommendedUsers,
    loadCompanyUsers,
    loadBookmarks,
  }
)
export default class TemplateEditorView extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      showHiddenChannels,
      featuredStoriesLoaded,
      recommendedFilesLoaded,
      recentFilesLoaded,
      latestStoriesLoaded,
      myRecommendedStoriesLoaded,
      myMostViewedStoriesLoaded,
      likedStoriesLoaded,
      topStoriesLoaded,
      popularStoriesLoaded,
      recentStoriesLoaded,
      leaderboardLoaded,
      recommendedUsersLoaded,
      myTopUsersLoaded,
      bookmarksLoaded
    } = this.props;

    // Featured Stories
    if (!featuredStoriesLoaded) {
      this.props.loadCompanyStories('featuredStories', showHiddenChannels);
    }

    // Files
    if (!recommendedFilesLoaded) {
      this.props.loadRecentFiles();
    }
    if (!recentFilesLoaded) {
      this.props.loadRecommendedFiles();
    }

    // Stories
    if (!latestStoriesLoaded) {
      this.props.loadCompanyStories('latestStories');
    }
    if (!likedStoriesLoaded) {
      this.props.loadLikedStories();
    }
    if (!myMostViewedStoriesLoaded) {
      this.props.loadCompanyStories('myMostViewedStories');
    }
    if (!myRecommendedStoriesLoaded) {
      this.props.loadCompanyStories('myRecommendedStories');
    }
    if (!recentStoriesLoaded) {
      this.props.loadRecentStories();
    }
    if (!topStoriesLoaded) {
      this.props.loadCompanyStories('topStories');
    }
    if (!popularStoriesLoaded) {
      this.props.loadCompanyStories('popularStories');
    }

    // Users
    if (!leaderboardLoaded) {
      this.props.loadCompanyUsers('leaderboard');
    }
    if (!recommendedUsersLoaded) {
      this.props.loadRecommendedUsers();
    }
    if (!myTopUsersLoaded) {
      this.props.loadCompanyUsers('myTopUsers');
    }

    // Bookmarks
    if (!bookmarksLoaded) {
      this.props.loadBookmarks();
    }
  }

  handleSaveClick(data) {
    this.props.onToggle({
      name: this.props.name,
      items: JSON.stringify(data.items, null, '  ')
    });
  }

  handleNameChange(event) {
    this.props.editName(event.currentTarget.value);
  }

  handleAddItemClick(type, id) {
    event.preventDefault();
    this.props.addModule(type, id);
  }

  handleDeleteItemClick(i) {
    this.props.deleteModule(i);
  }

  handleEditItemClick(i) {
    this.props.toggleModuleEdit(i);
  }

  handleGetItemData(i) {
    const {
      items,
      featuredStories,
      bookmarks,
    } = this.props;
    const index = items.findIndex(e => e.i === i);
    const item = items[index];
    const data = {
      loaded: true
    };

    if (index > -1) {
      switch (item.type) {
        case 'featured-list':
          data.list = featuredStories;
          break;
        case 'file-list':
          data.list = item.source ? this.props[item.source + 'Files'] : [];
          break;
        case 'story-list':
          data.list = item.source ? this.props[item.source + 'Stories'] : [];
          break;
        case 'user-list':
          data.list = item.source ? this.props[item.source + 'Users'] : [];
          break;
        case 'bookmark-list':
          data.list = bookmarks;
          break;
        default:
          console.info('Unhandled type: ' + items[index].type);  // eslint-disable-line
          break;
      }
      this.props.editModule(i, data);
    }
  }

  handleItemOptionChange(i, option, value) {
    this.props.editModule(i, {
      [option]: value
    });
  }

  handleItemEditCloseClick(i) {
    this.props.toggleModuleEdit(i);
  }

  handleCloseClick() {
    this.props.onToggle();
  }

  handleClearClick() {
    this.props.clearTemplate();
  }

  handleLayoutChange(newItems) {
    this.props.updateTemplate({ items: newItems });
  }

  render() {
    const { name, items, addOns, authString, isVisible } = this.props;
    const styles = require('./TemplateEditor.less');

    if (!isVisible) {
      return null;
    }

    return (
      <TemplateEditor
        name={name}
        items={items}
        addOns={addOns}
        authString={authString}
        onNameChange={this.handleNameChange}
        onAddItemClick={this.handleAddItemClick}
        onDeleteItemClick={this.handleDeleteItemClick}
        onEditItemClick={this.handleEditItemClick}
        onGetAddOnList={this.handleGetAddOnList}
        onGetItemData={this.handleGetItemData}
        onItemOptionChange={this.handleItemOptionChange}
        onItemEditCloseClick={this.handleItemEditCloseClick}
        onLayoutChange={this.handleLayoutChange}
        onCloseClick={this.handleCloseClick}
        onClearClick={this.handleClearClick}
        onSaveClick={this.handleSaveClick}
        className={styles.TemplateEditor}
      />
    );
  }
}
