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
 * @author Lochlan McBride <lmcbride@bigtincan.com>
 */

// Returns true if a file should be marked as 'internal' in Block Search results
export default function isFileInternal(file) {
  const blockedFile = file.shareStatus === 'blocked';
  const internalFile = !!(file.tags && file.tags.length && file.tags.find(t => t.name === 'internal'));
  return blockedFile || internalFile;
}
