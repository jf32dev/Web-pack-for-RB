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

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import camelCase from 'lodash/camelCase';

import isFileInternal from 'helpers/isFileInternal';

import Btn from 'components/Btn/Btn';
import Icon from 'components/Icon/Icon';
import Loader from 'components/Loader/Loader';

import { FormattedMessage } from 'react-intl';

function BlockText(props) {
  const textLength = props.text.length;

  let Elem = 'p';
  if (textLength <= 100 && textLength > 50) {
    Elem = 'h4';
  } else if (textLength <= 50 && textLength > 25) {
    Elem = 'h3';
  } else if (textLength <= 25) {
    Elem = 'h2';
  }

  return (
    <div className={props.styles.blockText}>
      <Elem>{props.text}</Elem>
    </div>
  );
}

function BlockThumb(props) {
  const isLoading = !props.thumbnail;
  const url = `${props.thumbnail}${props.authString}`;

  return (
    <div
      className={props.styles.blockImage}
      style={{ backgroundImage: !isLoading ? `url(${url})` : undefined }}
    >
      {isLoading && <Loader type="content" className={props.styles.thumbLoader} />}
    </div>
  );
}

/**
 * Displays a thumbnail for a Canvas slide.
 */
export default class CanvasSlideThumb extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

    /** Slide object (blocks will be ignored) */
    slide: PropTypes.object,

    /** Array of blocks (slide should be null) */
    blocks: PropTypes.array,

    /** Slide number */
    count: PropTypes.number,

    /** Slide title text */
    title: PropTypes.string,

    /** Valid slide template name */
    template: PropTypes.string,

    /** Slide has been clicked on */
    active: PropTypes.bool,

    /** Selected blocks that haven't been merged to slide yet */
    activeBlocks: PropTypes.array,

    /** Interactions are disabled and block styling is adjusted */
    disabled: PropTypes.bool,

    /** Show number of blocks */
    showBlockCount: PropTypes.bool,

    /** Show number of full page */
    showAsFullPage: PropTypes.bool,

    /** Show actions above preview */
    showActions: PropTypes.bool,

    /** Full page */
    fullPage: PropTypes.bool,

    /** Apply alternate styling when editing layout */
    isEdit: PropTypes.bool,

    tagName: PropTypes.string,

    strings: PropTypes.object,

    onDeleteClick: PropTypes.func,
    onSeparateClick: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    slide: {},
    activeBlocks: [],
    blocks: [],
    title: '',
    template: 'one-col-title',
    active: false,
    showBlockCount: true,
    tagName: 'div',
    strings: {},
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleConvertTypeClick(e) {
    e.stopPropagation();

    const showAsFullPage = !this.props.showAsFullPage;
    this.props.onChange({
      id: this.props.id,
      showAsFullPage: showAsFullPage,
      template: showAsFullPage ? 'one-col' : 'one-col-title'
    });
  }

  render() {
    const { authString } = this.context.settings;
    const {
      id,
      slide,
      title,
      blocks,
      count,
      active,
      template,
      // activeBlocks,
      disabled,
      showBlockCount,
      showAsFullPage,
      showActions,
      fullPage,
      isEdit,
      strings,
      onClick,
    } = this.props;
    const styles = require('./CanvasSlideThumb.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      CanvasSlideThumb: true,
      isActive: active,
      isDisabled: disabled,
      isEdit: isEdit,
    }, this.props.className);
    const slideClasses = cx({
      slide: true,
      [camelCase(template)]: true,
    });

    const TagName = this.props.tagName;
    const isSlide = !blocks.length || fullPage;

    // Action buttons
    const showDelete = showActions && active;
    const showConvert = showActions && active && !fullPage && blocks.length < 2;
    const showSeparate = showActions && active && blocks.length > 1;

    let blockContent = null;
    let backgroundImage = null;
    let internal = false;
    let isLoading = false;

    // Single Slide
    if (isSlide) {
      let slideThumbmail = slide.thumbnail || (blocks[0] && (blocks[0].thumbnail || blocks[0].thumbnailUrl));
      isLoading = !slideThumbmail;
      if (authString && slideThumbmail) {
        slideThumbmail += authString.indexOf('access_token') > -1 ? authString : `&access_token=${authString}`;
      }
      backgroundImage = `url(${slideThumbmail})`;

      // Show Internal indicator
      if ((blocks && blocks[0] && blocks[0].file) || slide.file) {
        internal = isFileInternal(blocks[0].file || slide.file);
      }

    // Blocks
    } else {
      const hasTitle = template.indexOf('-title') > -1;

      switch (template) {
        case 'two-col':
        case 'two-col-title': {
          blockContent = (<Fragment>
            {hasTitle && <div className={styles.title}>{title}&nbsp;</div>}
            <div className={styles.row}>
              {blocks.map((block, i) => (
                <div key={i} className={styles.col}>
                  {!block && <div className={styles.blockEmpty} />}
                  {(block && block.type === 'image') && <BlockThumb {...block} authString={authString} styles={styles} />}
                  {(block && block.type === 'text') && <BlockText {...block} styles={styles} />}
                  {(isFileInternal(block.file) && <div className={styles.internalNote}>
                    <Icon name="warning" />
                  </div>)}
                </div>
              ))}
            </div>
          </Fragment>);
          break;
        }
        case 'three-col':
        case 'three-col-title': {
          blockContent = (<Fragment>
            {hasTitle && <div className={styles.title}>{title}&nbsp;</div>}
            <div className={styles.row}>
              {blocks.map((block, i) => (
                <div key={i} className={styles.col}>
                  {(block && block.type === 'image') && <BlockThumb {...block} authString={authString} styles={styles} />}
                  {block.type === 'text' && <BlockText {...block} styles={styles} />}
                  {(isFileInternal(block.file) && <div className={styles.internalNote}>
                    <Icon name="warning" />
                  </div>)}
                </div>
              ))}
            </div>
          </Fragment>);
          break;
        }
        case 'three-row': {
          blockContent = (<Fragment>
            {blocks.map((block, i) => (
              <div key={i} className={styles.row}>
                {(block && block.type === 'image') && <BlockThumb {...block} authString={authString} styles={styles} />}
                {block.type === 'text' && <BlockText {...block} styles={styles} />}
                {(isFileInternal(block.file) && <div className={styles.internalNote}>
                  <Icon name="warning" />
                </div>)}
              </div>
            ))}
          </Fragment>);
          break;
        }
        // one-col, one-col-title
        default: {
          blockContent = (<Fragment>
            {hasTitle && <div className={styles.title}>{title}&nbsp;</div>}
            {blocks.map((block, i) => (
              <div key={i} className={styles.col}>
                {!block && <div className={styles.blockEmpty} />}
                {(block && block.type === 'image') && <BlockThumb {...block} authString={authString} styles={styles} />}
                {(block && block.type === 'text') && <BlockText {...block} styles={styles} />}
                {(isFileInternal(block.file) && <div className={styles.internalNote}>
                  <Icon name="warning" />
                  <span>{strings.internalOnly}</span>
                </div>)}
              </div>
            ))}
          </Fragment>);
          break;
        }
      }
    }

    return (
      <TagName
        data-id={id}
        onClick={onClick}
        className={classes}
      >
        {showActions && <div className={styles.actions}>
          {showConvert && <Btn inverted onClick={this.handleConvertTypeClick}>
            {showAsFullPage ? strings.convertToBlock : strings.convertToPage}
          </Btn>}
          {showSeparate && <Btn inverted onClick={this.props.onSeparateClick}>{strings.separateBlocks}</Btn>}
          {showDelete && <Btn icon="trash" inverted onClick={this.props.onDeleteClick} />}
        </div>}

        <div
          className={slideClasses}
          style={{
            backgroundImage: backgroundImage
          }}
        >
          {isSlide && isLoading && <Loader type="content" style={{ margin: 'auto' }} />}
          {isSlide && internal && <div className={styles.internalNote}>
            <Icon name="warning" />
            <span>{strings.internalOnly}</span>
          </div>}
          {!isSlide && blockContent}
        </div>

        {count && <div className={styles.meta}>
          {(!isSlide && showBlockCount && !showAsFullPage) && <div className={styles.blockCount}>
            <FormattedMessage
              id="n-blocks"
              defaultMessage="{itemCount, plural, one {Block} other {# Blocks}}"
              values={{ itemCount: blocks.length }}
            />
          </div>}
          <div className={styles.count}>{count}</div>
        </div>}
      </TagName>
    );
  }
}
