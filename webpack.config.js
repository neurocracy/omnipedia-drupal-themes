'use strict';

const autoprefixer = require('autoprefixer');
const baseThemeImporter = require(
  'drupal-ambientimpact-base/baseThemeImporter'
);
const componentPaths = require('drupal-ambientimpact-core/componentPaths');
const easingGradients = require('postcss-easing-gradients');
const Encore = require('@symfony/webpack-encore');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const distPath = '.webpack-dist';

/**
 * The front-end vendor directory, relative to our package.json.
 *
 * @type {String}
 */
const vendorDir = 'vendor';

/**
 * Whether to output to the paths where the source files are found.
 *
 * If this is true, compiled Sass files, source maps, etc. will be placed
 * alongside their source files. If this is false, built files will be placed in
 * the dist directory defined by distPath.
 *
 * @type {Boolean}
 */
const outputToSourcePaths = true;

/**
 * Get globbed entry points.
 *
 * This uses the 'glob' package to automagically build the array of entry
 * points, as there are a lot of them spread out over many components.
 *
 * @return {Array}
 *
 * @see https://www.npmjs.com/package/glob
 */
function getGlobbedEntries() {

  return glob.sync(
    // This specifically only searches for SCSS files that aren't partials, i.e.
    // do not start with '_'.
    `./!(${distPath}|${vendorDir})/**/!(_)*.scss`
  ).reduce(function(entries, currentPath) {

      const parsed = path.parse(currentPath);

      entries[`${parsed.dir}/${parsed.name}`] = currentPath;

      return entries;

  }, {});

};

/**
 * Webpack filename callback to place assets into a local vendor directory.
 *
 * @param {Object} pathData
 *
 * @return {String}
 *
 * @todo Can we detect if the referenced asset is coming from Yarn only put it
 *   into vendor in that case, falling back to leaving them at their default
 *   location otherwise?
 */
function vendorAssetFileName(pathData) {

  /**
   * Path parts as parsed by path.parse().
   *
   * @type {Object}
   */
  const pathParts = path.parse(pathData.module.rawRequest);

  // Note that pathData.contentHash doesn't always seem to contain a valid hash,
  // but the longer pathData.module.buildInfo.hash always seems to.
  return `${vendorDir}/${pathParts.dir}/${pathParts.name}.${
    pathData.module.buildInfo.hash
  }${pathParts.ext}`;

};

// @see https://symfony.com/doc/current/frontend/encore/installation.html#creating-the-webpack-config-js-file
if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
.setOutputPath(path.resolve(__dirname, (outputToSourcePaths ? '.' : distPath)))

// Encore will complain if the public path doesn't start with a slash.
// Unfortunately, it doesn't seem Webpack's automatic public path works here.
//
// @see https://webpack.js.org/guides/public-path/#automatic-publicpath
.setPublicPath('/')
.setManifestKeyPrefix('')

// We output multiple files.
.disableSingleRuntimeChunk()

.configureFilenames({

  // Since Webpack started out primarily for building JavaScript applications,
  // it always outputs a JS files, even if empty. We place these in a temporary
  // directory by default. Note that the 'webpack-remove-empty-scripts' plug-in
  // should prevent these being output, but if there's an error while running
  // Webpack, you'll get a nice 'temp' directory you can just delete.
  js: 'temp/[name].js',

  // Assets are left at their original locations and not hashed. The [query]
  // must be left in to ensure any query string specified in the CSS is
  // preserved.
  //
  // @see https://stackoverflow.com/questions/68737296/disable-asset-bundling-in-webpack-5#68768905
  //
  // @see https://github.com/webpack-contrib/css-loader/issues/889#issuecomment-1298907914
  assets: '[file][query]',

})
.addEntries(getGlobbedEntries())

// Clean out any previously built files in case of source files being removed or
// renamed. We need to exclude the vendor directory or CSS bundled with
// libraries will get deleted.
//
// @see https://github.com/johnagan/clean-webpack-plugin
.cleanupOutputBeforeBuild(['**/*.css', '**/*.css.map', `!${vendorDir}/**`])

.enableSourceMaps(!Encore.isProduction())

// We don't use Babel so we can probably just remove all presets to speed it up.
//
// @see https://github.com/symfony/webpack-encore/issues/154#issuecomment-361277968
.configureBabel(function(config) {
  config.presets = [];
})

// Remove any empty scripts Webpack would generate as we aren't a primarily
// JavaScript-based app and only output CSS and assets.
.addPlugin(new RemoveEmptyScriptsPlugin())

// @see https://www.npmjs.com/package/favicons-webpack-plugin
//
// @todo Switch to using the generated manifest.webmanifest and
//   browserconfig.xml? The paths don't seem easily customizable.
.addPlugin(new FaviconsWebpackPlugin({

  logo:         './images/icons/icon.png',
  logoMaskable: './images/icons/icon_maskable.png',

  outputPath:   './images/icons/generated',

  favicons: {

    appName:      'Omnipedia',
    appShortName: 'Omnipedia',

    start_url: '/',

    // background: '#ffffff',
    // theme_color: '#c07300',

    display:  'standalone',
    lang:     'en-GB',

    // @todo This doesn't seem to add a version query string?
    version:  '1',

    icons: {

      // We provide our own rather than have them generated.
      windows: false,

      yandex: false,

    },

  },

}))

.enableSassLoader(function(options) {
  options.sassOptions = {
    importer: [baseThemeImporter],
    includePaths: componentPaths().all,
  };
})
.enablePostCssLoader(function(options) {
  options.postcssOptions = {
    plugins: [
      easingGradients(),
      autoprefixer(),
    ],
  };
})
// Re-enable automatic public path for paths referenced in CSS.
//
// @see https://github.com/symfony/webpack-encore/issues/915#issuecomment-1189319882
.configureMiniCssExtractPlugin(function(config) {
  config.publicPath = 'auto';
})

// Disable the Encore image rule because we provide our own loader config.
.configureImageRule({enabled: false})

// This disables asset bundling/copying for certain asset types.
//
// @see https://stackoverflow.com/questions/68737296/disable-asset-bundling-in-webpack-5#68768905
.addLoader({
  test: /\.(png|jpe?g|gif|svg)$/i,
  type: 'asset/resource',
  generator: {
    emit: false,
  },
})

// Output referenced fonts to vendor directory.
//
// @todo Can we add a condition to only do this for fonts installed from
//   Yarn/npm? Can we add a loader rule condition to test for node_modules via
//   the second parameter to configureFontRule()?
.configureFontRule({
  type:     'asset/resource',
  filename: vendorAssetFileName,
});

module.exports = Encore.getWebpackConfig();
