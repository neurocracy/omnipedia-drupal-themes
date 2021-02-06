// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header
// -----------------------------------------------------------------------------

AmbientImpact.on('headroom', function(aiHeadroom, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeader', function(
  OmnipediaSiteThemeHeader, $
) {
  'use strict';

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderHeadroom',
    'omnipedia-site-theme-header-headroom',
    '.layout-container',
    function(context, settings) {
      /**
       * Elements to have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $elements = $('header[role="banner"], .region-primary-menu', context);

      for (var i = 0; i < $elements.length; i++) {
        aiHeadroom.init($elements[i]);
      }
    },
    function(context, settings, trigger) {
      /**
       * Elements to have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $elements = $('header[role="banner"], .region-primary-menu', context);

      // Destroy Headroom.js instances if found.
      for (var i = 0; i < $elements.length; i++) {
        if (
          AmbientImpact.objectPathExists('headroom.destroy', $elements[i]) &&
          typeof $elements[i].headroom.destroy === 'function'
        ) {
          $elements[i].headroom.destroy();
        }
      }
    }
  );
});
});
