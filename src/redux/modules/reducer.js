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

import { combineReducers } from 'redux';

import chat from 'redux/modules/chat/reducer';

import auth from './auth';
import settings from './settings';
import intlReducer from './intl';

import browser from './browser';
import entities from './entities/entities';
import interactions from './interactions';
import prompts from './prompts';

import activity from './activity';
import calendar from './calendar';
import archive from './archive';
import company from './company';
import content from './content';
import forms from './forms';
import me from './me';
import people from './people';
import promote from './story/promote';
import search from './search';
import share from './share';
import user from './user';
import userSettings from './userSettings';

import publicShare from './publicShare';
import jsbridge from './jsbridge/jsbridge';
import form from './form';
import note from './note';
import story from './story/story';
import viewer from './viewer';

// Admin reducer
import admin from './admin/admin';

//tag reducer
import tag from './tag';

//Super search

import supersearch from './supersearch';

import canvas from './canvas/canvas';

import pagesearch from './pageSearch';

import channelShare from './channelShare';

const appReducer = combineReducers({
  activity,
  archive,
  auth,
  browser,
  calendar,
  chat,
  company,
  content,
  entities,
  form,
  forms,
  interactions,
  intl: intlReducer,
  jsbridge,
  me,
  note,
  people,
  promote,
  prompts,
  publicShare,
  search,
  settings,
  share,
  story,
  user,
  userSettings,
  viewer,

  admin,
  tag,
  channelShare,

  supersearch,
  canvas,
  pagesearch
});

// http://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
export default (state, action) => {
  if (action.type === 'auth/LOGOUT') {
    const { intl } = state;
    state = { intl }; // eslint-disable-line
  }
  return appReducer(state, action);
};
