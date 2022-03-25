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

import { AccessDenied, Blankslate, Btn, SVGIcon } from 'components';

const AccessDeniedDocs = require('!!react-docgen-loader!components/AccessDenied/AccessDenied.js');
const BlankslateDocs = require('!!react-docgen-loader!components/Blankslate/Blankslate.js');

export default class BlankslateView extends Component {

  handleClick(event) {
    event.preventDefault();
    console.log(event);
  }

  render() {
    return (
      <section id="BlankslateView">
        <h1>Blankslate</h1>
        <Docs {...BlankslateDocs} />

        <h2>Basic example</h2>
        <p>All props are optional but at least one should be passed.</p>
        <ComponentItem>
          <Blankslate
            icon="share"
            heading="This is a blankslate"
            message="Use it to provide information when no dynamic content exists."
          />
        </ComponentItem>

        <h2>Inline</h2>
        <p>Icon appears inline with message.</p>
        <ComponentItem>
          <Blankslate
            icon="comment"
            heading="No comments"
            message="Why not add the first one?"
            inline
          >
            <Btn small onClick={this.handleClick}>Add comment</Btn>
          </Blankslate>
        </ComponentItem>

        <h2>SVGIcon</h2>
        <p><code>icon</code> supports a node to be passed.</p>
        <ComponentItem>
          <Blankslate
            icon={<SVGIcon type="brokenFile" style={{ marginTop: '-0.25rem' }} />}
            heading="Ouch!"
            message="Something unexpected happened, we’re working to fix it."
            inline
          >
            <Btn small onClick={this.handleClick}>Reload</Btn>
          </Blankslate>
        </ComponentItem>
        <ComponentItem>
          <Blankslate
            icon={<SVGIcon type="toolbox" style={{ width: '18rem' }} />}
            heading="Scheduled Maintenance!"
            message="We are currently undergoing scheduled maintenance, we will be back soon."
          />
        </ComponentItem>

        <h2>AccessDenied</h2>
        <Docs {...AccessDeniedDocs} />
        <ComponentItem>
          <AccessDenied
            onCloseClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
