// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars overlay
// -----------------------------------------------------------------------------

// This adds a one off click handler to the menu closed anchor element (which
// doubles as the overlay) when the off-canvas sidebars container is open,
// allowing a click or tap on the overlay to close the menu and overlay.
// Additionally, this marks that same element as being an active overlay for the
// purpose of preventing viewport scrolling while the overlay is open.

AmbientImpact.on([
  'OmnipediaSiteThemeSidebarsElements',
  'OmnipediaSiteThemeSidebarsState',
  'OmnipediaSiteThemeOverlayScroll',
], function(sidebarsElements, sidebarsState, overlayScroll, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsOverlay', function(
  sidebarsOverlay, $
) {

  'use strict';

  /**
   * Class applied to the sidebars menu closed anchor when disabled.
   *
   * @type {String}
   *
   * @todo This shouldn't be hard-coded here.
   */
  var menuClosedAnchorDisabledClass =
    'layout-sidebars__closed-anchor--disabled';

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsOverlay',
    'omnipedia-site-theme-sidebars-overlay',
    sidebarsElements.getSidebarsBehaviourSelector(),
    function(context, settings) {

      sidebarsElements.getSidebarsMenuClosedAnchor().addClass(
        menuClosedAnchorDisabledClass
      );

      /**
       * The sidebars overlay element, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $overlay = $('.layout-sidebars__closed-target', context);

      $(this).on(
        'omnipediaSidebarsMenuOpen.OmnipediaSiteThemeSidebarsOverlay',
      function(event) {

        overlayScroll.overlayOpened($overlay);

        $overlay.one('click.OmnipediaSiteThemeSidebarsOverlay', function(
          event
        ) {
          sidebarsState.closeMenu();
        });

      }).on(
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsOverlay',
      function(event) {

        $overlay.off('click.OmnipediaSiteThemeSidebarsOverlay');

        overlayScroll.overlayClosed($overlay);

      });

    },
    function(context, settings, trigger) {

      /**
       * The sidebars overlay element, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $overlay = $('.layout-sidebars__closed-target', context);

      $overlay.off(
        'click.OmnipediaSiteThemeSidebarsOverlay'
      );

      $(this).off([
        'omnipediaSidebarsMenuOpen.OmnipediaSiteThemeSidebarsOverlay',
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsOverlay',
      ].join(' '));

      // Make sure to mark the overlay as closed in case it was opened on
      // detach.
      overlayScroll.overlayClosed($overlay);

      sidebarsElements.getSidebarsMenuClosedAnchor().removeClass(
        menuClosedAnchorDisabledClass
      );

    }
  );

});
});
