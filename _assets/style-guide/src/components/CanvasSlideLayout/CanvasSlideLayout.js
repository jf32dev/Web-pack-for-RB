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

import { FormattedMessage } from 'react-intl';

import Btn from 'components/Btn/Btn';
import Text from 'components/Text/Text';

import CanvasSlideThumb from 'components/CanvasSlideThumb/CanvasSlideThumb';
import CanvasSlideTemplate from 'components/CanvasSlideTemplate/CanvasSlideTemplate';

/**
 * CanvasSlideLayout shows a slide preview with:
 * - slide delete
 * - title input
 * - available layouts
 */
export default class CanvasSlideLayout extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /** Slide object (blocks will be ignored) */
    slide: PropTypes.object,

    /** Array of blocks (slide should be null) */
    blocks: PropTypes.array,

    /** Full page slide -- cannot set title/template or be toggled to a block */
    fullPage: PropTypes.bool,

    /** Show a block as a full page instead of a block */
    showAsFullPage: PropTypes.bool,

    /** Slide title text */
    title: PropTypes.string,

    /** Selected blocks that haven't been merged to slide yet */
    activeBlocks: PropTypes.array,

    /** Valid slide template name */
    template: PropTypes.oneOf([
      'one-col',
      'one-col-title',
      'two-col',
      'two-col-title',
      'three-col',
      'three-col-title',
      'three-row',
    ]).isRequired,

    /** Array of valid templates that can be selected */
    validTemplates: PropTypes.array.isRequired,

    // block select mode is active
    selectBlockMode: PropTypes.bool,

    strings: PropTypes.object,

    onChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    slide: {},
    activeBlocks: [],
    blocks: [],
    showAsFullPage: false,
    title: '',
    template: 'one-col-title',
    strings: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      showTitleEdit: props.title.length > 0,
    };

    this.titleEditInput = null;
    this.focusTimeout = null;

    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({
        showTitleEdit: nextProps.title.length > 0,
      });
    }

    if (nextProps.selectBlockMode && nextProps.activeBlocks.length && nextProps.activeBlocks.length !== this.props.activeBlocks.length) {
      this.autoSelectTemplate(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
    }
  }

  autoSelectTemplate({ id, activeBlocks, title }) {
    let newTemplate = '';

    switch (activeBlocks.length) {
      case 1:
        newTemplate = 'one-col';
        break;
      case 2:
        newTemplate = 'two-col';
        break;
      case 3:
        newTemplate = 'three-col';
        break;
      default:
        break;
    }

    if (title) {
      newTemplate += '-title';
    }

    this.props.onChange({
      id: id,
      template: newTemplate
    });
  }

  handleToggleTitleClick() {
    const newVal = !this.state.showTitleEdit;

    this.setState({
      showTitleEdit: newVal
    });

    // focus input when visible
    if (newVal) {
      this.focusTimeout = setTimeout(() => {
        this.titleEditInput.focus();
      }, 50);

    // clear title value
    } else {
      let newTemplate = this.props.template;

      // Add/remove title template
      if (newTemplate.indexOf('-title') > -1) {
        newTemplate = newTemplate.replace('-title', '');
      }

      this.props.onChange({
        id: this.props.id,
        title: '',
        template: newTemplate,
      });
    }
  }

  handleTitleChange(event) {
    const newTitle = event.currentTarget.value;
    let newTemplate = this.props.template;

    // Add/remove title template
    if (newTitle.length && newTemplate.indexOf('-title') === -1) {
      newTemplate += '-title';
    } else if (!newTitle.length && newTemplate.indexOf('-title') > -1) {
      newTemplate = newTemplate.replace('-title', '');
    }

    this.props.onChange({
      id: this.props.id,
      title: newTitle,
      template: newTemplate
    });
  }

  handleTemplateClick(template) {
    this.props.onChange({
      id: this.props.id,
      template: template
    });
  }

  render() {
    const {
      id,
      activeBlocks,
      blocks,
      slide,
      fullPage,
      showAsFullPage,
      title,
      template,
      selectBlockMode,
      validTemplates,
      strings,
    } = this.props;
    const { showTitleEdit } = this.state;
    const styles = require('./CanvasSlideLayout.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      CanvasSlideLayout: true
    }, this.props.className);

    const isEmpty = !id;

    const slideClasses = cx({
      slideWrapper: true,
      isEmpty: isEmpty,
      // hasMultiple: activeBlocks.length > 0,
      // hasMax: activeBlocks.length > 2,
    }, this.props.className);

    const slideTitleClasses = cx({
      slideTitle: true,
      isEdit: showTitleEdit
    }, this.props.className);

    const isSlide = fullPage || showAsFullPage;
    // const hasLayouts = !isSlide && (blocks.length > 0 && !activeBlocks.length);
    const hasLayouts = !isSlide && selectBlockMode;

    // Number of blocks that will be combined/separated
    let selectedBlocks = 0;
    if (blocks.length && !activeBlocks.length) {
      selectedBlocks = 1;
    } else if (blocks.length && activeBlocks.length) {
      selectedBlocks = activeBlocks.length;
    }

    return (
      <div className={classes} style={this.props.style}>
        <header>
          {(isEmpty && !selectBlockMode) && <h5>&nbsp;</h5>}
          {(!isEmpty && !selectBlockMode) && <h5>{isSlide ? strings.page : strings.block}</h5>}
          {selectBlockMode && <FormattedMessage
            id="n-blocks-selected"
            defaultMessage="{itemCount, plural, one {# Block} other {# Blocks}} Selected"
            values={{ itemCount: selectedBlocks }}
            tagName="h5"
          />}
        </header>

        <div className={slideClasses}>
          {!isEmpty && <CanvasSlideThumb
            id={id}
            title={title}
            slide={slide}
            blocks={activeBlocks}
            template={template}
            fullPage={fullPage}
            showAsFullPage={showAsFullPage}
            showBlockCount={false}
            isEdit
            strings={strings}
            className={styles.slidePreview}
          />}
          {isEmpty && <div className={styles.emptyMessage}>
            <p>{strings.emptySlideLayoutMessage}</p>
          </div>}
        </div>

        <Fragment>
          {(!isEmpty && !isSlide && selectBlockMode) && <div className={slideTitleClasses}>
            <Btn
              borderless
              onClick={this.handleToggleTitleClick}
            >
              {strings.addTitle}
            </Btn>

            <div className={styles.titleEditInput}>
              <header>
                <h5>
                  <label htmlFor="title">{strings.title}</label>
                </h5>

                <Btn
                  borderless
                  small
                  onClick={this.handleToggleTitleClick}
                >
                  {strings.remove}
                </Btn>
              </header>

              <Text
                ref={(c) => { this.titleEditInput = c; }}
                id="title"
                placeholder={`${strings.addTitle}...`}
                value={title}
                onClearClick={this.handleTitleClearClick}
                onChange={this.handleTitleChange}
              />
            </div>
          </div>}

          {hasLayouts && <div className={styles.slideLayouts}>
            <header>
              <h5>{strings.layoutTemplates}</h5>
            </header>

            {isEmpty && <p>{strings.emptyLayoutsMessage}</p>}

            {!isEmpty && <ul>
              {validTemplates.map(t => (
                <CanvasSlideTemplate
                  key={t.id}
                  template={t.name}
                  selected={t.name === template}
                  tagName="li"
                  onClick={() => this.handleTemplateClick(t.name)}
                />
              ))}
            </ul>}
          </div>}
        </Fragment>
      </div>
    );
  }
}
