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
  'scrollBlocker',
], function(headerElements, headerState, aiScrollBlocker, $) {
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

      /**
       * The scroll blocker instance.
       *
       * @type {scrollBlocker}
       */
      let scrollBlocker = aiScrollBlocker.create();

      $main.prop('scrollBlocker', scrollBlocker);

      $(this).on(
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderOverlay',
      function(event) {

        scrollBlocker.block($main);

        $main.one('click.OmnipediaSiteThemeHeaderOverlay', function(event) {
          headerState.hideSearch();
        });

      }).on(
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderOverlay',
      function(event) {

        $main.off('click.OmnipediaSiteThemeHeaderOverlay');

        scrollBlocker.unblock($main);

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

      /**
       * The scroll blocker instance.
       *
       * @type {scrollBlocker}
       */
      let scrollBlocker = $main.prop('scrollBlocker');

      // Unblock scrolling if still blocked and destroy the scroll blocker
      // instance if isn't blocking anything.
      scrollBlocker.unblock($main);
      scrollBlocker.destroy();

      // Remove the scroll blocker instance.
      $main.removeProp('scrollBlocker');

    }
  );

});
});
