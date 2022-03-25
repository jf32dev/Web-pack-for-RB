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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import { combineReducers } from 'redux';

import templateEditor from 'redux/modules/templateEditor';
import education from './education';
import emails from './emails';
import emailTemplates from './emailTemplates';
import filesGeneral from './filesGeneral';
import filesDefaults from './filesDefaults';
import gamification from './gamification';
import general from './general';
import security from './security';
import stories from './stories';
import structure from './structure';
import homeScreens from './homeScreens';
import files from './files';
import userMetadata from './userMetadata';
import crmIntegration from './crmIntegration';
import oAuth from './oAuth';
import namingConvention from './namingConvention';
import bulkUserImport from './bulkUserImport';
import contentRecommender from './contentRecommender';

export default combineReducers({
  education,
  emails,
  emailTemplates,
  filesGeneral,
  filesDefaults,
  gamification,
  general,
  security,
  stories,
  structure,
  homeScreens,
  templateEditor,
  userMetadata,
  crmIntegration,
  namingConvention,
  oAuth,
  files,
  bulkUserImport,
  contentRecommender
});
