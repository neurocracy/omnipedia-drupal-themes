// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header keyboard enhancements
// -----------------------------------------------------------------------------

// This adds support for the escape key so that it can close the off-canvas
// sidebars menu on narrow screens.

AmbientImpact.onGlobals('ally.when.key', function() {
AmbientImpact.on([
  'OmnipediaSiteThemeSidebarsElements',
  'OmnipediaSiteThemeSidebarsState',
], function(sidebarsElements, sidebarsState, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsKeyboard', function(
  sidebarsKeyboard, $
) {

  'use strict';

  /**
   * ally.js when key handle.
   *
   * @see https://allyjs.io/api/when/key.html
   */
  var allyWhenKeyHandle;

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsKeyboard',
    'omnipedia-site-theme-sidebars-keyboard',
    sidebarsElements.getSidebarsBehaviourSelector(),
    function(context, settings) {

      $(this).on(
        'omnipediaSidebarsMenuOpen.OmnipediaSiteThemeSidebarsKeyboard',
      function(event) {

        allyWhenKeyHandle = ally.when.key({
          escape: function(event, disengage) {
            sidebarsState.closeMenu();

            disengage();
          }
        });

      }).on(
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsKeyboard',
      function(event) {

        if (AmbientImpact.objectPathExists('disengage', allyWhenKeyHandle)) {
          allyWhenKeyHandle.disengage();
        }

      });

    },
    function(context, settings, trigger) {

      if (AmbientImpact.objectPathExists('disengage', allyWhenKeyHandle)) {
        allyWhenKeyHandle.disengage();
      }

      $(this).off([
        'omnipediaSidebarsMenuOpen.OmnipediaSiteThemeSidebarsKeyboard',
        'omnipediaSidebarsMenuClose.OmnipediaSiteThemeSidebarsKeyboard',
      ].join(' '));

    }
  );

});
});
});
