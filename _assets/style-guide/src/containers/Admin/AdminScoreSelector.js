import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import AdminScoreSelector from 'components/Admin/AdminScoreSelector/AdminScoreSelector';

const RangeSliderDocs = require('!!react-docgen-loader!components/Admin/AdminBadgeSelector/AdminBadgeSelector.js');

export default class AdminScoreSelectorView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    basePath: '/admin'
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          "name": "actions_on_others_content",
          "value": 0.2
        },
        {
          "name": "important_actions_on_others_content",
          "value": 0.5
        },
        {
          "name": "actions_on_others",
          "value": 0.3
        },
        {
          "name": "others_actions_on_user",
          "value": 0.6
        },
        {
          "name": "content_publishing",
          "value": 0.6
        },
        {
          "name": "content_to_activity_ratio",
          "value": 0.6
        }
      ],
      listContent: [
        {
          "name": "view_actions_on_stories",
          "value": 0.9
        },
        {
          "name": "author_actions",
          "value": 0.3
        },
        {
          "name": "sharing_actions",
          "value": 0.5
        },
        {
          "name": "important_actions",
          "value": 0.6
        },
        {
          "name": "negative_important_actions",
          "value": 0.1
        }
      ]
    };
    autobind(this);
  }

  handleRangeChange(value, context) {
    const nList = Object.assign([], this.state.list);
    nList.map(function(item) {
      if (item.name === context.keyValue) item.value = value;
      return item;
    });

    //nList[context.keyValue] = value;
    this.setState({ list: nList });
  }
  handleToggle(event, context) {
    const nList = Object.assign([], this.state.list);
    const obj = nList.find(x => x.name === context.keyValue);
    let index = nList.indexOf(obj);

    // Value is set to 0 when disabled
    nList.fill(obj.value = event.currentTarget.checked ? context.value : context.min, index, index++);
    this.setState({ list: nList });
  }

  // Content Score
  handleRangeChangeContent(value, context) {
    const nList = Object.assign([], this.state.listContent);
    nList.map(function(item) {
      if (item.name === context.keyValue) item.value = value;
      return item;
    });
    this.setState({ listContent: nList });
  }
  handleToggleContent(event, context) {
    const nList = Object.assign([], this.state.listContent);
    const obj = nList.find(x => x.name === context.keyValue);
    let index = nList.indexOf(obj);

    // Value is set to 0 when disabled
    nList.fill(obj.value = event.currentTarget.checked ? context.value : context.min, index, index++);
    this.setState({ listContent: nList });
  }

  handleSave(value) {
    console.log('Saving: ' + value);
  }
  render() {
    return (
      <section id="NavMenuView">
        <h1>Social & Content IQ Algorithm Selector</h1>
        <Docs {...RangeSliderDocs} />

        <h2>User Score ranges</h2>
        <p>Move the slide toward each end to indicate the weighting of each component.</p>

        <ComponentItem>
          <AdminScoreSelector
            header={'User Score'}
            minValue={0}
            maxValue={1}
            step={0.1}
            list={this.state.list}
            onToggle={this.handleToggle}
            onRangeChange={this.handleRangeChange}
            onSave={this.handleSave}
            showTestScore
            showRebaseScore
            showReset
            onResetClick={function() { console.log('Reset clicked'); }}
            onTestScoreClick={function() { console.log('Test Score clicked'); }}
            onRebaseScoreClick={function() { console.log('Rebase Score trigger'); }}
          />
        </ComponentItem>

        <h2>Content Score ranges</h2>
        <p>Move the slide toward each end to indicate the weighting of each component.</p>

        <ComponentItem>
          <AdminScoreSelector
            header={'Content Score'}
            minValue={0}
            maxValue={1}
            step={0.1}
            list={this.state.listContent}
            showReset
            isResetLoading
            onResetClick={function() { console.log('Reset clicked'); }}
            onToggle={this.handleToggleContent}
            onRangeChange={this.handleRangeChangeContent}
            onSave={this.handleSave}
          />
        </ComponentItem>
      </section>
    );
  }
}
