// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header keyboard enhancements
// -----------------------------------------------------------------------------

// This adds support for the escape key so that it can close the header search
// and overlay on narrow screens.

AmbientImpact.onGlobals('ally.when.key', function() {
AmbientImpact.on([
  'OmnipediaSiteThemeHeaderElements',
  'OmnipediaSiteThemeHeaderState',
], function(headerElements, headerState, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderKeyboard', function(
  headerKeyboard, $
) {
  'use strict';

  /**
   * ally.js when key handle.
   *
   * @see https://allyjs.io/api/when/key.html
   */
  var allyWhenKeyHandle;

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderKeyboard',
    'omnipedia-site-theme-header-keyboard',
    headerElements.getHeaderBehaviourSelector(),
    function(context, settings) {

      $(this).on(
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderKeyboard',
      function(event) {

        allyWhenKeyHandle = ally.when.key({
          escape: function(event, disengage) {
            headerState.hideSearch();

            disengage();
          }
        });

      }).on(
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderKeyboard',
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
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderKeyboard',
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderKeyboard',
      ].join(' '));

    }
  );

});
});
});
