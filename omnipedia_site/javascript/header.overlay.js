// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header overlay
// -----------------------------------------------------------------------------

// This adds a one off click handler to the <main> element (which the overlay is
// generated content of) when the search field is active, allowing a click or
// tap on the overlay to close the search field and overlay. Additionally, this
// marks that same element as being an active overlay for the purpose of
// preventing viewport scrolling while the overlay is open.

AmbientImpact.on([
  'OmnipediaSiteThemeHeaderElements',
  'OmnipediaSiteThemeHeaderState',
  'OmnipediaSiteThemeOverlayScroll',
], function(headerElements, headerState, overlayScroll, $) {
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

        overlayScroll.overlayOpened($main);

        $main.one('click.OmnipediaSiteThemeHeaderOverlay', function(event) {
          headerState.hideSearch();
        });

      }).on(
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderOverlay',
      function(event) {

        $main.off('click.OmnipediaSiteThemeHeaderOverlay');

        overlayScroll.overlayClosed($main);

      });

    },
    function(context, settings, trigger) {

      /**
       * The site content <main> element, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $main = $('main[role="main"]', context);

      $main.off(
        'click.OmnipediaSiteThemeHeaderOverlay'
      );

      $(this).off([
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderOverlay',
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderOverlay',
      ].join(' '));

      // Make sure to mark the overlay as closed in case it was opened on
      // detach.
      overlayScroll.overlayClosed($main);

    }
  );

});
});
