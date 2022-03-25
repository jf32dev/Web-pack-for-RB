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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

export default function generateStrings(messages = {}, formatMessage, values = {}) {
  const strings = {};

  // Return empty object if not messages provided
  if (!messages) {
    console.warn('messages not provided');  // eslint-disable-line
    return strings;
  }

  // Warn if formatMessage function is not provided
  if (!formatMessage) {
    console.warn('formatMessage function not provided');  // eslint-disable-line
  }

  for (const key of Object.keys(messages)) {
    // Provide defaultMessage
    if (!formatMessage) {
      strings[key] = messages[key].defaultMessage;

    // Format messages to locale
    } else {
      strings[key] = formatMessage(messages[key], values);
    }
  }
  return strings;
}
