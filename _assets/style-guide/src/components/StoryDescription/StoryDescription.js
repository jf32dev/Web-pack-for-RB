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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

/**
 * Renders Story Description template in an iFrame
 */
export default class StoryDescription extends PureComponent {
  static propTypes = {
    /** templatePath where an index.html file can be found */
    baseUrl: PropTypes.string.isRequired,

    /** iframe content is assumed loaded when height is set */
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** minHeight is applied before height is available, typically when loading */
    minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      referrer: document ? document.location.origin : ''
    };
  }

  render() {
    const {
      baseUrl,
      height,
      minHeight
    } = this.props;
    const { referrer } = this.state;
    const styles = require('./StoryDescription.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryDescription: true
    }, this.props.className);
    const style = {
      ...this.props.style,
      minHeight: height || minHeight
    };

    //const baseUrl = 'https://localdev.btc:2000/static/story-description';

    // js-bridge params
    const params = referrer ? `?action=postMessage&referrer=${referrer}` : '';

    const frameSrc = baseUrl + '/index.html' + params;

    return (
      <div className={classes} style={style}>
        <iframe
          src={frameSrc}
          height={height || minHeight}
          width="100%"
          sandbox="allow-same-origin allow-scripts allow-presentation"
          seamless
        />
      </div>
    );
  }
}
