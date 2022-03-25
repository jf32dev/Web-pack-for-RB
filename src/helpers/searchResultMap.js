// Copyright 2018 BigTinCan Mobile Pty Ltd. All Rights Reserved.

function getCategory(f) {
  const ext = f.filename.split('.').pop();
  let category = 'none';
  switch (ext) {
    // app
    case 'btca':
      category = 'app';
      break;
    case 'btc':
    case 'btcd':
    case 'btcp':
      category = 'btc';
      break;
    case 'cad':
    case 'dwg':
    case 'dxf':
      category = 'cad';
      break;
    case 'kml':
    case 'kmz':
      category = 'earthviewer';
      break;
    case 'mobi':
      category = 'ebook';
      break;
    case 'epub':
      category = 'epub';
      break;
    // form - btcf
    case 'btcf':
      category = 'form';
      break;
    case 'ibooks':
      category = 'ibooks';
      break;
    case 'ipa':
      category = 'ipa';
      break;
    case 'key':
      category = 'keynote';
      break;
    case 'numbers':
      category = 'numbers';
      break;
    case 'oomph':
      category = 'oomph';
      break;
    case 'pages':
      category = 'pages';
      break;
    // project
    case 'mpp':
      category = 'project';
      break;

    // prov
    case 'prov':
      category = 'prov';
      break;

    // rtfd
    case 'rtfd':
      category = 'rtfd';
      break;

    // scrollmotion
    case 'scrollmotion':
    case 'scrollmotiontransit':
      category = 'scrollmotion';
      break;

    // twixl
    case 'twixl':
      category = 'twixl';
      break;

    case 'usdz':
      category = '3d-model';
      break;

    // vcard
    case 'vcf':
      category = 'vcard';
      break;

    case 'vdw':
    case 'vdx':
    case 'vsd':
    case 'vsdx':
    case 'vss':
    case 'vst':
    case 'vsx':
    case 'vt':
      category = 'visio';
      break;
    case 'xls':
    case 'xlsx':
      category = 'excel';
      break;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'bmp':
      category = 'image';
      break;
    case 'pdf':
      category = 'pdf';
      break;
    case 'ppt':
    case 'pptx':
      category = 'powerpoint';
      break;
    case 'doc':
    case 'docx':
      category = 'word';
      break;
    case 'rtf':
      category = 'rtf';
      break;
    case 'txt':
      category = 'txt';
      break;
    case 'csv':
      category = 'csv';
      break;
    case 'zip':
      category = 'zip';
      break;
    case 'potx':
      category = 'potx';
      break;
    default:
      category = 'none';
      break;
  }
  if (f.mimeType.indexOf('video') >= 0) {
    category = 'video';
  }
  if (f.mimeType.indexOf('image') >= 0) {
    category = 'image';
  }
  if (f.mimeType.indexOf('audio') >= 0) {
    category = 'audio';
  }
  if (f.mimeType.indexOf('html') >= 0) {
    category = 'web';
  }

  return category;
}

export function mapSearchStoryPayloadToStorySchema(story) {
  return {
    ...story,
    name: story.title,
    colour: story.defaultColour,
    thumbnail: story.coverArt ? story.coverArt.url : null,
    type: 'story',
  };
}

export function mapSearchFilePayloadToFileSchema(file) {
  return {
    ...file,
    type: 'file',
    storyId: file.story ? file.story.id : null,
    permId: file.story ? file.story.permId : null,
    thumbnail: file.coverArt ? file.coverArt.url : '',
    category: getCategory(file),
  };
}
