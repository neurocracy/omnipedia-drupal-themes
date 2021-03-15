// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header overlay
// -----------------------------------------------------------------------------

// This adds a one off click handler to the <main> element (which the overlay is
// generated content of) when the search field is active, allowing a click or
// tap on the overlay to close the search field and overlay.

AmbientImpact.on([
  'OmnipediaSiteThemeHeaderElements',
  'OmnipediaSiteThemeHeaderState',
], function(headerElements, headerState, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderOverlay', function(
  headerOverlay, $
) {
  'use strict';

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderOverlay',
    'omnipedia-site-theme-header-overlay',
    headerElements.getHeaderBehaviourSelector(),
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
          headerState.hideSearch();
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
