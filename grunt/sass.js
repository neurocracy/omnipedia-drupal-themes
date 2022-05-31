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
  includePaths.push(path.join(
    options.baseThemePath, '../node_modules/sassy-cast/dist'
  ));

  /** @type {String} The base theme prefix. */
  const baseThemePrefix = 'base:';

  /**
   * Sass importer to resolve base theme stylesheet paths.
   *
   * @param {String} url
   *   The path to import or use.
   *
   * @param {String} prev
   *   The previously resolved path.
   *
   * @param {Function} done
   *   Callback to invoke on async completion.
   *
   * @return {Promise|null}
   *
   * @see https://github.com/sass/node-sass#importer--v200---experimental
   *   Importer callback documentation.
   */
  function baseThemeImporter(url, prev, done) {

    if (url.indexOf(baseThemePrefix) === 0) {
      return done({
        file: path.normalize(
          options.baseThemePath + '/stylesheets/' + url.substring(
            baseThemePrefix.length
          )
        )
      });
    }

    // If we didn't match, return null so that this is passed on
    return null;

  };

  return {
    theme: {
      options: {
        implementation: sass,
        importer: [
          baseThemeImporter,
          // Pass the modules path to the importer so it can find any referenced
          // Node modules that the modules Sass requires.
          moduleImporter({basedir: options.modulesPath}),
        ],
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
