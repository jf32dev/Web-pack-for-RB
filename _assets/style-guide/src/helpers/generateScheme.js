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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import tinycolor from 'tinycolor2';

/**
 * Generate colour scheme
 */
export default function generateScheme({
  baseColor = '#F26724',
  darkBaseColor = '#be450b',
  lightBaseColor = '#fcdccc',

  /* light */
  backgroundColor = '#ffffff',
  textIcons = '#ffffff',

  primaryText = '#000000',
  secondaryText = '#666666',
  descriptionText = '#222222',
  dividerColor = '#dddddd',
  disabledColor = '#999999',

  infoColor = '#ffe5a7',
  errorColor = '#bf1515',
  destructiveColor = '#FF0000',
  successColor = '#04d97e',
  notificationColor = '#43B7F1'
}) {
  const color = tinycolor(baseColor);
  const contrast = tinycolor.readability(baseColor, '#fff');
  const limit = 1.65;  // contrast before switching from light/dark text

  const accentColor = color.clone().spin(180).toString();
  const baseText = contrast < limit ? '#222222' : '#FFFFFF';

  return {
    baseColor: baseColor,
    darkBaseColor: darkBaseColor,
    lightBaseColor: lightBaseColor,
    accentColor: accentColor,

    baseText: baseText,
    backgroundColor: backgroundColor,
    textIcons: textIcons,

    primaryText: primaryText,
    secondaryText: secondaryText,
    descriptionText: descriptionText,
    dividerColor: dividerColor,
    disabledColor: disabledColor,

    infoColor: infoColor,
    errorColor: errorColor,
    destructiveColor: destructiveColor,
    successColor: successColor,
    notificationColor: notificationColor
  };
}
