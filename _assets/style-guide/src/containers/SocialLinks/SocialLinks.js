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
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import SocialLinks from 'components/SocialLinks/SocialLinks';

const SocialLinksDocs = require('!!react-docgen-loader!components/SocialLinks/SocialLinks.js');

export default class SocialLinksView extends Component {
  handleClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  render() {
    return (
      <section id="SocialLinksView">
        <h1>SocialLinks</h1>
        <Docs {...SocialLinksDocs} />

        <ComponentItem>
          <SocialLinks
            appleId="appleId"
            bloggerUrl="bloggerUrl"
            facebookUrl="facebookUrl"
            skypeId="skypeId"
            twitterUrl="twitterUrl"
            linkedin="linkedin"
            custom1="custom1"
            custom2="custom2"
            onAnchorClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
