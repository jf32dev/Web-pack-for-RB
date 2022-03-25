import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
//import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import AdminBadgeSelector from 'components/Admin/AdminBadgeSelector/AdminBadgeSelector';

const RangeSliderDocs = require('!!react-docgen-loader!components/Admin/AdminBadgeSelector/AdminBadgeSelector.js');

const socialIQBadges = require('../../static/socialIQBadges.json');

export default class AdminBadgeSelectorView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    basePath: '/admin'
  };

  constructor(props) {
    super(props);
    this.state = {
      list: socialIQBadges,
      dragging: false,
      values: [23, 29, 60],
      colors: ['purple', 'blue', 'green', 'red']
    };
    autobind(this);
  }

  handleClick(event, context) {
    this.setState({
      itemSelected: { id: context.id, name: context.name, position: context.position },
      lastClick: context.name,
    });
  }

  handleRangeChange(nList) {
    this.setState({ list: nList });
  }

  handleTitleChange(event, context) {
    const nList = Object.assign([], this.state.list);
    nList[context.index].title = event.currentTarget.value;
    this.setState({ list: nList });
  }
  handleTitleBlur(context) {
    // Disable item if title is empty
    const nList = Object.assign([], this.state.list);
    if (!nList[context.index].title) {
      nList[context.index].enabled = !nList[context.index].enabled;
      this.setState({list: nList});
    }
  }
  handleColorChange(colour, context) {
    const nList = Object.assign([], this.state.list);
    nList[context.index].colour= colour;
    this.setState({ list: nList });
  }
  handleToggleEnable(event, context) {
    const nList = Object.assign([], this.state.list);
    nList[context.index].enabled= event.currentTarget.checked;

    if (event.currentTarget.checked && !nList[context.index].title) {
      console.log('Warning Message Title is required');
    }

    this.setState({ list: nList });
  }
  handleDelete(event, context) {
    const fList = Object.assign([], this.state.list);

    // If not First item assign max value to prev item
    if (context.index) {
      fList[context.index - 1].max = (context.index + 1 !== fList.length) ? fList[context.index].max - 1 : 100;
    }

    // If not Last item assign min value to next item
    if (context.index + 1 !== fList.length) {
      fList[context.index + 1].min = context.index ? fList[context.index].max : 0;
    }

    // Remove item
    const nList = fList.filter((n, i) => i!==context.index);
    this.setState({ list: nList });
  }
  handleAddBadge(newBadge) {
    let nList = Object.assign([], this.state.list);
    const rList = Object.assign([], this.state.list).reverse();
    // Update ranges
    const lastIndex = nList.length - 1;
    const lastItem = Object.assign({}, nList[lastIndex]);

    if (lastItem.min >= lastItem.max - 2) { // = 99
      // Needs to check that values won't overlap
      const tmpRList = rList.map(function(obj, i) {
        if (!i) { // Last Item
          obj.max = lastItem.max - 2;
          obj.min = lastItem.min - 2;

        } else if (obj.min) {
          // Check other ranges but first item
          if (obj.max >= rList[i - 1].min) {
            obj.max = rList[i - 1].min - 1;
          }
          if (obj.min >= obj.max) {
            obj.min = obj.max - 1;
          }
        }
        return obj;
      });
      nList = Object.assign([], tmpRList).reverse();

    } else {
      // Only update last item
      nList[lastIndex].max = lastItem.max - 2;
    }

    this.setState({ list: [...nList, newBadge] });
  }

  render() {

    let disableAdd = false;
    if (this.state.list.filter(obj => (!obj.title || !obj.colour) && obj.enabled).length) disableAdd = true;

    return (
      <section id="NavMenuView">
        <h1>Social & Content Badges Selector</h1>
        <Docs {...RangeSliderDocs} />

        <h2>Add/ Remove badges range</h2>
        <p>Range selector used in Gamification.</p>

        <ComponentItem>
          <AdminBadgeSelector
            list={this.state.list}
            values={this.state.values}
            colors={this.state.colors}
            minValue={0}
            maxValue={100}
            minBars={3}
            maxBars={10}
            titleMaxLength={20}
            onRangeChange={this.handleRangeChange}
            onColorChange={this.handleColorChange}
            onTitleChange={this.handleTitleChange}
            onTitleBlur={this.handleTitleBlur}
            onToggleEnable={this.handleToggleEnable}
            onDelete={this.handleDelete}
            showAdd
            header={'User Badges'}
            showReset
            //isResetLoading
            onResetClick={function() { console.log('Reset clicked'); }}
            disableAdd={disableAdd}
            onAddClick={this.handleAddBadge}
          />
        </ComponentItem>
      </section>
    );
  }
}
