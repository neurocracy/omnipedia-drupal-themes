// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header
// -----------------------------------------------------------------------------

AmbientImpact.on('headroom', function(aiHeadroom, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeader', function(
  OmnipediaSiteThemeHeader, $
) {
  'use strict';

  /**
   * The selector to match elements to apply Headroom.js to.
   *
   * The first two should be self explanatory. The reason we also apply to
   * .search-anchor is that we need that element to also hide when the primary
   * menu region does, so that the clickable space isn't on screen but
   * invisible.
   *
   * @type {String}
   */
  var headroomElementsSelector = [
    'header[role="banner"]',
    '.region-primary-menu',
    '.search-anchor',
  ].join(',');

  // This initializes Headroom.js instances for all the elements in
  // headroomElementsSelector, and handles syncing various events between them.
  this.addBehaviour(
    'OmnipediaSiteThemeHeaderHeadroom',
    'omnipedia-site-theme-header-headroom',
    '.layout-container',
    function(context, settings) {

      /**
       * Elements to have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $elements = $(headroomElementsSelector, context);

      for (var i = 0; i < $elements.length; i++) {
        aiHeadroom.init($elements[i], {
          // The headroom component has trouble setting a correct top offset, so
          // this ensures that the top/not top classes get set when expected.
          offset: 0
        });
      }

      // Synchronize pin, freeze, and unfreeze between the elements. This is
      // needed so that both elements are pinned and frozen at the same time
      // when focus is inside one of them.
      $elements
        .on('headroomPin.OmnipediaSiteThemeHeader', function(event) {
          for (var i = 0; i < $elements.length; i++) {
            $elements[i].headroom.pin();
          }
        })
        .on('headroomFreeze.OmnipediaSiteThemeHeader', function(event) {
          for (var i = 0; i < $elements.length; i++) {
            $elements[i].headroom.freeze();
          }
        })
        .on('headroomUnfreeze.OmnipediaSiteThemeHeader', function(event) {
          for (var i = 0; i < $elements.length; i++) {
            $elements[i].headroom.unfreeze();
          }
        });

    },
    function(context, settings, trigger) {

      /**
       * Elements that have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $elements = $(headroomElementsSelector, context);

      $elements.off([
        'headroomPin.OmnipediaSiteThemeHeader',
        'headroomFreeze.OmnipediaSiteThemeHeader',
        'headroomUnfreeze.OmnipediaSiteThemeHeader',
      ].join(' '));

      // Destroy Headroom.js instances if found.
      for (var i = 0; i < $elements.length; i++) {
        if (
          AmbientImpact.objectPathExists('headroom.destroy', $elements[i]) &&
          typeof $elements[i].headroom.destroy === 'function'
        ) {
          $elements[i].headroom.destroy();
        }
      }

    }
  );

  // This adds a class to the search target if the search form gains focus so
  // that the site branding and other header items can be transitioned out of
  // view.
  this.addBehaviour(
    'OmnipediaSiteThemeHeaderFocus',
    'omnipedia-site-theme-header-focus',
    '.layout-container',
    function(context, settings) {

      /**
       * The header search form, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $searchForm = $('.omnipedia-header__search-form', context);

      // Bail if no search form was found.
      if ($searchForm.length === 0) {
        return;
      }

      /**
       * The search target element, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $searchTarget = $('.search-target', context);

      // Bail in the unlikely case the search target isn't found.
      if ($searchTarget.length === 0) {
        return;
      }

      $searchForm
        .on('focusin.OmnipediaSiteThemeHeaderFocus', function(event) {
          $searchTarget.addClass('search-target--form-has-focus');
        })
        .on('focusout.OmnipediaSiteThemeHeaderFocus', function(event) {
          $searchTarget.removeClass('search-target--form-has-focus');
        });

    },
    function(context, settings, trigger) {

      $('.search-target', context).removeClass('search-target--form-has-focus');

      $('.omnipedia-header__search-form', context).off([
        'focusin.OmnipediaSiteThemeHeaderFocus',
        'focusout.OmnipediaSiteThemeHeaderFocus',
      ].join(' '));

    }
  );

  // This focuses the search field when the location hash changes to the search
  // anchor's href, and moves focus back to the search anchor when the location
  // hash no longer matches the href.
  this.addBehaviour(
    'OmnipediaSiteThemeHeaderHashFocus',
    'omnipedia-site-theme-header-hash-focus',
    '.layout-container',
    function(context, settings) {

      /**
       * The search anchor, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $searchAnchor = $('.search-anchor', context);

      // Bail if no search anchor was found.
      if ($searchAnchor.length === 0) {
        return;
      }

      /**
       * The header search form, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $searchForm = $('.omnipedia-header__search-form', context);

      // Bail if no search form was found.
      if ($searchForm.length === 0) {
        return;
      }

      /**
       * The header search field, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $searchField = $searchForm.find('.form-item-terms input', context);

      // Bail if no search field was found.
      if ($searchField.length === 0) {
        return;
      }

      /**
       * hashchange event handler to focus the search field when appropriate.
       *
       * Saving this as a property on the search form DOM object allows us to
       * unbind just this method in cases of this behaviour being applied more
       * than once on a page, since we have to bind to the global window object.
       *
       * @param {jQuery.Event} event
       *   The jQuery Event object.
       */
      $searchForm[0].OmnipediaSiteThemeHeaderHashFocus = function(event) {

        /**
         * The state of the search anchor when this handler is invoked.
         *
         * This should be a string of either:
         *
         * - 'visible': the layout is in compact mode with the anchor visible.
         *
         * - 'hidden': the layout has the sidebars beside the content column, so
         *   the anchor is hidden.
         *
         * This allows us to detect the current state of the search anchor,
         * which delegates the state to CSS, without having to hard code any
         * media queries in JavaScript.
         *
         * Note that we have to use the .trim() method to remove white-space
         * that may be present because browsers will preserve the exact
         * characters after the colon (:), and this would then never match. This
         * behaviour seems to be cross-browser and likely part of the custom
         * properties specification.
         *
         * @type {String}
         */
        var anchorState = getComputedStyle($searchAnchor[0]).getPropertyValue(
          '--omnipedia-search-anchor-state'
        ).trim();

        // If the location hash we just switched to matches the search anchor's
        // href, focus the search field.
        if (location.hash === $searchAnchor.attr('href')) {

          $searchField.focus();

          // Trigger an 'omnipediaSearchActive' event. This is primarily used by
          // the overlay.
          $searchForm.trigger('omnipediaSearchActive');

        // Otherwise, if the location hash is not the search anchor's href, and
        // the currently focused element is within the search form, focus the
        // search anchor. Note that the check for where focus is located is very
        // important, as otherwise we could steal focus from unrelated parts of
        // the page and confuse users.
        } else if ($searchForm.find(document.activeElement).length > 0) {

          // If the search anchor is visible (i.e. we're on a small screen),
          // focus it.
          if (anchorState === 'visible') {

            $searchAnchor.focus();

          // Otherwise, if the search field current has focus on a wider screen,
          // simply blur it. This should still keep the location of the focus if
          // the user is tabbing through the document.
          } else if ($searchField.is(document.activeElement)) {

            $searchField.blur();

          }

          // Trigger an 'omnipediaSearchInactive' event. This is primarily used
          // by the overlay.
          $searchForm.trigger('omnipediaSearchInactive');

        }
      };

      $(window).on(
        'hashchange.OmnipediaSiteThemeHeaderHashFocus',
        $searchForm[0].OmnipediaSiteThemeHeaderHashFocus
      );

    },
    function(context, settings, trigger) {

      /**
       * The header search form, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $searchForm = $('.omnipedia-header__search-form', context);

      // Bail if no search form was found.
      if ($searchForm.length === 0) {
        return;
      }

      $(window).off(
        'hashchange.OmnipediaSiteThemeHeaderHashFocus',
        $searchForm[0].OmnipediaSiteThemeHeaderHashFocus
      );

    }
  );

  // This adds a one off click handler to the <main> element (which the overlay
  // is generated content of) when the search field is active, allowing a click
  // or tap on the overlay to close the search field and overlay by invoking
  // history.back().
  this.addBehaviour(
    'OmnipediaSiteThemeHeaderOverlay',
    'omnipedia-site-theme-header-overlay',
    '.layout-container',
    function(context, settings) {

      /**
       * The site content <main> element, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $main = $('main[role="main"]', context);

      $(this).on(
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderOverlay',
      function(event) {

        $main.one('click.OmnipediaSiteThemeHeaderOverlay', function(event) {
          history.back();
        });

      }).on(
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderOverlay',
      function(event) {

        $main.off('click.OmnipediaSiteThemeHeaderOverlay');

      });

    },
    function(context, settings, trigger) {

      $('main[role="main"]', context).off(
        'click.OmnipediaSiteThemeHeaderOverlay'
      );

      $(this).off([
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderOverlay',
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderOverlay',
      ].join(' '));

    }
  );

});
});
