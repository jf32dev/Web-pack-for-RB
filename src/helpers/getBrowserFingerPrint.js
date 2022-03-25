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
 * @copyright 2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */

// Basic function to generate a murmur hash for Browser Finger print
export default function getBrowserFingerPrint() {
  const { userAgent, language, languages, platform, hardwareConcurrency, deviceMemory } = window.navigator;
  const plugins = Object.entries(window.navigator.plugins).map(([, plugin]) => plugin.name);
  const { colorDepth, availWidth, height } = window.screen;
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  const canvas = (() => {
    try {
      const canvasContext = document.createElement('canvas');
      const ctx = canvasContext.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?", 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?", 4, 17);

      const result = canvasContext.toDataURL();
      return result;
    } catch (error) {
      return error;
    }
  })();

  const data = JSON.stringify({
    userAgent,
    language,
    languages,
    platform,
    hardwareConcurrency,
    deviceMemory,
    plugins,
    colorDepth,
    availWidth,
    height,
    timezoneOffset,
    timezone,
    touchSupport,
    canvas,
  });

  const murmurhash3_32_gc = key => {
    const remainder = key.length & 3; // key.length % 4
    const bytes = key.length - remainder;
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;

    let h1;
    let h1b;
    let k1;

    for (let i = 0; i < bytes; i++) {
      k1 =
        ((key.charCodeAt(i) & 0xff)) |
        ((key.charCodeAt(i + 1) & 0xff) << 8) |
        ((key.charCodeAt(i + 1) & 0xff) << 16) |
        ((key.charCodeAt(i + 1) & 0xff) << 24);
      ++i;

      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    const i = bytes - 1;

    k1 = 0;

    switch (remainder) {
      case 3: {
        k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        break;
      }
      case 2: {
        k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        break;
      }
      case 1: {
        k1 ^= (key.charCodeAt(i) & 0xff);
        break;
      }
      default:
        break;
    }

    k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= k1;

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
  };

  const result = murmurhash3_32_gc(data);
  return result;
}
