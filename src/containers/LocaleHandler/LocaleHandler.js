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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import moment from 'moment';
import { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { loadLocale } from 'redux/modules/intl';

@connect(
  state => ({
    loadedLocale: state.intl.locale,
    userLocale: state.settings.user.langCode,
    shareLocale: state.publicShare.langCode
  }),
  bindActionCreatorsSafe({
    loadLocale
  })
)
export default class LocaleHandler extends Component {
  static propTypes = {
    loadedLocale: PropTypes.string,
    userLocale: PropTypes.string,
    shareLocale: PropTypes.string,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    this.loadUserLocale(this.props.userLocale || this.props.shareLocale);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.userLocale !== this.props.userLocale || nextProps.shareLocale !== this.props.shareLocale) {
      this.loadUserLocale(nextProps.userLocale || nextProps.shareLocale);
    }
  }

  loadUserLocale(userLocale = 'en') {
    const { loadedLocale } = this.props;

    // Treat 'en' and 'en-us' as equal
    const fixedLocale = userLocale === 'en-us' ? 'en' : userLocale;

    // Check if loadedLocale differs to user locale settings
    if (fixedLocale.indexOf(loadedLocale) === -1) {
      this.props.loadLocale(fixedLocale);
      moment.locale(fixedLocale);
    }
  }

  render() {
    return null;
  }
}
