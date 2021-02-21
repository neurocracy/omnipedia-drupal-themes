// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header hash focus
// -----------------------------------------------------------------------------

// This focuses the search field when the location hash changes to the search
// anchor's href, and moves focus back to the search anchor when the location
// hash no longer matches the href.

AmbientImpact.addComponent('OmnipediaSiteThemeHeaderHashFocus', function(
  OmnipediaSiteThemeHeaderHashFocus, $
) {
  'use strict';

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

});
