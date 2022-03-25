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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

const FroalaOptions = (props) => ({
  attribution: false,
  iconsTemplate: 'font_awesome',
  linkAutoPrefix: 'https://',
  linkList: false,
  linkInsertButtons: [],
  linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
  linkConvertEmailAddress: true,
  imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
  charCounterCount: false,
  codeBeautifier: true,
  codeMirror: window.CodeMirror,
  codeMirrorOptions: {
    indentWithTabs: false,
    lineNumbers: true,
    lineWrapping: true,
    mode: 'text/html',
    tabMode: 'indent',
    tabSize: 2
  },
  colorsBackground: [
    '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC',
    '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000',
    '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF',
    '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'
  ],
  colorsDefaultTab: [
    'text'
  ],
  colorsStep: 7,
  textColor: [
    '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC',
    '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000',
    '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF',
    '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'
  ],
  events: {
    'froalaEditor.initialized': props.onInit,
    'froalaEditor.focus': props.onFocus,
    'froalaEditor.blur': props.onBlur
  },
  fontFamily: {
    'Open Sans,Arial,Helvetica,sans-serif': 'Open Sans',
    'Georgia,serif': 'Georgia',
    'Impact,Charcoal,sans-serif': 'Impact',
    'Tahoma,Geneva,sans-serif': 'Tahoma',
    "'Times New Roman',Times,serif": 'Times New Roman',
    'Verdana,Geneva,sans-serif': 'Verdana'
  },
  fontFamilySelection: true,
  fontSize: ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36', '48', '60', '72', '96'],
  height: 300,
  heightMin: 300,
  htmlAllowComments: false,
  iframe: true,
  iframeStyle: props.editorStyle + 'body{overflow:hidden}body>p:last-child{margin:0}a.fr-anchor:before{content:\'\u2691\'; font-size: 120%;}',
  imageMaxSize: 1024 * 1024,  // 1 MB
  imageDefaultAlign: 'left',
  imageDefaultWidth: 0, //will not set any width
  imageResizeWithPercent: true,
  imageStyles: {
    rounded: 'Rounded',
    bordered: 'Bordered'
  },
  key: 'Ig1A7vB2C1B2B2F2A3mEZXQUVJe1EZb1IWIAUKLJZMBQuF2C1G1I1A10C1E7A1F6C4==',
  language: 'en_us',
  linkAlwaysBlank: true,
  linkStyles: {
    blue: 'Blue',
    red: 'Red'
  },
  linkText: true,
  paragraphFormat: {
    N: 'Normal',
    H1: 'Heading 1',
    H2: 'Heading 2',
    H3: 'Heading 3',
    H4: 'Heading 4',
    PRE: 'Code'
  },
  placeholderText: props.placeholder,
  shortcutsEnabled: ['show', 'bold', 'italic', 'underline', 'strikeThrough', 'indent', 'outdent', 'undo', 'redo', 'insertImage', 'createLink'],
  tableColors: [
    '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC',
    '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000',
    '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF',
    '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'
  ],
  tableEditButtons: [
    'tableHeader',
    'tableRemove',
    '|',
    'tableRows',
    'tableColumns',
    'tableStyle',
    '-',
    'tableCells',
    'tableCellBackground',
    'tableCellVerticalAlign',
    'tableCellHorizontalAlign',
    'tableCellStyle'
  ],
  theme: 'btc',
  toolbarSticky: false,

  toolbarButtons: {
    moreText: {
      buttons: [[
        'fontFamily',
        'fontSize',
        'textColor',
        'bold',
        'italic',
        'underline',
        '|'
      ]],
      align: 'left',
      buttonsVisible: 10
    },
    moreParagraph: {
      buttons: [[
        'paragraphFormat',
        'align',
        'formatOL',
        'formatUL',
        'outdent',
        'indent',
        '|'
      ]],
      align: 'left',
      buttonsVisible: 8
    },
    moreRich: {
      buttons: [
        'insertLink',
        'showAnchor',
        'insertImage',
        'insertTable',
        'insertHR'
      ],
      align: 'left',
      buttonsVisible: 7
    },
    moreMisc: {
      buttons: [
        'clearFormatting',
        'html',
      ],
      align: 'right',
      buttonsVisible: 3
    }
  }
});

export default FroalaOptions;
