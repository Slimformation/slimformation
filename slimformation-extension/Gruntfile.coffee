module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        expand: true,
        flatten: true,
        cwd: 'app/scripts/coffee',
        src: ['*.coffee'],
        dest: 'app/scripts/js/',
        ext: '.js'
    watch:
      coffee:
        files: ['app/scripts/coffee/*.coffee']
        tasks: 'coffee'

  # load plugin tasks
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')

  # Default task(s).
  grunt.registerTask('default', ['coffee'])