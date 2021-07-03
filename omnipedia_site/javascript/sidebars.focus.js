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
], function(sidebarsElements, sidebarsState, $) {
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
          sidebarsElements.getSidebarsContainer().focus();
        }

      }).on(
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsFocus',
      function(event) {

        if (sidebarsState.isOffCanvas() === true) {
          sidebarsElements.getSidebarsMenuOpen().focus();
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
