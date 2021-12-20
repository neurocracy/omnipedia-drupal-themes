module.exports = function(grunt, options) {

  'use strict';

  return {
    theme: {
      options: {
        map: {
          inline: false
        },
        processors: [
          require('postcss-easing-gradients'),
          require('autoprefixer'),
        ]
      },
      files: [{
        src:
          '<%= pathTemplates.extensions %>/<%= pathTemplates.stylesheets %>/**/*.css',
        ext:  '.css',
        extDot: 'last',
        expand: true,
      }]
    }
  };

};
