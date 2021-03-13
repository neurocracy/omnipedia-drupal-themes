// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header keyboard enhancements
// -----------------------------------------------------------------------------

// This adds support for the escape key so that it can close the header search
// and overlay on narrow screens.

AmbientImpact.onGlobals('ally.when.key', function() {
AmbientImpact.on('OmnipediaSiteThemeHeaderHashFocus', function(
  OmnipediaSiteThemeHeaderHashFocus, $
) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderKeyboard', function(
  OmnipediaSiteThemeHeaderKeyboard, $
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
    '.layout-container',
    function(context, settings) {

      $(this).on(
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderKeyboard',
      function(event) {

        allyWhenKeyHandle = ally.when.key({
          escape: function(event, disengage) {
            history.back();

            disengage();
          }
        });

      }).on(
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderKeyboard',
      function(event) {

        if (
          'disengage' in allyWhenKeyHandle &&
          typeof allyWhenKeyHandle.disengage === 'function'
        ) {
          allyWhenKeyHandle.disengage();
        }

      });

    },
    function(context, settings, trigger) {

      if (
        'disengage' in allyWhenKeyHandle &&
        typeof allyWhenKeyHandle.disengage === 'function'
      ) {
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
