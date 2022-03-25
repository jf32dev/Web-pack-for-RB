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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import PraiseInput from './PraiseInput';
import PraiseItem from './PraiseItem';

export default class Praises extends Component {
  static propTypes = {
    praises: PropTypes.array,
    canAddPraise: PropTypes.bool,
    canDeletePraise: PropTypes.bool,

    strings: PropTypes.object,
    authString: PropTypes.string,

    onUserClick: PropTypes.func.isRequired,
    onAddPraise: PropTypes.func,
    onDeletePraise: PropTypes.func
  };

  static defaultProps = {
    praises: [],

    strings: {
      writeAPraise: 'Write a praise',
      emptyHeading: 'No praises',
      emptyMessage: 'Be the first to praise',
      delete: 'Delete',
      cancel: 'Cancel',
      confirmDeleteMessage: 'Are you sure you want to delete this praise?'
    },

    authString: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      inputVisible: props.praises.length > 0
    };
    autobind(this);

    // refs
    this.praiseInput = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.praises.length && !this.props.praises.length) {
      this.setState({ inputVisible: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.inputVisible && !prevState.inputVisible && this.praiseInput) {
      this.praiseInput.focusInput();
    }
  }

  handleBlankBtnClick() {
    this.setState({ inputVisible: true });
  }

  renderEmpty() {
    const { inputVisible } = this.state;
    const { strings, canAddPraise } = this.props;

    return (
      <Blankslate
        icon="comment"
        iconSize={96}
        heading={strings.emptyHeading}
        message={canAddPraise ? strings.emptyMessage : ''}
      >
        {canAddPraise && !inputVisible && <Btn
          small inverted onClick={this.handleBlankBtnClick}
          style={{ marginBottom: '1rem' }}
        >
          {strings.writeAPraise}
        </Btn>}
      </Blankslate>
    );
  }

  renderPraises() {
    const { praises, strings } = this.props;
    const style = require('./Praises.less');

    return (
      <ul className={style.praiseWrap}>
        {praises.map((praise, index) =>
          praises.status !== 'deleted' &&
          <PraiseItem
            key={'praise-' + index}
            authString={this.props.authString}
            onUserClick={this.props.onUserClick}
            canDeletePraise={this.props.canDeletePraise}
            onDeletePraise={this.props.onDeletePraise}
            deleteLabel={strings.delete}
            cancelLabel={strings.cancel}
            confirmDeleteMessage={strings.confirmDeleteMessage}
            {...praise}
          />
        )}
      </ul>
    );
  }

  render() {
    const { inputVisible } = this.state;
    const { praises, canAddPraise, strings } = this.props;
    const style = require('./Praises.less');

    return (
      <div className={style.Praises}>
        {(!praises || praises.length === 0) && this.renderEmpty()}
        {praises && praises.length > 0 && this.renderPraises()}
        {canAddPraise && inputVisible &&
        <PraiseInput
          ref={(c) => { this.praiseInput = c; }}
          title={strings.writeAPraise}
          onAddPraise={this.props.onAddPraise}
          className={style.inputPraise}
        />
        }
      </div>
    );
  }
}
