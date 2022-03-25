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
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt, dismissPrompt } from 'redux/modules/prompts';

import PromptItem from 'components/PromptItem/PromptItem';

/**
 * Example Usage
 * Pass props for PromptItem

  createPrompt({
    id: uniqueId(),
    type: 'info',
    title: 'Info',
    message: 'Example...',
    dismissible: true,
    autoDismiss: 5
  });
*/
function mapStateToProps(state) {
  const { prompts } = state;

  // Map to array
  const allPrompts = prompts.order.map(id => prompts.promptsById[id]);

  return {
    visiblePrompts: allPrompts.filter(obj => !obj.dismissed),
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    dismissPrompt
  })
)
export default class Prompts extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    visiblePrompts: PropTypes.array,
    maxVisible: PropTypes.number
  };

  static defaultProps = {
    maxVisible: 5
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleDismiss(event, id) {
    this.props.dismissPrompt(id);
  }

  handleLinkClick(id, path) {
    this.props.dismissPrompt(id);
    this.context.router.history.push(path);
  }

  render() {
    const { visiblePrompts, maxVisible } = this.props;
    const styles = require('./Prompts.less');
    const prompts = visiblePrompts.slice(0, maxVisible);

    return (
      <div className={styles.Prompts}>
        <TransitionGroup>
          {prompts.map(prompt => (<CSSTransition
            key={'prompt-' + prompt.id}
            classNames="fade"
            timeout={250}
            appear
          >
            <PromptItem
              onDismiss={this.handleDismiss}
              onLinkClick={this.handleLinkClick}
              {...prompt}
            />
          </CSSTransition>))}
        </TransitionGroup>
      </div>
    );
  }
}
