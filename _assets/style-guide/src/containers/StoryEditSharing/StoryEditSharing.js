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
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import StoryEditSharing from 'components/StoryEditSharing/StoryEditSharing';

const StoryEditSharingDocs = require('!!react-docgen-loader!components/StoryEditSharing/StoryEditSharing.js');

export default class StoryEditSharingView extends Component {
  constructor(props) {
    super(props);

    // Dummy story sharing props
    this.state = {
      sharingPublic: true,
      sharingLinkedinDescription: 'LinkedIn description...',
      sharingFacebookDescription: 'Facebook description...',
      sharingTwitterDescription: 'Twitter description...',
      sharingDownloadLimit: 5,
      sharingDownloadExpiry: 3,
      sharingIncludeDescription: false
    };

    autobind(this);
  }

  handlePublicShareChange(event) {
    const checked = event.target.checked;
    this.setState({
      sharingPublic: checked
    });
  }

  handleShareDescriptionChange(event) {
    const value = event.target.value;
    const type = event.target.dataset.type;
    this.setState({
      [type + 'Description']: value
    });
  }

  handleDownloadLimitChange(event) {
    const type = event.target.type;

    // Toggle checkbox
    if (type === 'checkbox') {
      if (!event.target.checked) {
        this.setState({
          sharingDownloadLimit: 0
        });
      } else {
        this.setState({
          sharingDownloadLimit: 5  // default
        });
      }

    // Text input, set value
    } else if (type === 'text') {
      this.setState({
        sharingDownloadLimit: parseInt(event.target.value, 10)
      });
    }
  }

  handleDownloadExpiryChange(event) {
    const type = event.target.type;

    // Toggle checkbox
    if (type === 'checkbox') {
      if (!event.target.checked) {
        this.setState({
          sharingDownloadExpiry: 0
        });
      } else {
        this.setState({
          sharingDownloadExpiry: 3  // default
        });
      }

    // Text input, set value
    } else if (type === 'text') {
      this.setState({
        sharingDownloadExpiry: parseInt(event.target.value, 10)
      });
    }
  }

  handleIncludeSharingDescriptionChange(event) {
    const checked = event.target.checked;
    this.setState({
      sharingIncludeDescription: checked
    });
  }

  render() {
    return (
      <section id="StoryEditSharingView">
        <h1>StoryEditSharing</h1>
        <Docs {...StoryEditSharingDocs} />

        <Debug>
          <div style={{ textAlign: 'left', maxWidth: '500px' }}>
            <code>{JSON.stringify(this.state, null, '  ')}</code>
          </div>
        </Debug>

        <ComponentItem>
          <StoryEditSharing
            {...this.state}
            onPublicShareChange={this.handlePublicShareChange}
            onShareDescriptionChange={this.handleShareDescriptionChange}
            onDownloadLimitChange={this.handleDownloadLimitChange}
            onDownloadExpiryChange={this.handleDownloadExpiryChange}
            onIncludeSharingDescriptionChange={this.handleIncludeSharingDescriptionChange}
          />
        </ComponentItem>
      </section>
    );
  }
}
