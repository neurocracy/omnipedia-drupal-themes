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
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * ally.js when key handle.
   *
   * @see https://allyjs.io/api/when/key.html
   */
  let allyWhenKeyHandle;

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderKeyboard',
    'omnipedia-site-theme-header-keyboard',
    headerElements.getHeaderBehaviourSelector(),
    function(context, settings) {

      $(this).on('omnipediaSearchActive.' + eventNamespace, function(event) {

        allyWhenKeyHandle = ally.when.key({
          escape: function(event, disengage) {
            headerState.hideSearch();

            disengage();
          }
        });

      }).on('omnipediaSearchInactive.' + eventNamespace, function(event) {

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
        'omnipediaSearchActive.'    + eventNamespace,
        'omnipediaSearchInactive.'  + eventNamespace,
      ].join(' '));

    }
  );

});
});
});
