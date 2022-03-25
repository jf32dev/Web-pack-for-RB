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
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import Icon from 'components/Icon/Icon';
import Text from 'components/Text/Text';

class FoundItem extends Component {
  static propTypes = {
    number: PropTypes.number,
    title: PropTypes.string,
    matches: PropTypes.array,
    query: PropTypes.string,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleTitleClick(event) {
    this.props.onClick(event, this.props.number);
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const { query, title, contents } = this.props;
    const styles = require('./PdfFind.less');

    const re = new RegExp('((?=\\b).{1,50}?' + query + '.{1,10}\\b)', 'ig');
    const matches = contents.match(re);

    let text = matches && matches[0] || '';

    text = text.replace(new RegExp('(' + query + ')', 'ig'), '<span style="font-weight:bold">$1</span>') + '...  ';

    return (
      <li className={styles.FoundItem} onClick={this.handleTitleClick}>
        <span className={styles.FoundTitle}>{title}</span><br />
        <span dangerouslySetInnerHTML={{ __html: text }} />
      </li>
    );
  }
}

/**
 * Displays a PDF.js Find Controller
 */
export default class PdfFind extends Component {
  static propTypes = {
    /** valid PDF.js object */
    pdf: PropTypes.object,

    /** Text input placeholder */
    placeholder: PropTypes.string.isRequired,

    /** Text input initial value */
    query: PropTypes.string,

    results: PropTypes.array,
    contents: PropTypes.array,

    strings: PropTypes.object,

    onQueryChange: PropTypes.func.isRequired,

    onPageClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    results: [],
    contents: [],
    strings: {
      enterSearch: 'Enter Search',
      foundIn: 'Found in',
      Page: 'Page',
      pages: 'page(s)',
      startMsg: 'Search for a word or phrase',
      notFound: 'Not found'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleQueryChange(event) {
    this.props.onQueryChange(event.target.value);
  }

  handleClearClick() {
    this.props.onQueryChange('');
  }

  render() {
    const { contents, results, placeholder, query, strings } = this.props;
    const styles = require('./PdfFind.less');
    const output = [];

    results.forEach((page, p) => {
      const item = page;
      if (item === 0) {
        output.push(this.props.strings.notFound);
      } else if (item.length > 0) {
        output.push(<FoundItem
          number={p + 1}
          key={'o-' + p}
          title={strings.Page + ' ' + (p + 1)}
          query={query}
          matches={item}
          contents={contents[p]}
          onClick={this.props.onPageClick}
        />);
      }
    });

    return (
      <div className={styles.PdfFind}>
        <div className={styles.PdfFindBox}>
          <Text
            icon="search"
            placeholder={placeholder}
            value={query || ''}
            showClear
            onChange={this.handleQueryChange}
            onClearClick={this.handleClearClick}
          />
        </div>
        <ul className={styles.PdfFoundList}>
          {output}
        </ul>
        {(!query || query.length < 2) &&
        <div className={styles.PdfStartSearchMsg}>
          <Icon name="search" size={48} className={styles.PdfSearchIcon} />
          <p>{strings.startMsg}</p>
        </div>}
      </div>
    );
  }
}
