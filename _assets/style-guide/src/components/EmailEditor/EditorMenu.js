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
import classNames from 'classnames/bind';

import DropMenu from 'components/DropMenu/DropMenu';

class EditorMenuItem extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    selected: false
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e, this.props);
    }
  }

  render() {
    const {
      id,
      name,
      selected,
      className,
      style
    } = this.props;
    const styles = require('./EditorMenu.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      EditorMenuItem: true,
      selected: selected,
    }, className);

    return (
      <div
        key={id} aria-label={name} title={name}
        className={itemClasses} style={style} onClick={this.handleClick}
      >
        {name}
      </div>
    );
  }
}

class VariableItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    hasChildren: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.string
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e, this.props);
    }
  }

  render() {
    const {
      name,
      strings,
      hasChildren,
    } = this.props;
    const styles = require('./EditorMenu.less');

    const cx = classNames.bind(styles);
    const classes = cx({
      VariableItem: true,
      functionHeader: hasChildren
    }, this.props.className);

    return (
      <div
        aria-label={strings[name] || name} title={strings[name] || name} className={classes}
        onClick={this.handleClick}
      >
        {strings[name] || name}
      </div>
    );
  }
}

/**
 * A list of links.
 */
export default class EditorMenu extends PureComponent {
  static propTypes = {
    /** Array of menu items with <code>name</code>, <code>url</code> and <code>icon</code> attributes */
    list: PropTypes.array,

    /** Array of variables available to insert in the HTML */
    variables: PropTypes.array,

    /** Array of conditionals and foreach functions available to insert in the HTML */
    functions: PropTypes.array,

    /** menu item to set as selected */
    selected: PropTypes.string,

    onItemClick: PropTypes.func.isRequired,
    onVariableClick: PropTypes.func,
    showHelpLink: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object,
    strings: PropTypes.object
  };

  static defaultProps = {
    list: [],
    functions: [],
    variables: [],
    strings: {
      insertVariables: 'Insert Variables'
    }
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleAnchorClick(e) {
    if (typeof this.props.onAnchorClick === 'function') {
      this.props.onAnchorClick(e);
    }
  }

  renderMenuList(list, header) {
    const styles = require('./EditorMenu.less');
    return (<div>
      {header && <div className={styles.subheader} onClick={this.handleClick}>{header}</div>}
      {list.length > 0 && <div className={styles.VariableList}>
        {list.map((opt, ind) => (
          <div className={styles.VariableItemWrapper + ' ' + styles[opt.type]} key={opt.id}>
            <VariableItem
              strings={this.props.strings}
              name={opt.id}
              type={opt.type}
              hasChildren={opt.children && opt.children.length > 0}
              onClick={this.props.onVariableClick}
            />
            {(opt.type === 'loop' || opt.type === 'innerloop') && opt.children && opt.children.length > 0 &&
              <div className={styles.functionItems}>
                {opt.children.map(subItem => (
                  <VariableItem
                    key={subItem}
                    strings={this.props.strings}
                    name={subItem}
                    type="variable"
                    onClick={this.props.onVariableClick}
                  />
                ))}
                {list.length - 1 > ind && <hr className={styles.divider} />}
              </div>
            }
          </div>
        ))}
      </div>}
    </div>);
  }

  render() {
    const {
      list,
      selected,
      functions,
      variables,
      onItemClick,
      strings,
    } = this.props;
    const styles = require('./EditorMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      EditorMenu: true,
    }, this.props.className);

    return (
      <nav className={classes} style={this.props.style}>
        {this.props.showHelpLink && <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://get.foundation/emails/docs/inky.html"
          className={styles.helpLink}
          onClick={this.handleAnchorClick}
        >
          {strings.inkyFormattingDoc}
        </a>}

        <ul>
          {list.map(opt => (
            <li key={opt.id}>
              <EditorMenuItem
                {...opt}
                selected={opt.id === selected}
                onClick={onItemClick}
              />
            </li>
          ))}
        </ul>

        {(variables.length || functions.length) > 0 && <ul className={styles.actions}>
          <li>
            <DropMenu
              heading={strings.insertVariables}
              button
              style={{ cursor: 'pointer' }}
              className={styles.dropMenuCustom}
            >
              <div className={styles.menuWrapper}>
                {functions.length > 0 &&
                this.renderMenuList(
                  functions,
                  variables.length > 0 ? strings.functions : '',
                  'function'
                )}

                {variables.length > 0 &&
                this.renderMenuList(
                  variables,
                  functions.length > 0 ? strings.variables : '',
                  'variable'
                )}
              </div>
            </DropMenu>
          </li>
        </ul>}
      </nav>
    );
  }
}
