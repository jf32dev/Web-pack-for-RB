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

/* eslint-disable react/no-unused-state */

import camelCase from 'lodash/camelCase';
import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

/**
 * MediaContext is a HOC that provides context for the matched media query
 */
export default class MediaContext extends Component {
  static propTypes = {
    /** Media queries to match - should match variables.less */
    queries: PropTypes.object
  };

  static defaultProps = {
    queries: {
      mobileXs: 'only screen and (max-width: 35.9375em)',
      mobile: 'only screen and (min-width: 36em) and (max-width: 47.9375em)',
      tablet: 'only screen and (min-width: 48em) and (max-width: 59.3125em)',
      desktop: 'only screen and (min-width: 59.375em) and (max-width: 70.5em)',
      desktopXl: 'only screen and (min-width: 70.5625em)'
    }
  };

  static childContextTypes = {
    media: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      media: ['desktop']
    };

    this.match = this.match.bind(this);
    this.handleResize = debounce(this.handleResize.bind(this), 100);
  }

  getChildContext() {
    return this.state;
  }

  UNSAFE_componentWillMount() {
    this.match();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  match() {
    const { queries } = this.props;
    const media = [];
    for (const key in queries) {
      if (window.matchMedia(queries[key]).matches) {
        media.push(camelCase(key));
      }
    }
    this.setState({ media });
  }

  handleResize() {
    this.match();
  }

  render() {
    return this.props.children;
  }
}
