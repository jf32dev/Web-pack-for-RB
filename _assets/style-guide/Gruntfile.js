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
 * @copyright 2010-2016 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

 module.exports = function(grunt) {
  /**
   * Register tasks
   */

  // Default function
  grunt.registerTask('default', 'See Gruntfile.js for avalable tasks', function() {
    grunt.fail.fatal('No default task set, are you looking for "grunt build" ?');
  });

  // Compile icon font
  grunt.registerTask('icons', ['exec:compileFonts']);

  grunt.registerTask('component', (ComponentName) => {
    if (ComponentName && ComponentName[0] !== ComponentName[0].toUpperCase()) {
      grunt.log.error('ComponentName must be capitalised');
      return;
    }
    grunt.task.run(['exec:newComponent:' + ComponentName]);
  });

  grunt.registerTask('container', (ComponentName) => {
    if (ComponentName && ComponentName[0] !== ComponentName[0].toUpperCase()) {
      grunt.log.error('ComponentName must be capitalised');
      return;
    }
    grunt.task.run(['exec:newContainer:' + ComponentName]);
  });

  /**
   * Tasks config
   */
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Execute shell commands
    exec: {
      compileFonts: {
        cmd: 'cd ./assets/btc-font && fontcustom compile'
      },
      newComponent: {
        cmd: function(ComponentName) {
          return './assets/scripts/new-component.sh ' + ComponentName;
        }
      },
      newContainer: {
        cmd: function(ComponentName) {
          return './assets/scripts/new-container.sh ' + ComponentName;
        }
      },
    },
  });

  /**
   * Plugins
   */
  grunt.loadNpmTasks('grunt-exec');  // Execute shell commands

}
