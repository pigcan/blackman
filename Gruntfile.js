'use strict';

module.exports = function (grunt) {
    // Project configuration.
  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    assetsPath: 'assets',
    srcPath: 'src',
    distPath: 'build',
    

    cssmin: {
      main: {
        files: [{
          expand: true,
          cwd: '<%= srcPath %>',
          src: ['*.css'],
          dest: '<%= distPath %>',
          ext: '.css'

        }]
      }
    },

    depconcat: {
      main: {
        src: ['<%= srcPath%>/<%= pkg.name %>.js'],
        dest: '<%= distPath%>/<%= pkg.name %>.debug.js'
      }
    },

    uglify: {
      main: {
        src: '<%= distPath %>/<%= pkg.name %>.debug.js',
        dest: '<%= distPath %>/<%= pkg.name %>.js'
      }
    },
    


    watch: {
      main : {
        files: ['<%= srcPath%>/<%= pkg.name %>.css','<%= srcPath%>/<%= pkg.name %>.js'],
        tasks: ['default'],
        options: {
          livereload: true,
        }
      }
    }
  });
    

  // grunt plugins
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-depconcat');
  grunt.loadNpmTasks('grunt-depcombo');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default grunt
  grunt.registerTask('default', ['copy','cssmin', 'depconcat', 'uglify', 'depcombo:debug', 'depcombo:main','watch']);

};