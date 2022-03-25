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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { load, close } from 'redux/modules/form';
//import { FormattedMessage } from 'react-intl';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';

@connect(
  state => (state.form),
  bindActionCreatorsSafe({ load, close })
)
export default class FormDetail extends Component {
  static propTypes = {
    loading: PropTypes.bool
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    //this.state = { somethingIs: true };
    this.handleBackClick = this.handleBackClick.bind(this);
  }

  componentDidMount() {
    if (!this.props.loaded && this.props.match.params.formId) {
      //this.props.load(this.props.match.params.formId);
    }
  }

  handleBackClick(event) {
    event.preventDefault();
    this.context.router.history.goBack();
  }

  render() {
    const { loading } = this.props;
    //const editUrl = '/form/' + this.props.id + '/edit';
    const style = require('./FormDetail.less');

    if (loading) {
      return <Loader type="page" />;
    }

    return (
      <div className={style.FormDetail}>
        <Blankslate
          icon="wheelbarrow"
          iconSize={128}
          heading="Form Detail"
          message="We’re still building this page for you, please check back soon"
        >
          <Btn small onClick={this.handleBackClick}>Go Back</Btn>
        </Blankslate>
      </div>
    );
  }
}
