// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header form has focus
// -----------------------------------------------------------------------------

// This adds a class to the search target if the search form gains focus so that
// the site branding and other header items can be transitioned out of view.

AmbientImpact.addComponent('OmnipediaSiteThemeHeaderFormHasFocus', function(
  OmnipediaSiteThemeHeaderFormHasFocus, $
) {
  'use strict';

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderFormHasFocus',
    'omnipedia-site-theme-header-form-has-focus',
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

});
