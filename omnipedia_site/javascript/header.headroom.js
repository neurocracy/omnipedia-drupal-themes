// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header Headroom.js functionality
// -----------------------------------------------------------------------------

// This initializes Headroom.js instances for the branding region, the primary
// menu region, and the search anchor, and handles syncing various events
// between them.

AmbientImpact.on('headroom', function(aiHeadroom, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderHeadroom', function(
  OmnipediaSiteThemeHeaderHeadroom, $
) {
  'use strict';

  /**
   * The selector to match elements to apply Headroom.js to.
   *
   * The first two should be self explanatory. The reason we also apply to
   * .search-anchor is that we need that element to also hide when the primary
   * menu region does, so that the clickable space isn't on screen but
   * invisible.
   *
   * @type {String}
   */
  var headroomElementsSelector = [
    'header[role="banner"]',
    '.region-primary-menu',
    '.search-anchor',
  ].join(',');

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
      var $elements = $(headroomElementsSelector, context);

      for (var i = 0; i < $elements.length; i++) {
        aiHeadroom.init($elements[i], {
          // The headroom component has trouble setting a correct top offset, so
          // this ensures that the top/not top classes get set when expected.
          offset: 0
        });
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
       * Elements that have Headroom.js applied, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $elements = $(headroomElementsSelector, context);

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
