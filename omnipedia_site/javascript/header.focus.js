// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header focus management
// -----------------------------------------------------------------------------

// This manages focus on the following events:
//
// - 'omnipediaSearchActive': focuses the search field.
//
// - 'omnipediaSearchInactive': if the header is in compact mode, will move
//   focus to the search anchor; if the header is not in compact mode, will
//   simply blur the search field.
//
// Additionally, a class is added for styling to the search target whenever the
// focus enters the search form and removed when focus has left it.

AmbientImpact.on([
  'OmnipediaSiteThemeHeaderElements',
  'OmnipediaSiteThemeHeaderState',
], function(headerElements, headerState, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderFocus', function(
  headerFocus, $
) {
  'use strict';

  /**
   * Search target class applied when the search form has focus.
   *
   * @type {String}
   */
  var searchTargetFormFocusClass = 'search-target--form-has-focus';

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderFocus',
    'omnipedia-site-theme-header-focus',
    headerElements.getHeaderBehaviourSelector(),
    function(context, settings) {

      $(this).on(
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderFocus',
      function(event) {

        headerElements.getSearchField().focus();

      }).on(
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderFocus',
      function(event) {

        // If the currently focused element is within the search form, focus the
        // search anchor. Note that the check for where focus is located is very
        // important, as otherwise we could steal focus from unrelated parts of
        // the page and confuse users.
        if (
          headerElements.getSearchForm().find(document.activeElement).length > 0
        ) {

          // If we're in compact mode, move focus to the search anchor.
          if (headerState.isCompact() === true) {

            headerElements.getSearchAnchor().focus();

          // Otherwise, if the search field currently has focus on a wider
          // screen, simply blur it. This should still keep the location of the
          // focus if the user is tabbing through the document.
          } else if (
            headerElements.getSearchField().is(document.activeElement)
          ) {

            headerElements.getSearchField().blur();

          }
        }

      });

      headerElements.getSearchForm()
        .on('focusin.OmnipediaSiteThemeHeaderFocus', function(event) {
          headerElements.getSearchTarget()
            .addClass(searchTargetFormFocusClass);
        })
        .on('focusout.OmnipediaSiteThemeHeaderFocus', function(event) {
          headerElements.getSearchTarget()
            .removeClass(searchTargetFormFocusClass);
        });

    },
    function(context, settings, trigger) {

      $(this).off([
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderFocus',
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderFocus',
      ].join(' '));

      headerElements.getSearchForm().off([
        'focusin.OmnipediaSiteThemeHeaderFocus',
        'focusout.OmnipediaSiteThemeHeaderFocus',
      ].join(' '));

      headerElements.getSearchTarget().removeClass(searchTargetFormFocusClass);
    }
  );

});
});
