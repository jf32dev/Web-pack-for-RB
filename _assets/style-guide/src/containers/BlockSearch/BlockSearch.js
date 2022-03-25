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
 * @author Lochlan McBride <lmcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import {
  BlockSearchBlockItem,
  BlockSearchFileItem,
  BlockSearchInput,
} from 'components';

const BlockSearchBlockItemDocs = require('!!react-docgen-loader!components/BlockSearchBlockItem/BlockSearchBlockItem.js');
const BlockSearchFileItemDocs = require('!!react-docgen-loader!components/BlockSearchFileItem/BlockSearchFileItem.js');
const BlockSearchInputDocs = require('!!react-docgen-loader!components/BlockSearchInput/BlockSearchInput.js');

const staticFiles = require('static/filesSearch.json');

const staticFilesWithBlocks = [
  {
    ...staticFiles[0],
    matchedBlocks: [
      {
        id: 1,
        type: 'image',
        page: 10,
        result: 'src/static/images/file1.png',
        thumbnailUrl: 'src/static/images/file1.png',
        canAddToCanvas: true
      },
      {
        id: 2,
        type: 'image',
        page: 30,
        result: 'src/static/images/file2.png',
        thumbnailUrl: 'src/static/images/file2.png',
        canAddToCanvas: true
      },
      {
        id: 3,
        type: 'text',
        page: 15,
        text: 'The Small Business Product Line Strategy (PLS)',
        thumbnailUrl: 'src/static/images/file3.png',
        canAddToCanvas: true
      },
      {
        id: 4,
        type: 'text',
        page: 24,
        text: 'In the past, Small Business Customers have quickly judged the value...',
        thumbnailUrl: 'src/static/images/file4.png',
        canAddToCanvas: true
      },
    ]
  },
  {
    ...staticFiles[1],
    matchedBlocks: [
      {
        id: 5,
        type: 'text',
        page: 23,
        text: 'Running a successful small business, required owners to be efficient and resourceful. That\'s why Mastercard hs enhanced our offers for...',
        canAddToCanvas: true
      }
    ]
  },
  {
    ...staticFiles[2],
    matchedBlocks: [
      {
        id: 6,
        type: 'image',
        page: 10,
        result: 'src/static/images/file4.png',
        canAddToCanvas: true
      },
      {
        id: 7,
        type: 'image',
        page: 30,
        result: 'src/static/images/file6.png',
        canAddToCanvas: true
      },
      {
        id: 8,
        type: 'text',
        page: 15,
        text: 'The Small Business Product Line Strategy (PLS)',
        canAddToCanvas: true
      },
      {
        id: 9,
        type: 'text',
        page: 24,
        text: 'In the past, Small Business Customers have quickly judged the value...',
        canAddToCanvas: true
      }
    ]
  },
  {
    ...staticFiles[3],
    matchedBlocks: [
      {
        id: 10,
        type: 'text',
        page: 23,
        result: 'Running a successful small business, required owners to be efficient and resourceful. That\'s why Mastercard hs enhanced our offers for...',
        canAddToCanvas: true
      }
    ]
  },
  {
    ...staticFiles[4],
    matchedBlocks: [
      {
        id: 11,
        type: 'caption',
        time: '00:34',
        result: 'Capitalizing on the Small Business Market...',
        canAddToCanvas: true
      }
    ]
  },
  {
    ...staticFiles[5],
    matchedBlocks: [
      {
        id: 12,
        type: 'text',
        result: 'The new small business bundle',
        canAddToCanvas: true
      }
    ]
  },
];

// Hard-coded filters
const STATIC_SEARCH_FILTERS = [
  {
    id: 'source',
    name: 'Source',
    options: [
      {
        id: 'source-psc',
        name: 'PSC',
        type: 'tag'
      },
      {
        id: 'source-ice',
        name: 'ICE',
        type: 'tag'
      },
      {
        id: 'source-newsroom',
        name: 'Newsroom',
        type: 'tag'
      },
    ]
  },
  {
    id: 'file-type',
    name: 'File Type',
    options: [
      {
        id: 'certified',
        name: 'Certified',
        type: 'tag'
      },
      {
        id: 'pdf',
        name: 'PDF',
        type: 'category'
      },
      {
        id: 'powerpoint',
        name: 'Powerpoint',
        type: 'category'
      },
      {
        id: 'video',
        name: 'Videos',
        type: 'category'
      },
    ]
  },
  {
    id: 'region',
    name: 'Region',
    options: [
      {
        id: 'global',
        name: 'Global',
      },
      {
        id: 'asia-pacific',
        name: 'Asia Pacific',
      },
      {
        id: 'canada',
        name: 'Canada',
      },
      {
        id: 'europe',
        name: 'Europe',
      },
      {
        id: 'latin-america-and-caribbean',
        name: 'Latin America & the Caribbean',
      },
      {
        id: 'middle-east-and-africa',
        name: 'Middle East and Africa',
      },
      {
        id: 'united-states',
        name: 'United States',
      },
      {
        id: 'north-america-markets',
        name: 'North America Markets (NAM)',
      },
    ]
  },
  {
    id: 'product-line-service',
    name: 'Product Line/Service',
    options: [
      {
        id: 'commercial',
        name: 'Commercial',
      },
      {
        id: 'core-products',
        name: 'Core Products',
      },
      {
        id: 'cyber-and-intelligence-solutions',
        name: 'Cyber & Intelligence Solutions',
      },
      {
        id: 'data-and-services',
        name: 'Data & Services',
      },
      {
        id: 'digital-payments',
        name: 'Digital Payments',
      },
      {
        id: 'communications',
        name: 'Communications',
      },
      {
        id: 'new-payment-platforms',
        name: 'New Payment Platforms',
      },
      {
        id: 'processing-services',
        name: 'Processing Services',
      },
      {
        id: 'strategic-growth',
        name: 'Strategic Growth',
      },
    ]
  },
  {
    id: 'stakeholders',
    name: 'Stakeholders',
    options: [
      {
        id: 'acquirer',
        name: 'Acquirer',
      },
      {
        id: 'government',
        name: 'Government'
      },
      {
        id: 'issuer',
        name: 'Issuer',
      },
      {
        id: 'merchant',
        name: 'Merchant',
      },
      {
        id: 'processor',
        name: 'Processor',
      },
    ]
  },
  {
    id: 'audience-consumer-segments',
    name: 'Audience/Consumer Segments',
    options: [
      {
        id: 'affluent',
        name: 'Affluent'
      },
      {
        id: 'centennials',
        name: 'Centennials'
      },
      {
        id: 'mass-affluent',
        name: 'Mass Affluent'
      },
      {
        id: 'millenials',
        name: 'Millenials'
      },
    ]
  },
];

