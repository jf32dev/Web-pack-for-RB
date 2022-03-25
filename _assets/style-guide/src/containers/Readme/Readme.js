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

import React, { PureComponent } from 'react';
import { markdown } from 'markdown';

const readme = require('../../../README.md');

export default class ReadmeView extends PureComponent {
  constructor(props) {
    super(props);
    this.markdownHTML = markdown.toHTML(readme);
  }

  render() {
    return (
      <section
        id="readme-page"
        ref="markdown"
        dangerouslySetInnerHTML={{ __html: this.markdownHTML }}
      />
    );
  }
}
