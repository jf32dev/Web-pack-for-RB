import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
//import classNames from 'classnames/bind';

import AdminVisualiseRelationships from 'components/Admin/AdminVisualiseRelationships/AdminVisualiseRelationships';
import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import AdminPanels from 'components/Admin/AdminPanels/AdminPanels';

const hierarchy = require('../../static/visualiseData.json');
const tabs = require('../../static/tabs.json');
const channels = require('../../static/channels.json');

export default class AdminVisualiseDataView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      itemSelectedTab: {},
      width: 900,
      height: 480,
    };
    autobind(this);
  }

  /* Tab section */
  handleTabGraphClick(e, context) {
    const item = context.list.find(obj => obj.id === context.itemSelected.id);
    console.log(item);
  }
  handleTabClick(event, context) {
    this.setState({
      itemSelectedTab: { id: context.id, name: context.name, position: context.position },
      lastClick: context.name,
    });
  }
  handleTabBreadcrumbClick(event, context) {
    console.log('Scroll to:' + context.name);
  }
  handleTabEditClick(event) {
    console.log('Edit Tab clicked open modal');
  }
  handleTabFilterChange(event) {
    this.setState({ filterValueTab: event.currentTarget.value });
  }
  handleTabFilterClear() {
    this.setState({ filterValueTab: '' });
  }

  render() {
    const {
      itemSelectedTab,
    } = this.state;

    const primaryPanel = (
      <AdminManageList
        list={tabs}
        headerTitle={'Tabs'}
        width={300}
        placeholder={'Select Tab'}
        itemSelected={itemSelectedTab}
        showEdit
        onGetList={() => {}}

        onBreadcrumbClick={this.handleTabBreadcrumbClick}
        onItemClick={this.handleTabClick}
        onEditClick={this.handleTabEditClick}

        showFilter
        filterValue={this.state.filterValueTab}
        filterPlaceholder="Filter"
        onFilterChange={this.handleTabFilterChange}
        onFilterClear={this.handleTabFilterClear}

        onScroll={this.handleListScroll}
        style={{ position: 'relative', left: 0, top: 0, height: '100%' }}
      />
    );

    const secondaryPanel = (
      <AdminVisualiseRelationships
        list={hierarchy}
        legend={[
          { type: 'tab' },
          { type: 'channel' }
        ]}
        height={this.state.height}
        width={this.state.width}
        showLegend
        showZoom
      />
    );

    const wrapperHeight = '800px';
    const wrapperStyle = {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100%',
      minHeight: '100%',
      height: '100%',
      overflow: 'hidden',
    };

    return (
      <section id="NavMenuView">
        <h1>AdminVisualiseRelationships</h1>

        <h2>Data Visualization</h2>
        <p>Split panel horizontal.</p>

        <ComponentItem style={{ height: wrapperHeight }} >
          <div style={wrapperStyle}>
            <AdminPanels
              primaryPanel={primaryPanel}
              secondaryPanel={secondaryPanel}
              onClose={() => (console.log('Close Clicked'))}
            />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
