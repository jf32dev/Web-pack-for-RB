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

const supportedLocales = require('./src/helpers/supportedLocales.js');

module.exports = (grunt) => {
  // Default function
  grunt.registerTask('default', 'See Gruntfile.js for avalable tasks', () => {
    grunt.fail.fatal('No default task set, are you looking for "grunt ps" ?');
  });

  // Pull all git submodules
  grunt.registerTask('ps', ['exec:pullSubmodules']);

  // Post /static/locales/en.json to OneSky
  grunt.registerTask('postEn', ['exec:postLang:en']);

  // Get language JSON from OneSky
  // and save to /static/locales/lang.json
  // NOTE: 1. zh-tw should be saved as zh-hk
  //       2. nb should be saved as no
  grunt.registerTask('getLang', (langCode) => {
    if (!langCode || supportedLocales.indexOf(langCode) < 0) {
      grunt.log.error('Valid langCode not specified');
      grunt.log.error('Must be one of: ' + JSON.stringify(supportedLocales));
    } else {
      grunt.task.run(['exec:getLang:' + langCode]);
    }
  });

  /**
   * Tasks config
   */
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Execute shell commands
    exec: {
      postLang: {
        cmd: function(langCode) {
          return 'node _assets/translations/postFile -l ' + langCode + ' -i static/locales/' + langCode + '.json';
        }
      },
      getLang: {
        cmd: function(langCode) {
          return 'node _assets/translations/getFile -l ' + langCode + ' -o static/locales/';
        }
      },
      pullSubmodules: {
        cmd: 'git submodule foreach git pull'
      }
    },
  });

  /**
   * Plugins
   */
  grunt.loadNpmTasks('grunt-exec');  // Execute shell commands
};
