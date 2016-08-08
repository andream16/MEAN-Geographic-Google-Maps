'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.controller', 'src/**/*.controller', 'test/**/*.controller'],
      options: {
        // options here to override JSHint defaults
        globalstrict: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          expect: true,
          it: true,
          spyOn: true,
          beforeEach: true,
          angular: true,
          inject: true,
          describe: true
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'src/geolocation.controller'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.controller'
      }
    }
  });

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-karma');
grunt.registerTask('default', ['jshint', 'karma','uglify']);
};