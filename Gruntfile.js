module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: ['src/**/*.js'],
        options: {
            '-W030': true,
            '-W043': true,
            reporter: require('jshint-stylish')
        }
    },
    csslint: {
        strict: {
            options: {
                import: 2
            },
            src: ['src/**/*.css']
        },
        lax: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: ['src/**/*.css']
        }
    },
    concat: {
        dist: {
            src: [
                'src/init.js',
                'src/context.js',
                'src/page.js',
                'src/transition.js',
                'src/utils.js',
            ],
            dest: 'dest/output.js'
        }
    },
    uglify: {
        options: {
            screwIE8: true,
            ASCIIOnly: true,
            banner: '/*! nutjs v0.1.0 <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
        },
        /*
        my_target: {
            files: {
                'dest/output.min.js': ['dest/output.js']
            }
        }
        */
        build: {
            src:  'dest/output.js',
            dest: 'dest/output.min.js'
        }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['jshint','csslint:lax','concat','uglify']);

};
