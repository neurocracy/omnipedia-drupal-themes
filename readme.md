This contains the source files for the [Omnipedia](https://omnipedia.app/)
Drupal theme.

⚠️ ***[Why open source? / Spoiler warning](https://omnipedia.app/open-source)***

----

# Requirements

* [Drupal 10](https://www.drupal.org/download)

* PHP 8.1

* [Composer](https://getcomposer.org/)

## Drupal dependencies

Before attempting to install this, you must add the Composer repositories as
described in the installation instructions for these dependencies:

* The [`ambientimpact_base` theme](https://github.com/Ambient-Impact/drupal-ambientimpact-base).

* The [`ambientimpact_core`](https://github.com/Ambient-Impact/drupal-ambientimpact-core), [`ambientimpact_icon`](https://github.com/Ambient-Impact/drupal-ambientimpact-icon), and [`ambientimpact_ux`](https://github.com/Ambient-Impact/drupal-ambientimpact-ux) modules.

* The [`omnipedia_block`](https://github.com/neurocracy/drupal-omnipedia-block), [`omnipedia_content`](https://github.com/neurocracy/drupal-omnipedia-content), [`omnipedia_main_page`](https://github.com/neurocracy/drupal-omnipedia-main-page), and [`omnipedia_media`](https://github.com/neurocracy/drupal-omnipedia-media) modules.

## Front-end dependencies

To build front-end assets for this project, [Node.js](https://nodejs.org/) and
[Yarn](https://yarnpkg.com/) are required.

----

# Installation

## Composer

### Set up

Ensure that you have your Drupal installation set up with the correct Composer
installer types such as those provided by [the `drupal/recommended-project`
template](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates#s-drupalrecommended-project).
If you're starting from scratch, simply requiring that template and following
[the Drupal.org Composer
documentation](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates)
should get you up and running.

### Repository

In your root `composer.json`, add the following to the `"repositories"` section:

```json
"drupal/omnipedia_site_theme": {
  "type": "vcs",
  "url": "https://github.com/neurocracy/drupal-omnipedia-site-theme.git"
}
```

### Installing

Once you've completed all of the above, run `composer require
"drupal/omnipedia_site_theme:^8.0@dev"` in the root of your project to have
Composer install this and its required dependencies for you.

## Front-end assets

To build front-end assets for this project, you'll need to install
[Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/).

This package makes use of [Yarn
Workspaces](https://yarnpkg.com/features/workspaces) and references other local
workspace dependencies. In the `package.json` in the root of your Drupal
project, you'll need to add the following:

```json
"workspaces": [
  "<web directory>/themes/custom/*"
],
```

where `<web directory>` is your public Drupal directory name, `web` by default.
Once those are defined, add the following to the `"dependencies"` section of
your top-level `package.json`:

```json
"drupal-omnipedia-site-theme": "workspace:^8"
```

Then run `yarn install` and let Yarn do the rest.

### Optional: install yarn.BUILD

While not required, [yarn.BUILD](https://yarn.build/) is recommended to make
building all of the front-end assets even easier.

----

# Building front-end assets

This uses [Webpack](https://webpack.js.org/) and [Symfony Webpack
Encore](https://symfony.com/doc/current/frontend.html) to automate most of the
build process. These will have been installed for you if you followed the Yarn
installation instructions above.

If you have [yarn.BUILD](https://yarn.build/) installed, you can run:

```
yarn build
```

from the root of your Drupal site. If you want to build just this package, run:

```
yarn workspace drupal-omnipedia-site-theme run build
```

-----------------

# Breaking changes

The following major version bumps indicate breaking changes:

* 3.x - Changed Composer installer type to `drupal-custom-theme`; moved theme contents into root directory; renamed theme from `omnipedia_site` to `omnipedia_site_theme` for clarity.

* 4.x - Front-end dependencies now installed via [Yarn](https://yarnpkg.com/), removing all use of [Asset Packagist](https://asset-packagist.org/); front-end build process ported to [Webpack](https://webpack.js.org/).

* 5.x - Requires Drupal 9.5 or [Drupal 10](https://www.drupal.org/project/drupal/releases/10.0.0).

* 6.x:

  * Requires [Drupal 10](https://www.drupal.org/project/drupal/releases/10.0.0).

  * Requires [`drupal/ambientimpact_core` 2.x](https://github.com/Ambient-Impact/drupal-ambientimpact-core/tree/2.x) for Drupal 10 support.

  * Requires [`drupal/omnipedia_content` 6.x](https://github.com/neurocracy/drupal-omnipedia-content/tree/6.x) and [`drupal/omnipedia_media` 6.x](https://github.com/neurocracy/drupal-omnipedia-media/tree/6.x) for Drupal 10 support.

  * Increases minimum version of `symfony/css-selector` and `symfony/dom-crawler` to ^6.2 as that's what's supported by Drupal 10.

* 7.x:

  * Much of the front-end JavaScript has been heavily reworked and modernized as object-oriented and self-contained so that they don't reference elements or other instances outside of behaviours. This makes them more robust and allows repeated detaching and re-attaching.

* 8.x:

  * Increased [`ambientimpact_base` theme to 7.x](https://github.com/Ambient-Impact/drupal-ambientimpact-base/tree/7.x) from 6.x.

  * Increased [`drupal/ambientimpact_ux` to 2.x](https://github.com/Ambient-Impact/drupal-ambientimpact-ux/tree/2.x) from 1.x.

  * Increased [`omnipedia_content` to 7.x](https://github.com/neurocracy/drupal-omnipedia-content/tree/7.x) from 6.x.

  * Updated various stylesheets and JavaScript necessary for compatibility for the above.
