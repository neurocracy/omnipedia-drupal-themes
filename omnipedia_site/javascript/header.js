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

      // Synchronize pin, freeze, and unfreeze between the elements. This is
      // needed so that both elements are pinned and frozen at the same time
      // when focus is inside one of them.
      $elements
        .on('headroomPin.OmnipediaSiteThemeHeader', function(event) {
          for (var i = 0; i < $elements.length; i++) {
            $elements[i].headroom.pin();
          }
        })
        .on('headroomFreeze.OmnipediaSiteThemeHeader', function(event) {
          for (var i = 0; i < $elements.length; i++) {
            $elements[i].headroom.freeze();
          }
        })
        .on('headroomUnfreeze.OmnipediaSiteThemeHeader', function(event) {
          for (var i = 0; i < $elements.length; i++) {
            $elements[i].headroom.unfreeze();
          }
        });
    },
    function(context, settings, trigger) {
      /**
       * Elements to have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $elements = $('header[role="banner"], .region-primary-menu', context);

      $elements.off([
        'headroomPin.OmnipediaSiteThemeHeader',
        'headroomFreeze.OmnipediaSiteThemeHeader',
        'headroomUnfreeze.OmnipediaSiteThemeHeader',
      ].join(' '));

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
