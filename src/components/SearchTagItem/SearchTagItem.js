// Copyright 2018 BigTinCan Mobile Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import autobind from 'class-autobind';

export default class SearchTagItem extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleTagClick() {
    const { onClick } = this.props;
    if (onClick && typeof onClick === 'function') {
      onClick(this.props);
    }
  }

  render() {
    const { name } = this.props;
    const style = require('./SearchTagItem.less');
    return <div className={style.tagItem} onClick={this.handleTagClick}>{name}</div>;
  }
}
