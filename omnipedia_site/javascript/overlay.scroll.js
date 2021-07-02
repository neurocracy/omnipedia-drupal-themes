// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Overlay scroll handling
// -----------------------------------------------------------------------------

// This prevents scrolling the viewport when an overlay is opened.
//
// @see https://stackoverflow.com/questions/9280258/prevent-body-scrolling-but-allow-overlay-scrolling#9280412

AmbientImpact.addComponent('OmnipediaSiteThemeOverlayScroll', function(
  headerOverlay, $
) {
  'use strict';

  /**
   * HTML class applied to the root element when at least one overlay is open.
   *
   * @type {String}
   */
  var rootElementClass = 'omnipedia-overlay-open';

  /**
   * Zero or more HTML elements which are currently active overlays.
   *
   * @type {HTMLElement[]}
   */
  var activeOverlays = [];

  /**
   * Mark and element as being an overlay that has opened.
   *
   * @param {HTMLElement|jQuery} overlay
   *   An HTML element to store as an overlay, or a jQuery collection containing
   *   one HTML element.
   */
  this.overlayOpened = function(overlay) {

    // Ensure this is a single HTML element by wrapping it in a jQuery object
    // and then getting the first index.
    overlay = $(overlay)[0];

    if (activeOverlays.indexOf(overlay) < 0) {
      activeOverlays.push(overlay);
    }

    $('html').addClass(rootElementClass);

  };

  /**
   * Mark a previously opened overlay as closed.
   *
   * @param {HTMLElement|jQuery} overlay
   *   An HTML element to store as an overlay, or a jQuery collection containing
   *   one HTML element.
   */
  this.overlayClosed = function(overlay) {

    // Ensure this is a single HTML element by wrapping it in a jQuery object
    // and then getting the first index.
    overlay = $(overlay)[0];

    /**
     * The index of the overlay element in activeOverlays.
     *
     * @type {Number}
     */
    var overlayIndex = activeOverlays.indexOf(overlay);

    // Don't do anything if the overlay element was not found in activeOverlays.
    if (overlayIndex < 0) {
      return;
    }

    // Remove the provided overlay element from activeOverlays.
    activeOverlays.splice(overlayIndex, 1);

    // If no overlays are still open, remove the HTML class from the root
    // element.
    if (activeOverlays.length === 0) {
      $('html').removeClass(rootElementClass);
    }

  };

});
