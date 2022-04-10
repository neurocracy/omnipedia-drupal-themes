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

AmbientImpact.on([
  'OmnipediaSiteThemeSidebarsElements',
  'OmnipediaSiteThemeSidebarsState',
  'pointerFocusHide',
], function(sidebarsElements, sidebarsState, aiPointerFocusHide, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsFocus', function(
  sidebarsFocus, $
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
    sidebarsElements.getSidebarsBehaviourSelector(),
    function(context, settings) {

      $(this).on(
        'omnipediaSidebarsMenuOpen.' + eventNamespace,
      function(event) {

        if (sidebarsState.isOffCanvas() === true) {

          aiPointerFocusHide.lock();

          sidebarsElements.getSidebarsContainer().focus();

          aiPointerFocusHide.unlock();

        }

      }).on('omnipediaSidebarsMenuClose.' + eventNamespace, function(event) {

        if (sidebarsState.isOffCanvas() === true) {

          aiPointerFocusHide.lock();

          sidebarsElements.getSidebarsMenuOpen().focus();

          aiPointerFocusHide.unlock();

        }

      });

    },
    function(context, settings, trigger) {

      $(this).off([
        'omnipediaSidebarsMenuOpen.'  + eventNamespace,
        'omnipediaSidebarsMenuClose.' + eventNamespace,
      ].join(' '));

    }
  );

});
});
