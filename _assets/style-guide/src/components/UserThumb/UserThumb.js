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
 * @package hub-web-app-v5
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

export default class UserThumb extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,

    maxInitials: PropTypes.number,
    width: PropTypes.number,

    authString: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    maxInitials: 2,
    width: 46
  };

  constructor(props) {
    super(props);
    this.state = { initials: '' };
  }

  UNSAFE_componentWillMount() {
    const { name, thumbnail } = this.props;
    if (name && !thumbnail) {
      this.getInitials(this.props);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name || nextProps.maxInitials !== this.props.maxInitials) {
      this.getInitials(nextProps);
    }
  }

  getInitials(props) {
    const { name, maxInitials } = props;
    const fixedName = name.replace(/ +(?= )/g, '');  // remove double spaces
    const nameArray = fixedName.split(' ');
    let initials = '';

    if (nameArray.length > 1 && maxInitials > 1) {
      initials = nameArray[0][0] + nameArray[1][0];
    } else {
      initials = nameArray[0][0];
    }

    this.setState({ initials: initials });
  }

  render() {
    const { name, thumbnail, width, authString, className, style } = this.props;
    const styles = require('./UserThumb.less');
    const cx = classNames.bind(styles);
    const classes = cx({ UserThumb: true }, className);

    let fontSize = '1.1rem';
    if (width > 70) {
      fontSize = '1.5rem';
    } else if (width < 46 && width > 32) {
      fontSize = '0.9rem';
    } else if (width <= 32) {
      fontSize = '0.8rem';
    }

    const thumbStyle = {
      backgroundColor: !thumbnail ? '#ccc' : '#f5f5f5',
      backgroundImage: thumbnail ? 'url(' + thumbnail + authString + ')' : 'none',
      fontSize: fontSize,
      height: width + 'px',
      minWidth: width + 'px',
      width: width + 'px',
      ...style
    };

    return (
      <span title={name} className={classes} style={thumbStyle}>
        {!thumbnail && this.state.initials}
      </span>
    );
  }
}
