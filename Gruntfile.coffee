module.exports = (grunt) ->

  # configuration
  grunt.initConfig

    # grunt sass
    sass:
      compile:
        options:
          style: 'expanded'
        files: [
          expand: true
          cwd: 'src/scss'
          src: ['**/*.scss']
          dest: 'dist/css'
          ext: '.css'
        ]

    # grunt coffee
    coffee:
      compile:
        expand: true
        cwd: 'src/coffee'
        src: ['**/*.coffee']
        dest: 'dist/js'
        ext: '.js'
        options:
          bare: true
          preserve_dirs: true
    jade:
      compile:
        options:
          client: false,
          pretty: true
        files: [
          expand: true,
          cwd: "src/jade",
          src: ["**/*.jade"],
          dest: "dist/html",
          ext: ".html"
        ]

    # grunt watch (or simply grunt)
    watch:
      html:
        files: ['**/*.html']
      sass:
        files: '<%= sass.compile.files[0].src %>'
        tasks: ['sass']
      coffee:
        files: '<%= coffee.compile.src %>'
        tasks: ['coffee']
      jade:
        files: ['<%= jade.compile.files[0].src %>'],
        tasks: ['jade']
      options:
        livereload: true
    
    uglify:
      global:
        src: 'dist/js/dropdownLayer.js',
        dest: 'dist/js/dropdownLayer.min.js'
        
    cssmin:
      minify:
        expand: true
        cwd: 'dist/css'
        src: ['*.css', '!*.min.css']
        dest: 'dist/css'
        ext: '.min.css'
        
    jshint:
      files: ['dist/js/dropdownLayer.js']
      options:
        globals:
          jQuery: true,
          console: true,
          module: true,
          document: true
          
    removelogging:
      dist:
        src: "dist/js/dropdownLayer.js",
        dest: "dist/js/dropdownLayer.js"
        

  # load plugins
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-remove-logging'

  # tasks
  grunt.registerTask 'default', ['sass', 'coffee', 'jshint', 'jade', 'watch']
  grunt.registerTask 'build', ['sass', 'coffee', 'jshint', 'jade', 'removelogging', 'uglify','cssmin']
  grunt.registerTask 'test', ['sass', 'coffee', 'jshint', 'jade']
