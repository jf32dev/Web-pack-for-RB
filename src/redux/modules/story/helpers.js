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

/* eslint-disable import/prefer-default-export */

export function parseMessage(str) {
  if (!str) {
    return '';
  }
  let fixedMessage = str;

  // Change image src http to https
  fixedMessage = fixedMessage.replace('src="http://', 'src="https://');

  // Strip everything between <html> & <body> (and <!DOCTYPE>)
  // and </body></html>
  if (fixedMessage.indexOf('<html') > -1) {
    fixedMessage = fixedMessage.replace(/(<!DOCTYPE .*>)?(\s)?<html>(\s)?<head>(\s|\S)*(<body>|<body.+?">)/g, '');
    fixedMessage = fixedMessage.replace(/<\/body>(\s)*<\/html>/g, '');
  }

  // Strip note object (iOS)
  if (fixedMessage.indexOf('<object') > -1) {
    fixedMessage = fixedMessage.replace(/<object id="btc-hub-note-attachment"(.*)\/>/g, '');
  }

  // Strip elements with onload/onerror handlers
  if (fixedMessage.indexOf('onerror') > -1 || fixedMessage.indexOf('onload') > -1) {
    fixedMessage = fixedMessage.replace(/(onerror|onload)="(.)+?"/g, '');
  }

  return fixedMessage;
}

export function getFileCategory(f) {
  // Use file extension as a backup for type
  const ext = f.name.split('.').pop();

  let category = 'none';

  // Determine file category by mimetype
  // https://bigtincan.atlassian.net/wiki/display/TES/Supported+File+Types
  switch (true) {
    // app
    case (ext === 'btca'):
      category = 'app';
      break;

    // audio
    case (f.type.indexOf('audio') > -1):
      category = 'audio';
      break;

    // btc
    case (ext === 'btc'):
    case (ext === 'btcd'):
    case (ext === 'btcp'):
      category = 'btc';
      break;

    // cad
    case (ext === 'cad'):
    case (ext === 'dwg'):
    case (ext === 'dxf'):
      category = 'cad';
      break;

    // earthviewer
    case (ext === 'kml'):
    case (ext === 'kmz'):
      category = 'earthviewer';
      break;

    // ebook
    case (ext === 'mobi'):
      category = 'ebook';
      break;

    // epub
    case (ext === 'epub'):
      category = 'epub';
      break;

    // excel
    case (ext.indexOf('xls') > -1):
    case (ext.indexOf('xlsx') > -1):
    case (f.type.indexOf('sheet') > -1):
    case (f.type.indexOf('ms-excel') > -1):
      category = 'excel';
      break;

    // form - btcf
    case (ext === 'btcf'):
      category = 'form';
      break;

    // ibook
    case (ext === 'ibook'):
      category = 'ibook';
      break;

    // image
    case (f.type.indexOf('image') > -1):
      category = 'image';
      break;

    // ipa (no longer supported)
    case (ext === 'ipa'):
      category = 'ipa';
      break;

    // keynote
    case (ext === 'key'):
      category = 'keynote';
      break;

    // numbers
    case (ext === 'numbers'):
      category = 'numbers';
      break;

    // oomph
    case (ext === 'oomph'):
      category = 'oomph';
      break;

    // pages
    case (ext === 'pages'):
      category = 'pages';
      break;

    // pdf
    case (f.type.indexOf('pdf') > -1):
      category = 'pdf';
      break;

    // powerpoint
    case (f.type.indexOf('ms-powerpoint') > -1):
    case (f.type.indexOf('presentation') > -1):
      category = 'powerpoint';
      break;

    // project
    case (ext === 'mpp'):
      category = 'project';
      break;

    // prov
    case (ext === 'prov'):
      category = 'prov';
      break;

    // rtf
    case (f.type.indexOf('application/rtf') > -1 || f.type.indexOf('text/rtf') > -1):
      category = 'rtf';
      break;

    // rtfd
    case (ext === 'rtfd'):
      category = 'rtfd';
      break;

    // scrollmotion
    case (ext === 'scrollmotion'):
      category = 'scrollmotion';
      break;

    // twixl
    case (ext === 'twixl'):
      category = 'twixl';
      break;

    // txt
    case (ext === 'txt'):
    case (f.type.indexOf('text/plain') > -1):
      category = 'txt';
      break;

    case (ext === 'usdz'):
      category = '3d-model';
      break;

    // vcard
    case (ext === 'vcf'):
      category = 'vcard';
      break;

    // video
    case (f.type.indexOf('video') > -1):
      category = 'video';
      break;

    // visio
    case (ext === 'vdw'):
    case (ext === 'vdx'):
    case (ext === 'vsd'):
    case (ext === 'vsdx'):
    case (ext === 'vss'):
    case (ext === 'vst'):
    case (ext === 'vsx'):
    case (ext === 'vt'):
      category = 'visio';
      break;

    // web
    case (f.type.indexOf('text/html') > -1):
    case (ext === 'json'):
      category = 'web';
      break;

    // word
    case (ext === 'doc'):
    case (ext === 'docx'):
    case (f.type.indexOf('document') > -1):
    case (f.type.indexOf('msword') > -1):
      category = 'word';
      break;

    // zip
    case (f.type.indexOf('rar') > -1):
    case (f.type.indexOf('7z') > -1):
    case (f.type.indexOf('zip') > -1):
    case (ext.indexOf('tar') > -1):
      category = 'zip';
      break;

    // none
    default:
      console.info('category not determined for: ', f.type, ext);  // eslint-disable-line
      break;
  }

  return category;
}

export function getFileCategoryMimeType(category) {
  switch (category) {
    case 'app':
      return 'application/btc+zip';
    case 'audio':
      return 'audio/mpeg';
    case 'btc':
      return 'application/btc+zip';
    case 'cad':
      return 'application/cad';
    case 'csv':
      return 'text/csv';
    case 'earthviewer':
      return 'application/earthviewer';
    case 'ebook':
      return 'application/ebook';
    case 'epub':
      return 'application/epub+zip';
    case 'excel':
      return 'application/vnd.ms-excel';
    case 'form':
      return 'application/form';
    case 'ibooks':
      return 'application/ibooks';
    case 'image':
      return 'image/png';
    default:
      return null;
  }
}
