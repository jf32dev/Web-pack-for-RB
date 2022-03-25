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

const ReactGA = require('react-ga');

export default function initGoogleAnalytics() {
  const ga = require('../../ga.json');
  const loc = window.location.hostname;
  let analyticsCode = ga.develop;
  const appDNS = 'app.bigtincan';
  const appNextDNS = 'appnext.bigtincan';

  if (loc.includes(`${appNextDNS}.com`) || loc.includes(`${appDNS}.com`)) {
    analyticsCode = ga.us;
  } else if (loc.includes(`${appNextDNS}.com.au`) || loc.includes(`${appDNS}.com.au`)) {
    analyticsCode = ga.au;
  } else if (loc.includes(`${appNextDNS}.co.uk`) || loc.includes(`${appDNS}.co.uk`)) {
    analyticsCode = ga.uk;
  } else if (loc.includes(`${appNextDNS}.info`) || loc.includes(`${appDNS}.info`)) {
    analyticsCode = ga.preview;
  }

  ReactGA.initialize(analyticsCode);
}

export function logPageView() {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}