export default class BlockSearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
    autobind(this);
  }

  handleActionClick(action, file) {
    console.log(action, file.id);
  }

  handleCheckedChange(event) {
    this.setState({
      checked: event.currentTarget.checked
    });
  }

  handleSearchClick(query, filters) {
    console.log(query);
    console.log(filters);
  }

  render() {
    // Source tags to display on results
    const sourceFilter = STATIC_SEARCH_FILTERS.find(f => f.id === 'source');
    let sourceTags = [];
    if (sourceFilter) {
      sourceTags = sourceFilter.options;
    }

    return (
      <section id="BlockSearch">
        <h1>Block Search</h1>
        <p>Components for the 'Block' based search.</p>

        <h2>BlockSearchInput</h2>
        <Docs {...BlockSearchInputDocs} />

        <ComponentItem style={{
          backgroundImage: 'url(src/static/images/featured6.png)',
          backgroundSize: 'cover',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'auto'
        }}>
          <BlockSearchInput
            full
            filters={STATIC_SEARCH_FILTERS}
            onSearchClick={this.handleSearchClick}
          />
        </ComponentItem>

        <h2>BlockSearchBlockItem</h2>
        <Docs {...BlockSearchBlockItemDocs} />

        <ComponentItem>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            margin: '-0.5rem'
          }}>
            <BlockSearchBlockItem
              {...staticFilesWithBlocks[0]}
              certified
              sourceTags={sourceTags}
              onActionClick={this.handleActionClick}
              style={{ margin: '0.5rem' }}
            />
            <BlockSearchBlockItem
              {...staticFilesWithBlocks[1]}
              onActionClick={this.handleActionClick}
              style={{ margin: '0.5rem' }}
            />
            <BlockSearchBlockItem
              {...staticFilesWithBlocks[2]}
              onActionClick={this.handleActionClick}
              style={{ margin: '0.5rem' }}
            />
            <BlockSearchBlockItem
              {...staticFilesWithBlocks[3]}
              onActionClick={this.handleActionClick}
              style={{ margin: '0.5rem' }}
            />
            <BlockSearchBlockItem
              {...staticFilesWithBlocks[4]}
              onActionClick={this.handleActionClick}
              style={{ margin: '0.5rem' }}
            />
            <BlockSearchBlockItem
              {...staticFilesWithBlocks[5]}
              select
              checked={this.state.checked}
              onActionClick={this.handleActionClick}
              onCheckedChange={this.handleCheckedChange}
              style={{ margin: '0.5rem' }}
            />
          </div>
        </ComponentItem>

        <h2>BlockSearchFileItem</h2>
        <Docs {...BlockSearchFileItemDocs} />

        <ComponentItem>
          <BlockSearchFileItem
            {...staticFiles[0]}
            certified
            onActionClick={this.handleActionClick}
            style={{ marginBottom: '1.25rem' }}
          />
          <BlockSearchFileItem
            {...staticFiles[1]}
            onActionClick={this.handleActionClick}
            style={{ marginBottom: '1.25rem' }}
          />
          <BlockSearchFileItem
            {...staticFiles[2]}
            onActionClick={this.handleActionClick}
            style={{ marginBottom: '1.25rem' }}
            />
          <BlockSearchFileItem
            {...staticFiles[3]}
            onActionClick={this.handleActionClick}
            style={{ marginBottom: '1.25rem' }}
          />
          <BlockSearchFileItem
            {...staticFiles[4]}
            onActionClick={this.handleActionClick}
            style={{ marginBottom: '1.25rem' }}
          />
          <BlockSearchFileItem
            {...staticFiles[5]}
            onActionClick={this.handleActionClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
