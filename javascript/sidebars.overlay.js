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
  'overlay',
], function(sidebarsElements, sidebarsState, aiOverlay, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsOverlay', function(
  sidebarsOverlay, $
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * Class applied to the sidebars menu closed anchor when disabled.
   *
   * @type {String}
   *
   * @todo This shouldn't be hard-coded here.
   */
  const menuClosedAnchorDisabledClass =
    'layout-sidebars__closed-anchor--disabled';

  /**
   * Class applied to the close element when the JavaScript overlay is present.
   *
   * @type {String}
   */
  const hasOverlayClass = 'layout-sidebars__closed-target--has-overlay';

  /**
   * Class applied to the overlay element for CSS.
   *
   * @type {String}
   */
  const overlayClass = 'overlay--layout-sidebars';

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsOverlay',
    'omnipedia-site-theme-sidebars-overlay',
    sidebarsElements.getSidebarsBehaviourSelector(),
    function(context, settings) {

      sidebarsElements.getSidebarsMenuClosedAnchor().addClass(
        menuClosedAnchorDisabledClass
      );

      /**
       * The header overlay, wrapped in a jQuery object.
       *
       * @type {jQuery}
       */
      let $overlay = aiOverlay.create();

      /**
       * The overlay instance.
       *
       * @type {Object}
       */
      let overlay = $overlay.prop('aiOverlay');

      /**
       * The sidebars closed target jQuery collection.
       *
       * @type {jQuery}
       */
      let $menuClosedTarget = sidebarsElements.getSidebarsMenuClosedTarget();

      // Save overlay instance to a property for the detach handler.
      $menuClosedTarget.prop('aiOverlay', overlay);

      $overlay.addClass(overlayClass).insertBefore($menuClosedTarget);

      // Add class indicating JavaScript overlay is active.
      $menuClosedTarget.addClass(hasOverlayClass);

      $overlay.on('click.' + eventNamespace, function(event) {
        sidebarsState.closeMenu();
      });

      $(this).on(
        'omnipediaSidebarsMenuOpen.' + eventNamespace,
      function(event) {

        if (!sidebarsState.isOffCanvas()) {
          return;
        }

        overlay.show();

      }).on('omnipediaSidebarsMenuClose.' + eventNamespace, function(event) {

        overlay.hide();

      });

    },
    function(context, settings, trigger) {

      $(this).off([
        'omnipediaSidebarsMenuOpen.'  + eventNamespace,
        'omnipediaSidebarsMenuClose.' + eventNamespace,
      ].join(' '));

      /**
       * The sidebars closed target jQuery collection.
       *
       * @type {jQuery}
       */
      let $menuClosedTarget = sidebarsElements.getSidebarsMenuClosedTarget();

      /**
       * The overlay instance.
       *
       * @type {Object}
       */
      let overlay = $menuClosedTarget.prop('aiOverlay');

      if (typeof overlay !== 'undefined') {

        // Attach a one-off event handler to remove the overlay element and
        // related properties/classes when the overlay has finished hiding.
        overlay.$overlay.one('overlayHidden', function(event) {

          overlay.$overlay.remove();

          $menuClosedTarget.removeProp('aiOverlay');

          $menuClosedTarget.removeClass(hasOverlayClass);

        });

        // Tell the overlay to hide itself, which will trigger the above handler
        // when complete.
        overlay.hide();

      }

      sidebarsElements.getSidebarsMenuClosedAnchor().removeClass(
        menuClosedAnchorDisabledClass
      );

    }
  );

});
});
