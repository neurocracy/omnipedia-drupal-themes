import Encore from '@symfony/webpack-encore';
import { glob } from 'glob';
import * as path from 'node:path';
import { default as vendorize } from '@consensus.enterprises/pnp-vendorize';

// The remaining modules are CommonJS only. Because of this, they must be
// import()ed and destructured like so to behave similarly to ESM imports.
const { default: autoprefixer } = await import('autoprefixer');
const { default: baseThemeImporter } = await import(
  'drupal-ambientimpact-base/baseThemeImporter',
);
const { default: componentPaths } = await import(
  'drupal-ambientimpact-core/componentPaths',
);
const { default: easingGradients } = await import(
  '@neurocracy/postcss-easing-gradients',
);
const { default: FaviconsWebpackPlugin } = await import(
  'favicons-webpack-plugin',
);
const { default: RemoveEmptyScriptsPlugin } = await import(
  'webpack-remove-empty-scripts',
);

const distPath = '.webpack-dist';

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
 * points based on the provided file pattern.
 *
 * @param String filePattern
 *   A glob file pattern, relative to the current package path.
 *
 * @return {Object.<string, string>}
 *
 * @see https://www.npmjs.com/package/glob
 */
function getGlobbedEntries(filePattern) {

  /**
   * Entries to be returned.
   *
   * @type {Object.<string, string>}
   *
   * @see Encore#addEntries()
   *   Explains expected format.
   */
  let entries = {};

  const results = glob.sync(`./${filePattern}`, {
    ignore: [
      `./${distPath}/**`,
      `./${vendorize.getVendorDirName()}/**`,
    ],
  });

  for (const result of results) {

    const parsed = path.parse(result);

    // Note the leading './'
    entries[`./${parsed.dir}/${parsed.name}`] = `./${result}`;

  }

  return entries;

};

// @see https://symfony.com/doc/current/frontend/encore/installation.html#creating-the-webpack-config-js-file
if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore.setOutputPath(path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  (outputToSourcePaths ? '.' : distPath)
))

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
.addEntries(getGlobbedEntries('/**/!(_)*.scss'))

// Clean out any previously built files in case of source files being removed or
// renamed. We need to exclude the vendor directory or CSS bundled with
// libraries will get deleted.
//
// @see https://github.com/johnagan/clean-webpack-plugin
.cleanupOutputBeforeBuild([
  '**/*.css', '**/*.css.map', `!${vendorize.getVendorDirName()}/**`
])

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

// Rewrite referenced vendor font paths to vendor directory.
.configureFontRule({
  type:     'asset/resource',
  filename: function(pathData) {
    return vendorize.assetFileName(pathData);
  },
});

export default Encore.getWebpackConfig();
