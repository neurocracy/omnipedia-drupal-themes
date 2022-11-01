'use strict';

const autoprefixer = require('autoprefixer');
const baseThemeImporter = require(
  'ambientimpact-drupal-themes/baseThemeImporter'
);
const componentPaths = require('ambientimpact-drupal-modules/componentPaths');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');

const isDev = (process.env.NODE_ENV !== 'production');

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
    `./!(${distPath})/**/!(_)*.scss`
  ).reduce(function(entries, currentPath) {

      const parsed = path.parse(currentPath);

      entries[`${parsed.dir}/${parsed.name}`] = currentPath;

      return entries;

  }, {});

};

/**
 * Array of plug-in instances to pass to Webpack.
 *
 * @type {Array}
 */
let plugins = [
  new RemoveEmptyScriptsPlugin(),
  new MiniCssExtractPlugin(),
  // @see https://www.npmjs.com/package/favicons-webpack-plugin
  //
  // @todo Switch to using the generated manifest.webmanifest and
  //   browserconfig.xml? The paths don't seem easily customizable.
  new FaviconsWebpackPlugin({

    logo:         './images/icons/icon.png',

    // @todo Automate generating the maskable logo variant for the logoMaskable
    //   config option.
    //
    // @see https://maskable.app/

    outputPath:   './images/icons/generated',

    mode:     'webapp',
    devMode:  'webapp',

    favicons: {

      appName:      'Omnipedia',
      appShortName: 'Omnipedia',

      start_url: '/',

      // background: '#ffffff',
      // theme_color: '#c07300',

      display:  'standalone',
      // lang:     'en-CA',
      // @todo This doesn't seem to add a version query string?
      version:  '1',

      icons: {

        // We provide our own rather than have them generated.
        windows: false,

        yandex: false,

      },

    },

  }),
];

if (isDev === true) {
  plugins.push(
    new SourceMapDevToolPlugin({
      filename: '[file].map',
    })
  );
}

module.exports = {

  mode:     isDev ? 'development' : 'production',
  devtool:  isDev ? 'eval-cheap-module-source-map': false,

  entry: getGlobbedEntries,

  plugins: plugins,

  output: {

    path: path.resolve(__dirname, (outputToSourcePaths ? '.' : distPath)),

    // Be very careful with this - if outputting to the source paths, this must
    // not be true or it'll delete everything contained in the directory without
    // warning.
    clean: !outputToSourcePaths,

    // Since Webpack started out primarily for building JavaScript applications,
    // it always outputs a JS files, even if empty. We place these in a
    // temporary directory by default.
    filename: 'temp/[name].js',

    // Asset bundling/copying disabled for now.
    //
    // @see https://stackoverflow.com/questions/68737296/disable-asset-bundling-in-webpack-5#68768905
    assetModuleFilename: '[file]',

  },

  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDev,
              postcssOptions: {
                plugins: [
                  autoprefixer(),
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
              sassOptions: {
                importer: [
                  baseThemeImporter,
                ],
                includePaths: componentPaths().all,
              }
            },
          },
        ],
      },
     {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset/resource',
        // Asset bundling/copying disabled for now.
        //
        // @see https://stackoverflow.com/questions/68737296/disable-asset-bundling-in-webpack-5#68768905
        generator: {
          emit: false,
        },
      },
    ],
  }
};
