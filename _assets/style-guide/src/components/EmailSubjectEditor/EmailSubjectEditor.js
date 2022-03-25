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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { sortable } from 'react-sortable';

import AddMoreItem from './AddMoreItem';
import EmailSubjectItem from './EmailSubjectItem';

const SortableListItem = sortable(EmailSubjectItem);

/**
 * Sortable draggable subject variables.
 */
export default class EmailSubjectEditor extends PureComponent {
  static propTypes = {
    subject: PropTypes.string,

    /** List of variables availables */
    variables: PropTypes.array,

    onSave: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,
    strings: PropTypes.object
  };

  static defaultProps = {
    variables: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      draggingIndex: null,
      data: this.parseSubjectToArray(props.subject)
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.subject !== nextProps.subject) {
      this.setState({
        data: this.parseSubjectToArray(nextProps.subject),
      });
    }
  }

  // Converts Subject string to an array with variables
  parseSubjectToArray(string = '') {
    let nList = string.split(/(\[\[[^\s[]+\]\])/g);
    // Remove spaces
    nList = nList.filter((item) => (item.trim()));

    return nList.map((item) => {
      const type = item.startsWith('[[') ? 'variable' : 'custom';

      const parseVariable = item.replace(/([[\]])\W+/g, '');
      return {
        type: type,
        name: type !== 'custom' ? parseVariable : item.trim(),
        variable: type === 'variable' ? item : ''
      };
    });
  }

  /*
   * Converts subject arrays to a plain text with the variables
   */
  parseArrayToSubject(arrayList) {
    const nList = arrayList.map((item) => {
      let tmpItem = item.name;
      if (item.type === 'variable') tmpItem = '[[' + item.name + ']]';
      return tmpItem;
    });

    let tmpList = '';

    // Custom join to avoid spaces before some specific characters
    if (nList.length) {
      tmpList = nList.reduce((p, d) => {
        const space = ['.', ',', ':', ';', '!', '"', '?'].includes(d.trim().charAt(0)) ? '' : ' ';
        return p + space + d.trim();
      });
    }

    return tmpList;
  }

  updateState(obj) {
    this.setState(obj);
    this.handleSave();
  }

  handleAdd(e, context) {
    e.preventDefault();
    const subject = Object.assign([], this.state.data);

    subject.splice(context.sortId + 1, 0, {
      type: 'custom',
      name: ' ',
      variable: ''
    }); // Default create a custom input
    this.setState({ data: subject });
  }

  handleRemove(e, context) {
    e.preventDefault();
    let subject = this.state.data;
    subject = subject.filter((x, i) => i !== context.sortId);
    this.setState({ data: subject });

    if (typeof this.props.onSave === 'function') {
      const plainSubject = this.parseArrayToSubject(subject);
      this.props.onSave(plainSubject);
    }
    //this.handleSave();
  }

  handleReplaceVariable(prevItem, newVariable) {
    const subject = Object.assign([], this.state.data);
    switch (newVariable.type) {
      case 'custom':
        subject[prevItem.sortId].name = ' ';
        subject[prevItem.sortId].variable = '';
        subject[prevItem.sortId].type = newVariable.type;
        break;
      case 'space':
        subject[prevItem.sortId].name = newVariable.name;
        subject[prevItem.sortId].variable = '';
        subject[prevItem.sortId].type = newVariable.type;
        break;
      case 'variable':
        subject[prevItem.sortId].name = newVariable.name;
        subject[prevItem.sortId].variable = '[[' + newVariable.name + ']]';
        subject[prevItem.sortId].type = newVariable.type;
        break;
      default:
        break;
    }
    this.setState({ data: subject });
    this.handleSave();
  }

  handleCustomTextChange(prevItem, newText) {
    const subject = Object.assign([], this.state.data);
    subject[prevItem.sortId].name = newText;
    this.setState({ data: subject });
  }

  handleSave() {
    const isSubjectChanged = this.parseArrayToSubject(this.state.data) !== this.props.subject;

    if (typeof this.props.onSave === 'function' && isSubjectChanged) {
      const plainSubject = this.parseArrayToSubject(this.state.data);
      this.props.onSave(plainSubject);
    }
  }

  render() {
    let listItems = this.state.data.map((item, i) => (
      <SortableListItem
        key={i}
        horizontal
        draggable
        updateState={this.updateState}
        items={this.state.data}
        draggingIndex={this.state.draggingIndex}
        sortId={i}
        outline="list"
        childProps={{
          draggingIndex: this.state.draggingIndex,
          sortId: i,
          type: item.type,
          name: item.name,
          variable: item.variable,
          items: this.state.data,
          strings: this.props.strings,
          variables: this.props.variables,
          updateState: this.updateState,
          onAdd: this.handleAdd,
          onRemove: this.handleRemove,
          onReplaceVariable: this.handleReplaceVariable,
          onCustomTextChange: this.handleCustomTextChange,
          onCustomTextBlur: this.handleSave,
        }}
      />
    ));

    if (!this.state.data.length) {
      listItems = (
        <AddMoreItem
          sortId={0}
          onAdd={this.handleAdd}
          style={{ left: '2rem' }}
        />
      );
    }

    return (
      <div>{listItems}</div>
    );
  }
}
