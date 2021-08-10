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

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsFocus',
    'omnipedia-site-theme-sidebars-focus',
    sidebarsElements.getSidebarsBehaviourSelector(),
    function(context, settings) {

      $(this).on(
        'omnipediaSidebarsMenuOpen.OmnipediaSiteThemeSidebarsFocus',
      function(event) {

        if (sidebarsState.isOffCanvas() === true) {

          aiPointerFocusHide.lock();

          sidebarsElements.getSidebarsContainer().focus();

          aiPointerFocusHide.unlock();

        }

      }).on(
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsFocus',
      function(event) {

        if (sidebarsState.isOffCanvas() === true) {

          aiPointerFocusHide.lock();

          sidebarsElements.getSidebarsMenuOpen().focus();

          aiPointerFocusHide.unlock();

        }

      });

    },
    function(context, settings, trigger) {

      $(this).off([
        'omnipediaSidebarsMenuOpen.OmnipediaSiteThemeSidebarsFocus',
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsFocus',
      ].join(' '));

    }
  );

});
});
