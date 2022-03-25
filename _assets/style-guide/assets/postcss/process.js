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

/* eslint-disable */

var fs = require('fs');
var postcss = require('postcss');
var customProperties = require('postcss-custom-properties');
var extractCustomProperties = require('postcss-extract-custom-properties');
var variables = require('./variables.js');

// Directory to read CSS files from
// and output file
var dir = './build/';
var output = './build/scheme.json';

// Find all CSS files in dir
var allFiles = fs.readdirSync(dir);
var cssFiles = allFiles.filter(function(f) {
  return f.substr(-4) === '.css';
});

console.log(`\nProcessing ${cssFiles.length} CSS files...`);

// Add fallback for Custom Properties (mutates CSS)
// e.g. color: var(--base-color) => color: '#F26724'
var customPropertiesPlugin = customProperties({
  preserve: true,
  variables: variables
});

// Process each CSS file individually
// and override file with changes
var combinedCss = '';
cssFiles.forEach(function(f) {
  var fileCss = fs.readFileSync(dir + f, 'utf8');
  combinedCss += fileCss;

  postcss()
    .use(customPropertiesPlugin)
    .process(fileCss)
    .then(function(result) {
      console.log(` \x1b[32m✔ ${f}\x1b[0m`);
      fs.writeFileSync(dir + f, result);  // write file to add fallbacks
    });
});

// Extract custom property variable names
// from processed css
postcss()
  .use(extractCustomProperties)
  .process(combinedCss)
  .then(function(result) {
    var data = result.contents;
    var totalVars = Object.keys(data).length;

    // Display total variables
    console.log(`\n${totalVars} vars extracted: \n[${Object.keys(data)}]`);

    // Display warnings
    result.warnings().forEach(function(warn) {
      console.log(`\x1b[31m ${warn.text}: ${warn.node.parent.selector.toString()}: ${warn.word.toString()}\x1b[0m`);
    });

    // Write JSON string to file
    var string = JSON.stringify(data);
    fs.writeFileSync(output, string);
    console.log(` \x1b[32m✔ Saved to: ${output}\x1b[0m`);
  });
