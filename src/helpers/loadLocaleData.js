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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import { addLocaleData } from 'react-intl';

// react-intl accepts locale without code (e.g. en-gb = en)
// These codes match those returned by the server
const locales = {
  'bg': () => require('react-intl-loader?locale=bg!../../static/locales/bg-bg.json'),
  cs: () => require('react-intl-loader?locale=cs!../../static/locales/cs.json'),
  da: () => require('react-intl-loader?locale=da!../../static/locales/da.json'),
  de: () => require('react-intl-loader?locale=de!../../static/locales/de.json'),
  en: () => require('react-intl-loader?locale=en!../../static/locales/en.json'),
  'en-gb': () => require('react-intl-loader?locale=en!../../static/locales/en-gb.json'),
  es: () => require('react-intl-loader?locale=es!../../static/locales/es.json'),
  'et': () => require('react-intl-loader?locale=et!../../static/locales/et-ee.json'),
  fi: () => require('react-intl-loader?locale=fi!../../static/locales/fi.json'),
  fr: () => require('react-intl-loader?locale=fr!../../static/locales/fr.json'),
  he: () => require('react-intl-loader?locale=he!../../static/locales/he.json'),
  hu: () => require('react-intl-loader?locale=hu!../../static/locales/hu.json'),
  hr: () => require('react-intl-loader?locale=hr!../../static/locales/hr.json'),
  it: () => require('react-intl-loader?locale=it!../../static/locales/it.json'),
  ja: () => require('react-intl-loader?locale=ja!../../static/locales/ja.json'),
  ko: () => require('react-intl-loader?locale=ko!../../static/locales/ko.json'),
  'lt': () => require('react-intl-loader?locale=lt!../../static/locales/lt-lt.json'),
  'lv': () => require('react-intl-loader?locale=lv!../../static/locales/lv-lv.json'),
  nl: () => require('react-intl-loader?locale=nl!../../static/locales/nl.json'),
  'nl-be': () => require('react-intl-loader?locale=nl!../../static/locales/nl-be.json'),
  no: () => require('react-intl-loader?locale=nb!../../static/locales/no.json'),
  pl: () => require('react-intl-loader?locale=pl!../../static/locales/pl.json'),
  'pt-br': () => require('react-intl-loader?locale=pt!../../static/locales/pt-br.json'),
  'pt-pt': () => require('react-intl-loader?locale=pt!../../static/locales/pt-pt.json'),
  ro: () => require('react-intl-loader?locale=ro!../../static/locales/ro.json'),
  ru: () => require('react-intl-loader?locale=ru!../../static/locales/ru.json'),
  sk: () => require('react-intl-loader?locale=sk!../../static/locales/sk.json'),
  sv: () => require('react-intl-loader?locale=sv!../../static/locales/sv.json'),
  sr: () => require('react-intl-loader?locale=sr!../../static/locales/sr.json'),
  th: () => require('react-intl-loader?locale=th!../../static/locales/th.json'),
  tr: () => require('react-intl-loader?locale=tr!../../static/locales/tr.json'),
  vi: () => require('react-intl-loader?locale=vi!../../static/locales/vi.json'),
  uk: () => require('react-intl-loader?locale=uk!../../static/locales/uk.json'),
  'zh-cn': () => require('react-intl-loader?locale=zh!../../static/locales/zh-cn.json'),
  'zh-hk': () => require('react-intl-loader?locale=zh!../../static/locales/zh-hk.json')
};

export default function loadLocaleData(locale) {
  let langCode = locale;
  const isLangAvailable = locales[langCode];

  if (langCode === 'no') {
    const no = require('react-intl/locale-data/no');
    addLocaleData([...no]);
  }

  // fallback to en
  if (!isLangAvailable) {
    langCode = 'en';
    console.info(`'${locale}' locale not available. Request translation?`);  // eslint-disable-line
  }

  return new Promise((resolve) => {
    locales[langCode]()(resolve);
  });
}
