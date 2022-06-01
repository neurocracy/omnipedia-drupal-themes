// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Off-canvas panel immerse
// -----------------------------------------------------------------------------

// This triggers 'immerseEnter' when an off-canvas panel opens and 'immerseExit'
// when it closes. This is primarily to hide the header on narrow screens so
// that it's not possible to interact with it until the panel is closed,
// avoiding issues with double layering overlays.

AmbientImpact.addComponent('OmnipediaSiteThemeOffcanvasImmerse', function(
  offcanvasImmerse, $
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  this.addBehaviour(
    'OmnipediaSiteThemeOffcanvasImmerse',
    'omnipedia-site-theme-offcanvas-immerse',
    '.offcanvas-panel',
    function(context, settings) {

      $(this).on('openOffcanvas.' + eventNamespace, function(event) {
        $(this).trigger('immerseEnter');

      }).on('closeOffcanvas.' + eventNamespace, function(event) {
        $(this).trigger('immerseExit');
      });

    },
    function(context, settings, trigger) {

      $(this).off([
        'openOffcanvas.'  + eventNamespace,
        'closeOffcanvas.' + eventNamespace,
      ].join(' '));

    }
  );

});
