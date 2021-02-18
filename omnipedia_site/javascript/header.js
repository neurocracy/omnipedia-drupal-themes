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
  var elementSelector = [
    'header[role="banner"]',
    '.region-primary-menu',
    '.search-anchor',
  ].join(',');

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
      var $elements = $(elementSelector, context);

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
       * Elements to have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $elements = $(elementSelector, context);

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
      var $searchForm = $('.omnipedia-header__search-form');

      // Bail if no search form was found.
      if ($searchForm.length === 0) {
        return;
      }

      /**
       * The search target element, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $searchTarget = $('.search-target');

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
      $('.search-target').removeClass('search-target--form-has-focus');

      $('.omnipedia-header__search-form').off([
        'focusin.OmnipediaSiteThemeHeaderFocus',
        'focusout.OmnipediaSiteThemeHeaderFocus',
      ].join(' '));
    }
  );
});
});
