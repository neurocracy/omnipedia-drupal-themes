// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars focus management
// -----------------------------------------------------------------------------

// This manages focus on the following events:
//
// - 'omnipediaSidebarsMenuOpen': focuses the sidebars container if sidebars are
//   off-canvas.
//
// - 'omnipediaSidebarsMenuClose': will move focus to the menu open control if
//   sidebars are off-canvas.

AmbientImpact.onGlobals([
  'ally.query.tabbable',
], function() {
AmbientImpact.on([
  'OmnipediaSiteThemeSidebars',
  'pointerFocusHide',
], function(sidebars, aiPointerFocusHide, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsFocus', function(
  sidebarsFocus, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsFocus',
    'omnipedia-site-theme-sidebars-focus',
    'body',
    function(context, settings) {

      $(this).on(`omnipediaSidebarsMenuOpen.${eventNamespace}`, function(
        event, instance,
      ) {

        if (instance.isOffCanvas() !== true) {
          return;
        }

        aiPointerFocusHide.lock();

        $(ally.query.tabbable({
          context:        instance.$sidebars,
          includeContext: true,
        })).first().focus();

        aiPointerFocusHide.unlock();

      }).on(`omnipediaSidebarsMenuClose.${eventNamespace}`, function(
        event, instance,
      ) {

        if (instance.isOffCanvas() !== true) {
          return;
        }

        aiPointerFocusHide.lock();

        instance.$menuOpen.focus();

        aiPointerFocusHide.unlock();

      });

    },
    function(context, settings, trigger) {

      $(this).off([
        `omnipediaSidebarsMenuOpen.${eventNamespace}`,
        `omnipediaSidebarsMenuClose.${eventNamespace}`,
      ].join(' '));

    }
  );

});
});
});
