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
  'scrollBlocker',
], function(sidebarsElements, sidebarsState, aiScrollBlocker, $) {
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
  const menuClosedAnchorDisabledClass =
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
      let $overlay = $('.layout-sidebars__closed-target', context);

      /**
       * The scroll blocker instance.
       *
       * @type {scrollBlocker}
       */
      let scrollBlocker = aiScrollBlocker.create();

      $overlay.prop('scrollBlocker', scrollBlocker);

      $(this).on(
        'omnipediaSidebarsMenuOpen.OmnipediaSiteThemeSidebarsOverlay',
      function(event) {

        scrollBlocker.block($overlay);

        $overlay.one('click.OmnipediaSiteThemeSidebarsOverlay', function(
          event
        ) {
          sidebarsState.closeMenu();
        });

      }).on(
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsOverlay',
      function(event) {

        $overlay.off('click.OmnipediaSiteThemeSidebarsOverlay');

        scrollBlocker.unblock($overlay);

      });

    },
    function(context, settings, trigger) {

      /**
       * The sidebars overlay element, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      let $overlay = $('.layout-sidebars__closed-target', context);

      $overlay.off(
        'click.OmnipediaSiteThemeSidebarsOverlay'
      );

      $(this).off([
        'omnipediaSidebarsMenuOpen.OmnipediaSiteThemeSidebarsOverlay',
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsOverlay',
      ].join(' '));

      /**
       * The scroll blocker instance.
       *
       * @type {scrollBlocker}
       */
      let scrollBlocker = $overlay.prop('scrollBlocker');

      // Unblock scrolling if still blocked and destroy the scroll blocker
      // instance if isn't blocking anything.
      scrollBlocker.unblock($overlay);
      scrollBlocker.destroy();

      // Remove the scroll blocker instance.
      $overlay.removeProp('scrollBlocker');

      sidebarsElements.getSidebarsMenuClosedAnchor().removeClass(
        menuClosedAnchorDisabledClass
      );

    }
  );

});
});
