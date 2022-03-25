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

import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import reducer, {
  openTemplate,
  updateTemplate,
  clearTemplate,
  editName,
  addModule,
  editModule,
  deleteModule,
  toggleModuleEdit
} from '../../redux/modules/templateEditor';

import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';

import TemplateEditor from 'components/TemplateEditor/TemplateEditor';
import HomeTemplate from 'components/HomeTemplate/HomeTemplate';

// redux store
/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */

// docs
const TemplateEditorDocs = require('!!react-docgen-loader!components/TemplateEditor/TemplateEditor.js');
const HomeTemplateDocs = require('!!react-docgen-loader!components/HomeTemplate/HomeTemplate.js');

// sample data
const featured = require('static/featuredStories.json');
const files = require('static/files.json');
const stories = require('static/stories.json');
const users = require('static/users.json');

// modular home schema
const sampleData = {
  'name': 'bigtincan Featured',
  'items': [
    {
      'i': 'featured-stories',
      'layout': {
        'x': 0,
        'y': 0,
        'h': 4.25,
        'w': 12
      },
      'type': 'story-list',
      'title': '',
      'source': 'featured',
      'limit': 10,
      'grid': false
    },
    {
      'i': 'top-stories',
      'layout': {
        'x': 0,
        'y': 4.25,
        'h': 5,
        'w': 4
      },
      'type': 'story-list',
      'title': 'Top Stories',
      'source': 'top',
      'limit': 6,
      'grid': false
    },
    {
      'i': 'latest-stories',
      'layout': {
        'x': 4,
        'y': 4.25,
        'h': 5,
        'w': 4
      },
      'type': 'story-list',
      'title': 'Latest Stories',
      'source': 'latest',
      'limit': 6,
      'grid': false
    },
    {
      'i': 'leaderboard',
      'layout': {
        'x': 8,
        'y': 4.25,
        'h': 5,
        'w': 4
      },
      'type': 'user-list',
      'title': 'Leaderboard',
      'source': 'leaderboard',
      'limit': 6,
      'grid': false
    },
    {
      'i': 'recommended-stories',
      'layout': {
        'x': 0,
        'y': 9.25,
        'h': 3,
        'w': 12
      },
      'type': 'story-list',
      'title': 'Recommended Stories',
      'source': '',
      'limit': 6,
      'grid': true
    },
    {
      'i': 'my-top-people',
      'layout': {
        'x': 0,
        'y': 12.25,
        'h': 2,
        'w': 12
      },
      'type': 'user-list',
      'title': 'My Top People',
      'source': '',
      'limit': 6,
      'grid': true
    },
    {
      'i': 'most-viewed-stories',
      'layout': {
        'x': 0,
        'y': 15,
        'h': 3,
        'w': 12
      },
      'type': 'story-list',
      'title': 'Most Viewed Stories',
      'source': 'mostViewed',
      'limit': 6,
      'grid': true
    }
  ]
};

function mapStateToProps(state) {
  const { name, items, itemsById } = state;
  const mappedItems = items.length ? items.map(id => itemsById[id]) : [];
  const filteredItems = mappedItems.filter(item => !item.deleted);

  return {
    name,
    items: filteredItems
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
    toggleModuleEdit
  }
)
class ConnectedTemplateEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true
    };
    autobind(this);
  }

  componentDidMount() {
    //this.props.openTemplate(sampleData);
  }

  handleAnchorClick(event) {
    console.log(event);
  }

  handleSaveClick(data) {
    this.setState({
      isVisible: false
    });
    console.log(JSON.stringify(data, null, '  '));
  }

  handleNameChange(event) {
    this.props.editName(event.currentTarget.value);
  }

  handleAddItemClick(type, data) {
    this.props.addModule(type, data);
  }

  handleDeleteItemClick(i) {
    this.props.deleteModule(i);
  }

  handleEditItemClick(i) {
    this.props.toggleModuleEdit(i);
  }

  handleGetItemData(i) {
    const { items } = this.props;
    const index = items.findIndex(e => e.i === i);
    const item = items[index];
    const data = {
      loaded: true
    };

    if (index > -1) {
      switch (item.type) {
        case 'btca':
          data.baseUrl = 'https://localhost:2000/examples/jsbridge-tester-3/';
          break;
        case 'featured-list':
          data.list = item.source ? featured : [];
          break;
        case 'file-list':
          data.list = item.source ? files : [];
          break;
        case 'story-list':
          data.list = item.source ? stories : [];
          break;
        case 'user-list':
          data.list = item.source ? users : [];
          break;
        default:
          console.info('Unhandled type: ' + item.type);
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
    this.setState({
      isVisible: false
    });
  }

  hanleClearClick() {
    this.props.clearTemplate();
  }

  handleLayoutChange(newItems) {
    this.props.updateTemplate({ items: newItems });
  }

  toggleEditor() {
    this.setState({
      isVisible: !this.state.isVisible
    });
  }

  render() {
    const { isVisible } = this.state;
    const { name, items } = this.props;
    const filteredItems = items.filter(obj => !obj.deleted && obj.source !== '');

    return (
      <section id="TemplateEditorView">
        <h1>TemplateEditor</h1>
        <Docs {...TemplateEditorDocs} />

        <ComponentItem style={{ maxHeight: 700, overflow: 'auto' }}>
          <Btn onClick={this.toggleEditor}>Open Editor</Btn>
          {isVisible && <TemplateEditor
            name={name}
            items={items}
            fullscreen
            onNameChange={this.handleNameChange}
            onAddItemClick={this.handleAddItemClick}
            onDeleteItemClick={this.handleDeleteItemClick}
            onEditItemClick={this.handleEditItemClick}
            onGetItemData={this.handleGetItemData}
            onItemOptionChange={this.handleItemOptionChange}
            onItemEditCloseClick={this.handleItemEditCloseClick}
            onLayoutChange={this.handleLayoutChange}
            onCloseClick={this.handleCloseClick}
            onClearClick={this.hanleClearClick}
            onSaveClick={this.handleSaveClick}
          />}
        </ComponentItem>

        <h2>HomeTemplate</h2>
        <Docs {...HomeTemplateDocs} />

        <ComponentItem style={{ overflow: 'auto' }}>
          <HomeTemplate
            name={name}
            items={filteredItems}
            onGetItemData={this.handleGetItemData}
            onAnchorClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
        </ComponentItem>
      </section>
    );
  }
}

export default class TemplateEditorView extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedTemplateEditor />
      </Provider>
    );
  }
}
