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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _get from 'lodash/get';
import _has from 'lodash/has';

export const convertObjFromServer = (serverObj, format) =>
  Object.keys(format).reduce((accumulator, key) => (!_has(serverObj, format[key]) ? accumulator : {
    ...accumulator,
    [key]: _get(serverObj, format[key], '')
  }), {});

export const pipe = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

//export const compose = (...fns) => pipe(...fns.reverse());
