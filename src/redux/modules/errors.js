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

export function testForbiddenAction() {
  return {
    types: [null, null, null],
    promise: (client) => client.get('/errors/forbiddenAction', 'webapi')
  };
}

export function testServerError() {
  return {
    types: [null, null, null],
    promise: (client) => client.get('/errors/serverError', 'webapi')
  };
}

export function testValidationErrors() {
  return {
    types: [null, null, null],
    promise: (client) => client.get('/errors/validationErrors', 'webapi')
  };
}
