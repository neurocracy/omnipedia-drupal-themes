module.exports = function(grunt, options) {

  'use strict';

  // grunt-sass requires that we pass the Sass implementation in the options,
  // which we cannot do via a YAML file.
  //
  // @see https://github.com/sindresorhus/grunt-sass/issues/288
  const sass = require('sass');

  const moduleImporter = require('sass-module-importer');

  const path = require('path');

  // Make a copy of the component paths via Array.prototype.slice().
  let includePaths = options.componentPaths.slice();

  // Add the modules path as an include path so the theme Sass can reference
  // files from modules without the full relative path.
  includePaths.push(options.modulesPath);

  // Less than elegant way to include the local SassyCast.
  //
  // @see https://github.com/lucasmotta/sass-module-importer/issues/16
  //   Open issue to add support for multiple importer support. When/if this is
  //   resolved, we can add a second importer:
  //   moduleImporter({basedir: path.join(__dirname, '..')})
  includePaths.push(path.join(__dirname, '../../ambientimpact/node_modules/sassy-cast/dist'));

  return {
    theme: {
      options: {
        implementation: sass,
        // Pass the modules path to the importer so it can find any referenced
        // Node modules that the modules Sass requires.
        importer:       moduleImporter({basedir: options.modulesPath}),
        includePaths:   includePaths,
        outputStyle:    'compressed',
        sourceMap:      true
      },
      files: [{
        src:
          '<%= pathTemplates.extensions %>/<%= pathTemplates.stylesheets %>/**/*.scss',
        ext:    '.css',
        extDot: 'last',
        expand: true,
      }]
    }
  };

};
