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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */
import uniqueId from 'lodash/uniqueId';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadBadges,
  resetBadges,
  saveBadges,
  setData,
} from 'redux/modules/admin/gamification';
import { createPrompt } from 'redux/modules/prompts';

import AdminBadgeSelector from 'components/Admin/AdminBadgeSelector/AdminBadgeSelector';
import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';

const listType = 'content';
const messages = defineMessages({
  contentBadges: { id: 'content-badges', defaultMessage: 'Content Badges' },
  error: { id: 'error', defaultMessage: 'Error' },
  reload: { id: 'reload', defaultMessage: 'Reload' },
  processing: { id: 'processing', defaultMessage: 'Processing' },
  done: { id: 'done', defaultMessage: 'Done' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
  titleIsRequired: { id: 'title-is-required', defaultMessage: 'Title is Required' },
});

function mapStateToProps(state) {
  const { gamification } = state.admin;
  const colorList = gamification.contentBadges.map(obj => obj.colour);
  const valueList = gamification.contentBadges.map(obj => obj.max);
  valueList.pop();// remove 100 from array

  return {
    minimum: gamification.contentBadgesMin,
    maximum: gamification.contentBadgesMax,
    badgeLoaded: gamification.badgeLoaded,
    badgeLoading: gamification.badgeLoading,
    badgeError: gamification.badgeError,
    isResetLoading: gamification.isContentResetBadgeLoading,

    list: gamification.contentBadges,
    colorList: colorList,
    valueList: valueList
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    loadBadges,
    resetBadges,
    saveBadges,
    setData,
  })
)
export default class AdminContentBadges extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      badgeLoading,
      badgeError,
    } = this.props;

    if (!badgeLoading && !badgeError) {
      this.props.loadBadges(listType);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { badgeError } = nextProps;

    const prevError = this.props.badgeError ? this.props.badgeError.message : '';
    if (badgeError && badgeError.message && (badgeError.message !== prevError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: badgeError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleRangeChange(nList) {
    this.props.setData({ contentBadges: nList });
  }

  handleAfterChange() {
    this.props.saveBadges(listType, this.props.list);
  }

  handleTitleChange(event, context) {
    const nList = Object.assign([], this.props.list);
    nList[context.index].title = event.currentTarget.value;
    this.props.setData({ contentBadges: nList });
  }

  handleTitleBlur(context) {
    // Disable item if title is empty
    const nList = Object.assign([], this.props.list);
    if (!nList[context.index].title) {
      nList[context.index].enabled = !nList[context.index].enabled;
      this.props.setData({ contentBadges: nList });
    }

    if (nList[context.index].title && nList[context.index].colour) {
      this.props.saveBadges(listType, this.props.list);
    }
  }

  handleColorChange(colour, context) {
    const nList = Object.assign([], this.props.list);
    nList[context.index].colour = colour;
    this.props.setData({ contentBadges: nList });

    if (nList[context.index].title && nList[context.index].colour) {
      this.props.saveBadges(listType, this.props.list);
    }
  }

  handleToggleEnable(event, context) {
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);
    const nList = Object.assign([], this.props.list);
    nList[context.index].enabled = event.currentTarget.checked;

    this.props.setData({ contentBadges: nList });

    if (event.currentTarget.checked && !nList[context.index].title) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: strings.titleIsRequired,
        dismissible: true,
        autoDismiss: 5
      });
    } else {
      this.props.saveBadges(listType, this.props.list);
    }
  }

  handleDelete(event, context) {
    const fList = Object.assign([], this.props.list);

    // If not First item assign max value to prev item
    if (context.index) {
      fList[context.index - 1].max = (context.index + 1 !== fList.length) ? fList[context.index].max - 1 : 100;
    }

    // If not Last item assign min value to next item
    if (context.index + 1 !== fList.length) {
      fList[context.index + 1].min = context.index ? fList[context.index].max : 0;
    }

    // Remove item
    const nList = fList.filter((n, i) => i !== context.index);
    this.props.setData({ contentBadges: nList });
    this.props.saveBadges(listType, nList);
  }

  handleAddBadge(newBadge) {
    let nList = Object.assign([], this.props.list);
    const rList = Object.assign([], this.props.list).reverse();
    // Update ranges
    const lastIndex = nList.length - 1;
    const lastItem = Object.assign({}, nList[lastIndex]);

    if (lastItem.min >= lastItem.max - 2) { // = 99
      // Needs to check that values won't overlap
      const tmpRList = rList.map(function(o, i) {
        const obj = o;
        if (!i) { // Last Item
          obj.max = lastItem.max - 2;
          obj.min = lastItem.min - 2;
        } else if (obj.min) {
          // Check other ranges but first item
          if (obj.max >= rList[i - 1].min) {
            obj.max = rList[i - 1].min - 1;
          }
          if (obj.min >= obj.max) {
            obj.min = obj.max - 1;
          }
        }
        return obj;
      });
      nList = Object.assign([], tmpRList).reverse();
    } else {
      // Only update last item
      nList[lastIndex].max = lastItem.max - 2;
    }

    this.props.setData({ contentBadges: [...nList, newBadge] });
  }

  handleReset() {
    this.props.resetBadges(listType);
  }

  render() {
    const {
      list,
      valueList,
      colorList,
      badgeLoaded,
      badgeError,
      className,
      style,
    } = this.props;
    const { formatMessage } = this.context.intl;
    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Loading
    if (!badgeLoaded && !badgeError) {
      return <Loader type="page" />;

      // Error
    } else if (badgeError && !badgeLoaded) {
      return (
        <Blankslate
          icon="error"
          heading={strings.error}
          message={badgeError.message}
          middle
        >
          <Btn onClick={() => this.props.loadBadges(listType)}>{strings.reload}</Btn>
        </Blankslate>
      );
    }
    if (!list || !list.length) {
      return (
        <Blankslate
          icon="content"
          heading={strings.noResults}
          middle
        />
      );
    }

    let disableAdd = false;
    if (this.props.list.filter(obj => (!obj.title || !obj.colour) && obj.enabled).length) disableAdd = true;

    return (
      <div className={className} style={style}>
        <AdminBadgeSelector
          list={list}
          values={valueList}
          colors={colorList}
          minValue={0}
          maxValue={100}
          minBars={this.props.minimum}
          maxBars={this.props.maximum}
          titleMaxLength={20}
          onRangeChange={this.handleRangeChange}
          onAfterChange={this.handleAfterChange}
          onColorChange={this.handleColorChange}
          onTitleChange={this.handleTitleChange}
          onTitleBlur={this.handleTitleBlur}
          onToggleEnable={this.handleToggleEnable}
          onDelete={this.handleDelete}
          showAdd
          header={strings.contentBadges}
          showReset
          isResetLoading={this.props.isResetLoading}
          onResetClick={this.handleReset}
          disableAdd={disableAdd}
          onAddClick={this.handleAddBadge}
        />
      </div>
    );
  }
}
