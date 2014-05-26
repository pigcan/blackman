'use strict';

module.exports = function (grunt) {
    // Project configuration.
  grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    assetsPath: 'assets',
    srcPath: 'src',
    libPath: 'lib',
    distPath: 'build',
    
    copy : {
      main: {
        files: [{
          expand: true,
          cwd: './',
          src: ['package.json'],
          dest: '<%= distPath %>'
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
        files: ['<%= srcPath%>/<%= pkg.name %>.js'],
        tasks: ['default'],
        options: {
          livereload: true,
        }
      }
    }
  });
    

  // grunt plugins
  grunt.loadNpmTasks('grunt-depconcat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default grunt
  grunt.registerTask('default', ['copy', 'depconcat', 'uglify', 'watch']);

};